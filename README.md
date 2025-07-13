# EGW Writings MCP Servers

A comprehensive Model Context Protocol (MCP) server ecosystem for accessing Ellen G. White writings for educational and research purposes.

## Overview

This monorepo contains three MCP servers and shared utilities for working with Ellen G. White writings:

- **API Server**: Live access to the EGW Writings API
- **Downloader**: Bulk data extraction and database population 
- **Local Server**: High-performance offline access with full-text search
- **Shared Library**: Common utilities, types, and database management

## Quick Start

### 1. Install Global Packages

```bash
# Install all three servers globally
npm install -g @gospelsounders/egw-writings-api-server
npm install -g @gospelsounders/egw-writings-downloader  
npm install -g @gospelsounders/egw-writings-local-server
```

### 2. Set Up Environment

Create a `.env` file with your API credentials:

```bash
EGW_CLIENT_ID=your_client_id_here
EGW_CLIENT_SECRET=your_client_secret_here
```

### 3. Download Sample Data

```bash
egw-downloader quick-start
```

### 4. Configure MCP Client

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
    },
    "egw-local": {
      "command": "egw-local-server"
    }
  }
}
```

## Packages

### [@gospelsounders/egw-writings-api-server](./apps/api-server/)
MCP server providing live access to the EGW Writings API with real-time search and content retrieval.

**Features:**
- Real-time API access
- Multi-language support (150+ languages)
- Full-text search
- Book management and citation support

### [@gospelsounders/egw-writings-downloader](./apps/downloader/)
Command-line tool for downloading and indexing EGW writings into a local SQLite database.

**Features:**
- Bulk download capabilities
- Progress tracking and resume
- SQLite with FTS5 search indexing
- Selective language and content filtering

### [@gospelsounders/egw-writings-local-server](./apps/local-server/)
MCP server providing high-performance access to locally downloaded EGW writings database.

**Features:**
- Offline operation
- Millisecond search response times
- Reference-based navigation (e.g., "AA 15.1")
- Context retrieval and highlighting

### [@gospelsounders/egw-writings-shared](./packages/shared/)
Shared utilities, types, and database management for the EGW Writings ecosystem.

**Features:**
- OAuth 2.0 authentication
- API client with auto-retry
- SQLite database management
- Complete TypeScript definitions

## Development

### Prerequisites

- Node.js 18+
- pnpm 8+

### Setup

```bash
# Clone repository
git clone https://github.com/gospelsounders/egw-writings-mcp.git
cd egw-writings-mcp

# Install dependencies
pnpm install

# Build all packages
pnpm build

# Set up environment
cp .env.example .env
# Edit .env with your credentials
```

### Commands

```bash
# Build all packages
pnpm build

# Run linting
pnpm lint

# Clean build artifacts
pnpm clean

# Test downloader
pnpm --filter downloader quick-start

# Test local server
pnpm --filter local-server dev
```

## Architecture

```
├── apps/
│   ├── api-server/          # Live API MCP server
│   ├── downloader/          # Data extraction CLI
│   └── local-server/        # Local database MCP server
├── packages/
│   └── shared/              # Common utilities and types
└── .github/
    └── workflows/           # CI/CD for npm publishing
```

## Educational and Research Use

This project is designed specifically for educational and research purposes. The Ellen G. White writings may be subject to copyright restrictions. Users are responsible for ensuring their use complies with applicable copyright laws and fair use guidelines.

### Academic Citation

When using this software in academic work, please cite:

```
Gospel Sounders. (2024). EGW Writings MCP Servers. 
GitHub: https://github.com/gospelsounders/egw-writings-mcp
```

## API Credentials

This software requires API credentials from the EGW Writings service. The credentials are used exclusively for:

- Accessing publicly available writings
- Educational and research purposes
- Non-commercial use cases

## Performance

- **Local Server**: Sub-millisecond search response times
- **Database**: SQLite with FTS5 full-text search
- **Storage**: Efficient compression with reference indexing
- **Memory**: Optimized for large content databases

## Contributing

1. Fork the repository
2. Create a feature branch from `dev`
3. Make your changes
4. Ensure tests pass and code is linted
5. Submit a pull request

## Organization

Developed by [Gospel Sounders](https://github.com/gospelsounders) under the leadership of [Brian Onang'o](https://github.com/surgbc).

## License

UNLICENSED - Proprietary software for educational and research use.

See [LICENSE](./LICENSE) for full terms.

## Support

- [Issues](https://github.com/gospelsounders/egw-writings-mcp/issues)
- [Discussions](https://github.com/gospelsounders/egw-writings-mcp/discussions)

## Security

If you discover a security vulnerability, please send an email to the maintainers rather than creating a public issue.

---

*Built with ❤️ for educational and research purposes*