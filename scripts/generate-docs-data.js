#!/usr/bin/env node

/**
 * Documentation Data Generator
 * 
 * Generates comprehensive documentation data for GitHub Pages including:
 * - Aggregated books data from a.egwwritings.org API calls
 * - ZIP file structure documentation
 * - API endpoint documentation
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.dirname(__dirname);

// Data paths
const DATA_PATHS = {
  booksExport: path.join(projectRoot, 'data/books-export.json'),
  zipsDir: path.join(projectRoot, 'data/zips'),
  outputDir: path.join(projectRoot, 'docs')
};

/**
 * Generate ZIP file structure documentation
 */
async function generateZipStructure() {
  const structure = {};
  
  try {
    const zipCategories = await fs.readdir(DATA_PATHS.zipsDir);
    
    for (const category of zipCategories) {
      const categoryPath = path.join(DATA_PATHS.zipsDir, category);
      const stat = await fs.stat(categoryPath);
      
      if (stat.isDirectory()) {
        structure[category] = await scanDirectory(categoryPath);
      }
    }
  } catch (error) {
    console.warn('Could not scan ZIP directory:', error.message);
  }
  
  return structure;
}

/**
 * Recursively scan directory structure
 */
async function scanDirectory(dirPath) {
  const result = { folders: {}, files: [] };
  
  try {
    const items = await fs.readdir(dirPath);
    
    for (const item of items) {
      const itemPath = path.join(dirPath, item);
      const stat = await fs.stat(itemPath);
      
      if (stat.isDirectory()) {
        result.folders[item] = await scanDirectory(itemPath);
      } else if (item.endsWith('.zip')) {
        // Extract book info from ZIP filename
        const match = item.match(/^(.+)_(\d+)\.zip$/);
        result.files.push({
          filename: item,
          bookCode: match ? match[1] : item.replace('.zip', ''),
          bookId: match ? parseInt(match[2]) : null,
          size: stat.size
        });
      }
    }
  } catch (error) {
    console.warn(`Could not scan directory ${dirPath}:`, error.message);
  }
  
  return result;
}

/**
 * Load and process books data
 */
