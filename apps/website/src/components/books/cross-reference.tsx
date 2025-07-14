'use client';

import { useState } from 'react';
import { 
  ArrowTopRightOnSquareIcon,
  BookOpenIcon,
  LinkIcon
} from '@heroicons/react/24/outline';

interface CrossReference {
  id: string;
  bookId: number;
  bookTitle: string;
  chapterNumber: number;
  paragraphId: string;
  text: string;
  context: string;
}

interface CrossReferenceProps {
  references: CrossReference[];
  currentBookId: number;
  onNavigate: (bookId: number, chapterNumber: number, paragraphId: string) => void;
  className?: string;
}

export function CrossReference({ 
  references, 
  currentBookId, 
  onNavigate, 
  className = '' 
}: CrossReferenceProps) {
  const [expanded, setExpanded] = useState(false);

  if (references.length === 0) return null;

  return (
    <div className={`bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 ${className}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <LinkIcon className="h-4 w-4 text-blue-600" />
          <h4 className="text-sm font-semibold text-blue-900 dark:text-blue-200">
            Related References ({references.length})
          </h4>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
        >
          {expanded ? 'Show Less' : 'Show All'}
        </button>
      </div>

      <div className="space-y-3">
        {references.slice(0, expanded ? references.length : 2).map((ref) => (
          <div
            key={ref.id}
            className="bg-white dark:bg-gray-800 rounded-md p-3 border border-blue-100 dark:border-blue-800"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <BookOpenIcon className="h-3 w-3 text-gray-500" />
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                    {ref.bookTitle}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Chapter {ref.chapterNumber}
                  </span>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {ref.context}
                </p>
                <p className="text-sm text-gray-800 dark:text-gray-200 italic">
                  "{ref.text}"
                </p>
              </div>
              <button
                onClick={() => onNavigate(ref.bookId, ref.chapterNumber, ref.paragraphId)}
                className="ml-3 p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
                title="Go to reference"
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {references.length > 2 && !expanded && (
        <div className="mt-3 text-center">
          <button
            onClick={() => setExpanded(true)}
            className="text-xs text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-200"
          >
            Show {references.length - 2} more references
          </button>
        </div>
      )}
    </div>
  );
}

// Helper function to generate mock cross-references
export function generateMockCrossReferences(currentBookId: number, chapterNumber: number): CrossReference[] {
  const mockReferences: CrossReference[] = [
    {
      id: '1',
      bookId: currentBookId + 1,
      bookTitle: 'The Great Controversy',
      chapterNumber: chapterNumber + 1,
      paragraphId: 'ch' + (chapterNumber + 1) + '-p3',
      text: 'This theme is further developed in the context of spiritual warfare.',
      context: 'Discussion of similar spiritual principles'
    },
    {
      id: '2',
      bookId: currentBookId + 2,
      bookTitle: 'Steps to Christ',
      chapterNumber: 5,
      paragraphId: 'ch5-p7',
      text: 'The path to spiritual growth requires dedication and consistent practice.',
      context: 'Practical guidance for spiritual development'
    },
    {
      id: '3',
      bookId: currentBookId,
      bookTitle: 'Current Book',
      chapterNumber: chapterNumber - 1,
      paragraphId: 'ch' + (chapterNumber - 1) + '-p4',
      text: 'Earlier foundation concepts that relate to this topic.',
      context: 'Background information from previous chapter'
    }
  ];

  return mockReferences;
}