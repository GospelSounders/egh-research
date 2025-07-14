import { NextRequest, NextResponse } from 'next/server';
import { createAuthManager, createApiClient } from '@surgbc/egw-writings-shared';

export async function GET(
  request: NextRequest,
  { params }: { params: { bookId: string } }
) {
  try {
    const bookId = parseInt(params.bookId);
    
    if (isNaN(bookId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid book ID' },
        { status: 400 }
      );
    }
    
    console.log(`EGW Book API route called for book ${bookId}`);
    
    // Create auth manager and API client exactly like the downloader
    const authManager = createAuthManager();
    const apiClient = createApiClient(authManager);
    
    console.log('Getting book from EGW API...');
    const book = await apiClient.getBook(bookId);
    console.log('Book received:', book.title);
    
    return NextResponse.json({
      success: true,
      data: book
    });
    
  } catch (error) {
    console.error(`EGW Book API error for book ${params.bookId}:`, error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}