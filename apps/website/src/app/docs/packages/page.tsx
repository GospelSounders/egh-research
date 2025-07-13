import { Metadata } from 'next';
import Link from 'next/link';
import { 
  CodeBracketIcon,
  DocumentTextIcon,
  CubeIcon,
  CommandLineIcon,
  BookOpenIcon,
  CloudIcon
} from '@heroicons/react/24/outline';

export const metadata: Metadata = {
  title: 'Package Documentation',
  description: 'Complete documentation for all EGW Research packages that can be used independently in your own projects.',
};

export default function PackagesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary-700 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold font-serif mb-6">
            Package Documentation
          </h1>
          <p className="text-xl text-primary-100 leading-relaxed">
            Independent npm packages for integrating EGW content into your own applications and workflows.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Quick Start */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold font-serif text-gray-900 mb-6">Available Packages</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Shared Package */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <CubeIcon className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">egw-writings-shared</h3>
                  <p className="text-sm text-gray-600">Core database utilities</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                SQLite database interface, search functionality, and content retrieval methods.
              </p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono mb-4">
                npm install @surgbc/egw-writings-shared
              </div>
              <Link
                href="#shared-package"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View Documentation →
              </Link>
            </div>

            {/* PDF Generator */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <DocumentTextIcon className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">egw-pdf-generator</h3>
                  <p className="text-sm text-gray-600">PDF generation tools</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Professional PDF generation with configurable formatting and copyright compliance.
              </p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono mb-4">
                npm install @surgbc/egw-pdf-generator
              </div>
              <Link
                href="#pdf-generator"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View Documentation →
              </Link>
            </div>

            {/* API Server */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <CloudIcon className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">egw-api-server</h3>
                  <p className="text-sm text-gray-600">RESTful API server</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Complete REST API for EGW content with search, filtering, and content endpoints.
              </p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono mb-4">
                npm install @surgbc/egw-api-server
              </div>
              <Link
                href="#api-server"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View Documentation →
              </Link>
            </div>

            {/* Downloader */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <CommandLineIcon className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">egw-downloader</h3>
                  <p className="text-sm text-gray-600">Content downloader</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Download and manage EGW content with database setup and initialization tools.
              </p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono mb-4">
                npm install @surgbc/egw-downloader
              </div>
              <Link
                href="#downloader"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View Documentation →
              </Link>
            </div>

            {/* Local Server */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center mb-4">
                <CodeBracketIcon className="h-8 w-8 text-primary-600 mr-3" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">egw-local-server</h3>
                  <p className="text-sm text-gray-600">Development server</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-4">
                Local development server with hot reload and debugging capabilities.
              </p>
              <div className="bg-gray-900 text-gray-100 p-3 rounded text-xs font-mono mb-4">
                npm install @surgbc/egw-local-server
              </div>
              <Link
                href="#local-server"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium"
              >
                View Documentation →
              </Link>
            </div>
          </div>
        </section>

        {/* Complete Documentation Link */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 text-white p-8 rounded-lg">
            <div className="flex items-start">
              <BookOpenIcon className="h-12 w-12 text-primary-100 mr-6 flex-shrink-0" />
              <div>
                <h2 className="text-2xl font-bold mb-4">Complete Documentation</h2>
                <p className="text-primary-100 mb-6 leading-relaxed">
                  Access the full package documentation with detailed installation instructions, 
                  API references, usage examples, and integration patterns for all available packages.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <a
                    href="https://github.com/gospelsounders/egw-writings-mcp/blob/main/docs/packages/README.md"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 bg-white text-primary-700 rounded-md hover:bg-gray-50 transition-colors font-medium"
                  >
                    View Full Documentation
                    <BookOpenIcon className="ml-2 h-4 w-4" />
                  </a>
                  <a
                    href="https://github.com/gospelsounders/egw-writings-mcp"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center px-6 py-3 border border-primary-200 text-primary-100 rounded-md hover:bg-primary-600 transition-colors font-medium"
                  >
                    GitHub Repository
                    <CodeBracketIcon className="ml-2 h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Examples */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold font-serif text-gray-900 mb-8">Quick Start Examples</h2>
          
          <div className="space-y-8">
            
            {/* Database Search Example */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Database Search</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
                <pre className="text-sm"><code>{`import { EGWDatabase } from '@surgbc/egw-writings-shared';

const db = new EGWDatabase();

// Search for content
const results = db.search('salvation', 10, 0);
console.log(\`Found \${results.length} results\`);

// Get books
const books = db.getBooks('en');
console.log(\`Available books: \${books.length}\`);

// Clean up
db.close();`}</code></pre>
              </div>
            </div>

            {/* PDF Generation Example */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Generate PDF from Command Line</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
                <pre className="text-sm"><code>{`# Install globally
npm install -g @surgbc/egw-pdf-generator

# Generate PDF for book ID 1
egw-pdf-generator book --book-id 1 --output desire-of-ages.pdf

# Custom formatting
egw-pdf-generator book \\
  --book-id 1 \\
  --output custom-book.pdf \\
  --page-size A4 \\
  --font-family Times \\
  --font-size 12 \\
  --no-pagination

# List available books
egw-pdf-generator list-books --limit 10`}</code></pre>
              </div>
            </div>

            {/* API Server Example */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Start API Server</h3>
              <div className="bg-gray-900 text-gray-100 p-4 rounded overflow-x-auto">
                <pre className="text-sm"><code>{`# Start API server
egw-api-server start --port 3000 --cors

# Test endpoints
curl "http://localhost:3000/api/books?limit=5"
curl "http://localhost:3000/api/search?q=salvation&limit=10"
curl "http://localhost:3000/api/books/1/paragraphs?limit=50"`}</code></pre>
              </div>
            </div>
          </div>
        </section>

        {/* Integration Patterns */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold font-serif text-gray-900 mb-6">Integration Patterns</h2>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Web Application</h3>
              <p className="text-gray-600 text-sm mb-4">
                Use the API server with any frontend framework to build custom EGW content applications.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• React, Vue, Angular frontends</li>
                <li>• Mobile app backends</li>
                <li>• Progressive web apps</li>
                <li>• Content management systems</li>
              </ul>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Automation & Scripts</h3>
              <p className="text-gray-600 text-sm mb-4">
                Integrate packages into automation workflows for content processing and publishing.
              </p>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>• Automated PDF generation</li>
                <li>• Content synchronization</li>
                <li>• Research compilation scripts</li>
                <li>• Backup and archival tools</li>
              </ul>
            </div>
          </div>
        </section>

        {/* Support */}
        <section>
          <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
            <h2 className="text-lg font-semibold text-blue-800 mb-3">Need Help?</h2>
            <div className="text-blue-700 space-y-2 text-sm">
              <p>
                <strong>GitHub Issues:</strong> Report bugs and request features at our{' '}
                <a 
                  href="https://github.com/gospelsounders/egw-writings-mcp/issues" 
                  className="text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub repository
                </a>
              </p>
              <p>
                <strong>Discussions:</strong> Ask questions and share ideas in{' '}
                <a 
                  href="https://github.com/gospelsounders/egw-writings-mcp/discussions" 
                  className="text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub Discussions
                </a>
              </p>
              <p>
                <strong>Contributing:</strong> We welcome contributions! See our contributing guide for details.
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}