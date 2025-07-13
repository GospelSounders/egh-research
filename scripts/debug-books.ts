#!/usr/bin/env tsx

import { createAuthManager } from '../src/utils/auth.js';
import { createApiClient } from '../src/utils/api.js';

async function debugBooks() {
  console.log('📖 Debugging book structure...\n');

  const authManager = createAuthManager();
  const apiClient = createApiClient(authManager);

  try {
    console.log('1. Getting folders...');
    const folders = await apiClient.getFolders('en');
    
    // Find the "Books" folder under "EGW Writings"
    const booksFolder = folders.find(f => f.children?.find(c => c.name === 'Books'))?.children?.find(c => c.name === 'Books');
    
    if (booksFolder) {
      console.log(`Found Books folder with ID: ${booksFolder.folder_id}`);
      
      console.log('\n2. Raw books response:');
      const books = await apiClient.getBooksByFolder(booksFolder.folder_id);
      console.log(JSON.stringify(books, null, 2));
      
      if (Array.isArray(books) && books.length > 0) {
        console.log('\n3. First book structure:');
        console.log('Type:', typeof books[0]);
        console.log('Keys:', Object.keys(books[0]));
        console.log('Full object:', books[0]);
      }
    } else {
      console.log('❌ Books folder not found');
    }

  } catch (error) {
    console.error('❌ Debug books failed:', error);
  }
}

debugBooks().catch(console.error);