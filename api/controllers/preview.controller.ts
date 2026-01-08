// FENIX Project Manager - Preview Controller
// Business logic for document previews
// Created: January 6, 2026

import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs/promises';
import { PreviewService } from '../../services/PreviewService';

/**
 * Preview Controller
 * Handles document preview requests
 */
export class PreviewController {
  private previewService: PreviewService;
  private outputDir: string;

  constructor() {
    this.previewService = new PreviewService();
    this.outputDir = path.join(process.cwd(), 'output');
  }

  /**
   * Get document preview
   */
  async getPreview(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      // Find document file
      const files = await fs.readdir(this.outputDir);
      const file = files.find(f => f.includes(id) || f.startsWith(id));

      if (!file) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Document not found',
        });
        return;
      }

      const filepath = path.join(this.outputDir, file);
      const ext = path.extname(file).toLowerCase();

      let type: 'powerpoint' | 'excel' | 'word';
      if (ext === '.pptx') {
        type = 'powerpoint';
      } else if (ext === '.xlsx') {
        type = 'excel';
      } else if (ext === '.docx') {
        type = 'word';
      } else {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Unsupported file type',
        });
        return;
      }

      const preview = await this.previewService.generatePreview(filepath, type);

      res.json(preview);
    } catch (error: any) {
      console.error('Preview generation failed:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message,
      });
    }
  }

  /**
   * Get document metadata
   */
  async getMetadata(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    try {
      // Find document file
      const files = await fs.readdir(this.outputDir);
      const file = files.find(f => f.includes(id) || f.startsWith(id));

      if (!file) {
        res.status(404).json({
          error: 'Not Found',
          message: 'Document not found',
        });
        return;
      }

      const filepath = path.join(this.outputDir, file);
      const ext = path.extname(file).toLowerCase();

      let type: 'powerpoint' | 'excel' | 'word';
      if (ext === '.pptx') {
        type = 'powerpoint';
      } else if (ext === '.xlsx') {
        type = 'excel';
      } else if (ext === '.docx') {
        type = 'word';
      } else {
        res.status(400).json({
          error: 'Bad Request',
          message: 'Unsupported file type',
        });
        return;
      }

      const metadata = await this.previewService.getMetadata(filepath, type);

      res.json(metadata);
    } catch (error: any) {
      console.error('Metadata retrieval failed:', error);
      res.status(500).json({
        error: 'Internal Server Error',
        message: error.message,
      });
    }
  }

  /**
   * Get document thumbnail
   */
  async getThumbnail(_req: Request, res: Response): Promise<void> {
    // For now, return a placeholder
    // In production, you would generate actual thumbnails
    res.json({
      message: 'Thumbnail generation not yet implemented',
      placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0ZGOTkwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiMyMzJGM0UiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QcmV2aWV3PC90ZXh0Pjwvc3ZnPg==',
    });
  }
}
