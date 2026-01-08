/**
 * Citation Style
 */
export type CitationStyle = 'APA' | 'MLA' | 'Chicago' | 'Harvard' | 'IEEE';
/**
 * Source Type
 */
export type SourceType = 'book' | 'article' | 'website' | 'journal' | 'report' | 'conference' | 'other';
/**
 * Citation Source
 */
export interface CitationSource {
    id: string;
    type: SourceType;
    title: string;
    authors: string[];
    year?: number;
    publisher?: string;
    url?: string;
    doi?: string;
    pages?: string;
    volume?: string;
    issue?: string;
    accessDate?: Date;
    metadata?: Record<string, any>;
}
/**
 * Citation Reference
 */
export interface CitationReference {
    id: string;
    sourceId: string;
    location: string;
    page?: number;
    context?: string;
}
/**
 * Bibliography Entry
 */
export interface BibliographyEntry {
    sourceId: string;
    formatted: string;
    style: CitationStyle;
}
/**
 * Citation Validation Result
 */
export interface CitationValidationResult {
    valid: boolean;
    issues: string[];
    missingFields: string[];
    suggestions: string[];
}
/**
 * Plagiarism Check Result
 */
export interface PlagiarismCheckResult {
    suspicious: boolean;
    matches: {
        text: string;
        sourceId?: string;
        similarity: number;
    }[];
    overallSimilarity: number;
}
/**
 * Citation Management Service
 * Tracks sources, manages citations, and generates bibliographies
 */
export declare class CitationManagementService {
    private sources;
    private references;
    private sourceIdCounter;
    private referenceIdCounter;
    /**
     * Add a source
     */
    addSource(source: Omit<CitationSource, 'id'>): Promise<string>;
    /**
     * Get a source
     */
    getSource(sourceId: string): Promise<CitationSource | undefined>;
    /**
     * Update a source
     */
    updateSource(sourceId: string, updates: Partial<CitationSource>): Promise<void>;
    /**
     * Delete a source
     */
    deleteSource(sourceId: string): Promise<void>;
    /**
     * Track a citation reference
     */
    addReference(sourceId: string, location: string, context?: string): Promise<string>;
    /**
     * Get all references for a source
     */
    getReferences(sourceId: string): Promise<CitationReference[]>;
    /**
     * Generate bibliography
     */
    generateBibliography(style?: CitationStyle): Promise<BibliographyEntry[]>;
    /**
     * Format a single citation
     */
    formatCitation(sourceId: string, style?: CitationStyle): Promise<string>;
    /**
     * Validate citation format
     */
    validateCitation(sourceId: string): Promise<CitationValidationResult>;
    /**
     * Check for plagiarism
     */
    checkPlagiarism(content: string): Promise<PlagiarismCheckResult>;
    /**
     * Maintain citation consistency
     */
    checkConsistency(style: CitationStyle): Promise<string[]>;
    /**
     * Get citation statistics
     */
    getStatistics(): Promise<{
        totalSources: number;
        totalReferences: number;
        sourcesByType: Record<SourceType, number>;
        mostCitedSources: {
            sourceId: string;
            title: string;
            count: number;
        }[];
    }>;
    private formatCitationByStyle;
    private formatAPA;
    private formatMLA;
    private formatChicago;
    private formatHarvard;
    private formatIEEE;
    private formatAuthorsAPA;
    private formatAuthorsMLA;
    private formatAuthorsChicago;
    private formatAuthorsIEEE;
    private splitIntoSentences;
    private getSourceText;
    private calculateSimilarity;
    private generateSourceId;
    private generateReferenceId;
}
//# sourceMappingURL=CitationManagementService.d.ts.map