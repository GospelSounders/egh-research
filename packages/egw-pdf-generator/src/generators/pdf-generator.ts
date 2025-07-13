import { PDFDocument, PDFPage, PDFFont, rgb, StandardFonts } from 'pdf-lib';
import * as fs from 'fs/promises';
import { PDFConfig, BookGenerationOptions, Chapter, GenerationProgress } from '../types/index.js';
import { EGWDatabase } from '@surgbc/egw-writings-shared';

export class PDFGenerator {
  private db: EGWDatabase;
  private progressCallback?: (progress: GenerationProgress) => void;

  constructor(progressCallback?: (progress: GenerationProgress) => void) {
    this.db = new EGWDatabase();
    this.progressCallback = progressCallback;
  }

  async generateBookPDF(options: BookGenerationOptions): Promise<void> {
    this.updateProgress({ stage: 'fetching', progress: 0 });

    // Get book information
    const book = this.db.getBook(options.bookId);
    if (!book) {
      throw new Error(`Book with ID ${options.bookId} not found`);
    }

    // Get book content
    const paragraphs = this.db.getParagraphs(options.bookId);
    if (paragraphs.length === 0) {
      throw new Error(`No content found for book ${options.bookId}. Run the downloader first.`);
    }

    this.updateProgress({ stage: 'processing', progress: 20 });

    // Group paragraphs into chapters
    const chapters = this.groupIntoChapters(paragraphs);
    
    this.updateProgress({ 
      stage: 'formatting', 
      progress: 40,
      totalChapters: chapters.length 
    });

    // Create PDF
    const pdfDoc = await PDFDocument.create();
    const font = await this.getFont(pdfDoc, options.config.fontFamily);

    // Add title page
    await this.addTitlePage(pdfDoc, font, book, options.config);

    // Add table of contents if enabled
    if (options.config.toc.generate) {
      await this.addTableOfContents(pdfDoc, font, chapters, options.config);
    }

    // Add chapters
    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      this.updateProgress({ 
        stage: 'rendering', 
        progress: 50 + (i / chapters.length) * 40,
        currentChapter: chapter.title,
        totalChapters: chapters.length
      });

      await this.addChapter(pdfDoc, font, chapter, options.config);
    }

