'use client';

import { useState, useEffect } from 'react';
import { 
  BookOpenIcon,
  MagnifyingGlassIcon,
  ChevronRightIcon,
  ChevronDownIcon,
  GlobeAltIcon,
  UserIcon,
  CalendarIcon,
  DocumentTextIcon,
  HeartIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import Link from 'next/link';
import BookReaderModal from './book-reader-modal';

interface Book {
  book_id: number;
  title: string;
  author: string;
  pub_year: number;
  npages: number;
  lang: string;
  description?: string;
  category: string;
  subcategory: string;
  rating?: number;
  downloads?: number;
  code?: string;
  publisher?: string;
}

interface CategoryData {
  name: string;
  icon: string;
  description: string;
  total: number;
  subcategories: {
    [key: string]: {
      name: string;
      count: number;
      sampleBooks: Book[];
    };
  };
}

interface CategoriesResponse {
  categories: {
    [key: string]: CategoryData;
  };
  summary: {
    totalBooks: number;
    totalCategories: number;
    language: string;
  };
}

export default function CategorizedLibraryPage() {
  const [categories, setCategories] = useState<CategoriesResponse | null>(null);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['egw']));
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookModal, setShowBookModal] = useState(false);
  const [showReaderModal, setShowReaderModal] = useState(false);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBooks, setTotalBooks] = useState(0);
  const booksPerPage = 24;

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'pt', name: 'Português' },
    { code: 'de', name: 'Deutsch' },
    { code: 'it', name: 'Italiano' },
    { code: 'ru', name: 'Русский' },
    { code: 'zh', name: '中文' }
  ];

  useEffect(() => {
    loadCategories();
  }, [selectedLanguage]);

  useEffect(() => {
    if (selectedCategory) {
      loadBooks();
    }
  }, [selectedCategory, selectedSubcategory, currentPage, searchQuery]);

  const loadCategories = async () => {
    try {
      const params = new URLSearchParams();
      if (selectedLanguage !== 'all') params.append('language', selectedLanguage);
      
      const response = await fetch(`/api/egw/books/categories?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    }
  };

  const loadBooks = async () => {
    if (!selectedCategory) return;
    
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.append('page', currentPage.toString());
      params.append('limit', booksPerPage.toString());
      params.append('language', selectedLanguage);
      
      if (selectedSubcategory) {
        params.append('category', `${selectedCategory}/${selectedSubcategory}`);
      } else {
        params.append('category', selectedCategory);
      }
      
      if (searchQuery) {
        params.append('search', searchQuery);
      }
      
      const response = await fetch(`/api/egw/books?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setBooks(data.data);
        setTotalBooks(data.total);
        setTotalPages(data.totalPages);
      }
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleCategory = (categoryKey: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryKey)) {
      newExpanded.delete(categoryKey);
    } else {
      newExpanded.add(categoryKey);
    }
    setExpandedCategories(newExpanded);
  };

  const selectCategory = (categoryKey: string, subcategoryKey?: string) => {
    setSelectedCategory(categoryKey);
    setSelectedSubcategory(subcategoryKey || null);
    setCurrentPage(1);
    setBooks([]);
  };

  const toggleFavorite = (bookId: number) => {
    const newFavorites = new Set(favorites);
    if (newFavorites.has(bookId)) {
      newFavorites.delete(bookId);
    } else {
      newFavorites.add(bookId);
    }
    setFavorites(newFavorites);
  };

  const openBookModal = (book: Book) => {
    setSelectedBook(book);
    setShowBookModal(true);
  };

  const openReaderModal = (book: Book) => {
    setSelectedBook(book);
    setShowReaderModal(true);
  };

  if (!categories) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpenIcon className="h-12 w-12 text-primary-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Language Selection Bar */}
      <div className="bg-white border-b py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <GlobeAltIcon className="h-5 w-5 text-gray-600" />
            <select
              value={selectedLanguage}
              onChange={(e) => setSelectedLanguage(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:ring-primary-500 focus:border-primary-500"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Categories Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border sticky top-4">
              <div className="p-4 border-b">
                <h3 className="font-semibold text-gray-900">Browse by Category</h3>
              </div>
              
              <div className="divide-y">
                {Object.entries(categories.categories).map(([categoryKey, categoryData]) => (
                  <div key={categoryKey}>
                    <button
                      onClick={() => toggleCategory(categoryKey)}
                      className="w-full p-4 text-left hover:bg-gray-50 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{categoryData.icon}</span>
                        <div>
                          <div className="font-medium text-gray-900">
                            {categoryData.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {categoryData.total} books
                          </div>
                        </div>
                      </div>
                      {expandedCategories.has(categoryKey) ? (
                        <ChevronDownIcon className="h-4 w-4 text-gray-400" />
                      ) : (
                        <ChevronRightIcon className="h-4 w-4 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedCategories.has(categoryKey) && (
                      <div className="bg-gray-50 border-t">
                        <button
                          onClick={() => selectCategory(categoryKey)}
                          className={`w-full p-3 text-left text-sm hover:bg-gray-100 ${
                            selectedCategory === categoryKey && !selectedSubcategory 
                              ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600' 
                              : 'text-gray-600'
                          }`}
                        >
                          All {categoryData.name}
                        </button>
                        
                        {Object.entries(categoryData.subcategories).map(([subKey, subData]) => (
                          subData.count > 0 && (
                            <button
                              key={subKey}
                              onClick={() => selectCategory(categoryKey, subKey)}
                              className={`w-full p-3 text-left text-sm hover:bg-gray-100 flex justify-between ${
                                selectedCategory === categoryKey && selectedSubcategory === subKey
                                  ? 'bg-primary-50 text-primary-700 border-r-2 border-primary-600'
                                  : 'text-gray-600'
                              }`}
                            >
                              <span>{subData.name}</span>
                              <span className="text-gray-400">{subData.count}</span>
                            </button>
                          )
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {selectedCategory ? (
              <>
                {/* Search and Filter Bar */}
                <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
                  <div className="flex gap-4">
                    <div className="flex-1 relative">
                      <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search within category..."
                        value={searchQuery}
                        onChange={(e) => {
                          setSearchQuery(e.target.value);
                          setCurrentPage(1);
                        }}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>
                </div>

                {/* Breadcrumb */}
                <div className="mb-6">
                  <nav className="flex items-center text-sm text-gray-600">
                    <button
                      onClick={() => setSelectedCategory(null)}
                      className="hover:text-primary-600"
                    >
                      Categories
                    </button>
                    <ChevronRightIcon className="h-4 w-4 mx-2" />
                    <span className="text-gray-900">
                      {categories.categories[selectedCategory]?.name}
                    </span>
                    {selectedSubcategory && (
                      <>
                        <ChevronRightIcon className="h-4 w-4 mx-2" />
                        <span className="text-gray-900">
                          {categories.categories[selectedCategory]?.subcategories[selectedSubcategory]?.name}
                        </span>
                      </>
                    )}
                  </nav>
                </div>

                {/* Books Grid */}
                {loading ? (
                  <div className="flex items-center justify-center py-12">
                    <BookOpenIcon className="h-8 w-8 text-primary-600 animate-pulse" />
                  </div>
                ) : (
                  <>
                    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                      {books.map((book) => (
                        <div key={book.book_id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow flex flex-col">
                          <div className="p-4 flex-1 flex flex-col">
                            <div className="flex justify-between items-start mb-3">
                              <div className="text-xs text-gray-500 uppercase font-medium">
                                {book.category}/{book.subcategory}
                              </div>
                              <button
                                onClick={() => toggleFavorite(book.book_id)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                {favorites.has(book.book_id) ? (
                                  <HeartSolidIcon className="h-4 w-4 text-red-500" />
                                ) : (
                                  <HeartIcon className="h-4 w-4" />
                                )}
                              </button>
                            </div>
                            
                            <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{book.title}</h3>
                            <p className="text-sm text-gray-600 mb-2">{book.author}</p>
                            
                            {book.description && (
                              <p className="text-sm text-gray-500 mb-3 line-clamp-2 flex-1">{book.description}</p>
                            )}
                            
                            <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                              <span>{book.pub_year}</span>
                              <span>{book.npages} pages</span>
                              <span>{book.lang.toUpperCase()}</span>
                            </div>
                            
                            <div className="flex gap-2 mt-auto">
                              <button
                                onClick={() => openReaderModal(book)}
                                className="flex-1 px-3 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
                              >
                                📖 Read
                              </button>
                              <Link
                                href={`/books/${book.book_id}/pdf`}
                                className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded-md hover:bg-gray-50 transition-colors"
                              >
                                📄 PDF
                              </Link>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                        >
                          Previous
                        </button>
                        
                        <span className="px-4 py-2 text-sm text-gray-600">
                          Page {currentPage} of {totalPages}
                        </span>
                        
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-2 text-sm border border-gray-300 rounded-md disabled:opacity-50 hover:bg-gray-50"
                        >
                          Next
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            ) : (
              /* Category Overview */
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Choose a Category</h2>
                  <p className="text-gray-600">Browse our collection organized by type and content</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-6">
                  {Object.entries(categories.categories).map(([categoryKey, categoryData]) => (
                    <div key={categoryKey} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4">
                        <div className="text-3xl">{categoryData.icon}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 mb-2">{categoryData.name}</h3>
                          <p className="text-sm text-gray-600 mb-3">{categoryData.description}</p>
                          <div className="text-sm text-gray-500 mb-4">
                            {categoryData.total} books available
                          </div>
                          <button
                            onClick={() => selectCategory(categoryKey)}
                            className="px-4 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
                          >
                            Browse Collection
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Book Modal */}
      {showBookModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedBook.title}</h2>
                  <p className="text-gray-600">{selectedBook.author}</p>
                </div>
                <button
                  onClick={() => setShowBookModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Book Info */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>Year: {selectedBook.pub_year}</div>
                    <div>Pages: {selectedBook.npages}</div>
                    <div>Language: {selectedBook.lang.toUpperCase()}</div>
                    <div>Category: {selectedBook.category}/{selectedBook.subcategory}</div>
                  </div>
                  {selectedBook.description && (
                    <div className="mt-3 text-sm text-gray-600">
                      {selectedBook.description}
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      setShowBookModal(false);
                      openReaderModal(selectedBook);
                    }}
                    className="flex-1 px-4 py-3 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-center font-medium"
                  >
                    📖 Read
                  </button>
                  <Link
                    href={`/books/${selectedBook.book_id}/pdf`}
                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-center font-medium"
                    onClick={() => setShowBookModal(false)}
                  >
                    📄 PDF
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Book Reader Modal */}
      {selectedBook && (
        <BookReaderModal
          book={selectedBook}
          isOpen={showReaderModal}
          onClose={() => setShowReaderModal(false)}
        />
      )}
    </div>
  );
}