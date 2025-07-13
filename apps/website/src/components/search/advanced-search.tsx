'use client';

import { useState } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  ChevronDownIcon,
  CalendarIcon,
  BookOpenIcon,
  TagIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline';

interface SearchFilters {
  query: string;
  books: string[];
  authors: string[];
  dateRange: {
    start: string;
    end: string;
  };
  topics: string[];
  language: string;
  contentType: string[];
}

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  initialFilters?: Partial<SearchFilters>;
}

const BOOK_OPTIONS = [
  'The Desire of Ages',
  'The Great Controversy',
  'Steps to Christ',
  'Patriarchs and Prophets',
  'The Acts of the Apostles',
  'Prophets and Kings',
  'Education',
  'Ministry of Healing',
  'Christ\'s Object Lessons',
  'Thoughts from the Mount of Blessing'
];

const AUTHOR_OPTIONS = [
  'Ellen G. White',
  'W. C. White',
  'Arthur G. Daniells',
  'A. G. Daniells'
];

const TOPIC_SUGGESTIONS = [
  'Righteousness by Faith',
  'Health and Temperance',
  'Education',
  'Prophecy',
  'Character Development',
  'Prayer',
  'Bible Study',
  'Second Coming',
  'Sabbath',
  'Stewardship'
];

const CONTENT_TYPES = [
  'Books',
  'Letters',
  'Manuscripts',
  'Periodical Articles',
  'Bible Comments',
  'Sermons'
];

export function AdvancedSearch({ onSearch, initialFilters = {} }: AdvancedSearchProps) {
  const [filters, setFilters] = useState<SearchFilters>({
    query: '',
    books: [],
    authors: [],
    dateRange: { start: '', end: '' },
    topics: [],
    language: 'en',
    contentType: [],
    ...initialFilters
  });

  const [showFilters, setShowFilters] = useState(false);
  const [activeFilterSection, setActiveFilterSection] = useState<string | null>(null);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleArrayFilterToggle = (key: keyof SearchFilters, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: (prev[key] as string[]).includes(value)
        ? (prev[key] as string[]).filter(item => item !== value)
        : [...(prev[key] as string[]), value]
    }));
  };

  const clearAllFilters = () => {
    setFilters({
      query: '',
      books: [],
      authors: [],
      dateRange: { start: '', end: '' },
      topics: [],
      language: 'en',
      contentType: []
    });
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.books.length > 0) count++;
    if (filters.authors.length > 0) count++;
    if (filters.dateRange.start || filters.dateRange.end) count++;
    if (filters.topics.length > 0) count++;
    if (filters.language !== 'en') count++;
    if (filters.contentType.length > 0) count++;
    return count;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Main Search Bar */}
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-6 w-6 text-gray-400" />
          <input
            type="text"
            placeholder="Search writings, topics, or references..."
            value={filters.query}
            onChange={(e) => handleFilterChange('query', e.target.value)}
            className="w-full pl-14 pr-32 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 shadow-sm"
          />
          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                showFilters || getActiveFilterCount() > 0
                  ? 'bg-primary-100 text-primary-700 border border-primary-200'
                  : 'bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200'
              }`}
            >
              <FunnelIcon className="h-4 w-4 mr-1" />
              Filters
              {getActiveFilterCount() > 0 && (
                <span className="ml-1 bg-primary-600 text-white text-xs rounded-full px-2 py-0.5">
                  {getActiveFilterCount()}
                </span>
              )}
            </button>
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Advanced Filters Panel */}
      {showFilters && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Advanced Search Filters</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={clearAllFilters}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Clear All
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Books Filter */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <BookOpenIcon className="h-4 w-4 mr-2" />
                Books
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {BOOK_OPTIONS.map(book => (
                  <label key={book} className="flex items-center py-1">
                    <input
                      type="checkbox"
                      checked={filters.books.includes(book)}
                      onChange={() => handleArrayFilterToggle('books', book)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{book}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Content Type Filter */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <TagIcon className="h-4 w-4 mr-2" />
                Content Type
              </label>
              <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-3">
                {CONTENT_TYPES.map(type => (
                  <label key={type} className="flex items-center py-1">
                    <input
                      type="checkbox"
                      checked={filters.contentType.includes(type)}
                      onChange={() => handleArrayFilterToggle('contentType', type)}
                      className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <CalendarIcon className="h-4 w-4 mr-2" />
                Date Range
              </label>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="date"
                  placeholder="Start date"
                  value={filters.dateRange.start}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, start: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                />
                <input
                  type="date"
                  placeholder="End date"
                  value={filters.dateRange.end}
                  onChange={(e) => handleFilterChange('dateRange', { ...filters.dateRange, end: e.target.value })}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Language Filter */}
            <div className="space-y-3">
              <label className="flex items-center text-sm font-medium text-gray-700">
                <AdjustmentsHorizontalIcon className="h-4 w-4 mr-2" />
                Language
              </label>
              <select
                value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
                <option value="pt">Portuguese</option>
              </select>
            </div>
          </div>

          {/* Topic Suggestions */}
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Popular Topics
            </label>
            <div className="flex flex-wrap gap-2">
              {TOPIC_SUGGESTIONS.map(topic => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => handleFilterChange('query', topic)}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-primary-100 text-gray-700 hover:text-primary-700 rounded-full transition-colors"
                >
                  {topic}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {getActiveFilterCount() > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {filters.books.map(book => (
            <span key={book} className="inline-flex items-center px-3 py-1 bg-primary-100 text-primary-800 text-sm rounded-full">
              {book}
              <button
                onClick={() => handleArrayFilterToggle('books', book)}
                className="ml-2 text-primary-600 hover:text-primary-800"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
          {filters.contentType.map(type => (
            <span key={type} className="inline-flex items-center px-3 py-1 bg-secondary-100 text-secondary-800 text-sm rounded-full">
              {type}
              <button
                onClick={() => handleArrayFilterToggle('contentType', type)}
                className="ml-2 text-secondary-600 hover:text-secondary-800"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          ))}
          {(filters.dateRange.start || filters.dateRange.end) && (
            <span className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
              {filters.dateRange.start} - {filters.dateRange.end}
              <button
                onClick={() => handleFilterChange('dateRange', { start: '', end: '' })}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}