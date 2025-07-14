#!/usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import { EGWDatabase, EGWApiClientNew as EGWApiClient, ContentDownloader, createAuthManager } from '@surgbc/egw-writings-shared';
import { readdirSync, existsSync } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

const program = new Command();

program
  .name('egw-downloader')
  .description('📚 EGW Writings Downloader - Download and index Ellen G. White writings for educational and research use')
  .version('1.0.0')
  .addHelpText('afterAll', `
🌟 Examples:
  egw-downloader quick-start --zip           Quick setup with ZIP method
  egw-downloader download:zips --limit 10    Download 10 book ZIPs
  egw-downloader parse:zips                  Parse all downloaded ZIPs
  egw-downloader stats                       Show database statistics

📖 Documentation: https://github.com/gospelsounders/egw-writings-mcp#readme
🐛 Issues: https://github.com/gospelsounders/egw-writings-mcp/issues`);

program
  .command('languages')
  .description('Download and index all available languages')
  .action(async () => {
    console.log('📚 Downloading languages...');
    
    const authManager = createAuthManager();
    const apiClient = new EGWApiClient({ authManager });
    const db = new EGWDatabase();
    const downloader = new ContentDownloader(apiClient, db);
    
    try {
      await downloader.downloadLanguages((progress) => {
        console.log(`Progress: ${progress.completed}/${progress.total} - ${progress.currentItem}`);
      });
      
      console.log('🎉 Successfully downloaded and indexed all languages');
    } catch (error) {
      console.error('❌ Error downloading languages:', error);
      process.exit(1);
    } finally {
      db.close();
    }
  });

program
  .command('books')
  .description('Download book metadata for a language')
  .option('-l, --lang <language>', 'Language code', 'en')
  .action(async (options) => {
    console.log(`📖 Downloading books for language: ${options.lang}`);
    
    const authManager = createAuthManager();
    const apiClient = new EGWApiClient({ authManager });
    const db = new EGWDatabase();
    const downloader = new ContentDownloader(apiClient, db);
    
    try {
      // Download folders first
      await downloader.downloadFolders(options.lang, (progress) => {
        console.log(`Folders: ${progress.completed}/${progress.total} - ${progress.currentItem}`);
      });
      
      // Download books for the language
      await downloader.downloadBooks({
        languageCode: options.lang,
        onProgress: (progress) => {
          console.log(`Books: ${progress.completed}/${progress.total} - ${progress.currentItem}`);
        }
      });
      
      console.log('🎉 Successfully downloaded books and folders');
    } catch (error) {
      console.error('❌ Error downloading books:', error);
      process.exit(1);
    } finally {
      db.close();
    }
  });

program
  .command('content')
  .description('📄 Download full content for books (supports both API and ZIP methods)')
  .option('-l, --lang <language>', 'Language code', 'en')
  .option('-b, --book <bookId>', 'Specific book ID to download')
  .option('--limit <number>', 'Limit number of books', '10')
  .option('--zip', 'Use ZIP download method instead of API method')
  .action(async (options) => {
    console.log('📄 Downloading book content...');
    
    const authManager = createAuthManager();
    const apiClient = new EGWApiClient({ authManager });
    const db = new EGWDatabase();
    const downloader = new ContentDownloader(apiClient, db);
    
    try {
      if (options.book) {
        // Download specific book content
        const bookId = parseInt(options.book);
        console.log(`Downloading content for book ID: ${bookId} (${options.zip ? 'ZIP method' : 'API method'})`);
        
        await downloader.downloadBookContent(bookId, options.zip || false, (progress) => {
          console.log(`Content: ${progress.completed}/${progress.total} - ${progress.currentItem}`);
        });
      } else {
        // Download content for sample books
        const books = db.getBooks(options.lang) as any[];
        const limit = parseInt(options.limit);
        const sampleBooks = books.slice(0, Math.min(limit, books.length));
        
        console.log(`Downloading content for ${sampleBooks.length} books...`);
        
        for (let i = 0; i < sampleBooks.length; i++) {
          const book = sampleBooks[i];
          console.log(`\n[${i + 1}/${sampleBooks.length}] ${book.title}`);
          
          try {
            await downloader.downloadBookContent(book.book_id, options.zip || false, (progress) => {
              console.log(`  Content: ${progress.completed}/${progress.total} - ${progress.currentItem}`);
            });
          } catch (error) {
            console.error(`  ❌ Failed to download content for ${book.title}:`, error);
          }
        }
      }
      
      console.log('🎉 Content download complete!');
    } catch (error) {
      console.error('❌ Error downloading content:', error);
      process.exit(1);
    } finally {
      db.close();
    }
  });

