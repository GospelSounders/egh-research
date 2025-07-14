'use client';

import Link from 'next/link';
import { useState } from 'react';
import { MagnifyingGlassIcon, Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { SearchBar } from '@/components/search/search-bar';

const navigation = [
  { name: 'Home', href: '/' },
  { name: 'Browse Books', href: '/books' },
  { name: 'Search', href: '/search' },
  { name: 'Research', href: '/research' },
  { name: 'About', href: '/about' },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center px-1">
                <span className="text-white font-bold text-xs">EGH</span>
              </div>
              <span className="font-serif font-semibold text-xl text-gray-900">
                Research
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex md:items-center md:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Search and mobile menu */}
          <div className="flex items-center space-x-4">
            {/* Search button */}
            <button
              onClick={() => setSearchOpen(true)}
              className="p-2 text-gray-500 hover:text-primary-600 transition-colors"
              aria-label="Search"
            >
              <MagnifyingGlassIcon className="h-5 w-5" />
            </button>

            {/* Mobile menu button */}
            <button
              type="button"
              className="md:hidden p-2 text-gray-500 hover:text-primary-600"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open menu"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="fixed inset-0 z-50 bg-gray-600 bg-opacity-50" aria-hidden="true" />
            <div className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-white px-6 py-6 sm:ring-1 sm:ring-gray-900/10">
              <div className="flex items-center justify-between">
                <Link href="/" className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-primary-600 rounded-lg flex items-center justify-center px-1">
                    <span className="text-white font-bold text-xs">EGH</span>
                  </div>
                  <span className="font-serif font-semibold text-xl text-gray-900">
                    Research
                  </span>
                </Link>
                <button
                  type="button"
                  className="p-2 text-gray-500"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              <div className="mt-8 space-y-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-gray-900 hover:bg-gray-50 rounded-md"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Search overlay */}
      {searchOpen && (
        <SearchBar onClose={() => setSearchOpen(false)} />
      )}
    </header>
  );
}