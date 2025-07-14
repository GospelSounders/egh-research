import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'EGH Research API Documentation',
  description: 'Complete API reference for the EGH Research Server - offline access to Ellen Gould Harmon writings with PDF generation',
}

export default function APIDocsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">EGH Research API Documentation</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Complete REST API reference for offline access to Ellen Gould Harmon's writings
        </p>
      </div>

      {/* Quick Start */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">🚀 Quick Start</h2>
        
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-200">Docker (Recommended)</h3>
            <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`# Pull and run
docker pull ghcr.io/gospelsounders/egw-writings-mcp/egh-research-server:latest
docker run -p 3000:3000 ghcr.io/gospelsounders/egw-writings-mcp/egh-research-server:latest

# Test the API
curl http://localhost:3000/health`}
            </pre>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-green-800 dark:text-green-200">Local Development</h3>
            <pre className="bg-gray-800 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`# Clone and build
git clone https://github.com/GospelSounders/egh-research.git
cd egh-research
pnpm install && pnpm build

# Start server
cd apps/local-server
npm run start:http`}
            </pre>
          </div>
        </div>
      </section>

      {/* Base Information */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">📋 API Overview</h2>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Base URL</h4>
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">http://localhost:3000</code>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Content Type</h4>
              <code className="bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">application/json</code>
            </div>
            <div>
              <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Authentication</h4>
              <span className="text-green-600 dark:text-green-400">None required (local)</span>
            </div>
          </div>
        </div>
      </section>

      {/* System Endpoints */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">🏥 System Endpoints</h2>
        
        <div className="space-y-6">
          <div className="border dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3">GET</span>
              <code className="text-lg font-mono">/health</code>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Returns server health status and database statistics
            </p>
            <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <summary className="cursor-pointer font-medium">Example Response</summary>
              <pre className="mt-3 bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": {
    "books": 150,
    "paragraphs": 125000,
    "languages": 12
  }
}`}
              </pre>
            </details>
          </div>

          <div className="border dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3">GET</span>
              <code className="text-lg font-mono">/api/docs</code>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Returns interactive API documentation with all available endpoints
            </p>
          </div>

          <div className="border dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3">GET</span>
              <code className="text-lg font-mono">/stats</code>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Returns detailed database and server statistics including PDF job information
            </p>
          </div>
        </div>
      </section>

      {/* Content Endpoints */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">📚 Content Endpoints</h2>
        
        <div className="space-y-6">
          <div className="border dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3">GET</span>
              <code className="text-lg font-mono">/content/books</code>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              List books with pagination support
            </p>
            
            <h4 className="font-semibold mb-3">Query Parameters</h4>
            <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded mb-4">
              <ul className="space-y-2 text-sm">
                <li><code>page</code> (number, optional): Page number (default: 1)</li>
                <li><code>limit</code> (number, optional): Items per page (default: 100)</li>
                <li><code>lang</code> (string, optional): Language code (default: en)</li>
                <li><code>folder</code> (string, optional): Filter by folder/category</li>
              </ul>
            </div>
            
            <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <summary className="cursor-pointer font-medium">Example Request & Response</summary>
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Request:</p>
                <pre className="bg-gray-900 text-yellow-400 p-3 rounded text-sm mb-3">
{`GET /content/books?page=1&limit=5&lang=en`}
                </pre>
                <p className="text-sm font-medium mb-2">Response:</p>
                <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`{
  "count": 150,
  "ipp": 5,
  "next": "http://localhost:3000/content/books?lang=en&limit=5&page=2",
  "previous": null,
  "results": [
    {
      "book_id": 1,
      "title": "The Acts of the Apostles",
      "author": "Ellen G. White",
      "pub_year": "1911",
      "lang": "en",
      "npages": 594,
      "files": {
        "pdf": "/content/books/1/generate-pdf",
        "download": "/content/books/1/download"
      }
    }
  ]
}`}
                </pre>
              </div>
            </details>
          </div>

          <div className="border dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3">GET</span>
              <code className="text-lg font-mono">/content/books/{`{id}`}</code>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Get detailed information about a specific book
            </p>
          </div>

          <div className="border dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3">GET</span>
              <code className="text-lg font-mono">/content/books/{`{id}`}/toc</code>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Get table of contents for a book
            </p>
          </div>

          <div className="border dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3">GET</span>
              <code className="text-lg font-mono">/content/books/{`{id}`}/chapters/{`{chapter}`}</code>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Get content for a specific chapter
            </p>
          </div>
        </div>
      </section>

      {/* PDF Generation */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">📄 PDF Generation</h2>
        
        <div className="space-y-6">
          <div className="border dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mr-3">POST</span>
              <code className="text-lg font-mono">/content/books/{`{id}`}/generate-pdf</code>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Start PDF generation for a book with custom formatting options
            </p>
            
            <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <summary className="cursor-pointer font-medium">Request Body & Response</summary>
              <div className="mt-3">
                <p className="text-sm font-medium mb-2">Request Body (optional):</p>
                <pre className="bg-gray-900 text-yellow-400 p-3 rounded text-sm mb-3 overflow-x-auto">
{`{
  "config": {
    "pageSize": "A4",
    "fontSize": 12,
    "fontFamily": "Times",
    "margins": {
      "top": 72,
      "bottom": 72,
      "left": 72,
      "right": 72
    },
    "toc": {
      "generate": true,
      "maxDepth": 2
    },
    "pagination": {
      "show": true,
      "style": "bottom-center"
    }
  }
}`}
                </pre>
                <p className="text-sm font-medium mb-2">Response:</p>
                <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`{
  "token": "abc123-def456-ghi789",
  "status": "queued",
  "message": "PDF generation started",
  "statusUrl": "/pdf/status/abc123-def456-ghi789",
  "downloadUrl": "/pdf/download/abc123-def456-ghi789"
}`}
                </pre>
              </div>
            </details>
          </div>

          <div className="border dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3">GET</span>
              <code className="text-lg font-mono">/pdf/status/{`{token}`}</code>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Check the status of a PDF generation job
            </p>
            
            <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
              <summary className="cursor-pointer font-medium">Example Response</summary>
              <pre className="mt-3 bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`{
  "token": "abc123-def456-ghi789",
  "status": "generating",
  "progress": 45,
  "stage": "processing-chapters",
  "currentChapter": "Chapter 15",
  "totalChapters": 58,
  "estimatedTimeRemaining": "2 minutes",
  "createdAt": "2024-01-15T10:30:00.000Z"
}`}
              </pre>
            </details>
          </div>

          <div className="border dark:border-gray-700 rounded-lg p-6">
            <div className="flex items-center mb-4">
              <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3">GET</span>
              <code className="text-lg font-mono">/pdf/download/{`{token}`}</code>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Download the generated PDF file (only available when status is "completed")
            </p>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">🔍 Search</h2>
        
        <div className="border dark:border-gray-700 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium mr-3">GET</span>
            <code className="text-lg font-mono">/search</code>
          </div>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Perform full-text search across all content with FTS5 support
          </p>
          
          <h4 className="font-semibold mb-3">Query Parameters</h4>
          <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded mb-4">
            <ul className="space-y-2 text-sm">
              <li><code>q</code> (string, required): Search query</li>
              <li><code>limit</code> (number, optional): Maximum results (default: 20)</li>
              <li><code>offset</code> (number, optional): Result offset (default: 0)</li>
            </ul>
          </div>
          
          <details className="bg-gray-50 dark:bg-gray-800 p-4 rounded">
            <summary className="cursor-pointer font-medium">Example Request & Response</summary>
            <div className="mt-3">
              <p className="text-sm font-medium mb-2">Request:</p>
              <pre className="bg-gray-900 text-yellow-400 p-3 rounded text-sm mb-3">
{`GET /search?q=righteousness%20by%20faith&limit=5`}
              </pre>
              <p className="text-sm font-medium mb-2">Response:</p>
              <pre className="bg-gray-900 text-green-400 p-3 rounded text-sm overflow-x-auto">
{`{
  "query": "righteousness by faith",
  "total": 284,
  "limit": 5,
  "offset": 0,
  "results": [
    {
      "book_id": 15,
      "title": "Steps to Christ",
      "author": "Ellen G. White",
      "reference": "SC 62.2",
      "snippet": "...justification by <mark>faith</mark>, or <mark>righteousness</mark> by <mark>faith</mark>, is the act of God...",
      "url": "/content/books/15"
    }
  ]
}`}
              </pre>
            </div>
          </details>
        </div>
      </section>

      {/* Error Handling */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">⚠️ Error Handling</h2>
        
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <p className="mb-4">All errors follow a consistent JSON format:</p>
          <pre className="bg-gray-900 text-red-400 p-4 rounded text-sm">
{`{
  "error": "Book not found",
  "status": 404,
  "timestamp": "2024-01-15T10:30:00.000Z"
}`}
          </pre>
          
          <h4 className="font-semibold mt-6 mb-3">Common HTTP Status Codes</h4>
          <ul className="space-y-2 text-sm">
            <li><code>200</code> - Success</li>
            <li><code>400</code> - Bad Request (invalid parameters)</li>
            <li><code>404</code> - Not Found (book, PDF job, etc.)</li>
            <li><code>500</code> - Internal Server Error</li>
          </ul>
        </div>
      </section>

      {/* SDK Examples */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">💻 SDK Examples</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">JavaScript/Node.js</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`// Search for content
