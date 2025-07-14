import type { Metadata } from 'next';
import { Inter, Crimson_Text } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { CacheStats } from '@/components/debug/cache-stats';
import { ReadingProvider } from '@/contexts/reading-context';
import { ReadingDialog } from '@/components/reading/reading-dialog';
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
  metadataBase: new URL('https://gospelsounders.github.io/egh-research'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://gospelsounders.github.io/egh-research',
    title: 'EGH Research - Study & Publishing Tools',
    description: 'Advanced research platform for Ellen G. White writings with search, PDF generation, and scholarly tools.',
    siteName: 'EGH Research',
    images: [
      {
        url: '/egh-research/og-image.png',
        width: 1200,
        height: 630,
        alt: 'EGH Research Platform - Advanced tools for studying Ellen G. White writings',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'EGH Research - Study & Publishing Tools',
    description: 'Advanced research platform for Ellen G. White writings with search, PDF generation, and scholarly tools.',
    images: ['/egh-research/og-image.png'],
    creator: '@GospelSounders',
    site: '@GospelSounders',
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
  manifest: '/egh-research/site.webmanifest',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${crimsonText.variable}`}>
      <head>
        {/* Favicons and Icons */}
        <link rel="icon" type="image/svg+xml" href="/egh-research/icon.svg" />
        <link rel="icon" href="/egh-research/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/egh-research/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/egh-research/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/egh-research/favicon-16x16.png" />
        <link rel="manifest" href="/egh-research/site.webmanifest" />
        
        {/* Theme and App Configuration */}
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="msapplication-TileColor" content="#0ea5e9" />
        <meta name="msapplication-config" content="/egh-research/browserconfig.xml" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebSite',
              name: 'EGH Research - Study & Publishing Tools',
              alternateName: 'EGH Research',
              description: 'Independent research platform for Ellen G. White writings with advanced search, PDF generation, and scholarly tools.',
              url: 'https://gospelsounders.github.io/egh-research',
              potentialAction: {
                '@type': 'SearchAction',
                target: 'https://gospelsounders.github.io/egh-research/search?q={search_term_string}',
                'query-input': 'required name=search_term_string',
              },
              publisher: {
                '@type': 'Organization',
                name: 'Gospel Sounders',
                url: 'https://github.com/gospelsounders',
                logo: {
                  '@type': 'ImageObject',
                  url: 'https://gospelsounders.github.io/egh-research/icon.svg'
                }
              },
              mainEntity: {
                '@type': 'WebApplication',
                name: 'EGH Research Platform',
                applicationCategory: 'EducationApplication',
                operatingSystem: 'Web Browser',
                description: 'Advanced research tools for studying Ellen G. White writings including Boolean search, multi-book reading, and citation generation.',
                offers: {
                  '@type': 'Offer',
                  price: '0',
                  priceCurrency: 'USD'
                }
              }
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-gray-50">
        <Providers>
          <ReadingProvider>
            <div className="flex flex-col min-h-screen">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <ReadingDialog />
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
            <CacheStats />
          </ReadingProvider>
        </Providers>
      </body>
    </html>
  );
}