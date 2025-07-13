import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';
import { EGWAuthManager } from './auth.js';

export interface Language {
  code: string;
  name: string;
  direction: string;
}

export interface Folder {
  id: number;
  name: string;
  description?: string;
  bookCount: number;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  language: string;
  folderId: number;
  status: string;
  publishedYear?: number;
  description?: string;
  coverUrl?: string;
}

export interface Chapter {
  id: number;
  title: string;
  bookId: number;
  order: number;
  paragraphCount: number;
}

export interface Paragraph {
  id: number;
  text: string;
  reference: string;
  chapterId: number;
  order: number;
  type: string;
}

export interface SearchResult {
  paragraphs: Paragraph[];
  totalCount: number;
  searchId: string;
}

export class EGWApiClient {
  private client: AxiosInstance;
  private authManager: EGWAuthManager;
  private baseUrl: string;

  constructor(authManager: EGWAuthManager, baseUrl = 'https://a.egwwritings.org') {
    this.authManager = authManager;
    this.baseUrl = baseUrl;
    
    this.client = axios.create({
      baseURL: baseUrl,
      timeout: 30000,
      headers: {
        'User-Agent': 'EGW-Research-Tool/1.0.0',
        'Content-Type': 'application/json'
      }
    });

    // Add request interceptor to include auth token
    this.client.interceptors.request.use(async (config) => {
      try {
        const token = await this.authManager.getValidToken();
        config.headers.Authorization = `Bearer ${token}`;
      } catch (error) {
        console.warn('No valid auth token available:', error);
      }
      return config;
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.error('Authentication failed. Please re-authenticate.');
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * Add delay between requests to be respectful
   */
  private async delay(ms: number = 1000): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get available languages
   */
  async getLanguages(): Promise<Language[]> {
    const response = await this.client.get('/content/languages');
    await this.delay();
    return response.data;
  }

  /**
   * Get folders for a language
   */
  async getFolders(languageCode: string): Promise<Folder[]> {
    const response = await this.client.get(`/content/languages/${languageCode}/folders`);
    await this.delay();
    return response.data;
  }

  /**
   * Get books in a folder
   */
  async getBooksByFolder(folderId: number): Promise<Book[]> {
    const response = await this.client.get(`/content/books/by_folder/${folderId}`);
    await this.delay();
    return response.data;
  }

  /**
   * Get book information
   */
  async getBook(bookId: number): Promise<Book> {
    const response = await this.client.get(`/content/books/${bookId}`);
    await this.delay();
    return response.data;
  }

  /**
   * Get book table of contents
   */
  async getBookToc(bookId: number): Promise<Chapter[]> {
    const response = await this.client.get(`/content/books/${bookId}/toc`);
    await this.delay();
    return response.data;
  }

  /**
   * Get chapter content
   */
  async getChapter(bookId: number, chapterId: number): Promise<Paragraph[]> {
    const response = await this.client.get(`/content/books/${bookId}/chapter/${chapterId}`);
    await this.delay();
    return response.data;
  }

  /**
   * Get specific paragraph
   */
  async getParagraph(bookId: number, paragraphId: number): Promise<Paragraph> {
    const response = await this.client.get(`/content/books/${bookId}/content/${paragraphId}`);
    await this.delay();
    return response.data;
  }

  /**
   * Search content
   */
  async search(query: string, options?: {
    language?: string;
    folder?: number;
    book?: number;
    limit?: number;
    offset?: number;
  }): Promise<SearchResult> {
    const params = new URLSearchParams({
      q: query,
      ...(options?.language && { lang: options.language }),
      ...(options?.folder && { folder: options.folder.toString() }),
      ...(options?.book && { book: options.book.toString() }),
      ...(options?.limit && { limit: options.limit.toString() }),
      ...(options?.offset && { offset: options.offset.toString() })
    });

    const response = await this.client.get(`/search?${params.toString()}`);
    await this.delay();
    return response.data;
  }

  /**
   * Get search suggestions
   */
  async getSearchSuggestions(query: string): Promise<string[]> {
    const response = await this.client.get(`/search/suggestions?q=${encodeURIComponent(query)}`);
    await this.delay();
    return response.data;
  }

  /**
   * Download book as ZIP
   */
  async downloadBook(bookId: number): Promise<Buffer> {
    const response = await this.client.get(`/content/books/${bookId}/download`, {
      responseType: 'arraybuffer'
    });
    await this.delay(2000); // Longer delay for downloads
    return Buffer.from(response.data);
  }

  /**
   * Get user information
   */
  async getUserInfo(): Promise<any> {
    const response = await this.client.get('/user/info/');
    await this.delay();
    return response.data;
  }

  /**
   * Test API connectivity and authentication
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getUserInfo();
      return true;
    } catch (error) {
      console.error('API connection test failed:', error);
      return false;
    }
  }

  /**
   * Get API status and basic info
   */
  async getApiStatus(): Promise<any> {
    try {
      // Try a simple endpoint that might not require auth
      const response = await this.client.get('/content/mirrors');
      return { status: 'connected', data: response.data };
    } catch (error) {
      return { status: 'error', error: error };
    }
  }
}

// Create default API client
export const createApiClient = (authManager: EGWAuthManager): EGWApiClient => {
  return new EGWApiClient(authManager);
};