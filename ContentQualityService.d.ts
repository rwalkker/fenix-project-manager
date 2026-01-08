export interface QualityReport {
    readability: {
        score: number;
        grade: number;
        interpretation: string;
    };
    style: {
        issues: Array<{
            reason: string;
            index: number;
            offset: number;
        }>;
        score: number;
    };
    sentiment: {
        score: number;
        comparative: number;
        tone: 'positive' | 'neutral' | 'negative';
        tokens: {
            positive: string[];
            negative: string[];
        };
    };
    keywords: string[];
    statistics: {
        wordCount: number;
        sentenceCount: number;
        paragraphCount: number;
        avgWordsPerSentence: number;
        avgSentencesPerParagraph: number;
    };
    suggestions: string[];
    overallScore: number;
}
/**
 * Content Quality Service
 * Provides comprehensive document quality analysis
 */
export declare class ContentQualityService {
    private sentiment;
    private tokenizer;
    private tfidf;
    constructor();
    /**
     * Analyze document content quality
     */
    analyzeContent(text: string): QualityReport;
    /**
     * Calculate text statistics
     */
    private calculateStatistics;
    /**
     * Analyze readability using Flesch Reading Ease
     */
    private analyzeReadability;
    /**
     * Count syllables in text (simplified algorithm)
     */
    private countSyllables;
    /**
     * Interpret readability score
     */
    private interpretReadability;
    /**
     * Analyze writing style
     */
    private analyzeStyle;
    /**
     * Interpret sentiment score
     */
    private interpretSentiment;
    /**
     * Extract keywords using TF-IDF
     */
    private extractKeywords;
    /**
     * Generate improvement suggestions
     */
    private generateSuggestions;
    /**
     * Calculate overall quality score
     */
    private calculateOverallScore;
    /**
     * Get empty report for invalid input
     */
    private getEmptyReport;
    /**
     * Compare two documents
     */
    compareDocuments(text1: string, text2: string): {
        similarity: number;
        differences: {
            readability: number;
            style: number;
            sentiment: number;
        };
        recommendation: string;
    };
}
//# sourceMappingURL=ContentQualityService.d.ts.map