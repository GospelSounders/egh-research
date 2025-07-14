#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create a simple favicon.ico file (placeholder)
function createFaviconIco() {
  // This is a minimal ICO file with a 16x16 blue square
  const icoData = Buffer.from([
    0x00, 0x00, 0x01, 0x00, 0x01, 0x00, 0x10, 0x10, 0x00, 0x00, 0x01, 0x00, 0x20, 0x00, 0x68, 0x04,
    0x00, 0x00, 0x16, 0x00, 0x00, 0x00, 0x28, 0x00, 0x00, 0x00, 0x10, 0x00, 0x00, 0x00, 0x20, 0x00,
    0x00, 0x00, 0x01, 0x00, 0x20, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x00,
    0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
  ]);
  
  // Fill with blue color (0ea5e9)
  const blueColor = [0xe9, 0xa5, 0x0e, 0xff]; // BGRA format
  const pixels = Buffer.alloc(16 * 16 * 4);
  
  for (let i = 0; i < 16 * 16; i++) {
    const offset = i * 4;
    pixels[offset] = blueColor[0];     // B
    pixels[offset + 1] = blueColor[1]; // G  
    pixels[offset + 2] = blueColor[2]; // R
    pixels[offset + 3] = blueColor[3]; // A
  }
  
  return Buffer.concat([icoData, pixels]);
}

// Create a simple PNG header (placeholder - will be replaced with actual conversion)
function createPlaceholderPng(width, height, description) {
  // This is a minimal PNG structure - for production, you'd use proper PNG generation
  const pngHeader = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A // PNG signature
  ]);
  
  // Create placeholder content
  const content = `PNG placeholder for ${description} (${width}x${height})`;
  return Buffer.concat([pngHeader, Buffer.from(content)]);
}

async function createImageFiles() {
  const websitePublicDir = path.join(__dirname, '..', 'apps', 'website', 'public');
  
  try {
    // Create favicon.ico
    const faviconData = createFaviconIco();
    fs.writeFileSync(path.join(websitePublicDir, 'favicon.ico'), faviconData);
    console.log('Created favicon.ico');
    
    // Create placeholder PNG files (these should be replaced with actual conversions)
    const pngFiles = [
      { name: 'favicon-32x32.png', width: 32, height: 32, desc: 'favicon 32x32' },
      { name: 'favicon-16x16.png', width: 16, height: 16, desc: 'favicon 16x16' },
      { name: 'apple-touch-icon.png', width: 180, height: 180, desc: 'Apple touch icon' },
      { name: 'og-image.png', width: 1200, height: 630, desc: 'Open Graph image' }
    ];
    
    pngFiles.forEach(({ name, width, height, desc }) => {
      const placeholder = createPlaceholderPng(width, height, desc);
      fs.writeFileSync(path.join(websitePublicDir, name), placeholder);
      console.log(`Created placeholder ${name}`);
    });
    
    console.log('\nPlaceholder files created. For production, replace these with actual PNG conversions of the SVG files.');
    console.log('You can use online tools like:');
    console.log('- https://cloudconvert.com/svg-to-png');
    console.log('- https://convertio.co/svg-png/');
    console.log('- Or open the generated HTML files in a browser and use the download button');
    
  } catch (error) {
    console.error('Error creating image files:', error);
    process.exit(1);
  }
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  createImageFiles();
}

export { createImageFiles };