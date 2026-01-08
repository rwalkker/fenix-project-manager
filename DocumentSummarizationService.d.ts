/**
 * Summary Options
 */
export interface SummaryOptions {
    length?: 'short' | 'medium' | 'long';
    style?: 'bullets' | 'paragraph' | 'highlights';
    maxSentences?: number;
    maxWords?: number;
    includeKeywords?: boolean;
}
/**
 * Summary Result
 */
export interface SummaryResult {
    summary: string;
    originalLength: number;
    summaryLength: number;
    compressionRatio: number;
    keywords?: string[];
    confidence: number;
}
/**
 * Document Summarization Service
 * Generates summaries and extracts key information
 */
export declare class DocumentSummarizationService {
    constructor();
    /**
     * Generate summary
     */
    summarize(content: string, options?: SummaryOptions): Promise<string>;
    /**
     * Generate detailed summary result
     */
    summarizeDetailed(content: string, options?: SummaryOptions): Promise<SummaryResult>;
    /**
     * Extract key takeaways
     */
    extractTakeaways(content: string, count?: number): Promise<string[]>;
    /**
     * Create executive summary
     */
    createExecutiveSummary(content: string): Promise<string>;
    /**
     * Create bullet point summary
     */
    createBulletSummary(content: string, points?: number): Promise<string>;
    /**
     * Extract highlights
     */
    extractHighlights(content: string, count?: number): Promise<string[]>;
    /**
     * Extract sentences from text
     */
    private extractSentences;
    /**
     * Calculate target length based on original length
     */
    private calculateTargetLength;
    /**
     * Score sentences by importance
     */
    private scoreSentences;
    /**
     * Extract keywords from text
     */
    private extractKeywords;
    /**
     * Format summary based on style
     */
    private formatSummary;
    /**
     * Limit summary to maximum word count
     */
    private limitWords;
    /**
     * Calculate confidence score
     */
    private calculateConfidence;
}
/**
 * Create Document Summarization Service instance
 */
export declare function createDocumentSummarizationService(): DocumentSummarizationService;
//# sourceMappingURL=DocumentSummarizationService.d.ts.map