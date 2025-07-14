/**
 * EGW API Client - Based on official Android app analysis
 * Implements the correct API endpoints and patterns used by the official app
 */

import { EGWAuthManager } from '../utils/auth.js';

export interface EGWApiConfig {
  baseUrl?: string;
  authManager?: EGWAuthManager;
  userAgent?: string;
}

export interface Language {
  code: string;
  name: string;
  direction: 'ltr' | 'rtl';
}

export interface Folder {
  folder_id: number;
  name: string;
  add_class: string;
  nbooks: number;
  naudiobooks: number;
  sort_order: number;
  parent_id?: number;
  children?: Folder[];
}

export interface Book {
  book_id: number;
  code: string;
  lang: string;
  type: string;
  subtype?: string;
  title: string;
  first_para?: string;
  author: string;
  description?: string;
  npages: number;
  isbn?: string;
  publisher?: string;
  pub_year: string;
  buy_link?: string;
  folder_id: number;
  folder_color_group?: string;
  cover: {
    small?: string;
    large?: string;
  };
  files: {
    mp3?: string;
    pdf?: string;
    epub?: string;
    mobi?: string;
  };
  download?: string; // ZIP download URL
  last_modified?: string;
  permission_required: string;
  sort_order: number;
  is_audiobook: boolean;
  cite?: string;
  original_book?: string;
  translated_into?: string[];
  nelements: number;
}

export interface TocItem {
  id: string;
  title: string;
  subtype?: string;
  level: number;
  parent_id?: string;
}

export interface Paragraph {
  para_id: string;
  id_prev?: string;
  id_next?: string;
  refcode_1?: string;
  refcode_2?: string;
  refcode_3?: string;
  refcode_4?: string;
  refcode_short?: string;
  refcode_long?: string;
  element_type: string;
  element_subtype?: string;
  content: string;
  puborder: number;
}

export class EGWApiClient {
  private baseUrl: string;
  private authManager?: EGWAuthManager;
  private userAgent: string;

  constructor(config: EGWApiConfig = {}) {
    this.baseUrl = config.baseUrl || 'https://a.egwwritings.org';
    this.authManager = config.authManager;
    this.userAgent = config.userAgent || 'EGW-MCP-Client/1.0';
  }

  private async makeRequest<T>(endpoint: string, params: Record<string, any> = {}): Promise<T> {
    const url = new URL(endpoint, this.baseUrl);
    
    // Add query parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });

    const headers: Record<string, string> = {
      'User-Agent': this.userAgent,
      'Accept': 'application/json',
    };

    // Add authentication if available
    if (this.authManager) {
      try {
        const token = await this.authManager.getValidToken();
        headers['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.warn('Failed to get auth token:', error);
      }
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  /**
   * Get all available languages
   */
  async getLanguages(): Promise<Language[]> {
    return this.makeRequest<Language[]>('/content/languages');
  }

  /**
   * Get folder structure for a specific language
   */
  async getFoldersByLanguage(languageCode: string): Promise<Folder[]> {
    return this.makeRequest<Folder[]>(`/content/languages/${languageCode}/folders`);
  }

  /**
   * Get books in a specific folder
   */
  async getBooksByFolder(folderId: number, params: {
    trans?: 'all' | string;
    limit?: number;
    offset?: number;
    page?: number;
  } = {}): Promise<Book[]> {
    return this.makeRequest<Book[]>(`/content/books/by_folder/${folderId}`, params);
  }

  /**
   * Get all books with optional filtering
   */
  async getBooks(params: {
    lang?: string;
    folder?: number;
    trans?: 'all' | string;
    limit?: number;
    offset?: number;
    page?: number;
  } = {}): Promise<Book[]> {
    return this.makeRequest<Book[]>('/content/books', params);
  }

  /**
   * Get specific book details
   */
  async getBook(bookId: number, params: {
    trans?: 'all' | string;
  } = {}): Promise<Book> {
    return this.makeRequest<Book>(`/content/books/${bookId}`, params);
  }

  /**
   * Get book table of contents
   */
  async getBookToc(bookId: number): Promise<TocItem[]> {
    return this.makeRequest<TocItem[]>(`/content/books/${bookId}/toc`);
  }

  /**
   * Get chapter content as paragraphs
   */
  async getChapterContent(bookId: number, chapterId: string, params: {
    highlight?: string;
    trans?: 'all' | string;
  } = {}): Promise<Paragraph[]> {
    return this.makeRequest<Paragraph[]>(`/content/books/${bookId}/chapter/${chapterId}`, params);
  }

  /**
   * Download book as ZIP file
   */
  async downloadBook(bookId: number): Promise<ArrayBuffer> {
    const url = new URL(`/content/books/${bookId}/download`, this.baseUrl);
    
    const headers: Record<string, string> = {
      'User-Agent': this.userAgent,
    };

    // Add authentication if available
    if (this.authManager) {
      try {
        const token = await this.authManager.getValidToken();
        headers['Authorization'] = `Bearer ${token}`;
      } catch (error) {
        console.warn('Failed to get auth token for download:', error);
      }
    }

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Book download failed: ${response.status} ${response.statusText}`);
    }

    return response.arrayBuffer();
  }

  /**
   * Search content
   */
  async search(params: {
    query: string;
    lang?: string;
    folder?: number;
    book?: number;
    highlight?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<any> {
    return this.makeRequest<any>('/search', params);
  }

  /**
   * Get search suggestions
   */
  async getSuggestions(query: string, limit: number = 10): Promise<string[]> {
    return this.makeRequest<string[]>('/suggestions', { query, limit });
  }

  /**
   * Get book cover image URL
   */
  getBookCoverUrl(bookId: number, size: 'small' | 'large' = 'small'): string {
    return `${this.baseUrl}/covers/${bookId}?size=${size}`;
  }

  /**
   * Get content mirrors
   */
  async getMirrors(): Promise<string[]> {
    return this.makeRequest<string[]>('/content/mirrors');
  }
}