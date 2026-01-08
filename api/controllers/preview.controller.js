"use strict";
// FENIX Project Manager - Preview Controller
// Business logic for document previews
// Created: January 6, 2026
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewController = void 0;
const path_1 = __importDefault(require("path"));
const promises_1 = __importDefault(require("fs/promises"));
const PreviewService_1 = require("../../services/PreviewService");
/**
 * Preview Controller
 * Handles document preview requests
 */
class PreviewController {
    previewService;
    outputDir;
    constructor() {
        this.previewService = new PreviewService_1.PreviewService();
        this.outputDir = path_1.default.join(process.cwd(), 'output');
    }
    /**
     * Get document preview
     */
    async getPreview(req, res) {
        const { id } = req.params;
        try {
            // Find document file
            const files = await promises_1.default.readdir(this.outputDir);
            const file = files.find(f => f.includes(id) || f.startsWith(id));
            if (!file) {
                res.status(404).json({
                    error: 'Not Found',
                    message: 'Document not found',
                });
                return;
            }
            const filepath = path_1.default.join(this.outputDir, file);
            const ext = path_1.default.extname(file).toLowerCase();
            let type;
            if (ext === '.pptx') {
                type = 'powerpoint';
            }
            else if (ext === '.xlsx') {
                type = 'excel';
            }
            else if (ext === '.docx') {
                type = 'word';
            }
            else {
                res.status(400).json({
                    error: 'Bad Request',
                    message: 'Unsupported file type',
                });
                return;
            }
            const preview = await this.previewService.generatePreview(filepath, type);
            res.json(preview);
        }
        catch (error) {
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
    async getMetadata(req, res) {
        const { id } = req.params;
        try {
            // Find document file
            const files = await promises_1.default.readdir(this.outputDir);
            const file = files.find(f => f.includes(id) || f.startsWith(id));
            if (!file) {
                res.status(404).json({
                    error: 'Not Found',
                    message: 'Document not found',
                });
                return;
            }
            const filepath = path_1.default.join(this.outputDir, file);
            const ext = path_1.default.extname(file).toLowerCase();
            let type;
            if (ext === '.pptx') {
                type = 'powerpoint';
            }
            else if (ext === '.xlsx') {
                type = 'excel';
            }
            else if (ext === '.docx') {
                type = 'word';
            }
            else {
                res.status(400).json({
                    error: 'Bad Request',
                    message: 'Unsupported file type',
                });
                return;
            }
            const metadata = await this.previewService.getMetadata(filepath, type);
            res.json(metadata);
        }
        catch (error) {
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
    async getThumbnail(_req, res) {
        // For now, return a placeholder
        // In production, you would generate actual thumbnails
        res.json({
            message: 'Thumbnail generation not yet implemented',
            placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjE1MCIgZmlsbD0iI0ZGOTkwMCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTgiIGZpbGw9IiMyMzJGM0UiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QcmV2aWV3PC90ZXh0Pjwvc3ZnPg==',
        });
    }
}
exports.PreviewController = PreviewController;
//# sourceMappingURL=preview.controller.js.map