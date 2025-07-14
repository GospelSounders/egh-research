'use client';

import { useState } from 'react';
import { 
  LinkIcon, 
  ClipboardDocumentIcon,
  CheckIcon,
  ShareIcon
} from '@heroicons/react/24/outline';

interface ParagraphPermalinkProps {
  bookId: number;
  bookTitle: string;
  chapterNumber: number;
  paragraphId: string;
  paragraphNumber: number;
  children: React.ReactNode;
  className?: string;
}

export function ParagraphPermalink({ 
  bookId, 
  bookTitle, 
  chapterNumber, 
  paragraphId, 
  paragraphNumber,
  children,
  className = ''
}: ParagraphPermalinkProps) {
  const [showCitation, setShowCitation] = useState(false);
  const [copied, setCopied] = useState(false);

  // Generate permalink URL
  const getPermalinkUrl = () => {
    const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
    return `${baseUrl}/books/${bookId}/read?chapter=${chapterNumber}&paragraph=${paragraphId}`;
  };

  // Generate citation in different formats
  const getCitations = () => {
    const url = getPermalinkUrl();
    const currentYear = new Date().getFullYear();
    
    return {
      apa: `${bookTitle}, Chapter ${chapterNumber}, Paragraph ${paragraphNumber}. Retrieved ${currentYear}, from ${url}`,
      mla: `"${bookTitle}." Chapter ${chapterNumber}, Paragraph ${paragraphNumber}. Web. ${new Date().toLocaleDateString()}.`,
      chicago: `"${bookTitle}," Chapter ${chapterNumber}, Paragraph ${paragraphNumber}, accessed ${new Date().toLocaleDateString()}, ${url}.`,
      url: url
    };
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const handleShare = async () => {
    const url = getPermalinkUrl();
    const title = `${bookTitle} - Chapter ${chapterNumber}, Paragraph ${paragraphNumber}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          url,
          text: `Check out this passage from ${bookTitle}`
        });
      } catch (err) {
        console.error('Share failed: ', err);
      }
    } else {
      // Fallback to copy URL
      handleCopy(url);
    }
  };

  return (
    <div 
      id={paragraphId}
      className={`group relative ${className}`}
      onMouseEnter={() => setShowCitation(true)}
      onMouseLeave={() => setShowCitation(false)}
    >
      {/* Paragraph Content */}
      <div className="relative">
        {children}
        
        {/* Permalink Icon */}
        <button
          onClick={() => handleCopy(getPermalinkUrl())}
          className="absolute -left-6 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-1 text-gray-400 hover:text-primary-600"
          title="Copy permalink"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        
        {/* Paragraph Number */}
        <span className="absolute -right-8 top-0 text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
          ¶{paragraphNumber}
        </span>
      </div>
      
      {/* Citation Popup */}
      {showCitation && (
        <div className="absolute top-full left-0 mt-2 w-96 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4 z-50">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-900 dark:text-white">
              Citation & Permalink
            </h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="p-1 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                title="Share"
              >
                <ShareIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          
          <div className="space-y-3">
            {/* URL */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Permalink URL
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={getCitations().url}
                  readOnly
                  className="flex-1 px-3 py-2 text-xs border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                />
                <button
                  onClick={() => handleCopy(getCitations().url)}
                  className="p-2 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400"
                  title="Copy URL"
                >
                  {copied ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                  ) : (
                    <ClipboardDocumentIcon className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
            
            {/* Citation Formats */}
            <div>
              <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                Citation Formats
              </label>
              <div className="space-y-2">
                {Object.entries(getCitations()).map(([format, citation]) => {
                  if (format === 'url') return null;
                  
                  return (
                    <div key={format} className="flex items-start space-x-2">
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase min-w-0 w-16">
                        {format}:
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-700 dark:text-gray-300 break-words">
                          {citation}
                        </p>
                        <button
                          onClick={() => handleCopy(citation)}
                          className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 mt-1"
                        >
                          Copy
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}