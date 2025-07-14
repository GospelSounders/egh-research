# EGH Research

**Complete offline research platform for Ellen Gould Harmon's writings with PDF generation and Docker deployment**

[![Docker Build](https://github.com/Surgbc/egh-research/actions/workflows/docker-build.yml/badge.svg)](https://github.com/Surgbc/egh-research/actions/workflows/docker-build.yml)
[![CI](https://github.com/Surgbc/egh-research/actions/workflows/ci.yml/badge.svg)](https://github.com/Surgbc/egh-research/actions/workflows/ci.yml)
[![NPM Package](https://img.shields.io/badge/npm-@surgbc%2Fegw--research-blue)](https://www.npmjs.com/~surgbc)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🚀 Quick Start with Docker

The fastest way to get started is with our pre-built Docker image:

```bash
# Pull and run the latest image
docker pull ghcr.io/gospelsounders/egw-writings-mcp/egh-research-server:latest
docker run -p 3000:3000 ghcr.io/gospelsounders/egw-writings-mcp/egh-research-server:latest

# Test the API
curl http://localhost:3000/health
curl http://localhost:3000/api/docs
```

**🌐 [Live API Documentation](https://surgbc.github.io/egh-research/docs/api)** | **📚 [Full Documentation](https://surgbc.github.io/egh-research/)**

## 🌟 Overview

EGH Research is a comprehensive platform for offline research of Ellen Gould Harmon's writings, providing both **Model Context Protocol (MCP)** and **HTTP REST API** access with advanced PDF generation capabilities.

### **Key Components**

- **🔌 EGH Research Server**: Dual-protocol server (MCP + HTTP API) with offline database
- **📥 Content Downloader**: Bulk data extraction and database population tools
- **📊 Web Interface**: Modern React-based research platform
- **🐳 Docker Deployment**: Production-ready containerization with GitHub Actions

### **Core Features**

- **⚡ Offline Operation**: Complete independence from external services
- **🔍 Advanced Search**: FTS5 full-text search with sub-millisecond response times
- **📄 PDF Generation**: On-demand PDF creation with customizable formatting
- **🌐 Dual APIs**: Both MCP and REST APIs for maximum compatibility
- **🐳 Docker Ready**: Multi-architecture containers (AMD64, ARM64)
- **📱 Modern UI**: Responsive web interface for research

## 📦 Architecture

```
├── apps/
│   ├── local-server/        # Main EGH Research Server (MCP + HTTP API)
│   ├── downloader/          # Data extraction and database tools
│   ├── api-server/          # Live API integration server
│   └── website/             # React-based research interface
├── packages/
│   ├── shared/              # Common utilities and database management
│   └── egw-pdf-generator/   # PDF generation engine
└── .github/workflows/       # CI/CD with Docker builds
```

## 🛠 Installation Options

### Option 1: Docker (Recommended)

```bash
# Using Docker Run
docker pull ghcr.io/gospelsounders/egw-writings-mcp/egh-research-server:latest
docker run -p 3000:3000 ghcr.io/gospelsounders/egw-writings-mcp/egh-research-server:latest

# Using Docker Compose
curl -O https://raw.githubusercontent.com/GospelSounders/egw-writings-mcp/master/apps/local-server/docker-compose.yml
docker-compose up -d
```

### Option 2: Global NPM Installation

```bash
# Install the research server
npm install -g @surgbc/egw-research-server

# Install supporting tools
npm install -g @surgbc/egw-writings-downloader

# Start the server
egw-research-server --http --port 3000
```

### Option 3: Local Development

```bash
# Clone and setup
git clone https://github.com/surgbc/egh-research.git
cd egh-research
pnpm install && pnpm build

# Start HTTP server
cd apps/local-server
npm run start:http

# Or start MCP server
npm run start:mcp
```

## 🔧 Configuration

### Environment Variables

- `NODE_ENV`: Development/production mode
- `LOG_LEVEL`: Logging verbosity (debug, info, warn, error)
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

### Database Setup

```bash
# Download sample data
npx @surgbc/egw-writings-downloader quick-start --zip

# Or use the Make target (development)
make egw-quick-start
```

## 📖 API Reference

### **HTTP REST API**

```bash
# Health and status
GET /health
GET /api/docs
GET /stats

# Content access
GET /content/books?page=1&limit=50&lang=en
GET /content/books/{id}
GET /content/books/{id}/toc
GET /search?q=righteousness&limit=20

# PDF generation
POST /content/books/{id}/generate-pdf
GET /pdf/status/{token}
GET /pdf/download/{token}
```

### **MCP Tools**

- `search_local` - Full-text search with FTS5 highlighting
- `get_local_book` - Book information and metadata
- `get_local_content` - Chapter and paragraph content
- `list_local_books` - Paginated book listings
- `browse_by_reference` - Navigation by EGW reference codes
- `get_context` - Contextual paragraph retrieval
- `get_database_stats` - Database metrics and statistics

**📚 [Complete API Documentation](https://surgbc.github.io/egh-research/docs/api)**

## 🐳 Docker & Production

### Production Deployment

```bash
# Pull latest production image
docker pull ghcr.io/surgbc/egh-research-server:latest

# Run with persistent storage and health checks
docker run -d \
  --name egh-research \
  -p 3000:3000 \
  -v egh-data:/app/apps/local-server/data \
  --restart unless-stopped \
  --health-cmd="curl -f http://localhost:3000/health || exit 1" \
  --health-interval=30s \
  ghcr.io/surgbc/egh-research-server:latest
```

### Build from Source

```bash
# Build local image
./scripts/build-docker.sh --tag local

# Build with custom registry
./scripts/build-docker.sh --registry ghcr.io/yourname --tag v1.0.0
```

### GitHub Actions

The project includes comprehensive CI/CD workflows:

- **🔨 Build & Test**: Automated testing and building on push/PR
- **🐳 Docker Build**: Multi-architecture container builds
- **📋 Security Scan**: Vulnerability scanning with Trivy
- **📚 Documentation**: Auto-deployment to GitHub Pages
- **🚀 Release**: Automated releases with Docker publishing

## 📊 Performance & Capabilities

### **Search Performance**
- **Sub-millisecond** search response times
- **FTS5** full-text search with ranking
- **Highlighted** search results with context
- **Reference navigation** (e.g., "AA 15.1", "DA 123")

### **PDF Generation**
- **Customizable formatting**: Page size, fonts, margins
- **Table of contents**: Automatic generation with configurable depth
- **Background processing**: Non-blocking PDF generation
- **Progress tracking**: Real-time generation status
- **Automatic cleanup**: Scheduled file cleanup

### **Database Features**
- **SQLite** with FTS5 full-text search
- **Efficient storage** with reference indexing
- **Multi-language** support (150+ languages)
- **Offline operation** - no internet required after setup

## 🎯 Use Cases

### **Research Applications**
- **Academic research** on Ellen Gould Harmon's writings
- **Topic compilation** across multiple books
- **Reference verification** and cross-referencing
- **Contextual analysis** with surrounding paragraphs

### **Educational Use**
- **Classroom instruction** with offline access
- **Student research projects** with PDF generation
- **Study materials** creation with custom formatting
- **Reference lookup** during presentations

### **Technical Integration**
- **MCP clients** (Claude, etc.) for AI-assisted research
- **REST API** integration for custom applications
- **Docker deployment** for institutional use
- **Batch processing** for large-scale analysis

## 🤝 Contributing

We welcome contributions! Here's how to get started:

### Development Workflow

1. **Fork** the repository
2. **Create** a feature branch from `main`
3. **Make** your changes with tests
4. **Run** `pnpm lint && pnpm build && pnpm test`
5. **Submit** a pull request

### Development Commands

```bash
# Setup development environment
pnpm install
pnpm build

# Run tests and linting
pnpm test
pnpm lint

# Start development servers
pnpm dev                    # All packages in watch mode
pnpm --filter local-server dev   # Just the research server
pnpm --filter website dev        # Just the web interface

# Build for production
pnpm build

# Docker development
./scripts/build-docker.sh --tag dev
docker run -p 3000:3000 egh-research-server:dev
```

## 📚 Educational and Research Use

This platform is designed specifically for **educational and research purposes** related to Ellen Gould Harmon's writings. The software:

- **Respects intellectual property** rights and fair use guidelines
- **Provides tools** for legitimate academic research
- **Enables offline access** for educational institutions
- **Supports citation** and reference verification

### **Key Benefits for Researchers**
- **Complete offline access** - No dependency on external services
- **Advanced search capabilities** - Find specific passages quickly
- **PDF generation** - Create formatted documents for study
- **Reference cross-linking** - Navigate between related content
- **Context preservation** - Maintain surrounding content for accuracy

### **Academic Citation**

When using this software in academic work, please cite:

```
EGH Research Platform. (2024). 
Offline research platform for Ellen Gould Harmon's writings.
GitHub: https://github.com/surgbc/egh-research
```

## 🔒 Security & Privacy

- **No data collection**: All processing happens locally
- **Open source**: Fully auditable codebase
- **Security scanning**: Automated vulnerability detection
- **Container security**: Non-root user and minimal attack surface

## 📄 License

MIT License - Open source software for educational and research use.

See [LICENSE](./LICENSE) for full terms.

## 🙋‍♂️ Support

- **📖 Documentation**: [https://surgbc.github.io/egh-research/](https://surgbc.github.io/egh-research/)
- **🐛 Issues**: [GitHub Issues](https://github.com/surgbc/egh-research/issues)
- **💬 Discussions**: [GitHub Discussions](https://github.com/surgbc/egh-research/discussions)
- **📧 Email**: Contact maintainers for security issues

---

**Developed by [surgbc](https://github.com/surgbc) • Built with ❤️ for educational and research purposes**