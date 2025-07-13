#!/usr/bin/env tsx

import { createWebScraper } from '../src/utils/web-scraper.js';

async function testWebScraper() {
  console.log('🕷️  Testing EGW Writings Web Scraper...\n');

  const scraper = createWebScraper();

  // Test 1: Test book access
  console.log('1. Testing book access...');
  const canAccess = await scraper.testBookAccess();
  
  if (!canAccess) {
    console.log('❌ Cannot access books via web scraping');
    return;
  }

  // Test 2: Discover available books
  console.log('\n2. Discovering available books...');
  const books = await scraper.discoverBooks();
  console.log(`Found ${books.length} potential books`);
  
  if (books.length > 0) {
    console.log('Sample books found:');
    books.slice(0, 5).forEach(book => {
      console.log(`- ${book.title} (${book.url})`);
    });
  }

  // Test 3: Extract sample content
  console.log('\n3. Extracting sample content...');
  const extractedBooks = await scraper.extractSampleContent();
  
  if (extractedBooks.length > 0) {
    console.log('\n📊 Extraction Results:');
    extractedBooks.forEach(book => {
      const totalParagraphs = book.chapters.reduce((sum, chapter) => sum + chapter.paragraphs.length, 0);
      console.log(`📚 ${book.title}`);
      console.log(`   📄 Chapters: ${book.chapters.length}`);
      console.log(`   📝 Paragraphs: ${totalParagraphs}`);
      
      if (totalParagraphs > 0) {
        const firstParagraph = book.chapters[0]?.paragraphs[0];
        if (firstParagraph) {
          const preview = firstParagraph.text.substring(0, 100) + '...';
          console.log(`   📖 Preview: "${preview}"`);
        }
      }
    });
    
    console.log(`\n✅ Successfully extracted content from ${extractedBooks.length} books`);
    console.log('💾 Sample data saved to data/raw/ directory');
  } else {
    console.log('❌ No content could be extracted');
  }

  console.log('\n🔍 Test Summary:');
  console.log(`- Book access: ${canAccess ? '✅' : '❌'}`);
  console.log(`- Books discovered: ${books.length}`);
  console.log(`- Content extracted: ${extractedBooks.length} books`);
  
  if (extractedBooks.length > 0) {
    console.log('\n💡 Next steps:');
    console.log('- Implement database storage for extracted content');
    console.log('- Build full-text search index');
    console.log('- Create MCP server with search tools');
    console.log('- Scale up to extract more books');
  } else {
    console.log('\n💡 Alternative approaches:');
    console.log('- Investigate different authentication methods');
    console.log('- Try mobile app API endpoints');
    console.log('- Consider using existing EGW datasets');
  }
}

// Run the test
testWebScraper().catch(console.error);