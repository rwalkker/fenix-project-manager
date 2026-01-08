import type { DocumentReference } from '../models/orchestration-types';
/**
 * Content Block
 */
export interface ContentBlock {
    id: string;
    content: string;
    type: 'text' | 'heading' | 'list' | 'table' | 'image' | 'chart';
    source: DocumentReference;
    usageCount: number;
    tags: string[];
    createdAt: Date;
    lastUsed: Date;
}
/**
 * Content Suggestion
 */
export interface ContentSuggestion {
    block: ContentBlock;
    relevance: number;
    rationale: string;
    context: string;
}
/**
 * Reuse Statistics
 */
export interface ReuseStatistics {
    totalBlocks: number;
    reusedBlocks: number;
    reuseRate: number;
    mostReusedBlocks: ContentBlock[];
    recentlyUsedBlocks: ContentBlock[];
}
/**
 * Content Reuse Service
 * Manages and suggests reusable content
 */
export declare class ContentReuseService {
    private contentBlocks;
    private contentIndex;
    constructor();
    /**
     * Add content block
     */
    addContentBlock(block: ContentBlock): Promise<void>;
    /**
     * Get content suggestions for query
     */
    getSuggestions(query: string, limit?: number): Promise<ContentSuggestion[]>;
    /**
     * Get suggestions by tags
     */
    getSuggestionsByTags(tags: string[], limit?: number): Promise<ContentSuggestion[]>;
    /**
     * Mark content as used
     */
    markAsUsed(blockId: string): Promise<void>;
    /**
     * Get most reused content
     */
    getMostReused(limit?: number): Promise<ContentBlock[]>;
    /**
     * Get recently used content
     */
    getRecentlyUsed(limit?: number): Promise<ContentBlock[]>;
    /**
     * Get content by type
     */
    getContentByType(type: ContentBlock['type'], limit?: number): Promise<ContentBlock[]>;
    /**
     * Get reuse statistics
     */
    getReuseStatistics(): Promise<ReuseStatistics>;
    /**
     * Search content
     */
    searchContent(query: string, options?: {
        type?: ContentBlock['type'];
        tags?: string[];
        minUsageCount?: number;
    }): Promise<ContentBlock[]>;
    /**
     * Delete content block
     */
    deleteContentBlock(blockId: string): Promise<void>;
    /**
     * Update content block
     */
    updateContentBlock(blockId: string, updates: Partial<ContentBlock>): Promise<void>;
    /**
     * Get content block by ID
     */
    getContentBlock(blockId: string): Promise<ContentBlock | null>;
    /**
     * Get all content blocks
     */
    getAllContentBlocks(): Promise<ContentBlock[]>;
    /**
     * Extract keywords from text
     */
    private extractKeywords;
    /**
     * Generate rationale for suggestion
     */
    private generateRationale;
    /**
     * Generate context for block
     */
    private generateContext;
}
/**
 * Create Content Reuse Service instance
 */
export declare function createContentReuseService(): ContentReuseService;
//# sourceMappingURL=ContentReuseService.d.ts.map