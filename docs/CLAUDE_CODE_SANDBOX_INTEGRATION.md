# Claude Code Sandbox Integration for EGW Research

This document outlines the integration of `claude-code-sandbox` for automated research compilation in the EGW Research platform.

## Overview

The Claude Code Sandbox integration enables fully automated research compilation workflows where users can input research topics and receive professional PDF compilations without manual intervention.

## Architecture

```
User Input (Topic) → Website API → Claude Code Sandbox → EGW Tools → PDF Output
```

### Components

1. **Website Interface** (`/research/compile`)
   - User-friendly topic input and configuration
   - Real-time progress tracking
   - Download interface for completed research

2. **API Endpoint** (`/api/research/compile`)
   - Receives research requests from frontend
   - Manages job queue and status tracking
   - Interfaces with Claude Code Sandbox

3. **Sandbox Configuration** (`claude-sandbox-config.json`)
   - Docker environment with EGW tools pre-installed
   - Security constraints and resource limits
   - Initial prompts for Claude Code

4. **Automation Scripts** (`scripts/research-automation.js`)
   - Command-line interface for batch processing
   - Job management and monitoring utilities
   - Integration with existing EGW packages

## Setup Instructions

### Prerequisites

- Node.js 18+
- Docker or Podman
- Claude Code installed globally
- EGW database downloaded and configured

### Installation

```bash
# Install claude-code-sandbox
npm install -g @textcortex/claude-code-sandbox

# Verify installation
claude-sandbox --version

# Test configuration
claude-sandbox config
```

### Configuration

1. **Environment Variables**
```bash
export CLAUDE_API_KEY="your-claude-api-key"
export EGW_DATABASE_PATH="/path/to/egw.db"
```

2. **Sandbox Configuration**
Edit `claude-sandbox-config.json` to match your environment:
```json
{
  "environment": {
    "EGW_DATABASE_PATH": "/workspace/data/egw.db",
    "CLAUDE_API_KEY": "${CLAUDE_API_KEY}"
  },
  "mounts": [
    {
      "source": "./data",
      "target": "/workspace/data",
      "readonly": true
    }
  ]
}
```

## Usage

### Web Interface

1. Navigate to `/research/compile`
2. Enter research topic (e.g., "salvation by faith")
3. Configure compilation settings
4. Click "Start Compilation"
5. Monitor progress in real-time
6. Download completed PDF

### Command Line

```bash
# Single topic compilation
node scripts/research-automation.js research "health principles"

# Batch compilation
node scripts/research-automation.js batch example-batch-topics.json

# List completed research
node scripts/research-automation.js list
```

### API Integration

```javascript
// Start compilation
const response = await fetch('/api/research/compile', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    topic: 'salvation by faith',
    maxResults: 50,
    groupBy: 'book',
    citationStyle: 'academic'
  })
});

const { jobId } = await response.json();

// Check status
const status = await fetch(`/api/research/compile?jobId=${jobId}`);
const progress = await status.json();
```

## Workflow Details

### 1. Topic Input & Validation
- User provides research topic via web interface
- System validates topic and applies rate limiting
- Configuration options are validated and defaults applied

### 2. Sandbox Initialization
- Claude Code Sandbox starts with EGW-specific configuration
- Docker container loads with pre-installed EGW tools
- Environment variables and mounts are configured

### 3. Automated Research Process
Claude Code performs the following steps automatically:

```bash
# Search EGW database
egw-search "salvation by faith" --limit 50 --format json > results.json

# Analyze and organize results
egw-analyze results.json --group-by book --output organized.json

# Generate PDF compilation
egw-pdf-generator research \
  --input organized.json \
  --output /workspace/output/salvation-by-faith.pdf \
  --citation-style academic \
  --include-toc
```

### 4. Output Generation
- Professional PDF with proper formatting
- Academic citations and bibliography
- Table of contents and chapter organization
- Copyright-compliant pagination