program
  .command('stats')
  .description('Show database statistics')
  .action(async () => {
    const db = new EGWDatabase();
    
    try {
      const stats = db.getStats();
      
      console.log('📊 Database Statistics:');
      console.log(`  Languages: ${stats.languages}`);
      console.log(`  Books: ${stats.books}`);
      console.log(`  Downloaded Books: ${stats.downloadedBooks}`);
      console.log(`  Paragraphs: ${stats.paragraphs}`);
      
      // Show category breakdown
      const categories = db.getBooksByCategories();
      if (categories.length > 0) {
        console.log('\n📚 Books by Category:');
        categories.forEach((cat: any) => {
          console.log(`  ${cat.category}/${cat.subcategory}: ${cat.count} books`);
        });
      }
      
      const progress = db.getDownloadProgress();
      if (progress.length > 0) {
        console.log('\n📈 Recent Download Progress:');
        progress.slice(0, 5).forEach((p: any) => {
          console.log(`  ${p.task_type}: ${p.completed_items}/${p.total_items || '?'} (${p.status})`);
        });
      }
    } catch (error) {
      console.error('❌ Error getting stats:', error);
      process.exit(1);
    } finally {
      db.close();
    }
  });

program
  .command('categorize')
  .description('Update existing books with category information')
  .action(async () => {
    console.log('🏷️ Updating book categories...');
    
    const db = new EGWDatabase();
    
    try {
      const updated = db.updateBookCategories();
      console.log(`✅ Updated ${updated} books with category information`);
      
      // Show updated breakdown
      const categories = db.getBooksByCategories();
      console.log('\n📚 Updated Books by Category:');
      categories.forEach((cat: any) => {
        console.log(`  ${cat.category}/${cat.subcategory}: ${cat.count} books`);
      });
    } catch (error) {
      console.error('❌ Error updating categories:', error);
      process.exit(1);
    } finally {
      db.close();
    }
  });

program
  .command('quick-start')
  .description('🚀 Quick setup: download languages, sample books, and content - Perfect for getting started')
  .option('--zip', 'Use ZIP download method for content')
  .action(async (options) => {
    console.log('🚀 Quick Start: Setting up EGW Writings database...\n');
    
    const authManager = createAuthManager();
    const apiClient = new EGWApiClient({ authManager });
    const db = new EGWDatabase();
    const downloader = new ContentDownloader(apiClient, db);
    
    try {
      // Use the comprehensive download method with sample content
      await downloader.downloadAll('en', {
        includeContent: true,
        maxBooks: 5,
        useZip: options.zip || false,
        onProgress: (progress) => {
          console.log(`${progress.taskType}: ${progress.completed}/${progress.total} - ${progress.currentItem || ''}`);
        }
      });
      
      console.log('\n🎉 Quick start complete!');
      
      const stats = db.getStats();
      console.log('\n📊 Final Statistics:');
      console.log(`  Languages: ${stats.languages}`);
      console.log(`  Books: ${stats.books}`);
      console.log(`  Downloaded Books: ${stats.downloadedBooks}`);
      console.log(`  Paragraphs: ${stats.paragraphs}`);
      
      // Show category breakdown
      const categories = db.getBooksByCategories();
      if (categories.length > 0) {
        console.log('\n📚 Books by Category:');
        categories.forEach((cat: any) => {
          console.log(`  ${cat.category}/${cat.subcategory}: ${cat.count} books`);
        });
      }
      
      console.log('\n💡 Try: pnpm --filter website dev');
      
    } catch (error) {
      console.error('❌ Quick start failed:', error);
      process.exit(1);
    } finally {
      db.close();
    }
  });

