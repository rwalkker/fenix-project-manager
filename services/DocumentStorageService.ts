// FENIX Project Manager - Document Storage Service
// Centralized file storage and job persistence for reliable downloads
// Created: January 7, 2026

import * as path from 'path';
import * as fsPromises from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

/**
 * Document metadata for persistent storage
 */
export interface DocumentMetadata {
  id: string;
  type: 'powerpoint' | 'excel' | 'word' | 'workflow';
  status: 'pending' | 'in-progress' | 'complete' | 'failed';
  progress: number;
  filename: string;
  filepath: string;
  title: string;
  description?: string;
  fileSize: number;
  createdAt: Date;
  completedAt?: Date;
  error?: string;
  // Ownership
  ownerId: string;
  ownerUsername: string;
  ownerRole: string;
  // Metadata
  slideCount?: number;
  generationTime?: number;
  warnings?: string[];
}

/**
 * Storage configuration
 */
interface StorageConfig {
  baseDir: string;
  subdirs: {
    powerpoint: string;
    excel: string;
    word: string;
    metadata: string;
  };
  maxFileAge: number; // days
  maxFileSize: number; // bytes
}

/**
 * Document Storage Service
 * Provides centralized, persistent document storage and retrieval
 */
export class DocumentStorageService {
  private config: StorageConfig;
  private documents: Map<string, DocumentMetadata> = new Map();
  private initialized = false;

  constructor() {
    this.config = {
      baseDir: process.env.STORAGE_PATH || path.join(process.cwd(), 'output'),
      subdirs: {
        powerpoint: 'powerpoint',
        excel: 'excel', 
        word: 'word',
        metadata: '.metadata'
      },
      maxFileAge: 30, // 30 days
      maxFileSize: 100 * 1024 * 1024 // 100MB
    };
  }

  /**
   * Initialize storage service
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Create base directory
      await fsPromises.mkdir(this.config.baseDir, { recursive: true });

      // Create subdirectories
      for (const subdir of Object.values(this.config.subdirs)) {
        await fsPromises.mkdir(path.join(this.config.baseDir, subdir), { recursive: true });
      }

      // Load existing documents
      await this.loadExistingDocuments();

      this.initialized = true;
      console.log(`[DocumentStorage] Initialized with ${this.documents.size} documents`);
    } catch (error) {
      console.error('[DocumentStorage] Initialization failed:', error);
      throw error;
    }
  }

  /**
   * Load existing documents from filesystem and metadata
   */
  private async loadExistingDocuments(): Promise<void> {
    try {
      // Load from metadata files first
      await this.loadFromMetadata();

      // Scan filesystem for orphaned files
      await this.scanForOrphanedFiles();

      console.log(`[DocumentStorage] Loaded ${this.documents.size} documents from storage`);
    } catch (error) {
      console.error('[DocumentStorage] Failed to load existing documents:', error);
    }
  }

