#!/usr/bin/env node

/**
 * Sample EGW Database Downloader
 * Downloads a representative sample of books from major languages
 * Faster alternative to downloading everything
 */

import 'dotenv/config';
import { createAuthManager, createApiClient, EGWDatabase } from '../packages/shared/dist/index.js';

async function downloadSampleBooks() {
  console.log('🚀 Starting sample EGW database download...\n');
  
  const authManager = createAuthManager();
  const apiClient = createApiClient(authManager);
  const db = new EGWDatabase();
  
  // Major languages to focus on
  const priorityLanguages = [
    'en',  // English
    'es',  // Spanish  
    'fr',  // French
    'pt',  // Portuguese
    'de',  // German
    'it',  // Italian
    'zh',  // Chinese
    'ru',  // Russian
    'ko',  // Korean
    'ja'   // Japanese
  ];
  
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
    
    // Step 2: Download books for priority languages
    for (const langCode of priorityLanguages) {
      const language = languages.find(l => l.code === langCode);
      if (!language) {
        console.log(`⚠️  Language ${langCode} not found, skipping...`);
        continue;
      }
      
      console.log(`\n📖 Processing priority language: ${language.name} (${language.code})`);
      
      try {
        // Get folders for this language
        const folders = await apiClient.getFolders(language.code);
        console.log(`  Found ${folders.length} folders`);
        
        // Include all major content sections
        const mainFolders = ['Books', 'Devotionals', 'Biography', 'Pioneer', 'Historical', 'Periodicals'];
        
        for (const folder of folders) {
          if (folder.children) {
            for (const subfolder of folder.children) {
              // Only process main content folders
              if (subfolder.nbooks > 0 && mainFolders.some(main => subfolder.name.includes(main))) {
                try {
                  console.log(`  📁 Processing folder: ${subfolder.name} (${subfolder.nbooks} books)`);
                  
                  const books = await apiClient.getBooksByFolder(subfolder.folder_id);
                  
                  // For sample, limit books per folder
                  const limitedBooks = books.slice(0, langCode === 'en' ? 50 : 20);
                  
                  for (const book of limitedBooks) {
                    try {
                      db.insertBook(book);
                      totalBooks++;
                      console.log(`    ✅ ${book.title} by ${book.author}`);
                    } catch (bookError) {
                      console.warn(`    ⚠️  Error inserting book ${book.book_id}: ${bookError.message}`);
                    }
                  }
                  
                  // Rate limiting
                  await new Promise(resolve => setTimeout(resolve, 1000));
                  
                } catch (folderError) {
                  console.warn(`  ❌ Error processing folder ${subfolder.folder_id}: ${folderError.message}`);
                }
              }
            }
          }
        }
        
        console.log(`  ✅ Completed ${language.name}: processed main folders`);
        
        // Rate limiting between languages
        await new Promise(resolve => setTimeout(resolve, 1500));
        
      } catch (langError) {
        console.error(`❌ Error processing language ${language.code}: ${langError.message}`);
        continue;
      }
    }
    
    console.log('\n🎉 Sample download complete!');
    
    // Final statistics
    const stats = db.getStats();
    console.log('\n📊 Final Database Statistics:');
    console.log(`  Languages: ${stats.languages}`);
    console.log(`  Books: ${stats.books}`);
    console.log(`  Downloaded Books: ${stats.downloadedBooks}`);
    console.log(`  Paragraphs: ${stats.paragraphs}`);
    console.log(`\n💾 Database location: ${process.cwd()}/data/egw-writings.db`);
    console.log('💡 Run download-all-books.js for the complete database!');
    
  } catch (error) {
    console.error('❌ Fatal error during download:', error);
    process.exit(1);
  } finally {
    db.close();
  }
}

downloadSampleBooks().catch(console.error);