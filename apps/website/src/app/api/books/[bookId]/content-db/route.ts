import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import { promisify } from 'util';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: { bookId: string } }): Promise<NextResponse> {
  try {
    const bookId = parseInt(params.bookId);
    const { searchParams } = request.nextUrl;
    const chapter = searchParams.get('chapter');
    
    console.log(`Fetching content from database for book ${bookId}, chapter: ${chapter}`);
    
    // Use a Node.js script to query the database (to avoid Next.js issues with better-sqlite3)
    const scriptPath = '/home/brian/Code/MCPSERVERS/egw-writings-mcp/scripts/get-book-content.js';
    
    return new Promise<NextResponse>((resolve) => {
      const args = [scriptPath, bookId.toString()];
      if (chapter) args.push(chapter);
      
      const child = spawn('node', args);
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
            resolve(NextResponse.json(result));
          } catch (parseError) {
            resolve(NextResponse.json({
              success: false,
              error: 'Failed to parse database response',
              available: false
            }));
          }
        } else {
          resolve(NextResponse.json({
            success: false,
            error: error || 'Database query failed',
            available: false
          }));
        }
      });
    });
    
  } catch (error) {
    console.error('Content DB API error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to load content from database',
        available: false
      },
      { status: 500 }
    );
  }
}