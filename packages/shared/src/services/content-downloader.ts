/**
 * Enhanced Content Downloader - Based on official Android app patterns
 * Downloads books and content using the correct API endpoints and storage patterns
 */

import { EGWApiClient, type Book as BookNew, type Folder as FolderNew, type Language as LanguageNew, type TocItem, type Paragraph as ParagraphNew } from '../api/egw-api-client.js';
import { EGWDatabase } from '../utils/database.js';
import { type Book, type Paragraph } from '../types/index.js';
import AdmZip from 'adm-zip';
import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from 'fs';
import path from 'path';

export interface DownloadProgress {
  taskId: number;
  taskType: 'languages' | 'folders' | 'books' | 'content';
  total: number;
  completed: number;
  currentItem?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  error?: string;
}

export interface DownloadOptions {
  languageCode?: string;
  folderId?: number;
  bookId?: number;
  includeContent?: boolean;
  maxConcurrent?: number;
  onProgress?: (progress: DownloadProgress) => void;
}

export class ContentDownloader {
  private apiClient: EGWApiClient;
  private database: EGWDatabase;
  private tempDir: string;
  private libraryDir: string;
  private zipsDir: string;

  constructor(apiClient: EGWApiClient, database: EGWDatabase, tempDir?: string) {
    this.apiClient = apiClient;
    this.database = database;
    this.tempDir = tempDir || path.join(process.cwd(), 'temp');
    this.libraryDir = path.join(process.cwd(), 'data', 'library');
    this.zipsDir = path.join(process.cwd(), 'data', 'zips');
    
    // Ensure directories exist
    [this.tempDir, this.libraryDir, this.zipsDir].forEach(dir => {
      if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Download and sync all languages
   */
  async downloadLanguages(onProgress?: (progress: DownloadProgress) => void): Promise<LanguageNew[]> {
    console.log('📌 Downloading languages from EGW API...');
    
    const taskId = Number(this.database.createDownloadTask('languages'));
    
    try {
      this.database.updateDownloadProgress(taskId, 0, 'in_progress');
      
      const languages = await this.apiClient.getLanguages();
      console.log(`Found ${languages.length} languages`);
      
      // Insert languages into database
      for (let i = 0; i < languages.length; i++) {
        const lang = languages[i];
        this.database.insertLanguage(lang.code, lang.name, lang.direction);
        
        const progress = {
          taskId,
          taskType: 'languages' as const,
          total: languages.length,
          completed: i + 1,
          currentItem: lang.name,
          status: 'in_progress' as const
        };
        
        if (onProgress) onProgress(progress);
        this.database.updateDownloadProgress(taskId, i + 1);
      }
      
      this.database.updateDownloadProgress(taskId, languages.length, 'completed');
      console.log(`✅ Successfully downloaded ${languages.length} languages`);
      
      return languages;
    } catch (error) {
      console.error('❌ Error downloading languages:', error);
      this.database.updateDownloadProgress(taskId, 0, 'failed', String(error));
      throw error;
    }
  }

  /**
   * Download folder structure for a language
   */
  async downloadFolders(languageCode: string, onProgress?: (progress: DownloadProgress) => void): Promise<FolderNew[]> {
    console.log(`📁 Downloading folder structure for language: ${languageCode}`);
    
    const taskId = Number(this.database.createDownloadTask('folders', languageCode));
    
    try {
      this.database.updateDownloadProgress(taskId, 0, 'in_progress');
      
      const folders = await this.apiClient.getFoldersByLanguage(languageCode);
      console.log(`Found ${folders.length} folders for ${languageCode}`);
      
      // Flatten and insert folders (handle nested structure)
      const allFolders = this.flattenFolders(folders);
      
      for (let i = 0; i < allFolders.length; i++) {
        const folder = allFolders[i];
        
        // Insert folder into database
        this.database.insertFolder(folder);
        
        const progress = {
          taskId,
          taskType: 'folders' as const,
          total: allFolders.length,
          completed: i + 1,
          currentItem: folder.name,
          status: 'in_progress' as const
        };
        
        if (onProgress) onProgress(progress);
        this.database.updateDownloadProgress(taskId, i + 1);
      }
      
      this.database.updateDownloadProgress(taskId, allFolders.length, 'completed');
      console.log(`✅ Successfully downloaded ${allFolders.length} folders`);
      
      return folders;
    } catch (error) {
      console.error('❌ Error downloading folders:', error);
      this.database.updateDownloadProgress(taskId, 0, 'failed', String(error));
      throw error;
    }
  }

  /**
   * Download books for specific folders
   */
  async downloadBooks(options: DownloadOptions): Promise<BookNew[]> {
    const { languageCode, folderId } = options;
    
    console.log(`📚 Downloading books for ${languageCode ? `language: ${languageCode}` : `folder: ${folderId}`}`);
    
    const taskId = Number(this.database.createDownloadTask('books', languageCode, folderId));
    
    try {
      this.database.updateDownloadProgress(taskId, 0, 'in_progress');
      
      let books: BookNew[];
      
      if (folderId) {
        // Download books for specific folder
        books = await this.apiClient.getBooksByFolder(folderId, { trans: 'all' });
      } else if (languageCode) {
        // Get all folders for language and download their books
        const folders = await this.apiClient.getFoldersByLanguage(languageCode);
        const allFolders = this.flattenFolders(folders);
        
        books = [];
        for (const folder of allFolders) {
          if (folder.nbooks > 0) {
            const folderBooks = await this.apiClient.getBooksByFolder(folder.folder_id, { trans: 'all' });
            books.push(...folderBooks);
          }
        }
      } else {
        throw new Error('Either languageCode or folderId must be provided');
      }
      
      console.log(`Found ${books.length} books to download`);
      
      // Insert books into database
      for (let i = 0; i < books.length; i++) {
        const book = books[i];
        
        try {
          // Convert from new API format to database format
          const dbBook: Book = {
            book_id: book.book_id,
            code: book.code,
            lang: book.lang,
            type: book.type,
            subtype: book.subtype || '',
            title: book.title,
            first_para: book.first_para || '',
            author: book.author,
            description: book.description || '',
            npages: book.npages,
            isbn: book.isbn || '',
            publisher: book.publisher || '',
            pub_year: book.pub_year,
            buy_link: book.buy_link || '',
            folder_id: book.folder_id,
            folder_color_group: book.folder_color_group || '',
            cover: {
              small: book.cover.small || '',
              large: book.cover.large || ''
            },
            files: {
              mp3: book.files.mp3,
              pdf: book.files.pdf || '',
              epub: book.files.epub || '',
              mobi: book.files.mobi || ''
            },
            download: book.download || '',
            last_modified: book.last_modified || '',
            permission_required: book.permission_required,
            sort: book.sort_order,
            is_audiobook: book.is_audiobook,
            cite: book.cite || '',
            original_book: book.original_book || '',
            translated_into: book.translated_into || [],
            nelements: book.nelements
          };
          
          this.database.insertBook(dbBook);
          
          const progress = {
            taskId,
            taskType: 'books' as const,
            total: books.length,
            completed: i + 1,
            currentItem: book.title,
            status: 'in_progress' as const
          };
          
          if (options.onProgress) options.onProgress(progress);
          this.database.updateDownloadProgress(taskId, i + 1);
          
          console.log(`  ✅ ${book.title} by ${book.author}`);
        } catch (error) {
          console.error(`  ❌ Error inserting book ${book.title}:`, error);
        }
      }
      
      this.database.updateDownloadProgress(taskId, books.length, 'completed');
      console.log(`✅ Successfully downloaded ${books.length} books`);
      
      return books;
    } catch (error) {
      console.error('❌ Error downloading books:', error);
      this.database.updateDownloadProgress(taskId, 0, 'failed', String(error));
      throw error;
    }
  }

  /**
   * Create filesystem directory structure mirroring database organization
   */
  private createBookDirectory(book: BookNew): string {
    const { category, subcategory } = this.categorizeBook(book);
    const bookDir = path.join(
      this.libraryDir,
      book.lang,
      category,
      subcategory,
      `${book.code}_${book.book_id}`
    );
    
    if (!existsSync(bookDir)) {
      mkdirSync(bookDir, { recursive: true });
    }
    
    return bookDir;
  }

  /**
   * Categorize book for filesystem organization (same logic as database)
   */
  private categorizeBook(book: BookNew): { category: string; subcategory: string } {
    const author = book.author?.toLowerCase() || '';
    const title = book.title?.toLowerCase() || '';
    const type = book.type?.toLowerCase() || '';
    const code = book.code?.toLowerCase() || '';

    // Ellen G. White writings
    if (author.includes('white') || author.includes('elena')) {
      if (title.includes('maranatha') || title.includes('heavenly') || 
          title.includes('sons') || title.includes('daughters') ||
          title.includes('morning watch') || title.includes('devotional')) {
        return { category: 'egw', subcategory: 'devotional' };
      }
      
      if (title.includes('manuscript release') || code.includes('mr')) {
        return { category: 'egw', subcategory: 'manuscripts' };
      }
      
      if (title.includes('letter') || code.includes('lt')) {
        return { category: 'egw', subcategory: 'letters' };
      }
      
      if (title.includes('testimon') || code.includes('tt') || code.includes('1t')) {
        return { category: 'egw', subcategory: 'testimonies' };
      }
      
      if (title.includes('great controversy') || title.includes('desire') || 
          title.includes('patriarchs') || title.includes('acts') ||
          title.includes('prophets and kings') || title.includes('education') ||
          title.includes('ministry of healing') || title.includes('steps to christ')) {
        return { category: 'egw', subcategory: 'books' };
      }
      
      if (type === 'pamphlet' || book.npages < 100) {
        return { category: 'egw', subcategory: 'pamphlets' };
      }
      
      return { category: 'egw', subcategory: 'books' };
    }

    // Pioneer authors
    const pioneers = [
      'uriah smith', 'a. t. jones', 'j. n. andrews', 'john andrews', 
      'm. l. andreasen', 'j. n. loughborough', 'alonzo jones',
      'ellet waggoner', 'stephen haskell', 'william miller',
      'joshua himes', 'hiram edson', 'joseph bates'
    ];
    
    if (pioneers.some(pioneer => author.includes(pioneer))) {
      if (type === 'periodical' || title.includes('review') || title.includes('herald')) {
        return { category: 'periodical', subcategory: 'pioneer' };
      }
      return { category: 'pioneer', subcategory: 'books' };
    }

    // Periodicals
    if (type === 'periodical' || 
        title.includes('review') || title.includes('herald') || 
        title.includes('signs') || title.includes('times') ||
        title.includes('youth') || title.includes('instructor') ||
        title.includes('advent') && title.includes('herald')) {
      return { category: 'periodical', subcategory: 'historical' };
    }

    // Reference materials
    if (type === 'bible' || type === 'dictionary' || type === 'scriptindex' || 
        type === 'topicalindex' || title.includes('concordance')) {
      return { category: 'reference', subcategory: 'biblical' };
    }

    // Historical works
    if (title.includes('history') || title.includes('origin') || 
        title.includes('movement') || title.includes('denomination') ||
        author.includes('spalding') || author.includes('knight')) {
      return { category: 'historical', subcategory: 'denominational' };
    }

    // Modern devotional works
    if (type === 'devotional' || title.includes('devotional') || 
        title.includes('daily') || title.includes('meditation')) {
      return { category: 'devotional', subcategory: 'modern' };
    }

    // Default classification
    if (type === 'book') {
      return { category: 'historical', subcategory: 'general' };
    }

    return { category: 'reference', subcategory: 'general' };
  }

  /**
   * Download book ZIP only (no extraction/parsing)
   */
  async downloadBookZipOnly(bookId: number, onProgress?: (progress: DownloadProgress) => void): Promise<string> {
    console.log(`📦 Downloading ZIP only for book ${bookId}...`);
    
    const taskId = Number(this.database.createDownloadTask('content', undefined, undefined, bookId));
    
    try {
      this.database.updateDownloadProgress(taskId, 0, 'in_progress');
      
      // Get book details first
      const book = await this.apiClient.getBook(bookId, { trans: 'all' });
      console.log(`Downloading ZIP for: ${book.title}`);
      
      if (onProgress) {
        onProgress({
          taskId,
          taskType: 'content',
          total: 2,
          completed: 0,
          currentItem: `Downloading ${book.title} ZIP`,
          status: 'in_progress'
        });
      }
      
      // Download ZIP file
      const zipData = await this.apiClient.downloadBook(bookId);
      this.database.updateDownloadProgress(taskId, 1);
      
      // Create category-based ZIP directory structure
      const { category, subcategory } = this.categorizeBook(book);
      const zipCategoryDir = path.join(this.zipsDir, category, subcategory);
      
      // Ensure ZIP category directory exists
      if (!existsSync(zipCategoryDir)) {
        mkdirSync(zipCategoryDir, { recursive: true });
      }
      
      // Save ZIP in organized folder structure
      const zipPath = path.join(zipCategoryDir, `${book.code}_${bookId}.zip`);
      
      // Save ZIP file
      writeFileSync(zipPath, Buffer.from(zipData));
      console.log(`📁 Saved ZIP: ${zipPath}`);
      
      if (onProgress) {
        onProgress({
          taskId,
          taskType: 'content',
          total: 2,
          completed: 2,
          currentItem: `Completed ${book.title}`,
          status: 'completed'
        });
      }
      
      this.database.updateDownloadProgress(taskId, 2, 'completed');
      console.log(`✅ Successfully downloaded ZIP for ${book.title}`);
      
      return zipPath;
      
    } catch (error) {
      console.error(`❌ Error downloading book ZIP:`, error);
      this.database.updateDownloadProgress(taskId, 0, 'failed', String(error));
      throw error;
    }
  }

  /**
   * Parse existing ZIP file and insert content into database
   */
  async parseExistingZip(zipPath: string, onProgress?: (progress: DownloadProgress) => void): Promise<void> {
    console.log(`🔍 Parsing existing ZIP: ${zipPath}`);
    
    // Extract book ID from ZIP filename
    const filename = path.basename(zipPath, '.zip');
    const bookIdMatch = filename.match(/_(\d+)$/);
    if (!bookIdMatch) {
      throw new Error(`Cannot extract book ID from ZIP filename: ${filename}`);
    }
    
    const bookId = parseInt(bookIdMatch[1]);
    const taskId = Number(this.database.createDownloadTask('content', undefined, undefined, bookId));
    
    try {
      this.database.updateDownloadProgress(taskId, 0, 'in_progress');
      
      // Get book details
      const book = await this.apiClient.getBook(bookId, { trans: 'all' });
      console.log(`Parsing ZIP for: ${book.title}`);
      
      if (onProgress) {
        onProgress({
          taskId,
          taskType: 'content',
          total: 2,
          completed: 0,
          currentItem: `Extracting ${book.title} ZIP`,
          status: 'in_progress'
        });
      }
      
      // Create directory structure
      const bookDir = this.createBookDirectory(book);
      
      // Extract ZIP to book directory
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(bookDir, true);
      console.log(`📂 Extracted to: ${bookDir}`);
      
      // Parse extracted content and insert into database
      await this.parseExtractedContent(bookDir, bookId, book.title);
      
      if (onProgress) {
        onProgress({
          taskId,
          taskType: 'content',
          total: 2,
          completed: 2,
          currentItem: `Completed ${book.title}`,
          status: 'completed'
        });
      }
      
      // Mark book as downloaded
      this.database.markBookAsDownloaded(bookId);
      
      this.database.updateDownloadProgress(taskId, 2, 'completed');
      console.log(`✅ Successfully parsed and extracted ${book.title}`);
      
    } catch (error) {
      console.error(`❌ Error parsing ZIP:`, error);
      this.database.updateDownloadProgress(taskId, 0, 'failed', String(error));
      throw error;
    }
  }

  /**
   * Download book as ZIP and extract to filesystem
   */
  async downloadBookZip(bookId: number, onProgress?: (progress: DownloadProgress) => void): Promise<void> {
    console.log(`📦 Downloading book ${bookId} as ZIP...`);
    
    const taskId = Number(this.database.createDownloadTask('content', undefined, undefined, bookId));
    
    try {
      this.database.updateDownloadProgress(taskId, 0, 'in_progress');
      
      // Get book details first
      const book = await this.apiClient.getBook(bookId, { trans: 'all' });
      console.log(`Downloading ZIP for: ${book.title}`);
      
      if (onProgress) {
        onProgress({
          taskId,
          taskType: 'content',
          total: 3,
          completed: 0,
          currentItem: `Downloading ${book.title} ZIP`,
          status: 'in_progress'
        });
      }
      
      // Download ZIP file
      const zipData = await this.apiClient.downloadBook(bookId);
      this.database.updateDownloadProgress(taskId, 1);
      
      // Create directory structure
      const bookDir = this.createBookDirectory(book);
      const zipPath = path.join(this.zipsDir, `${book.code}_${bookId}.zip`);
      
      // Save ZIP file
      writeFileSync(zipPath, Buffer.from(zipData));
      console.log(`📁 Saved ZIP: ${zipPath}`);
      
      if (onProgress) {
        onProgress({
          taskId,
          taskType: 'content',
          total: 3,
          completed: 1,
          currentItem: `Extracting ${book.title} ZIP`,
          status: 'in_progress'
        });
      }
      
      // Extract ZIP to book directory
      const zip = new AdmZip(zipPath);
      zip.extractAllTo(bookDir, true);
      console.log(`📂 Extracted to: ${bookDir}`);
      
      // Parse extracted content and insert into database
      await this.parseExtractedContent(bookDir, bookId, book.title);
      
      this.database.updateDownloadProgress(taskId, 2);
      
      if (onProgress) {
        onProgress({
          taskId,
          taskType: 'content',
          total: 3,
          completed: 3,
          currentItem: `Completed ${book.title}`,
          status: 'completed'
        });
      }
      
      // Mark book as downloaded
      this.database.markBookAsDownloaded(bookId);
      
      this.database.updateDownloadProgress(taskId, 3, 'completed');
      console.log(`✅ Successfully downloaded and extracted ${book.title}`);
      
    } catch (error) {
      console.error(`❌ Error downloading book ZIP:`, error);
      this.database.updateDownloadProgress(taskId, 0, 'failed', String(error));
      throw error;
    }
  }

  /**
   * Parse extracted ZIP content and insert into database
   */
  private async parseExtractedContent(bookDir: string, bookId: number, title: string): Promise<void> {
    console.log(`🔍 Parsing extracted content for: ${title}`);
    
    try {
      // Look for common file patterns in extracted ZIP
      const files = readdirSync(bookDir, { recursive: true }) as string[];
      
      // Filter for JSON files containing paragraph data
      const jsonFiles = files.filter(file => 
        file.endsWith('.json') && !file.includes('info.json')
      );
      
      console.log(`  Found ${jsonFiles.length} content files to process`);
      
      let totalParagraphs = 0;
      
      // Process each JSON file
      for (const file of jsonFiles) {
        try {
          const filePath = path.join(bookDir, file);
          const content = JSON.parse(readFileSync(filePath, 'utf8'));
          
          // Check if content is an array of paragraphs
          if (Array.isArray(content)) {
            console.log(`  📄 Processing ${content.length} paragraphs from ${file}`);
            
            for (const paragraphData of content) {
              // Convert from API format to database format
              const dbParagraph: Paragraph = {
                para_id: paragraphData.para_id,
                id_prev: paragraphData.id_prev || '',
                id_next: paragraphData.id_next || '',
                refcode_1: paragraphData.refcode_1 || '',
                refcode_2: paragraphData.refcode_2 || '',
                refcode_3: paragraphData.refcode_3 || '',
                refcode_4: paragraphData.refcode_4 || '',
                refcode_short: paragraphData.refcode_short || '',
                refcode_long: paragraphData.refcode_long || '',
                element_type: paragraphData.element_type,
                element_subtype: paragraphData.element_subtype || '',
                content: paragraphData.content,
                puborder: paragraphData.puborder,
                translations: paragraphData.translations || []
              };
              
              // Insert paragraph into database
              // Use the file name as chapter title (remove .json extension)
              const chapterTitle = path.basename(file, '.json');
              this.database.insertParagraph(dbParagraph, bookId, chapterTitle);
              totalParagraphs++;
            }
          } else {
            console.warn(`  ⚠️  ${file} does not contain paragraph array`);
          }
        } catch (error) {
          console.warn(`  ⚠️  Could not parse ${file}:`, error);
        }
      }
      
      console.log(`  ✅ Successfully inserted ${totalParagraphs} paragraphs for ${title}`);
    } catch (error) {
      console.warn(`  ⚠️  Error reading directory ${bookDir}:`, error);
    }
  }

  /**
   * Download full content for specific books (with ZIP option)
   */
  async downloadBookContent(bookId: number, useZip: boolean = false, onProgress?: (progress: DownloadProgress) => void): Promise<void> {
    if (useZip) {
      return this.downloadBookZip(bookId, onProgress);
    }
    
    // Original API-based method
    return this.downloadBookContentAPI(bookId, onProgress);
  }

  /**
   * Download full content via API (original method)
   */
  private async downloadBookContentAPI(bookId: number, onProgress?: (progress: DownloadProgress) => void): Promise<void> {
    console.log(`📄 Downloading content for book ID: ${bookId}`);
    
    const taskId = Number(this.database.createDownloadTask('content', undefined, undefined, bookId));
    
    try {
      this.database.updateDownloadProgress(taskId, 0, 'in_progress');
      
      // Get book details
      const book = await this.apiClient.getBook(bookId, { trans: 'all' });
      console.log(`Downloading content for: ${book.title}`);
      
      // Get table of contents
      const toc = await this.apiClient.getBookToc(bookId);
      console.log(`Found ${toc.length} chapters/sections`);
      
      if (onProgress) {
        onProgress({
          taskId,
          taskType: 'content',
          total: toc.length,
          completed: 0,
          currentItem: book.title,
          status: 'in_progress'
        });
      }
      
      // Download each chapter/section
      for (let i = 0; i < toc.length; i++) {
        const tocItem = toc[i];
        
        try {
          console.log(`  📖 Downloading: ${tocItem.title}`);
          
          const paragraphs = await this.apiClient.getChapterContent(bookId, tocItem.id);
          
          // Insert paragraphs into database
          for (const paragraph of paragraphs) {
            // Convert from new API format to database format
            const dbParagraph: Paragraph = {
              para_id: paragraph.para_id,
              id_prev: paragraph.id_prev,
              id_next: paragraph.id_next,
              refcode_1: paragraph.refcode_1 || '',
              refcode_2: paragraph.refcode_2 || '',
              refcode_3: paragraph.refcode_3 || '',
              refcode_4: paragraph.refcode_4 || '',
              refcode_short: paragraph.refcode_short || '',
              refcode_long: paragraph.refcode_long || '',
              element_type: paragraph.element_type,
              element_subtype: paragraph.element_subtype || '',
              content: paragraph.content,
              puborder: paragraph.puborder,
              translations: []
            };
            
            this.database.insertParagraph(dbParagraph, bookId, tocItem.title);
          }
          
          console.log(`    ✅ ${paragraphs.length} paragraphs`);
          
          if (onProgress) {
            onProgress({
              taskId,
              taskType: 'content',
              total: toc.length,
              completed: i + 1,
              currentItem: tocItem.title,
              status: 'in_progress'
            });
          }
          
          this.database.updateDownloadProgress(taskId, i + 1);
          
          // Rate limiting to be respectful to the API
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (error) {
          console.error(`    ❌ Error downloading chapter ${tocItem.title}:`, error);
          // Continue with other chapters
        }
      }
      
      // Mark book as downloaded
      this.database.markBookAsDownloaded(bookId);
      
      this.database.updateDownloadProgress(taskId, toc.length, 'completed');
      console.log(`✅ Successfully downloaded content for ${book.title}`);
      
    } catch (error) {
      console.error('❌ Error downloading book content:', error);
      this.database.updateDownloadProgress(taskId, 0, 'failed', String(error));
      throw error;
    }
  }

  /**
   * Comprehensive download - languages, folders, books, and content
   */
  async downloadAll(languageCode: string, options: {
    includeContent?: boolean;
    maxBooks?: number;
    useZip?: boolean;
    onProgress?: (progress: DownloadProgress) => void;
  } = {}): Promise<void> {
    const { includeContent = false, maxBooks = 20, useZip = false } = options;
    
    console.log(`🚀 Starting comprehensive download for ${languageCode}`);
    
    try {
      // Step 1: Download languages
      console.log('\n1️⃣ Downloading languages...');
      await this.downloadLanguages(options.onProgress);
      
      // Step 2: Download folders for language
      console.log('\n2️⃣ Downloading folders...');
      await this.downloadFolders(languageCode, options.onProgress);
      
      // Step 3: Download books
      console.log('\n3️⃣ Downloading books...');
      const books = await this.downloadBooks({
        languageCode,
        onProgress: options.onProgress
      });
      
      // Step 4: Download content for sample books
      if (includeContent && books.length > 0) {
        console.log(`\n4️⃣ Downloading sample content (${useZip ? 'ZIP method' : 'API method'})...`);
        const sampleBooks = books.slice(0, Math.min(maxBooks, books.length));
        
        for (let i = 0; i < sampleBooks.length; i++) {
          const book = sampleBooks[i];
          console.log(`\nDownloading content ${i + 1}/${sampleBooks.length}: ${book.title}`);
          
          try {
            await this.downloadBookContent(book.book_id, useZip, options.onProgress);
          } catch (error) {
            console.error(`Failed to download content for ${book.title}:`, error);
            // Continue with other books
          }
        }
      }
      
      console.log('\n🎉 Comprehensive download completed!');
      
    } catch (error) {
      console.error('❌ Comprehensive download failed:', error);
      throw error;
    }
  }

  /**
   * Helper: Flatten nested folder structure
   */
  private flattenFolders(folders: FolderNew[]): FolderNew[] {
    const result: FolderNew[] = [];
    
    const flatten = (folderList: FolderNew[]) => {
      for (const folder of folderList) {
        result.push(folder);
        if (folder.children && folder.children.length > 0) {
          flatten(folder.children);
        }
      }
    };
    
    flatten(folders);
    return result;
  }
}

// Export already handled above