  /**
   * Load documents from metadata files
   */
  private async loadFromMetadata(): Promise<void> {
    const metadataDir = path.join(this.config.baseDir, this.config.subdirs.metadata);
    
    try {
      const files = await fsPromises.readdir(metadataDir);
      
      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        
        try {
          const filePath = path.join(metadataDir, file);
          const content = await fsPromises.readFile(filePath, 'utf-8');
          const metadata: DocumentMetadata = JSON.parse(content);
          
          // Verify file still exists
          if (await this.fileExists(metadata.filepath)) {
            // Update file stats
            const stats = await fsPromises.stat(metadata.filepath);
            metadata.fileSize = stats.size;
            
            this.documents.set(metadata.id, metadata);
          } else {
            // Remove orphaned metadata
            await fsPromises.unlink(filePath);
            console.log(`[DocumentStorage] Removed orphaned metadata: ${file}`);
          }
        } catch (error) {
          console.error(`[DocumentStorage] Failed to load metadata ${file}:`, error);
        }
      }
    } catch (error) {
      // Metadata directory doesn't exist yet - that's ok
    }
  }

  /**
   * Scan for files without metadata
   */
  private async scanForOrphanedFiles(): Promise<void> {
    const scanDirs = [
      { path: this.config.baseDir, type: 'mixed' as const },
      { path: path.join(this.config.baseDir, this.config.subdirs.powerpoint), type: 'powerpoint' as const },
      { path: path.join(this.config.baseDir, this.config.subdirs.excel), type: 'excel' as const },
      { path: path.join(this.config.baseDir, this.config.subdirs.word), type: 'word' as const }
    ];

    for (const dir of scanDirs) {
      try {
        if (!await this.fileExists(dir.path)) continue;
        
        const files = await fsPromises.readdir(dir.path);
        
        for (const file of files) {
          const filePath = path.join(dir.path, file);
          const stats = await fsPromises.stat(filePath);
          
          if (stats.isDirectory()) continue;
          
          // Check if we already have metadata for this file
          const existingDoc = Array.from(this.documents.values())
            .find(doc => doc.filepath === filePath);
          
          if (existingDoc) continue;
          
          // Determine type from extension
          const ext = path.extname(file).toLowerCase();
          let type: 'powerpoint' | 'excel' | 'word' | null = null;
          
          if (ext === '.pptx') type = 'powerpoint';
          else if (ext === '.xlsx') type = 'excel';
          else if (ext === '.docx') type = 'word';
          
          if (!type && dir.type !== 'mixed') {
            type = dir.type;
          }
          
          if (!type) continue;
          
          // Create metadata for orphaned file
          const metadata: DocumentMetadata = {
            id: uuidv4(),
            type,
            status: 'complete',
            progress: 100,
            filename: file,
            filepath: filePath,
            title: this.extractTitleFromFilename(file),
            fileSize: stats.size,
            createdAt: stats.mtime,
            completedAt: stats.mtime,
            ownerId: 'system',
            ownerUsername: 'system',
            ownerRole: 'admin'
          };
          
          this.documents.set(metadata.id, metadata);
          await this.saveMetadata(metadata);
          
          console.log(`[DocumentStorage] Registered orphaned file: ${file}`);
        }
      } catch (error) {
        console.error(`[DocumentStorage] Failed to scan directory ${dir.path}:`, error);
      }
    }
  }

  /**
   * Extract title from filename
   */
  private extractTitleFromFilename(filename: string): string {
    const basename = path.basename(filename, path.extname(filename));
    return basename.replace(/_\d+$/, '').replace(/_/g, ' ');
  }

  /**
   * Create a new document entry
   */
  async createDocument(
    type: 'powerpoint' | 'excel' | 'word',
    title: string,
    ownerId: string,
    ownerUsername: string,
    ownerRole: string,
    description?: string
  ): Promise<string> {
    await this.ensureInitialized();

    const id = uuidv4();
    const metadata: DocumentMetadata = {
      id,
      type,
      status: 'pending',
      progress: 0,
      filename: '',
      filepath: '',
      title,
      description,
      fileSize: 0,
      createdAt: new Date(),
      ownerId,
      ownerUsername,
      ownerRole
    };

    this.documents.set(id, metadata);
    await this.saveMetadata(metadata);

    console.log(`[DocumentStorage] Created document: ${id} (${type})`);
    return id;
  }

  /**
   * Update document status and progress
   */
  async updateDocument(
    id: string,
    updates: Partial<DocumentMetadata>
  ): Promise<void> {
    await this.ensureInitialized();

    const metadata = this.documents.get(id);
    if (!metadata) {
      throw new Error(`Document not found: ${id}`);
    }

    // Update metadata
    Object.assign(metadata, updates);
    
    // Set completion time if status changed to complete
    if (updates.status === 'complete' && !metadata.completedAt) {
      metadata.completedAt = new Date();
    }

    this.documents.set(id, metadata);
    await this.saveMetadata(metadata);

    console.log(`[DocumentStorage] Updated document: ${id}`);
  }

  /**
   * Store generated file and update metadata
   */
  async storeFile(
    id: string,
    sourceFilePath: string,
    filename?: string
  ): Promise<string> {
    await this.ensureInitialized();

    const metadata = this.documents.get(id);
    if (!metadata) {
      throw new Error(`Document not found: ${id}`);
    }

    // Verify source file exists
    if (!await this.fileExists(sourceFilePath)) {
      throw new Error(`Source file not found: ${sourceFilePath}`);
    }

    // Generate filename if not provided
    if (!filename) {
      const ext = path.extname(sourceFilePath);
      filename = `${metadata.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}${ext}`;
    }

    // Determine target directory
    const targetDir = path.join(this.config.baseDir, this.config.subdirs[metadata.type]);
    const targetPath = path.join(targetDir, filename);

    // Copy file to storage location
    await fsPromises.copyFile(sourceFilePath, targetPath);

    // Get file stats
    const stats = await fsPromises.stat(targetPath);

    // Update metadata
    metadata.filename = filename;
    metadata.filepath = targetPath;
    metadata.fileSize = stats.size;
    metadata.status = 'complete';
    metadata.progress = 100;
    metadata.completedAt = new Date();

    this.documents.set(id, metadata);
    await this.saveMetadata(metadata);

    console.log(`[DocumentStorage] Stored file: ${filename} (${stats.size} bytes)`);
    return targetPath;
  }

  /**
   * Get document metadata
   */
  async getDocument(id: string): Promise<DocumentMetadata | null> {
    await this.ensureInitialized();
    return this.documents.get(id) || null;
  }

  /**
   * List documents with filtering
   */
  async listDocuments(
    userId?: string,
    userRole?: string,
    type?: string,
    status?: string,
    limit?: number
  ): Promise<DocumentMetadata[]> {
    await this.ensureInitialized();

    let documents = Array.from(this.documents.values());

    // Apply filters
    if (userId && userRole !== 'admin') {
      if (userRole === 'viewer') {
        // Viewers: only completed documents
        documents = documents.filter(doc => doc.status === 'complete');
      } else if (userRole === 'user') {
        // Users: own documents + completed documents from others
        documents = documents.filter(doc => 
          doc.ownerId === userId || doc.status === 'complete'
        );
      }
      // Power-users and admins see all documents
    }

    if (type) {
      documents = documents.filter(doc => doc.type === type);
    }

    if (status) {
      documents = documents.filter(doc => doc.status === status);
    }

    // Sort by creation date (newest first)
    documents.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Apply limit
    if (limit) {
      documents = documents.slice(0, limit);
    }

    return documents;
  }

  /**
   * Get file path for download
   */
  async getFilePath(id: string, userId?: string, userRole?: string): Promise<string> {
    await this.ensureInitialized();

    const metadata = this.documents.get(id);
    if (!metadata) {
      throw new Error('Document not found');
    }

    // Check permissions
    if (userId && userRole !== 'admin') {
      if (metadata.status !== 'complete') {
        // Only owner can download incomplete documents
        if (metadata.ownerId !== userId) {
          throw new Error('Access denied: Document not ready or not owned by user');
        }
      }
      // Completed documents can be downloaded by anyone (based on role filtering)
    }

    // Verify file exists
    if (!await this.fileExists(metadata.filepath)) {
      throw new Error('File not found on disk');
    }

    return metadata.filepath;
  }

  /**
   * Delete document and file
   */
  async deleteDocument(id: string, userId?: string, userRole?: string): Promise<void> {
    await this.ensureInitialized();

    const metadata = this.documents.get(id);
    if (!metadata) {
      throw new Error('Document not found');
    }

    // Check permissions
    if (userId && userRole !== 'admin' && metadata.ownerId !== userId) {
      throw new Error('Access denied: Can only delete own documents');
    }

    // Delete file
    if (await this.fileExists(metadata.filepath)) {
      await fsPromises.unlink(metadata.filepath);
    }

    // Delete metadata file
    const metadataPath = path.join(
      this.config.baseDir,
      this.config.subdirs.metadata,
      `${id}.json`
    );
    
    if (await this.fileExists(metadataPath)) {
      await fsPromises.unlink(metadataPath);
    }

    // Remove from memory
    this.documents.delete(id);

    console.log(`[DocumentStorage] Deleted document: ${id}`);
  }

  /**
   * Clean up old documents
   */
  async cleanup(): Promise<void> {
    await this.ensureInitialized();

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - this.config.maxFileAge);

    const toDelete: string[] = [];

    for (const [id, metadata] of this.documents) {
      if (metadata.createdAt < cutoffDate) {
        toDelete.push(id);
      }
    }

    for (const id of toDelete) {
      try {
        await this.deleteDocument(id);
        console.log(`[DocumentStorage] Cleaned up old document: ${id}`);
      } catch (error) {
        console.error(`[DocumentStorage] Failed to cleanup document ${id}:`, error);
      }
    }

    console.log(`[DocumentStorage] Cleanup completed: ${toDelete.length} documents removed`);
  }

  /**
   * Get storage statistics
   */
  async getStats(): Promise<{
    totalDocuments: number;
    totalSize: number;
    byType: Record<string, number>;
    byStatus: Record<string, number>;
  }> {
    await this.ensureInitialized();

    const stats = {
      totalDocuments: this.documents.size,
      totalSize: 0,
      byType: {} as Record<string, number>,
      byStatus: {} as Record<string, number>
    };

    for (const metadata of this.documents.values()) {
      stats.totalSize += metadata.fileSize;
      stats.byType[metadata.type] = (stats.byType[metadata.type] || 0) + 1;
      stats.byStatus[metadata.status] = (stats.byStatus[metadata.status] || 0) + 1;
    }

    return stats;
  }

  /**
   * Save metadata to file
   */
  private async saveMetadata(metadata: DocumentMetadata): Promise<void> {
    const metadataPath = path.join(
      this.config.baseDir,
      this.config.subdirs.metadata,
      `${metadata.id}.json`
    );

    await fsPromises.writeFile(
      metadataPath,
      JSON.stringify(metadata, null, 2),
      'utf-8'
    );
  }

  /**
   * Check if file exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fsPromises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Ensure service is initialized
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }
}

/**
 * Singleton instance
 */
let documentStorageService: DocumentStorageService | null = null;

/**
 * Get document storage service instance
 */
export function getDocumentStorageService(): DocumentStorageService {
  if (!documentStorageService) {
    documentStorageService = new DocumentStorageService();
  }
  return documentStorageService;
}