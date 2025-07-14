#!/usr/bin/env node

import 'dotenv/config';
import { EGWApiClientNew as EGWApiClient, createAuthManager } from '@surgbc/egw-writings-shared';

async function testLanguagePagination(apiClient, lang, langName) {
  console.log(`\n🔍 Testing ${langName} (${lang || 'no-lang'})`);
  
  try {
    // Test first page only
    const params = { limit: 100, offset: 0 };
    if (lang) params.lang = lang;
    
    const response = await apiClient.getBooks(params);
    const pageBooks = Array.isArray(response) ? response : response?.results || [];
    
    console.log(`  📊 Count field: ${response?.count || 'undefined'}`);
    console.log(`  📊 Results: ${pageBooks.length} books`);
    console.log(`  📊 Has next: ${response?.next ? 'yes' : 'no'}`);
    
    // Test second page to see if pattern continues
    if (response?.next) {
      const params2 = { limit: 100, offset: 100 };
      if (lang) params2.lang = lang;
      
      const response2 = await apiClient.getBooks(params2);
      const pageBooks2 = Array.isArray(response2) ? response2 : response2?.results || [];
      
      console.log(`  📊 Page 2 results: ${pageBooks2.length} books`);
      console.log(`  📊 Page 2 has next: ${response2?.next ? 'yes' : 'no'}`);
    }
    
  } catch (error) {
    console.log(`  ❌ Error: ${error.message}`);
  }
}

(async () => {
  console.log('🌐 MULTI-LANGUAGE API TEST');
  
  try {
    const authManager = createAuthManager();
    const apiClient = new EGWApiClient({ authManager });
    
    // Test various languages
    await testLanguagePagination(apiClient, 'en', 'English');
    await testLanguagePagination(apiClient, 'es', 'Spanish');
    await testLanguagePagination(apiClient, 'fr', 'French');
    await testLanguagePagination(apiClient, 'de', 'German');
    await testLanguagePagination(apiClient, 'pt', 'Portuguese');
    await testLanguagePagination(apiClient, 'ru', 'Russian');
    await testLanguagePagination(apiClient, null, 'No Language');
    
    console.log('\n✅ Language test complete');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
})();