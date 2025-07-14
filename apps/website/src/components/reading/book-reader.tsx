'use client';

import { useState, useEffect, useRef } from 'react';
import { useReading } from '@/contexts/reading-context';
import { egwAPI } from '@/lib/egw-api';
import { 
  BookOpenIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { TableOfContents } from '@/components/books/table-of-contents';
import { ParagraphPermalink } from '@/components/books/paragraph-permalink';
import { EnhancedChapterNav } from '@/components/books/enhanced-chapter-nav';
import { CrossReference, generateMockCrossReferences } from '@/components/books/cross-reference';

interface Chapter {
  chapter: number;
  title: string;
  content: string;
}

export function BookReader() {
  const { 
    state, 
    getActiveBook, 
    updateChapter, 
    updateScrollPosition,
    closeBook 
  } = useReading();
  
  const activeBook = getActiveBook();
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(16);
  const [showTableOfContents, setShowTableOfContents] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load book content when active book changes
  useEffect(() => {
    if (activeBook) {
      loadBookContent(activeBook.book.book_id);
    }
  }, [activeBook?.book.book_id]);

  // Restore scroll position when chapter changes
  useEffect(() => {
    if (activeBook && contentRef.current) {
      contentRef.current.scrollTop = activeBook.scrollPosition;
    }
  }, [activeBook?.currentChapter]);

  // Save scroll position periodically
  useEffect(() => {
    if (!activeBook || !contentRef.current) return;

    const handleScroll = () => {
      if (contentRef.current && activeBook) {
        updateScrollPosition(activeBook.book.book_id, contentRef.current.scrollTop);
      }
    };

    const contentElement = contentRef.current;
    contentElement.addEventListener('scroll', handleScroll);
    
    return () => contentElement.removeEventListener('scroll', handleScroll);
  }, [activeBook, updateScrollPosition]);

  const loadBookContent = async (bookId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      // Try to get actual content from database first
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
          // Fallback to generated sample content
          generateSampleChapters();
        }
      } catch (contentError) {
        console.warn('Could not load database content, using sample:', contentError);
        generateSampleChapters();
      }
    } catch (error) {
      setError('Failed to load book content');
      console.error('Error loading book content:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSampleChapters = () => {
    if (!activeBook) return;
    
    const book = activeBook.book;
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
    if (!activeBook) return null;
    return chapters.find(ch => ch.chapter === activeBook.currentChapter) || chapters[0];
  };

  const navigateChapter = (direction: 'prev' | 'next') => {
    if (!activeBook) return;
    
    const currentChapter = activeBook.currentChapter;
    if (direction === 'prev' && currentChapter > 1) {
      updateChapter(activeBook.book.book_id, currentChapter - 1);
    } else if (direction === 'next' && currentChapter < chapters.length) {
      updateChapter(activeBook.book.book_id, currentChapter + 1);
    }
  };

  const handleCrossReferenceNavigation = (bookId: number, chapterNumber: number, paragraphId: string) => {
    if (activeBook && bookId === activeBook.book.book_id) {
      // Same book - navigate to chapter and paragraph
      updateChapter(bookId, chapterNumber);
      
      // Scroll to paragraph after a brief delay to ensure content is rendered
      setTimeout(() => {
        const element = document.getElementById(paragraphId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    } else {
      // Different book - would need to open that book (future enhancement)
      console.log('Navigation to different book not yet implemented');
    }
  };

  const renderChapterContent = (chapter: Chapter) => {
    if (!chapter || !activeBook) return null;
    
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
              bookId={activeBook.book.book_id}
              bookTitle={activeBook.book.title}
              chapterNumber={chapter.chapter}
              paragraphId={paragraphId}
              paragraphNumber={paragraphNumber}
              className="paragraph-container"
            >
              <div 
                className="prose prose-lg max-w-none dark:prose-invert"
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
              references={generateMockCrossReferences(activeBook.book.book_id, chapter.chapter)}
              currentBookId={activeBook.book.book_id}
              onNavigate={handleCrossReferenceNavigation}
              className="mt-6"
            />
          </div>
        )}
      </div>
    );
  };

  if (!activeBook) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <BookOpenIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            No Book Selected
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Open a book from the library to start reading
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <BookOpenIcon className="h-8 w-8 text-primary-600 animate-pulse mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading book content...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            Error Loading Book
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
          <button
            onClick={() => closeBook(activeBook.book.book_id)}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            <ArrowLeftIcon className="h-4 w-4 mr-2" />
            Close Book
          </button>
        </div>
      </div>
    );
  }

  const currentChapterData = getCurrentChapter();

  return (
    <div className="flex h-full bg-gray-50 dark:bg-gray-900">
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Enhanced Chapter Navigation */}
        <EnhancedChapterNav
          chapters={chapters}
          currentChapter={activeBook.currentChapter}
          onChapterChange={(chapter) => updateChapter(activeBook.book.book_id, chapter)}
          bookTitle={activeBook.book.title}
        />

        {/* Reading Controls */}
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentChapterData?.title || 'Chapter'}
              </h2>
              <select
                value={activeBook.currentChapter}
                onChange={(e) => updateChapter(activeBook.book.book_id, parseInt(e.target.value))}
                className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
              >
                {chapters.map((chapter) => (
                  <option key={chapter.chapter} value={chapter.chapter}>
                    Chapter {chapter.chapter}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Table of Contents */}
              <button
                onClick={() => setShowTableOfContents(true)}
                className="flex items-center space-x-2 px-3 py-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md"
              >
                <BookOpenIcon className="h-4 w-4" />
                <span className="text-sm">Contents</span>
              </button>
              
              {/* Font Size Controls */}
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setFontSize(Math.max(12, fontSize - 2))}
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  A-
                </button>
                <span className="text-sm text-gray-600 dark:text-gray-400">{fontSize}px</span>
                <button
                  onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                  className="px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  A+
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div 
          ref={contentRef}
          className="flex-1 overflow-y-auto bg-white dark:bg-gray-900"
        >
          <div className="max-w-4xl mx-auto px-6 py-8">
            {currentChapterData ? (
              renderChapterContent(currentChapterData)
            ) : (
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <p>Loading chapter content...</p>
              </div>
            )}
          </div>
          
          {/* Navigation Footer */}
          <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <button
                onClick={() => navigateChapter('prev')}
                disabled={activeBook.currentChapter === 1}
                className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeftIcon className="h-4 w-4 mr-2" />
                Previous Chapter
              </button>
              
              <div className="text-sm text-gray-500 dark:text-gray-400">
                Chapter {activeBook.currentChapter} of {chapters.length}
              </div>
              
              <button
                onClick={() => navigateChapter('next')}
                disabled={activeBook.currentChapter === chapters.length}
                className="flex items-center px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
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
        currentChapter={activeBook.currentChapter}
        onChapterSelect={(chapter) => updateChapter(activeBook.book.book_id, chapter)}
        isOpen={showTableOfContents}
        onClose={() => setShowTableOfContents(false)}
      />
    </div>
  );
}