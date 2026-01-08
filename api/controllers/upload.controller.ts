// FENIX Project Manager - File Upload Controller
// Handles file uploads and analysis for AI agents
// Created: January 7, 2026

import { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { FileAnalysisService } from '../../services/FileAnalysisService';

/**
 * File Upload Controller
 * Handles file uploads and provides analysis for AI agents
 */
export class UploadController {
  private fileAnalysisService: FileAnalysisService;
  private uploadDir: string;

  constructor() {
    this.fileAnalysisService = new FileAnalysisService();
    this.uploadDir = path.join(process.cwd(), 'uploads');
    this.ensureUploadDir();
  }

  /**
   * Ensure upload directory exists
   */
  private ensureUploadDir(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  /**
   * Upload file endpoint (simplified without multer for now)
   */
  public async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      // For now, return a mock response until multer is properly installed
      const fileId = uuidv4();
      
      res.json({
        success: true,
        data: {
          fileId: fileId,
          originalName: 'mock-file.txt',
          size: 1024,
          type: 'text/plain',
          analysis: 'Mock file upload - multer installation pending'
        }
      });

    } catch (error) {
      console.error('[Upload] Upload failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Upload failed'
      });
    }
  }

  /**
   * Get uploaded file metadata
   */
  public async getFileMetadata(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const metadataPath = path.join(this.uploadDir, `${fileId}.json`);

      if (!fs.existsSync(metadataPath)) {
        res.status(404).json({
          success: false,
          error: 'File not found'
        });
        return;
      }

      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

      res.json({
        success: true,
        data: metadata
      });

    } catch (error) {
      console.error('[Upload] Get metadata failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to get file metadata'
      });
    }
  }

  /**
   * Download uploaded file
   */
  public async downloadFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const metadataPath = path.join(this.uploadDir, `${fileId}.json`);

      if (!fs.existsSync(metadataPath)) {
        res.status(404).json({
          success: false,
          error: 'File not found'
        });
        return;
      }

      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));
      const filePath = metadata.path;

      if (!fs.existsSync(filePath)) {
        res.status(404).json({
          success: false,
          error: 'File data not found'
        });
        return;
      }

      res.setHeader('Content-Disposition', `attachment; filename="${metadata.originalName}"`);
      res.setHeader('Content-Type', metadata.mimetype);
      res.sendFile(path.resolve(filePath));

    } catch (error) {
      console.error('[Upload] Download failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Download failed'
      });
    }
  }

  /**
   * Delete uploaded file
   */
  public async deleteFile(req: Request, res: Response): Promise<void> {
    try {
      const { fileId } = req.params;
      const metadataPath = path.join(this.uploadDir, `${fileId}.json`);

      if (!fs.existsSync(metadataPath)) {
        res.status(404).json({
          success: false,
          error: 'File not found'
        });
        return;
      }

      const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

      // Delete file data
      if (fs.existsSync(metadata.path)) {
        fs.unlinkSync(metadata.path);
      }

      // Delete metadata
      fs.unlinkSync(metadataPath);

      console.log(`[Upload] File deleted: ${metadata.originalName} (${fileId})`);

      res.json({
        success: true,
        message: 'File deleted successfully'
      });

    } catch (error) {
      console.error('[Upload] Delete failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Delete failed'
      });
    }
  }

  /**
   * List uploaded files for user
   */
  public async listFiles(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.userId || 'anonymous';
      const files: any[] = [];

      // Read all metadata files
      const metadataFiles = fs.readdirSync(this.uploadDir)
        .filter(file => file.endsWith('.json'));

      for (const metadataFile of metadataFiles) {
        try {
          const metadataPath = path.join(this.uploadDir, metadataFile);
          const metadata = JSON.parse(fs.readFileSync(metadataPath, 'utf8'));

          // Filter by user (or show all for admin)
          if (metadata.uploadedBy === userId || req.user?.role === 'admin') {
            files.push({
              id: metadata.id,
              originalName: metadata.originalName,
              size: metadata.size,
              type: metadata.mimetype,
              uploadedAt: metadata.uploadedAt,
              analysis: metadata.analysis
            });
          }
        } catch (error) {
          console.error(`[Upload] Failed to read metadata: ${metadataFile}`, error);
        }
      }

      // Sort by upload date (newest first)
      files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

      res.json({
        success: true,
        data: files
      });

    } catch (error) {
      console.error('[Upload] List files failed:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to list files'
      });
    }
  }
}