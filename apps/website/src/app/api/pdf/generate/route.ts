import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { bookId, config } = await request.json();
    
    console.log('PDF generation request for book:', bookId);
    console.log('Config:', config);
    
    // Load books from JSON export
    const jsonPath = '/home/brian/Code/MCPSERVERS/egw-writings-mcp/data/books-export.json';
    const exportData = JSON.parse(readFileSync(jsonPath, 'utf8'));
    
    // Find the book
    const book = exportData.books.find((b: any) => b.book_id === bookId);
    if (!book) {
      return NextResponse.json(
        { success: false, error: 'Book not found' },
        { status: 404 }
      );
    }
    
    // For now, simulate PDF generation process
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // In a real implementation, this would:
    // 1. Fetch book content from EGW API or database
    // 2. Use @surgbc/egw-pdf-generator to create PDF
    // 3. Save PDF to temporary storage
    // 4. Return download URL
    
    const pdfUrl = `/api/pdf/download/${bookId}?config=${encodeURIComponent(JSON.stringify(config))}`;
    
    return NextResponse.json({
      success: true,
      message: 'PDF generated successfully',
      downloadUrl: pdfUrl,
      filename: `${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
    });
    
  } catch (error) {
    console.error('PDF generation error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'PDF generation failed' 
      },
      { status: 500 }
    );
  }
}