#!/usr/bin/env node

import 'dotenv/config';
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { createAuthManager, createApiClient } from '@gospelsounders/egw-writings-shared';

const server = new Server(
  {
    name: 'egw-writings-api-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Initialize API client
const authManager = createAuthManager();
const apiClient = createApiClient(authManager);

// List available tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'search_writings',
        description: 'Search Ellen G. White writings and Adventist literature',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query text',
            },
            language: {
              type: 'string',
              description: 'Language code (default: en)',
              default: 'en',
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
        name: 'get_book_details',
        description: 'Get detailed information about a specific book',
        inputSchema: {
          type: 'object',
          properties: {
            bookId: {
              type: 'number',
              description: 'Book ID from search results',
            },
          },
          required: ['bookId'],
        },
      },
      {
        name: 'get_book_content',
        description: 'Get chapter content from a book',
        inputSchema: {
          type: 'object',
          properties: {
            bookId: {
              type: 'number',
              description: 'Book ID',
            },
            chapterId: {
              type: 'number',
              description: 'Chapter ID (optional - gets first chapter if not specified)',
            },
            limit: {
              type: 'number',
              description: 'Maximum paragraphs to return (default: 50)',
              default: 50,
            },
          },
          required: ['bookId'],
        },
      },
      {
        name: 'list_languages',
        description: 'Get available languages for EGW writings',
        inputSchema: {
          type: 'object',
          properties: {},
        },
      },
      {
        name: 'list_books',
        description: 'List books in a specific language and category',
        inputSchema: {
          type: 'object',
          properties: {
            language: {
              type: 'string',
              description: 'Language code (default: en)',
              default: 'en',
            },
            folderId: {
              type: 'number',
              description: 'Folder ID to filter books (optional)',
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
        name: 'get_suggestions',
        description: 'Get search suggestions for a partial query',
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Partial search query',
            },
          },
          required: ['query'],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  try {
    switch (request.params.name) {
      case 'search_writings': {
        const { query, language = 'en', limit = 20, offset = 0 } = request.params.arguments as {
          query: string;
          language?: string;
          limit?: number;
          offset?: number;
        };

        const results = await apiClient.search(query, {
          lang: [language],
          limit,
          offset,
        });

        return {
          content: [
            {
              type: 'text',
              text: `Found ${results.total} results for "${query}"\n\n${results.results
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

      case 'get_book_details': {
        const { bookId } = request.params.arguments as { bookId: number };
        const book = await apiClient.getBook(bookId);

        return {
          content: [
            {
              type: 'text',
              text: `**${book.title}**\n\n` +
                   `Author: ${book.author}\n` +
                   `Published: ${book.pub_year}\n` +
                   `Publisher: ${book.publisher}\n` +
                   `Pages: ${book.npages}\n` +
                   `Language: ${book.lang}\n` +
                   `ISBN: ${book.isbn || 'N/A'}\n\n` +
                   `**Description:**\n${book.description}\n\n` +
                   `**Citation:** ${book.cite}`,
            },
          ],
        };
      }

      case 'get_book_content': {
        const { bookId, chapterId, limit = 50 } = request.params.arguments as {
          bookId: number;
          chapterId?: number;
          limit?: number;
        };

        let targetChapterId = chapterId;
        
        // If no chapter specified, get table of contents and use first chapter
        if (!targetChapterId) {
          const toc = await apiClient.getBookToc(bookId);
          if (toc.length === 0) {
            throw new Error('No chapters found in this book');
          }
          targetChapterId = toc[0].id;
        }

        const paragraphs = await apiClient.getChapter(bookId, targetChapterId);
        const book = await apiClient.getBook(bookId);

        const content = paragraphs
          .slice(0, limit)
          .map(p => {
            const cleanContent = p.content.replace(/<[^>]*>/g, '').trim();
            return `**${p.refcode_short || ''}**\n${cleanContent}`;
          })
          .join('\n\n');

        return {
          content: [
            {
              type: 'text',
              text: `**Content from: ${book.title}**\n\n${content}`,
            },
          ],
        };
      }

      case 'list_languages': {
        const languages = await apiClient.getLanguages();

        return {
          content: [
            {
              type: 'text',
              text: `**Available Languages (${languages.length})**\n\n${languages
                .slice(0, 20)
                .map(lang => `• ${lang.name || lang.code} (${lang.code})`)
                .join('\n')}\n\n${languages.length > 20 ? `... and ${languages.length - 20} more` : ''}`,
            },
          ],
        };
      }

      case 'list_books': {
        const { language = 'en', folderId, limit = 50 } = request.params.arguments as {
          language?: string;
          folderId?: number;
          limit?: number;
        };

        // Get folders first to find books
        const folders = await apiClient.getFolders(language);
        
        // If no specific folder, find EGW writings folder
        let targetFolderId = folderId;
        if (!targetFolderId) {
          const egwFolder = folders.find(f => f.children?.find(c => c.name === 'Books'))?.children?.find(c => c.name === 'Books');
          if (egwFolder) {
            targetFolderId = egwFolder.folder_id;
          } else {
            throw new Error('Could not find books folder');
          }
        }

        const books = await apiClient.getBooksByFolder(targetFolderId);

        return {
          content: [
            {
              type: 'text',
              text: `**Books Available (${books.length})**\n\n${books
                .slice(0, limit)
                .map(book => `• **${book.title}** by ${book.author} (ID: ${book.book_id})\n  ${book.npages} pages, ${book.pub_year}`)
                .join('\n\n')}\n\n${books.length > limit ? `... and ${books.length - limit} more` : ''}`,
            },
          ],
        };
      }

      case 'get_suggestions': {
        const { query } = request.params.arguments as { query: string };
        const suggestions = await apiClient.getSearchSuggestions(query);

        return {
          content: [
            {
              type: 'text',
              text: suggestions.length > 0 
                ? `**Search suggestions for "${query}":**\n\n${suggestions.map(s => `• ${s}`).join('\n')}`
                : `No suggestions found for "${query}"`,
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
  console.error('EGW Writings API MCP server running on stdio');
}

main().catch(console.error);