#!/usr/bin/env tsx

import { createAuthManager } from '../src/utils/auth.js';
import { createApiClient } from '../src/utils/api.js';

async function debugParagraphs() {
  console.log('📝 Debugging paragraph structure...\n');

  const authManager = createAuthManager();
  const apiClient = createApiClient(authManager);

  try {
    console.log('1. Getting book and chapter...');
    const folders = await apiClient.getFolders('en');
    const booksFolder = folders.find(f => f.children?.find(c => c.name === 'Books'))?.children?.find(c => c.name === 'Books');
    const books = await apiClient.getBooksByFolder(booksFolder!.folder_id);
    const firstBook = books[0];
    const toc = await apiClient.getBookToc(firstBook.book_id);
    const firstChapter = toc[0];
    
    console.log(`Testing with book: ${firstBook.title} (ID: ${firstBook.book_id})`);
    console.log(`Testing with chapter: ${firstChapter.title} (ID: ${firstChapter.id})`);
    
    console.log('\n2. Raw paragraphs response:');
    const paragraphs = await apiClient.getChapter(firstBook.book_id, firstChapter.id);
    console.log(JSON.stringify(paragraphs, null, 2));
    
    if (Array.isArray(paragraphs) && paragraphs.length > 0) {
      console.log('\n3. First paragraph structure:');
      console.log('Type:', typeof paragraphs[0]);
      console.log('Keys:', Object.keys(paragraphs[0]));
      console.log('Full object:', paragraphs[0]);
    }

  } catch (error) {
    console.error('❌ Debug paragraphs failed:', error);
  }
}

debugParagraphs().catch(console.error);