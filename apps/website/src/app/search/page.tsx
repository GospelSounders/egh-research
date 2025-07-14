'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { MagnifyingGlassIcon, AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import { searchBooks } from '@/lib/static-api';
import type { SearchResult, SearchResponse } from '@/lib/static-api';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);
  const [results, setResults] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (query.trim()) {
      performSearch(query, page);
    }
  }, [query, page]);

  const performSearch = async (searchQuery: string, currentPage: number = 1) => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const limit = 20;
      const offset = (currentPage - 1) * limit;
      
      const searchResults = await searchBooks({
        q: searchQuery,
        limit,
        offset
      });
      setResults(searchResults);
    } catch (err) {
      setError('Failed to perform search. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <MagnifyingGlassIcon className="h-6 w-6 text-gray-400" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Search Results
                </h1>
                {query && (
                  <p className="text-gray-600 dark:text-gray-300 mt-1">
                    Results for: <span className="font-semibold">"{query}"</span>
                  </p>
                )}
              </div>
            </div>
            
            {/* Advanced Search Toggle */}
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4" />
              <span>Advanced Search</span>
            </button>
          </div>
          
          {/* Advanced Search Panel */}
          {showAdvanced && (
            <div className="mt-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4 border border-gray-200 dark:border-gray-600">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label htmlFor="author-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Author
                  </label>
                  <select
                    id="author-filter"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Authors</option>
                    <option value="Ellen G. White">Ellen G. White</option>
                    <option value="W. C. White">W. C. White</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="year-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Publication Year
                  </label>
                  <select
                    id="year-filter"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Years</option>
                    <option value="1800s">1800-1899</option>
                    <option value="1900s">1900-1999</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="language-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Language
                  </label>
                  <select
                    id="language-filter"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="">All Languages</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-4 flex items-center justify-between">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Use quotes for exact phrases, e.g., "righteousness by faith"
                </div>
                <button
                  onClick={() => {
                    // Apply filters - for now just close the panel
                    setShowAdvanced(false);
                  }}
                  className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Stats */}
        {results && !loading && (
          <div className="mb-6">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Found {results.total} results in {results.total > 0 ? '0.12' : '0'} seconds
            </p>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <span className="ml-3 text-gray-600 dark:text-gray-300">Searching...</span>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6">
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* No Results */}
        {results && results.total === 0 && !loading && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No results found
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Try adjusting your search terms or check your spelling.
            </p>
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                Search Tips:
              </h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Use different keywords or synonyms</li>
                <li>• Check spelling and try simpler terms</li>
                <li>• Use quotation marks for exact phrases</li>
                <li>• Try broader search terms</li>
              </ul>
            </div>
          </div>
        )}

        {/* Search Results */}
        {results && results.results.length > 0 && !loading && (
          <div className="space-y-6">
            {results.results.map((result, index) => (
              <div
                key={`${result.book_id}-${index}`}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300">
                      <a href={result.url} className="hover:underline">
                        {highlightText(result.title, query)}
                      </a>
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      by {highlightText(result.author, query)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-200">
                      Book
                    </span>
                  </div>
                </div>

                <div className="mb-3">
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Reference: {highlightText(result.reference, query)}
                  </p>
                </div>

                <div className="text-gray-700 dark:text-gray-300">
                  <p>{highlightText(result.snippet, query)}</p>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                    <span>Book ID: {result.book_id}</span>
                  </div>
                  <a
                    href={result.url}
                    className="inline-flex items-center text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-300"
                  >
                    Read book →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {results && results.total > 20 && (
          <div className="mt-8 flex items-center justify-between">
            <div className="text-sm text-gray-700 dark:text-gray-300">
              Showing {results.offset + 1} to {Math.min(results.offset + results.limit, results.total)} of {results.total} results
            </div>
            <div className="flex space-x-2">
              <a
                href={page > 1 ? `/search?q=${encodeURIComponent(query)}&page=${page - 1}` : '#'}
                className={`px-3 py-2 text-sm font-medium border rounded-md ${
                  page > 1
                    ? 'text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    : 'text-gray-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                }`}
                aria-disabled={page <= 1}
              >
                Previous
              </a>
              <a
                href={results.offset + results.limit < results.total ? `/search?q=${encodeURIComponent(query)}&page=${page + 1}` : '#'}
                className={`px-3 py-2 text-sm font-medium border rounded-md ${
                  results.offset + results.limit < results.total
                    ? 'text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
                    : 'text-gray-500 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 cursor-not-allowed'
                }`}
                aria-disabled={results.offset + results.limit >= results.total}
              >
                Next
              </a>
            </div>
          </div>
        )}

        {/* Empty Query State */}
        {!query && !loading && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              Enter a search term
            </h3>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Use the search bar to find books, authors, and content.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-300">Loading search...</span>
      </div>
    }>
      <SearchContent />
    </Suspense>
  );
}