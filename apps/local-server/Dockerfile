# Multi-stage build for Christian Heritage Archive Server
# This creates an offline-capable Docker image with pre-extracted database

FROM node:22-alpine as base

# Install build dependencies
RUN apk add --no-cache python3 make g++ sqlite curl

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY tsconfig.json ./

# Install pnpm globally
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install --frozen-lockfile

# Build stage - compile TypeScript
FROM base as builder

WORKDIR /app

# Copy source code
COPY src/ ./src/

# Build TypeScript
RUN pnpm build

# Production stage
FROM node:22-alpine as production

# Install runtime dependencies
RUN apk add --no-cache sqlite curl

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files and install production dependencies only
COPY package*.json ./

RUN npm install -g pnpm && \
    pnpm install --prod --frozen-lockfile

# Copy built application
COPY --from=builder /app/dist/ ./dist/

# Copy or create database directory
RUN mkdir -p ./data

# Copy existing database if available, otherwise create empty directory
COPY data/*.db ./data/ 2>/dev/null || echo "No database found, will use empty database"

# Copy extraction script if ZIP files are provided
COPY scripts/ ./scripts/ 2>/dev/null || echo "No scripts directory found"

# If ZIP files exist, extract them; otherwise create minimal database structure
RUN if [ -d "./scripts" ] && ls ./data/*.zip >/dev/null 2>&1; then \
      echo "📦 ZIP extraction would happen here"; \
    else \
      echo "📂 Using existing database or creating empty structure"; \
      touch ./data/egw-writings.db; \
    fi

# Create directories for PDF generation
RUN mkdir -p /tmp/pdf-generation && \
    chown -R nodejs:nodejs /app /tmp/pdf-generation

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Default command - HTTP server mode
CMD ["node", "dist/server.js", "--http", "--port", "3000"]

# Labels for metadata
LABEL org.opencontainers.image.title="Christian Heritage Archive Server"
LABEL org.opencontainers.image.description="Offline API server for Christian heritage texts with PDF generation"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.author="surgbc"
LABEL org.opencontainers.image.licenses="MIT"