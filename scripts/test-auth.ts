#!/usr/bin/env tsx

import { createAuthManager } from '../src/utils/auth.js';
import { createApiClient } from '../src/utils/api.js';

async function testAuthentication() {
  console.log('🔐 Testing EGW Writings API Authentication...\n');

  const authManager = createAuthManager();
  const apiClient = createApiClient(authManager);

  // Test 1: Check API status (might work without auth)
  console.log('1. Testing API connectivity...');
  try {
    const status = await apiClient.getApiStatus();
    console.log('✅ API is reachable');
    console.log('Status:', status);
  } catch (error) {
    console.log('❌ API not reachable:', error);
  }

  // Test 2: Try client credentials authentication
  console.log('\n2. Testing client credentials authentication...');
  try {
    const token = await authManager.clientCredentialsAuth();
    console.log('✅ Client credentials authentication successful!');
    console.log('Token expires at:', new Date(token.expiresAt).toISOString());
    console.log('Scope:', token.scope);
  } catch (error) {
    console.log('❌ Client credentials authentication failed:', error);
  }

  // Test 3: Test authenticated API call
  console.log('\n3. Testing authenticated API call...');
  try {
    const isAuthenticated = await authManager.isAuthenticated();
    if (isAuthenticated) {
      console.log('✅ Authentication token is valid');
      
      // Try to get user info
      try {
        const userInfo = await apiClient.getUserInfo();
        console.log('✅ User info retrieved:', userInfo);
      } catch (error) {
        console.log('❌ User info call failed:', error);
      }

      // Try to get languages
      try {
        const languages = await apiClient.getLanguages();
        console.log('✅ Languages retrieved:', languages.length, 'languages available');
        console.log('Sample languages:', languages.slice(0, 3).map(l => l.name || l.code));
      } catch (error) {
        console.log('❌ Languages call failed:', error);
      }

    } else {
      console.log('❌ No valid authentication token');
    }
  } catch (error) {
    console.log('❌ Authentication test failed:', error);
  }

  // Test 4: Show manual OAuth URL (for future reference)
  console.log('\n4. Manual OAuth URL (for interactive auth):');
  const authUrl = authManager.getAuthorizationUrl('test-state');
  console.log('📝 Authorization URL:', authUrl);
  console.log('📝 Note: This would require web browser interaction for full OAuth flow');

  console.log('\n🔍 Test Summary:');
  console.log('- API connectivity test completed');
  console.log('- Client credentials authentication attempted');
  console.log('- Authenticated API calls tested');
  console.log('- Manual OAuth URL generated for reference');
  
  console.log('\n💡 Next steps:');
  console.log('- If client credentials worked, proceed with data extraction');
  console.log('- If not, may need to implement full OAuth flow with web browser');
  console.log('- Consider alternative approaches (web scraping, public endpoints)');
}

// Run the test
testAuthentication().catch(console.error);