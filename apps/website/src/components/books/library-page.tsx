'use client';

import { useState } from 'react';
import { 
  Squares2X2Icon,
  ListBulletIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronDownIcon,
  CalendarIcon,
  BookOpenIcon,
  EyeIcon,
  HeartIcon,
  ShareIcon,
  StarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon, StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';

interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
  pages: number;
  category: string;
  description: string;
  coverImage: string;
  rating: number;
  readCount: number;
  isFavorite: boolean;
  tags: string[];
  language: string;
  fileSize: string;
  lastUpdated: string;
}

interface FilterOptions {
  search: string;
  category: string;
  language: string;
  yearRange: { start: number; end: number };
  sortBy: 'title' | 'year' | 'pages' | 'rating' | 'popularity';
  sortOrder: 'asc' | 'desc';
}

const SAMPLE_BOOKS: Book[] = [
  {
    id: '1',
    title: 'The Desire of Ages',
    author: 'Ellen G. White',
    year: 1898,
    pages: 835,
    category: 'Biography',
    description: 'The life of Jesus Christ from birth to ascension, with deep spiritual insights and practical lessons for Christian living.',
    coverImage: '/books/desire-of-ages.jpg',
    rating: 4.9,
    readCount: 15420,
    isFavorite: true,
    tags: ['Jesus', 'Biography', 'Spiritual Growth'],
    language: 'English',
    fileSize: '2.1 MB',
    lastUpdated: '2024-01-15'
  },
  {
    id: '2',
    title: 'The Great Controversy',
    author: 'Ellen G. White',
    year: 1888,
    pages: 678,
    category: 'Prophecy',
    description: 'The cosmic conflict between good and evil, from the destruction of Jerusalem to the new earth.',
    coverImage: '/books/great-controversy.jpg',
    rating: 4.8,
    readCount: 12890,
    isFavorite: false,
    tags: ['Prophecy', 'History', 'End Times'],
    language: 'English',
    fileSize: '1.8 MB',
    lastUpdated: '2024-01-10'
  },
  {
    id: '3',
    title: 'Steps to Christ',
    author: 'Ellen G. White',
    year: 1892,
    pages: 125,
    category: 'Devotional',
    description: 'A guide to Christian living and spiritual growth, perfect for new believers and seasoned Christians alike.',
    coverImage: '/books/steps-to-christ.jpg',
    rating: 4.9,
    readCount: 22150,
    isFavorite: true,
    tags: ['Devotional', 'Christian Living', 'Conversion'],
    language: 'English',
    fileSize: '0.8 MB',
    lastUpdated: '2024-01-20'
  },
  {
    id: '4',
    title: 'Education',
    author: 'Ellen G. White',
    year: 1903,
    pages: 320,
    category: 'Education',
    description: 'Principles of true education that develop the mind, body, and soul in harmony with God\'s plan.',
    coverImage: '/books/education.jpg',
    rating: 4.7,
    readCount: 8950,
    isFavorite: false,
    tags: ['Education', 'Character', 'Development'],
    language: 'English',
    fileSize: '1.2 MB',
    lastUpdated: '2024-01-05'
  }
];

const CATEGORIES = ['All', 'Biography', 'Prophecy', 'Devotional', 'Education', 'Health', 'History'];
const LANGUAGES = ['All', 'English', 'Spanish', 'French', 'German', 'Portuguese'];

