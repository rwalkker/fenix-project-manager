/**
 * Core document type definitions for FENIX Project Manager
 */
export declare enum DocumentType {
    POWERPOINT = "powerpoint",
    EXCEL = "excel",
    WORD = "word",
    MULTI_FORMAT = "multi-format"
}
export declare enum DocumentFormat {
    PPTX = "pptx",
    XLSX = "xlsx",
    DOCX = "docx",
    PDF = "pdf"
}
export interface DocumentMetadata {
    id: string;
    title: string;
    author: string;
    createdAt: Date;
    updatedAt: Date;
    type: DocumentType;
    format: DocumentFormat;
    tags: string[];
    description?: string;
    version: string;
}
export interface GenerationRequest {
    type: DocumentType;
    title: string;
    content: string | object;
    template?: string;
    options?: GenerationOptions;
    metadata?: Partial<DocumentMetadata>;
}
export interface GenerationOptions {
    theme?: string;
    colorScheme?: ColorScheme;
    includeCharts?: boolean;
    includeImages?: boolean;
    aiEnhanced?: boolean;
    outputFormat?: DocumentFormat;
    customStyles?: Record<string, any>;
}
export interface ColorScheme {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
    success?: string;
    warning?: string;
    error?: string;
}
export interface GenerationResult {
    success: boolean;
    documentId: string;
    filePath: string;
    metadata: DocumentMetadata;
    fileSize: number;
    generationTime: number;
    error?: string;
}
export interface DocumentTemplate {
    id: string;
    name: string;
    description: string;
    type: DocumentType;
    category: TemplateCategory;
    thumbnail?: string;
    structure: any;
    defaultOptions: GenerationOptions;
}
export declare enum TemplateCategory {
    PRESENTATION = "presentation",
    REPORT = "report",
    WHITEPAPER = "whitepaper",
    CHANGE_MANAGEMENT = "change-management",
    PROJECT_CHARTER = "project-charter",
    STATUS_REPORT = "status-report",
    DATA_ANALYSIS = "data-analysis",
    MEETING_MINUTES = "meeting-minutes",
    SOP = "sop",
    CUSTOM = "custom"
}
export interface AIGenerationContext {
    prompt: string;
    documentType: DocumentType;
    targetAudience?: string;
    tone?: 'formal' | 'casual' | 'technical' | 'executive';
    length?: 'brief' | 'standard' | 'detailed';
    includeVisuals?: boolean;
    dataSource?: any;
}
//# sourceMappingURL=document-types.d.ts.map