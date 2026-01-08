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
export declare class PreviewService {
    /**
     * Generate preview for any document type
     */
    generatePreview(filepath: string, type: 'powerpoint' | 'excel' | 'word'): Promise<any>;
    /**
     * Generate PowerPoint preview
     */
    generatePowerPointPreview(filepath: string): Promise<{
        metadata: PreviewMetadata;
        slides: SlidePreview[];
    }>;
    /**
     * Generate Excel preview
     */
    generateExcelPreview(filepath: string): Promise<{
        metadata: PreviewMetadata;
        sheets: SheetPreview[];
    }>;
    /**
     * Generate Word preview
     */
    generateWordPreview(filepath: string): Promise<{
        metadata: PreviewMetadata;
        preview: WordPreview;
    }>;
    /**
     * Get document metadata
     */
    getMetadata(filepath: string, type: 'powerpoint' | 'excel' | 'word'): Promise<PreviewMetadata>;
}
//# sourceMappingURL=PreviewService.d.ts.map