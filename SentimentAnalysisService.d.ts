/**
 * Sentiment Type
 */
export type SentimentType = 'positive' | 'neutral' | 'negative' | 'mixed';
/**
 * Tone Type
 */
export type ToneType = 'formal' | 'casual' | 'technical' | 'persuasive' | 'informative' | 'emotional';
/**
 * Sentiment Score
 */
export interface SentimentScore {
    overall: SentimentType;
    score: number;
    confidence: number;
    breakdown: {
        positive: number;
        neutral: number;
        negative: number;
    };
}
/**
 * Tone Analysis
 */
export interface ToneAnalysis {
    primary: ToneType;
    secondary?: ToneType;
    confidence: number;
    characteristics: string[];
}
/**
 * Emotional Language
 */
export interface EmotionalLanguage {
    hasEmotionalContent: boolean;
    emotionalWords: string[];
    intensity: number;
    emotions: {
        joy: number;
        anger: number;
        sadness: number;
        fear: number;
        surprise: number;
    };
}
/**
 * Sentiment Analysis Result
 */
export interface SentimentAnalysisResult {
    sentiment: SentimentScore;
    tone: ToneAnalysis;
    emotionalLanguage: EmotionalLanguage;
    suggestions: string[];
    appropriateForAudience: boolean;
}
/**
 * Tone Adjustment Options
 */
export interface ToneAdjustmentOptions {
    targetTone: ToneType;
    targetSentiment?: SentimentType;
    preserveMeaning: boolean;
}
/**
 * Sentiment Analysis Service
 * Analyzes tone, sentiment, and emotional language in content
 */
export declare class SentimentAnalysisService {
    private positiveWords;
    private negativeWords;
    private emotionalWords;
    /**
     * Analyze sentiment of content
     */
    analyzeSentiment(content: string): Promise<SentimentScore>;
    /**
     * Analyze tone of content
     */
    analyzeTone(content: string): Promise<ToneAnalysis>;
    /**
     * Identify emotional language
     */
    identifyEmotionalLanguage(content: string): Promise<EmotionalLanguage>;
    /**
     * Perform complete sentiment analysis
     */
    analyze(content: string, audienceType?: string): Promise<SentimentAnalysisResult>;
    /**
     * Suggest tone adjustments
     */
    suggestToneAdjustments(content: string, options: ToneAdjustmentOptions): Promise<string[]>;
    /**
     * Flag potentially problematic language
     */
    flagProblematicLanguage(content: string): Promise<string[]>;
    private tokenize;
    private determineSentiment;
    private calculateFormalityScore;
    private calculateCasualityScore;
    private calculateTechnicalScore;
    private calculatePersuasivenessScore;
    private calculateInformativenessScore;
    private calculateEmotionalScore;
    private categorizeEmotions;
    private generateSuggestions;
    private checkAudienceAppropriate;
}
//# sourceMappingURL=SentimentAnalysisService.d.ts.map