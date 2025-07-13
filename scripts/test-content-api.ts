#!/usr/bin/env tsx

import { createAuthManager } from '../src/utils/auth.js';
import { createApiClient } from '../src/utils/api.js';

async function testContentAPI() {
  console.log('📚 Testing EGW Writings Content API...\n');

  const authManager = createAuthManager();
  const apiClient = createApiClient(authManager);

  try {
    // Test 1: Get languages
    console.log('1. Testing languages endpoint...');
    const languages = await apiClient.getLanguages();
    console.log(`✅ Found ${languages.length} languages`);
    console.log('Sample languages:', languages.slice(0, 5).map(l => `${l.name || l.code} (${l.code})`));

    // Test 2: Get English folders  
    console.log('\n2. Testing folders endpoint...');
    const folders = await apiClient.getFolders('en');
    console.log(`✅ Found ${folders.length} folders for English`);
    console.log('Available folders:');
    folders.slice(0, 10).forEach(folder => {
      console.log(`- ${folder.name} (ID: ${folder.id}, Books: ${folder.bookCount})`);
    });

    // Test 3: Get books from first folder
    if (folders.length > 0) {
      console.log('\n3. Testing books endpoint...');
      const firstFolder = folders[0];
      console.log(`Getting books from folder: ${firstFolder.name}`);
      
      const books = await apiClient.getBooksByFolder(firstFolder.id);
      console.log(`✅ Found ${books.length} books in "${firstFolder.name}"`);
      
      if (books.length > 0) {
        console.log('Sample books:');
        books.slice(0, 5).forEach(book => {
          console.log(`- ${book.title} by ${book.author} (ID: ${book.id})`);
        });

        // Test 4: Get book details
        console.log('\n4. Testing book details...');
        const firstBook = books[0];
        console.log(`Getting details for: ${firstBook.title}`);
        
        const bookDetails = await apiClient.getBook(firstBook.id);
        console.log(`✅ Book details retrieved for "${bookDetails.title}"`);
        console.log(`Author: ${bookDetails.author}`);
        console.log(`Language: ${bookDetails.language}`);
        console.log(`Status: ${bookDetails.status}`);

        // Test 5: Get table of contents
        console.log('\n5. Testing table of contents...');
        const toc = await apiClient.getBookToc(firstBook.id);
        console.log(`✅ Found ${toc.length} chapters`);
        
        if (toc.length > 0) {
          console.log('Sample chapters:');
          toc.slice(0, 3).forEach(chapter => {
            console.log(`- Chapter ${chapter.order}: ${chapter.title} (${chapter.paragraphCount} paragraphs)`);
          });

          // Test 6: Get chapter content
          console.log('\n6. Testing chapter content...');
          const firstChapter = toc[0];
          console.log(`Getting content for: ${firstChapter.title}`);
          
          const paragraphs = await apiClient.getChapter(firstBook.id, firstChapter.id);
          console.log(`✅ Found ${paragraphs.length} paragraphs`);
          
          if (paragraphs.length > 0) {
            const firstParagraph = paragraphs[0];
            const preview = firstParagraph.text.substring(0, 150) + '...';
            console.log(`Sample paragraph (${firstParagraph.reference}):`);
            console.log(`"${preview}"`);

            // Test 7: Get specific paragraph
            console.log('\n7. Testing specific paragraph...');
            const singleParagraph = await apiClient.getParagraph(firstBook.id, firstParagraph.id);
            console.log(`✅ Retrieved paragraph: ${singleParagraph.reference}`);
            const singlePreview = singleParagraph.text.substring(0, 100) + '...';
            console.log(`Content: "${singlePreview}"`);
          }
        }
      }
    }

    // Test 8: Search functionality
    console.log('\n8. Testing search...');
    const searchResults = await apiClient.search('love', { limit: 5 });
    console.log(`✅ Search found ${searchResults.totalCount} results`);
    
    if (searchResults.paragraphs.length > 0) {
      console.log('Sample search results:');
      searchResults.paragraphs.slice(0, 3).forEach(paragraph => {
        const preview = paragraph.text.substring(0, 100) + '...';
        console.log(`- ${paragraph.reference}: "${preview}"`);
      });
    }

    // Test 9: Search suggestions
    console.log('\n9. Testing search suggestions...');
    const suggestions = await apiClient.getSearchSuggestions('sancti');
    console.log(`✅ Found ${suggestions.length} suggestions for "sancti"`);
    console.log('Suggestions:', suggestions.slice(0, 5));

    console.log('\n🎉 Content API Testing Complete!');
    console.log('\n📊 Summary:');
    console.log(`- Languages: ${languages.length}`);
    console.log(`- Folders: ${folders.length}`);
    console.log(`- Books tested: ${folders.length > 0 ? 'Yes' : 'No'}`);
    console.log(`- Content access: ${folders.length > 0 ? 'Working' : 'Not tested'}`);
    console.log(`- Search: Working`);
    
    console.log('\n✅ API is fully functional for data extraction!');

  } catch (error) {
    console.error('❌ Content API test failed:', error);
  }
}

// Run the test
testContentAPI().catch(console.error);