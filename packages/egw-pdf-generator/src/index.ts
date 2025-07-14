#!/usr/bin/env node

import 'dotenv/config';
import { Command } from 'commander';
import { PDFGenerator } from './generators/pdf-generator.js';
import { PDFConfig, BookGenerationOptions, ResearchCompilationOptions } from './types/index.js';
import { EGWDatabase } from '@surgbc/egw-writings-shared';
import * as fs from 'fs/promises';
import * as path from 'path';

// Export classes and types for library usage
export { PDFGenerator } from './generators/pdf-generator.js';
export { PDFConfig, BookGenerationOptions, ResearchCompilationOptions, GenerationProgress } from './types/index.js';

const program = new Command();

program
  .name('egw-pdf-generator')
  .description('Generate PDFs from EGW Writings with configurable formatting')
  .version('1.0.0');

// Default PDF configuration
const defaultConfig: PDFConfig = {
  pageSize: 'A4',
  margins: {
    top: 72,
    bottom: 72,
    left: 72,
    right: 72
  },
  fontSize: 12,
  lineHeight: 1.4,
  fontFamily: 'Times',
  paragraphIds: {
    show: false,
    style: 'hidden',
    format: 'sequential'
  },
  pagination: {
    show: true,
    style: 'bottom-center',
    format: 'numeric',
    startNumber: 1
  },
  toc: {
    generate: true,
    maxDepth: 3,
    pageBreakAfter: true
  }
};

program
  .command('book')
  .description('Generate PDF for a specific book')
  .requiredOption('-b, --book-id <id>', 'Book ID to generate PDF for')
  .option('-o, --output <path>', 'Output PDF file path', './output.pdf')
  .option('-c, --config <path>', 'JSON configuration file path')
  .option('--page-size <size>', 'Page size (A4, Letter, Legal, Custom)', 'A4')
  .option('--font-size <size>', 'Font size in points', '12')
  .option('--font-family <family>', 'Font family (Times, Helvetica, Courier)', 'Times')
  .option('--no-toc', 'Disable table of contents')
  .option('--no-pagination', 'Disable page numbers')
  .option('--show-paragraph-ids', 'Show paragraph identification')
  .option('--paragraph-style <style>', 'Paragraph ID style (inline, footnote, margin)', 'hidden')
  .action(async (options) => {
    try {
      console.log(`📖 Generating PDF for book ID ${options.bookId}...`);
      
      let config = { ...defaultConfig };
      
      // Load custom config if provided
      if (options.config) {
        const customConfig = JSON.parse(await fs.readFile(options.config, 'utf8'));
        config = { ...config, ...customConfig };
      }
      
      // Apply CLI options
      config.pageSize = options.pageSize;
      config.fontSize = parseInt(options.fontSize);
      config.fontFamily = options.fontFamily;
      config.toc.generate = options.toc;
      config.pagination.show = options.pagination;
      config.paragraphIds.show = options.showParagraphIds;
      config.paragraphIds.style = options.paragraphStyle;
      
      const generator = new PDFGenerator((progress) => {
        const percentage = Math.round(progress.progress);
        const stage = progress.stage.charAt(0).toUpperCase() + progress.stage.slice(1);
        console.log(`${stage}: ${percentage}%${progress.currentChapter ? ` - ${progress.currentChapter}` : ''}`);
      });
      
      const bookOptions: BookGenerationOptions = {
        bookId: parseInt(options.bookId),
        config,
        outputPath: path.resolve(options.output)
      };
      
      await generator.generateBookPDF(bookOptions);
      generator.close();
      
      console.log(`✅ PDF generated successfully: ${options.output}`);
      
    } catch (error) {
      console.error(`❌ Error generating PDF: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

program
  .command('research')
  .description('Generate PDF from research compilation')
  .requiredOption('-q, --query <query>', 'Search query for research compilation')
  .option('-o, --output <path>', 'Output PDF file path', './research.pdf')
  .option('-c, --config <path>', 'JSON configuration file path')
  .option('--max-results <number>', 'Maximum search results to include', '50')
  .option('--languages <langs>', 'Comma-separated language codes', 'en')
  .option('--group-by <field>', 'Group results by (book, author, date, relevance)', 'book')
  .action(async (options) => {
    try {
      console.log(`🔍 Compiling research for query: "${options.query}"...`);
      
      let config = { ...defaultConfig };
      
      if (options.config) {
        const customConfig = JSON.parse(await fs.readFile(options.config, 'utf8'));
        config = { ...config, ...customConfig };
      }
      
      const generator = new PDFGenerator((progress) => {
        const percentage = Math.round(progress.progress);
        console.log(`${progress.stage}: ${percentage}%`);
      });
      
      // TODO: Implement research compilation
      console.log('🚧 Research compilation feature coming soon!');
      generator.close();
      
    } catch (error) {
      console.error(`❌ Error generating research PDF: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

program
  .command('list-books')
  .description('List available books in the database')
  .option('-l, --language <lang>', 'Filter by language code', 'en')
  .option('--limit <number>', 'Maximum books to show', '20')
  .action(async (options) => {
    try {
      const db = new EGWDatabase();
      const books = db.getBooks(options.language).slice(0, parseInt(options.limit));
      
      console.log(`📚 Available books (${books.length}):\n`);
      
      books.forEach((book: any) => {
        console.log(`ID: ${book.book_id}`);
        console.log(`Title: ${book.title}`);
        console.log(`Author: ${book.author}`);
        console.log(`Published: ${book.pub_year}`);
        console.log(`Pages: ${book.npages}`);
        console.log(`Language: ${book.lang}`);
        console.log('---');
      });
      
      db.close();
      
    } catch (error) {
      console.error(`❌ Error listing books: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

program
  .command('config')
  .description('Generate example configuration file')
  .option('-o, --output <path>', 'Configuration file output path', './pdf-config.json')
  .action(async (options) => {
    try {
      await fs.writeFile(options.output, JSON.stringify(defaultConfig, null, 2));
      console.log(`✅ Example configuration saved to: ${options.output}`);
      console.log('\n📖 You can customize this file and use it with --config option');
      
    } catch (error) {
      console.error(`❌ Error creating config: ${error instanceof Error ? error.message : String(error)}`);
      process.exit(1);
    }
  });

// Only run CLI when this module is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  program.parse();
}