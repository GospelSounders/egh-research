import { NextRequest, NextResponse } from 'next/server';
import { readFileSync } from 'fs';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('EGW Books Categories API route called');
    
    // Parse query parameters
    const { searchParams } = request.nextUrl;
    const language = searchParams.get('language') || '';
    
    console.log(`Language filter: ${language}`);
    
    // Load books from JSON export
    const jsonPath = '/home/brian/Code/MCPSERVERS/egw-writings-mcp/data/books-export.json';
    const exportData = JSON.parse(readFileSync(jsonPath, 'utf8'));
    let books = exportData.books;
    
    // Apply language filter if provided
    if (language && language !== 'all') {
      books = books.filter((book: any) => book.lang === language);
    }
    
    // Group books by category and subcategory
    const categoryMap = new Map();
    
    for (const book of books) {
      const category = book.category || 'uncategorized';
      const subcategory = book.subcategory || 'general';
      
      const categoryKey = `${category}/${subcategory}`;
      
      if (!categoryMap.has(categoryKey)) {
        categoryMap.set(categoryKey, {
          category,
          subcategory,
          count: 0,
          books: []
        });
      }
      
      const categoryData = categoryMap.get(categoryKey);
      categoryData.count++;
      categoryData.books.push({
        book_id: book.book_id,
        title: book.title,
        author: book.author,
        pub_year: book.pub_year
      });
    }
    
    // Convert to array and organize by main categories
    const categories = Array.from(categoryMap.values());
    
    // Define category structure based on egwwritings.org
    const categoryStructure = {
      'egw': {
        name: 'Ellen G. White Writings',
        icon: '📖',
        description: 'Inspired writings of Ellen G. White',
        subcategories: ['books', 'devotional', 'manuscripts', 'letters', 'testimonies', 'pamphlets']
      },
      'pioneer': {
        name: 'Adventist Pioneers',
        icon: '🏛️',
        description: 'Historical writings by Adventist pioneers',
        subcategories: ['books', 'historical']
      },
      'periodical': {
        name: 'Historical Periodicals',
        icon: '📰',
        description: 'Early Adventist magazines and publications',
        subcategories: ['historical', 'pioneer']
      },
      'reference': {
        name: 'Reference Materials',
        icon: '📚',
        description: 'Bible study tools and reference works',
        subcategories: ['biblical', 'general']
      },
      'historical': {
        name: 'Historical Works',
        icon: '🏛️',
        description: 'Historical books and documents',
        subcategories: ['denominational', 'general']
      },
      'devotional': {
        name: 'Devotional Works',
        icon: '🕊️',
        description: 'Modern devotional and spiritual books',
        subcategories: ['modern', 'compilations']
      }
    };
    
    // Organize response
    const organizedCategories: any = {};
    
    for (const [categoryKey, categoryInfo] of Object.entries(categoryStructure)) {
      organizedCategories[categoryKey] = {
        ...categoryInfo,
        total: 0,
        subcategories: {}
      };
      
      // Initialize subcategories
      for (const subcat of categoryInfo.subcategories) {
        organizedCategories[categoryKey].subcategories[subcat] = {
          name: subcat.charAt(0).toUpperCase() + subcat.slice(1),
          count: 0,
          sampleBooks: []
        };
      }
    }
    
    // Populate with actual data
    for (const catData of categories) {
      const { category, subcategory, count, books: categoryBooks } = catData;
      
      if (organizedCategories[category]) {
        organizedCategories[category].total += count;
        
        if (organizedCategories[category].subcategories[subcategory]) {
          organizedCategories[category].subcategories[subcategory].count = count;
          organizedCategories[category].subcategories[subcategory].sampleBooks = categoryBooks.slice(0, 5);
        }
      }
    }
    
    return NextResponse.json({
      success: true,
      data: {
        categories: organizedCategories,
        summary: {
          totalBooks: books.length,
          totalCategories: Object.keys(organizedCategories).length,
          language: language || 'all'
        }
      }
    });
    
  } catch (error) {
    console.error('EGW Books Categories API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}