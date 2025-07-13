# EGW Research Platform - Package Documentation

This document provides comprehensive documentation for all packages included in the EGW Research platform that can be used independently.

## 📦 Available Packages

### 1. @surgbc/egw-writings-shared
**Core database and utilities package**

```bash
npm install @surgbc/egw-writings-shared
```

**Features:**
- SQLite database interface for EGW writings
- Search functionality with highlighting
- Book and paragraph retrieval
- Language support
- Statistics and metadata

**Basic Usage:**
```javascript
import { EGWDatabase } from '@surgbc/egw-writings-shared';

const db = new EGWDatabase();

// Search writings
const results = db.search('salvation', 10, 0);

// Get books
const books = db.getBooks('en');

// Get book content
const book = db.getBook(1);
const paragraphs = db.getParagraphs(1);

// Close database
db.close();
```

### 2. @surgbc/egw-pdf-generator
**Professional PDF generation from EGW content**

```bash
npm install @surgbc/egw-pdf-generator
```

**Features:**
- Configurable page layouts (A4, Letter, Legal, Custom)
- Copyright-compliant pagination options
- Multiple font families and sizes
- Table of contents generation
- Chapter organization
- Progress tracking

**CLI Usage:**
```bash
# Generate PDF for a specific book
egw-pdf-generator book --book-id 1 --output my-book.pdf

# List available books
egw-pdf-generator list-books

# Generate configuration template
egw-pdf-generator config --output pdf-config.json

# Advanced options
egw-pdf-generator book \
  --book-id 1 \
  --output custom-book.pdf \
  --page-size A4 \
  --font-family Times \
  --font-size 12 \
  --show-paragraph-ids \
  --config custom-config.json
```

**Programmatic Usage:**
```javascript
import { PDFGenerator } from '@surgbc/egw-pdf-generator';

const generator = new PDFGenerator((progress) => {
  console.log(`${progress.stage}: ${progress.progress}%`);
});

const options = {
  bookId: 1,
  outputPath: './book.pdf',
  config: {
    pageSize: 'A4',
    fontSize: 12,
    fontFamily: 'Times',
    margins: { top: 72, bottom: 72, left: 72, right: 72 },
    paragraphIds: { show: false, style: 'hidden' },
    pagination: { show: true, style: 'bottom-center' },
    toc: { generate: true }
  }
};

await generator.generateBookPDF(options);
generator.close();
```

**Configuration Options:**
```json
{
  "pageSize": "A4|Letter|Legal|Custom",
  "margins": {
    "top": 72,
    "bottom": 72,
    "left": 72,
    "right": 72
  },
  "fontSize": 12,
  "lineHeight": 1.4,
  "fontFamily": "Times|Helvetica|Courier",
  "paragraphIds": {
    "show": false,
    "style": "inline|footnote|margin|hidden",
    "format": "original|sequential|chapter-based|custom"
  },
  "pagination": {
    "show": true,
    "style": "bottom-center|bottom-right|top-center|top-right",
    "format": "numeric|roman|alpha",
    "startNumber": 1
  },
  "toc": {
    "generate": true,
    "maxDepth": 3,
    "pageBreakAfter": true
  }
}
```

### 3. @surgbc/egw-api-server
**RESTful API server for EGW content**

```bash
npm install @surgbc/egw-api-server
```

**Features:**
- RESTful endpoints for all EGW content
- Search with pagination and filtering
- Book and paragraph APIs
- Statistics endpoints
- CORS support
- Rate limiting

**Starting the Server:**
```bash
# Start with default settings
egw-api-server start

# Custom port and configuration
egw-api-server start --port 3001 --cors --rate-limit 100
```

**API Endpoints:**
```
GET /api/books                    # List all books
GET /api/books/:id                # Get specific book
GET /api/books/:id/paragraphs     # Get book content
GET /api/search                   # Search content
GET /api/stats                    # Get database statistics

Query Parameters:
- limit: Number of results (default: 20)
- offset: Pagination offset (default: 0)
- lang: Language filter (default: 'en')
- q: Search query
```

**Example Requests:**
```bash
# Search for content
curl "http://localhost:3000/api/search?q=salvation&limit=10"

# Get books in English
curl "http://localhost:3000/api/books?lang=en&limit=50"

# Get specific book
curl "http://localhost:3000/api/books/1"

# Get book paragraphs
curl "http://localhost:3000/api/books/1/paragraphs?limit=100&offset=0"
```

### 4. @surgbc/egw-downloader
**Content downloading and database management**

