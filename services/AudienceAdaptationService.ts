// FENIX Project Manager - Audience Adaptation Service
// Adapt content for different audiences
// Created: January 6, 2026

/**
 * Audience Type
 */
export type AudienceType = 
  | 'executive' 
  | 'technical' 
  | 'business' 
  | 'general' 
  | 'external' 
  | 'internal';

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
export class AudienceAdaptationService {
  private audienceProfiles: Map<AudienceType, AudienceProfile>;

  constructor() {
    this.audienceProfiles = new Map();
    this.initializeAudienceProfiles();
  }

  /**
   * Adapt content for specific audience
   */
  async adaptContent(
    content: string,
    audience: AudienceType
  ): Promise<string> {
    const profile = this.getAudienceProfile(audience);

    // Apply adaptations based on profile
    let adapted = content;

    // Adjust detail level
    adapted = await this.adjustDetailLevelInternal(adapted, profile.detailLevel);

    // Adjust tone
    adapted = await this.adjustToneInternal(adapted, profile.tone);

    // Adjust technical level
    adapted = this.adjustTechnicalLevel(adapted, profile.technicalLevel);

    return adapted;
  }

  /**
   * Adapt content with detailed result
   */
  async adaptContentDetailed(
    content: string,
    audience: AudienceType
  ): Promise<AdaptationResult> {
    const originalContent = content;
    const changes: string[] = [];

    const profile = this.getAudienceProfile(audience);

    // Apply adaptations and track changes
    let adapted = content;

    // Adjust detail level
    const detailAdapted = await this.adjustDetailLevelInternal(adapted, profile.detailLevel);
    if (detailAdapted !== adapted) {
      changes.push(`Adjusted detail level to ${profile.detailLevel}`);
      adapted = detailAdapted;
    }

    // Adjust tone
    const toneAdapted = await this.adjustToneInternal(adapted, profile.tone);
    if (toneAdapted !== adapted) {
      changes.push(`Adjusted tone to ${profile.tone}`);
      adapted = toneAdapted;
    }

    // Adjust technical level
    const techAdapted = this.adjustTechnicalLevel(adapted, profile.technicalLevel);
    if (techAdapted !== adapted) {
      changes.push(`Adjusted technical level to ${profile.technicalLevel}`);
      adapted = techAdapted;
    }

    return {
      originalContent,
      adaptedContent: adapted,
      changes,
      audience,
      confidence: this.calculateAdaptationConfidence(changes)
    };
  }

  /**
   * Adjust detail level
   */
  async adjustDetailLevel(content: string, level: DetailLevel): Promise<string> {
    return this.adjustDetailLevelInternal(content, level);
  }

  /**
   * Adjust tone
   */
  async adjustTone(content: string, tone: ToneType): Promise<string> {
    return this.adjustToneInternal(content, tone);
  }

  /**
   * Get audience profile
   */
  getAudienceProfile(audience: AudienceType): AudienceProfile {
    const profile = this.audienceProfiles.get(audience);
    if (!profile) {
      throw new Error(`Unknown audience type: ${audience}`);
    }
    return profile;
  }

  /**
   * Get all audience types
   */
  getAllAudienceTypes(): AudienceType[] {
    return Array.from(this.audienceProfiles.keys());
  }

  /**
   * Recommend audience type from content
   */
  async recommendAudience(content: string): Promise<{
    audience: AudienceType;
    confidence: number;
    rationale: string;
  }> {
    const lowerContent = content.toLowerCase();

    // Check for executive indicators
    if (this.hasExecutiveIndicators(lowerContent)) {
      return {
        audience: 'executive',
        confidence: 0.8,
        rationale: 'Content contains high-level strategic language suitable for executives'
      };
    }

    // Check for technical indicators
    if (this.hasTechnicalIndicators(lowerContent)) {
      return {
        audience: 'technical',
        confidence: 0.85,
        rationale: 'Content contains technical terminology and detailed specifications'
      };
    }

    // Check for business indicators
    if (this.hasBusinessIndicators(lowerContent)) {
      return {
        audience: 'business',
        confidence: 0.75,
        rationale: 'Content focuses on business processes and operations'
      };
    }

    // Default to general
    return {
      audience: 'general',
      confidence: 0.6,
      rationale: 'Content is suitable for general audience'
    };
  }

