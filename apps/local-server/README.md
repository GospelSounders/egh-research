# @surgbc/egw-writings-local-server

MCP server providing fast access to local EGW Writings database for educational and research purposes.

## Overview

This Model Context Protocol (MCP) server provides high-performance access to a locally downloaded EGW Writings database. It offers millisecond search response times and works offline, making it ideal for research and educational applications.

## Features

- **Local Database**: No internet required after initial setup
- **High Performance**: Millisecond search response times with FTS5
- **Full-text Search**: Advanced search capabilities with highlighting
- **Reference Navigation**: Browse by EGW reference codes (e.g., "AA 15.1")
- **Context Retrieval**: Get surrounding paragraphs for better understanding
- **Statistics**: Database metrics and content overview
- **Offline Access**: Complete independence from API availability

## Installation

```bash
npm install -g @surgbc/egw-writings-local-server
```

## Prerequisites

You need a populated EGW writings database. Use the downloader tool first:

```bash
npx @surgbc/egw-writings-downloader quick-start
```

## Usage

### As MCP Server

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "egw-local": {
      "command": "egw-local-server"
    }
  }
}
```

### Available Tools

- `search_local` - Full-text search with FTS5 highlighting
- `get_local_book` - Get book information from local database
- `get_local_content` - Retrieve paragraphs from books
- `list_local_books` - List available books with filters
- `browse_by_reference` - Find content by EGW reference (e.g., "AA 15.1")
- `get_context` - Get surrounding paragraphs for context
- `get_database_stats` - Database statistics and metrics

## Search Features

### Full-text Search
```
search_local "righteousness by faith"
```

### Reference Navigation
```
browse_by_reference "DA 123"
browse_by_reference "Great Controversy 45.2"
```

### Context Retrieval
```
get_context "para_id_123" --before 2 --after 2
```

## Performance Benefits

- **No Rate Limits**: Unlimited local queries
- **Fast Response**: Sub-millisecond search times
- **Offline Operation**: Works without internet connection
- **Full Content**: Complete database with all downloaded content
- **Advanced Search**: FTS5 with ranking and highlighting

## Educational and Research Use

This tool is designed for educational and research purposes. The EGW writings may be subject to copyright restrictions. Users are responsible for ensuring their use complies with applicable copyright laws and fair use guidelines.

## Organization

Developed by [Gospel Sounders](https://github.com/gospelsounders) under the leadership of [Brian Onang'o](https://github.com/surgbc).

## License

MIT - Open source software for educational and research use.

## Support

- [Issues](https://github.com/gospelsounders/egw-writings-mcp/issues)
- [Documentation](https://github.com/gospelsounders/egw-writings-mcp#readme)