export interface PDFConfig {
  // Page settings
  pageSize: 'A4' | 'Letter' | 'Legal' | 'Custom';
  customWidth?: number;
  customHeight?: number;
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  
  // Typography
  fontSize: number;
  lineHeight: number;
  fontFamily: 'Times' | 'Helvetica' | 'Courier';
  
  // Paragraph identification
  paragraphIds: {
    show: boolean;
    style: 'inline' | 'footnote' | 'margin' | 'hidden';
    format: 'original' | 'sequential' | 'chapter-based' | 'custom';
    prefix?: string;
    suffix?: string;
  };
  
  // Pagination
  pagination: {
    show: boolean;
    style: 'bottom-center' | 'bottom-right' | 'top-center' | 'top-right';
    format: 'numeric' | 'roman' | 'alpha';
    startNumber: number;
  };
  
  // Headers and footers
  header?: {
    show: boolean;
    content: string;
    fontSize: number;
  };
  footer?: {
    show: boolean;
    content: string;
    fontSize: number;
  };
  
  // Table of contents
  toc: {
    generate: boolean;
    maxDepth: number;
    pageBreakAfter: boolean;
  };
}

export interface BookGenerationOptions {
  bookId: number;
  config: PDFConfig;
  outputPath: string;
  includeChapters?: number[];
  startPage?: number;
  endPage?: number;
}

export interface ResearchCompilationOptions {
  searchTerm: string;
  maxResults: number;
  languages: string[];
  config: PDFConfig;
  outputPath: string;
  groupBy: 'book' | 'author' | 'date' | 'relevance';
}

export interface Chapter {
  id: number;
  title: string;
  content: string;
  originalPage?: number;
  originalChapter?: string;
}

export interface GenerationProgress {
  stage: 'fetching' | 'processing' | 'formatting' | 'rendering' | 'complete';
  progress: number;
  currentChapter?: string;
  totalChapters?: number;
  estimatedTimeRemaining?: number;
}