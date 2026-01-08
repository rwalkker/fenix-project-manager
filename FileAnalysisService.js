"use strict";
// FENIX Project Manager - File Analysis Service
// Analyzes uploaded files to provide context for AI agents
// Created: January 7, 2026
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileAnalysisService = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
/**
 * File Analysis Service
 * Analyzes uploaded files and extracts relevant information for AI agents
 */
class FileAnalysisService {
    /**
     * Analyze uploaded file and extract relevant information
     */
    async analyzeFile(filePath, originalName) {
        try {
            const extension = path_1.default.extname(originalName).toLowerCase();
            const fileSize = fs_1.default.statSync(filePath).size;
            let analysis = '';
            switch (extension) {
                case '.txt':
                case '.md':
                    analysis = await this.analyzeTextFile(filePath, originalName);
                    break;
                case '.csv':
                    analysis = await this.analyzeCsvFile(filePath, originalName);
                    break;
                case '.json':
                    analysis = await this.analyzeJsonFile(filePath, originalName);
                    break;
                case '.pdf':
                    analysis = this.analyzePdfFile(originalName, fileSize);
                    break;
                case '.docx':
                    analysis = this.analyzeWordFile(originalName, fileSize);
                    break;
                case '.xlsx':
                    analysis = this.analyzeExcelFile(originalName, fileSize);
                    break;
                case '.pptx':
                    analysis = this.analyzePowerPointFile(originalName, fileSize);
                    break;
                default:
                    analysis = `File uploaded: ${originalName} (${this.formatFileSize(fileSize)})`;
            }
            return analysis;
        }
        catch (error) {
            console.error('[FileAnalysis] Analysis failed:', error);
            return `File uploaded: ${originalName} - Analysis failed`;
        }
    }
    /**
     * Analyze text/markdown files
     */
    async analyzeTextFile(filePath, originalName) {
        try {
            const content = fs_1.default.readFileSync(filePath, 'utf8');
            const lines = content.split('\n').length;
            const words = content.split(/\s+/).filter(word => word.length > 0).length;
            const chars = content.length;
            // Extract key information
            let analysis = `Text file: ${originalName} (${lines} lines, ${words} words, ${chars} characters)`;
            // Look for common patterns
            if (content.includes('# ') || content.includes('## ')) {
                analysis += ' - Contains markdown headers';
            }
            if (content.includes('TODO') || content.includes('FIXME')) {
                analysis += ' - Contains TODO items';
            }
            if (content.includes('```')) {
                analysis += ' - Contains code blocks';
            }
            // Sample first few lines for context
            const firstLines = content.split('\n').slice(0, 3).join(' ').substring(0, 100);
            if (firstLines.trim()) {
                analysis += ` - Preview: "${firstLines}..."`;
            }
            return analysis;
        }
        catch (error) {
            return `Text file: ${originalName} - Could not read content`;
        }
    }
    /**
     * Analyze CSV files
     */
    async analyzeCsvFile(filePath, originalName) {
        try {
            const content = fs_1.default.readFileSync(filePath, 'utf8');
            const lines = content.split('\n').filter(line => line.trim());
            if (lines.length === 0) {
                return `CSV file: ${originalName} - Empty file`;
            }
            // Analyze header row
            const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
            const dataRows = lines.length - 1;
            let analysis = `CSV file: ${originalName} (${dataRows} data rows, ${headers.length} columns)`;
            // List column headers
            if (headers.length > 0) {
                const headerPreview = headers.slice(0, 5).join(', ');
                analysis += ` - Columns: ${headerPreview}${headers.length > 5 ? '...' : ''}`;
            }
            // Detect data types
            if (dataRows > 0 && lines[1]) {
                const sampleRow = lines[1].split(',');
                const hasNumbers = sampleRow.some(cell => !isNaN(parseFloat(cell.trim())));
                const hasDates = sampleRow.some(cell => !isNaN(Date.parse(cell.trim())));
                if (hasNumbers)
                    analysis += ' - Contains numerical data';
                if (hasDates)
                    analysis += ' - Contains date data';
            }
            return analysis;
        }
        catch (error) {
            return `CSV file: ${originalName} - Could not parse content`;
        }
    }
    /**
     * Analyze JSON files
     */
    async analyzeJsonFile(filePath, originalName) {
        try {
            const content = fs_1.default.readFileSync(filePath, 'utf8');
            const data = JSON.parse(content);
            let analysis = `JSON file: ${originalName}`;
            if (Array.isArray(data)) {
                analysis += ` - Array with ${data.length} items`;
                if (data.length > 0 && typeof data[0] === 'object') {
                    const keys = Object.keys(data[0]);
                    analysis += ` - Sample keys: ${keys.slice(0, 3).join(', ')}${keys.length > 3 ? '...' : ''}`;
                }
            }
            else if (typeof data === 'object' && data !== null) {
                const keys = Object.keys(data);
                analysis += ` - Object with ${keys.length} properties`;
                analysis += ` - Keys: ${keys.slice(0, 5).join(', ')}${keys.length > 5 ? '...' : ''}`;
            }
            else {
                analysis += ` - Contains ${typeof data} data`;
            }
            return analysis;
        }
        catch (error) {
            return `JSON file: ${originalName} - Invalid JSON format`;
        }
    }
    /**
     * Analyze PDF files (metadata only)
     */
    analyzePdfFile(originalName, fileSize) {
        return `PDF document: ${originalName} (${this.formatFileSize(fileSize)}) - Ready for AI analysis`;
    }
    /**
     * Analyze Word files (metadata only)
     */
    analyzeWordFile(originalName, fileSize) {
        return `Word document: ${originalName} (${this.formatFileSize(fileSize)}) - Ready for AI analysis`;
    }
    /**
     * Analyze Excel files (metadata only)
     */
    analyzeExcelFile(originalName, fileSize) {
        return `Excel spreadsheet: ${originalName} (${this.formatFileSize(fileSize)}) - Ready for AI analysis`;
    }
    /**
     * Analyze PowerPoint files (metadata only)
     */
    analyzePowerPointFile(originalName, fileSize) {
        return `PowerPoint presentation: ${originalName} (${this.formatFileSize(fileSize)}) - Ready for AI analysis`;
    }
    /**
     * Format file size for display
     */
    formatFileSize(bytes) {
        if (bytes === 0)
            return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    /**
     * Get file content for AI agents (text files only)
     */
    async getFileContentForAI(filePath, originalName) {
        try {
            const extension = path_1.default.extname(originalName).toLowerCase();
            // Only return content for text-based files
            if (['.txt', '.md', '.csv', '.json'].includes(extension)) {
                const content = fs_1.default.readFileSync(filePath, 'utf8');
                // Limit content size for AI processing (max 5000 characters)
                if (content.length > 5000) {
                    return content.substring(0, 5000) + '\n\n[Content truncated for AI processing...]';
                }
                return content;
            }
            // For binary files, return null (AI agents will need specialized tools)
            return null;
        }
        catch (error) {
            console.error('[FileAnalysis] Failed to get content for AI:', error);
            return null;
        }
    }
    /**
     * Get file metadata for AI agents
     */
    getFileMetadataForAI(filePath, originalName) {
        try {
            const stats = fs_1.default.statSync(filePath);
            const extension = path_1.default.extname(originalName).toLowerCase();
            return {
                name: originalName,
                extension: extension,
                size: stats.size,
                sizeFormatted: this.formatFileSize(stats.size),
                type: this.getFileType(extension),
                canReadContent: ['.txt', '.md', '.csv', '.json'].includes(extension),
                uploadedAt: stats.birthtime
            };
        }
        catch (error) {
            console.error('[FileAnalysis] Failed to get metadata for AI:', error);
            return null;
        }
    }
    /**
     * Get human-readable file type
     */
    getFileType(extension) {
        const types = {
            '.pdf': 'PDF Document',
            '.docx': 'Word Document',
            '.xlsx': 'Excel Spreadsheet',
            '.pptx': 'PowerPoint Presentation',
            '.txt': 'Text File',
            '.md': 'Markdown File',
            '.csv': 'CSV Data File',
            '.json': 'JSON Data File'
        };
        return types[extension] || 'Unknown File Type';
    }
}
exports.FileAnalysisService = FileAnalysisService;
//# sourceMappingURL=FileAnalysisService.js.map