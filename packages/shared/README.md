# @surgbc/egw-writings-shared

Shared utilities, types, and database schema for EGW Writings MCP servers for educational and research purposes.

## Overview

This package provides common functionality shared across the EGW Writings MCP server ecosystem, including API client utilities, database management, type definitions, and authentication handling.

## Features

- **API Client**: OAuth-enabled HTTP client for EGW Writings API
- **Database Management**: SQLite database with FTS5 full-text search
- **Type Definitions**: Complete TypeScript types for all API responses
- **Authentication**: OAuth 2.0 client credentials flow with token management
- **Utilities**: Common helper functions and configurations

## Installation

```bash
npm install @surgbc/egw-writings-shared
```

## Usage

### API Client

```typescript
import { createAuthManager, createApiClient } from '@surgbc/egw-writings-shared';

const authManager = createAuthManager();
const apiClient = createApiClient(authManager);

// Search writings
const results = await apiClient.search('righteousness by faith', {
  lang: ['en'],
  limit: 10
});

// Get languages
const languages = await apiClient.getLanguages();

// Get books
const books = await apiClient.getBooksByFolder(folderId);
```

### Database Management

```typescript
import { EGWDatabase } from '@surgbc/egw-writings-shared';

const db = new EGWDatabase({
  dbPath: './data/egw-writings.db',
  enableFTS: true,
  enableWAL: true
});

// Insert data
db.insertLanguage('en', 'English', 'ltr');
db.insertBook(bookData);
db.insertParagraph(paragraphData, bookId, chapterTitle);

// Search
const results = db.search('righteousness by faith', 10, 0);
const count = db.searchCount('righteousness by faith');

// Get statistics
const stats = db.getStats();
```

### Types

```typescript
import type { 
  Book, 
  Paragraph, 
  SearchResult, 
  Language,
  Folder 
} from '@surgbc/egw-writings-shared';

// Use types for type safety
const processBook = (book: Book) => {
  console.log(`${book.title} by ${book.author}`);
};
```

## Environment Variables

The shared package looks for these environment variables:

```bash
EGW_CLIENT_ID=your_client_id
EGW_CLIENT_SECRET=your_client_secret
EGW_TOKEN_FILE=./egw-token.json  # Optional: custom token storage location
```

## Database Schema

The package creates and manages these tables:

- **languages**: Language codes and metadata
- **folders**: Hierarchical organization structure  
- **books**: Complete book metadata and files
- **paragraphs**: Full content with reference codes
- **paragraphs_fts**: FTS5 virtual table for search
- **download_progress**: Progress tracking for bulk operations

## API Coverage

Supports all major EGW Writings API endpoints:

- Authentication (OAuth 2.0)
- Language management
- Folder/category browsing
- Book discovery and metadata
- Content retrieval (chapters, paragraphs)
- Search functionality
- Suggestions and autocomplete

## Educational and Research Use

This package is designed for educational and research purposes. The EGW writings may be subject to copyright restrictions. Users are responsible for ensuring their use complies with applicable copyright laws and fair use guidelines.

## Organization

Developed by [Gospel Sounders](https://github.com/gospelsounders) under the leadership of [Brian Onang'o](https://github.com/surgbc).

## License

UNLICENSED - Proprietary software for educational and research use.

## Support

- [Issues](https://github.com/gospelsounders/egw-writings-mcp/issues)
- [Documentation](https://github.com/gospelsounders/egw-writings-mcp#readme)