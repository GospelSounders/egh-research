#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Simple SVG to PNG conversion using HTML Canvas (for Node.js)
const convertSvgToPng = async (svgPath, pngPath, width, height) => {
  try {
    // For Node.js environment, we'll create a simple HTML file that can be opened in a browser
    // to manually convert SVG to PNG, or use a proper conversion tool
    
    const svgContent = fs.readFileSync(svgPath, 'utf8');
    
    // Create HTML file for manual conversion
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>SVG to PNG Converter</title>
    <style>
        body { margin: 0; padding: 20px; background: #f0f0f0; }
        .container { text-align: center; }
        svg { border: 1px solid #ccc; background: white; }
        .instructions { margin: 20px 0; font-family: Arial, sans-serif; }
    </style>
</head>
<body>
    <div class="container">
        <h2>SVG to PNG Converter</h2>
        <div class="instructions">
            <p>Right-click on the SVG below and select "Save as Image" or take a screenshot</p>
            <p>Save as: ${path.basename(pngPath)}</p>
            <p>Recommended size: ${width}x${height}px</p>
        </div>
        ${svgContent}
    </div>
    
    <script>
        // Auto-download functionality (may require user interaction)
        function downloadSvgAsPng() {
            const svg = document.querySelector('svg');
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            canvas.width = ${width};
            canvas.height = ${height};
            
            const img = new Image();
            const svgData = new XMLSerializer().serializeToString(svg);
            const svgBlob = new Blob([svgData], {type: 'image/svg+xml;charset=utf-8'});
            const svgUrl = URL.createObjectURL(svgBlob);
            
            img.onload = function() {
                ctx.drawImage(img, 0, 0, ${width}, ${height});
                
                canvas.toBlob(function(blob) {
                    const link = document.createElement('a');
                    link.download = '${path.basename(pngPath)}';
                    link.href = URL.createObjectURL(blob);
                    link.click();
                }, 'image/png');
                
                URL.revokeObjectURL(svgUrl);
            };
            
            img.src = svgUrl;
        }
        
        // Add download button
        const button = document.createElement('button');
        button.textContent = 'Download as PNG';
        button.style.cssText = 'padding: 10px 20px; font-size: 16px; margin: 20px; cursor: pointer;';
        button.onclick = downloadSvgAsPng;
        document.querySelector('.container').appendChild(button);
    </script>
</body>
</html>`;
    
    const htmlPath = pngPath.replace('.png', '.html');
    fs.writeFileSync(htmlPath, htmlContent);
    
    console.log(`Created HTML converter: ${htmlPath}`);
    console.log(`Open this file in a browser and click "Download as PNG" to generate ${pngPath}`);
    
    return htmlPath;
  } catch (error) {
    console.error('Error converting SVG to PNG:', error);
    throw error;
  }
};

async function generateImages() {
  const websitePublicDir = path.join(__dirname, '..', 'apps', 'website', 'public');
  
  try {
    // Create favicon PNG (32x32)
    await convertSvgToPng(
      path.join(websitePublicDir, 'icon.svg'),
      path.join(websitePublicDir, 'favicon-32x32.png'),
      32,
      32
    );
    
    // Create favicon PNG (16x16)
    await convertSvgToPng(
      path.join(websitePublicDir, 'icon.svg'),
      path.join(websitePublicDir, 'favicon-16x16.png'),
      16,
      16
    );
    
    // Create Apple touch icon (180x180)
    await convertSvgToPng(
      path.join(websitePublicDir, 'icon.svg'),
      path.join(websitePublicDir, 'apple-touch-icon.png'),
      180,
      180
    );
    
    // Create OG image (1200x630)
    await convertSvgToPng(
      path.join(websitePublicDir, 'og-image.svg'),
      path.join(websitePublicDir, 'og-image.png'),
      1200,
      630
    );
    
    console.log('Image generation HTML files created successfully!');
    console.log('Open the generated HTML files in a browser to download the PNG images.');
    
  } catch (error) {
    console.error('Error generating images:', error);
    process.exit(1);
  }
}

// Run if this is the main module
if (import.meta.url === `file://${process.argv[1]}`) {
  generateImages();
}

export { generateImages, convertSvgToPng };