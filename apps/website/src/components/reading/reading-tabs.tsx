'use client';

import { useReading } from '@/contexts/reading-context';
import { XMarkIcon, BookOpenIcon } from '@heroicons/react/24/outline';

export function ReadingTabs() {
  const { state, setActiveBook, closeBook, getOpenBooksArray } = useReading();
  const openBooks = getOpenBooksArray();

  if (openBooks.length === 0) return null;

  const handleTabClick = (bookId: number) => {
    setActiveBook(bookId);
  };

  const handleCloseTab = (e: React.MouseEvent, bookId: number) => {
    e.stopPropagation();
    closeBook(bookId);
  };

  const truncateTitle = (title: string, maxLength: number = 30) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  return (
    <div className="flex overflow-x-auto scrollbar-hide border-b border-gray-200 dark:border-gray-700">
      <div className="flex min-w-full">
        {openBooks.map((openBook) => {
          const isActive = state.activeBookId === openBook.book.book_id;
          
          return (
            <div
              key={openBook.book.book_id}
              onClick={() => handleTabClick(openBook.book.book_id)}
              className={`
                relative flex items-center space-x-2 px-4 py-3 border-r border-gray-200 dark:border-gray-700 cursor-pointer min-w-0 flex-shrink-0
                ${isActive 
                  ? 'bg-white dark:bg-gray-900 border-b-2 border-b-primary-500 text-primary-600 dark:text-primary-400' 
                  : 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
                }
                transition-colors duration-200
              `}
              style={{ maxWidth: '200px' }}
            >
              <BookOpenIcon className="h-4 w-4 flex-shrink-0" />
              
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm truncate">
                  {truncateTitle(openBook.book.title)}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                  Chapter {openBook.currentChapter}
                </div>
              </div>
              
              <button
                onClick={(e) => handleCloseTab(e, openBook.book.book_id)}
                className={`
                  p-1 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors
                  ${isActive ? 'text-gray-600 dark:text-gray-300' : 'text-gray-400 dark:text-gray-500'}
                `}
                title={`Close ${openBook.book.title}`}
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-500"></div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Tab controls */}
      {openBooks.length > 3 && (
        <div className="flex-shrink-0 flex items-center px-2 bg-gray-50 dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {openBooks.length} books
          </span>
        </div>
      )}
    </div>
  );
}