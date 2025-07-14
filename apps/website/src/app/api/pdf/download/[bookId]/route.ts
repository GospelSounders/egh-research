import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { bookId: string } }) {
  try {
    const bookId = parseInt(params.bookId);
    
    console.log(`Generating PDF for book ${bookId}...`);
    
    // Get content from database using our script
    const scriptPath = '/home/brian/Code/MCPSERVERS/egw-writings-mcp/scripts/get-book-content.js';
    
    const content = await new Promise<any>((resolve, reject) => {
      const child = spawn('node', [scriptPath, bookId.toString()]);
      let output = '';
      let error = '';
      
      child.stdout.on('data', (data) => {
        output += data.toString();
      });
      
      child.stderr.on('data', (data) => {
        error += data.toString();
      });
      
      child.on('close', (code) => {
        if (code === 0) {
          try {
            const result = JSON.parse(output);
            resolve(result);
          } catch (parseError) {
            reject(new Error('Failed to parse database response'));
          }
        } else {
          reject(new Error(error || 'Database query failed'));
        }
      });
    });
    
    if (!content.success) {
      return NextResponse.json(
        { success: false, error: content.error || 'Book not found' },
        { status: 404 }
      );
    }
    
    const book = content.data;
    
    // Create a PDF with actual content
    let pdfText = `${book.title}\nby ${book.author}\n\n`;
    
    // Add chapters
    for (const chapter of book.chapters) {
      pdfText += `${chapter.title}\n\n`;
      for (const paragraph of chapter.paragraphs) {
        // Strip HTML and add plain text
        const plainText = paragraph.content_plain || paragraph.content.replace(/<[^>]*>/g, '');
        pdfText += `${plainText}\n\n`;
      }
      pdfText += '\n---\n\n';
    }
    
    // For now, return plain text
    // In a real implementation, you'd use a PDF library like PDFKit or Puppeteer
    const filename = `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    
    return new NextResponse(pdfText, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfText.length.toString(),
      },
    });
    
  } catch (error) {
    console.error('PDF download error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'PDF download failed' 
      },
      { status: 500 }
    );
  }
}