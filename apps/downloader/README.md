# @gospelsounders/egw-writings-downloader

Data extraction and database population tool for Ellen G. White (EGW) Writings for educational and research purposes.

## Overview

This command-line tool downloads and indexes EGW writings content into a local SQLite database with full-text search capabilities. It's designed to create a high-performance local database for research and educational use.

## Features

- **Bulk Download**: Download languages, books, and content efficiently
- **SQLite Database**: High-performance local storage with FTS5 search
- **Progress Tracking**: Monitor download progress and resume interrupted downloads
- **Rate Limiting**: Respectful API usage with built-in delays
- **Selective Downloads**: Choose specific languages, books, or content ranges
- **Quick Start**: Automated setup for immediate use

## Installation

```bash
npm install -g @gospelsounders/egw-writings-downloader
```

## Usage

### Quick Start

Set up a sample database with English content:

```bash
egw-downloader quick-start
```

### Individual Commands

```bash
# Download all available languages
egw-downloader languages

# Download books for a specific language
egw-downloader books --lang en --limit 50

# Download content for books
egw-downloader content --lang en --limit 10

# Download specific book content
egw-downloader content --book 123

# Show database statistics
egw-downloader stats
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

UNLICENSED - Proprietary software for educational and research use.

## Support

- [Issues](https://github.com/gospelsounders/egw-writings-mcp/issues)
- [Documentation](https://github.com/gospelsounders/egw-writings-mcp#readme)