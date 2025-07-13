#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { EGWDatabase } from '@surgbc/egw-writings-shared';

const server = new Server(
  {
    name: 'egw-writings-local-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize database
const db = new EGWDatabase();

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_local',
        description: 'Search locally indexed EGW writings with full-text search',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query text (supports FTS5 syntax)',
            },
            limit: {
              type: 'number',
              description: 'Maximum number of results (default: 20)',
              default: 20,
            },
            offset: {
              type: 'number',
              description: 'Result offset for pagination (default: 0)',
              default: 0,
            },
          },
          required: ['query'],
        },
      },
      {
        name: 'get_local_book',
        description: 'Get book information from local database',
        inputSchema: {
          type: 'object',
          properties: {
            bookId: {
              type: 'number',
              description: 'Book ID',
            },
          },
          required: ['bookId'],
        },
      },
      {
        name: 'get_local_content',
        description: 'Get paragraphs from a book in the local database',
        inputSchema: {
          type: 'object',
          properties: {
            bookId: {
              type: 'number',
              description: 'Book ID',
            },
            limit: {
              type: 'number',
              description: 'Maximum paragraphs to return (default: 50)',
              default: 50,
            },
            offset: {
              type: 'number',
              description: 'Paragraph offset (default: 0)',
              default: 0,
            },
          },
          required: ['bookId'],
        },
      },
      {
        name: 'list_local_books',
        description: 'List books available in local database',
        inputSchema: {
          type: 'object',
          properties: {
            language: {
              type: 'string',
              description: 'Filter by language code (optional)',
            },
            author: {
              type: 'string',
              description: 'Filter by author (optional)',
            },
            limit: {
              type: 'number',
              description: 'Maximum books to return (default: 50)',
              default: 50,
            },
          },
        },
      },
      {
        name: 'get_database_stats',
        description: 'Get statistics about the local database',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'browse_by_reference',
        description: 'Find content by EGW reference (e.g., "AA 15.1", "GC 123")',
        inputSchema: {
          type: 'object',
          properties: {
            reference: {
              type: 'string',
              description: 'EGW reference code (e.g., "AA 15.1", "DA 123", "GC 45.2")',
            },
          },
          required: ['reference'],
        },
      },
      {
        name: 'get_context',
        description: 'Get surrounding paragraphs for better context',
        inputSchema: {
          type: 'object',
          properties: {
            paraId: {
              type: 'string',
              description: 'Paragraph ID',
            },
            before: {
              type: 'number',
              description: 'Number of paragraphs before (default: 2)',
              default: 2,
            },
            after: {
              type: 'number',
              description: 'Number of paragraphs after (default: 2)',
              default: 2,
            },
          },
          required: ['paraId'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case 'search_local': {
        const { query, limit = 20, offset = 0 } = request.params.arguments as {
          query: string;
          limit?: number;
          offset?: number;
        };

        const results = db.search(query, limit, offset);
        const totalCount = db.searchCount(query);

        return {
          content: [
            {
              type: 'text',
              text: `Found ${totalCount} results for "${query}" (showing ${results.length})\n\n${results
                .map((hit, i) => 
                  `${offset + i + 1}. **${hit.refcode_short}** (${hit.pub_year})\n` +
                  `   ${hit.snippet}\n` +
                  `   Source: ${hit.pub_name}\n`
                )
                .join('\n')}`,
            },
          ],
        };
      }

      case 'get_local_book': {
        const { bookId } = request.params.arguments as { bookId: number };
        const book = db.getBook(bookId);

        if (!book) {
          throw new Error(`Book ${bookId} not found in local database`);
        }

        const typedBook = book as any;
        const translatedInto = typedBook.translated_into ? JSON.parse(typedBook.translated_into) : [];

        return {
          content: [
            {
              type: 'text',
              text: `**${typedBook.title}**\n\n` +
                   `Author: ${typedBook.author}\n` +
                   `Published: ${typedBook.pub_year}\n` +
                   `Publisher: ${typedBook.publisher}\n` +
                   `Pages: ${typedBook.npages}\n` +
                   `Language: ${typedBook.lang}\n` +
                   `Code: ${typedBook.code}\n` +
                   `ISBN: ${typedBook.isbn || 'N/A'}\n` +
                   `Available translations: ${translatedInto.length} languages\n\n` +
                   `**Description:**\n${typedBook.description}\n\n` +
                   `**Citation:** ${typedBook.cite}`,
            },
          ],
        };
      }

      case 'get_local_content': {
        const { bookId, limit = 50, offset = 0 } = request.params.arguments as {
          bookId: number;
          limit?: number;
          offset?: number;
        };

        const book = db.getBook(bookId);
        if (!book) {
          throw new Error(`Book ${bookId} not found`);
        }

        const paragraphs = db.getParagraphs(bookId, limit, offset);

        const content = paragraphs
          .map((p: any) => {
            const cleanContent = p.content.replace(/<[^>]*>/g, '').trim();
            return `**${p.refcode_short || ''}**\n${cleanContent}`;
          })
          .join('\n\n');

        const typedBook = book as any;
        return {
          content: [
            {
              type: 'text',
              text: `**Content from: ${typedBook.title}** (${paragraphs.length} paragraphs)\n\n${content}`,
            },
          ],
        };
      }

      case 'list_local_books': {
        const { language, limit = 50 } = request.params.arguments as {
          language?: string;
          author?: string;
          limit?: number;
        };

        const books = db.getBooks(language).slice(0, limit);

        return {
          content: [
            {
              type: 'text',
              text: `**Local Books Available (${books.length})**\n\n${books
                .map((book: any) => `• **${book.title}** by ${book.author} (ID: ${book.book_id})\n  ${book.npages} pages, ${book.pub_year}, Language: ${book.lang}`)
                .join('\n\n')}`,
            },
          ],
        };
      }

      case 'get_database_stats': {
        const stats = db.getStats();

        return {
          content: [
            {
              type: 'text',
              text: `**Local Database Statistics**\n\n` +
                   `📚 Languages: ${stats.languages}\n` +
                   `📖 Books: ${stats.books}\n` +
                   `💾 Downloaded Books: ${stats.downloadedBooks}\n` +
                   `📄 Paragraphs: ${stats.paragraphs.toLocaleString()}\n\n` +
                   `**Search Capabilities**: Full-text search with FTS5\n` +
                   `**Performance**: Local database, no API rate limits`,
            },
          ],
        };
      }

      case 'browse_by_reference': {
        const { reference } = request.params.arguments as { reference: string };

        // Use FTS to search for the reference
        const results = db.search(`refcode_short:"${reference}"`, 5, 0);

        if (results.length === 0) {
          // Try broader search
          const parts = reference.split(/[\s\.]/);
          if (parts.length > 0) {
            const broaderResults = db.search(`refcode_short:${parts[0]}*`, 10, 0);
            
            return {
              content: [
                {
                  type: 'text',
                  text: `Reference "${reference}" not found. Similar references:\n\n${broaderResults
                    .map(hit => `• ${hit.refcode_short}: ${hit.snippet}`)
                    .join('\n')}`,
                },
              ],
            };
          }
          
          throw new Error(`Reference "${reference}" not found`);
        }

        const hit = results[0];
        return {
          content: [
            {
              type: 'text',
              text: `**${hit.refcode_long}**\n\n${hit.snippet}\n\n*Source: ${hit.pub_name} (${hit.pub_year})*`,
            },
          ],
        };
      }

      case 'get_context': {
        const { paraId, before = 2, after = 2 } = request.params.arguments as {
          paraId: string;
          before?: number;
          after?: number;
        };

        // This is a simplified implementation - in practice you'd need to 
        // implement proper paragraph ordering and navigation
        const results = db.search(`para_id:"${paraId}"`, 1, 0);
        
        if (results.length === 0) {
          throw new Error(`Paragraph ${paraId} not found`);
        }

        const hit = results[0];
        
        // For now, just return the found paragraph
        // In a full implementation, you'd query for surrounding paragraphs
        return {
          content: [
            {
              type: 'text',
              text: `**Context for ${hit.refcode_short}**\n\n` +
                   `${hit.snippet}\n\n` +
                   `*Note: Full context navigation requires additional implementation*`,
            },
          ],
        };
      }

      default:
        throw new Error(`Unknown tool: ${request.params.name}`);
    }
  } catch (error) {
    return {
      content: [
        {
          type: 'text',
          text: `Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
        },
      ],
      isError: true,
    };
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('EGW Writings Local MCP server running on stdio');
}

main().catch(console.error);