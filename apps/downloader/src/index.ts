#!/usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import { createAuthManager, createApiClient, EGWDatabase } from '@gospelsounders/egw-writings-shared';

const program = new Command();

program
  .name('egw-downloader')
  .description('Download and index EGW Writings content')
  .version('1.0.0');

program
  .command('languages')
  .description('Download and index all available languages')
  .action(async () => {
    console.log('📚 Downloading languages...');
    
    const authManager = createAuthManager();
    const apiClient = createApiClient(authManager);
    const db = new EGWDatabase();
    
    try {
      const languages = await apiClient.getLanguages();
      console.log(`Found ${languages.length} languages`);
      
      for (const lang of languages) {
        db.insertLanguage(lang.code, lang.name, lang.direction);
        console.log(`✅ ${lang.name} (${lang.code})`);
      }
      
      console.log(`🎉 Successfully indexed ${languages.length} languages`);
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
  .option('--limit <number>', 'Limit number of books', '100')
  .action(async (options) => {
    console.log(`📖 Downloading books for language: ${options.lang}`);
    
    const authManager = createAuthManager();
    const apiClient = createApiClient(authManager);
    const db = new EGWDatabase();
    
    try {
      // Get folders for the language
      const folders = await apiClient.getFolders(options.lang);
      console.log(`Found ${folders.length} folders`);
      
      let totalBooks = 0;
      
      // Process all folders and their children
      for (const folder of folders) {
        if (folder.children) {
          for (const subfolder of folder.children) {
            if (subfolder.nbooks > 0) {
              console.log(`📁 Processing folder: ${subfolder.name} (${subfolder.nbooks} books)`);
              
              const books = await apiClient.getBooksByFolder(subfolder.folder_id);
              const limit = parseInt(options.limit);
              const booksToProcess = books.slice(0, limit);
              
              for (const book of booksToProcess) {
                db.insertBook(book);
                totalBooks++;
                console.log(`  ✅ ${book.title} by ${book.author}`);
              }
            }
          }
        }
      }
      
      console.log(`🎉 Successfully indexed ${totalBooks} books`);
    } catch (error) {
      console.error('❌ Error downloading books:', error);
      process.exit(1);
    } finally {
      db.close();
    }
  });

program
  .command('content')
  .description('Download full content for books')
  .option('-l, --lang <language>', 'Language code', 'en')
  .option('-b, --book <bookId>', 'Specific book ID to download')
  .option('--limit <number>', 'Limit number of books', '10')
  .action(async (options) => {
    console.log('📄 Downloading book content...');
    
    const authManager = createAuthManager();
    const apiClient = createApiClient(authManager);
    const db = new EGWDatabase();
    
    try {
      let books;
      
      if (options.book) {
        // Download specific book
        const book = db.getBook(parseInt(options.book));
        if (!book) {
          throw new Error(`Book ${options.book} not found in database`);
        }
        books = [book as any];
      } else {
        // Download books for language
        books = (db.getBooks(options.lang) as any[]).slice(0, parseInt(options.limit));
      }
      
      console.log(`Processing ${books.length} books...`);
      
      for (const book of books) {
        const typedBook = book as any;
        console.log(`\n📖 Downloading content for: ${typedBook.title}`);
        
        try {
          // Get table of contents
          const toc = await apiClient.getBookToc(typedBook.book_id);
          console.log(`  Found ${toc.length} chapters`);
          
          let totalParagraphs = 0;
          
          // Download each chapter
          for (const chapter of toc) {
            try {
              const paragraphs = await apiClient.getChapter(typedBook.book_id, chapter.id);
              console.log(`    📄 Chapter "${chapter.title}": ${paragraphs.length} paragraphs`);
              
              // Insert paragraphs
              for (const paragraph of paragraphs) {
                db.insertParagraph(paragraph, typedBook.book_id, chapter.title);
                totalParagraphs++;
              }
              
              // Rate limiting
              await new Promise(resolve => setTimeout(resolve, 1000));
            } catch (chapterError) {
              console.error(`    ❌ Error downloading chapter ${chapter.id}:`, chapterError);
            }
          }
          
          console.log(`  ✅ Downloaded ${totalParagraphs} paragraphs`);
        } catch (bookError) {
          console.error(`❌ Error downloading book ${typedBook.book_id}:`, bookError);
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
  .command('quick-start')
  .description('Quick setup: download languages, sample books, and content')
  .action(async () => {
    console.log('🚀 Quick Start: Setting up EGW Writings database...\n');
    
    const authManager = createAuthManager();
    const apiClient = createApiClient(authManager);
    const db = new EGWDatabase();
    
    try {
      // Step 1: Languages
      console.log('1️⃣ Downloading languages...');
      const languages = await apiClient.getLanguages();
      for (const lang of languages) {
        db.insertLanguage(lang.code, lang.name, lang.direction);
      }
      console.log(`✅ ${languages.length} languages indexed\n`);
      
      // Step 2: Books (English only, first 20)
      console.log('2️⃣ Downloading sample books (English)...');
      const folders = await apiClient.getFolders('en');
      const booksFolder = folders.find(f => f.children?.find(c => c.name === 'Books'))?.children?.find(c => c.name === 'Books');
      
      if (booksFolder) {
        const books = await apiClient.getBooksByFolder(booksFolder.folder_id);
        const sampleBooks = books.slice(0, 20);
        
        for (const book of sampleBooks) {
          db.insertBook(book);
        }
        console.log(`✅ ${sampleBooks.length} books indexed\n`);
        
        // Step 3: Content (first 3 books only)
        console.log('3️⃣ Downloading sample content...');
        const contentBooks = sampleBooks.slice(0, 3);
        
        for (const book of contentBooks) {
          console.log(`  📖 ${book.title}...`);
          
          try {
            const toc = await apiClient.getBookToc(book.book_id);
            const firstChapter = toc[0];
            
            if (firstChapter) {
              const paragraphs = await apiClient.getChapter(book.book_id, firstChapter.id);
              
              for (const paragraph of paragraphs) {
                db.insertParagraph(paragraph, book.book_id, firstChapter.title);
              }
              
              console.log(`    ✅ ${paragraphs.length} paragraphs from first chapter`);
            }
            
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            console.log(`    ❌ Error: ${error}`);
          }
        }
      }
      
      console.log('\n🎉 Quick start complete!');
      
      const stats = db.getStats();
      console.log('\n📊 Final Statistics:');
      console.log(`  Languages: ${stats.languages}`);
      console.log(`  Books: ${stats.books}`);
      console.log(`  Paragraphs: ${stats.paragraphs}`);
      console.log('\n💡 Try: pnpm --filter local-server dev');
      
    } catch (error) {
      console.error('❌ Quick start failed:', error);
      process.exit(1);
    } finally {
      db.close();
    }
  });

program.parse();