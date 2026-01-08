"use strict";
// FENIX Project Manager - Preview Service
// Generate previews for PowerPoint, Excel, and Word documents
// Created: January 6, 2026
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PreviewService = void 0;
const promises_1 = __importDefault(require("fs/promises"));
const path_1 = __importDefault(require("path"));
const exceljs_1 = __importDefault(require("exceljs"));
/**
 * Preview Service
 * Generates previews for Office documents
 */
class PreviewService {
    /**
     * Generate preview for any document type
     */
    async generatePreview(filepath, type) {
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
    async generatePowerPointPreview(filepath) {
        try {
            const stats = await promises_1.default.stat(filepath);
            // For now, return mock data since extracting from PPTX requires additional libraries
            // In production, you would use a library like 'officegen' or 'node-pptx' to extract content
            const metadata = {
                type: 'powerpoint',
                filename: path_1.default.basename(filepath),
                pageCount: 5, // Mock value
                createdAt: stats.birthtime,
                fileSize: stats.size,
            };
            const slides = [
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
        }
        catch (error) {
            throw new Error(`Failed to generate PowerPoint preview: ${error.message}`);
        }
    }
    /**
     * Generate Excel preview
     */
    async generateExcelPreview(filepath) {
        try {
            const stats = await promises_1.default.stat(filepath);
            const workbook = new exceljs_1.default.Workbook();
            await workbook.xlsx.readFile(filepath);
            const metadata = {
                type: 'excel',
                filename: path_1.default.basename(filepath),
                pageCount: workbook.worksheets.length,
                createdAt: stats.birthtime,
                fileSize: stats.size,
            };
            const sheets = [];
            workbook.eachSheet((worksheet) => {
                const data = [];
                const headers = [];
                // Get first row as headers
                const firstRow = worksheet.getRow(1);
                firstRow.eachCell((cell) => {
                    headers.push(cell.value?.toString() || '');
                });
                // Get data rows (limit to first 100 rows for preview)
                const maxRows = Math.min(worksheet.rowCount, 100);
                for (let i = 1; i <= maxRows; i++) {
                    const row = worksheet.getRow(i);
                    const rowData = [];
                    row.eachCell((cell) => {
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
        }
        catch (error) {
            throw new Error(`Failed to generate Excel preview: ${error.message}`);
        }
    }
    /**
     * Generate Word preview
     */
    async generateWordPreview(filepath) {
        try {
            const stats = await promises_1.default.stat(filepath);
            // For now, return mock data since extracting from DOCX requires additional libraries
            // In production, you would use a library like 'mammoth' or 'docx' to extract content
            const metadata = {
                type: 'word',
                filename: path_1.default.basename(filepath),
                pageCount: 1, // Mock value
                createdAt: stats.birthtime,
                fileSize: stats.size,
            };
            const preview = {
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
        }
        catch (error) {
            throw new Error(`Failed to generate Word preview: ${error.message}`);
        }
    }
    /**
     * Get document metadata
     */
    async getMetadata(filepath, type) {
        const stats = await promises_1.default.stat(filepath);
        let pageCount = 1;
        if (type === 'excel') {
            try {
                const workbook = new exceljs_1.default.Workbook();
                await workbook.xlsx.readFile(filepath);
                pageCount = workbook.worksheets.length;
            }
            catch (error) {
                // Use default
            }
        }
        return {
            type,
            filename: path_1.default.basename(filepath),
            pageCount,
            createdAt: stats.birthtime,
            fileSize: stats.size,
        };
    }
}
exports.PreviewService = PreviewService;
//# sourceMappingURL=PreviewService.js.map