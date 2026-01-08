/**
 * Audience Type
 */
export type AudienceType = 'executive' | 'technical' | 'business' | 'general' | 'external' | 'internal';
/**
 * Detail Level
 */
export type DetailLevel = 'high' | 'medium' | 'low';
/**
 * Tone Type
 */
export type ToneType = 'formal' | 'casual' | 'technical' | 'friendly' | 'professional';
/**
 * Audience Profile
 */
export interface AudienceProfile {
    type: AudienceType;
    detailLevel: DetailLevel;
    tone: ToneType;
    technicalLevel: 'high' | 'medium' | 'low';
    visualComplexity: 'high' | 'medium' | 'low';
    preferredFormats: string[];
    characteristics: string[];
}
/**
 * Adaptation Result
 */
export interface AdaptationResult {
    originalContent: string;
    adaptedContent: string;
    changes: string[];
    audience: AudienceType;
    confidence: number;
}
/**
 * Audience Adaptation Service
 * Adapts content for different audience types
 */
export declare class AudienceAdaptationService {
    private audienceProfiles;
    constructor();
    /**
     * Adapt content for specific audience
     */
    adaptContent(content: string, audience: AudienceType): Promise<string>;
    /**
     * Adapt content with detailed result
     */
    adaptContentDetailed(content: string, audience: AudienceType): Promise<AdaptationResult>;
    /**
     * Adjust detail level
     */
    adjustDetailLevel(content: string, level: DetailLevel): Promise<string>;
    /**
     * Adjust tone
     */
    adjustTone(content: string, tone: ToneType): Promise<string>;
    /**
     * Get audience profile
     */
    getAudienceProfile(audience: AudienceType): AudienceProfile;
    /**
     * Get all audience types
     */
    getAllAudienceTypes(): AudienceType[];
    /**
     * Recommend audience type from content
     */
    recommendAudience(content: string): Promise<{
        audience: AudienceType;
        confidence: number;
        rationale: string;
    }>;
    /**
     * Compare audience profiles
     */
    compareAudiences(audience1: AudienceType, audience2: AudienceType): Promise<{
        differences: string[];
        similarities: string[];
    }>;
    /**
     * Initialize audience profiles
     */
    private initializeAudienceProfiles;
    /**
     * Adjust detail level (internal implementation)
     */
    private adjustDetailLevelInternal;
    /**
     * Adjust tone (internal implementation)
     */
    private adjustToneInternal;
    /**
     * Adjust technical level
     */
    private adjustTechnicalLevel;
    /**
     * Remove excessive details
     */
    private removeExcessiveDetails;
    /**
     * Make content more formal
     */
    private makeFormal;
    /**
     * Make content more casual
     */
    private makeCasual;
    /**
     * Make content more technical
     */
    private makeTechnical;
    /**
     * Make content more friendly
     */
    private makeFriendly;
    /**
     * Make content more professional
     */
    private makeProfessional;
    /**
     * Simplify technical terms
     */
    private simplifyTechnicalTerms;
    /**
     * Check for executive indicators
     */
    private hasExecutiveIndicators;
    /**
     * Check for technical indicators
     */
    private hasTechnicalIndicators;
    /**
     * Check for business indicators
     */
    private hasBusinessIndicators;
    /**
     * Calculate adaptation confidence
     */
    private calculateAdaptationConfidence;
}
/**
 * Create Audience Adaptation Service instance
 */
export declare function createAudienceAdaptationService(): AudienceAdaptationService;
//# sourceMappingURL=AudienceAdaptationService.d.ts.map