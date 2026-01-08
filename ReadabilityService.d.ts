/**
 * Readability Score
 */
export interface ReadabilityScore {
    fleschKincaid: number;
    fleschReadingEase: number;
    gradeLevel: string;
    difficulty: 'very-easy' | 'easy' | 'moderate' | 'difficult' | 'very-difficult';
    averageSentenceLength: number;
    averageWordLength: number;
    complexWordPercentage: number;
}
/**
 * Readability Improvement
 */
export interface ReadabilityImprovement {
    type: 'sentence-length' | 'word-choice' | 'structure' | 'clarity';
    severity: 'high' | 'medium' | 'low';
    location: string;
    issue: string;
    suggestion: string;
}
/**
 * Simplification Options
 */
export interface SimplificationOptions {
    targetGradeLevel: number;
    preserveTechnicalTerms: boolean;
    maxSentenceLength?: number;
}
/**
 * Readability Analysis Result
 */
export interface ReadabilityAnalysisResult {
    score: ReadabilityScore;
    improvements: ReadabilityImprovement[];
    complexSentences: string[];
    complexWords: string[];
    summary: string;
}
/**
 * Readability Service
 * Calculates readability scores and suggests improvements
 */
export declare class ReadabilityService {
    /**
     * Calculate readability score
     */
    calculateScore(content: string): Promise<ReadabilityScore>;
    /**
     * Suggest improvements
     */
    suggestImprovements(content: string): Promise<ReadabilityImprovement[]>;
    /**
     * Simplify content
     */
    simplifyContent(content: string, options: SimplificationOptions): Promise<string>;
    /**
     * Analyze readability
     */
    analyze(content: string): Promise<ReadabilityAnalysisResult>;
    /**
     * Optimize for target audience
     */
    optimizeForAudience(content: string, audienceLevel: 'elementary' | 'high-school' | 'college' | 'expert'): Promise<string>;
    private splitIntoSentences;
    private splitIntoWords;
    private countSyllables;
    private countTotalSyllables;
    private isComplexWord;
    private getGradeLevel;
    private getDifficulty;
    private hasPassiveVoice;
    private findUnclearPhrases;
    private suggestSimplerWord;
    private breakLongSentence;
    private replaceComplexWords;
    private truncate;
    private generateSummary;
}
//# sourceMappingURL=ReadabilityService.d.ts.map