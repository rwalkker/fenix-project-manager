/**
 * File Analysis Service
 * Analyzes uploaded files and extracts relevant information for AI agents
 */
export declare class FileAnalysisService {
    /**
     * Analyze uploaded file and extract relevant information
     */
    analyzeFile(filePath: string, originalName: string): Promise<string>;
    /**
     * Analyze text/markdown files
     */
    private analyzeTextFile;
    /**
     * Analyze CSV files
     */
    private analyzeCsvFile;
    /**
     * Analyze JSON files
     */
    private analyzeJsonFile;
    /**
     * Analyze PDF files (metadata only)
     */
    private analyzePdfFile;
    /**
     * Analyze Word files (metadata only)
     */
    private analyzeWordFile;
    /**
     * Analyze Excel files (metadata only)
     */
    private analyzeExcelFile;
    /**
     * Analyze PowerPoint files (metadata only)
     */
    private analyzePowerPointFile;
    /**
     * Format file size for display
     */
    private formatFileSize;
    /**
     * Get file content for AI agents (text files only)
     */
    getFileContentForAI(filePath: string, originalName: string): Promise<string | null>;
    /**
     * Get file metadata for AI agents
     */
    getFileMetadataForAI(filePath: string, originalName: string): any;
    /**
     * Get human-readable file type
     */
    private getFileType;
}
//# sourceMappingURL=FileAnalysisService.d.ts.map