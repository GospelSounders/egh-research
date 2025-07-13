# @surgbc/egw-writings-api-server

MCP server providing live access to Ellen G. White (EGW) Writings API for educational and research purposes.

## Overview

This Model Context Protocol (MCP) server provides real-time access to the EGW Writings database through the official API. It supports searching writings, browsing books by language, and retrieving detailed content with proper citation formatting.

## Features

- **Live API Access**: Real-time data from the official EGW Writings API
- **Full-text Search**: Search across all available writings
- **Multi-language Support**: Access content in 150+ languages
- **Book Management**: Browse and retrieve book metadata and content
- **Citation Support**: Proper reference formatting for academic use
- **OAuth Authentication**: Secure API access with automatic token management

## Installation

```bash
npm install -g @surgbc/egw-writings-api-server
```

## Usage

### As MCP Server

Add to your MCP client configuration:

```json
{
  "mcpServers": {
    "egw-api": {
      "command": "egw-api-server",
      "env": {
        "EGW_CLIENT_ID": "your_client_id",
        "EGW_CLIENT_SECRET": "your_client_secret"
      }
    }
  }
}
```

### Environment Variables

Create a `.env` file or set environment variables:

```bash
EGW_CLIENT_ID=your_client_id
EGW_CLIENT_SECRET=your_client_secret
```

### Available Tools

- `search_writings` - Search EGW writings with full-text search
- `get_book_details` - Get detailed information about a specific book
- `get_book_content` - Retrieve chapters and content from a book
- `list_languages` - Get all available languages
- `list_books` - List books by language and filters
- `get_suggestions` - Get search suggestions and autocomplete

## Educational and Research Use

This tool is designed for educational and research purposes. The EGW writings may be subject to copyright restrictions. Users are responsible for ensuring their use complies with applicable copyright laws and fair use guidelines.

## Organization

Developed by [Gospel Sounders](https://github.com/gospelsounders) under the leadership of [Brian Onang'o](https://github.com/surgbc).

## License

MIT - Open source software for educational and research use.

## Support

- [Issues](https://github.com/gospelsounders/egw-writings-mcp/issues)
- [Documentation](https://github.com/gospelsounders/egw-writings-mcp#readme)