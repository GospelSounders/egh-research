import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';
import path from 'path';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('EGW Books API route called - using JSON export');
    
    // Parse query parameters
    const { searchParams } = request.nextUrl;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const search = searchParams.get('search') || '';
    const category = searchParams.get('category') || '';
    const language = searchParams.get('language') || '';
    
    console.log(`Query params: page=${page}, limit=${limit}, search="${search}", category="${category}", language="${language}"`);
    
    // Load books from JSON export
    const jsonPath = '/home/brian/Code/MCPSERVERS/egw-writings-mcp/data/books-export.json';
    console.log('Loading books from JSON export:', jsonPath);
    
    const exportData = JSON.parse(readFileSync(jsonPath, 'utf8'));
    let books = exportData.books;
    console.log(`Total books in export: ${books.length}`);
    
    // Apply language filter if provided
    if (language && language !== 'all') {
      books = books.filter((book: any) => book.lang === language);
      console.log(`After language filter: ${books.length} books`);
    }
    
    // Apply search filter if provided
    if (search) {
      books = books.filter((book: any) => 
        book.title.toLowerCase().includes(search.toLowerCase()) ||
        book.author.toLowerCase().includes(search.toLowerCase()) ||
        book.description?.toLowerCase().includes(search.toLowerCase())
      );
      console.log(`After search filter: ${books.length} books`);
    }
    
    // Apply category filter if provided
    if (category && category !== 'all') {
      // Handle category/subcategory format
      if (category.includes('/')) {
        const [mainCategory, subCategory] = category.split('/');
        books = books.filter((book: any) => 
          book.category === mainCategory && book.subcategory === subCategory
        );
      } else {
        books = books.filter((book: any) => book.category === category);
      }
      console.log(`After category filter: ${books.length} books`);
    }
    
    // Calculate offset for pagination
    const offset = (page - 1) * limit;
    
    // Apply pagination
    const totalBooks = books.length;
    const paginatedBooks = books.slice(offset, offset + limit);
    console.log(`Returning ${paginatedBooks.length} books (page ${page} of ${Math.ceil(totalBooks / limit)})`);
    
    return NextResponse.json({
      success: true,
      data: paginatedBooks,
      total: totalBooks,
      page: page,
      limit: limit,
      totalPages: Math.ceil(totalBooks / limit)
    });
    
  } catch (error) {
    console.error('EGW Books API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}