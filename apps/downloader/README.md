# @surgbc/egw-writings-downloader

Data extraction and database population tool for Ellen G. White (EGW) Writings for educational and research purposes.

## Overview

This command-line tool downloads and indexes EGW writings content into a local SQLite database with full-text search capabilities. It's designed to create a high-performance local database for research and educational use.

## 🎉 What's New in Latest Version

- **📁 Category-Based ZIP Organization**: ZIPs are now organized in folders by category (egw/books/, egw/pamphlets/, etc.) instead of flat structure
- **🌐 API Direct Download**: Download all 1499+ English books directly from API without requiring database setup first
- **🚀 Complete Pagination**: Fetch ALL books from API across multiple pages, not just first 100
- **🌍 Enhanced Multi-Language**: Easy language switching with `LANGUAGE=es/fr/de` parameter  
- **⚡ Faster Builds**: Commands now build only required packages (8s) instead of entire project (45s)
- **🔍 Recursive ZIP Parsing**: Parse command automatically finds ZIPs in category subfolders
- **🎯 Improved User Experience**: Better progress reporting, clearer error messages, organized help output

## Features

- **🎉 Enhanced ZIP Organization**: Automatic category-based folder structure (egw/books/, egw/pamphlets/, etc.)
- **🚀 API Direct Download**: Fetch complete book lists (1499+ books) directly from API without database setup
- **🌍 Multi-Language Support**: Download and organize books in multiple languages (English, Spanish, French, etc.)
- **⚡ Fast Builds**: Optimized build process - only builds required packages (8s vs 45s)
- **📦 Bulk Download**: Download languages, books, and content efficiently with pagination support
- **🗂️ Smart Categorization**: Automatic book categorization (EGW books, pamphlets, testimonies, pioneer works, etc.)
- **💾 SQLite Database**: High-performance local storage with FTS5 search and category indexing
- **📊 Progress Tracking**: Monitor download progress and resume interrupted downloads
- **🔄 Backup Strategy**: Organized ZIP files for offline processing and complete library backup
- **🎯 Selective Downloads**: Choose specific languages, books, or content ranges
- **⚡ Quick Start**: Automated setup for immediate use with sample content

## Installation

### Global Installation (Recommended)

```bash
npm install -g @surgbc/egw-writings-downloader
```

### From Source

```bash
git clone https://github.com/gospelsounders/egw-writings-mcp.git
cd egw-writings-mcp

# Interactive installation (choose what to install)
make install-cli

# Install specific package
make install-cli PACKAGE=downloader
make install-cli PACKAGE=api-server
make install-cli PACKAGE=local-server

# Install all packages
make install-cli PACKAGE=all
```

**Note**: If you get permission errors during installation, try:
- `sudo make install-cli` (requires admin privileges)
- Or configure npm prefix: `npm config set prefix ~/.npm-global` then `make install-cli`

### Using Make Targets (Development)

```bash
# See all available commands
make help

# Complete development setup
make setup-dev
```

## Usage

### Quick Start

Set up a sample database with English content using ZIP method:

```bash
egw-downloader quick-start --zip
```

### Core Commands

#### 1. Setup Commands

```bash
# Download all available languages
egw-downloader languages

# Download books metadata for English
egw-downloader books --lang en

# Download books for specific language
egw-downloader books --lang es
```

#### 2. ZIP Download Workflow (Recommended)

**Enhanced with Category Organization**: ZIPs are now automatically organized by category and language!

```bash
# Download ZIP files directly from API (no setup required!)
egw-downloader download:zips --limit 10              # Download 10 book ZIPs
egw-downloader download:zips --book 21               # Download specific book ZIP  
egw-downloader download:zips --lang en --limit 50    # Download 50 English book ZIPs
egw-downloader download:zips --lang es --limit 25    # Download 25 Spanish book ZIPs

# Download ALL books for a language (fetches complete API list)
egw-downloader download:zips --lang en --limit 1499  # All English books (~1499)
egw-downloader download:zips --lang es --limit 800   # All Spanish books (~800)

# Parse downloaded ZIPs into database (works with new folder structure)
egw-downloader parse:zips                            # Parse all ZIPs (searches category folders)
egw-downloader parse:zips --book 21                  # Parse specific book ZIP
egw-downloader parse:zips --zip-dir /path/to/zips/   # Parse from custom directory
```

#### 3. Direct Content Download (API Method)

```bash
# Download content using API method
egw-downloader content --book 21                     # Specific book
egw-downloader content --lang en --limit 10          # Multiple books
egw-downloader content --book 21 --zip               # Use ZIP method instead
```

#### 4. Comprehensive Downloads

```bash
# Download everything with ZIP method
egw-downloader download:all --content --limit 20 --zip

# Complete ZIP workflow for all books
egw-downloader download:all --content --limit 1499 --zip
```

#### 5. Utility Commands

```bash
# Show database statistics
egw-downloader stats

# Update book categories
egw-downloader categorize

# Get help for any command
egw-downloader --help
egw-downloader download:zips --help
```

## Workflows

### Complete ZIP Workflow (Recommended)

**🎉 New Enhanced Workflow**: No database setup required! Fetches directly from API with automatic organization.

```bash
# 1. Download all book ZIPs directly from API (can be done with good internet)
egw-downloader download:zips --lang en --limit 1499  # All English books
egw-downloader download:zips --lang es --limit 800   # All Spanish books (optional)

# 2. Parse ZIPs into database (can be done offline)
egw-downloader parse:zips

# 3. Verify results
egw-downloader stats
```

