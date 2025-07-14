import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Data Documentation - EGH Research',
  description: 'Complete data documentation including books database, ZIP structures, and API endpoints',
}

export default function DataDocsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-4">EGH Research Data Documentation</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300">
          Comprehensive documentation of all data sources, structures, and APIs
        </p>
      </div>

      {/* Quick Navigation */}
      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">📋 Quick Navigation</h2>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link href="/docs/api" className="block p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-blue-800 dark:text-blue-200">🔌 REST API</h3>
            <p className="text-gray-600 dark:text-gray-300">Complete API reference with examples</p>
          </Link>
          
          <Link href="#books-data" className="block p-6 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-green-800 dark:text-green-200">📚 Books Database</h3>
            <p className="text-gray-600 dark:text-gray-300">Aggregated books from a.egwwritings.org</p>
          </Link>
          
          <Link href="#zip-structure" className="block p-6 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-purple-800 dark:text-purple-200">🗜️ ZIP Structure</h3>
            <p className="text-gray-600 dark:text-gray-300">Downloaded content organization</p>
          </Link>
          
          <Link href="#docker-usage" className="block p-6 bg-orange-50 dark:bg-orange-900/20 rounded-lg hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-orange-800 dark:text-orange-200">🐳 Docker Usage</h3>
            <p className="text-gray-600 dark:text-gray-300">Container deployment guide</p>
          </Link>
          
          <Link href="#mcp-protocol" className="block p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-indigo-800 dark:text-indigo-200">🔗 MCP Protocol</h3>
            <p className="text-gray-600 dark:text-gray-300">Model Context Protocol tools</p>
          </Link>
          
          <Link href="#download-links" className="block p-6 bg-teal-50 dark:bg-teal-900/20 rounded-lg hover:bg-teal-100 dark:hover:bg-teal-900/30 transition-colors">
            <h3 className="text-xl font-semibold mb-2 text-teal-800 dark:text-teal-200">⬇️ Data Downloads</h3>
            <p className="text-gray-600 dark:text-gray-300">Direct access to JSON data files</p>
          </Link>
        </div>
      </section>

      {/* Books Database */}
      <section id="books-data" className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">📚 Books Database</h2>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            Our database contains <strong>893 books</strong> in <strong>151 languages</strong> aggregated from API calls to a.egwwritings.org.
            This data is continuously updated and provides comprehensive metadata for all available writings.
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div className="bg-white dark:bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">893</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Total Books</div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">151</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Languages</div>
            </div>
            <div className="bg-white dark:bg-gray-700 p-4 rounded">
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">100%</div>
              <div className="text-sm text-gray-600 dark:text-gray-300">Downloaded</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xl font-semibold">📊 Data Structure</h3>
          <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`{
  "stats": {
    "languages": 151,
    "books": 893,
    "paragraphs": 30,
    "downloadedBooks": 893
  },
  "books": [
    {
      "book_id": 127,
      "title": "The Acts of the Apostles",
      "author": "Ellen G. White",
      "lang": "en",
      "pub_year": "1911",
      "folder": "books",
      "npages": 594,
      "elements": 2547
    }
  ]
}`}
          </pre>
          
          <div className="flex space-x-4">
            <a 
              href="https://gospelsounders.github.io/egw-writings-mcp/books.json" 
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              📥 Download books.json
            </a>
            <a 
              href="https://gospelsounders.github.io/egw-writings-mcp/data.json" 
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              📥 Download complete data.json
            </a>
          </div>
        </div>
      </section>

      {/* ZIP Structure */}
      <section id="zip-structure" className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">🗜️ ZIP File Structure</h2>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            All content is organized in ZIP files matching the exact structure from a.egwwritings.org.
            This ensures compatibility and easy synchronization with the original source.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold">📁 Directory Structure</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-blue-600 dark:text-blue-400">📚 EGW Writings</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <li>📖 <code>egw/books/</code> - Main published books</li>
                <li>🙏 <code>egw/devotional/</code> - Daily devotional books</li>
                <li>✉️ <code>egw/letters/</code> - Letters and correspondences</li>
                <li>📝 <code>egw/manuscripts/</code> - Manuscript releases</li>
                <li>📄 <code>egw/pamphlets/</code> - Pamphlets and articles</li>
                <li>💬 <code>egw/testimonies/</code> - Testimonies series</li>
              </ul>
            </div>
            
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
              <h4 className="font-semibold mb-3 text-green-600 dark:text-green-400">📜 Historical Content</h4>
              <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-300">
                <li>⛪ <code>historical/denominational/</code> - Church history</li>
                <li>🌍 <code>historical/general/</code> - General historical works</li>
                <li>🗞️ <code>periodical/</code> - Periodical publications</li>
                <li>👥 <code>pioneer/</code> - Pioneer writings</li>
                <li>📊 <code>reference/</code> - Reference materials</li>
              </ul>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold">🏷️ File Naming Convention</h3>
          <div className="bg-gray-900 text-green-400 p-4 rounded text-sm">
            <code>{`{BOOK_CODE}_{BOOK_ID}.zip`}</code>
            <br />
            <span className="text-gray-400">Example: </span>
            <code>AA_127.zip</code> (Acts of the Apostles, Book ID 127)
          </div>
          
          <div className="flex space-x-4">
            <a 
              href="https://gospelsounders.github.io/egw-writings-mcp/zip-structure.json" 
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              📥 Download zip-structure.json
            </a>
          </div>
        </div>
      </section>

      {/* Docker Usage */}
      <section id="docker-usage" className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">🐳 Docker Usage</h2>
        
        <div className="space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-blue-800 dark:text-blue-200">Quick Start</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`# Pull and run the latest image
docker pull ghcr.io/gospelsounders/egw-writings-mcp/egh-research-server:latest
docker run -p 3000:3000 ghcr.io/gospelsounders/egw-writings-mcp/egh-research-server:latest

# Test the API
curl http://localhost:3000/health`}
            </pre>
          </div>
          
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-green-800 dark:text-green-200">Docker Compose</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`# Download compose file
curl -O https://raw.githubusercontent.com/GospelSounders/egw-writings-mcp/master/apps/local-server/docker-compose.yml

