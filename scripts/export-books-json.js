#!/usr/bin/env node

/**
 * Export books from SQLite database to JSON for website use
 * This workaround allows the Next.js website to access the data without native modules
 */

import 'dotenv/config';
import { EGWDatabase } from '../packages/shared/dist/index.js';
import { writeFileSync } from 'fs';
import path from 'path';

async function exportBooksToJSON() {
  console.log('🔄 Exporting books from database to JSON...\n');
  
  try {
    const db = new EGWDatabase({ 
      dbPath: '/home/brian/Code/MCPSERVERS/egw-writings-mcp/data/egw-writings.db' 
    });
    
    console.log('📊 Getting database statistics...');
    const stats = db.getStats();
    console.log(`  Languages: ${stats.languages}`);
    console.log(`  Books: ${stats.books}`);
    console.log(`  Paragraphs: ${stats.paragraphs}\n`);
    
    console.log('📚 Exporting all books...');
    const allBooks = db.getBooks();
    console.log(`  Retrieved ${allBooks.length} books`);
    
    // Transform books for website compatibility
    const transformedBooks = allBooks.map(book => ({
      book_id: book.book_id,
      title: book.title,
      author: book.author || 'Ellen G. White',
      pub_year: parseInt(book.pub_year) || 0,
      npages: book.npages || 0,
      lang: book.lang || 'en',
      description: book.description,
      category: categorizeBook(book),
      rating: 4.0 + Math.random() * 1.0, // Random rating 4.0-5.0
      downloads: Math.floor(Math.random() * 10000) + 1000, // Random downloads
      code: book.code,
      publisher: book.publisher,
      folder_id: book.folder_id
    }));
    
    console.log('📂 Getting languages...');
    const languages = db.getLanguages();
    console.log(`  Retrieved ${languages.length} languages`);
    
    const exportData = {
      stats,
      books: transformedBooks,
      languages,
      exportedAt: new Date().toISOString(),
      totalBooks: transformedBooks.length
    };
    
    // Export to JSON file
    const outputPath = path.join(process.cwd(), 'data', 'books-export.json');
    writeFileSync(outputPath, JSON.stringify(exportData, null, 2));
    
    console.log(`\n✅ Export completed successfully!`);
    console.log(`📁 File saved to: ${outputPath}`);
    console.log(`📊 Exported ${transformedBooks.length} books in ${languages.length} languages`);
    
    db.close();
    
  } catch (error) {
    console.error('❌ Export failed:', error);
    process.exit(1);
  }
}

function categorizeBook(book) {
  const author = book.author?.toLowerCase() || '';
  const title = book.title?.toLowerCase() || '';
  
  // EGW books (including White family members who wrote about EGW)
  if (author.includes('ellen') && author.includes('white')) {
    if (title.includes('maranatha') || title.includes('heavenly') || title.includes('sons') || title.includes('daughters')) {
      return 'devotional';
    }
    return 'egw';
  }
  
  // EGW Estate and family books
  if (author.includes('arthur lacey white') || author.includes('william c. white') || 
      author.includes('white estate') || author.includes('ellen g. white estate')) {
    return 'egw';
  }
  
  // Pioneer authors (SDA founding leaders and early ministers)
  const pioneers = [
    'uriah smith', 'alonzo t. jones', 'a. t. jones', 'ellet j. waggoner', 'e. j. waggoner',
    'john nevins andrews', 'j. n. andrews', 'john andrews', 'james springer white', 'james white',
    'joseph bates', 'hiram edson', 'stephen haskell', 's. n. haskell', 'george ide butler',
    'john norton loughborough', 'j. n. loughborough', 'merritt gardner kellogg', 'm. g. kellogg',
    'alonzo trevier jones', 'ellet joseph waggoner', 'william warren prescott', 'w. w. prescott',
    'arthur grosvenor daniells', 'a. g. daniells', 'william ambrose spicer', 'w. a. spicer'
  ];
  if (pioneers.some(pioneer => author.includes(pioneer))) {
    return 'pioneer';
  }
  
  // Historical reference works (Biblical scholars, reformers, historians)
  const historicalAuthors = [
    'alfred edersheim', 'martin luther', 'john bunyan', 'john foxe', 'jean-henri merle d\'aubigné',
    'james aitken wylie', 'titus flavius josephus', 'josephus', 'matthew henry', 'philip schaff',
    'noah webster', 'william smith', 'james strong', 'robert young'
  ];
  if (historicalAuthors.some(historical => author.includes(historical))) {
    return 'historical';
  }
  
  // Periodicals (based on title patterns)
  if (title.includes('review') || title.includes('herald') || title.includes('signs') || title.includes('times') || 
      title.includes('youth') || title.includes('instructor') || title.includes('gleaner') || 
      title.includes('bulletin') || title.includes('missionary') || title.includes('echo') ||
      title.includes('reformer') || title.includes('evangelist') || title.includes('canvasser') ||
      title.includes('worker') || title.includes('visitor') || title.includes('banner') ||
      title.includes('reporter') || title.includes('indicator') || title.includes('outlook') ||
      title.includes('messenger') || title.includes('advocate') || title.includes('advance')) {
    return 'periodical';
  }
  
  // Modern SDA authors and scholars
  const modernAuthors = [
    'roger w. coon', 'robert w. olson', 'francis d. nichol', 'herbert e. douglass',
    'paul a. gordon', 'ronald d. graybill', 'arthur whitefield spalding', 'dores eugene robinson',
    'george e. rice', 'frank b. holbrook', 'george r. knight'
  ];
  if (modernAuthors.some(modern => author.includes(modern))) {
    return 'devotional';
  }
  
  // Historical books (based on title content)
  if (title.includes('history') || title.includes('origin') || title.includes('movement') || 
      title.includes('advent') || title.includes('reformation') || title.includes('protestant') ||
      title.includes('waldenses') || title.includes('martyrs') || title.includes('antiquities') ||
      title.includes('wars') || title.includes('pilgrim')) {
    return 'historical';
  }
  
  // Default to devotional for other compilations and reference works
  return 'devotional';
}

exportBooksToJSON().catch(console.error);