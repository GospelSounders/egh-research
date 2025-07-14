/**
 * Static API - Uses pre-generated JSON data for offline browsing
 * This provides the same interface as the live API but using static data
 */

// Types
export interface Book {
  book_id: number;
  title: string;
  author: string;
  lang: string;
  pub_year: string;
  folder: string;
  npages: number;
  elements: number;
  description?: string;
}

export interface BooksResponse {
  count: number;
  ipp: number;
  next: string | null;
  previous: string | null;
  results: Book[];
}

export interface SearchResult {
  book_id: number;
  title: string;
  author: string;
  reference: string;
  snippet: string;
  url: string;
}

export interface SearchResponse {
  query: string;
  total: number;
  limit: number;
  offset: number;
  results: SearchResult[];
}

export interface ZipStructure {
  [category: string]: {
    folders: { [folder: string]: any };
    files: Array<{
      filename: string;
      bookCode: string;
      bookId: number | null;
      size: number;
    }>;
  };
}

export interface DocsData {
  metadata: {
    generatedAt: string;
    version: string;
    description: string;
  };
  stats: {
    languages: number;
    books: number;
    paragraphs: number;
    downloadedBooks: number;
  };
  books: {
    total: number;
    byLanguage: { [lang: string]: Book[] };
    byCategory: { [category: string]: Book[] };
    all: Book[];
  };
  zipStructure: ZipStructure;
  apiEndpoints: any;
  docker: any;
}

// Cache for loaded data
let cachedData: DocsData | null = null;
let cachedBooks: Book[] | null = null;

// Get the base path from the environment or use empty string
const basePath = process.env.NODE_ENV === 'production' && typeof window !== 'undefined' && window.location.pathname.includes('/egw-writings-mcp') ? '/egw-writings-mcp' : '';

/**
 * Load data from static JSON files
 */
async function loadData(): Promise<DocsData> {
  if (cachedData) return cachedData;
  
  try {
    const response = await fetch(`${basePath}/api/data.json`);
    if (!response.ok) throw new Error('Failed to load data');
    cachedData = await response.json();
    return cachedData!;
  } catch (error) {
    console.error('Error loading static data:', error);
    throw error;
  }
}

/**
 * Load books data
 */
async function loadBooks(): Promise<Book[]> {
  if (cachedBooks) return cachedBooks;
  
  try {
    // Try to load from books.json first
    const response = await fetch(`${basePath}/api/books.json`);
    if (response.ok) {
      const booksData = await response.json();
      cachedBooks = booksData.all || booksData;
      return cachedBooks!;
    }
    
    // Fallback to main data file
    const data = await loadData();
    cachedBooks = data.books.all;
    return cachedBooks!;
  } catch (error) {
    console.error('Error loading books data:', error);
    throw error;
  }
}

/**
 * Get paginated books list
 */
export async function getBooks(params: {
  page?: number;
  limit?: number;
  lang?: string;
  folder?: string;
} = {}): Promise<BooksResponse> {
  const { page = 1, limit = 50, lang, folder } = params;
  const books = await loadBooks();
  
  // Filter books
  let filteredBooks = books;
  if (lang) {
    filteredBooks = filteredBooks.filter(book => book.lang === lang);
  }
  if (folder) {
    filteredBooks = filteredBooks.filter(book => book.folder === folder);
  }
  
  // Pagination
  const offset = (page - 1) * limit;
  const results = filteredBooks.slice(offset, offset + limit);
  
  // Generate pagination URLs (for compatibility)
  const baseUrl = '';
  const nextPage = offset + limit < filteredBooks.length ? page + 1 : null;
  const prevPage = page > 1 ? page - 1 : null;
  
  const buildUrl = (p: number) => {
    const params = new URLSearchParams({
      page: p.toString(),
      limit: limit.toString(),
      ...(lang && { lang }),
      ...(folder && { folder })
    });
    return `${baseUrl}?${params.toString()}`;
  };
  
  return {
    count: filteredBooks.length,
    ipp: limit,
    next: nextPage ? buildUrl(nextPage) : null,
    previous: prevPage ? buildUrl(prevPage) : null,
    results
  };
}

/**
 * Get book by ID
 */
export async function getBook(id: number): Promise<Book | null> {
  const books = await loadBooks();
  return books.find(book => book.book_id === id) || null;
}

/**
 * Search books (simple text search on title and author)
 */
export async function searchBooks(params: {
  q: string;
  limit?: number;
  offset?: number;
}): Promise<SearchResponse> {
  const { q, limit = 20, offset = 0 } = params;
  const books = await loadBooks();
  
  const query = q.toLowerCase();
  const matches = books.filter(book => 
    book.title.toLowerCase().includes(query) ||
    book.author.toLowerCase().includes(query) ||
    (book.description && book.description.toLowerCase().includes(query))
  );
  
  const results = matches.slice(offset, offset + limit).map(book => ({
    book_id: book.book_id,
    title: book.title,
    author: book.author,
    reference: `${book.title} (${book.pub_year})`,
    snippet: `${book.description || book.title} - ${book.author}`,
    url: `/books/${book.book_id}`
  }));
  
  return {
    query: q,
    total: matches.length,
    limit,
    offset,
    results
  };
}

/**
 * Get database stats
 */
export async function getStats() {
  const data = await loadData();
  return {
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: data.stats,
    books: data.books.total,
    languages: Object.keys(data.books.byLanguage).length,
    categories: Object.keys(data.books.byCategory).length
  };
}

/**
 * Get ZIP structure
 */
export async function getZipStructure(): Promise<ZipStructure> {
  try {
    const response = await fetch(`${basePath}/api/zip-structure.json`);
    if (!response.ok) throw new Error('Failed to load ZIP structure');
    return await response.json();
  } catch (error) {
    console.error('Error loading ZIP structure:', error);
    throw error;
  }
}

/**
 * Get books by language
 */
export async function getBooksByLanguage(lang: string): Promise<Book[]> {
  const data = await loadData();
  return data.books.byLanguage[lang] || [];
}

/**
 * Get books by category
 */
export async function getBooksByCategory(category: string): Promise<Book[]> {
  const data = await loadData();
  return data.books.byCategory[category] || [];
}

/**
 * Get available languages
 */
export async function getLanguages(): Promise<string[]> {
  const data = await loadData();
  return Object.keys(data.books.byLanguage).sort();
}

/**
 * Get available categories
 */
export async function getCategories(): Promise<string[]> {
  const data = await loadData();
  return Object.keys(data.books.byCategory).sort();
}