### 5. Delivery
- Generated PDF saved to output directory
- Job status updated to "completed"
- Download link provided to user

## Security Considerations

### Container Isolation
- Each compilation runs in isolated Docker container
- Network access limited to essential services
- File system access restricted to workspace

### Resource Limits
```json
{
  "security": {
    "resourceLimits": {
      "memory": "2GB",
      "cpu": "2",
      "disk": "10GB"
    },
    "networkAccess": "limited",
    "allowedHosts": [
      "api.anthropic.com",
      "registry.npmjs.org"
    ]
  }
}
```

### Data Protection
- EGW database mounted read-only
- No persistent storage of user data
- Automatic cleanup of temporary files

## Performance Optimization

### Caching Strategy
- Pre-built Docker images with EGW tools
- Database query result caching
- Template-based PDF generation

### Parallel Processing
- Multiple sandbox instances for concurrent jobs
- Queue management for high-volume requests
- Load balancing across available resources

### Resource Management
- Automatic cleanup of completed jobs
- Memory optimization for large compilations
- Disk space monitoring and cleanup

## Monitoring & Logging

### Job Tracking
```javascript
{
  "jobId": "job_1234567890_abc123",
  "status": "running",
  "progress": 75,
  "topic": "health principles",
  "startTime": "2024-01-01T10:00:00Z",
  "estimatedCompletion": "2024-01-01T10:03:00Z"
}
```

### Health Monitoring
- Container health checks
- Resource usage monitoring
- Error rate tracking
- Performance metrics

### Debugging
- Comprehensive logging of compilation steps
- Error capture and reporting
- Sandbox session recording for troubleshooting

## Error Handling

### Common Issues
1. **Database Connection Errors**
   - Retry logic with exponential backoff
   - Fallback to cached results where possible

2. **Resource Exhaustion**
   - Queue management to prevent overload
   - Graceful degradation of service quality

3. **Claude API Rate Limits**
   - Request throttling and queuing
   - Priority system for different request types

4. **PDF Generation Failures**
   - Fallback to alternative formats
   - Partial result delivery when possible

### Recovery Mechanisms
- Automatic job retry for transient failures
- Manual intervention interface for complex issues
- Data recovery from partial completions

## Future Enhancements

### Planned Features
1. **Advanced Topic Analysis**
   - AI-powered topic expansion and related concepts
   - Semantic search improvements
   - Cross-reference detection

2. **Enhanced Output Formats**
   - Interactive web presentations
   - Audio narration generation
   - Multi-language support

3. **Collaboration Features**
   - Shared research projects
   - Annotation and commenting system
   - Version control for research iterations

4. **Integration Expansions**
   - Integration with external theological databases
   - Citation management tools
   - Academic publishing workflows

### Technical Improvements
- Kubernetes deployment for scalability
- GraphQL API for improved client integration
- Real-time WebSocket updates for progress tracking
- Machine learning for result relevance ranking

## Troubleshooting

### Common Problems

**Sandbox Won't Start**
```bash
# Check Docker status
docker ps

# Verify Claude Code installation
claude --version

# Test sandbox configuration
claude-sandbox config
```

**Compilation Fails**
```bash
# Check logs
claude-sandbox logs <container-id>

# Verify database path
ls -la /path/to/egw.db

# Test EGW tools manually
egw-search "test" --limit 5
```

**Slow Performance**
- Check available system resources
- Verify database optimization
- Monitor network connectivity
- Review container resource limits

### Support Resources
- **GitHub Issues**: Report bugs and feature requests
- **Documentation**: Comprehensive guides and API reference
- **Community Forum**: Discussion and troubleshooting help
- **Example Configurations**: Ready-to-use setup templates

## Conclusion

The Claude Code Sandbox integration transforms the EGW Research platform from a manual tool into a fully automated research assistant. This enables researchers to focus on analysis and interpretation rather than data gathering and formatting, significantly accelerating the research process while maintaining academic standards and copyright compliance.