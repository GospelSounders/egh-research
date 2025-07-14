#!/bin/bash

# Docker build script for Christian Heritage Archive Server
# This script builds the Docker image with proper tagging

set -e

echo "🐳 Building EGH Research Docker image..."

# Default values
IMAGE_NAME="egh-research-server"
TAG="latest"
REGISTRY=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    --tag|-t)
      TAG="$2"
      shift 2
      ;;
    --registry|-r)
      REGISTRY="$2"
      shift 2
      ;;
    --name|-n)
      IMAGE_NAME="$2"
      shift 2
      ;;
    --help|-h)
      echo "Usage: $0 [OPTIONS]"
      echo "Options:"
      echo "  --tag, -t TAG        Docker image tag (default: latest)"
      echo "  --registry, -r REG   Docker registry (default: none)"
      echo "  --name, -n NAME      Image name (default: egh-research-server)"
      echo "  --help, -h           Show this help"
      exit 0
      ;;
    *)
      echo "Unknown option $1"
      exit 1
      ;;
  esac
done

# Construct full image name
if [ -n "$REGISTRY" ]; then
  FULL_IMAGE_NAME="$REGISTRY/$IMAGE_NAME:$TAG"
else
  FULL_IMAGE_NAME="$IMAGE_NAME:$TAG"
fi

echo "📋 Build configuration:"
echo "   Image: $FULL_IMAGE_NAME"
echo "   Context: $(pwd)"

# Check if database exists
if [ ! -f "data/egw-writings.db" ]; then
  echo "⚠️  No database found at data/egw-writings.db"
  echo "   The Docker build will create an empty database structure"
fi

# Check for ZIP files
ZIP_COUNT=$(find data/ -name "*.zip" 2>/dev/null | wc -l)
if [ "$ZIP_COUNT" -gt 0 ]; then
  echo "📦 Found $ZIP_COUNT ZIP files for extraction"
else
  echo "📂 No ZIP files found - using existing database if available"
fi

# Build the image
echo "🔨 Starting Docker build..."
docker build \
  --tag "$FULL_IMAGE_NAME" \
  --build-arg BUILD_DATE="$(date -u +'%Y-%m-%dT%H:%M:%SZ')" \
  --build-arg VCS_REF="$(git rev-parse --short HEAD 2>/dev/null || echo 'unknown')" \
  .

echo "✅ Docker build completed successfully"
echo "🚀 To run the container:"
echo "   docker run -p 3000:3000 $FULL_IMAGE_NAME"
echo ""
echo "📖 Or use docker-compose:"
echo "   docker-compose up -d"

# Optional: Push to registry
if [ -n "$REGISTRY" ]; then
  read -p "🤔 Push to registry $REGISTRY? (y/N): " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📤 Pushing to registry..."
    docker push "$FULL_IMAGE_NAME"
    echo "✅ Push completed"
  fi
fi