export function LibraryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterOptions>({
    search: '',
    category: 'All',
    language: 'All',
    yearRange: { start: 1850, end: 2024 },
    sortBy: 'title',
    sortOrder: 'asc'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [books, setBooks] = useState<Book[]>(SAMPLE_BOOKS);

  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleFavorite = (bookId: string) => {
    setBooks(prev => prev.map(book => 
      book.id === bookId ? { ...book, isFavorite: !book.isFavorite } : book
    ));
  };

  const filteredBooks = books.filter(book => {
    if (filters.search && !book.title.toLowerCase().includes(filters.search.toLowerCase()) && 
        !book.author.toLowerCase().includes(filters.search.toLowerCase())) {
      return false;
    }
    if (filters.category !== 'All' && book.category !== filters.category) {
      return false;
    }
    if (filters.language !== 'All' && book.language !== filters.language) {
      return false;
    }
    if (book.year < filters.yearRange.start || book.year > filters.yearRange.end) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    const multiplier = filters.sortOrder === 'asc' ? 1 : -1;
    switch (filters.sortBy) {
      case 'title':
        return a.title.localeCompare(b.title) * multiplier;
      case 'year':
        return (a.year - b.year) * multiplier;
      case 'pages':
        return (a.pages - b.pages) * multiplier;
      case 'rating':
        return (a.rating - b.rating) * multiplier;
      case 'popularity':
        return (a.readCount - b.readCount) * multiplier;
      default:
        return 0;
    }
  });

  const BookCard = ({ book }: { book: Book }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow group">
      <div className="relative">
        <div className="aspect-[3/4] bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center">
          <BookOpenIcon className="h-16 w-16 text-primary-600" />
        </div>
        <div className="absolute top-3 right-3">
          <button
            onClick={() => toggleFavorite(book.id)}
            className="p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
          >
            {book.isFavorite ? (
              <HeartSolidIcon className="h-5 w-5 text-red-500" />
            ) : (
              <HeartIcon className="h-5 w-5 text-gray-600" />
            )}
          </button>
        </div>
        <div className="absolute bottom-3 left-3 flex items-center gap-1 bg-white/90 rounded-full px-2 py-1">
          <StarSolidIcon className="h-4 w-4 text-yellow-400" />
          <span className="text-sm font-medium">{book.rating}</span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{book.title}</h3>
        <p className="text-sm text-gray-600 mb-2">{book.author}</p>
        <p className="text-sm text-gray-500 mb-3 line-clamp-2">{book.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
          <span>{book.year}</span>
          <span>{book.pages} pages</span>
        </div>
        
        <div className="flex flex-wrap gap-1 mb-4">
          {book.tags.slice(0, 2).map(tag => (
            <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
              {tag}
            </span>
          ))}
        </div>
        
        <div className="flex items-center gap-2">
          <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
            <EyeIcon className="h-4 w-4 inline mr-1" />
            Read
          </button>
          <button className="p-2 text-gray-600 hover:text-primary-600 border border-gray-300 rounded-lg hover:border-primary-300 transition-colors">
            <ShareIcon className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );

  const BookListItem = ({ book }: { book: Book }) => (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="w-16 h-20 bg-gradient-to-br from-primary-100 to-primary-200 rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpenIcon className="h-8 w-8 text-primary-600" />
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">{book.title}</h3>
              <p className="text-sm text-gray-600">{book.author} • {book.year}</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <StarSolidIcon className="h-4 w-4 text-yellow-400" />
                <span className="text-sm font-medium">{book.rating}</span>
              </div>
              <button
                onClick={() => toggleFavorite(book.id)}
                className="p-1"
              >
                {book.isFavorite ? (
                  <HeartSolidIcon className="h-5 w-5 text-red-500" />
                ) : (
                  <HeartIcon className="h-5 w-5 text-gray-400" />
                )}
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mb-3 line-clamp-2">{book.description}</p>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span>{book.pages} pages</span>
              <span>{book.readCount.toLocaleString()} reads</span>
              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs">
                {book.category}
              </span>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="bg-primary-600 hover:bg-primary-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors">
                <EyeIcon className="h-4 w-4 inline mr-1" />
                Read
              </button>
              <button className="p-2 text-gray-600 hover:text-primary-600 border border-gray-300 rounded-lg hover:border-primary-300 transition-colors">
                <ShareIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-serif font-bold text-gray-900">Books Library</h1>
              <p className="text-gray-600 mt-1">Complete collection of Ellen G. White writings</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Squares2X2Icon className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' ? 'bg-primary-100 text-primary-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <ListBulletIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search books, authors, or topics..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-3 focus:ring-primary-500 focus:border-primary-500"
              >
                {CATEGORIES.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={`${filters.sortBy}-${filters.sortOrder}`}
                onChange={(e) => {
                  const [sortBy, sortOrder] = e.target.value.split('-');
                  handleFilterChange('sortBy', sortBy);
                  handleFilterChange('sortOrder', sortOrder);
                }}
                className="border border-gray-300 rounded-lg px-3 py-3 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="title-asc">Title A-Z</option>
                <option value="title-desc">Title Z-A</option>
                <option value="year-desc">Newest First</option>
                <option value="year-asc">Oldest First</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="popularity-desc">Most Popular</option>
              </select>
              
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-3 border rounded-lg transition-colors ${
                  showFilters ? 'bg-primary-100 border-primary-300 text-primary-600' : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                }`}
              >
                <FunnelIcon className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={filters.language}
                    onChange={(e) => handleFilterChange('language', e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    {LANGUAGES.map(language => (
                      <option key={language} value={language}>{language}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Year Range</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      placeholder="Start"
                      value={filters.yearRange.start}
                      onChange={(e) => handleFilterChange('yearRange', { ...filters.yearRange, start: Number(e.target.value) })}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                    <input
                      type="number"
                      placeholder="End"
                      value={filters.yearRange.end}
                      onChange={(e) => handleFilterChange('yearRange', { ...filters.yearRange, end: Number(e.target.value) })}
                      className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredBooks.length} of {books.length} books
          </p>
        </div>

        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBooks.map(book => (
              <BookCard key={book.id} book={book} />
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBooks.map(book => (
              <BookListItem key={book.id} book={book} />
            ))}
          </div>
        )}

        {filteredBooks.length === 0 && (
          <div className="text-center py-12">
            <BookOpenIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-500">Try adjusting your search or filters</p>
          </div>
        )}
      </div>
    </div>
  );
}