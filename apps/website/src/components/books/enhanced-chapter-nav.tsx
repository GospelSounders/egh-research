'use client';

import { useState, useEffect } from 'react';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon,
  MagnifyingGlassIcon,
  BookOpenIcon,
  ClockIcon,
  BookmarkIcon
} from '@heroicons/react/24/outline';

interface Chapter {
  chapter: number;
  title: string;
  content: string;
}

interface EnhancedChapterNavProps {
  chapters: Chapter[];
  currentChapter: number;
  onChapterChange: (chapter: number) => void;
  bookTitle: string;
  className?: string;
}

interface SearchResult {
  chapter: number;
  title: string;
  snippet: string;
  matches: number;
}

export function EnhancedChapterNav({ 
  chapters, 
  currentChapter, 
  onChapterChange, 
  bookTitle,
  className = ''
}: EnhancedChapterNavProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showSearch, setShowSearch] = useState(false);
  const [recentChapters, setRecentChapters] = useState<number[]>([]);

  // Track recent chapters for quick navigation
  useEffect(() => {
    setRecentChapters(prev => {
      const updated = [currentChapter, ...prev.filter(ch => ch !== currentChapter)];
      return updated.slice(0, 5); // Keep last 5 chapters
    });
  }, [currentChapter]);

  // Search within book content
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results: SearchResult[] = [];

    chapters.forEach(chapter => {
      const content = chapter.content.toLowerCase();
      const matches = (content.match(new RegExp(query, 'g')) || []).length;
      
      if (matches > 0) {
        // Extract snippet around first match
        const index = content.indexOf(query);
        const start = Math.max(0, index - 50);
        const end = Math.min(content.length, index + query.length + 50);
        let snippet = chapter.content.substring(start, end);
        
        // Clean up HTML tags for snippet
        snippet = snippet.replace(/<[^>]*>/g, '');
        if (start > 0) snippet = '...' + snippet;
        if (end < content.length) snippet = snippet + '...';
        
        results.push({
          chapter: chapter.chapter,
          title: chapter.title,
          snippet,
          matches
        });
      }
    });

    setSearchResults(results.sort((a, b) => b.matches - a.matches));
  }, [searchQuery, chapters]);

  const navigateToChapter = (chapter: number) => {
    onChapterChange(chapter);
    setShowSearch(false);
  };

  const getChapterProgress = () => {
    return Math.round((currentChapter / chapters.length) * 100);
  };

  const canGoBack = currentChapter > 1;
  const canGoForward = currentChapter < chapters.length;

  return (
    <div className={`bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 ${className}`}>
      {/* Main Navigation Bar */}
      <div className="flex items-center justify-between p-4">
        {/* Chapter Navigation */}
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigateToChapter(currentChapter - 1)}
            disabled={!canGoBack}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeftIcon className="h-4 w-4" />
            <span className="text-sm">Previous</span>
          </button>
          
          <div className="flex items-center space-x-3">
            <BookOpenIcon className="h-5 w-5 text-primary-600" />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-white">
                Chapter {currentChapter} of {chapters.length}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">
                {chapters[currentChapter - 1]?.title}
              </div>
            </div>
          </div>
          
          <button
            onClick={() => navigateToChapter(currentChapter + 1)}
            disabled={!canGoForward}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span className="text-sm">Next</span>
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
        
        {/* Search Toggle */}
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md"
          >
            <MagnifyingGlassIcon className="h-4 w-4" />
            <span className="text-sm">Search in Book</span>
          </button>
        </div>
      </div>
      
      {/* Progress Bar */}
      <div className="w-full bg-gray-200 dark:bg-gray-700 h-1">
        <div 
          className="bg-primary-600 h-1 transition-all duration-300"
          style={{ width: `${getChapterProgress()}%` }}
        />
      </div>
      
      {/* Search Panel */}
      {showSearch && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="max-w-2xl">
            {/* Search Input */}
            <div className="relative mb-4">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={`Search within "${bookTitle}"...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            
            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Found {searchResults.length} chapters with "{searchQuery}"
                </div>
                {searchResults.map((result) => (
                  <div
                    key={result.chapter}
                    onClick={() => navigateToChapter(result.chapter)}
                    className="p-3 border border-gray-200 dark:border-gray-600 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {result.title}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {result.matches} matches
                      </div>
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {result.snippet}
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* No Results */}
            {searchQuery && searchResults.length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <MagnifyingGlassIcon className="h-8 w-8 mx-auto mb-2" />
                <p>No results found for "{searchQuery}"</p>
                <p className="text-sm">Try different keywords or check spelling</p>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Recent Chapters */}
      {recentChapters.length > 1 && (
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <ClockIcon className="h-4 w-4" />
              <span>Recent:</span>
            </div>
            <div className="flex items-center space-x-2">
              {recentChapters.slice(1).map((chapter) => (
                <button
                  key={chapter}
                  onClick={() => navigateToChapter(chapter)}
                  className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"
                >
                  Ch. {chapter}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}