#!/usr/bin/env node

// Simple test to see if better-sqlite3 works outside Next.js
import Database from 'better-sqlite3';

try {
  console.log('Testing better-sqlite3 directly...');
  const db = new Database('/home/brian/Code/MCPSERVERS/egw-writings-mcp/data/egw-writings.db');
  
  const stmt = db.prepare('SELECT COUNT(*) as count FROM books');
  const result = stmt.get();
  console.log('Books count:', result.count);
  
  db.close();
  console.log('Direct sqlite3 test successful!');
} catch (error) {
  console.error('Direct sqlite3 test failed:', error);
}