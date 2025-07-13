#!/usr/bin/env node

/**
 * Download actual book content (paragraphs) from EGW API
 * This script downloads the full text content for specific books
 */

import 'dotenv/config';
import { createAuthManager, createApiClient } from '../packages/shared/dist/index.js';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import path from 'path';

async function downloadBookContent(bookIds = []) {
  console.log('🔄 Downloading book content from EGW API...\n');
  
  const authManager = createAuthManager();
  const apiClient = createApiClient(authManager);
  
  // Default books to download (popular EGW books)
  const defaultBooks = [
    127, // The Acts of the Apostles
    128, // The Adventist Home  
    130, // The Desire of Ages
    131, // Early Writings
    132, // Education
    133, // Evangelism
    134, // The Great Controversy
    135, // Gospel Workers
    136, // Ministry of Healing
    137, // Patriarchs and Prophets
    138, // Steps to Christ
    139, // Testimonies for the Church
    140  // Christ's Object Lessons
  ];
  
  const booksToProcess = bookIds.length > 0 ? bookIds : defaultBooks;
  
  // Ensure content directory exists
  const contentDir = path.join(process.cwd(), 'data', 'content');
  if (!existsSync(contentDir)) {
    mkdirSync(contentDir, { recursive: true });
  }
  
  for (const bookId of booksToProcess) {
    console.log(`📖 Processing book ${bookId}...`);
    
    try {
      // Check if book exists in our database first
      const bookInfoPath = path.join(process.cwd(), 'data', 'books-export.json');
      const exportData = JSON.parse(require('fs').readFileSync(bookInfoPath, 'utf8'));
      const book = exportData.books.find(b => b.book_id === bookId);
      
      if (!book) {
        console.log(`  ⚠️  Book ${bookId} not found in local database, skipping...`);
        continue;
      }
      
      console.log(`  📚 "${book.title}" by ${book.author}`);
      
      // Get book content from API
      console.log(`  🔄 Fetching content from EGW API...`);
      const contentResponse = await apiClient.getBookContent(bookId, { limit: 10000 });
      
      if (!contentResponse.success || !contentResponse.data) {
        console.log(`  ❌ Failed to fetch content: ${contentResponse.error}`);
        continue;
      }
      
      const paragraphs = contentResponse.data;
      console.log(`  ✅ Retrieved ${paragraphs.length} paragraphs`);
      
      if (paragraphs.length === 0) {
        console.log(`  ⚠️  No content available for this book`);
        continue;
      }
      
      // Group paragraphs into chapters
      const chapters = [];
      let currentChapter = {
        chapter: 1,
        title: 'Chapter 1',
        paragraphs: []
      };
      
      paragraphs.forEach((para, index) => {
        // Detect chapter breaks based on element type or content
        if (para.element_type === 'h1' || para.element_type === 'h2' || 
            (para.content_plain && (
              para.content_plain.toLowerCase().includes('chapter') ||
              para.element_type === 'chapter_title'
            ))) {
          
          // Save current chapter if it has content
          if (currentChapter.paragraphs.length > 0) {
            chapters.push(currentChapter);
          }
          
          // Start new chapter
          currentChapter = {
            chapter: chapters.length + 1,
            title: para.content_plain || `Chapter ${chapters.length + 1}`,
            paragraphs: []
          };
        }
        
        // Add paragraph to current chapter
        currentChapter.paragraphs.push({
          para_id: para.para_id,
          content: para.content,
          content_plain: para.content_plain,
          element_type: para.element_type,
          element_subtype: para.element_subtype,
          refcode_short: para.refcode_short,
          refcode_long: para.refcode_long,
          puborder: para.puborder
        });
      });
      
      // Add final chapter
      if (currentChapter.paragraphs.length > 0) {
        chapters.push(currentChapter);
      }
      
      // Create content file
      const contentData = {
        book_id: bookId,
        title: book.title,
        author: book.author,
        total_chapters: chapters.length,
        total_paragraphs: paragraphs.length,
        downloaded_at: new Date().toISOString(),
        chapters: chapters
      };
      
      const contentPath = path.join(contentDir, `${bookId}.json`);
      writeFileSync(contentPath, JSON.stringify(contentData, null, 2));
      
      console.log(`  💾 Saved ${chapters.length} chapters to ${contentPath}`);
      console.log(`  📊 Total paragraphs: ${paragraphs.length}\n`);
      
      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`  ❌ Error processing book ${bookId}:`, error.message);
      continue;
    }
  }
  
  console.log('🎉 Book content download completed!');
}

// Get book IDs from command line arguments
const bookIds = process.argv.slice(2).map(id => parseInt(id)).filter(id => !isNaN(id));

downloadBookContent(bookIds).catch(console.error);