const response = await fetch(
  'http://localhost:3000/search?q=righteousness'
);
const data = await response.json();

// Generate PDF
const pdfResponse = await fetch(
  'http://localhost:3000/content/books/1/generate-pdf',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      config: { pageSize: 'A4', fontSize: 12 }
    })
  }
);
const pdfJob = await pdfResponse.json();`}
            </pre>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Python</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`import requests

# Search for content
response = requests.get(
    'http://localhost:3000/search',
    params={'q': 'righteousness', 'limit': 10}
)
data = response.json()

# Generate PDF
pdf_response = requests.post(
    'http://localhost:3000/content/books/1/generate-pdf',
    json={
        'config': {'pageSize': 'A4', 'fontSize': 12}
    }
)
pdf_job = pdf_response.json()`}
            </pre>
          </div>
        </div>
      </section>

      {/* Docker & Deployment */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">🐳 Docker & Deployment</h2>
        
        <div className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Production Deployment</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`# Pull latest image
docker pull ghcr.io/gospelsounders/egw-writings-mcp/egh-research-server:latest

# Run with persistent storage
docker run -d \\
  --name egh-research \\
  -p 3000:3000 \\
  -v egh-data:/app/apps/local-server/data \\
  --restart unless-stopped \\
  ghcr.io/gospelsounders/egw-writings-mcp/egh-research-server:latest`}
            </pre>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3">Docker Compose</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`# Download compose file
curl -O https://raw.githubusercontent.com/GospelSounders/egw-writings-mcp/master/apps/local-server/docker-compose.yml

# Start services
docker-compose up -d

# View logs
docker-compose logs -f`}
            </pre>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="mt-16 pt-8 border-t dark:border-gray-700">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Questions or need help? Check out our resources:
          </p>
          <div className="flex justify-center space-x-6 text-blue-600 dark:text-blue-400">
            <a href="https://github.com/GospelSounders/egh-research" className="hover:underline">GitHub Repository</a>
            <a href="https://github.com/GospelSounders/egh-research/issues" className="hover:underline">Report Issues</a>
            <a href="https://github.com/GospelSounders/egh-research/discussions" className="hover:underline">Discussions</a>
          </div>
        </div>
      </section>
    </div>
  )
}