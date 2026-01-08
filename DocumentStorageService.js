"use strict";
// FENIX Project Manager - Document Storage Service
// Centralized file storage and job persistence for reliable downloads
// Created: January 7, 2026
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentStorageService = void 0;
exports.getDocumentStorageService = getDocumentStorageService;
const path = __importStar(require("path"));
const fsPromises = __importStar(require("fs/promises"));
const uuid_1 = require("uuid");
/**
 * Document Storage Service
 * Provides centralized, persistent document storage and retrieval
 */
class DocumentStorageService {
    config;
    documents = new Map();
    initialized = false;
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
    async initialize() {
        if (this.initialized)
            return;
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
        }
        catch (error) {
            console.error('[DocumentStorage] Initialization failed:', error);
            throw error;
        }
    }
    /**
     * Load existing documents from filesystem and metadata
     */
    async loadExistingDocuments() {
        try {
            // Load from metadata files first
            await this.loadFromMetadata();
            // Scan filesystem for orphaned files
            await this.scanForOrphanedFiles();
            console.log(`[DocumentStorage] Loaded ${this.documents.size} documents from storage`);
        }
        catch (error) {
            console.error('[DocumentStorage] Failed to load existing documents:', error);
        }
    }
    /**
     * Load documents from metadata files
     */
    async loadFromMetadata() {
        const metadataDir = path.join(this.config.baseDir, this.config.subdirs.metadata);
        try {
            const files = await fsPromises.readdir(metadataDir);
            for (const file of files) {
                if (!file.endsWith('.json'))
                    continue;
                try {
                    const filePath = path.join(metadataDir, file);
                    const content = await fsPromises.readFile(filePath, 'utf-8');
                    const metadata = JSON.parse(content);
                    // Verify file still exists
                    if (await this.fileExists(metadata.filepath)) {
                        // Update file stats
                        const stats = await fsPromises.stat(metadata.filepath);
                        metadata.fileSize = stats.size;
                        this.documents.set(metadata.id, metadata);
                    }
                    else {
                        // Remove orphaned metadata
                        await fsPromises.unlink(filePath);
                        console.log(`[DocumentStorage] Removed orphaned metadata: ${file}`);
                    }
                }
                catch (error) {
                    console.error(`[DocumentStorage] Failed to load metadata ${file}:`, error);
                }
            }
        }
        catch (error) {
            // Metadata directory doesn't exist yet - that's ok
        }
    }
    /**
     * Scan for files without metadata
     */
    async scanForOrphanedFiles() {
        const scanDirs = [
            { path: this.config.baseDir, type: 'mixed' },
            { path: path.join(this.config.baseDir, this.config.subdirs.powerpoint), type: 'powerpoint' },
            { path: path.join(this.config.baseDir, this.config.subdirs.excel), type: 'excel' },
            { path: path.join(this.config.baseDir, this.config.subdirs.word), type: 'word' }
        ];
        for (const dir of scanDirs) {
            try {
                if (!await this.fileExists(dir.path))
                    continue;
                const files = await fsPromises.readdir(dir.path);
                for (const file of files) {
                    const filePath = path.join(dir.path, file);
                    const stats = await fsPromises.stat(filePath);
                    if (stats.isDirectory())
                        continue;
                    // Check if we already have metadata for this file
                    const existingDoc = Array.from(this.documents.values())
                        .find(doc => doc.filepath === filePath);
                    if (existingDoc)
                        continue;
                    // Determine type from extension
                    const ext = path.extname(file).toLowerCase();
                    let type = null;
                    if (ext === '.pptx')
                        type = 'powerpoint';
                    else if (ext === '.xlsx')
                        type = 'excel';
                    else if (ext === '.docx')
                        type = 'word';
                    if (!type && dir.type !== 'mixed') {
                        type = dir.type;
                    }
                    if (!type)
                        continue;
                    // Create metadata for orphaned file
                    const metadata = {
                        id: (0, uuid_1.v4)(),
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
            }
            catch (error) {
                console.error(`[DocumentStorage] Failed to scan directory ${dir.path}:`, error);
            }
        }
    }
    /**
     * Extract title from filename
     */
    extractTitleFromFilename(filename) {
        const basename = path.basename(filename, path.extname(filename));
        return basename.replace(/_\d+$/, '').replace(/_/g, ' ');
    }
    /**
     * Create a new document entry
     */
    async createDocument(type, title, ownerId, ownerUsername, ownerRole, description) {
        await this.ensureInitialized();
        const id = (0, uuid_1.v4)();
        const metadata = {
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
    async updateDocument(id, updates) {
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
    async storeFile(id, sourceFilePath, filename) {
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
    async getDocument(id) {
        await this.ensureInitialized();
        return this.documents.get(id) || null;
    }
    /**
     * List documents with filtering
     */
    async listDocuments(userId, userRole, type, status, limit) {
        await this.ensureInitialized();
        let documents = Array.from(this.documents.values());
        // Apply filters
        if (userId && userRole !== 'admin') {
            if (userRole === 'viewer') {
                // Viewers: only completed documents
                documents = documents.filter(doc => doc.status === 'complete');
            }
            else if (userRole === 'user') {
                // Users: own documents + completed documents from others
                documents = documents.filter(doc => doc.ownerId === userId || doc.status === 'complete');
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
    async getFilePath(id, userId, userRole) {
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
    async deleteDocument(id, userId, userRole) {
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
        const metadataPath = path.join(this.config.baseDir, this.config.subdirs.metadata, `${id}.json`);
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
    async cleanup() {
        await this.ensureInitialized();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - this.config.maxFileAge);
        const toDelete = [];
        for (const [id, metadata] of this.documents) {
            if (metadata.createdAt < cutoffDate) {
                toDelete.push(id);
            }
        }
        for (const id of toDelete) {
            try {
                await this.deleteDocument(id);
                console.log(`[DocumentStorage] Cleaned up old document: ${id}`);
            }
            catch (error) {
                console.error(`[DocumentStorage] Failed to cleanup document ${id}:`, error);
            }
        }
        console.log(`[DocumentStorage] Cleanup completed: ${toDelete.length} documents removed`);
    }
    /**
     * Get storage statistics
     */
    async getStats() {
        await this.ensureInitialized();
        const stats = {
            totalDocuments: this.documents.size,
            totalSize: 0,
            byType: {},
            byStatus: {}
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
    async saveMetadata(metadata) {
        const metadataPath = path.join(this.config.baseDir, this.config.subdirs.metadata, `${metadata.id}.json`);
        await fsPromises.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
    }
    /**
     * Check if file exists
     */
    async fileExists(filePath) {
        try {
            await fsPromises.access(filePath);
            return true;
        }
        catch {
            return false;
        }
    }
    /**
     * Ensure service is initialized
     */
    async ensureInitialized() {
        if (!this.initialized) {
            await this.initialize();
        }
    }
}
exports.DocumentStorageService = DocumentStorageService;
/**
 * Singleton instance
 */
let documentStorageService = null;
/**
 * Get document storage service instance
 */
function getDocumentStorageService() {
    if (!documentStorageService) {
        documentStorageService = new DocumentStorageService();
    }
    return documentStorageService;
}
//# sourceMappingURL=DocumentStorageService.js.map