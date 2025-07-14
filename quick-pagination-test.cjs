#!/usr/bin/env node

// Quick test to understand the API pagination discrepancy
const { createAuthManager, EGWApiClientNew } = require('./packages/shared/dist/index.js');

(async () => {
  try {
    console.log('🔍 API PAGINATION ANALYSIS');
    
    const authManager = createAuthManager();
    const apiClient = new EGWApiClientNew({ authManager });
    
    let currentPage = 1;
    let totalBooksFound = 0;
    let hasMore = true;
    const bookIds = new Set();
    const duplicates = [];
    let apiCount = null;
    
    while (hasMore && currentPage <= 30) {
      console.log(`📄 Page ${currentPage}...`);
      
      const booksResponse = await apiClient.getBooks({ 
        lang: 'en',
        limit: 100,
        offset: (currentPage - 1) * 100
      });
      
      if (currentPage === 1) {
        apiCount = booksResponse.count;
        console.log(`   🔢 API count field: ${apiCount}`);
      }
      
      const pageBooks = Array.isArray(booksResponse) ? booksResponse : booksResponse.results || [];
      
      // Check for duplicates
      pageBooks.forEach(book => {
        if (bookIds.has(book.book_id)) {
          duplicates.push({ page: currentPage, book_id: book.book_id, title: book.title });
        } else {
          bookIds.add(book.book_id);
        }
      });
      
      totalBooksFound += pageBooks.length;
      const hasNext = booksResponse.next;
      hasMore = hasNext && pageBooks.length > 0;
      
      console.log(`   📊 Books this page: ${pageBooks.length}, Total: ${totalBooksFound}, Unique: ${bookIds.size}`);
      
      currentPage++;
    }
    
    console.log(`\n📋 RESULTS:`);
    console.log(`- API reported count: ${apiCount}`);
    console.log(`- Actual pages tested: ${currentPage - 1}`);
    console.log(`- Total book entries: ${totalBooksFound}`);
    console.log(`- Unique books: ${bookIds.size}`);
    console.log(`- Duplicates found: ${duplicates.length}`);
    console.log(`- Estimated total if all pages: ${Math.ceil(totalBooksFound / (currentPage - 1)) * 30} (rough estimate)`);
    
    if (duplicates.length > 0) {
      console.log(`\n🔍 DUPLICATE ANALYSIS:`);
      duplicates.slice(0, 5).forEach(dup => {
        console.log(`  Page ${dup.page}: Book ${dup.book_id} - ${dup.title}`);
      });
    }
    
    // Test other languages quickly
    console.log(`\n🌐 TESTING OTHER LANGUAGES:`);
    const languages = ['es', 'fr', 'de'];
    
    for (const lang of languages) {
      try {
        const response = await apiClient.getBooks({ lang, limit: 100, offset: 0 });
        console.log(`  ${lang}: count=${response.count}, results=${response.results?.length || 0}`);
      } catch (error) {
        console.log(`  ${lang}: ERROR - ${error.message}`);
      }
    }
    
    // Test no language
    try {
      const response = await apiClient.getBooks({ limit: 100, offset: 0 });
      console.log(`  no-lang: count=${response.count}, results=${response.results?.length || 0}`);
    } catch (error) {
      console.log(`  no-lang: ERROR - ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
})();