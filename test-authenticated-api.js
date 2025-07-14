#!/usr/bin/env node

import 'dotenv/config';
import { EGWApiClientNew as EGWApiClient, createAuthManager } from '@surgbc/egw-writings-shared';

async function testLanguage(apiClient, lang, langName) {
  console.log(`\n=== TESTING ${langName.toUpperCase()} (${lang || 'no-lang'}) ===`);
  
  let currentPage = 1;
  let totalBooksFound = 0;
  let hasMore = true;
  const bookIds = new Set();
  const duplicates = [];
  
  try {
    while (hasMore && currentPage <= 50) { // Limit to 50 pages for safety
      console.log(`  📄 Fetching page ${currentPage}...`);
      
      const params = { limit: 100, offset: (currentPage - 1) * 100 };
      if (lang) params.lang = lang;
      
      const booksResponse = await apiClient.getBooks(params);
      
      if (currentPage === 1) {
        console.log(`    API reports count: ${booksResponse?.count || 'undefined'}`);
        console.log(`    Items per page: ${booksResponse?.ipp || 'undefined'}`);
      }
      
      const pageBooks = Array.isArray(booksResponse) ? booksResponse : booksResponse?.results || [];
      
      // Check for duplicates
      pageBooks.forEach(book => {
        if (bookIds.has(book.book_id)) {
          duplicates.push({
            page: currentPage,
            book_id: book.book_id,
            title: book.title
          });
        } else {
          bookIds.add(book.book_id);
        }
      });
      
      totalBooksFound += pageBooks.length;
      const hasNext = booksResponse?.next;
      hasMore = hasNext && pageBooks.length > 0;
      currentPage++;
      
      console.log(`    Page books: ${pageBooks.length}, Total: ${totalBooksFound}, Unique: ${bookIds.size}, Duplicates: ${duplicates.length}`);
      
      if (currentPage > 50) {
        console.log(`    🛑 Stopped at page limit (50)`);
        break;
      }
    }
    
    console.log(`  📊 SUMMARY for ${langName}:`);
    console.log(`    Pages fetched: ${currentPage - 1}`);
    console.log(`    Total book entries: ${totalBooksFound}`);
    console.log(`    Unique books: ${bookIds.size}`);
    console.log(`    Duplicates: ${duplicates.length}`);
    
    if (duplicates.length > 0) {
      console.log(`    First few duplicates:`);
      duplicates.slice(0, 5).forEach(dup => {
        console.log(`      Page ${dup.page}: Book ID ${dup.book_id} - ${dup.title}`);
      });
    }
    
    return {
      language: lang || 'no-lang',
      pages: currentPage - 1,
      totalEntries: totalBooksFound,
      uniqueBooks: bookIds.size,
      duplicates: duplicates.length
    };
    
  } catch (error) {
    console.error(`    ❌ Error testing ${langName}:`, error.message);
    return null;
  }
}

(async () => {
  console.log('🔍 COMPREHENSIVE API PAGINATION TEST');
  
  try {
    const authManager = createAuthManager();
    const apiClient = new EGWApiClient({ authManager });
    
    const results = [];
    
    // Test English (detailed)
    const enResult = await testLanguage(apiClient, 'en', 'English');
    if (enResult) results.push(enResult);
    
    // Test other languages (sample)
    const otherLanguages = [
      ['es', 'Spanish'],
      ['fr', 'French'], 
      ['de', 'German'],
      ['pt', 'Portuguese'],
      [null, 'No Language']
    ];
    
    for (const [lang, name] of otherLanguages) {
      const result = await testLanguage(apiClient, lang, name);
      if (result) results.push(result);
    }
    
    console.log(`\n🎯 FINAL ANALYSIS:`);
    console.log(`Total languages tested: ${results.length}`);
    
    results.forEach(result => {
      const efficiency = result.totalEntries > 0 ? (result.uniqueBooks / result.totalEntries * 100).toFixed(1) : 0;
      console.log(`  ${result.language}: ${result.uniqueBooks} unique books (${result.totalEntries} entries, ${efficiency}% efficiency, ${result.duplicates} duplicates)`);
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
})();