#!/usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import { EGWDatabase, EGWApiClientNew as EGWApiClient, ContentDownloader } from '@surgbc/egw-writings-shared';

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
    
    const apiClient = new EGWApiClient();
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
    
    const apiClient = new EGWApiClient();
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
  .description('Download full content for books')
  .option('-l, --lang <language>', 'Language code', 'en')
  .option('-b, --book <bookId>', 'Specific book ID to download')
  .option('--limit <number>', 'Limit number of books', '10')
  .action(async (options) => {
    console.log('📄 Downloading book content...');
    
    const apiClient = new EGWApiClient();
    const db = new EGWDatabase();
    const downloader = new ContentDownloader(apiClient, db);
    
    try {
      if (options.book) {
        // Download specific book content
        const bookId = parseInt(options.book);
        console.log(`Downloading content for book ID: ${bookId}`);
        
        await downloader.downloadBookContent(bookId, (progress) => {
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
            await downloader.downloadBookContent(book.book_id, (progress) => {
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
  .description('Quick setup: download languages, sample books, and content')
  .action(async () => {
    console.log('🚀 Quick Start: Setting up EGW Writings database...\n');
    
    const apiClient = new EGWApiClient();
    const db = new EGWDatabase();
    const downloader = new ContentDownloader(apiClient, db);
    
    try {
      // Use the comprehensive download method with sample content
      await downloader.downloadAll('en', {
        includeContent: true,
        maxBooks: 5,
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
  .command('download:all')
  .description('Download everything: languages, books, and content')
  .option('-l, --lang <language>', 'Language code', 'en')
  .option('--content', 'Include full content download')
  .option('--limit <number>', 'Limit number of books for content', '20')
  .action(async (options) => {
    console.log('🚀 Starting comprehensive download...\n');
    
    const apiClient = new EGWApiClient();
    const db = new EGWDatabase();
    const downloader = new ContentDownloader(apiClient, db);
    
    try {
      await downloader.downloadAll(options.lang, {
        includeContent: options.content,
        maxBooks: parseInt(options.limit),
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