'use client';

import { useState, useEffect } from 'react';
import { 
  XMarkIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  ExclamationTriangleIcon,
  Cog6ToothIcon
} from '@heroicons/react/24/outline';

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
  code?: string;
}

interface Chapter {
  chapter: number;
  title: string;
  content: string;
  paragraphs?: Array<{
    para_id: string;
    content: string;
    refcode_short?: string;
    refcode_long?: string;
  }>;
}

interface BookReaderModalProps {
  book: Book;
  isOpen: boolean;
  onClose: () => void;
}

export default function BookReaderModal({ book, isOpen, onClose }: BookReaderModalProps) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(16);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [contentSource, setContentSource] = useState<'database' | 'sample'>('sample');

  useEffect(() => {
    if (isOpen && book) {
      loadBookContent();
    }
  }, [isOpen, book]);

  const loadBookContent = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // First try to get actual content from database
      const contentResponse = await fetch(`/api/books/${book.book_id}/content-db`);
      const contentResult = await contentResponse.json();
      
      if (contentResult.success && contentResult.data && contentResult.data.chapters && contentResult.data.chapters.length > 0) {
        // Convert database format to UI format
        const dbChapters = contentResult.data.chapters.map((ch: any, index: number) => ({
          chapter: index + 1,
          title: ch.title || `Chapter ${index + 1}`,
          content: ch.paragraphs.map((p: any) => 
            `<div class="paragraph mb-4" data-para-id="${p.para_id}" data-refcode="${p.refcode_short || ''}">
              ${p.content}
              ${p.refcode_short ? `<span class="text-xs text-gray-500 ml-2">[${p.refcode_short}]</span>` : ''}
            </div>`
          ).join('\n'),
          paragraphs: ch.paragraphs
        }));
        
        setChapters(dbChapters);
        setContentSource('database');
        console.log(`✅ Loaded ${dbChapters.length} chapters from database`);
      } else {
        // Fallback to sample content
        generateSampleChapters();
        setContentSource('sample');
        console.log('📝 Using sample content - no database content available');
      }
    } catch (contentError) {
      console.warn('Could not load database content, using sample:', contentError);
      generateSampleChapters();
      setContentSource('sample');
    } finally {
      setLoading(false);
    }
  };

  const generateSampleChapters = () => {
    // Generate sample chapters based on book size
    const numChapters = Math.min(Math.max(Math.floor(book.npages / 20), 5), 30);
    const sampleChapters: Chapter[] = [];
    
    for (let i = 1; i <= numChapters; i++) {
      sampleChapters.push({
        chapter: i,
        title: `Chapter ${i}`,
        content: `
          <div class="chapter-content">
            <h2 class="text-2xl font-bold mb-6">Chapter ${i}</h2>
            
            <div class="paragraph mb-4" data-para-id="sample-${book.book_id}-${i}-1">
              This is the opening content for Chapter ${i} of "${book.title}" by ${book.author}.
              In a real implementation, this content would be fetched from the downloaded database content.
              <span class="text-xs text-gray-500 ml-2">[${book.code || 'BOOK'} ${i}.1]</span>
            </div>
            
            <div class="paragraph mb-4" data-para-id="sample-${book.book_id}-${i}-2">
              The book "${book.title}" was published in ${book.pub_year} and contains ${book.npages} pages 
              of valuable spiritual content. Each chapter contains multiple paragraphs with unique paragraph IDs 
              for citation and reference purposes.
              <span class="text-xs text-gray-500 ml-2">[${book.code || 'BOOK'} ${i}.2]</span>
            </div>
            
            <h3 class="text-xl font-semibold mt-8 mb-4">Section ${i}.1 - Key Principles</h3>
            <div class="paragraph mb-4" data-para-id="sample-${book.book_id}-${i}-3">
              This section would contain the actual content of the book, with proper paragraph 
              structure and reference codes. The content would be formatted with appropriate 
              typography and spacing for optimal reading experience.
              <span class="text-xs text-gray-500 ml-2">[${book.code || 'BOOK'} ${i}.3]</span>
            </div>
            
            <div class="paragraph mb-4" data-para-id="sample-${book.book_id}-${i}-4">
              Each paragraph maintains the original structure and formatting of the published work. 
              Cross-references and footnotes are preserved and properly linked for scholarly study.
              <span class="text-xs text-gray-500 ml-2">[${book.code || 'BOOK'} ${i}.4]</span>
            </div>
            
            <h3 class="text-xl font-semibold mt-8 mb-4">Section ${i}.2 - Practical Application</h3>
            <div class="paragraph mb-4" data-para-id="sample-${book.book_id}-${i}-5">
              Additional content appears here, demonstrating how these principles apply to daily Christian living.
              The formatting maintains readability while preserving the scholarly apparatus needed for citation.
              <span class="text-xs text-gray-500 ml-2">[${book.code || 'BOOK'} ${i}.5]</span>
            </div>
            
            <div class="paragraph mb-4" data-para-id="sample-${book.book_id}-${i}-6">
              For a complete reading experience with actual downloaded content, the system would display:
              <ul class="list-disc ml-6 mt-2">
                <li>Original paragraphs from the EGW API</li>
                <li>Proper paragraph-level referencing</li>
                <li>Cross-reference functionality</li>
                <li>Search capabilities within the text</li>
                <li>Chapter navigation and bookmarking</li>
              </ul>
              <span class="text-xs text-gray-500 ml-2">[${book.code || 'BOOK'} ${i}.6]</span>
            </div>
          </div>
        `
      });
    }
    
    setChapters(sampleChapters);
  };

  const getCurrentChapter = () => {
    return chapters.find(ch => ch.chapter === currentChapter) || chapters[0];
  };

  const navigateChapter = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentChapter > 1) {
      setCurrentChapter(currentChapter - 1);
    } else if (direction === 'next' && currentChapter < chapters.length) {
      setCurrentChapter(currentChapter + 1);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 p-1"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{book.title}</h1>
                <p className="text-sm text-gray-600">{book.author}</p>
              </div>
              {contentSource === 'database' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Database Content
                </span>
              )}
              {contentSource === 'sample' && (
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Sample Content
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Search */}
              <button
                onClick={() => setShowSearch(!showSearch)}
                className={`p-2 rounded-md ${showSearch ? 'bg-primary-100 text-primary-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                <MagnifyingGlassIcon className="h-5 w-5" />
              </button>
              
              {/* Font Size Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  className="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  A-
                </button>
                <span className="text-sm text-gray-600 min-w-[40px] text-center">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  A+
                </button>
              </div>
              
              {/* Chapter Navigation */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => navigateChapter('prev')}
                  disabled={currentChapter === 1}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  <ChevronLeftIcon className="h-5 w-5" />
                </button>
                <span className="text-sm text-gray-600 min-w-[60px] text-center">
                  {currentChapter} / {chapters.length}
                </span>
                <button
                  onClick={() => navigateChapter('next')}
                  disabled={currentChapter === chapters.length}
                  className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md"
                >
                  <ChevronRightIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Search Bar */}
          {showSearch && (
            <div className="mt-4 max-w-md">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search in this book..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden flex">
        {/* Chapter Sidebar */}
        <div className="w-64 bg-gray-50 border-r overflow-y-auto">
          <div className="p-4">
            <h3 className="font-medium text-gray-900 mb-3">Chapters</h3>
            <div className="space-y-1">
              {chapters.map((chapter) => (
                <button
                  key={chapter.chapter}
                  onClick={() => setCurrentChapter(chapter.chapter)}
                  className={`w-full text-left px-3 py-2 text-sm rounded-md ${
                    currentChapter === chapter.chapter
                      ? 'bg-primary-100 text-primary-900 font-medium'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {chapter.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <BookOpenIcon className="h-8 w-8 text-primary-600 animate-pulse mx-auto mb-4" />
                <p className="text-gray-600">Loading book content...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Content</h3>
                <p className="text-gray-600">{error}</p>
              </div>
            </div>
          ) : (
            <div className="max-w-4xl mx-auto px-6 py-8">
              <div 
                className="prose prose-lg max-w-none"
                style={{ fontSize: `${fontSize}px`, lineHeight: '1.7' }}
                dangerouslySetInnerHTML={{ 
                  __html: getCurrentChapter()?.content || '<p>Loading chapter content...</p>' 
                }}
              />
              
              {/* Navigation Footer */}
              <div className="border-t mt-12 pt-8">
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => navigateChapter('prev')}
                    disabled={currentChapter === 1}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    <ChevronLeftIcon className="h-4 w-4 mr-2" />
                    Previous Chapter
                  </button>
                  
                  <div className="text-sm text-gray-500">
                    Chapter {currentChapter} of {chapters.length}
                  </div>
                  
                  <button
                    onClick={() => navigateChapter('next')}
                    disabled={currentChapter === chapters.length}
                    className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed rounded-md border border-gray-300 hover:bg-gray-50"
                  >
                    Next Chapter
                    <ChevronRightIcon className="h-4 w-4 ml-2" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}