```bash
npm install @surgbc/egw-downloader
```

**Features:**
- Download EGW content from official sources
- Database setup and initialization
- Language support
- Progress tracking
- Resume interrupted downloads

**Usage:**
```bash
# Initialize database
egw-downloader init

# Download specific language
egw-downloader download --lang en

# Download specific books
egw-downloader download --books 1,2,3

# Check download status
egw-downloader status

# List available content
egw-downloader list --lang en
```

### 5. @surgbc/egw-local-server
**Local development server with hot reload**

```bash
npm install @surgbc/egw-local-server
```

**Features:**
- Development server with auto-restart
- File watching and hot reload
- Environment variable support
- Logging and debugging

**Usage:**
```bash
# Start development server
egw-local-server dev

# Production mode
egw-local-server start --production

# Custom configuration
egw-local-server dev --port 8080 --watch ./src
```

## 🔧 Integration Examples

### Full-Stack Application
```javascript
// Backend API server
import { startAPIServer } from '@surgbc/egw-api-server';
import { EGWDatabase } from '@surgbc/egw-writings-shared';

const server = await startAPIServer({
  port: 3000,
  cors: true,
  rateLimit: 100
});

// Frontend search integration
const response = await fetch('/api/search?q=salvation&limit=10');
const { results, total } = await response.json();
```

### PDF Generation Service
```javascript
import { PDFGenerator } from '@surgbc/egw-pdf-generator';
import { EGWDatabase } from '@surgbc/egw-writings-shared';

class PDFService {
  async generateBookPDF(bookId, options = {}) {
    const generator = new PDFGenerator();
    
    const config = {
      pageSize: 'A4',
      fontSize: 12,
      ...options
    };
    
    await generator.generateBookPDF({
      bookId,
      outputPath: `./books/book-${bookId}.pdf`,
      config
    });
    
    generator.close();
  }
}
```

### Research Compilation Tool
```javascript
import { EGWDatabase } from '@surgbc/egw-writings-shared';
import { PDFGenerator } from '@surgbc/egw-pdf-generator';

class ResearchCompiler {
  constructor() {
    this.db = new EGWDatabase();
    this.generator = new PDFGenerator();
  }
  
  async compileResearch(topic, options = {}) {
    // Search for topic across all books
    const results = this.db.search(topic, 100, 0);
    
    // Organize results by book/topic
    const organized = this.organizeResults(results);
    
    // Generate PDF compilation
    await this.generator.generateResearchPDF({
      topic,
      results: organized,
      outputPath: `./research/${topic}.pdf`,
      config: options.config || {}
    });
  }
  
  organizeResults(results) {
    // Custom organization logic
    return results.reduce((acc, result) => {
      const book = result.book_title;
      if (!acc[book]) acc[book] = [];
      acc[book].push(result);
      return acc;
    }, {});
  }
}
```

## 📚 Environment Setup

### Database Initialization
```bash
# 1. Install downloader package
npm install -g @surgbc/egw-downloader

# 2. Initialize database
egw-downloader init

# 3. Download English content
egw-downloader download --lang en

# 4. Verify installation
egw-downloader status
```

### Development Environment
```bash
# Clone the repository
git clone https://github.com/gospelsounders/egw-writings-mcp.git
cd egw-writings-mcp

# Install dependencies
npm install

# Set up database
npm run setup:db

# Start development servers
npm run dev
```

## 🔒 License & Usage

All packages are released under the MIT License for educational and research use. When using these packages:

1. **Respect Copyright**: EGW content may be subject to copyright restrictions
2. **Educational Use**: Use only for educational and research purposes
3. **Attribution**: Provide proper attribution to original sources
4. **Fair Use**: Ensure compliance with fair use guidelines

## 🐛 Support & Issues

- **Documentation**: [Platform Documentation](https://egw-research.vercel.app/docs)
- **Issues**: [GitHub Issues](https://github.com/gospelsounders/egw-writings-mcp/issues)
- **Discussions**: [GitHub Discussions](https://github.com/gospelsounders/egw-writings-mcp/discussions)
- **Maintainer**: [Brian Onango](https://github.com/surgbc)

## 🚀 Contributing

We welcome contributions! Please see our [Contributing Guide](../CONTRIBUTING.md) for details on:

- Setting up development environment
- Coding standards and conventions
- Pull request process
- Issue reporting guidelines

---

**Disclaimer**: This is an independent project not officially affiliated with the Seventh-day Adventist Church or the Ellen G. White Estate. Content is used for educational and research purposes under fair use guidelines.