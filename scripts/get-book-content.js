#!/usr/bin/env node

/**
 * Get book content from database - used by API to avoid Next.js issues with better-sqlite3
 */

import { EGWDatabase } from '../packages/shared/dist/index.js';

async function getBookContent() {
  const bookId = parseInt(process.argv[2]);
  const chapter = process.argv[3] ? parseInt(process.argv[3]) : null;
  
  if (!bookId) {
    console.log(JSON.stringify({
      success: false,
      error: 'Book ID required',
      available: false
    }));
    process.exit(1);
  }
  
  try {
    const db = new EGWDatabase({ 
      dbPath: '/home/brian/Code/MCPSERVERS/egw-writings-mcp/data/egw-writings.db' 
    });
    
    // Get book info
    const books = db.getBooks('en');
    const book = books.find(b => b.book_id === bookId);
    
    if (!book) {
      console.log(JSON.stringify({
        success: false,
        error: 'Book not found',
        available: false
      }));
      db.close();
      process.exit(1);
    }
    
    // Get paragraphs
    const paragraphs = db.getParagraphs(bookId);
    
    if (paragraphs.length === 0) {
      // Generate sample content for now
      const sampleContent = generateSampleContent(book, chapter);
      console.log(JSON.stringify(sampleContent));
      db.close();
      return;
    }
    
    // Group paragraphs into chapters
    const chapters = [];
    let currentChapter = {
      chapter: 1,
      title: 'Chapter 1',
      paragraphs: []
    };
    
    paragraphs.forEach((para) => {
      // Detect chapter breaks
      if (para.element_type === 'h1' || para.element_type === 'h2' || 
          (para.content_plain && para.content_plain.toLowerCase().includes('chapter'))) {
        
        if (currentChapter.paragraphs.length > 0) {
          chapters.push(currentChapter);
        }
        
        currentChapter = {
          chapter: chapters.length + 1,
          title: para.content_plain || `Chapter ${chapters.length + 1}`,
          paragraphs: []
        };
      }
      
      currentChapter.paragraphs.push({
        para_id: para.para_id,
        content: para.content,
        content_plain: para.content_plain,
        element_type: para.element_type,
        refcode_short: para.refcode_short,
        refcode_long: para.refcode_long
      });
    });
    
    if (currentChapter.paragraphs.length > 0) {
      chapters.push(currentChapter);
    }
    
    // Return specific chapter if requested
    if (chapter) {
      const requestedChapter = chapters.find(ch => ch.chapter === chapter);
      console.log(JSON.stringify({
        success: true,
        data: requestedChapter || null,
        available: true
      }));
    } else {
      // Return all chapters
      console.log(JSON.stringify({
        success: true,
        data: {
          book_id: bookId,
          title: book.title,
          author: book.author,
          total_chapters: chapters.length,
          chapters: chapters
        },
        available: true
      }));
    }
    
    db.close();
    
  } catch (error) {
    console.log(JSON.stringify({
      success: false,
      error: error.message,
      available: false
    }));
    process.exit(1);
  }
}

function generateSampleContent(book, chapter = null) {
  // Generate meaningful sample content based on the book
  const chapters = [];
  const numChapters = Math.min(Math.max(Math.floor(book.npages / 20), 5), 25);
  
  for (let i = 1; i <= numChapters; i++) {
    const chapterContent = {
      chapter: i,
      title: `Chapter ${i}`,
      paragraphs: [
        {
          para_id: `${book.book_id}.${i}.1`,
          content: `<h2>Chapter ${i}</h2>`,
          content_plain: `Chapter ${i}`,
          element_type: 'h2',
          refcode_short: `${book.code || 'BK'} ${i * 10}`,
          refcode_long: `${book.title}, p. ${i * 10}`
        },
        {
          para_id: `${book.book_id}.${i}.2`,
          content: `<p>This chapter explores important themes from "${book.title}" by ${book.author}. The content would normally be fetched from the EGW API and stored in the database for offline access.</p>`,
          content_plain: `This chapter explores important themes from "${book.title}" by ${book.author}. The content would normally be fetched from the EGW API and stored in the database for offline access.`,
          element_type: 'p',
          refcode_short: `${book.code || 'BK'} ${i * 10 + 1}`,
          refcode_long: `${book.title}, p. ${i * 10 + 1}`
        },
        {
          para_id: `${book.book_id}.${i}.3`,
          content: `<p>Published in ${book.pub_year}, this ${book.npages}-page work contains valuable insights and spiritual guidance. Each paragraph would have unique identifiers for proper citation and cross-referencing.</p>`,
          content_plain: `Published in ${book.pub_year}, this ${book.npages}-page work contains valuable insights and spiritual guidance. Each paragraph would have unique identifiers for proper citation and cross-referencing.`,
          element_type: 'p',
          refcode_short: `${book.code || 'BK'} ${i * 10 + 2}`,
          refcode_long: `${book.title}, p. ${i * 10 + 2}`
        }
      ]
    };
    
    chapters.push(chapterContent);
  }
  
  if (chapter) {
    const requestedChapter = chapters.find(ch => ch.chapter === chapter);
    return {
      success: true,
      data: requestedChapter || null,
      available: false,
      message: 'Sample content - real content needs to be downloaded'
    };
  }
  
  return {
    success: true,
    data: {
      book_id: book.book_id,
      title: book.title,
      author: book.author,
      total_chapters: chapters.length,
      chapters: chapters
    },
    available: false,
    message: 'Sample content - real content needs to be downloaded'
  };
}

getBookContent().catch(console.error);