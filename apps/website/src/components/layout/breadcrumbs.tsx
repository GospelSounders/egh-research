'use client';

import Link from 'next/link';
import { ChevronRightIcon, HomeIcon } from '@heroicons/react/24/outline';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  return (
    <nav className={`flex ${className}`} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1 md:space-x-3">
        {/* Home link */}
        <li>
          <Link
            href="/"
            className="text-gray-400 hover:text-gray-500 transition-colors"
            aria-label="Home"
          >
            <HomeIcon className="h-4 w-4" />
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            <ChevronRightIcon className="h-4 w-4 text-gray-300 mx-1" />
            {item.current || !item.href ? (
              <span className="text-sm font-medium text-gray-500 truncate max-w-xs">
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors truncate max-w-xs"
              >
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Utility function to generate common breadcrumb paths
export const breadcrumbPaths = {
  books: () => [{ label: 'Books', href: '/books' }],
  
  bookRead: (bookTitle: string, bookId: number) => [
    { label: 'Books', href: '/books' },
    { label: bookTitle, href: `/books/${bookId}` },
    { label: 'Read', current: true }
  ],
  
  bookPdf: (bookTitle: string, bookId: number) => [
    { label: 'Books', href: '/books' },
    { label: bookTitle, href: `/books/${bookId}` },
    { label: 'PDF', current: true }
  ],
  
  search: (query?: string) => [
    { label: 'Search', href: '/search' },
    ...(query ? [{ label: `"${query}"`, current: true }] : [])
  ],
  
  research: () => [{ label: 'Research', href: '/research' }],
  
  researchCompile: () => [
    { label: 'Research', href: '/research' },
    { label: 'Compile', current: true }
  ],
  
  about: () => [{ label: 'About', current: true }],
  
  contact: () => [{ label: 'Contact', current: true }],
  
  docs: () => [{ label: 'Documentation', href: '/docs' }],
  
  docsApi: () => [
    { label: 'Documentation', href: '/docs' },
    { label: 'API', current: true }
  ],
  
  docsData: () => [
    { label: 'Documentation', href: '/docs' },
    { label: 'Data', current: true }
  ],
  
  legal: (page: string) => [
    { label: 'Legal', href: '/legal' },
    { label: page, current: true }
  ]
};