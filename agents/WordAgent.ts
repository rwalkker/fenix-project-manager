// FENIX Project Manager - Word Agent
// AI-powered Word document generation
// Created: January 5, 2026

import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle, TableOfContents, Header, Footer } from 'docx';
import * as fs from 'fs';
import * as path from 'path';
import type {
  WordDocumentOptions,
  WordSectionDefinition,
  WordContent,
  WordParagraph,
  WordTable,
  WordList,
  WordQuote,
  WordGenerationResult,
  WordTheme
} from '../models/word-types';
import { getBedrockService } from '../services/AWSBedrockService';
import { ContentQualityService } from '../services/ContentQualityService';
import { ValidationService } from '../services/ValidationService';

/**
 * Word Agent - Generates Word documents with AI enhancement
 */
export class WordAgent {
  private theme: WordTheme;
  private outputDir: string;
  private qualityService: ContentQualityService;
  private validationService: ValidationService;

  constructor(theme?: WordTheme) {
    this.theme = theme || require('../models/word-types').AMAZON_WORD_THEME;
    this.outputDir = process.env.STORAGE_PATH || './output/word';
    this.qualityService = new ContentQualityService();
    this.validationService = new ValidationService();
    
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Generate Word document
   */
  async generate(options: WordDocumentOptions): Promise<WordGenerationResult> {
    const startTime = Date.now();

    try {
      const sections = [];
      let totalWordCount = 0;

      // Add table of contents if requested
      if (options.tableOfContents) {
        sections.push(
          new Paragraph({
            text: 'Table of Contents',
            heading: HeadingLevel.HEADING_1
          }),
          new TableOfContents('Summary', {
            hyperlink: true,
            headingStyleRange: '1-3'
          })
        );
      }

      // Process each section
      for (const section of options.sections) {
        const sectionContent = await this.createSection(section);
        sections.push(...sectionContent);
        
        // Count words
        totalWordCount += this.countWords(section);
      }

      // Create document
      const doc = new Document({
        creator: options.author || 'FENIX Project Manager',
        title: options.title,
        subject: options.subject,
        keywords: options.keywords?.join(', '),
        sections: [{
          properties: {},
          headers: options.headers ? {
            default: new Header({
              children: [new Paragraph({
                text: options.headers.text || '',
                alignment: this.getAlignment(options.headers.alignment)
              })]
            })
          } : undefined,
          footers: options.footers ? {
            default: new Footer({
              children: [new Paragraph({
                text: options.footers.text || '',
                alignment: this.getAlignment(options.footers.alignment)
              })]
            })
          } : undefined,
          children: sections
        }]
      });

      // Generate filename
      const fileName = `${options.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.docx`;
      const filePath = path.join(this.outputDir, fileName);

      // Write file
      const buffer = await Packer.toBuffer(doc);
      fs.writeFileSync(filePath, buffer);

      // Get file size
      const stats = fs.statSync(filePath);

      return {
        success: true,
        filePath,
        fileName,
        fileSize: stats.size,
        sections: options.sections.length,
        wordCount: totalWordCount,
        generationTime: Date.now() - startTime
      };

    } catch (error: any) {
      console.error('Word generation error:', error);
      return {
        success: false,
        filePath: '',
        fileName: '',
        fileSize: 0,
        sections: 0,
        wordCount: 0,
        generationTime: Date.now() - startTime,
        error: error.message
      };
    }
  }

  /**
   * Create section content
   */
  private async createSection(section: WordSectionDefinition): Promise<Paragraph[]> {
    const elements: Paragraph[] = [];

    // Add heading
    if (section.heading) {
      const headingLevel = this.getHeadingLevel(section.headingLevel || 1);
      
      elements.push(
        new Paragraph({
          text: section.heading,
          heading: headingLevel,
          spacing: { before: 240, after: 120 }
        })
      );
    }

    // Add content
    for (const content of section.content) {
      const contentElements = this.createContent(content);
      elements.push(...contentElements);
    }

    return elements;
  }

  /**
   * Create content element
   */
  private createContent(content: WordContent): Paragraph[] {
    switch (content.type) {
      case 'paragraph':
        return [this.createParagraph(content as WordParagraph)];
      
      case 'table':
        return [this.createTable(content as WordTable)];
      
      case 'list':
        return this.createList(content as WordList);
      
      case 'quote':
        return [this.createQuote(content as WordQuote)];
      
      default:
        return [];
    }
  }

  /**
   * Create paragraph
   */
  private createParagraph(para: WordParagraph): Paragraph {
    const style = para.style || this.theme.bodyStyle;
    
    return new Paragraph({
      children: [
        new TextRun({
          text: para.text,
          font: style.font,
          size: style.size ? style.size * 2 : 22, // Half-points
          bold: style.bold,
          italics: style.italic,
          underline: style.underline ? {} : undefined,
          color: style.color?.replace('#', '')
        })
      ],
      alignment: this.getAlignment(para.alignment),
      spacing: para.spacing ? {
        before: para.spacing.before,
        after: para.spacing.after,
        line: para.spacing.line
      } : { before: 120, after: 120 }
    });
  }

  /**
   * Create table
   */
  private createTable(table: WordTable): Paragraph {
    const rows: TableRow[] = [];

    // Add header row
    if (table.headers) {
      rows.push(
        new TableRow({
          children: table.headers.map(header =>
            new TableCell({
              children: [new Paragraph({
                children: [new TextRun({
                  text: header,
                  bold: true
                })]
              })],
              shading: {
                fill: this.theme.colorScheme.secondary.replace('#', '')
              }
            })
          )
        })
      );
    }

    // Add data rows
    table.rows.forEach(row => {
      rows.push(
        new TableRow({
          children: row.map(cell =>
            new TableCell({
              children: [new Paragraph(cell)]
            })
          )
        })
      );
    });

    const tableElement = new Table({
      rows,
      width: {
        size: 100,
        type: WidthType.PERCENTAGE
      },
      borders: table.style?.borders !== false ? {
        top: { style: BorderStyle.SINGLE, size: 1 },
        bottom: { style: BorderStyle.SINGLE, size: 1 },
        left: { style: BorderStyle.SINGLE, size: 1 },
        right: { style: BorderStyle.SINGLE, size: 1 }
      } : undefined
    });

    // Return as paragraph (docx requires wrapping)
    return new Paragraph({ children: [tableElement as any] });
  }

  /**
   * Create list
   */
  private createList(list: WordList): Paragraph[] {
    return list.items.map((item, index) =>
      new Paragraph({
        text: list.ordered ? `${index + 1}. ${item}` : `• ${item}`,
        spacing: { before: 60, after: 60 }
      })
    );
  }

  /**
   * Create quote
   */
  private createQuote(quote: WordQuote): Paragraph {
    const style = quote.style || this.theme.quoteStyle || this.theme.bodyStyle;
    
    return new Paragraph({
      children: [
        new TextRun({
          text: `"${quote.text}"`,
          font: style.font,
          size: style.size ? style.size * 2 : 22,
          italics: true,
          color: style.color?.replace('#', '')
        }),
        ...(quote.author ? [
          new TextRun({
            text: `\n— ${quote.author}`,
            font: style.font,
            size: style.size ? style.size * 2 : 22,
            italics: true
          })
        ] : [])
      ],
      spacing: { before: 240, after: 240, line: 360 },
      indent: { left: 720 }
    });
  }

  /**
   * Get heading level
   */
  private getHeadingLevel(level: number): typeof HeadingLevel[keyof typeof HeadingLevel] {
    const levels: Record<number, typeof HeadingLevel[keyof typeof HeadingLevel]> = {
      1: HeadingLevel.HEADING_1,
      2: HeadingLevel.HEADING_2,
      3: HeadingLevel.HEADING_3,
      4: HeadingLevel.HEADING_4,
      5: HeadingLevel.HEADING_5,
      6: HeadingLevel.HEADING_6
    };
    return levels[level] || HeadingLevel.HEADING_1;
  }

  /**
   * Get alignment
   */
  private getAlignment(alignment?: string): typeof AlignmentType[keyof typeof AlignmentType] {
    const alignments: Record<string, typeof AlignmentType[keyof typeof AlignmentType]> = {
      left: AlignmentType.LEFT,
      center: AlignmentType.CENTER,
      right: AlignmentType.RIGHT,
      justify: AlignmentType.JUSTIFIED
    };
    return alignments[alignment || 'left'] || AlignmentType.LEFT;
  }

  /**
   * Count words in section
   */
  private countWords(section: WordSectionDefinition): number {
    let count = 0;
    
    if (section.heading) {
      count += section.heading.split(/\s+/).length;
    }

    section.content.forEach(content => {
      if (content.type === 'paragraph') {
        count += (content as WordParagraph).text.split(/\s+/).length;
      } else if (content.type === 'list') {
        (content as WordList).items.forEach(item => {
          count += item.split(/\s+/).length;
        });
      } else if (content.type === 'quote') {
        count += (content as WordQuote).text.split(/\s+/).length;
      }
    });

    return count;
  }

  /**
   * Generate from template using the comprehensive template system
   */
  async generateFromTemplate(templateId: string, title: string, data: any): Promise<WordGenerationResult> {
    console.log(`📝 Generating Word document from template: ${templateId}`);
    
    try {
      // Import the template system
      const { getWordTemplate } = await import('../templates/word-templates');
      const { WordTemplateType } = await import('../models/word-types');
      
      // Get the template
      const templateOptions = getWordTemplate(templateId as any, {
        ...data,
        title: title
      });
      
      console.log(`   Template loaded: ${templateOptions.sections.length} sections`);
      
      // Generate using the template
      return this.generate(templateOptions);
      
    } catch (error) {
      console.error(`Failed to load Word template ${templateId}:`, error);
      
      // Fallback to basic generation
      const options: WordDocumentOptions = {
        title,
        author: data.author || 'FENIX Project Manager',
        subject: data.subject || title,
        keywords: data.keywords || [],
        sections: data.sections || [
          {
            heading: title,
            content: [{
              type: 'paragraph',
              text: data.description || 'Generated document content.'
            }]
          }
        ],
        tableOfContents: data.tableOfContents || false
      };
      
      return this.generate(options);
    }
  }

  /**
   * Save document to file
   */
  async save(filePath: string): Promise<void> {
    // This method is called after generate() which already saves the file
    // For now, this is a no-op as the file is saved in generate()
    console.log(`Document would be saved to: ${filePath}`);
  }

  /**
   * AI-powered content generation
   */
  async generateContent(prompt: string, tone?: string, length?: string): Promise<string> {
    const bedrock = getBedrockService();
    
    const fullPrompt = `Generate professional document content for: ${prompt}

Tone: ${tone || 'formal'}
Length: ${length || 'standard'}

Provide well-structured, clear content suitable for a business document.`;

    const response = await bedrock.invoke({
      prompt: fullPrompt,
      maxTokens: 2000,
      temperature: 0.7
    });

    return response.completion;
  }

  /**
   * AI-powered outline generation
   */
  async generateOutline(topic: string, sections?: number): Promise<string[]> {
    const bedrock = getBedrockService();
    
    const prompt = `Create a document outline for: ${topic}

Generate ${sections || 5} main section headings.
Format: One heading per line, no numbering.`;

    const response = await bedrock.invoke({
      prompt,
      maxTokens: 500,
      temperature: 0.6
    });

    return response.completion.split('\n').filter(line => line.trim());
  }

  /**
   * AI-powered grammar and style checking
   */
  async checkGrammar(text: string): Promise<string[]> {
    const bedrock = getBedrockService();
    
    const prompt = `Review this text for grammar, style, and clarity issues:

"${text}"

List any issues found, one per line.`;

    const response = await bedrock.invoke({
      prompt,
      maxTokens: 800,
      temperature: 0.3
    });

    return response.completion.split('\n').filter(line => line.trim());
  }

  /**
   * AI-powered summarization
   */
  async summarize(text: string, maxLength?: number): Promise<string> {
    const bedrock = getBedrockService();
    
    const prompt = `Summarize this text in ${maxLength || 100} words or less:

"${text}"

Provide a clear, concise summary.`;

    const response = await bedrock.invoke({
      prompt,
      maxTokens: maxLength ? maxLength * 2 : 200,
      temperature: 0.5
    });

    return response.completion;
  }

  /**
   * Generate document (orchestrator compatibility method)
   * Wrapper around generate() for AgentOrchestrator
   */
  async generateDocument(inputs: any): Promise<any> {
    // Convert inputs to WordDocumentOptions format
    const options: WordDocumentOptions = {
      title: inputs.title || 'Document',
      author: inputs.author,
      subject: inputs.subject,
      sections: inputs.sections || [],
      theme: inputs.theme
    };

    const result = await this.generate(options);
    
    return {
      filePath: result.filePath,
      fileName: result.fileName,
      sectionCount: result.sections,
      success: result.success,
      error: result.error
    };
  }
}

/**
 * Create Word agent instance
 */
export function createWordAgent(theme?: WordTheme): WordAgent {
  return new WordAgent(theme);
}
