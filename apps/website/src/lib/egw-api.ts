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

class EGWAPIClient {
  private baseURL: string;

  constructor(baseURL: string = '/api/egw') {
    this.baseURL = baseURL;
  }

  async getBooks(params: {
    lang?: string;
    limit?: number;
    offset?: number;
    search?: string;
    category?: string;
  } = {}): Promise<APIResponse<APIBook[]>> {
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

      return {
        success: true,
        data: books,
        total: books.length,
        page: 1,
        limit: books.length
      };
    } catch (error) {
      console.error('Failed to fetch books from API:', error);
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to load books from API'
      };
    }
  }

  async getBook(bookId: number): Promise<APIResponse<APIBook>> {
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

      return {
        success: true,
        data: book
      };
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

      return {
        success: true,
        data: results,
        total: data.total,
        page: data.page,
        limit: data.limit
      };
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

      return {
        success: true,
        data: data.content || [],
        total: data.total,
        page: data.page,
        limit: data.limit
      };
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