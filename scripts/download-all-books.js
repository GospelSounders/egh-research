#!/usr/bin/env node

/**
 * Complete EGW Database Downloader
 * Downloads all books in all languages from the EGW API
 */

import 'dotenv/config';
import { createAuthManager, createApiClient, EGWDatabase } from '../packages/shared/dist/index.js';

async function downloadAllBooks() {
  console.log('🚀 Starting complete EGW database download...\n');
  
  const authManager = createAuthManager();
  const apiClient = createApiClient(authManager);
  const db = new EGWDatabase();
  
  let totalBooks = 0;
  let totalLanguages = 0;
  
  try {
    // Step 1: Download all languages
    console.log('1️⃣ Downloading all languages...');
    const languages = await apiClient.getLanguages();
    console.log(`Found ${languages.length} languages`);
    
    for (const lang of languages) {
      db.insertLanguage(lang.code, lang.name, lang.direction);
      totalLanguages++;
    }
    console.log(`✅ ${totalLanguages} languages indexed\n`);
    
    // Step 2: Download books for each language
    for (const language of languages) {
      console.log(`\n📖 Processing language: ${language.name} (${language.code})`);
      
      try {
        // Get folders for this language
        const folders = await apiClient.getFolders(language.code);
        console.log(`  Found ${folders.length} folders`);
        
        // Process all folders and their children
        for (const folder of folders) {
          if (folder.children) {
            for (const subfolder of folder.children) {
              if (subfolder.nbooks > 0) {
                try {
                  console.log(`  📁 Processing folder: ${subfolder.name} (${subfolder.nbooks} books)`);
                  
                  const books = await apiClient.getBooksByFolder(subfolder.folder_id);
                  
                  for (const book of books) {
                    try {
                      db.insertBook(book);
                      totalBooks++;
                      console.log(`    ✅ ${book.title} by ${book.author}`);
                    } catch (bookError) {
                      console.warn(`    ⚠️  Error inserting book ${book.book_id}: ${bookError.message}`);
                    }
                  }
                  
                  // Rate limiting - be respectful to the API
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  
                } catch (folderError) {
                  console.warn(`  ❌ Error processing folder ${subfolder.folder_id}: ${folderError.message}`);
                }
              }
            }
          }
        }
        
        console.log(`  ✅ Completed ${language.name}: processed all folders`);
        
        // Rate limiting between languages
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (langError) {
        console.error(`❌ Error processing language ${language.code}: ${langError.message}`);
        continue; // Skip this language and continue with others
      }
    }
    
    console.log('\n🎉 Download complete!');
    
    // Final statistics
    const stats = db.getStats();
    console.log('\n📊 Final Database Statistics:');
    console.log(`  Languages: ${stats.languages}`);
    console.log(`  Books: ${stats.books}`);
    console.log(`  Downloaded Books: ${stats.downloadedBooks}`);
    console.log(`  Paragraphs: ${stats.paragraphs}`);
    console.log(`\n💾 Database location: ${process.cwd()}/data/egw-writings.db`);
    console.log('💡 You can now use the local API server or website with the complete database!');
    
  } catch (error) {
    console.error('❌ Fatal error during download:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

// Add signal handlers for graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⚠️  Received SIGINT, shutting down gracefully...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n⚠️  Received SIGTERM, shutting down gracefully...');
  process.exit(0);
});

// Run the download
downloadAllBooks().catch(console.error);