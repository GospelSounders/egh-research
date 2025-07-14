import Database from 'better-sqlite3';
import path from 'path';
import { mkdirSync, existsSync } from 'fs';
import type { Book, Paragraph, SearchHit } from '../types/index.js';

export interface DatabaseConfig {
  dbPath?: string;
  enableWAL?: boolean;
  enableFTS?: boolean;
}

export class EGWDatabase {
  private db: Database.Database;
  
  constructor(config: DatabaseConfig = {}) {
    const dbPath = config.dbPath || path.join(process.cwd(), 'data', 'egw-writings.db');
    
    console.log('Creating EGWDatabase with path:', dbPath);
    console.log('Database file exists:', existsSync(dbPath));
    
    // Ensure database directory exists only if needed
    const dbDir = path.dirname(dbPath);
    if (!existsSync(dbDir)) {
      console.log('Creating database directory:', dbDir);
      mkdirSync(dbDir, { recursive: true });
    }
    
    this.db = new Database(dbPath);
    
    // Disable foreign key constraints for now
    this.db.pragma('foreign_keys = OFF');
    
    if (config.enableWAL !== false) {
      this.db.pragma('journal_mode = WAL');
    }
    
    this.initializeSchema();
    
    if (config.enableFTS !== false) {
      this.initializeFTS();
    }
  }

