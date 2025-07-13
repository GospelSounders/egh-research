#!/usr/bin/env tsx

import { createAuthManager } from '../src/utils/auth.js';
import { createApiClient } from '../src/utils/api.js';

async function debugFolders() {
  console.log('📁 Debugging folder structure...\n');

  const authManager = createAuthManager();
  const apiClient = createApiClient(authManager);

  try {
    // Test 1: Get raw folders response
    console.log('1. Raw folders response:');
    const folders = await apiClient.getFolders('en');
    console.log(JSON.stringify(folders, null, 2));
    
    // Test 2: Try to understand the structure by looking at first few elements
    if (Array.isArray(folders) && folders.length > 0) {
      console.log('\n2. First folder structure:');
      console.log('Type:', typeof folders[0]);
      console.log('Keys:', Object.keys(folders[0]));
      console.log('Full object:', folders[0]);
    }

  } catch (error) {
    console.error('❌ Debug folders failed:', error);
  }
}

debugFolders().catch(console.error);