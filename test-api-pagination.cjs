const https = require('https');
const url = require('url');

// Simple function to make API calls
async function makeAPICall(apiUrl) {
  return new Promise((resolve, reject) => {
    const parsedUrl = url.parse(apiUrl);
    const options = {
      hostname: parsedUrl.hostname,
      path: parsedUrl.path,
      method: 'GET',
      headers: {
        'User-Agent': 'EGW-Investigation-Tool/1.0',
        'Accept': 'application/json'
      }
    };
    
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.end();
  });
}

(async () => {
  console.log('=== API PAGINATION INVESTIGATION ===');
  
  let currentPage = 1;
  let totalBooksFound = 0;
  let apiUrl = 'https://a.egwwritings.org/content/books?lang=en&limit=100&offset=0';
  
  // Test all pages to understand pagination (up to 1000 pages max)
  const bookIds = new Set(); // Track unique book IDs
  const duplicates = [];
  
  while (currentPage <= 1000) {
    console.log('\nPage ' + currentPage + ': ' + apiUrl);
    
    try {
      const response = await makeAPICall(apiUrl);
      
      console.log('  Count field: ' + response.count);
      console.log('  Items per page: ' + response.ipp);
      console.log('  Results length: ' + (response.results ? response.results.length : 0));
      console.log('  Has next: ' + (response.next ? 'yes' : 'no'));
      console.log('  Next URL: ' + (response.next || 'N/A'));
      
      // Check for duplicates
      if (response.results) {
        response.results.forEach(book => {
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
      }
      
      totalBooksFound += (response.results ? response.results.length : 0);
      console.log('  Total books so far: ' + totalBooksFound);
      console.log('  Unique books so far: ' + bookIds.size);
      if (duplicates.length > 0) {
        console.log('  Duplicates found: ' + duplicates.length);
      }
      
      // Check if we should continue
      if (!response.next || !response.results || response.results.length === 0) {
        console.log('\n  🛑 No more pages available');
        break;
      }
      
      apiUrl = response.next;
      currentPage++;
      
    } catch (error) {
      console.error('  ❌ Error on page ' + currentPage + ':', error.message);
      break;
    }
  }
  
  console.log('\n=== ENGLISH BOOKS SUMMARY ===');
  console.log('Pages tested: ' + (currentPage - 1));
  console.log('Total book entries found: ' + totalBooksFound);
  console.log('Unique books found: ' + bookIds.size);
  console.log('Duplicates found: ' + duplicates.length);
  
  if (duplicates.length > 0) {
    console.log('\n=== DUPLICATE DETAILS ===');
    duplicates.forEach(dup => {
      console.log('  Page ' + dup.page + ': Book ID ' + dup.book_id + ' - ' + dup.title);
    });
  }
  
  // Test other languages and no language parameter
  console.log('\n=== TESTING OTHER LANGUAGES ===');
  
  // Test Spanish
  try {
    console.log('\n--- Spanish (es) ---');
    const esResponse = await makeAPICall('https://a.egwwritings.org/content/books?lang=es&limit=100&offset=0');
    console.log('Spanish count: ' + esResponse.count);
    console.log('Spanish results: ' + (esResponse.results ? esResponse.results.length : 0));
  } catch (error) {
    console.log('Error testing Spanish: ' + error.message);
  }
  
  // Test French  
  try {
    console.log('\n--- French (fr) ---');
    const frResponse = await makeAPICall('https://a.egwwritings.org/content/books?lang=fr&limit=100&offset=0');
    console.log('French count: ' + frResponse.count);
    console.log('French results: ' + (frResponse.results ? frResponse.results.length : 0));
  } catch (error) {
    console.log('Error testing French: ' + error.message);
  }
  
  // Test no language parameter
  try {
    console.log('\n--- No language parameter ---');
    const noLangResponse = await makeAPICall('https://a.egwwritings.org/content/books?limit=100&offset=0');
    console.log('No lang count: ' + noLangResponse.count);
    console.log('No lang results: ' + (noLangResponse.results ? noLangResponse.results.length : 0));
  } catch (error) {
    console.log('Error testing no language: ' + error.message);
  }
})();