  /**
   * Compare audience profiles
   */
  async compareAudiences(
    audience1: AudienceType,
    audience2: AudienceType
  ): Promise<{
    differences: string[];
    similarities: string[];
  }> {
    const profile1 = this.getAudienceProfile(audience1);
    const profile2 = this.getAudienceProfile(audience2);

    const differences: string[] = [];
    const similarities: string[] = [];

    // Compare detail levels
    if (profile1.detailLevel !== profile2.detailLevel) {
      differences.push(`Detail level: ${profile1.detailLevel} vs ${profile2.detailLevel}`);
    } else {
      similarities.push(`Same detail level: ${profile1.detailLevel}`);
    }

    // Compare tones
    if (profile1.tone !== profile2.tone) {
      differences.push(`Tone: ${profile1.tone} vs ${profile2.tone}`);
    } else {
      similarities.push(`Same tone: ${profile1.tone}`);
    }

    // Compare technical levels
    if (profile1.technicalLevel !== profile2.technicalLevel) {
      differences.push(`Technical level: ${profile1.technicalLevel} vs ${profile2.technicalLevel}`);
    } else {
      similarities.push(`Same technical level: ${profile1.technicalLevel}`);
    }

    return { differences, similarities };
  }

  // ========== Private Helper Methods ==========

  /**
   * Initialize audience profiles
   */
  private initializeAudienceProfiles(): void {
    // Executive audience
    this.audienceProfiles.set('executive', {
      type: 'executive',
      detailLevel: 'low',
      tone: 'formal',
      technicalLevel: 'low',
      visualComplexity: 'low',
      preferredFormats: ['powerpoint', 'word'],
      characteristics: [
        'High-level overview',
        'Strategic focus',
        'Business impact',
        'Key metrics',
        'Minimal technical details'
      ]
    });

    // Technical audience
    this.audienceProfiles.set('technical', {
      type: 'technical',
      detailLevel: 'high',
      tone: 'technical',
      technicalLevel: 'high',
      visualComplexity: 'high',
      preferredFormats: ['word', 'pdf'],
      characteristics: [
        'Detailed specifications',
        'Technical terminology',
        'Implementation details',
        'Code examples',
        'Architecture diagrams'
      ]
    });

    // Business audience
    this.audienceProfiles.set('business', {
      type: 'business',
      detailLevel: 'medium',
      tone: 'professional',
      technicalLevel: 'medium',
      visualComplexity: 'medium',
      preferredFormats: ['powerpoint', 'excel', 'word'],
      characteristics: [
        'Process focus',
        'Business metrics',
        'ROI and value',
        'Operational details',
        'Clear visualizations'
      ]
    });

    // General audience
    this.audienceProfiles.set('general', {
      type: 'general',
      detailLevel: 'medium',
      tone: 'friendly',
      technicalLevel: 'low',
      visualComplexity: 'low',
      preferredFormats: ['powerpoint', 'word'],
      characteristics: [
        'Clear language',
        'Accessible content',
        'Minimal jargon',
        'Simple visuals',
        'Practical examples'
      ]
    });

    // External audience
    this.audienceProfiles.set('external', {
      type: 'external',
      detailLevel: 'medium',
      tone: 'formal',
      technicalLevel: 'medium',
      visualComplexity: 'medium',
      preferredFormats: ['powerpoint', 'pdf'],
      characteristics: [
        'Professional presentation',
        'Brand compliance',
        'Clear messaging',
        'Polished visuals',
        'Appropriate detail'
      ]
    });

    // Internal audience
    this.audienceProfiles.set('internal', {
      type: 'internal',
      detailLevel: 'high',
      tone: 'casual',
      technicalLevel: 'medium',
      visualComplexity: 'medium',
      preferredFormats: ['powerpoint', 'word', 'excel'],
      characteristics: [
        'Detailed information',
        'Team context',
        'Internal processes',
        'Collaborative tone',
        'Comprehensive data'
      ]
    });
  }

  /**
   * Adjust detail level (internal implementation)
   */
  private adjustDetailLevelInternal(content: string, level: DetailLevel): string {
    switch (level) {
      case 'high':
        // Keep all details
        return content;

      case 'medium':
        // Remove some technical details
        return this.removeExcessiveDetails(content, 0.3);

      case 'low':
        // Keep only high-level information
        return this.removeExcessiveDetails(content, 0.6);

      default:
        return content;
    }
  }

