'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  DocumentTextIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  ArrowDownTrayIcon,
  ArrowLeftIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';
import { egwAPI, type APIBook } from '@/lib/egw-api';
import Link from 'next/link';

interface PDFConfig {
  pageSize: 'A4' | 'Letter' | 'Legal';
  fontSize: number;
  fontFamily: 'Times' | 'Helvetica' | 'Courier';
  margins: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
  includeTableOfContents: boolean;
  showPageNumbers: boolean;
  includeCoverPage: boolean;
  citationStyle: 'academic' | 'simple' | 'detailed';
}

interface GenerationProgress {
  stage: 'idle' | 'fetching' | 'processing' | 'formatting' | 'generating' | 'complete' | 'error';
  progress: number;
  message: string;
  downloadUrl?: string;
}

export default function BookPDFPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = parseInt(params.bookId as string);

  const [book, setBook] = useState<APIBook | null>(null);
  const [config, setConfig] = useState<PDFConfig>({
    pageSize: 'A4',
    fontSize: 12,
    fontFamily: 'Times',
    margins: { top: 72, bottom: 72, left: 72, right: 72 },
    includeTableOfContents: true,
    showPageNumbers: true,
    includeCoverPage: true,
    citationStyle: 'academic'
  });
  const [progress, setProgress] = useState<GenerationProgress>({
    stage: 'idle',
    progress: 0,
    message: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (bookId) {
      loadBook();
    }
  }, [bookId]);

  const loadBook = async () => {
    try {
      const response = await egwAPI.getBook(bookId);
      if (response.success && response.data) {
        setBook(response.data);
      } else {
        setError(response.error || 'Book not found');
      }
    } catch (error) {
      setError('Failed to load book information');
    } finally {
      setLoading(false);
    }
  };

  const handleGeneratePDF = async () => {
    if (!book) return;

    setProgress({
      stage: 'fetching',
      progress: 10,
      message: 'Fetching book content from database...'
    });

    try {
      setProgress(prev => ({
        ...prev,
        stage: 'processing',
        progress: 30,
        message: 'Processing chapters and organizing content...'
      }));

      setProgress(prev => ({
        ...prev,
        stage: 'formatting',
        progress: 60,
        message: 'Applying formatting and layout settings...'
      }));

      setProgress(prev => ({
        ...prev,
        stage: 'generating',
        progress: 90,
        message: 'Generating PDF document...'
      }));

      // Call the actual PDF generation API
      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookId: book.book_id,
          config: config
        }),
      });

      const result = await response.json();

      if (result.success) {
        setProgress(prev => ({
          ...prev,
          stage: 'complete',
          progress: 100,
          message: 'PDF generation complete!',
          downloadUrl: result.downloadUrl
        }));
      } else {
        throw new Error(result.error || 'PDF generation failed');
      }

    } catch (error) {
      setProgress(prev => ({
        ...prev,
        stage: 'error',
        message: error instanceof Error ? error.message : 'An error occurred during PDF generation'
      }));
    }
  };

  const getStageIcon = () => {
    switch (progress.stage) {
      case 'complete':
        return <CheckCircleIcon className="h-6 w-6 text-green-600" />;
      case 'error':
        return <ExclamationTriangleIcon className="h-6 w-6 text-red-600" />;
      default:
        return <Cog6ToothIcon className="h-6 w-6 text-primary-600 animate-spin" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Cog6ToothIcon className="h-8 w-8 text-primary-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading book information...</p>
        </div>
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Book Not Found</h2>
          <p className="text-gray-600 mb-4">{error || 'The requested book could not be found.'}</p>
          <Link
            href="/books"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Back to Books
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/books"
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Generate PDF</h1>
                <p className="text-gray-600">{book.title} by {book.author}</p>
              </div>
            </div>
            <DocumentTextIcon className="h-8 w-8 text-primary-600" />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Book Information */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Book Information</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Title:</span>
                  <p className="text-gray-900">{book.title}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Author:</span>
                  <p className="text-gray-900">{book.author}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Published:</span>
                  <p className="text-gray-900">{book.pub_year}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Pages:</span>
                  <p className="text-gray-900">{book.npages}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Language:</span>
                  <p className="text-gray-900">{book.lang.toUpperCase()}</p>
                </div>
                {book.publisher && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Publisher:</span>
                    <p className="text-gray-900">{book.publisher}</p>
                  </div>
                )}
              </div>
              {book.description && (
                <div className="mt-4">
                  <span className="text-sm font-medium text-gray-500">Description:</span>
                  <p className="text-gray-700 mt-1">{book.description}</p>
                </div>
              )}
            </div>

            {/* Progress Section */}
            {progress.stage !== 'idle' && (
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Generation Progress</h2>
                  {getStageIcon()}
                </div>

                <div className="mb-4">
                  <div className="flex justify-between text-sm text-gray-600 mb-2">
                    <span>{progress.message}</span>
                    <span>{progress.progress}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-primary-600 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${progress.progress}%` }}
                    />
                  </div>
                </div>

                {progress.stage === 'complete' && (
                  <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircleIcon className="h-5 w-5 text-green-600 mr-2" />
                        <span className="text-green-800 font-medium">PDF Ready for Download!</span>
                      </div>
                      <button 
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                        onClick={() => {
                          if (progress.downloadUrl) {
                            window.location.href = progress.downloadUrl;
                          }
                        }}
                      >
                        <ArrowDownTrayIcon className="h-4 w-4 mr-2" />
                        Download PDF
                      </button>
                    </div>
                    <p className="text-green-700 text-sm mt-2">
                      Your PDF has been generated successfully with {config.includeTableOfContents ? 'table of contents, ' : ''} 
                      {config.showPageNumbers ? 'page numbers, ' : ''}and {config.citationStyle} citations.
                    </p>
                  </div>
                )}

                {progress.stage === 'error' && (
                  <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
                    <div className="flex items-center">
                      <ExclamationTriangleIcon className="h-5 w-5 text-red-600 mr-2" />
                      <span className="text-red-800 font-medium">Generation Failed</span>
                    </div>
                    <p className="text-red-700 text-sm mt-2">
                      {progress.message}. Please try again or contact support if the problem persists.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Configuration Panel */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">PDF Settings</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Page Size
                  </label>
                  <select
                    value={config.pageSize}
                    onChange={(e) => setConfig(prev => ({ ...prev, pageSize: e.target.value as any }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="A4">A4 (210 × 297 mm)</option>
                    <option value="Letter">Letter (8.5 × 11 in)</option>
                    <option value="Legal">Legal (8.5 × 14 in)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Family
                  </label>
                  <select
                    value={config.fontFamily}
                    onChange={(e) => setConfig(prev => ({ ...prev, fontFamily: e.target.value as any }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="Times">Times Roman</option>
                    <option value="Helvetica">Helvetica</option>
                    <option value="Courier">Courier</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Font Size: {config.fontSize}pt
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="16"
                    value={config.fontSize}
                    onChange={(e) => setConfig(prev => ({ ...prev, fontSize: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>10pt</span>
                    <span>16pt</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Citation Style
                  </label>
                  <select
                    value={config.citationStyle}
                    onChange={(e) => setConfig(prev => ({ ...prev, citationStyle: e.target.value as any }))}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="academic">Academic (Full Citations)</option>
                    <option value="simple">Simple (Book & Page)</option>
                    <option value="detailed">Detailed (With Context)</option>
                  </select>
                </div>

                <div className="space-y-3">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.includeTableOfContents}
                      onChange={(e) => setConfig(prev => ({ ...prev, includeTableOfContents: e.target.checked }))}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include Table of Contents</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.showPageNumbers}
                      onChange={(e) => setConfig(prev => ({ ...prev, showPageNumbers: e.target.checked }))}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Show Page Numbers</span>
                  </label>

                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.includeCoverPage}
                      onChange={(e) => setConfig(prev => ({ ...prev, includeCoverPage: e.target.checked }))}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">Include Cover Page</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGeneratePDF}
              disabled={progress.stage !== 'idle' && progress.stage !== 'complete' && progress.stage !== 'error'}
              className="w-full flex items-center justify-center px-6 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
            >
              <DocumentTextIcon className="h-5 w-5 mr-2" />
              {progress.stage === 'idle' ? 'Generate PDF' : 'Generating...'}
            </button>

            {/* Info Box */}
            <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
              <h3 className="text-sm font-semibold text-blue-800 mb-2">PDF Generation</h3>
              <p className="text-blue-700 text-sm">
                This will generate a professional PDF with the selected formatting options. 
                The process may take a few minutes depending on the book size.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}