program
  .command('download:zips')
  .description('📦 Download ZIP files only (fast, no extraction/parsing) - Recommended for bulk downloads')
  .option('-l, --lang <language>', 'Language code', 'en')
  .option('-b, --book <bookId>', 'Specific book ID to download')
  .option('--limit <number>', 'Limit number of books (default: all books)')
  .option('--concurrency <number>', 'Number of parallel downloads', '5')
  .action(async (options) => {
    console.log('📦 Downloading ZIP files only...');
    
    const authManager = createAuthManager();
    const apiClient = new EGWApiClient({ authManager });
    const db = new EGWDatabase();
    const downloader = new ContentDownloader(apiClient, db);
    const overallStartTime = Date.now();
    
    try {
      if (options.book) {
        // Download specific book ZIP
        const bookId = parseInt(options.book);
        console.log(`Downloading ZIP for book ID: ${bookId}`);
        
        await downloader.downloadBookZipOnly(bookId, (progress) => {
          console.log(`ZIP: ${progress.completed}/${progress.total} - ${progress.currentItem}`);
        });
      } else {
        // Download ZIPs for books - fetch directly from API
        try {
          
          // Get ALL books from API (handle pagination)
          console.log(`📚 Fetching ALL books from API for language: ${options.lang}`);
          let allBooks: any[] = [];
          let currentPage = 1;
          let hasMore = true;
          
          // Track duplicates
          const bookIds = new Set<number>();
          const duplicates: any[] = [];
          let apiReportedCount: number | null = null;
          
          while (hasMore) {
            console.log(`  📄 Fetching page ${currentPage}...`);
            const booksResponse = await apiClient.getBooks({ 
              lang: options.lang,
              limit: 100,  // Get max per page
              page: currentPage
            });
            
            // SHOW RAW API RESPONSE (first page only)
            if (currentPage === 1) {
              console.log('\n=== RAW API RESPONSE (FIRST PAGE) ===');
              console.log(JSON.stringify(booksResponse, null, 2));
              console.log('=== END RAW RESPONSE ===\n');
              apiReportedCount = (booksResponse as any)?.count || null;
            }
            
            // Handle response structure - API returns paginated response with 'results' array
            const pageBooks = Array.isArray(booksResponse) ? booksResponse : (booksResponse as any)?.results || [];
            
            // Check for duplicates before adding to allBooks
            pageBooks.forEach((book: any) => {
              if (bookIds.has(book.book_id)) {
                duplicates.push({
                  page: currentPage,
                  book_id: book.book_id,
                  title: book.title
                });
              } else {
                bookIds.add(book.book_id);
                allBooks.push(book);
              }
            });
            
            // Check if there are more pages
            const hasNext = (booksResponse as any)?.next;
            const totalCount = (booksResponse as any)?.count;
            hasMore = hasNext && pageBooks.length > 0;
            currentPage++;
            
            // Show progress if we know total count
            if (totalCount) {
              console.log(`    📊 Progress: ${allBooks.length}/${totalCount} books fetched (${duplicates.length} duplicates)`);
            } else {
              console.log(`    📊 Progress: ${allBooks.length} unique books fetched (${duplicates.length} duplicates)`);
            }
            
            // Safety limit to prevent infinite loops (removed to find true total)
            if (currentPage > 100) {
              console.log(`⚠️  Reached page limit (100), stopping fetch for safety`);
              break;
            }
          }
          
          console.log(`\n📋 PAGINATION SUMMARY:`);
          console.log(`  API reported count: ${apiReportedCount || 'unknown'}`);
          console.log(`  Pages fetched: ${currentPage - 1}`);
          console.log(`  Total raw entries: ${allBooks.length + duplicates.length}`);
          console.log(`  Unique books found: ${allBooks.length}`);
          console.log(`  Duplicates detected: ${duplicates.length}`);
          
          if (duplicates.length > 0) {
            console.log(`\n🔍 DUPLICATE ANALYSIS (first 10):`);
            duplicates.slice(0, 10).forEach((dup: any) => {
              console.log(`    Page ${dup.page}: Book ${dup.book_id} - ${dup.title}`);
            });
          }
          
          if (allBooks.length === 0) {
            console.log('⚠️  No books found. This might be an API issue or authentication problem.');
            process.exit(1);
          }
          
          // If no limit specified, download all books
          const limit = options.limit ? parseInt(options.limit) : allBooks.length;
          const selectedBooks = allBooks.slice(0, Math.min(limit, allBooks.length));
          
          if (!options.limit) {
            console.log(`📚 No limit specified - downloading ALL ${selectedBooks.length} books!`);
          }
          
          console.log(`Downloading ZIPs for ${selectedBooks.length} books...`);
          
          // Parallel download with concurrency control
          const concurrency = parseInt(options.concurrency) || 5; // Download books simultaneously
          const downloadStartTime = Date.now();
          let completedDownloads = 0;
          let failedDownloads = 0;
          
          console.log(`🚀 Starting parallel downloads (${concurrency} concurrent)...`);
          
          const downloadBook = async (book: any, index: number) => {
            try {
              console.log(`\n[${index + 1}/${selectedBooks.length}] Starting ${book.title}`);
              
              await downloader.downloadBookZipOnly(book.book_id, (progress) => {
                // Simplified progress for parallel downloads
                if (progress.completed === progress.total) {
                  console.log(`  ✅ [${index + 1}/${selectedBooks.length}] Completed ${book.title}`);
                }
              });
              
              completedDownloads++;
            } catch (error) {
              console.error(`  ❌ [${index + 1}/${selectedBooks.length}] Failed ${book.title}:`, error);
              failedDownloads++;
            }
          };
          
          // Process books in batches of 'concurrency' size
          for (let i = 0; i < selectedBooks.length; i += concurrency) {
            const batch = selectedBooks.slice(i, i + concurrency);
            const promises = batch.map((book, batchIndex) => 
              downloadBook(book, i + batchIndex)
            );
            
            await Promise.all(promises);
            
            const elapsed = (Date.now() - downloadStartTime) / 1000;
            const completed = Math.min(i + concurrency, selectedBooks.length);
            const rate = completed / elapsed;
            const remaining = selectedBooks.length - completed;
            const eta = remaining > 0 ? remaining / rate : 0;
            
            console.log(`\n📊 Progress: ${completed}/${selectedBooks.length} completed in ${elapsed.toFixed(1)}s (${rate.toFixed(1)}/s, ETA: ${eta.toFixed(0)}s)`);
          }
          
          console.log(`\n📈 Download Summary: ${completedDownloads} successful, ${failedDownloads} failed`);
        } catch (error) {
          console.error('❌ Failed to fetch books from API:', error);
          console.log('💡 Try running "egw-books" command first to ensure authentication is working.');
          process.exit(1);
        }
      }
      
      console.log('🎉 ZIP download complete!');
      
      // Report ZIP directory statistics with timing
      try {
        const endTime = Date.now();
        const totalTime = (endTime - overallStartTime) / 1000; // Convert to seconds
        const zipCount = execSync('find data/zips -name "*.zip" | wc -l', { encoding: 'utf-8' }).trim();
        const zipSize = execSync('du -sh data/zips', { encoding: 'utf-8' }).split('\t')[0];
        
        console.log('\n📊 ZIP DIRECTORY STATS:');
        console.log(`  📁 ZIP files: ${zipCount}`);
        console.log(`  💾 Total size: ${zipSize}`);
        console.log(`  ⏱️  Download time: ${totalTime.toFixed(1)}s`);
        if (parseInt(zipCount) > 0) {
          console.log(`  📈 Average: ${(totalTime / parseInt(zipCount)).toFixed(2)}s per ZIP`);
        }
        console.log(`  📂 Location: data/zips/`);
      } catch (error) {
        console.error('📊 ZIP stats error:', error);
        console.log('📊 ZIP stats unavailable');
      }
    } catch (error) {
      console.error('❌ Error downloading ZIPs:', error);
      process.exit(1);
    } finally {
      db.close();
    }
  });

