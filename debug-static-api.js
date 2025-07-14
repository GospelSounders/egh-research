// Debug script to test static API locally
// Using built-in fetch (Node.js 18+)

async function testStaticAPI() {
  console.log('Testing static API...');
  
  try {
    // Test 1: Load books.json
    console.log('\n1. Testing books.json load...');
    const response = await fetch('https://gospelsounders.github.io/egw-writings-mcp/api/books.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    
    const booksData = await response.json();
    console.log('Books data structure:');
    console.log('- Total:', booksData.total);
    console.log('- Has "all" property:', 'all' in booksData);
    console.log('- All array length:', booksData.all ? booksData.all.length : 'N/A');
    console.log('- First book title:', booksData.all ? booksData.all[0].title : 'N/A');
    
    // Test 2: Simulate static API logic
    console.log('\n2. Testing static API logic...');
    const cachedBooks = booksData.all || booksData;
    console.log('- Cached books length:', cachedBooks.length);
    
    // Test 3: Simulate getBooks function
    console.log('\n3. Testing getBooks function...');
    const page = 1;
    const limit = 50;
    
    let filteredBooks = cachedBooks;
    console.log('- Filtered books length:', filteredBooks.length);
    
    const offset = (page - 1) * limit;
    const results = filteredBooks.slice(offset, offset + limit);
    console.log('- Results length:', results.length);
    
    const response2 = {
      count: filteredBooks.length,
      ipp: limit,
      next: null,
      previous: null,
      results
    };
    
    console.log('- Response count:', response2.count);
    console.log('- Response results length:', response2.results.length);
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testStaticAPI();