async function loadBooksData() {
  try {
    const data = await fs.readFile(DATA_PATHS.booksExport, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.warn('Could not load books export data:', error.message);
    return {
      stats: { languages: 0, books: 0, paragraphs: 0, downloadedBooks: 0 },
      books: []
    };
  }
}

/**
 * Generate comprehensive documentation data
 */
async function generateDocsData() {
  console.log('🔄 Generating documentation data...');
  
  // Load source data
  const [booksData, zipStructure] = await Promise.all([
    loadBooksData(),
    generateZipStructure()
  ]);
  
  // Create organized data structure
  const docsData = {
    metadata: {
      generatedAt: new Date().toISOString(),
      version: '1.0.0',
      description: 'EGH Research Platform Documentation Data'
    },
    stats: booksData.stats,
    books: {
      total: booksData.books.length,
      byLanguage: {},
      byCategory: {},
      all: booksData.books
    },
    zipStructure,
    apiEndpoints: {
      baseUrl: 'http://localhost:3000',
      endpoints: [
        {
          method: 'GET',
          path: '/health',
          description: 'Server health status and database statistics',
          example: 'curl http://localhost:3000/health'
        },
        {
          method: 'GET',
          path: '/api/docs',
          description: 'Interactive API documentation',
          example: 'curl http://localhost:3000/api/docs'
        },
        {
          method: 'GET',
          path: '/content/books',
          description: 'List books with pagination',
          parameters: [
            { name: 'page', type: 'number', default: 1, description: 'Page number' },
            { name: 'limit', type: 'number', default: 100, description: 'Items per page' },
            { name: 'lang', type: 'string', default: 'en', description: 'Language code' },
            { name: 'folder', type: 'string', optional: true, description: 'Filter by category' }
          ],
          example: 'curl "http://localhost:3000/content/books?page=1&limit=5&lang=en"'
        },
        {
          method: 'GET',
          path: '/content/books/{id}',
          description: 'Get detailed book information',
          example: 'curl http://localhost:3000/content/books/127'
        },
        {
          method: 'GET',
          path: '/content/books/{id}/toc',
          description: 'Get book table of contents',
          example: 'curl http://localhost:3000/content/books/127/toc'
        },
        {
          method: 'POST',
          path: '/content/books/{id}/generate-pdf',
          description: 'Generate PDF with custom formatting',
          contentType: 'application/json',
          body: {
            config: {
              pageSize: 'A4',
              fontSize: 12,
              fontFamily: 'Times',
              margins: { top: 72, bottom: 72, left: 72, right: 72 },
              toc: { generate: true, maxDepth: 2 },
              pagination: { show: true, style: 'bottom-center' }
            }
          },
          example: 'curl -X POST -H "Content-Type: application/json" -d \'{"config":{"pageSize":"A4"}}\' http://localhost:3000/content/books/127/generate-pdf'
        },
        {
          method: 'GET',
          path: '/pdf/status/{token}',
          description: 'Check PDF generation status',
          example: 'curl http://localhost:3000/pdf/status/abc123-def456'
        },
        {
          method: 'GET',
          path: '/pdf/download/{token}',
          description: 'Download generated PDF',
          example: 'curl -O http://localhost:3000/pdf/download/abc123-def456'
        },
        {
          method: 'GET',
          path: '/search',
          description: 'Full-text search across all content',
          parameters: [
            { name: 'q', type: 'string', required: true, description: 'Search query' },
            { name: 'limit', type: 'number', default: 20, description: 'Maximum results' },
            { name: 'offset', type: 'number', default: 0, description: 'Result offset' }
          ],
          example: 'curl "http://localhost:3000/search?q=righteousness%20by%20faith&limit=5"'
        },
        {
          method: 'GET',
          path: '/stats',
          description: 'Database and server statistics',
          example: 'curl http://localhost:3000/stats'
        }
      ]
    },
    docker: {
      images: {
        latest: 'ghcr.io/gospelsounders/egw-writings-mcp/egh-research-server:latest',
        tagged: 'ghcr.io/gospelsounders/egw-writings-mcp/egh-research-server:v1.0.0'
      },
      quickStart: [
        'docker pull ghcr.io/gospelsounders/egw-writings-mcp/egh-research-server:latest',
        'docker run -p 3000:3000 ghcr.io/gospelsounders/egw-writings-mcp/egh-research-server:latest',
        'curl http://localhost:3000/health'
      ],
      compose: {
        url: 'https://raw.githubusercontent.com/GospelSounders/egw-writings-mcp/master/apps/local-server/docker-compose.yml',
        commands: [
          'curl -O https://raw.githubusercontent.com/GospelSounders/egw-writings-mcp/master/apps/local-server/docker-compose.yml',
          'docker-compose up -d',
          'docker-compose logs -f'
        ]
      }
    }
  };
  
  // Process books by language and category
  for (const book of booksData.books) {
    const lang = book.lang || 'unknown';
    const folder = book.folder || 'uncategorized';
    
    if (!docsData.books.byLanguage[lang]) {
      docsData.books.byLanguage[lang] = [];
    }
    docsData.books.byLanguage[lang].push(book);
    
    if (!docsData.books.byCategory[folder]) {
      docsData.books.byCategory[folder] = [];
    }
    docsData.books.byCategory[folder].push(book);
  }
  
  // Ensure docs directory exists
  await fs.mkdir(DATA_PATHS.outputDir, { recursive: true });
  
  // Write documentation data files
  await Promise.all([
    fs.writeFile(
      path.join(DATA_PATHS.outputDir, 'data.json'),
      JSON.stringify(docsData, null, 2)
    ),
    fs.writeFile(
      path.join(DATA_PATHS.outputDir, 'books.json'),
      JSON.stringify(docsData.books, null, 2)
    ),
    fs.writeFile(
      path.join(DATA_PATHS.outputDir, 'zip-structure.json'),
      JSON.stringify(docsData.zipStructure, null, 2)
    ),
    fs.writeFile(
      path.join(DATA_PATHS.outputDir, 'api-endpoints.json'),
      JSON.stringify(docsData.apiEndpoints, null, 2)
    )
  ]);
  
  console.log('✅ Documentation data generated successfully!');
  console.log(`📊 Books: ${docsData.books.total}`);
  console.log(`🌐 Languages: ${Object.keys(docsData.books.byLanguage).length}`);
  console.log(`📁 Categories: ${Object.keys(docsData.books.byCategory).length}`);
  console.log(`🗜️ ZIP Categories: ${Object.keys(docsData.zipStructure).length}`);
  console.log(`📝 API Endpoints: ${docsData.apiEndpoints.endpoints.length}`);
  
  return docsData;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateDocsData().catch(console.error);
}

export { generateDocsData };