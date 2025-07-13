import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs-extra';
import path from 'path';

export interface ScrapedBook {
  id: string;
  title: string;
  author: string;
  url: string;
  chapters: ScrapedChapter[];
}

export interface ScrapedChapter {
  id: string;
  title: string;
  url: string;
  paragraphs: ScrapedParagraph[];
}

export interface ScrapedParagraph {
  id: string;
  text: string;
  reference: string;
  order: number;
}

export class EGWWebScraper {
  private baseUrl = 'https://egwwritings.org';
  private delay = 2000; // 2 seconds between requests
  private maxRetries = 3;

  /**
   * Add respectful delay between requests
   */
  private async sleep(ms: number = this.delay): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Fetch a page with retry logic
   */
  private async fetchPage(url: string, retries = this.maxRetries): Promise<string> {
    try {
      console.log(`📄 Fetching: ${url}`);
      const response = await axios.get(url, {
        timeout: 30000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (compatible; EGW-Research-Bot/1.0; Educational Use)',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Accept-Encoding': 'gzip, deflate',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1'
        }
      });
      
      await this.sleep();
      return response.data;
    } catch (error) {
      if (retries > 0) {
        console.log(`⚠️  Retrying ${url} (${retries} attempts left)`);
        await this.sleep(this.delay * 2);
        return this.fetchPage(url, retries - 1);
      }
      throw new Error(`Failed to fetch ${url}: ${error}`);
    }
  }

  /**
   * Discover available books from the website
   */
  async discoverBooks(): Promise<{ title: string; url: string; category: string }[]> {
    console.log('🔍 Discovering books on EGW Writings website...');
    
    try {
      // Try to find a sitemap or book listing page
      const mainPage = await this.fetchPage(this.baseUrl);
      const $ = cheerio.load(mainPage);
      
      // Look for book links - this is exploratory
      const bookLinks: { title: string; url: string; category: string }[] = [];
      
      // Try to find book links in the page
      $('a[href*="/book/"], a[href*="/en/book/"]').each((_, element) => {
        const $el = $(element);
        const href = $el.attr('href');
        const title = $el.text().trim();
        
        if (href && title && href.includes('/book/')) {
          const fullUrl = href.startsWith('http') ? href : `${this.baseUrl}${href}`;
          bookLinks.push({
            title,
            url: fullUrl,
            category: 'Unknown'
          });
        }
      });
      
      console.log(`📚 Found ${bookLinks.length} potential book links`);
      return bookLinks;
      
    } catch (error) {
      console.error('❌ Failed to discover books:', error);
      return [];
    }
  }

  /**
   * Test access to a known book (e.g., Great Controversy)
   */
  async testBookAccess(): Promise<boolean> {
    try {
      console.log('🧪 Testing access to a known book...');
      
      // Try a few known book URLs
      const testUrls = [
        'https://egwwritings.org/en/book/132.1', // Great Controversy
        'https://egwwritings.org/en/book/130.1', // Desire of Ages
        'https://egwwritings.org/en/book/108.1', // Steps to Christ
      ];
      
      for (const url of testUrls) {
        try {
          const content = await this.fetchPage(url);
          const $ = cheerio.load(content);
          
          // Look for content indicators
          const hasContent = $('p, .paragraph, .content').length > 0;
          const title = $('title').text() || $('h1').first().text();
          
          console.log(`✅ Successfully accessed: ${title}`);
          console.log(`📄 Content paragraphs found: ${$('p').length}`);
          
          if (hasContent) {
            console.log('✅ Book access test successful!');
            return true;
          }
        } catch (error) {
          console.log(`❌ Failed to access ${url}:`, error.message);
        }
      }
      
      return false;
    } catch (error) {
      console.error('❌ Book access test failed:', error);
      return false;
    }
  }

  /**
   * Extract content from a specific book page
   */
  async extractBookContent(url: string): Promise<ScrapedBook | null> {
    try {
      console.log(`📖 Extracting content from: ${url}`);
      
      const content = await this.fetchPage(url);
      const $ = cheerio.load(content);
      
      // Extract book metadata
      const title = $('title').text().replace(' | EGW Writings', '').trim() || 
                   $('h1').first().text().trim() ||
                   'Unknown Title';
      
      const author = 'Ellen G. White'; // Default for EGW site
      
      // Extract paragraphs
      const paragraphs: ScrapedParagraph[] = [];
      let order = 0;
      
      $('p, .paragraph, .para').each((_, element) => {
        const $el = $(element);
        const text = $el.text().trim();
        
        if (text && text.length > 10) { // Filter out very short text
          const id = $el.attr('id') || `para_${order}`;
          
          paragraphs.push({
            id,
            text,
            reference: `${title} ${order + 1}`, // Generate reference
            order: order++
          });
        }
      });
      
      if (paragraphs.length === 0) {
        console.log('⚠️  No paragraphs found, trying alternative selectors...');
        
        // Try different selectors
        $('div').each((_, element) => {
          const $el = $(element);
          const text = $el.text().trim();
          
          if (text && text.length > 50 && text.split(' ').length > 10) {
            const id = $el.attr('id') || $el.attr('class') || `div_${order}`;
            
            paragraphs.push({
              id,
              text,
              reference: `${title} ${order + 1}`,
              order: order++
            });
          }
        });
      }
      
      console.log(`📄 Extracted ${paragraphs.length} paragraphs from "${title}"`);
      
      if (paragraphs.length > 0) {
        return {
          id: url.split('/').pop() || 'unknown',
          title,
          author,
          url,
          chapters: [{
            id: 'chapter_1',
            title: title,
            url,
            paragraphs
          }]
        };
      }
      
      return null;
    } catch (error) {
      console.error(`❌ Failed to extract content from ${url}:`, error);
      return null;
    }
  }

  /**
   * Save extracted book to JSON file
   */
  async saveBook(book: ScrapedBook, outputDir = 'data/raw'): Promise<void> {
    await fs.ensureDir(outputDir);
    const filename = `${book.id.replace(/[^a-zA-Z0-9]/g, '_')}.json`;
    const filepath = path.join(outputDir, filename);
    
    await fs.writeJson(filepath, book, { spaces: 2 });
    console.log(`💾 Saved book to: ${filepath}`);
  }

  /**
   * Extract sample content for testing
   */
  async extractSampleContent(): Promise<ScrapedBook[]> {
    console.log('🎯 Extracting sample content for testing...');
    
    const sampleUrls = [
      'https://egwwritings.org/en/book/132.1', // Great Controversy Ch 1
      'https://egwwritings.org/en/book/130.1', // Desire of Ages Ch 1
      'https://egwwritings.org/en/book/108.1', // Steps to Christ Ch 1
    ];
    
    const books: ScrapedBook[] = [];
    
    for (const url of sampleUrls) {
      try {
        const book = await this.extractBookContent(url);
        if (book) {
          books.push(book);
          await this.saveBook(book);
        }
      } catch (error) {
        console.error(`❌ Failed to extract ${url}:`, error);
      }
    }
    
    console.log(`✅ Successfully extracted ${books.length} sample books`);
    return books;
  }
}

// Create default scraper instance
export const createWebScraper = (): EGWWebScraper => {
  return new EGWWebScraper();
};