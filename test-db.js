#!/usr/bin/env node

import { EGWDatabase } from './packages/shared/dist/index.js';

try {
  console.log('Testing database connection...');
  const db = new EGWDatabase({ 
    dbPath: '/home/brian/Code/MCPSERVERS/egw-writings-mcp/data/egw-writings.db' 
  });
  
  console.log('Database created successfully');
  const stats = db.getStats();
  console.log('Database stats:', stats);
  
  const books = db.getBooks('en');
  console.log(`Found ${books.length} English books`);
  console.log('Sample book:', books[0]);
  
  db.close();
  console.log('Test completed successfully');
} catch (error) {
  console.error('Database test failed:', error);
}