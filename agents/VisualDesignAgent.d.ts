import { type DesignElement } from '../services/DesignSystemService';
import type { DesignSystem, DesignValidationResult, ColorPalette } from '../models/design-system-types';
/**
 * Visual Design Agent
 * Provides AI-powered design analysis, recommendations, and generation
 */
export declare class VisualDesignAgent {
    private designSystem;
    private designSystemService;
    private bedrock;
    constructor(designSystem?: DesignSystem);
    /**
     * Analyze design and provide comprehensive feedback
     */
    analyzeDesign(elements: DesignElement[]): Promise<DesignAnalysisResult>;
    /**
     * Get AI-powered design critique
     */
    private getAICritique;
    /**
     * Generate design recommendations
     */
    private generateRecommendations;
    /**
     * Get AI-generated recommendations
     */
    private getAIRecommendations;
    /**
     * Calculate design metrics
     */
    private calculateDesignMetrics;
    /**
     * Generate color palette from description
     */
    generateColorPalette(description: string): Promise<ColorPalette>;
    /**
     * Suggest font pairings
     */
    suggestFontPairings(context: string): Promise<FontPairing[]>;
    /**
     * Generate layout suggestions
     */
    suggestLayout(content: LayoutContent): Promise<LayoutSuggestion[]>;
    /**
     * Optimize text for readability
     */
    optimizeText(text: string, context: string): Promise<TextOptimization>;
    /**
     * Generate alt text for images
     */
    generateAltText(imageDescription: string, context: string): Promise<string>;
    /**
     * Check brand compliance
     */
    checkBrandCompliance(elements: DesignElement[]): Promise<BrandComplianceResult>;
    /**
     * Get AI brand compliance analysis
     */
    private getAIBrandAnalysis;
    /**
     * Check if color is valid brand color
     */
    private isValidBrandColor;
}
/**
 * Design Analysis Result
 */
export interface DesignAnalysisResult {
    validation: DesignValidationResult;
    critique: string;
    recommendations: DesignRecommendation[];
    metrics: DesignMetrics;
    score: number;
}
export interface DesignRecommendation {
    type: 'fix' | 'improve' | 'enhance';
    priority: 'high' | 'medium' | 'low';
    title: string;
    description: string;
    impact: string;
}
export interface DesignMetrics {
    totalElements: number;
    uniqueColors: number;
    uniqueFontSizes: number;
    interactiveElements: number;
    imagesWithAlt: number;
    imagesWithoutAlt: number;
    colorDiversity: number;
    typographyConsistency: number;
}
export interface FontPairing {
    heading: string;
    body: string;
    rationale: string;
}
export interface LayoutContent {
    type: string;
    elements: string[];
    priority?: 'visual' | 'content' | 'balanced';
}
export interface LayoutSuggestion {
    name: string;
    description: string;
    structure: string;
    bestFor: string;
}
export interface TextOptimization {
    optimized: string;
    improvements: string[];
    readabilityScore: number;
}
export interface BrandComplianceResult {
    compliant: boolean;
    issues: string[];
    suggestions: string[];
    score: number;
}
/**
 * Create visual design agent instance
 */
export declare function createVisualDesignAgent(designSystem?: DesignSystem): VisualDesignAgent;
//# sourceMappingURL=VisualDesignAgent.d.ts.map