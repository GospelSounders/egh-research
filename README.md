# EGW Writings MCP Server

An MCP (Model Context Protocol) server that provides contextual access to Ellen G. White writings and related Adventist literature for AI research assistance.

## Overview

This project creates an MCP server that enables AI assistants to search and reference Ellen G. White writings, Pioneer writings, and Commentaries from the EGW Writings collection. The server provides structured access to the vast collection of Adventist literature for research and study purposes.

## Data Source

Primary source: [egwwritings.org](https://egwwritings.org/)
- Ellen G. White writings
- Pioneer writings  
- Commentaries and related literature
- Organized by books with paragraph-level identifiers

## Project Structure

```
egw-writings-mcp/
├── README.md
├── src/
│   ├── server.ts          # Main MCP server implementation
│   ├── data/
│   │   ├── extractor.ts   # Data extraction pipeline
│   │   ├── storage.ts     # Data storage and indexing
│   │   └── models.ts      # Data models and types
│   ├── tools/
│   │   ├── search.ts      # Search functionality
│   │   └── context.ts     # Context retrieval tools
│   └── utils/
│       ├── apk.ts         # APK analysis utilities
│       └── api.ts         # API interaction utilities
├── data/
│   ├── raw/               # Raw extracted data
│   ├── processed/         # Processed and indexed data
│   └── sqlite/            # SQLite database
├── scripts/
│   ├── extract-apk.sh     # APK download and extraction
│   ├── analyze-api.ts     # API endpoint analysis
│   └── build-index.ts     # Data indexing script
├── docs/
│   └── api-endpoints.md   # Documented API endpoints
├── package.json
├── tsconfig.json
└── .gitignore
```

## Implementation Plan

### Phase 1: Data Extraction (Current Focus)

#### 1.1 APK Analysis
- [ ] Download EGW Writings Android app from APKMirror/APKPure
- [ ] Extract APK using `apktool` or `unzip`
- [ ] Analyze app structure for API endpoints
- [ ] Document network requests and data formats

#### 1.2 API Reverse Engineering
- [ ] Identify book listing endpoints
- [ ] Identify chapter/paragraph retrieval endpoints
- [ ] Document authentication requirements (if any)
- [ ] Test API endpoints for data access

#### 1.3 Data Collection Pipeline
- [ ] Implement book metadata collection
- [ ] Implement paragraph-level content extraction
- [ ] Handle rate limiting and respectful scraping
- [ ] Validate data integrity and completeness

### Phase 2: Data Processing and Storage

#### 2.1 Database Design
- [ ] Design SQLite schema for books, chapters, paragraphs
- [ ] Implement full-text search indexing
- [ ] Add metadata for book categories (Ellen White, Pioneers, Commentaries)
- [ ] Create efficient query structures

#### 2.2 Data Processing
- [ ] Clean and normalize extracted text
- [ ] Parse paragraph identifiers and references
- [ ] Build cross-reference indexes
- [ ] Implement search optimization

### Phase 3: MCP Server Implementation

#### 3.1 Core MCP Server
- [ ] Implement MCP protocol handlers
- [ ] Create resource discovery endpoints
- [ ] Add tool registration and capabilities
- [ ] Implement error handling and logging

#### 3.2 Search Tools
- [ ] Full-text search across all writings
- [ ] Category-specific search (Ellen White, Pioneers, etc.)
- [ ] Citation and reference lookup
- [ ] Context window optimization for AI consumption

#### 3.3 Context Tools
- [ ] Paragraph retrieval by identifier
- [ ] Book chapter summaries
- [ ] Related content suggestions
- [ ] Quote verification and attribution

### Phase 4: Testing and Deployment

#### 4.1 Testing
- [ ] Unit tests for data extraction
- [ ] Integration tests for MCP server
- [ ] Performance testing for search queries
- [ ] Validation of data accuracy

#### 4.2 Documentation
- [ ] API documentation for MCP tools
- [ ] Usage examples and guides
- [ ] Data source attributions
- [ ] Deployment instructions

## Technical Requirements

### APK Analysis Tools
- `apktool` - APK reverse engineering
- `jadx` - Java decompiler (optional)
- `unzip` - Basic APK extraction
- Network analysis tools for API discovery

### Development Stack
- **Runtime**: Node.js with TypeScript
- **Database**: SQLite with FTS5 full-text search
- **MCP Framework**: @modelcontextprotocol/sdk
- **HTTP Client**: axios for API requests
- **Search**: SQLite FTS5 + custom indexing

### Data Storage Strategy
- **Raw Data**: JSON files for each book/chapter
- **Processed Data**: SQLite database with optimized schema
- **Search Index**: FTS5 virtual tables for fast text search
- **Metadata**: Book hierarchies, categories, and cross-references

## API Endpoint Discovery Strategy

1. **APK Extraction**: Download and extract EGW Writings app
2. **Static Analysis**: Examine JavaScript/Java code for API URLs
3. **Network Analysis**: Monitor app traffic during usage
4. **Endpoint Testing**: Validate discovered endpoints
5. **Documentation**: Document request/response formats

## Ethical and Legal Considerations

- Respectful rate limiting to avoid server overload
- Proper attribution of all content sources
- Compliance with egwwritings.org terms of service
- Educational and research use focus
- No redistribution of copyrighted content beyond fair use

## Usage Examples

Once implemented, the MCP server will enable queries like:

```typescript
// Search for specific topics
await searchWritings("sanctuary doctrine", { category: "ellen-white" })

// Get specific paragraph
await getParagraph("GC 415.2")

// Find related content
await findRelated("1844 movement", { includeCommentaries: true })
```

## Getting Started

### Prerequisites
- Node.js 18+
- Linux environment with APK tools
- Git and GitHub CLI

### Installation
```bash
# Clone the repository
git clone git@github.com:surgbc/egw-writings-mcp.git
cd egw-writings-mcp

# Install dependencies
npm install

# Extract and analyze data
npm run extract-data

# Build search index
npm run build-index

# Start MCP server
npm run start
```

## Contributing

This project is focused on providing educational and research access to Adventist literature. Contributions should maintain respect for the source material and comply with fair use guidelines.

## License

This project is for educational and research purposes. All Ellen G. White writings and related content remain under their respective copyrights and usage terms from the Ellen G. White Estate and egwwritings.org.