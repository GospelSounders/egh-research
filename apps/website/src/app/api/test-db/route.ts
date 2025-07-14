import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    console.log('Testing simple database connection...');
    
    // Use dynamic import to avoid compile-time issues
    const { EGWDatabase } = await import('@surgbc/egw-writings-shared');
    
    console.log('Module imported successfully');
    
    const db = new EGWDatabase({ 
      dbPath: '/home/brian/Code/MCPSERVERS/egw-writings-mcp/data/egw-writings.db' 
    });
    
    console.log('Database created successfully');
    
    const stats = db.getStats();
    console.log('Stats retrieved:', stats);
    
    db.close();
    
    return NextResponse.json({
      success: true,
      data: stats
    });
    
  } catch (error) {
    console.error('Test DB API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}