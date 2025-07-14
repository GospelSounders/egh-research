import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { bookId: string } }) {
  try {
    const bookId = parseInt(params.bookId);
    const { searchParams } = request.nextUrl;
    const chapter = searchParams.get('chapter');
    
    console.log(`Fetching content for book ${bookId}, chapter: ${chapter}`);
    
    // Load books from JSON export to get book info
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
    
    // Check if we have a content file for this book
    try {
      const contentPath = `/home/brian/Code/MCPSERVERS/egw-writings-mcp/data/content/${bookId}.json`;
      const contentData = JSON.parse(readFileSync(contentPath, 'utf8'));
      
      // If specific chapter requested, return only that chapter
      if (chapter) {
        const requestedChapter = contentData.chapters.find((ch: any) => ch.chapter === parseInt(chapter));
        if (requestedChapter) {
          return NextResponse.json({
            success: true,
            data: requestedChapter,
            available: true
          });
        } else {
          return NextResponse.json({
            success: false,
            error: `Chapter ${chapter} not found`,
            available: true
          });
        }
      }
      
      // Return all chapters
      return NextResponse.json({
        success: true,
        data: contentData,
        available: true
      });
      
    } catch (contentError) {
      // Content file doesn't exist, return indication that content needs to be downloaded
      return NextResponse.json({
        success: false,
        error: 'Book content not downloaded yet',
        message: `Content for "${book.title}" needs to be downloaded from EGW API`,
        available: false,
        book: {
          id: book.book_id,
          title: book.title,
          author: book.author,
          pages: book.npages
        }
      });
    }
    
  } catch (error) {
    console.error('Book content API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to load book content',
        available: false
      },
      { status: 500 }
    );
  }
}