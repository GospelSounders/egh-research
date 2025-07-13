/**
 * Enhanced Content Downloader - Based on official Android app patterns
 * Downloads books and content using the correct API endpoints and storage patterns
 */

import { EGWApiClient, type Book as BookNew, type Folder as FolderNew, type Language as LanguageNew, type TocItem, type Paragraph as ParagraphNew } from '../api/egw-api-client.js';
import { EGWDatabase } from '../utils/database.js';
import { type Book, type Paragraph } from '../types/index.js';
import AdmZip from 'adm-zip';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs';
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

  constructor(apiClient: EGWApiClient, database: EGWDatabase, tempDir?: string) {
    this.apiClient = apiClient;
    this.database = database;
    this.tempDir = tempDir || path.join(process.cwd(), 'temp');
    
    // Ensure temp directory exists
    if (!existsSync(this.tempDir)) {
      mkdirSync(this.tempDir, { recursive: true });
    }
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
   * Download full content for specific books
   */
  async downloadBookContent(bookId: number, onProgress?: (progress: DownloadProgress) => void): Promise<void> {
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
    onProgress?: (progress: DownloadProgress) => void;
  } = {}): Promise<void> {
    const { includeContent = false, maxBooks = 20 } = options;
    
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
        console.log('\n4️⃣ Downloading sample content...');
        const sampleBooks = books.slice(0, Math.min(maxBooks, books.length));
        
        for (let i = 0; i < sampleBooks.length; i++) {
          const book = sampleBooks[i];
          console.log(`\nDownloading content ${i + 1}/${sampleBooks.length}: ${book.title}`);
          
          try {
            await this.downloadBookContent(book.book_id, options.onProgress);
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