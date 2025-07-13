import { EGWDatabase } from '@surgbc/egw-writings-shared';
import { SearchResult, BookSummary, SearchFilters } from '@/types';

class DatabaseService {
  private db: EGWDatabase;

  constructor() {
    this.db = new EGWDatabase();
  }

  // Search functionality
  async searchWritings(
    query: string, 
    filters: Partial<SearchFilters> = {},
    limit = 20,
    offset = 0
  ): Promise<{ results: SearchResult[]; total: number }> {
    try {
      const rawResults = this.db.search(query, limit, offset);
      const total = this.db.searchCount(query);

      const results: SearchResult[] = rawResults.map((result: any, index) => ({
        id: `${result.para_id || index}`,
        title: result.refcode_short || 'Untitled',
        excerpt: this.extractExcerpt(result.snippet || result.content),
        bookTitle: result.pub_name || 'Unknown Book',
        author: result.author || 'Ellen G. White',
        reference: result.refcode_long || result.refcode_short || '',
        relevanceScore: 1 - (index / rawResults.length), // Simple relevance scoring
        highlightedText: this.highlightSearchTerms(result.snippet || result.content, query)
      }));

      return { results, total };
    } catch (error) {
      console.error('Search error:', error);
      throw new Error('Failed to search writings');
    }
  }

  // Book management
  async getBooks(language = 'en', limit = 50): Promise<BookSummary[]> {
    try {
      const books = this.db.getBooks(language).slice(0, limit);
      
      return books.map((book: any) => ({
        id: book.book_id,
        title: book.title,
        author: book.author,
        year: book.pub_year,
        pages: book.npages,
        language: book.lang,
        description: book.description || '',
        categories: this.extractCategories(book),
        downloadedContent: this.hasDownloadedContent(book.book_id)
      }));
    } catch (error) {
      console.error('Error fetching books:', error);
      throw new Error('Failed to fetch books');
    }
  }

  async getBook(bookId: number): Promise<BookSummary | null> {
    try {
      const book = this.db.getBook(bookId);
      if (!book) return null;

      const typedBook = book as any;
      return {
        id: typedBook.book_id,
        title: typedBook.title,
        author: typedBook.author,
        year: typedBook.pub_year,
        pages: typedBook.npages,
        language: typedBook.lang,
        description: typedBook.description || '',
        categories: this.extractCategories(typedBook),
        downloadedContent: this.hasDownloadedContent(typedBook.book_id)
      };
    } catch (error) {
      console.error('Error fetching book:', error);
      return null;
    }
  }

  // Content retrieval
  async getBookContent(bookId: number, limit = 50, offset = 0): Promise<any[]> {
    try {
      return this.db.getParagraphs(bookId, limit, offset);
    } catch (error) {
      console.error('Error fetching book content:', error);
      throw new Error('Failed to fetch book content');
    }
  }

  // Statistics
  getStats() {
    try {
      return this.db.getStats();
    } catch (error) {
      console.error('Error fetching stats:', error);
      return {
        languages: 0,
        books: 0,
        downloadedBooks: 0,
        paragraphs: 0
      };
    }
  }

  // Suggestions
  async getSearchSuggestions(query: string): Promise<string[]> {
    if (query.length < 2) return [];
    
    try {
      // Simple implementation - in production you might want more sophisticated suggestions
      const results = this.db.search(query, 5, 0);
      const suggestions = new Set<string>();
      
      results.forEach((result: any) => {
        const words = (result.snippet || result.content || '').toLowerCase().split(/\s+/);
        words.forEach((word: string) => {
          if (word.includes(query.toLowerCase()) && word.length > 2) {
            suggestions.add(word.replace(/[^\w]/g, ''));
          }
        });
      });
      
      return Array.from(suggestions).slice(0, 8);
    } catch (error) {
      console.error('Error getting suggestions:', error);
      return [];
    }
  }

  // Helper methods
  private extractExcerpt(text: string, maxLength = 200): string {
    if (!text) return '';
    const cleaned = text.replace(/<[^>]*>/g, '').trim();
    return cleaned.length > maxLength 
      ? cleaned.substring(0, maxLength) + '...'
      : cleaned;
  }

  private highlightSearchTerms(text: string, query: string): string {
    if (!text || !query) return text;
    
    const terms = query.toLowerCase().split(/\s+/);
    let highlighted = text;
    
    terms.forEach(term => {
      if (term.length > 2) {
        const regex = new RegExp(`(${term})`, 'gi');
        highlighted = highlighted.replace(regex, '<mark>$1</mark>');
      }
    });
    
    return highlighted;
  }

  private extractCategories(book: any): string[] {
    // Simple category extraction based on book metadata
    const categories = [];
    
    if (book.description) {
      const desc = book.description.toLowerCase();
      if (desc.includes('prophecy')) categories.push('Prophecy');
      if (desc.includes('health')) categories.push('Health');
      if (desc.includes('education')) categories.push('Education');
      if (desc.includes('gospel')) categories.push('Gospel');
      if (desc.includes('christian')) categories.push('Christian Living');
    }
    
    return categories.length > 0 ? categories : ['General'];
  }

  private hasDownloadedContent(bookId: number): boolean {
    try {
      const paragraphs = this.db.getParagraphs(bookId, 1, 0);
      return paragraphs.length > 0;
    } catch {
      return false;
    }
  }

  close() {
    this.db.close();
  }
}

// Singleton instance
let dbService: DatabaseService | null = null;

export function getDatabase(): DatabaseService {
  if (!dbService) {
    dbService = new DatabaseService();
  }
  return dbService;
}

export function closeDatabase() {
  if (dbService) {
    dbService.close();
    dbService = null;
  }
}