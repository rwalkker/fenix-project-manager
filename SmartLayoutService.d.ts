export interface LayoutSuggestion {
    layout: 'title' | 'content' | 'two-column' | 'comparison' | 'image-focus' | 'section-header' | 'blank';
    confidence: number;
    reason: string;
    alternatives?: Array<{
        layout: string;
        confidence: number;
        reason: string;
    }>;
}
export interface ComplexityAnalysis {
    score: number;
    level: 'simple' | 'moderate' | 'complex' | 'very-complex';
    factors: {
        wordCount: number;
        sentenceCount: number;
        avgWordsPerSentence: number;
        longWords: number;
        bulletPoints: number;
        images: number;
    };
    suggestions: string[];
}
export interface ContentAnalysis {
    type: 'title' | 'content' | 'list' | 'comparison' | 'visual' | 'data' | 'mixed';
    keywords: string[];
    sentiment: 'positive' | 'neutral' | 'negative';
    hasNumbers: boolean;
    hasComparison: boolean;
    hasList: boolean;
    hasQuestions: boolean;
}
/**
 * Smart Layout Service
 * Provides intelligent layout suggestions for presentations
 */
export declare class SmartLayoutService {
    private tfidf;
    constructor();
    /**
     * Suggest optimal slide layout based on content
     */
    suggestLayout(content: {
        title?: string;
        text?: string;
        images?: number;
        bullets?: number;
        charts?: number;
        tables?: number;
    }): LayoutSuggestion;
    /**
     * Check if content is a title slide
     */
    private isTitleSlide;
    /**
     * Check if content is a section header
     */
    private isSectionHeader;
    /**
     * Check if content is image-focused
     */
    private isImageFocused;
    /**
     * Detect comparison keywords
     */
    private detectComparison;
    /**
     * Check if text has multiple lists
     */
    private hasMultipleLists;
    /**
     * Calculate content complexity score
     */
    calculateComplexity(content: string): ComplexityAnalysis;
    /**
     * Generate complexity suggestions
     */
    private generateComplexitySuggestions;
    /**
     * Analyze content type and characteristics
     */
    analyzeContent(content: {
        title?: string;
        text?: string;
    }): ContentAnalysis;
    /**
     * Detect content type
     */
    private detectContentType;
    /**
     * Extract keywords
     */
    private extractKeywords;
    /**
     * Simple sentiment analysis
     */
    private analyzeSentiment;
    /**
     * Get empty complexity analysis
     */
    private getEmptyComplexity;
    /**
     * Suggest slide improvements
     */
    suggestImprovements(content: {
        title?: string;
        text?: string;
        images?: number;
        bullets?: number;
    }): string[];
}
//# sourceMappingURL=SmartLayoutService.d.ts.map