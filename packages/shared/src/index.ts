// API utilities
export * from './utils/auth.js';
export { EGWApiClient, createApiClient } from './utils/api.js';

// New API client based on APK analysis
export { 
  EGWApiClient as EGWApiClientNew, 
  type EGWApiConfig,
  type Language as LanguageNew,
  type Folder as FolderNew,
  type Book as BookNew,
  type TocItem,
  type Paragraph as ParagraphNew
} from './api/egw-api-client.js';

// Enhanced content downloader
export { 
  ContentDownloader,
  type DownloadProgress,
  type DownloadOptions
} from './services/content-downloader.js';

// Database utilities  
export * from './utils/database.js';

// Types
export * from './types/index.js';