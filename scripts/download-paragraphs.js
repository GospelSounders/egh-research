#!/usr/bin/env node

/**
 * Download actual paragraph content for books
 * This populates the database with the full text content
 */

import 'dotenv/config';
import { createAuthManager, createApiClient, EGWDatabase } from '../packages/shared/dist/index.js';

async function downloadParagraphs(bookIds = []) {
  console.log('🔄 Downloading paragraph content to database...\n');
  
  const authManager = createAuthManager();
  const apiClient = createApiClient(authManager);
  const db = new EGWDatabase();
  
  // Default popular books to download content for
  const defaultBooks = [
    127, // The Acts of the Apostles
    130, // The Desire of Ages
    134, // The Great Controversy
    138, // Steps to Christ
    137, // Patriarchs and Prophets
    132, // Education
    136, // Ministry of Healing
    140  // Christ's Object Lessons
  ];
  
  const booksToProcess = bookIds.length > 0 ? bookIds : defaultBooks;
  let totalParagraphs = 0;
  
  for (const bookId of booksToProcess) {
    console.log(`📖 Processing book ${bookId}...`);
    
    try {
      // Get book info
      const books = db.getBooks('en');
      const book = books.find(b => b.book_id === bookId);
      
      if (!book) {
        console.log(`  ⚠️  Book ${bookId} not found in database, skipping...`);
        continue;
      }
      
      console.log(`  📚 "${book.title}" by ${book.author}`);
      
      // Check if we already have paragraphs for this book
      const existingParagraphs = db.getParagraphs(bookId);
      if (existingParagraphs && existingParagraphs.length > 10) {
        console.log(`  ✅ Already have ${existingParagraphs.length} paragraphs, skipping...`);
        continue;
      }
      
      // Get table of contents first to understand structure
      console.log(`  🔄 Fetching table of contents...`);
      
      let allParagraphs = [];
      try {
        const toc = await apiClient.getBookToc(bookId);
        console.log(`  📚 Found ${toc.length} chapters`);
        
        // Get content for each chapter
        for (let i = 0; i < Math.min(toc.length, 5); i++) { // Limit to first 5 chapters for testing
          const chapter = toc[i];
          console.log(`  📄 Fetching Chapter ${chapter.order}: ${chapter.title}`);
          
          try {
            const chapterParagraphs = await apiClient.getChapter(bookId, chapter.id);
            if (chapterParagraphs && chapterParagraphs.length > 0) {
              allParagraphs = allParagraphs.concat(chapterParagraphs.map(p => ({
                ...p,
                chapter_title: chapter.title
              })));
              console.log(`    ✅ Retrieved ${chapterParagraphs.length} paragraphs`);
            }
            
            // Rate limiting
            await new Promise(resolve => setTimeout(resolve, 500));
          } catch (chapterError) {
            console.log(`    ⚠️  Could not fetch chapter ${chapter.id}: ${chapterError.message}`);
          }
        }
        
      } catch (tocError) {
        console.log(`  ⚠️  Could not fetch table of contents: ${tocError.message}`);
        console.log(`  🔄 Trying direct book content approach...`);
        
        // Fallback: try to get book content directly
        try {
          const bookContent = await apiClient.getBook(bookId);
          if (bookContent) {
            console.log(`  📖 Got book info, trying to extract content...`);
            // This might not have paragraphs, but we can try
          }
        } catch (bookError) {
          console.log(`  ❌ Could not fetch book content: ${bookError.message}`);
        }
      }
      
      if (allParagraphs.length === 0) {
        console.log(`  ⚠️  No paragraphs found for book ${bookId}`);
        continue;
      }
      
      // Insert paragraphs into database
      console.log(`  💾 Inserting ${allParagraphs.length} paragraphs into database...`);
      
      let insertedCount = 0;
      for (const para of allParagraphs) {
        try {
          db.insertParagraph({
            para_id: para.para_id || `${bookId}.${insertedCount}`,
            id_prev: para.id_prev,
            id_next: para.id_next,
            refcode_1: para.refcode_1 || '',
            refcode_2: para.refcode_2 || '',
            refcode_3: para.refcode_3 || '',
            refcode_4: para.refcode_4 || '',
            refcode_short: para.refcode_short || `${book.code || 'BK'} ${insertedCount}`,
            refcode_long: para.refcode_long || `${book.title}, p. ${insertedCount}`,
            element_type: para.element_type || 'p',
            element_subtype: para.element_subtype || '',
            content: para.content || '',
            puborder: para.puborder || insertedCount
          }, bookId, para.chapter_title);
          insertedCount++;
        } catch (insertError) {
          console.log(`    ⚠️  Error inserting paragraph: ${insertError.message}`);
          continue;
        }
      }
      
      console.log(`  ✅ Inserted ${insertedCount} paragraphs for "${book.title}"`);
      totalParagraphs += insertedCount;
      
      // Rate limiting between books
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`  ❌ Error processing book ${bookId}:`, error.message);
      continue;
    }
  }
  
  const finalStats = db.getStats();
  console.log(`\n🎉 Download completed!`);
  console.log(`📊 Total paragraphs in database: ${finalStats.paragraphs}`);
  console.log(`📚 Total books: ${finalStats.books}`);
  
  db.close();
}

// Get book IDs from command line arguments
const bookIds = process.argv.slice(2).map(id => parseInt(id)).filter(id => !isNaN(id));

downloadParagraphs(bookIds).catch(console.error);