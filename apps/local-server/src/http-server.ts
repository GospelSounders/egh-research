import express from 'express';
import cors from 'cors';
import compression from 'compression';
import { v4 as uuidv4 } from 'uuid';
import { EGWDatabase } from '@surgbc/egw-writings-shared';
import { PDFGenerator, PDFConfig, GenerationProgress } from '@surgbc/egw-pdf-generator';
import type { SearchHit, Book } from '@surgbc/egw-writings-shared';

export interface PDFGenerationJob {
  id: string;
  bookId: number;
  config: PDFConfig;
  options: any;
  status: 'queued' | 'generating' | 'completed' | 'failed';
  progress: number;
  stage: string;
  currentChapter?: string;
  totalChapters?: number;
  estimatedTimeRemaining?: number;
  filePath?: string;
  error?: string;
  createdAt: Date;
  completedAt?: Date;
}

export class HTTPServer {
  private app: express.Application;
  private db: EGWDatabase;
  private pdfJobs: Map<string, PDFGenerationJob> = new Map();
  private port: number;

  constructor(port: number = 3000) {
    this.app = express();
    this.db = new EGWDatabase();
    this.port = port;
    this.setupMiddleware();
    this.setupRoutes();
    this.setupCleanupJob();
  }

  private setupMiddleware(): void {
    this.app.use(compression());
    this.app.use(cors());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true }));
  }

  private setupRoutes(): void {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        database: this.db.getStats()
      });
    });

    // API Documentation
    this.app.get('/api/docs', (req, res) => {
      res.json({
        name: 'EGH Research API',
        version: '1.0.0',
        description: 'Local offline API for EGH (Ellen Gould Harmon) research with PDF generation',
        endpoints: {
          'GET /content/books': 'List books with pagination',
          'GET /content/books/:id': 'Get specific book details',
          'GET /content/books/:id/toc': 'Get book table of contents',
          'GET /content/books/:id/chapters/:chapter': 'Get chapter content',
          'POST /content/books/:id/generate-pdf': 'Generate PDF with custom settings',
          'GET /pdf/status/:token': 'Check PDF generation status',
          'GET /pdf/download/:token': 'Download generated PDF',
          'GET /search': 'Search content',
          'GET /stats': 'Database statistics'
        }
      });
    });

    // Books listing with pagination (compatible with a.egwwritings.org)
    this.app.get('/content/books', (req, res) => {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 100;
        const lang = req.query.lang as string || 'en';
        const folder = req.query.folder as string;
        
        const offset = (page - 1) * limit;
        const totalBooks = this.db.getBookCount(lang);
        const books = this.db.getBooks(lang, limit, offset) as Book[];
        
        // Calculate pagination
        const totalPages = Math.ceil(totalBooks / limit);
        const hasNext = page < totalPages;
        const hasPrevious = page > 1;
        
        const baseUrl = `${req.protocol}://${req.get('host')}${req.path}`;
        const queryParams = new URLSearchParams({
          lang,
          limit: limit.toString(),
          ...(folder && { folder })
        });
        
        res.json({
          count: totalBooks,
          ipp: limit,
          next: hasNext ? `${baseUrl}?${queryParams}&page=${page + 1}` : null,
          previous: hasPrevious ? `${baseUrl}?${queryParams}&page=${page - 1}` : null,
          results: books.map(book => ({
            ...book,
            // Add file info for compatibility
            files: {
              pdf: `/content/books/${book.book_id}/generate-pdf`,
              download: `/content/books/${book.book_id}/download`
            }
          }))
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch books' });
      }
    });

    // Get specific book
    this.app.get('/content/books/:id', (req, res) => {
      try {
        const bookId = parseInt(req.params.id);
        const book = this.db.getBook(bookId) as Book | null;
        
        if (!book) {
          return res.status(404).json({ error: 'Book not found' });
        }
        
        res.json({
          ...book,
          files: {
            pdf: `/content/books/${bookId}/generate-pdf`,
            download: `/content/books/${bookId}/download`
          }
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch book' });
      }
    });

    // Get book table of contents
    this.app.get('/content/books/:id/toc', (req, res) => {
      try {
        const bookId = parseInt(req.params.id);
        const book = this.db.getBook(bookId) as Book | null;
        
        if (!book) {
          return res.status(404).json({ error: 'Book not found' });
        }
        
        // Get chapters by analyzing paragraph structure
        const paragraphs = this.db.getParagraphs(bookId);
        const chapters = this.extractChapters(paragraphs);
        
        res.json({
          book_id: bookId,
          title: book.title,
          chapters: chapters
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch table of contents' });
      }
    });

    // Get chapter content
    this.app.get('/content/books/:id/chapters/:chapter', (req, res) => {
      try {
        const bookId = parseInt(req.params.id);
        const chapterNum = parseInt(req.params.chapter);
        
        const paragraphs = this.db.getParagraphs(bookId);
        const chapters = this.extractChapters(paragraphs);
        
        if (chapterNum < 1 || chapterNum > chapters.length) {
          return res.status(404).json({ error: 'Chapter not found' });
        }
        
        const chapter = chapters[chapterNum - 1];
        res.json({
          chapter_number: chapterNum,
          title: chapter.title,
          content: chapter.content,
          paragraphs: chapter.paragraphs
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to fetch chapter content' });
      }
    });

    // Generate PDF
    this.app.post('/content/books/:id/generate-pdf', (req, res) => {
      try {
        const bookId = parseInt(req.params.id);
        const { config, options } = req.body;
        
        const book = this.db.getBook(bookId) as Book | null;
        if (!book) {
          return res.status(404).json({ error: 'Book not found' });
        }
        
        const jobId = uuidv4();
        const job: PDFGenerationJob = {
          id: jobId,
          bookId,
          config: config || this.getDefaultPDFConfig(),
          options: options || {},
          status: 'queued',
          progress: 0,
          stage: 'queued',
          createdAt: new Date()
        };
        
        this.pdfJobs.set(jobId, job);
        
        // Start PDF generation asynchronously
        this.generatePDF(job);
        
        res.json({
          token: jobId,
          status: 'queued',
          message: 'PDF generation started',
          statusUrl: `/pdf/status/${jobId}`,
          downloadUrl: `/pdf/download/${jobId}`
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to start PDF generation' });
      }
    });

    // Get PDF generation status
    this.app.get('/pdf/status/:token', (req, res) => {
      const token = req.params.token;
      const job = this.pdfJobs.get(token);
      
      if (!job) {
        return res.status(404).json({ error: 'PDF generation job not found' });
      }
      
      res.json({
        token,
        status: job.status,
        progress: job.progress,
        stage: job.stage,
        currentChapter: job.currentChapter,
        totalChapters: job.totalChapters,
        estimatedTimeRemaining: job.estimatedTimeRemaining,
        error: job.error,
        createdAt: job.createdAt,
        completedAt: job.completedAt
      });
    });

    // Download generated PDF
    this.app.get('/pdf/download/:token', (req, res) => {
      const token = req.params.token;
      const job = this.pdfJobs.get(token);
      
      if (!job) {
        return res.status(404).json({ error: 'PDF generation job not found' });
      }
      
      if (job.status !== 'completed') {
        return res.status(400).json({ 
          error: 'PDF not ready', 
          status: job.status,
          progress: job.progress 
        });
      }
      
      if (!job.filePath) {
        return res.status(500).json({ error: 'PDF file not found' });
      }
      
      // Send file with proper headers
      const book = this.db.getBook(job.bookId) as Book;
      const filename = `${book.code || book.book_id}_${book.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
      
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      res.sendFile(job.filePath, (err) => {
        if (err) {
          console.error('Error sending PDF:', err);
        }
        // Clean up file after download
        this.cleanupPDFJob(token);
      });
    });

    // Search content
    this.app.get('/search', (req, res) => {
      try {
        const query = req.query.q as string || req.query.query as string;
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = parseInt(req.query.offset as string) || 0;
        
        if (!query) {
          return res.status(400).json({ error: 'Query parameter required' });
        }
        
        const results = this.db.search(query, limit, offset) as SearchHit[];
        const totalCount = this.db.searchCount(query);
        
        res.json({
          query,
          total: totalCount,
          limit,
          offset,
          results: results.map(hit => ({
            book_id: hit.book_id,
            title: hit.pub_name,
            author: hit.author,
            reference: hit.refcode_short,
            snippet: hit.snippet,
            url: `/content/books/${hit.book_id}`
          }))
        });
      } catch (error) {
        res.status(500).json({ error: 'Search failed' });
      }
    });

    // Database statistics
    this.app.get('/stats', (req, res) => {
      try {
        const stats = this.db.getStats();
        res.json({
          ...stats,
          pdfJobs: {
            total: this.pdfJobs.size,
            active: Array.from(this.pdfJobs.values()).filter(job => 
              job.status === 'queued' || job.status === 'generating'
            ).length,
            completed: Array.from(this.pdfJobs.values()).filter(job => 
              job.status === 'completed'
            ).length
          }
        });
      } catch (error) {
        res.status(500).json({ error: 'Failed to get statistics' });
      }
    });

    // 404 handler
    this.app.use((req, res) => {
      res.status(404).json({ error: 'Endpoint not found' });
    });
  }

  private async generatePDF(job: PDFGenerationJob): Promise<void> {
    try {
      job.status = 'generating';
      job.progress = 0;
      job.stage = 'initializing';
      
      const outputPath = `/tmp/pdf-generation/${job.id}.pdf`;
      
      const generator = new PDFGenerator((progress: GenerationProgress) => {
        job.progress = progress.progress;
        job.stage = progress.stage;
        job.currentChapter = progress.currentChapter;
        job.totalChapters = progress.totalChapters;
        job.estimatedTimeRemaining = progress.estimatedTimeRemaining;
      });
      
      await generator.generateBookPDF({
        bookId: job.bookId,
        config: job.config,
        outputPath,
        ...job.options
      });
      
      job.status = 'completed';
      job.progress = 100;
      job.stage = 'complete';
      job.filePath = outputPath;
      job.completedAt = new Date();
      
      generator.close();
    } catch (error) {
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown error';
      console.error('PDF generation failed:', error);
    }
  }

  private extractChapters(paragraphs: any[]): any[] {
    const chapters: any[] = [];
    let currentChapter: any = null;
    
    for (const para of paragraphs) {
      if (para.chapter_title && para.chapter_title !== currentChapter?.title) {
        if (currentChapter) {
          chapters.push(currentChapter);
        }
        currentChapter = {
          number: chapters.length + 1,
          title: para.chapter_title || `Chapter ${chapters.length + 1}`,
          content: '',
          paragraphs: []
        };
      }
      
      if (currentChapter) {
        currentChapter.paragraphs.push({
          id: para.id,
          content: para.content,
          refcode: para.refcode_short
        });
        currentChapter.content += para.content.replace(/<[^>]*>/g, '').trim() + '\n\n';
      }
    }
    
    if (currentChapter) {
      chapters.push(currentChapter);
    }
    
    return chapters;
  }

  private getDefaultPDFConfig(): any {
    return {
      pageSize: 'A4',
      fontSize: 12,
      lineHeight: 1.5,
      fontFamily: 'Times',
      margins: {
        top: 72,
        bottom: 72,
        left: 72,
        right: 72
      },
      pagination: {
        show: true,
        style: 'bottom-center',
        format: 'numeric',
        startNumber: 1
      },
      toc: {
        generate: true,
        maxDepth: 2,
        pageBreakAfter: true
      },
      paragraphIds: {
        show: true,
        style: 'margin',
        format: 'original'
      }
    };
  }

  private cleanupPDFJob(token: string): void {
    const job = this.pdfJobs.get(token);
    if (job && job.filePath) {
      // Clean up file system
      import('fs').then(fs => {
        fs.unlink(job.filePath!, (err) => {
          if (err) console.error('Error cleaning up PDF file:', err);
        });
      });
      this.pdfJobs.delete(token);
    }
  }

  private setupCleanupJob(): void {
    // Clean up old jobs every hour
    setInterval(() => {
      const now = new Date();
      const maxAge = 24 * 60 * 60 * 1000; // 24 hours
      
      for (const [token, job] of this.pdfJobs) {
        if (now.getTime() - job.createdAt.getTime() > maxAge) {
          this.cleanupPDFJob(token);
        }
      }
    }, 60 * 60 * 1000); // Run every hour
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`🚀 EGH Research HTTP server running on port ${this.port}`);
      console.log(`📖 API Documentation: http://localhost:${this.port}/api/docs`);
      console.log(`❤️  Health Check: http://localhost:${this.port}/health`);
    });
  }

  public close(): void {
    this.db.close();
  }
}