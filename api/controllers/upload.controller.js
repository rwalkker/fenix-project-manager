"use strict";
// FENIX Project Manager - File Upload Controller
// Handles file uploads and analysis for AI agents
// Created: January 7, 2026
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadController = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const FileAnalysisService_1 = require("../../services/FileAnalysisService");
/**
 * File Upload Controller
 * Handles file uploads and provides analysis for AI agents
 */
class UploadController {
    fileAnalysisService;
    uploadDir;
    constructor() {
        this.fileAnalysisService = new FileAnalysisService_1.FileAnalysisService();
        this.uploadDir = path_1.default.join(process.cwd(), 'uploads');
        this.ensureUploadDir();
    }
    /**
     * Ensure upload directory exists
     */
    ensureUploadDir() {
        if (!fs_1.default.existsSync(this.uploadDir)) {
            fs_1.default.mkdirSync(this.uploadDir, { recursive: true });
        }
    }
    /**
     * Upload file endpoint (simplified without multer for now)
     */
    async uploadFile(req, res) {
        try {
            // For now, return a mock response until multer is properly installed
            const fileId = (0, uuid_1.v4)();
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
        }
        catch (error) {
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
    async getFileMetadata(req, res) {
        try {
            const { fileId } = req.params;
            const metadataPath = path_1.default.join(this.uploadDir, `${fileId}.json`);
            if (!fs_1.default.existsSync(metadataPath)) {
                res.status(404).json({
                    success: false,
                    error: 'File not found'
                });
                return;
            }
            const metadata = JSON.parse(fs_1.default.readFileSync(metadataPath, 'utf8'));
            res.json({
                success: true,
                data: metadata
            });
        }
        catch (error) {
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
    async downloadFile(req, res) {
        try {
            const { fileId } = req.params;
            const metadataPath = path_1.default.join(this.uploadDir, `${fileId}.json`);
            if (!fs_1.default.existsSync(metadataPath)) {
                res.status(404).json({
                    success: false,
                    error: 'File not found'
                });
                return;
            }
            const metadata = JSON.parse(fs_1.default.readFileSync(metadataPath, 'utf8'));
            const filePath = metadata.path;
            if (!fs_1.default.existsSync(filePath)) {
                res.status(404).json({
                    success: false,
                    error: 'File data not found'
                });
                return;
            }
            res.setHeader('Content-Disposition', `attachment; filename="${metadata.originalName}"`);
            res.setHeader('Content-Type', metadata.mimetype);
            res.sendFile(path_1.default.resolve(filePath));
        }
        catch (error) {
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
    async deleteFile(req, res) {
        try {
            const { fileId } = req.params;
            const metadataPath = path_1.default.join(this.uploadDir, `${fileId}.json`);
            if (!fs_1.default.existsSync(metadataPath)) {
                res.status(404).json({
                    success: false,
                    error: 'File not found'
                });
                return;
            }
            const metadata = JSON.parse(fs_1.default.readFileSync(metadataPath, 'utf8'));
            // Delete file data
            if (fs_1.default.existsSync(metadata.path)) {
                fs_1.default.unlinkSync(metadata.path);
            }
            // Delete metadata
            fs_1.default.unlinkSync(metadataPath);
            console.log(`[Upload] File deleted: ${metadata.originalName} (${fileId})`);
            res.json({
                success: true,
                message: 'File deleted successfully'
            });
        }
        catch (error) {
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
    async listFiles(req, res) {
        try {
            const userId = req.user?.userId || 'anonymous';
            const files = [];
            // Read all metadata files
            const metadataFiles = fs_1.default.readdirSync(this.uploadDir)
                .filter(file => file.endsWith('.json'));
            for (const metadataFile of metadataFiles) {
                try {
                    const metadataPath = path_1.default.join(this.uploadDir, metadataFile);
                    const metadata = JSON.parse(fs_1.default.readFileSync(metadataPath, 'utf8'));
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
                }
                catch (error) {
                    console.error(`[Upload] Failed to read metadata: ${metadataFile}`, error);
                }
            }
            // Sort by upload date (newest first)
            files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());
            res.json({
                success: true,
                data: files
            });
        }
        catch (error) {
            console.error('[Upload] List files failed:', error);
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to list files'
            });
        }
    }
}
exports.UploadController = UploadController;
//# sourceMappingURL=upload.controller.js.map