  private initializeSchema() {
    // Languages table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS languages (
        code TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        direction TEXT NOT NULL DEFAULT 'ltr'
      )
    `);

    // Folders table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS folders (
        folder_id INTEGER PRIMARY KEY,
        name TEXT NOT NULL,
        add_class TEXT NOT NULL,
        nbooks INTEGER DEFAULT 0,
        naudiobooks INTEGER DEFAULT 0,
        sort_order INTEGER DEFAULT 0,
        parent_id INTEGER
      )
    `);

    // Books table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS books (
        book_id INTEGER PRIMARY KEY,
        code TEXT NOT NULL,
        lang TEXT NOT NULL,
        type TEXT NOT NULL,
        subtype TEXT,
        title TEXT NOT NULL,
        first_para TEXT,
        author TEXT NOT NULL,
        description TEXT,
        npages INTEGER,
        isbn TEXT,
        publisher TEXT,
        pub_year TEXT,
        buy_link TEXT,
        folder_id INTEGER NOT NULL,
        folder_color_group TEXT,
        cover_small TEXT,
        cover_large TEXT,
        file_mp3 TEXT,
        file_pdf TEXT,
        file_epub TEXT,
        file_mobi TEXT,
        download_url TEXT,
        last_modified TEXT,
        permission_required TEXT DEFAULT 'public',
        sort_order INTEGER DEFAULT 0,
        is_audiobook BOOLEAN DEFAULT FALSE,
        cite TEXT,
        original_book TEXT,
        translated_into TEXT, -- JSON array
        nelements INTEGER DEFAULT 0,
        downloaded_at DATETIME,
        category TEXT, -- Main category: egw, pioneer, devotional, historical, periodical, reference
        subcategory TEXT -- Subcategory within main category
      )
    `);

    // Add category columns if they don't exist (for existing databases)
    try {
      this.db.exec(`ALTER TABLE books ADD COLUMN category TEXT;`);
    } catch (error) {
      // Ignore if column already exists
    }
    
    try {
      this.db.exec(`ALTER TABLE books ADD COLUMN subcategory TEXT;`);
    } catch (error) {
      // Ignore if column already exists
    }

    // Paragraphs table
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS paragraphs (
        para_id TEXT PRIMARY KEY,
        book_id INTEGER NOT NULL,
        id_prev TEXT,
        id_next TEXT,
        refcode_1 TEXT,
        refcode_2 TEXT,
        refcode_3 TEXT,
        refcode_4 TEXT,
        refcode_short TEXT,
        refcode_long TEXT,
        element_type TEXT NOT NULL,
        element_subtype TEXT,
        content TEXT NOT NULL,
        content_plain TEXT, -- HTML stripped version for FTS
        puborder INTEGER,
        chapter_title TEXT
      )
    `);

    // Download progress tracking
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS download_progress (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_type TEXT NOT NULL, -- 'languages', 'folders', 'books', 'content'
        language_code TEXT,
        folder_id INTEGER,
        book_id INTEGER,
        total_items INTEGER,
        completed_items INTEGER DEFAULT 0,
        started_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        error_message TEXT,
        status TEXT DEFAULT 'pending' -- 'pending', 'in_progress', 'completed', 'failed'
      )
    `);

    // Create indexes
    this.db.exec(`
      CREATE INDEX IF NOT EXISTS idx_books_lang ON books(lang);
      CREATE INDEX IF NOT EXISTS idx_books_folder ON books(folder_id);
      CREATE INDEX IF NOT EXISTS idx_books_author ON books(author);
      CREATE INDEX IF NOT EXISTS idx_books_category ON books(category);
      CREATE INDEX IF NOT EXISTS idx_books_subcategory ON books(subcategory);
      CREATE INDEX IF NOT EXISTS idx_books_type ON books(type);
      CREATE INDEX IF NOT EXISTS idx_paragraphs_book ON paragraphs(book_id);
      CREATE INDEX IF NOT EXISTS idx_paragraphs_type ON paragraphs(element_type);
      CREATE INDEX IF NOT EXISTS idx_paragraphs_order ON paragraphs(book_id, puborder);
    `);
  }

  private initializeFTS() {
    // Create FTS5 virtual table for full-text search
    this.db.exec(`
      CREATE VIRTUAL TABLE IF NOT EXISTS paragraphs_fts USING fts5(
        para_id UNINDEXED,
        book_id UNINDEXED,
        title UNINDEXED,
        author UNINDEXED,
        content,
        tokenize='porter ascii'
      )
    `);

    // Trigger to keep FTS table in sync
    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS paragraphs_fts_insert AFTER INSERT ON paragraphs BEGIN
        INSERT INTO paragraphs_fts (para_id, book_id, title, author, content)
        SELECT 
          NEW.para_id,
          NEW.book_id,
          b.title,
          b.author,
          NEW.content_plain
        FROM books b WHERE b.book_id = NEW.book_id;
      END;
    `);

    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS paragraphs_fts_update AFTER UPDATE ON paragraphs BEGIN
        UPDATE paragraphs_fts SET content = NEW.content_plain WHERE para_id = NEW.para_id;
      END;
    `);

    this.db.exec(`
      CREATE TRIGGER IF NOT EXISTS paragraphs_fts_delete AFTER DELETE ON paragraphs BEGIN
        DELETE FROM paragraphs_fts WHERE para_id = OLD.para_id;
      END;
    `);
  }

  // Language operations
  insertLanguage(code: string, name: string, direction: string = 'ltr') {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO languages (code, name, direction) 
      VALUES (?, ?, ?)
    `);
    return stmt.run(code, name, direction);
  }

  getLanguages() {
    const stmt = this.db.prepare('SELECT * FROM languages ORDER BY name');
    return stmt.all();
  }

  // Book operations
  insertBook(book: Book) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO books (
        book_id, code, lang, type, subtype, title, first_para, author, description,
        npages, isbn, publisher, pub_year, buy_link, folder_id, folder_color_group,
        cover_small, cover_large, file_mp3, file_pdf, file_epub, file_mobi,
        download_url, last_modified, permission_required, sort_order, is_audiobook,
        cite, original_book, translated_into, nelements, downloaded_at, category, subcategory
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      )
    `);
    
    // Automatically categorize book based on type, folder, and author
    const { category, subcategory } = this.categorizeBook(book);
    
    return stmt.run(
      book.book_id, book.code, book.lang, book.type, book.subtype, book.title,
      book.first_para, book.author, book.description, book.npages, book.isbn,
      book.publisher, book.pub_year, book.buy_link, book.folder_id,
      book.folder_color_group, book.cover.small, book.cover.large,
      book.files.mp3, book.files.pdf, book.files.epub, book.files.mobi,
      book.download, book.last_modified, book.permission_required, book.sort,
      book.is_audiobook ? 1 : 0, book.cite, book.original_book,
      JSON.stringify(book.translated_into), book.nelements, new Date().toISOString(),
      category, subcategory
    );
  }

  // Categorize books based on egwwritings.org structure
  private categorizeBook(book: Book): { category: string; subcategory: string } {
    const author = book.author?.toLowerCase() || '';
    const title = book.title?.toLowerCase() || '';
    const type = book.type?.toLowerCase() || '';
    const code = book.code?.toLowerCase() || '';

    // Ellen G. White writings
    if (author.includes('white') || author.includes('elena')) {
      // Devotional compilations
      if (title.includes('maranatha') || title.includes('heavenly') || 
          title.includes('sons') || title.includes('daughters') ||
          title.includes('morning watch') || title.includes('devotional')) {
        return { category: 'egw', subcategory: 'devotional' };
      }
      
      // Manuscript releases
      if (title.includes('manuscript release') || code.includes('mr')) {
        return { category: 'egw', subcategory: 'manuscripts' };
      }
      
      // Letters
      if (title.includes('letter') || code.includes('lt')) {
        return { category: 'egw', subcategory: 'letters' };
      }
      
      // Testimonies
      if (title.includes('testimon') || code.includes('tt') || code.includes('1t')) {
        return { category: 'egw', subcategory: 'testimonies' };
      }
      
      // Major books
      if (title.includes('great controversy') || title.includes('desire') || 
          title.includes('patriarchs') || title.includes('acts') ||
          title.includes('prophets and kings') || title.includes('education') ||
          title.includes('ministry of healing') || title.includes('steps to christ')) {
        return { category: 'egw', subcategory: 'books' };
      }
      
      // Pamphlets
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

  getBooks(languageCode?: string, limit?: number, offset?: number, folderId?: number, category?: string, subcategory?: string) {
    let query = 'SELECT * FROM books';
    const params: any[] = [];
    const conditions: string[] = [];
    
    if (languageCode) {
      conditions.push('lang = ?');
      params.push(languageCode);
    }
    
    if (folderId) {
      conditions.push('folder_id = ?');
      params.push(folderId);
    }
    
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    
    if (subcategory) {
      conditions.push('subcategory = ?');
      params.push(subcategory);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY sort_order, title';
    
    if (limit) {
      query += ' LIMIT ?';
      params.push(limit);
      
      if (offset) {
        query += ' OFFSET ?';
        params.push(offset);
      }
    }
    
    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  getBookCount(languageCode?: string, folderId?: number, category?: string, subcategory?: string): number {
    let query = 'SELECT COUNT(*) as count FROM books';
    const params: any[] = [];
    const conditions: string[] = [];
    
    if (languageCode) {
      conditions.push('lang = ?');
      params.push(languageCode);
    }
    
    if (folderId) {
      conditions.push('folder_id = ?');
      params.push(folderId);
    }
    
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    
    if (subcategory) {
      conditions.push('subcategory = ?');
      params.push(subcategory);
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    const stmt = this.db.prepare(query);
    const result = stmt.get(...params) as { count: number };
    return result.count;
  }

  // Get books organized by categories
  getBooksByCategories(languageCode?: string) {
    let query = `
      SELECT 
        category,
        subcategory,
        COUNT(*) as count,
        GROUP_CONCAT(title, '|||') as sample_titles
      FROM books
    `;
    
    const params: any[] = [];
    
    if (languageCode) {
      query += ' WHERE lang = ?';
      params.push(languageCode);
    }
    
    query += ' GROUP BY category, subcategory ORDER BY category, subcategory';
    
    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  // Update existing books with categories (migration helper)
  updateBookCategories() {
    const books = this.db.prepare('SELECT * FROM books WHERE category IS NULL').all();
    
    for (const book of books) {
      const typedBook = book as any;
      const { category, subcategory } = this.categorizeBook(typedBook);
      
      const updateStmt = this.db.prepare(`
        UPDATE books SET category = ?, subcategory = ? WHERE book_id = ?
      `);
      
      updateStmt.run(category, subcategory, typedBook.book_id);
    }
    
    return books.length;
  }

  getBook(bookId: number) {
    const stmt = this.db.prepare('SELECT * FROM books WHERE book_id = ?');
    return stmt.get(bookId);
  }

  // Paragraph operations
  insertParagraph(paragraph: Paragraph, bookId: number, chapterTitle?: string) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO paragraphs (
        para_id, book_id, id_prev, id_next, refcode_1, refcode_2, refcode_3, refcode_4,
        refcode_short, refcode_long, element_type, element_subtype, content, 
        content_plain, puborder, chapter_title
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    // Strip HTML for plain text version
    const contentPlain = paragraph.content.replace(/<[^>]*>/g, '').trim();
    
    return stmt.run(
      paragraph.para_id, bookId, paragraph.id_prev, paragraph.id_next,
      paragraph.refcode_1, paragraph.refcode_2, paragraph.refcode_3, paragraph.refcode_4,
      paragraph.refcode_short, paragraph.refcode_long, paragraph.element_type,
      paragraph.element_subtype, paragraph.content, contentPlain, paragraph.puborder,
      chapterTitle
    );
  }

  getParagraphs(bookId: number, limit?: number, offset?: number) {
    let query = 'SELECT * FROM paragraphs WHERE book_id = ? ORDER BY puborder';
    const params: any[] = [bookId];
    
    if (limit) {
      query += ' LIMIT ?';
      params.push(limit);
      
      if (offset) {
        query += ' OFFSET ?';
        params.push(offset);
      }
    }
    
    const stmt = this.db.prepare(query);
    return stmt.all(...params);
  }

  // Search operations
  search(query: string, limit: number = 100, offset: number = 0): SearchHit[] {
    const stmt = this.db.prepare(`
      SELECT 
        p.para_id,
        p.book_id,
        b.code as pub_code,
        b.title as pub_name,
        b.author,
        p.refcode_long,
        p.refcode_short,
        b.pub_year,
        snippet(paragraphs_fts, 4, '<mark>', '</mark>', '...', 32) as snippet,
        rank as weight,
        b.folder_color_group as group,
        b.lang
      FROM paragraphs_fts pf
      JOIN paragraphs p ON pf.para_id = p.para_id
      JOIN books b ON p.book_id = b.book_id
      WHERE paragraphs_fts MATCH ?
      ORDER BY rank
      LIMIT ? OFFSET ?
    `);
    
    const results = stmt.all(query, limit, offset);
    return results.map((row: any, index: number) => ({
      index: offset + index,
      lang: row.lang,
      para_id: row.para_id,
      book_id: row.book_id,
      pub_code: row.pub_code,
      pub_name: row.pub_name,
      author: row.author,
      refcode_long: row.refcode_long,
      refcode_short: row.refcode_short,
      pub_year: row.pub_year,
      snippet: row.snippet,
      weight: row.weight,
      group: row.group
    }));
  }

  searchCount(query: string): number {
    const stmt = this.db.prepare(`
      SELECT COUNT(*) as count
      FROM paragraphs_fts
      WHERE paragraphs_fts MATCH ?
    `);
    
    const result = stmt.get(query) as { count: number };
    return result.count;
  }

  // Progress tracking
  createDownloadTask(taskType: string, languageCode?: string, folderId?: number, bookId?: number, totalItems?: number) {
    const stmt = this.db.prepare(`
      INSERT INTO download_progress (task_type, language_code, folder_id, book_id, total_items, status)
      VALUES (?, ?, ?, ?, ?, 'pending')
    `);
    
    const result = stmt.run(taskType, languageCode, folderId, bookId, totalItems);
    return result.lastInsertRowid;
  }

  updateDownloadProgress(taskId: number, completedItems: number, status?: string, errorMessage?: string) {
    const stmt = this.db.prepare(`
      UPDATE download_progress 
      SET completed_items = ?, status = COALESCE(?, status), error_message = ?, 
          completed_at = CASE WHEN ? = 'completed' THEN CURRENT_TIMESTAMP ELSE completed_at END
      WHERE id = ?
    `);
    
    return stmt.run(completedItems, status, errorMessage, status, taskId);
  }

  getDownloadProgress() {
    const stmt = this.db.prepare(`
      SELECT * FROM download_progress 
      ORDER BY started_at DESC
    `);
    return stmt.all();
  }

  /**
   * Insert a folder into the database
   */
  insertFolder(folder: { 
    folder_id: number; 
    name: string; 
    add_class: string; 
    nbooks: number; 
    naudiobooks: number; 
    sort_order: number; 
    parent_id?: number; 
  }) {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO folders (
        folder_id, name, add_class, nbooks, naudiobooks, sort_order, parent_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?)
    `);
    
    return stmt.run(
      folder.folder_id,
      folder.name,
      folder.add_class,
      folder.nbooks,
      folder.naudiobooks,
      folder.sort_order,
      folder.parent_id
    );
  }

  /**
   * Mark a book as downloaded (has content)
   */
  markBookAsDownloaded(bookId: number) {
    const stmt = this.db.prepare(`
      UPDATE books 
      SET downloaded_at = CURRENT_TIMESTAMP 
      WHERE book_id = ?
    `);
    
    return stmt.run(bookId);
  }

  // Statistics
  getStats() {
    const stats = {
      languages: this.db.prepare('SELECT COUNT(*) as count FROM languages').get() as { count: number },
      books: this.db.prepare('SELECT COUNT(*) as count FROM books').get() as { count: number },
      paragraphs: this.db.prepare('SELECT COUNT(*) as count FROM paragraphs').get() as { count: number },
      downloadedBooks: this.db.prepare('SELECT COUNT(*) as count FROM books WHERE downloaded_at IS NOT NULL').get() as { count: number }
    };

    return {
      languages: stats.languages.count,
      books: stats.books.count,
      paragraphs: stats.paragraphs.count,
      downloadedBooks: stats.downloadedBooks.count
    };
  }

  close() {
    this.db.close();
  }
}