# Start services
docker-compose up -d

# View logs
docker-compose logs -f`}
            </pre>
          </div>
          
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg">
            <h3 className="text-xl font-semibold mb-3 text-orange-800 dark:text-orange-200">Production Deployment</h3>
            <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`# Run with persistent storage and health checks
docker run -d \\
  --name egh-research \\
  -p 3000:3000 \\
  -v egh-data:/app/apps/local-server/data \\
  --restart unless-stopped \\
  --health-cmd="curl -f http://localhost:3000/health || exit 1" \\
  --health-interval=30s \\
  ghcr.io/gospelsounders/egw-writings-mcp/egh-research-server:latest`}
            </pre>
          </div>
        </div>
      </section>

      {/* MCP Protocol */}
      <section id="mcp-protocol" className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">🔗 Model Context Protocol (MCP)</h2>
        
        <div className="bg-gray-50 dark:bg-gray-800 p-6 rounded-lg mb-6">
          <p className="text-gray-700 dark:text-gray-300 mb-4">
            The EGH Research Server also provides MCP tools for AI assistants like Claude.
            This enables intelligent research assistance with natural language queries.
          </p>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold">🛠️ Available Tools</h3>
          
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">search_local</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Full-text search with FTS5 highlighting</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">get_local_book</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Book information and metadata</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">get_local_content</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Chapter and paragraph content</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">list_local_books</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Paginated book listings</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">browse_by_reference</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Navigation by EGW reference codes</p>
            </div>
            <div className="bg-white dark:bg-gray-800 border rounded-lg p-4">
              <h4 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">get_database_stats</h4>
              <p className="text-sm text-gray-600 dark:text-gray-300">Database metrics and statistics</p>
            </div>
          </div>
          
          <h3 className="text-xl font-semibold">⚙️ MCP Configuration</h3>
          <pre className="bg-gray-900 text-green-400 p-4 rounded text-sm overflow-x-auto">
{`{
  "mcpServers": {
    "egh-research": {
      "command": "npx",
      "args": ["@surgbc/egw-research-server"],
      "env": {}
    }
  }
}`}
          </pre>
        </div>
      </section>

      {/* Download Links */}
      <section id="download-links" className="mb-12">
        <h2 className="text-3xl font-semibold mb-6">⬇️ Direct Data Downloads</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">📊 JSON Data Files</h3>
            <div className="space-y-3">
              <a 
                href="https://gospelsounders.github.io/egw-writings-mcp/data.json" 
                className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                📄 data.json - Complete documentation data
              </a>
              <a 
                href="https://gospelsounders.github.io/egw-writings-mcp/books.json" 
                className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                📚 books.json - Books database with metadata
              </a>
              <a 
                href="https://gospelsounders.github.io/egw-writings-mcp/zip-structure.json" 
                className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                🗜️ zip-structure.json - ZIP file organization
              </a>
              <a 
                href="https://gospelsounders.github.io/egw-writings-mcp/api-endpoints.json" 
                className="block text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                target="_blank"
                rel="noopener noreferrer"
              >
                🔌 api-endpoints.json - REST API documentation
              </a>
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">🔄 Update Frequency</h3>
            <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
              <li>📅 <strong>Daily</strong> - Books metadata sync</li>
              <li>📅 <strong>Weekly</strong> - ZIP structure updates</li>
              <li>📅 <strong>On Release</strong> - API documentation</li>
              <li>📅 <strong>Real-time</strong> - Documentation generation</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Footer */}
      <section className="mt-16 pt-8 border-t dark:border-gray-700">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            Questions or need help with the data?
          </p>
          <div className="flex justify-center space-x-6 text-blue-600 dark:text-blue-400">
            <a href="https://github.com/GospelSounders/egw-writings-mcp" className="hover:underline">GitHub Repository</a>
            <a href="https://github.com/GospelSounders/egw-writings-mcp/issues" className="hover:underline">Report Issues</a>
            <a href="https://github.com/GospelSounders/egw-writings-mcp/discussions" className="hover:underline">Discussions</a>
          </div>
        </div>
      </section>
    </div>
  )
}