    this.updateProgress({ stage: 'complete', progress: 100 });

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    await fs.writeFile(options.outputPath, pdfBytes);
  }

  private groupIntoChapters(paragraphs: any[]): Chapter[] {
    const chapters: Chapter[] = [];
    let currentChapter: Chapter | null = null;

    for (const para of paragraphs) {
      // Detect chapter breaks based on chapter_title or significant formatting changes
      if (para.chapter_title && para.chapter_title !== currentChapter?.title) {
        if (currentChapter) {
          chapters.push(currentChapter);
        }
        currentChapter = {
          id: para.id,
          title: para.chapter_title || `Chapter ${chapters.length + 1}`,
          content: '',
          originalPage: para.page,
          originalChapter: para.chapter_title
        };
      }

      if (currentChapter) {
        // Clean HTML and add paragraph
        const cleanContent = para.content.replace(/<[^>]*>/g, '').trim();
        if (cleanContent) {
          currentChapter.content += cleanContent + '\n\n';
        }
      }
    }

    if (currentChapter) {
      chapters.push(currentChapter);
    }

    return chapters;
  }

  private async getFont(pdfDoc: PDFDocument, fontFamily: string): Promise<PDFFont> {
    switch (fontFamily) {
      case 'Times':
        return await pdfDoc.embedFont(StandardFonts.TimesRoman);
      case 'Helvetica':
        return await pdfDoc.embedFont(StandardFonts.Helvetica);
      case 'Courier':
        return await pdfDoc.embedFont(StandardFonts.Courier);
      default:
        return await pdfDoc.embedFont(StandardFonts.TimesRoman);
    }
  }

  private async addTitlePage(
    pdfDoc: PDFDocument, 
    font: PDFFont, 
    book: any, 
    config: PDFConfig
  ): Promise<void> {
    const page = pdfDoc.addPage([this.getPageWidth(config), this.getPageHeight(config)]);
    const { width, height } = page.getSize();

    // Title
    page.drawText(book.title, {
      x: config.margins.left,
      y: height - config.margins.top - 60,
      size: config.fontSize + 8,
      font,
      color: rgb(0, 0, 0),
    });

    // Author
    page.drawText(`By ${book.author}`, {
      x: config.margins.left,
      y: height - config.margins.top - 120,
      size: config.fontSize + 2,
      font,
      color: rgb(0, 0, 0),
    });

    // Publication info
    const pubInfo = `Published: ${book.pub_year}\nPublisher: ${book.publisher}\nPages: ${book.npages}`;
    page.drawText(pubInfo, {
      x: config.margins.left,
      y: height - config.margins.top - 200,
      size: config.fontSize - 2,
      font,
      color: rgb(0.3, 0.3, 0.3),
    });

    // Copyright notice
    const copyrightNotice = `This digital reproduction is for educational and research purposes only.\nOriginal publication may be subject to copyright restrictions.\nUsers are responsible for ensuring compliance with applicable copyright laws.`;
    page.drawText(copyrightNotice, {
      x: config.margins.left,
      y: config.margins.bottom + 60,
      size: config.fontSize - 4,
      font,
      color: rgb(0.5, 0.5, 0.5),
    });
  }

  private async addTableOfContents(
    pdfDoc: PDFDocument,
    font: PDFFont,
    chapters: Chapter[],
    config: PDFConfig
  ): Promise<void> {
    const page = pdfDoc.addPage([this.getPageWidth(config), this.getPageHeight(config)]);
    const { width, height } = page.getSize();

    page.drawText('Table of Contents', {
      x: config.margins.left,
      y: height - config.margins.top - 40,
      size: config.fontSize + 4,
      font,
      color: rgb(0, 0, 0),
    });

    let yPosition = height - config.margins.top - 80;
    const lineHeight = config.fontSize * config.lineHeight;

    for (let i = 0; i < chapters.length && i < 50; i++) { // Limit TOC entries
      const chapter = chapters[i];
      const pageNum = i + 3; // Estimate page number (title + TOC + chapters)
      
      page.drawText(`${i + 1}. ${chapter.title}`, {
        x: config.margins.left,
        y: yPosition,
        size: config.fontSize,
        font,
        color: rgb(0, 0, 0),
      });

      page.drawText(`${pageNum}`, {
        x: width - config.margins.right - 30,
        y: yPosition,
        size: config.fontSize,
        font,
        color: rgb(0, 0, 0),
      });

      yPosition -= lineHeight;
      if (yPosition < config.margins.bottom + lineHeight) {
        break; // Page full
      }
    }
  }

  private async addChapter(
    pdfDoc: PDFDocument,
    font: PDFFont,
    chapter: Chapter,
    config: PDFConfig
  ): Promise<void> {
    let page = pdfDoc.addPage([this.getPageWidth(config), this.getPageHeight(config)]);
    let yPosition = page.getSize().height - config.margins.top;
    const lineHeight = config.fontSize * config.lineHeight;
    const pageWidth = this.getPageWidth(config);
    const textWidth = pageWidth - config.margins.left - config.margins.right;

    // Chapter title
    page.drawText(chapter.title, {
      x: config.margins.left,
      y: yPosition,
      size: config.fontSize + 4,
      font,
      color: rgb(0, 0, 0),
    });
    yPosition -= lineHeight * 2;

    // Chapter content
    const paragraphs = chapter.content.split('\n\n').filter(p => p.trim());
    
    for (const paragraph of paragraphs) {
      const lines = this.wrapText(paragraph, font, config.fontSize, textWidth);
      
      for (const line of lines) {
        if (yPosition < config.margins.bottom + lineHeight) {
          // New page
          page = pdfDoc.addPage([pageWidth, this.getPageHeight(config)]);
          yPosition = page.getSize().height - config.margins.top;
        }

        page.drawText(line, {
          x: config.margins.left,
          y: yPosition,
          size: config.fontSize,
          font,
          color: rgb(0, 0, 0),
        });
        yPosition -= lineHeight;
      }
      yPosition -= lineHeight * 0.5; // Paragraph spacing
    }
  }

  private wrapText(text: string, font: PDFFont, fontSize: number, maxWidth: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      const testLine = currentLine ? `${currentLine} ${word}` : word;
      const textWidth = font.widthOfTextAtSize(testLine, fontSize);
      
      if (textWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          // Word is too long, force break
          lines.push(word);
        }
      }
    }
    
    if (currentLine) {
      lines.push(currentLine);
    }
    
    return lines;
  }

  private getPageWidth(config: PDFConfig): number {
    switch (config.pageSize) {
      case 'A4':
        return 595.28; // A4 width in points
      case 'Letter':
        return 612; // Letter width in points
      case 'Legal':
        return 612; // Legal width in points (same as Letter)
      case 'Custom':
        return config.customWidth || 612;
      default:
        return 612;
    }
  }

  private getPageHeight(config: PDFConfig): number {
    switch (config.pageSize) {
      case 'A4':
        return 841.89; // A4 height in points
      case 'Letter':
        return 792; // Letter height in points
      case 'Legal':
        return 1008; // Legal height in points
      case 'Custom':
        return config.customHeight || 792;
      default:
        return 792;
    }
  }

  private updateProgress(progress: GenerationProgress): void {
    if (this.progressCallback) {
      this.progressCallback(progress);
    }
  }

  close(): void {
    this.db.close();
  }
}