  /**
   * Adjust tone (internal implementation)
   */
  private adjustToneInternal(content: string, tone: ToneType): string {
    // This is a simplified implementation
    // In a real system, this would use NLP to adjust language
    
    switch (tone) {
      case 'formal':
        return this.makeFormal(content);

      case 'casual':
        return this.makeCasual(content);

      case 'technical':
        return this.makeTechnical(content);

      case 'friendly':
        return this.makeFriendly(content);

      case 'professional':
        return this.makeProfessional(content);

      default:
        return content;
    }
  }

  /**
   * Adjust technical level
   */
  private adjustTechnicalLevel(content: string, level: 'high' | 'medium' | 'low'): string {
    switch (level) {
      case 'high':
        // Keep all technical terms
        return content;

      case 'medium':
        // Simplify some technical terms
        return this.simplifyTechnicalTerms(content, 0.3);

      case 'low':
        // Replace most technical terms with plain language
        return this.simplifyTechnicalTerms(content, 0.7);

      default:
        return content;
    }
  }

  /**
   * Remove excessive details
   */
  private removeExcessiveDetails(content: string, ratio: number): string {
    // Simplified implementation - in reality would use NLP
    const sentences = content.split(/[.!?]+/);
    const keepCount = Math.ceil(sentences.length * (1 - ratio));
    return sentences.slice(0, keepCount).join('. ') + '.';
  }

  /**
   * Make content more formal
   */
  private makeFormal(content: string): string {
    return content
      .replace(/\bcan't\b/gi, 'cannot')
      .replace(/\bwon't\b/gi, 'will not')
      .replace(/\bdon't\b/gi, 'do not')
      .replace(/\bisn't\b/gi, 'is not');
  }

  /**
   * Make content more casual
   */
  private makeCasual(content: string): string {
    return content
      .replace(/\bcannot\b/gi, "can't")
      .replace(/\bwill not\b/gi, "won't")
      .replace(/\bdo not\b/gi, "don't")
      .replace(/\bis not\b/gi, "isn't");
  }

  /**
   * Make content more technical
   */
  private makeTechnical(content: string): string {
    // Simplified - would use domain-specific terminology
    return content;
  }

  /**
   * Make content more friendly
   */
  private makeFriendly(content: string): string {
    // Simplified - would add conversational elements
    return content;
  }

  /**
   * Make content more professional
   */
  private makeProfessional(content: string): string {
    // Balance between formal and friendly
    return content;
  }

  /**
   * Simplify technical terms
   */
  private simplifyTechnicalTerms(content: string, _ratio: number): string {
    // Simplified implementation
    // In reality, would have a dictionary of technical terms and their plain language equivalents
    return content;
  }

  /**
   * Check for executive indicators
   */
  private hasExecutiveIndicators(content: string): boolean {
    const indicators = ['strategy', 'vision', 'leadership', 'executive', 'board', 'stakeholder', 'roi', 'value'];
    return indicators.some(indicator => content.includes(indicator));
  }

  /**
   * Check for technical indicators
   */
  private hasTechnicalIndicators(content: string): boolean {
    const indicators = ['api', 'architecture', 'implementation', 'code', 'technical', 'specification', 'algorithm'];
    return indicators.some(indicator => content.includes(indicator));
  }

  /**
   * Check for business indicators
   */
  private hasBusinessIndicators(content: string): boolean {
    const indicators = ['process', 'operations', 'business', 'workflow', 'efficiency', 'metrics', 'performance'];
    return indicators.some(indicator => content.includes(indicator));
  }

  /**
   * Calculate adaptation confidence
   */
  private calculateAdaptationConfidence(changes: string[]): number {
    // More changes = higher confidence that adaptation was needed
    if (changes.length === 0) {
      return 0.5; // No changes needed
    } else if (changes.length === 1) {
      return 0.7;
    } else if (changes.length === 2) {
      return 0.85;
    } else {
      return 0.95;
    }
  }
}

/**
 * Create Audience Adaptation Service instance
 */
export function createAudienceAdaptationService(): AudienceAdaptationService {
  return new AudienceAdaptationService();
}
