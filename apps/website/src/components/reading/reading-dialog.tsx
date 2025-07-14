'use client';

import { useState, useEffect, useRef } from 'react';
import { useReading } from '@/contexts/reading-context';
import {
  XMarkIcon,
  MinusIcon,
  PlusIcon,
  BookOpenIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from '@heroicons/react/24/outline';
import { BookReader } from './book-reader';
import { ReadingTabs } from './reading-tabs';

export function ReadingDialog() {
  const { state, closeDialog, minimizeDialog, maximizeDialog } = useReading();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);

  // Handle escape key to close dialog
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && state.isDialogOpen && !state.isMinimized) {
        closeDialog();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [state.isDialogOpen, state.isMinimized, closeDialog]);

  // Prevent body scroll when dialog is open
  useEffect(() => {
    if (state.isDialogOpen && !state.isMinimized) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [state.isDialogOpen, state.isMinimized]);

  const toggleFullscreen = () => {
    if (!isFullscreen) {
      dialogRef.current?.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  if (!state.isDialogOpen) return null;

  // Minimized state - floating tab bar
  if (state.isMinimized) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 flex justify-center">
        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-w-4xl w-full">
          <div className="flex items-center justify-between p-3">
            <div className="flex items-center space-x-2">
              <BookOpenIcon className="h-5 w-5 text-primary-600" />
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                {state.minimizedBookCount} book{state.minimizedBookCount !== 1 ? 's' : ''} open
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={maximizeDialog}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Maximize"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
              <button
                onClick={closeDialog}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                title="Close all books"
              >
                <XMarkIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
          <ReadingTabs />
        </div>
      </div>
    );
  }

  // Full dialog state
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div 
        ref={dialogRef}
        className="bg-white dark:bg-gray-900 w-full h-full flex flex-col relative"
      >
        {/* Dialog Header */}
        <div className="flex-shrink-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center space-x-3">
              <BookOpenIcon className="h-6 w-6 text-primary-600" />
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                EGH Research Reader
              </h2>
              {state.openBooks.size > 1 && (
                <span className="px-2 py-1 bg-primary-100 dark:bg-primary-900 text-primary-800 dark:text-primary-200 rounded-full text-xs font-medium">
                  {state.openBooks.size} books
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Fullscreen toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
              >
                {isFullscreen ? (
                  <ArrowsPointingInIcon className="h-5 w-5" />
                ) : (
                  <ArrowsPointingOutIcon className="h-5 w-5" />
                )}
              </button>
              
              {/* Minimize */}
              <button
                onClick={minimizeDialog}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Minimize"
              >
                <MinusIcon className="h-5 w-5" />
              </button>
              
              {/* Close */}
              <button
                onClick={closeDialog}
                className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
                title="Close all books"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
          
          {/* Reading Tabs */}
          {state.openBooks.size > 0 && <ReadingTabs />}
        </div>
        
        {/* Dialog Content */}
        <div className="flex-1 overflow-hidden">
          <BookReader />
        </div>
      </div>
    </div>
  );
}