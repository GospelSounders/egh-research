'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ArrowLeftIcon,
  Cog6ToothIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';
import { egwAPI, type APIBook } from '@/lib/egw-api';
import Link from 'next/link';
import { Breadcrumbs, breadcrumbPaths } from '@/components/layout/breadcrumbs';
import { TableOfContents } from '@/components/books/table-of-contents';
import { ParagraphPermalink } from '@/components/books/paragraph-permalink';
import { EnhancedChapterNav } from '@/components/books/enhanced-chapter-nav';
import { CrossReference, generateMockCrossReferences } from '@/components/books/cross-reference';

interface Chapter {
  chapter: number;
  title: string;
  content: string;
}

export default function BookReadPage() {
  const params = useParams();
  const router = useRouter();
  const bookId = parseInt(params.bookId as string);

  const [book, setBook] = useState<APIBook | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(16);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showTableOfContents, setShowTableOfContents] = useState(false);

  useEffect(() => {
    if (bookId) {
      loadBook();
    }
  }, [bookId]);

  const loadBook = async () => {
    try {
      // First get book metadata
      const response = await egwAPI.getBook(bookId);
      if (response.success && response.data) {
        setBook(response.data);
        
        // Then try to get actual content from database
        try {
          const contentResponse = await fetch(`/api/books/${bookId}/content-db`);
          const contentResult = await contentResponse.json();
          
          if (contentResult.success && contentResult.data && contentResult.data.chapters) {
            // Convert database format to UI format
            const dbChapters = contentResult.data.chapters.map((ch: any) => ({
              chapter: ch.chapter,
              title: ch.title,
              content: ch.paragraphs.map((p: any) => 
                `<div class="paragraph" data-para-id="${p.para_id}">
                  ${p.content}
                </div>`
              ).join('\n')
            }));
            setChapters(dbChapters);
          } else {
            // Fallback to sample chapters
            generateSampleChapters(response.data);
          }
        } catch (contentError) {
          console.warn('Could not load database content, using sample:', contentError);
          generateSampleChapters(response.data);
        }
      } else {
        setError(response.error || 'Book not found');
      }
    } catch (error) {
      setError('Failed to load book content');
    } finally {
      setLoading(false);
    }
  };

  const generateSampleChapters = (book: APIBook) => {
    // Generate sample chapters based on book size
    const numChapters = Math.min(Math.max(Math.floor(book.npages / 20), 5), 30);
    const sampleChapters: Chapter[] = [];
    
    for (let i = 1; i <= numChapters; i++) {
      sampleChapters.push({
        chapter: i,
        title: `Chapter ${i}`,
        content: `
          <h2>Chapter ${i}</h2>
          <p>This is the content for Chapter ${i} of "${book.title}" by ${book.author}.</p>
          
          <p>In a real implementation, this content would be fetched from the EGW API or database. 
          The text would include the actual paragraphs, with proper formatting and references.</p>
          
          <p>The book "${book.title}" was published in ${book.pub_year} and contains ${book.npages} pages 
          of valuable content. Each chapter would contain multiple paragraphs with unique paragraph IDs 
          for citation purposes.</p>
          
          <h3>Section ${i}.1</h3>
          <p>This section would contain the actual content of the book, with proper paragraph 
          structure and reference codes. The content would be formatted with appropriate 
          typography and spacing for optimal reading.</p>
          
          <h3>Section ${i}.2</h3>
          <p>Additional content would appear here, maintaining the original structure and 
          formatting of the published work. Cross-references and footnotes would be preserved 
          and properly linked.</p>
          
          <p>To implement the full reading experience, the system would need to:</p>
          <ul>
            <li>Fetch actual content from the EGW API</li>
            <li>Parse and format the text content</li>
            <li>Implement paragraph-level linking</li>
            <li>Add cross-reference functionality</li>
            <li>Include search and navigation features</li>
          </ul>
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

  const handleCrossReferenceNavigation = (bookId: number, chapterNumber: number, paragraphId: string) => {
    if (bookId === parseInt(params.bookId as string)) {
      // Same book - navigate to chapter and paragraph
      setCurrentChapter(chapterNumber);
      
      // Scroll to paragraph after a brief delay to ensure content is rendered
      setTimeout(() => {
        const element = document.getElementById(paragraphId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else {
      // Different book - navigate to that book's page
      router.push(`/books/${bookId}/read?chapter=${chapterNumber}&paragraph=${paragraphId}`);
    }
  };

  const renderChapterContent = (chapter: Chapter) => {
    if (!chapter) return null;
    
    // Split content into paragraphs for permalink support
    const paragraphs = chapter.content.split('</p>').filter(p => p.trim());
    
    return (
      <div className="space-y-6">
        {paragraphs.map((paragraph, index) => {
          const paragraphId = `ch${chapter.chapter}-p${index + 1}`;
          const paragraphNumber = index + 1;
          
          // Clean up paragraph HTML
          const cleanParagraph = paragraph.replace('<p>', '').trim();
          if (!cleanParagraph) return null;
          
          return (
            <ParagraphPermalink
              key={paragraphId}
              bookId={bookId}
              bookTitle={book?.title || 'Unknown'}
              chapterNumber={chapter.chapter}
              paragraphId={paragraphId}
              paragraphNumber={paragraphNumber}
              className="paragraph-container"
            >
              <div 
                className="prose prose-lg max-w-none"
                style={{ fontSize: `${fontSize}px`, lineHeight: '1.7' }}
                dangerouslySetInnerHTML={{ __html: cleanParagraph }}
              />
            </ParagraphPermalink>
          );
        })}
        
        {/* Cross-references - show every few paragraphs */}
        {paragraphs.length > 3 && (
          <div className="mt-8">
            <CrossReference
              references={generateMockCrossReferences(bookId, chapter.chapter)}
              currentBookId={bookId}
              onNavigate={handleCrossReferenceNavigation}
              className="mt-6"
            />
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <BookOpenIcon className="h-8 w-8 text-primary-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600">Loading book content...</p>
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

  const currentChapterData = getCurrentChapter();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-gray-50 border-b">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Breadcrumbs items={breadcrumbPaths.bookRead(book.title, bookId)} />
        </div>
      </div>

      {/* Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/books"
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-lg font-bold text-gray-900">{book.title}</h1>
                <p className="text-sm text-gray-600">{book.author}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Table of Contents */}
              <button
                onClick={() => setShowTableOfContents(true)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md"
              >
                <BookOpenIcon className="h-4 w-4" />
                <span className="text-sm">Contents</span>
              </button>
              
              {/* Font Size Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  className="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  A-
                </button>
                <span className="text-sm text-gray-600">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className="px-2 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  A+
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Chapter Navigation */}
      <EnhancedChapterNav
        chapters={chapters}
        currentChapter={currentChapter}
        onChapterChange={setCurrentChapter}
        bookTitle={book.title}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm border">
          
          {/* Chapter Selector */}
          <div className="border-b p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                {currentChapterData?.title || 'Chapter'}
              </h2>
              <select
                value={currentChapter}
                onChange={(e) => setCurrentChapter(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-3 py-2 focus:ring-primary-500 focus:border-primary-500"
              >
                {chapters.map((chapter) => (
                  <option key={chapter.chapter} value={chapter.chapter}>
                    Chapter {chapter.chapter}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-8">
            {currentChapterData ? (
              renderChapterContent(currentChapterData)
            ) : (
              <div className="prose prose-lg max-w-none">
                <p>Loading chapter content...</p>
              </div>
            )}
          </div>
          
          {/* Navigation Footer */}
          <div className="border-t p-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => navigateChapter('prev')}
                disabled={currentChapter === 1}
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
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
                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next Chapter
                <ChevronRightIcon className="h-4 w-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <TableOfContents
        chapters={chapters}
        currentChapter={currentChapter}
        onChapterSelect={setCurrentChapter}
        isOpen={showTableOfContents}
        onClose={() => setShowTableOfContents(false)}
      />
    </div>
  );
}