program
  .command('parse:zips')
  .description('🔍 Parse downloaded ZIP files into database (can be done offline)')
  .option('--zip-dir <directory>', 'Directory containing ZIP files', './data/zips')
  .option('-b, --book <bookId>', 'Specific book ID to parse')
  .action(async (options) => {
    console.log('🔍 Parsing existing ZIP files...');
    
    const authManager = createAuthManager();
    const apiClient = new EGWApiClient({ authManager });
    const db = new EGWDatabase();
    const downloader = new ContentDownloader(apiClient, db);
    
    try {
      const zipDir = path.resolve(options.zipDir);
      
      if (!existsSync(zipDir)) {
        console.error(`❌ ZIP directory does not exist: ${zipDir}`);
        process.exit(1);
      }
      
      // Helper function to recursively find ZIP files
      const findZipFiles = (dir: string): string[] => {
        const files: string[] = [];
        const items = readdirSync(dir, { withFileTypes: true });
        
        for (const item of items) {
          const fullPath = path.join(dir, item.name);
          if (item.isDirectory()) {
            files.push(...findZipFiles(fullPath));
          } else if (item.isFile() && item.name.endsWith('.zip')) {
            files.push(fullPath);
          }
        }
        
        return files;
      };

      if (options.book) {
        // Parse specific book ZIP - search recursively
        const bookId = parseInt(options.book);
        const allZipFiles = findZipFiles(zipDir);
        const zipFiles = allZipFiles.filter(file => 
          file.includes(`_${bookId}.zip`)
        );
        
        if (zipFiles.length === 0) {
          console.error(`❌ No ZIP file found for book ID: ${bookId}`);
          console.log(`Searched in: ${zipDir}`);
          process.exit(1);
        }
        
        const zipPath = zipFiles[0];
        console.log(`Parsing ZIP: ${zipPath}`);
        
        await downloader.parseExistingZip(zipPath, (progress) => {
          console.log(`Parse: ${progress.completed}/${progress.total} - ${progress.currentItem}`);
        });
      } else {
        // Parse all ZIP files - search recursively in category folders
        const allZipFiles = findZipFiles(zipDir);
        
        if (allZipFiles.length === 0) {
          console.log('⚠️  No ZIP files found in directory:', zipDir);
          console.log('💡 Tip: ZIPs are now organized in category/subcategory folders');
          process.exit(1);
        }
        
        console.log(`Found ${allZipFiles.length} ZIP files to parse...`);
        
        for (let i = 0; i < allZipFiles.length; i++) {
          const zipPath = allZipFiles[i];
          const zipFile = path.basename(zipPath);
          const relativePath = path.relative(zipDir, zipPath);
          
          console.log(`\n[${i + 1}/${allZipFiles.length}] Parsing ${relativePath}`);
          
          try {
            await downloader.parseExistingZip(zipPath, (progress) => {
              console.log(`  Parse: ${progress.completed}/${progress.total} - ${progress.currentItem}`);
            });
          } catch (error) {
            console.error(`  ❌ Failed to parse ${zipFile}:`, error);
          }
        }
      }
      
      console.log('\n🎉 ZIP parsing complete!');
      
      const stats = db.getStats();
      console.log('\n📊 Final Statistics:');
      console.log(`  Languages: ${stats.languages}`);
      console.log(`  Books: ${stats.books}`);
      console.log(`  Downloaded Books: ${stats.downloadedBooks}`);
      console.log(`  Paragraphs: ${stats.paragraphs}`);
      
    } catch (error) {
      console.error('❌ Error parsing ZIPs:', error);
      process.exit(1);
    } finally {
      db.close();
    }
  });

