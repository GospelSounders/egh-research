'use client';

import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { type APIBook } from '@/lib/egw-api';

export interface OpenBook {
  book: APIBook;
  currentChapter: number;
  scrollPosition: number;
  lastAccessed: number;
}

interface ReadingState {
  openBooks: Map<number, OpenBook>;
  activeBookId: number | null;
  isDialogOpen: boolean;
  isMinimized: boolean;
  minimizedBookCount: number;
}

type ReadingAction =
  | { type: 'OPEN_BOOK'; book: APIBook }
  | { type: 'CLOSE_BOOK'; bookId: number }
  | { type: 'SET_ACTIVE_BOOK'; bookId: number }
  | { type: 'UPDATE_CHAPTER'; bookId: number; chapter: number }
  | { type: 'UPDATE_SCROLL_POSITION'; bookId: number; position: number }
  | { type: 'TOGGLE_DIALOG' }
  | { type: 'MINIMIZE_DIALOG' }
  | { type: 'MAXIMIZE_DIALOG' }
  | { type: 'CLOSE_DIALOG' };

const initialState: ReadingState = {
  openBooks: new Map(),
  activeBookId: null,
  isDialogOpen: false,
  isMinimized: false,
  minimizedBookCount: 0,
};

function readingReducer(state: ReadingState, action: ReadingAction): ReadingState {
  switch (action.type) {
    case 'OPEN_BOOK': {
      const newOpenBooks = new Map(state.openBooks);
      const existingBook = newOpenBooks.get(action.book.book_id);
      
      const openBook: OpenBook = {
        book: action.book,
        currentChapter: existingBook?.currentChapter || 1,
        scrollPosition: existingBook?.scrollPosition || 0,
        lastAccessed: Date.now(),
      };
      
      newOpenBooks.set(action.book.book_id, openBook);
      
      return {
        ...state,
        openBooks: newOpenBooks,
        activeBookId: action.book.book_id,
        isDialogOpen: true,
        isMinimized: false,
        minimizedBookCount: newOpenBooks.size,
      };
    }
    
    case 'CLOSE_BOOK': {
      const newOpenBooks = new Map(state.openBooks);
      newOpenBooks.delete(action.bookId);
      
      let newActiveBookId = state.activeBookId;
      
      // If we're closing the active book, switch to another open book
      if (state.activeBookId === action.bookId) {
        const remainingBooks = Array.from(newOpenBooks.values());
        if (remainingBooks.length > 0) {
          // Switch to the most recently accessed book
          const mostRecent = remainingBooks.reduce((latest, current) =>
            current.lastAccessed > latest.lastAccessed ? current : latest
          );
          newActiveBookId = mostRecent.book.book_id;
        } else {
          newActiveBookId = null;
        }
      }
      
      return {
        ...state,
        openBooks: newOpenBooks,
        activeBookId: newActiveBookId,
        isDialogOpen: newOpenBooks.size > 0,
        minimizedBookCount: newOpenBooks.size,
      };
    }
    
    case 'SET_ACTIVE_BOOK': {
      const openBook = state.openBooks.get(action.bookId);
      if (!openBook) return state;
      
      // Update last accessed time
      const newOpenBooks = new Map(state.openBooks);
      newOpenBooks.set(action.bookId, {
        ...openBook,
        lastAccessed: Date.now(),
      });
      
      return {
        ...state,
        openBooks: newOpenBooks,
        activeBookId: action.bookId,
        isMinimized: false,
      };
    }
    
    case 'UPDATE_CHAPTER': {
      const openBook = state.openBooks.get(action.bookId);
      if (!openBook) return state;
      
      const newOpenBooks = new Map(state.openBooks);
      newOpenBooks.set(action.bookId, {
        ...openBook,
        currentChapter: action.chapter,
        lastAccessed: Date.now(),
      });
      
      return {
        ...state,
        openBooks: newOpenBooks,
      };
    }
    
    case 'UPDATE_SCROLL_POSITION': {
      const openBook = state.openBooks.get(action.bookId);
      if (!openBook) return state;
      
      const newOpenBooks = new Map(state.openBooks);
      newOpenBooks.set(action.bookId, {
        ...openBook,
        scrollPosition: action.position,
      });
      
      return {
        ...state,
        openBooks: newOpenBooks,
      };
    }
    
    case 'TOGGLE_DIALOG':
      return {
        ...state,
        isDialogOpen: !state.isDialogOpen,
      };
    
    case 'MINIMIZE_DIALOG':
      return {
        ...state,
        isMinimized: true,
      };
    
    case 'MAXIMIZE_DIALOG':
      return {
        ...state,
        isMinimized: false,
      };
    
    case 'CLOSE_DIALOG':
      return {
        ...state,
        isDialogOpen: false,
        isMinimized: false,
      };
    
    default:
      return state;
  }
}

interface ReadingContextType {
  state: ReadingState;
  openBook: (book: APIBook) => void;
  closeBook: (bookId: number) => void;
  setActiveBook: (bookId: number) => void;
  updateChapter: (bookId: number, chapter: number) => void;
  updateScrollPosition: (bookId: number, position: number) => void;
  toggleDialog: () => void;
  minimizeDialog: () => void;
  maximizeDialog: () => void;
  closeDialog: () => void;
  getActiveBook: () => OpenBook | null;
  getOpenBooksArray: () => OpenBook[];
}

const ReadingContext = createContext<ReadingContextType | undefined>(undefined);

export function ReadingProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(readingReducer, initialState);
  
  const openBook = (book: APIBook) => {
    dispatch({ type: 'OPEN_BOOK', book });
  };
  
  const closeBook = (bookId: number) => {
    dispatch({ type: 'CLOSE_BOOK', bookId });
  };
  
  const setActiveBook = (bookId: number) => {
    dispatch({ type: 'SET_ACTIVE_BOOK', bookId });
  };
  
  const updateChapter = (bookId: number, chapter: number) => {
    dispatch({ type: 'UPDATE_CHAPTER', bookId, chapter });
  };
  
  const updateScrollPosition = (bookId: number, position: number) => {
    dispatch({ type: 'UPDATE_SCROLL_POSITION', bookId, position });
  };
  
  const toggleDialog = () => {
    dispatch({ type: 'TOGGLE_DIALOG' });
  };
  
  const minimizeDialog = () => {
    dispatch({ type: 'MINIMIZE_DIALOG' });
  };
  
  const maximizeDialog = () => {
    dispatch({ type: 'MAXIMIZE_DIALOG' });
  };
  
  const closeDialog = () => {
    dispatch({ type: 'CLOSE_DIALOG' });
  };
  
  const getActiveBook = (): OpenBook | null => {
    if (!state.activeBookId) return null;
    return state.openBooks.get(state.activeBookId) || null;
  };
  
  const getOpenBooksArray = (): OpenBook[] => {
    return Array.from(state.openBooks.values()).sort((a, b) => b.lastAccessed - a.lastAccessed);
  };
  
  const value: ReadingContextType = {
    state,
    openBook,
    closeBook,
    setActiveBook,
    updateChapter,
    updateScrollPosition,
    toggleDialog,
    minimizeDialog,
    maximizeDialog,
    closeDialog,
    getActiveBook,
    getOpenBooksArray,
  };
  
  return (
    <ReadingContext.Provider value={value}>
      {children}
    </ReadingContext.Provider>
  );
}

export function useReading() {
  const context = useContext(ReadingContext);
  if (context === undefined) {
    throw new Error('useReading must be used within a ReadingProvider');
  }
  return context;
}