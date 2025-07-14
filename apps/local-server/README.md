# EGH Research Server

**Offline API server for Ellen Gould Harmon research with PDF generation capabilities**

[![Docker Build](https://github.com/surgbc/egh-research/actions/workflows/docker-build.yml/badge.svg)](https://github.com/surgbc/egh-research/actions/workflows/docker-build.yml)
[![CI](https://github.com/surgbc/egh-research/actions/workflows/ci.yml/badge.svg)](https://github.com/surgbc/egh-research/actions/workflows/ci.yml)

## Overview

The EGH Research Server provides both **Model Context Protocol (MCP)** and **HTTP REST API** access to a locally stored database of Ellen Gould Harmon's writings. This enables offline research capabilities with fast search, content retrieval, and on-demand PDF generation.

## 🚀 Quick Start with Docker

### Using Docker Run
```bash
# Pull and run the latest image
docker pull ghcr.io/surgbc/egh-research-server:latest
docker run -p 3000:3000 ghcr.io/surgbc/egh-research-server:latest

# Access the API
curl http://localhost:3000/health
```

### Using Docker Compose
```bash
# Download docker-compose.yml
curl -O https://raw.githubusercontent.com/surgbc/egh-research/main/apps/local-server/docker-compose.yml

# Start the service
docker-compose up -d

# Check status
docker-compose ps
```

## 🌟 Features

### **Dual Protocol Support**
- **MCP Server**: For Claude and other MCP clients
- **HTTP REST API**: Standard web API with full compatibility

### **Research Capabilities**
- **Offline Database**: Complete independence from internet connectivity
- **Full-text Search**: Advanced FTS5 search with sub-millisecond response times
- **Reference Navigation**: Browse by EGW reference codes (e.g., "AA 15.1", "DA 123")
- **Context Retrieval**: Get surrounding paragraphs for better understanding
- **Content Statistics**: Comprehensive database metrics

### **PDF Generation**
- **On-demand PDF creation** with customizable formatting
- **Background processing** with real-time progress tracking
- **Configurable options**: Page size, fonts, margins, table of contents
- **Multiple download formats** and automatic cleanup

### **Production Ready**
- **Docker containerization** with multi-architecture support (AMD64, ARM64)
- **Health monitoring** and observability endpoints
- **Automatic builds** via GitHub Actions
- **Security scanning** and dependency management

## 📖 API Documentation

### Health Check
```bash
GET /health
```

### API Documentation
```bash
GET /api/docs
```

### Search Content
```bash
GET /search?q=righteousness&limit=10
```

### List Books
```bash
GET /content/books?page=1&limit=50&lang=en
```

### Generate PDF
```bash
POST /content/books/123/generate-pdf
Content-Type: application/json

{
  "config": {
    "pageSize": "A4",
    "fontSize": 12,
    "fontFamily": "Times"
  }
}
```

### Check PDF Status
```bash
GET /pdf/status/{token}
```

### Download PDF
```bash
GET /pdf/download/{token}
```

## 🛠 Development Setup

### Prerequisites
- **Node.js 18+**
- **pnpm** package manager
- **Docker** (optional)

### Local Development
```bash
# Clone repository
git clone https://github.com/surgbc/egh-research.git
cd egh-research

# Install dependencies
pnpm install

# Build packages
pnpm build

# Start HTTP server
cd apps/local-server
npm run start:http

# Or start MCP server
npm run start:mcp
```

### Database Setup
You need a populated database. Use the downloader tool:
```bash
npx @surgbc/egw-writings-downloader quick-start
```

## 🐳 Docker

### Build Local Image
```bash
# From project root
./scripts/build-docker.sh --tag local

# Run locally built image
docker run -p 3000:3000 egh-research-server:local
```

### Production Deployment
```bash
# Production image from GitHub Container Registry
docker pull ghcr.io/surgbc/egh-research-server:latest

# Run with persistent data volume
docker run -d \
  --name egh-research \
  -p 3000:3000 \
  -v egh-data:/app/apps/local-server/data \
  ghcr.io/surgbc/egh-research-server:latest
```

## 🔧 Configuration

### Environment Variables
- `NODE_ENV`: Development/production mode
- `LOG_LEVEL`: Logging verbosity
- `PDF_CLEANUP_INTERVAL`: PDF file cleanup frequency

### MCP Client Configuration
```json
{
  "mcpServers": {
    "egh-research": {
      "command": "egw-research-server"
    }
  }
}
```

## 📊 Available MCP Tools

- `search_local` - Full-text search with FTS5 highlighting
- `get_local_book` - Get book information from local database  
- `get_local_content` - Retrieve paragraphs from books
- `list_local_books` - List available books with filters
- `browse_by_reference` - Find content by EGW reference codes
- `get_context` - Get surrounding paragraphs for context
- `get_database_stats` - Database statistics and metrics

## 🏥 Health & Monitoring

### Health Check Endpoint
```bash
curl http://localhost:3000/health
```

### Container Health Check
Docker includes automatic health checks that monitor the `/health` endpoint.

### Statistics
```bash
curl http://localhost:3000/stats
```

## 📚 Educational and Research Use

This tool is designed specifically for educational and research purposes related to Ellen Gould Harmon's writings. The software respects intellectual property rights and provides tools for fair use research and study.

### Key Benefits for Researchers
- **Complete offline access** - No dependency on external services
- **Advanced search capabilities** - Find specific passages quickly
- **Reference cross-linking** - Navigate between related content
- **PDF generation** - Create formatted documents for study
- **Context preservation** - Maintain surrounding content for accuracy

## 🤝 Contributing

We welcome contributions! Please see our contributing guidelines and code of conduct.

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Submit a pull request

### Building and Testing
```bash
# Run tests
pnpm test

# Lint code  
pnpm lint

# Build all packages
pnpm build

# Test Docker build
./scripts/build-docker.sh --tag test
```

## 📄 License

MIT License - Open source software for educational and research use.

## 🙋‍♂️ Support

- **Issues**: [GitHub Issues](https://github.com/surgbc/egh-research/issues)
- **Documentation**: [Project Documentation](https://surgbc.github.io/egh-research/)
- **Discussions**: [GitHub Discussions](https://github.com/surgbc/egh-research/discussions)

---

**Developed by [surgbc](https://github.com/surgbc) • Part of the EGH Research Project**