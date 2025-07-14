import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Search Results - EGH Research',
  description: 'Search results for Ellen Gould Harmon writings. Find books, chapters, and content across the complete digital library.',
  robots: {
    index: true,
    follow: true,
  },
};

export default function SearchLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}