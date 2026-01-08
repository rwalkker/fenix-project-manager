import type { ProjectContext, DocumentFormat } from '../models/orchestration-types';
import type { UserPreferences } from './UserPreferenceService';
/**
 * Default Settings
 */
export interface DefaultSettings {
    template: string;
    format: DocumentFormat;
    style: {
        colorScheme: string;
        fontFamily: string;
        layoutStyle: string;
    };
    content: {
        detailLevel: 'high' | 'medium' | 'low';
        tone: 'formal' | 'casual' | 'technical';
    };
    metadata: {
        confidence: number;
        rationale: string;
        sources: string[];
    };
}
/**
 * Context Factors
 */
export interface ContextFactors {
    userPreferences?: UserPreferences;
    projectContext?: ProjectContext;
    documentType?: string;
    audience?: string;
    purpose?: string;
}
/**
 * Smart Defaults Service
 * Intelligently determines optimal defaults
 */
export declare class SmartDefaultsService {
    private defaultTemplates;
    private contextRules;
    constructor();
    /**
     * Get smart defaults
     */
    getDefaults(factors: ContextFactors): Promise<DefaultSettings>;
    /**
     * Get defaults for document type
     */
    getDefaultsForType(documentType: string, factors?: Partial<ContextFactors>): Promise<DefaultSettings>;
    /**
     * Get defaults for audience
     */
    getDefaultsForAudience(audience: string, factors?: Partial<ContextFactors>): Promise<DefaultSettings>;
    /**
     * Get template recommendations
     */
    getTemplateRecommendations(format: DocumentFormat, factors?: ContextFactors): Promise<string[]>;
    /**
     * Explain defaults
     */
    explainDefaults(settings: DefaultSettings): Promise<string>;
    /**
     * Compare defaults
     */
    compareDefaults(settings1: DefaultSettings, settings2: DefaultSettings): Promise<{
        differences: string[];
        similarities: string[];
    }>;
    /**
     * Initialize default templates
     */
    private initializeDefaults;
    /**
     * Initialize context rules
     */
    private initializeContextRules;
    /**
     * Get base defaults
     */
    private getBaseDefaults;
    /**
     * Apply user preferences
     */
    private applyUserPreferences;
    /**
     * Apply project context
     */
    private applyProjectContext;
    /**
     * Apply document type rules
     */
    private applyDocumentTypeRules;
    /**
     * Apply audience rules
     */
    private applyAudienceRules;
    /**
     * Apply purpose rules
     */
    private applyPurposeRules;
    /**
     * Calculate metadata
     */
    private calculateMetadata;
    /**
     * Generate rationale
     */
    private generateRationale;
}
/**
 * Create Smart Defaults Service instance
 */
export declare function createSmartDefaultsService(): SmartDefaultsService;
//# sourceMappingURL=SmartDefaultsService.d.ts.map