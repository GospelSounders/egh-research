// EGW API Client for connecting to real EGW database

interface APIBook {
  book_id: number;
  title: string;
  author: string;
  pub_year: number;
  npages: number;
  lang: string;
  description?: string;
  cover_url?: string;
  category?: string;
  publisher?: string;
  pub_code?: string;
}

interface APISearchResult {
  para_id: number;
  book_id: number;
  book_title: string;
  chapter: number;
  page: number;
  content: string;
  refcode_short: string;
  refcode_long: string;
  relevance?: number;
}

interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  total?: number;
  page?: number;
  limit?: number;
}

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class EGWAPIClient {
  private baseURL: string;
  private cache: Map<string, CacheEntry<any>> = new Map();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes default TTL
  private cacheEnabled: boolean;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(baseURL: string = '/api/egw', cacheEnabled: boolean = true) {
    this.baseURL = baseURL;
    this.cacheEnabled = cacheEnabled;
    
    // Set up periodic cache cleanup (every 5 minutes)
    if (this.cacheEnabled && typeof window !== 'undefined') {
      this.cleanupInterval = setInterval(() => {
        this.clearExpiredCache();
      }, 5 * 60 * 1000);
    }
  }

  private getCacheKey(method: string, params: any): string {
    return `${method}:${JSON.stringify(params)}`;
  }

  private getFromCache<T>(key: string): T | null {
    if (!this.cacheEnabled) return null;
    
    const entry = this.cache.get(key);
    if (!entry) return null;
    
    const now = Date.now();
    if (now - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }
    
    return entry.data;
  }

  private setCache<T>(key: string, data: T, ttl: number = this.defaultTTL): void {
    if (!this.cacheEnabled) return;
    
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl
    });
  }

  private clearExpiredCache(): void {
    const now = Date.now();
    const keysToDelete: string[] = [];
    
    this.cache.forEach((entry, key) => {
      if (now - entry.timestamp > entry.ttl) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Clear all cache entries
  clearCache(): void {
    this.cache.clear();
  }

  // Clear cache for specific method
  clearCacheForMethod(method: string): void {
    const keysToDelete: string[] = [];
    
    this.cache.forEach((_, key) => {
      if (key.startsWith(`${method}:`)) {
        keysToDelete.push(key);
      }
    });
    
    keysToDelete.forEach(key => this.cache.delete(key));
  }

  // Get cache statistics
  getCacheStats(): {
    size: number;
    methods: Record<string, number>;
    totalMemory: number;
    oldestEntry: number | null;
    newestEntry: number | null;
  } {
    const methods: Record<string, number> = {};
    let totalMemory = 0;
    let oldestEntry: number | null = null;
    let newestEntry: number | null = null;

    this.cache.forEach((entry, key) => {
      const method = key.split(':')[0];
      methods[method] = (methods[method] || 0) + 1;
      
      // Rough estimate of memory usage
      totalMemory += JSON.stringify(entry.data).length;
      
      if (oldestEntry === null || entry.timestamp < oldestEntry) {
        oldestEntry = entry.timestamp;
      }
      if (newestEntry === null || entry.timestamp > newestEntry) {
        newestEntry = entry.timestamp;
      }
    });

    return {
      size: this.cache.size,
      methods,
      totalMemory,
      oldestEntry,
      newestEntry
    };
  }

  // Cleanup method to call on component unmount
  cleanup(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
    this.clearCache();
  }

  async getBooks(params: {
    lang?: string;
    limit?: number;
    offset?: number;
    search?: string;
    category?: string;
  } = {}): Promise<APIResponse<APIBook[]>> {
    // Check cache first
    const cacheKey = this.getCacheKey('getBooks', params);
    const cachedResult = this.getFromCache<APIResponse<APIBook[]>>(cacheKey);
    if (cachedResult) {
      console.log('Returning cached books result');
      return cachedResult;
    }

    try {
      const queryParams = new URLSearchParams();
      
      if (params.lang) queryParams.append('language', params.lang);
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.offset) {
        // Convert offset to page number
        const page = Math.floor(params.offset / (params.limit || 20)) + 1;
        queryParams.append('page', page.toString());
      }
      if (params.search) queryParams.append('search', params.search);
      if (params.category) queryParams.append('category', params.category);

      console.log('Fetching books from local API route...');
      
      const url = `${this.baseURL}/books${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
      console.log('Full API URL:', url);
      
      const response = await fetch(url);
      
      console.log('Books API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Books API request failed: ${response.status} - ${errorText}`);
        throw new Error(`Books API request failed: ${response.status}`);
      }
      
      const apiResponse = await response.json();
      console.log('API response received:', apiResponse.success, 'Books:', apiResponse.data?.length);
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'API returned unsuccessful response');
      }
      
      // Transform API response to our format
      const books: APIBook[] = apiResponse.data.map((book: any) => ({
        book_id: book.book_id,
        title: book.title,
        author: book.author || 'Ellen G. White',
        pub_year: parseInt(book.pub_year) || 0,
        npages: book.npages || 0,
        lang: book.lang || 'en',
        description: book.description,
        cover_url: book.cover?.small,
        category: this.categorizeBook(book),
        publisher: book.publisher,
        pub_code: book.code
      }));

      const result = {
        success: true,
        data: books,
        total: books.length,
        page: 1,
        limit: books.length
      };

      // Cache the result (longer TTL for books list - 10 minutes)
      this.setCache(cacheKey, result, 10 * 60 * 1000);
      
      return result;
    } catch (error) {
      console.error('Failed to fetch books from API:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load books from API'
      };
    }
  }

  async getBook(bookId: number): Promise<APIResponse<APIBook>> {
    // Check cache first
    const cacheKey = this.getCacheKey('getBook', { bookId });
    const cachedResult = this.getFromCache<APIResponse<APIBook>>(cacheKey);
    if (cachedResult) {
      console.log(`Returning cached book result for ${bookId}`);
      return cachedResult;
    }

    try {
      console.log(`Fetching book ${bookId} from local API route...`);
      
      const response = await fetch(`${this.baseURL}/books/${bookId}`);
      
      console.log(`Book API response for ${bookId}:`, response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.warn(`Book API request failed: ${response.status} - ${errorText}`);
        throw new Error(`API request failed: ${response.status}`);
      }

      const apiResponse = await response.json();
      console.log(`Book API response for ${bookId}:`, apiResponse.success);
      
      if (!apiResponse.success) {
        throw new Error(apiResponse.error || 'API returned unsuccessful response');
      }

      const book: APIBook = {
        book_id: apiResponse.data.book_id,
        title: apiResponse.data.title,
        author: apiResponse.data.author || 'Ellen G. White',
        pub_year: parseInt(apiResponse.data.pub_year) || 0,
        npages: apiResponse.data.npages || 0,
        lang: apiResponse.data.lang || 'en',
        description: apiResponse.data.description,
        cover_url: apiResponse.data.cover?.small,
        category: this.categorizeBook(apiResponse.data),
        publisher: apiResponse.data.publisher,
        pub_code: apiResponse.data.code
      };

      const result = {
        success: true,
        data: book
      };

      // Cache the result (longer TTL for individual books - 15 minutes)
      this.setCache(cacheKey, result, 15 * 60 * 1000);

      return result;
    } catch (error) {
      console.error(`Failed to fetch book ${bookId} from API:`, error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : `Failed to load book ${bookId} from API`
      };
    }
  }

  async searchBooks(query: string, params: {
    limit?: number;
    offset?: number;
    lang?: string;
    books?: number[];
  } = {}): Promise<APIResponse<APISearchResult[]>> {
    // Check cache first (shorter TTL for search results - 2 minutes)
    const cacheKey = this.getCacheKey('searchBooks', { query, ...params });
    const cachedResult = this.getFromCache<APIResponse<APISearchResult[]>>(cacheKey);
    if (cachedResult) {
      console.log(`Returning cached search results for "${query}"`);
      return cachedResult;
    }

    try {
      const queryParams = new URLSearchParams();
      queryParams.append('q', query);
      
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.offset) queryParams.append('offset', params.offset.toString());
      if (params.lang) queryParams.append('lang', params.lang);
      if (params.books) queryParams.append('books', params.books.join(','));

      const response = await fetch(`${this.baseURL}/api/search?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      const results: APISearchResult[] = data.results?.map((result: any) => ({
        para_id: result.para_id,
        book_id: result.book_id,
        book_title: result.book_title,
        chapter: result.chapter || 0,
        page: result.page || 0,
        content: result.content,
        refcode_short: result.refcode_short,
        refcode_long: result.refcode_long,
        relevance: result.relevance
      })) || [];

      const result = {
        success: true,
        data: results,
        total: data.total,
        page: data.page,
        limit: data.limit
      };

      // Cache search results (shorter TTL - 2 minutes)
      this.setCache(cacheKey, result, 2 * 60 * 1000);

      return result;
    } catch (error) {
      console.error('Failed to search books:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  async getBookContent(bookId: number, params: {
    limit?: number;
    offset?: number;
    chapter?: number;
  } = {}): Promise<APIResponse<any[]>> {
    // Check cache first (longer TTL for book content - 20 minutes)
    const cacheKey = this.getCacheKey('getBookContent', { bookId, ...params });
    const cachedResult = this.getFromCache<APIResponse<any[]>>(cacheKey);
    if (cachedResult) {
      console.log(`Returning cached book content for book ${bookId}`);
      return cachedResult;
    }

    try {
      const queryParams = new URLSearchParams();
      
      if (params.limit) queryParams.append('limit', params.limit.toString());
      if (params.offset) queryParams.append('offset', params.offset.toString());
      if (params.chapter) queryParams.append('chapter', params.chapter.toString());

      const response = await fetch(`${this.baseURL}/api/books/${bookId}/content?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();

      const result = {
        success: true,
        data: data.content || [],
        total: data.total,
        page: data.page,
        limit: data.limit
      };

      // Cache book content (longer TTL - 20 minutes)
      this.setCache(cacheKey, result, 20 * 60 * 1000);

      return result;
    } catch (error) {
      console.error('Failed to fetch book content:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private categorizeBook(book: any): string {
    const author = book.author?.toLowerCase() || '';
    const title = book.title?.toLowerCase() || '';
    
    // EGW books
    if (author.includes('white') || author.includes('elena')) {
      if (title.includes('maranatha') || title.includes('heavenly') || title.includes('sons') || title.includes('daughters')) {
        return 'devotional';
      }
      return 'egw';
    }
    
    // Pioneer authors
    const pioneers = ['uriah smith', 'a. t. jones', 'j. n. andrews', 'john andrews', 'm. l. andreasen', 'j. n. loughborough'];
    if (pioneers.some(pioneer => author.includes(pioneer))) {
      return 'pioneer';
    }
    
    // Periodicals
    if (title.includes('review') || title.includes('herald') || title.includes('signs') || title.includes('times') || 
        title.includes('youth') || title.includes('instructor')) {
      return 'periodical';
    }
    
    // Historical
    if (title.includes('history') || title.includes('origin') || title.includes('movement') || title.includes('advent')) {
      return 'historical';
    }
    
    // Default to devotional for compilations
    return 'devotional';
  }

  // Method to test API connectivity
  async testConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.baseURL}/api/health`);
      return response.ok;
    } catch {
      return false;
    }
  }
}

// Create singleton instance
export const egwAPI = new EGWAPIClient();

// Export types for use in components
export type { APIBook, APISearchResult, APIResponse };