program
  .command('download:all')
  .description('Download everything: languages, books, and content')
  .option('-l, --lang <language>', 'Language code', 'en')
  .option('--content', 'Include full content download')
  .option('--limit <number>', 'Limit number of books for content', '20')
  .option('--zip', 'Use ZIP download method for content')
  .action(async (options) => {
    console.log('🚀 Starting comprehensive download...\n');
    
    const authManager = createAuthManager();
    const apiClient = new EGWApiClient({ authManager });
    const db = new EGWDatabase();
    const downloader = new ContentDownloader(apiClient, db);
    
    try {
      await downloader.downloadAll(options.lang, {
        includeContent: options.content,
        maxBooks: parseInt(options.limit),
        useZip: options.zip || false,
        onProgress: (progress) => {
          console.log(`${progress.taskType}: ${progress.completed}/${progress.total} - ${progress.currentItem || ''}`);
        }
      });
      
      console.log('\n🎉 Comprehensive download complete!');
      
      const stats = db.getStats();
      console.log('\n📊 Final Statistics:');
      console.log(`  Languages: ${stats.languages}`);
      console.log(`  Books: ${stats.books}`);
      console.log(`  Downloaded Books: ${stats.downloadedBooks}`);
      console.log(`  Paragraphs: ${stats.paragraphs}`);
      
      // Show category breakdown
      const categories = db.getBooksByCategories();
      if (categories.length > 0) {
        console.log('\n📚 Books by Category:');
        categories.forEach((cat: any) => {
          console.log(`  ${cat.category}/${cat.subcategory}: ${cat.count} books`);
        });
      }
      
    } catch (error) {
      console.error('❌ Comprehensive download failed:', error);
      process.exit(1);
    } finally {
      db.close();
    }
  });

program.parse();