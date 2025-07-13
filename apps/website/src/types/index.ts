// Re-export types from shared package
export * from '@surgbc/egw-writings-shared';

// Website-specific types
export interface SearchResult {
  id: string;
  title: string;
  excerpt: string;
  bookTitle: string;
  author: string;
  reference: string;
  relevanceScore: number;
  highlightedText?: string;
}

export interface BookSummary {
  id: number;
  title: string;
  author: string;
  year: number;
  pages: number;
  language: string;
  description: string;
  categories: string[];
  downloadedContent: boolean;
}

export interface ResearchTopic {
  id: string;
  title: string;
  description: string;
  keywords: string[];
  createdAt: Date;
  results?: SearchResult[];
}

export interface PDFGenerationRequest {
  type: 'book' | 'research';
  bookId?: number;
  searchQuery?: string;
  config: {
    format: 'A4' | 'Letter' | 'Legal';
    fontSize: number;
    includeReferences: boolean;
    includeTableOfContents: boolean;
    maxResults?: number;
  };
  title: string;
}

export interface PDFGenerationStatus {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  progress: number;
  message?: string;
  downloadUrl?: string;
  error?: string;
  createdAt: Date;
  estimatedCompletion?: Date;
}

export interface SearchFilters {
  languages: string[];
  authors: string[];
  dateRange?: {
    start: number;
    end: number;
  };
  books: number[];
  hasContent: boolean;
}

export interface NavigationItem {
  title: string;
  href: string;
  description?: string;
  icon?: string;
  children?: NavigationItem[];
}

export interface SEOMetadata {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl?: string;
  ogImage?: string;
  structuredData?: Record<string, any>;
}