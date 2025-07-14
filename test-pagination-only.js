#!/usr/bin/env node

// Test pagination only (no downloads) to understand the discrepancy
const { exec } = require('child_process');

// Run the downloader but capture just the pagination summary
const command = `make egw-download-zips LANGUAGE=en LIMIT=0 2>&1 | grep -A 20 "PAGINATION SUMMARY"`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error('Error:', error);
    return;
  }
  
  console.log('🔍 PAGINATION RESULTS:');
  console.log(stdout);
  
  if (stderr) {
    console.error('Error output:', stderr);
  }
});