'use client';

import { useState } from 'react';
import { 
  ChevronDownIcon, 
  ChevronRightIcon, 
  BookOpenIcon,
  MagnifyingGlassIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

interface Chapter {
  chapter: number;
  title: string;
  content: string;
  sections?: Section[];
}

interface Section {
  id: string;
  title: string;
  paragraphs: number;
  startParagraph: number;
}

interface TableOfContentsProps {
  chapters: Chapter[];
  currentChapter: number;
  onChapterSelect: (chapterNumber: number) => void;
  onSectionSelect?: (chapterNumber: number, sectionId: string) => void;
  isOpen: boolean;
  onClose: () => void;
}

// Generate sections from chapter content (enhanced version)
function generateSectionsFromContent(chapter: Chapter): Section[] {
  const sections: Section[] = [];
  
  // Extract h3 elements from HTML content to create sections
  const h3Matches = chapter.content.match(/<h3[^>]*>(.*?)<\/h3>/g);
  
  if (h3Matches) {
    h3Matches.forEach((match, index) => {
      const titleMatch = match.match(/<h3[^>]*>(.*?)<\/h3>/);
      if (titleMatch) {
        sections.push({
          id: `section-${chapter.chapter}-${index + 1}`,
          title: titleMatch[1],
          paragraphs: 3 + Math.floor(Math.random() * 5), // Mock paragraph count
          startParagraph: index * 8 + 1
        });
      }
    });
  }
  
  return sections;
}

export function TableOfContents({ 
  chapters, 
  currentChapter, 
  onChapterSelect,
  onSectionSelect,
  isOpen,
  onClose
}: TableOfContentsProps) {
  const [expandedChapters, setExpandedChapters] = useState<number[]>([currentChapter]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const toggleChapterExpansion = (chapterNumber: number) => {
    setExpandedChapters(prev => 
      prev.includes(chapterNumber) 
        ? prev.filter(num => num !== chapterNumber)
        : [...prev, chapterNumber]
    );
  };

  const handleChapterClick = (chapterNumber: number) => {
    onChapterSelect(chapterNumber);
    if (!expandedChapters.includes(chapterNumber)) {
      toggleChapterExpansion(chapterNumber);
    }
  };

  const handleSectionClick = (chapterNumber: number, sectionId: string) => {
    if (onSectionSelect) {
      onSectionSelect(chapterNumber, sectionId);
    }
  };

  // Filter chapters based on search
  const filteredChapters = chapters.filter(chapter =>
    chapter.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chapter.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-start justify-start">
      <div className="bg-white dark:bg-gray-800 h-full w-80 shadow-xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <BookOpenIcon className="h-5 w-5 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Table of Contents
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>
          
          {/* Search Toggle */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              <span>Search Contents</span>
            </button>
          </div>
          
          {/* Search Bar */}
          {showSearch && (
            <div className="mt-3">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search chapters and sections..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>
          )}
        </div>
        
        {/* Contents */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredChapters.map((chapter) => {
              const sections = generateSectionsFromContent(chapter);
              const isExpanded = expandedChapters.includes(chapter.chapter);
              const isCurrent = chapter.chapter === currentChapter;
              
              return (
                <div key={chapter.chapter} className="border-b border-gray-100 dark:border-gray-700 pb-2">
                  {/* Chapter Header */}
                  <div 
                    className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 ${
                      isCurrent ? 'bg-primary-50 dark:bg-primary-900/20 border-l-4 border-primary-500' : ''
                    }`}
                    onClick={() => handleChapterClick(chapter.chapter)}
                  >
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleChapterExpansion(chapter.chapter);
                        }}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                      >
                        {isExpanded ? (
                          <ChevronDownIcon className="h-4 w-4" />
                        ) : (
                          <ChevronRightIcon className="h-4 w-4" />
                        )}
                      </button>
                      <div>
                        <div className={`font-medium ${isCurrent ? 'text-primary-700 dark:text-primary-400' : 'text-gray-900 dark:text-white'}`}>
                          {chapter.title}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {sections.length} sections
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      Ch. {chapter.chapter}
                    </div>
                  </div>
                  
                  {/* Sections */}
                  {isExpanded && sections.length > 0 && (
                    <div className="ml-8 mt-2 space-y-1">
                      {sections.map((section) => (
                        <div
                          key={section.id}
                          onClick={() => handleSectionClick(chapter.chapter, section.id)}
                          className="flex items-center justify-between p-2 text-sm rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        >
                          <div>
                            <div className="font-medium">{section.title}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {section.paragraphs} paragraphs
                            </div>
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            ¶{section.startParagraph}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* Search Results Summary */}
          {searchQuery && (
            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
              <div className="text-sm text-gray-600 dark:text-gray-400">
                Found {filteredChapters.length} chapters matching "{searchQuery}"
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {chapters.length} chapters total
          </div>
        </div>
      </div>
    </div>
  );
}