**Legacy Workflow** (still supported):
```bash
# 1. Setup database structure (optional - only needed for specific workflows)
egw-downloader languages
egw-downloader books --lang en

# 2. Continue with ZIP workflow above...
```

### Sample Content Workflow

For testing or limited content:

```bash
# Quick setup with sample content
egw-downloader quick-start --zip

# Or manual sample workflow
egw-downloader languages
egw-downloader books --lang en
egw-downloader download:zips --limit 10
egw-downloader parse:zips
```

### Specific Books Workflow

For targeted book downloads:

```bash
# Setup
egw-downloader languages  
egw-downloader books --lang en

# Download specific books
egw-downloader download:zips --book 21    # Counsels on Sabbath School Work
egw-downloader download:zips --book 29    # The Desire of Ages  
egw-downloader download:zips --book 39    # The Great Controversy

# Parse specific books
egw-downloader parse:zips --book 21
egw-downloader parse:zips --book 29
egw-downloader parse:zips --book 39
```

### Make Targets (Development)

When working with the source code, use make targets for convenience:

```bash
# See all available commands
make help

# Quick workflows  
make egw-quick-start                              # Quick start with ZIP method
make workflow-sample                              # Sample workflow (10 books)
make workflow-specific BOOKS="21 29 39"          # Download specific books

# Individual operations (Enhanced with faster builds!)
make egw-languages                                # Download languages
make egw-books                                    # Download English books metadata
make egw-download-zip BOOK=21                     # Download specific book ZIP
make egw-download-zips LIMIT=50                   # Download 50 book ZIPs (API direct)
make egw-download-zips LIMIT=50 LANGUAGE=es       # Download 50 Spanish book ZIPs
make egw-parse-all-zips                           # Parse all downloaded ZIPs (searches category folders)
make egw-stats                                    # Show database statistics

# Complete workflows
make workflow-zip-all                             # Download ALL book ZIPs (1499 books)

# Multi-language examples
make egw-download-zips LIMIT=100 LANGUAGE=en      # 100 English books
make egw-download-zips LIMIT=50 LANGUAGE=es       # 50 Spanish books  
make egw-download-zips LIMIT=30 LANGUAGE=fr       # 30 French books
```

## File Organization

**🎉 Enhanced Organization**: The downloader now creates a category-based file structure for better organization:

```
data/
├── egw-writings.db              # Main SQLite database
├── zips/                        # Downloaded ZIP files (organized by category!)
│   ├── egw/                     # Ellen G. White writings
│   │   ├── books/               # Major books
│   │   │   ├── AA_127.zip       # Acts of the Apostles
│   │   │   ├── DA_130.zip       # Desire of Ages  
│   │   │   └── GC_132.zip       # Great Controversy
│   │   ├── pamphlets/           # Pamphlets and small works
│   │   │   ├── CSA_2.zip
│   │   │   └── ApM_6.zip
│   │   ├── testimonies/         # Testimonies series
│   │   ├── manuscripts/         # Manuscript releases
│   │   └── letters/             # Letter collections
│   ├── pioneer/                 # Pioneer authors
│   │   └── books/
│   ├── periodical/              # Historical periodicals
│   │   └── historical/
│   └── reference/               # Reference materials
│       └── biblical/
└── library/                     # Extracted content (organized by language & category)
    ├── en/                      # English language
    │   └── egw/                 # Category
    │       ├── books/           # Subcategory
    │       │   ├── AA_127/      # Book directory
    │       │   │   ├── info.json
    │       │   │   ├── 127.5.json
    │       │   │   └── ...
    │       │   └── DA_130/
    │       └── pamphlets/
    ├── es/                      # Spanish language
    │   └── egw/
    └── fr/                      # French language
        └── egw/
```

### Multi-Language Support

The enhanced structure supports multiple languages seamlessly:

```bash
# Download different languages
make egw-download-zips LIMIT=50 LANGUAGE=en    # English books → data/zips/egw/books/
make egw-download-zips LIMIT=30 LANGUAGE=es    # Spanish books → data/zips/egw/libros/  
make egw-download-zips LIMIT=20 LANGUAGE=fr    # French books → data/zips/egw/livres/

# All parsed into separate language folders in library/
```

### Environment Variables

Create a `.env` file or set environment variables:

```bash
EGW_CLIENT_ID=your_client_id
EGW_CLIENT_SECRET=your_client_secret
```

## Database Structure

The tool creates a SQLite database with:

- **Languages**: Available language codes and metadata
- **Books**: Complete book metadata including authors, publication info
- **Paragraphs**: Full content with reference codes and search indexing
- **FTS5 Search**: Full-text search capabilities for fast content discovery

## Performance

- **Local Database**: No API calls needed after initial download
- **FTS5 Search**: Millisecond search response times
- **Efficient Storage**: Optimized schema with proper indexing
- **Incremental Updates**: Download only new or changed content

## Educational and Research Use

This tool is designed for educational and research purposes. The EGW writings may be subject to copyright restrictions. Users are responsible for ensuring their use complies with applicable copyright laws and fair use guidelines.

## Organization

Developed by [Gospel Sounders](https://github.com/gospelsounders) under the leadership of [Brian Onang'o](https://github.com/surgbc).

## License

MIT - Open source software for educational and research use.

## Support

- [Issues](https://github.com/gospelsounders/egw-writings-mcp/issues)
- [Documentation](https://github.com/gospelsounders/egw-writings-mcp#readme)