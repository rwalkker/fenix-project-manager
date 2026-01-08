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
    ownerId: string;
    ownerUsername: string;
    ownerRole: string;
    slideCount?: number;
    generationTime?: number;
    warnings?: string[];
}
/**
 * Document Storage Service
 * Provides centralized, persistent document storage and retrieval
 */
export declare class DocumentStorageService {
    private config;
    private documents;
    private initialized;
    constructor();
    /**
     * Initialize storage service
     */
    initialize(): Promise<void>;
    /**
     * Load existing documents from filesystem and metadata
     */
    private loadExistingDocuments;
    /**
     * Load documents from metadata files
     */
    private loadFromMetadata;
    /**
     * Scan for files without metadata
     */
    private scanForOrphanedFiles;
    /**
     * Extract title from filename
     */
    private extractTitleFromFilename;
    /**
     * Create a new document entry
     */
    createDocument(type: 'powerpoint' | 'excel' | 'word', title: string, ownerId: string, ownerUsername: string, ownerRole: string, description?: string): Promise<string>;
    /**
     * Update document status and progress
     */
    updateDocument(id: string, updates: Partial<DocumentMetadata>): Promise<void>;
    /**
     * Store generated file and update metadata
     */
    storeFile(id: string, sourceFilePath: string, filename?: string): Promise<string>;
    /**
     * Get document metadata
     */
    getDocument(id: string): Promise<DocumentMetadata | null>;
    /**
     * List documents with filtering
     */
    listDocuments(userId?: string, userRole?: string, type?: string, status?: string, limit?: number): Promise<DocumentMetadata[]>;
    /**
     * Get file path for download
     */
    getFilePath(id: string, userId?: string, userRole?: string): Promise<string>;
    /**
     * Delete document and file
     */
    deleteDocument(id: string, userId?: string, userRole?: string): Promise<void>;
    /**
     * Clean up old documents
     */
    cleanup(): Promise<void>;
    /**
     * Get storage statistics
     */
    getStats(): Promise<{
        totalDocuments: number;
        totalSize: number;
        byType: Record<string, number>;
        byStatus: Record<string, number>;
    }>;
    /**
     * Save metadata to file
     */
    private saveMetadata;
    /**
     * Check if file exists
     */
    private fileExists;
    /**
     * Ensure service is initialized
     */
    private ensureInitialized;
}
/**
 * Get document storage service instance
 */
export declare function getDocumentStorageService(): DocumentStorageService;
//# sourceMappingURL=DocumentStorageService.d.ts.map