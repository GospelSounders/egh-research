import type { Metadata } from 'next';
import { Inter, Crimson_Text } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const crimsonText = Crimson_Text({ 
  weight: ['400', '600'],
  style: ['normal', 'italic'],
  subsets: ['latin'],
  variable: '--font-crimson',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'EGH Research - Study & Publishing Tools',
    template: '%s | EGH Research'
  },
  description: 'Independent research platform for Ellen G. White writings. Advanced search tools, PDF generation, and publishing utilities for academic study and research. Not affiliated with official SDA or EGW Estate.',
  keywords: [
    'Ellen G. White',
    'EGW',
    'Seventh-day Adventist',
    'SDA',
    'Christian writings',
    'Bible study',
    'religious research',
    'Christian education',
    'prophecy',
    'Spirit of Prophecy',
    'Adventist literature',
    'theological research',
    'independent research',
    'publishing tools'
  ],
  authors: [{ name: 'Brian Onango', url: 'https://github.com/GospelSounders' }],
  creator: 'Brian Onango',
  publisher: 'Gospel Sounders',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://egwresearch.gospelsounders.org'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://egwresearch.gospelsounders.org',
    title: 'EGH Research - Study & Publishing Tools',
    description: 'Advanced research platform for Ellen G. White writings with search, PDF generation, and scholarly tools.',
    siteName: 'EGH Research',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'EGH Research Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EGH Research - Study & Publishing Tools',
    description: 'Advanced research platform for Ellen G. White writings with search, PDF generation, and scholarly tools.',
    images: ['/og-image.jpg'],
    creator: '@GospelSounders',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${crimsonText.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'EGH Research',
              description: 'Independent research platform for Ellen G. White writings',
              url: 'https://egwresearch.gospelsounders.org',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://egwresearch.gospelsounders.org/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Gospel Sounders',
                url: 'https://github.com/gospelsounders',
              },
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}