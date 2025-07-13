'use client';

import { useState, useEffect, ReactNode } from 'react';
import { EnhancedHeader } from './enhanced-header';

interface ResponsiveLayoutProps {
  children: ReactNode;
  sidebar?: ReactNode;
  className?: string;
  containerSize?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showSidebar?: boolean;
}

export function ResponsiveLayout({ 
  children, 
  sidebar, 
  className = '',
  containerSize = 'xl',
  showSidebar = false
}: ResponsiveLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getContainerClass = () => {
    switch (containerSize) {
      case 'sm': return 'max-w-3xl';
      case 'md': return 'max-w-5xl';
      case 'lg': return 'max-w-6xl';
      case 'xl': return 'max-w-7xl';
      case 'full': return 'max-w-full';
      default: return 'max-w-7xl';
    }
  };

  if (!mounted) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <EnhancedHeader />
      
      <div className={`${getContainerClass()} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
        {showSidebar && sidebar ? (
          <div className="flex gap-8 py-8">
            {/* Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                {sidebar}
              </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0">
              {children}
            </main>

            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div 
                  className="absolute inset-0 bg-black/50" 
                  onClick={() => setSidebarOpen(false)}
                />
                <div className="absolute left-0 top-0 h-full w-80 bg-white shadow-xl overflow-y-auto">
                  <div className="p-6">
                    <button
                      onClick={() => setSidebarOpen(false)}
                      className="mb-4 text-gray-600 hover:text-gray-900"
                    >
                      ✕ Close
                    </button>
                    {sidebar}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <main className="py-8">
            {children}
          </main>
        )}
      </div>

      {/* Mobile Sidebar Toggle Button */}
      {showSidebar && sidebar && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed bottom-6 left-6 lg:hidden z-40 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-colors"
          aria-label="Open sidebar"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
    </div>
  );
}

// Responsive breakpoint utilities
export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px'
};

// Responsive grid components
export function ResponsiveGrid({ 
  children, 
  cols = { sm: 1, md: 2, lg: 3, xl: 4 },
  gap = 6,
  className = ''
}: {
  children: ReactNode;
  cols?: { sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number;
  className?: string;
}) {
  const gridClasses = [
    'grid',
    `grid-cols-${cols.sm || 1}`,
    cols.md && `md:grid-cols-${cols.md}`,
    cols.lg && `lg:grid-cols-${cols.lg}`,
    cols.xl && `xl:grid-cols-${cols.xl}`,
    `gap-${gap}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={gridClasses}>
      {children}
    </div>
  );
}

// Responsive card component
export function ResponsiveCard({ 
  children, 
  padding = 6,
  className = '',
  hover = true
}: {
  children: ReactNode;
  padding?: number;
  className?: string;
  hover?: boolean;
}) {
  const cardClasses = [
    'bg-white rounded-xl border border-gray-200 shadow-sm',
    `p-${padding}`,
    hover && 'hover:shadow-lg transition-shadow duration-200',
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={cardClasses}>
      {children}
    </div>
  );
}

// Responsive container component
export function ResponsiveContainer({ 
  children, 
  size = 'xl',
  className = ''
}: {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  className?: string;
}) {
  const getMaxWidth = () => {
    switch (size) {
      case 'sm': return 'max-w-3xl';
      case 'md': return 'max-w-5xl';
      case 'lg': return 'max-w-6xl';
      case 'xl': return 'max-w-7xl';
      case 'full': return 'max-w-full';
      default: return 'max-w-7xl';
    }
  };

  return (
    <div className={`${getMaxWidth()} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}

// Mobile-first responsive utilities
export const responsive = {
  // Show/hide based on screen size
  showOn: {
    mobile: 'block sm:hidden',
    tablet: 'hidden sm:block lg:hidden',
    desktop: 'hidden lg:block',
    tabletUp: 'hidden sm:block',
    desktopUp: 'hidden lg:block'
  },
  
  // Text sizes
  text: {
    xs: 'text-xs sm:text-sm',
    sm: 'text-sm sm:text-base',
    base: 'text-base sm:text-lg',
    lg: 'text-lg sm:text-xl',
    xl: 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl'
  },
  
  // Spacing
  spacing: {
    xs: 'p-2 sm:p-3',
    sm: 'p-3 sm:p-4',
    base: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
    xl: 'p-8 sm:p-12'
  },
  
  // Flexbox utilities
  flex: {
    col: 'flex flex-col',
    colToRow: 'flex flex-col sm:flex-row',
    rowToCol: 'flex flex-row sm:flex-col',
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between'
  }
};