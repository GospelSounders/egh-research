#!/usr/bin/env tsx

import { createAuthManager } from '../src/utils/auth.js';
import { createApiClient } from '../src/utils/api.js';

async function debugSearch() {
  console.log('🔍 Debugging search response format...\n');

  const authManager = createAuthManager();
  const apiClient = createApiClient(authManager);

  try {
    console.log('Testing simple search...');
    const searchResults = await apiClient.search('love', { 
      lang: ['en'], 
      limit: 5 
    });
    
    console.log('Raw search response:');
    console.log(JSON.stringify(searchResults, null, 2));
    
    // Test search suggestions too
    console.log('\nTesting search suggestions...');
    const suggestions = await apiClient.getSearchSuggestions('sancti');
    
    console.log('Raw suggestions response:');
    console.log(JSON.stringify(suggestions, null, 2));

  } catch (error) {
    console.error('❌ Debug search failed:', error);
  }
}

debugSearch().catch(console.error);