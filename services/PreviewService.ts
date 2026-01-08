// FENIX Project Manager - Preview Service
// Generate previews for PowerPoint, Excel, and Word documents
// Created: January 6, 2026

import fs from 'fs/promises';
import path from 'path';
import ExcelJS from 'exceljs';

/**
 * Preview metadata interface
 */
export interface PreviewMetadata {
  type: 'powerpoint' | 'excel' | 'word';
  filename: string;
  pageCount: number;
  createdAt: Date;
  fileSize: number;
}

/**
 * PowerPoint slide preview
 */
export interface SlidePreview {
  slideNumber: number;
  title?: string;
  content: string;
  thumbnail?: string;
}

/**
 * Excel sheet preview
 */
export interface SheetPreview {
  sheetName: string;
  rowCount: number;
  columnCount: number;
  data: any[][];
  headers?: string[];
}

/**
 * Word document preview
 */
export interface WordPreview {
  sections: {
    type: 'heading' | 'paragraph' | 'list';
    content: string;
    level?: number;
  }[];
}

/**
 * Preview Service
 * Generates previews for Office documents
 */
export class PreviewService {
  /**
   * Generate preview for any document type
   */
  async generatePreview(
    filepath: string,
    type: 'powerpoint' | 'excel' | 'word'
  ): Promise<any> {
    switch (type) {
      case 'powerpoint':
        return this.generatePowerPointPreview(filepath);
      case 'excel':
        return this.generateExcelPreview(filepath);
      case 'word':
        return this.generateWordPreview(filepath);
      default:
        throw new Error(`Unsupported document type: ${type}`);
    }
  }

  /**
   * Generate PowerPoint preview
   */
  async generatePowerPointPreview(filepath: string): Promise<{
    metadata: PreviewMetadata;
    slides: SlidePreview[];
  }> {
    try {
      const stats = await fs.stat(filepath);
      
      // For now, return mock data since extracting from PPTX requires additional libraries
      // In production, you would use a library like 'officegen' or 'node-pptx' to extract content
      const metadata: PreviewMetadata = {
        type: 'powerpoint',
        filename: path.basename(filepath),
        pageCount: 5, // Mock value
        createdAt: stats.birthtime,
        fileSize: stats.size,
      };

      const slides: SlidePreview[] = [
        {
          slideNumber: 1,
          title: 'Title Slide',
          content: 'This is a preview of the first slide',
        },
        {
          slideNumber: 2,
          title: 'Content Slide',
          content: 'This is a preview of the second slide',
        },
        {
          slideNumber: 3,
          title: 'Data Slide',
          content: 'This is a preview of the third slide',
        },
      ];

      return { metadata, slides };
    } catch (error: any) {
      throw new Error(`Failed to generate PowerPoint preview: ${error.message}`);
    }
  }

  /**
   * Generate Excel preview
   */
  async generateExcelPreview(filepath: string): Promise<{
    metadata: PreviewMetadata;
    sheets: SheetPreview[];
  }> {
    try {
      const stats = await fs.stat(filepath);
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.readFile(filepath);

      const metadata: PreviewMetadata = {
        type: 'excel',
        filename: path.basename(filepath),
        pageCount: workbook.worksheets.length,
        createdAt: stats.birthtime,
        fileSize: stats.size,
      };

      const sheets: SheetPreview[] = [];

      workbook.eachSheet((worksheet: ExcelJS.Worksheet) => {
        const data: any[][] = [];
        const headers: string[] = [];

        // Get first row as headers
        const firstRow = worksheet.getRow(1);
        firstRow.eachCell((cell: ExcelJS.Cell) => {
          headers.push(cell.value?.toString() || '');
        });

        // Get data rows (limit to first 100 rows for preview)
        const maxRows = Math.min(worksheet.rowCount, 100);
        for (let i = 1; i <= maxRows; i++) {
          const row = worksheet.getRow(i);
          const rowData: any[] = [];
          row.eachCell((cell: ExcelJS.Cell) => {
            rowData.push(cell.value);
          });
          data.push(rowData);
        }

        sheets.push({
          sheetName: worksheet.name,
          rowCount: worksheet.rowCount,
          columnCount: worksheet.columnCount,
          data,
          headers,
        });
      });

      return { metadata, sheets };
    } catch (error: any) {
      throw new Error(`Failed to generate Excel preview: ${error.message}`);
    }
  }

  /**
   * Generate Word preview
   */
  async generateWordPreview(filepath: string): Promise<{
    metadata: PreviewMetadata;
    preview: WordPreview;
  }> {
    try {
      const stats = await fs.stat(filepath);
      
      // For now, return mock data since extracting from DOCX requires additional libraries
      // In production, you would use a library like 'mammoth' or 'docx' to extract content
      const metadata: PreviewMetadata = {
        type: 'word',
        filename: path.basename(filepath),
        pageCount: 1, // Mock value
        createdAt: stats.birthtime,
        fileSize: stats.size,
      };

      const preview: WordPreview = {
        sections: [
          {
            type: 'heading',
            content: 'Document Title',
            level: 1,
          },
          {
            type: 'paragraph',
            content: 'This is a preview of the document content. In production, this would show the actual document text.',
          },
          {
            type: 'heading',
            content: 'Section 1',
            level: 2,
          },
          {
            type: 'paragraph',
            content: 'More content would appear here...',
          },
        ],
      };

      return { metadata, preview };
    } catch (error: any) {
      throw new Error(`Failed to generate Word preview: ${error.message}`);
    }
  }

  /**
   * Get document metadata
   */
  async getMetadata(filepath: string, type: 'powerpoint' | 'excel' | 'word'): Promise<PreviewMetadata> {
    const stats = await fs.stat(filepath);
    
    let pageCount = 1;
    
    if (type === 'excel') {
      try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(filepath);
        pageCount = workbook.worksheets.length;
      } catch (error) {
        // Use default
      }
    }

    return {
      type,
      filename: path.basename(filepath),
      pageCount,
      createdAt: stats.birthtime,
      fileSize: stats.size,
    };
  }
}
