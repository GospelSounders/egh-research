# Multi-stage build for Christian Heritage Archive Server
# Build from monorepo root to handle dependencies properly

FROM node:22-alpine as base

# Install build dependencies
RUN apk add --no-cache python3 python3-dev py3-setuptools make g++ sqlite curl

WORKDIR /app

# Copy package manager files
COPY package*.json ./
COPY pnpm-*.yaml* ./
COPY turbo.json ./

# Install pnpm globally
RUN npm install -g pnpm

# Copy all workspace packages
COPY packages/ ./packages/
COPY apps/ ./apps/

# Install dependencies for entire monorepo
RUN pnpm install --frozen-lockfile

# Build all packages
RUN pnpm build

# Production stage
FROM node:22-alpine as production

# Install runtime dependencies
RUN apk add --no-cache sqlite curl

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Copy package files
COPY package*.json ./
COPY pnpm-*.yaml* ./

# Install pnpm and production dependencies
RUN npm install -g pnpm && \
    pnpm install --prod --frozen-lockfile

# Copy built applications and packages
COPY --from=base /app/packages/shared/dist/ ./packages/shared/dist/
COPY --from=base /app/packages/egw-pdf-generator/dist/ ./packages/egw-pdf-generator/dist/
COPY --from=base /app/apps/local-server/dist/ ./apps/local-server/dist/

# Copy package.json files for runtime resolution
COPY packages/shared/package.json ./packages/shared/
COPY packages/egw-pdf-generator/package.json ./packages/egw-pdf-generator/
COPY apps/local-server/package.json ./apps/local-server/

# Create database directory
RUN mkdir -p ./apps/local-server/data

# Copy existing database if available
COPY apps/local-server/data/*.db ./apps/local-server/data/ 2>/dev/null || echo 'No database found'

# If no database exists, create a minimal one
RUN if [ ! -f "./apps/local-server/data/egw-writings.db" ]; then \
      touch ./apps/local-server/data/egw-writings.db; \
      echo "Created empty database file"; \
    fi

# Create directories for PDF generation
RUN mkdir -p /tmp/pdf-generation && \
    chown -R nodejs:nodejs /app /tmp/pdf-generation

# Switch to non-root user
USER nodejs

# Set working directory to local-server
WORKDIR /app/apps/local-server

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Default command - HTTP server mode
CMD ["node", "dist/server.js", "--http", "--port", "3000"]

# Labels for metadata
LABEL org.opencontainers.image.title="EGH Research Server"
LABEL org.opencontainers.image.description="Offline API server for EGH (Ellen Gould Harmon) research with PDF generation"
LABEL org.opencontainers.image.version="1.0.0"
LABEL org.opencontainers.image.author="surgbc"
LABEL org.opencontainers.image.licenses="MIT"