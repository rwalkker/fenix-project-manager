/**
 * Design Critique Prompts
 */
export declare const DesignCritiquePrompts: {
    /**
     * Analyze overall design quality
     */
    analyzeDesign: (designDescription: string) => string;
    /**
     * Suggest design improvements
     */
    suggestImprovements: (currentDesign: string, goals: string[]) => string;
    /**
     * Compare design alternatives
     */
    compareDesigns: (design1: string, design2: string, criteria: string[]) => string;
};
/**
 * Layout Generation Prompts
 */
export declare const LayoutGenerationPrompts: {
    /**
     * Generate layout suggestions
     */
    generateLayout: (contentType: string, requirements: string[]) => string;
    /**
     * Optimize existing layout
     */
    optimizeLayout: (currentLayout: string, issues: string[]) => string;
    /**
     * Generate responsive layout
     */
    generateResponsiveLayout: (desktopLayout: string, breakpoints: string[]) => string;
};
/**
 * Content Optimization Prompts
 */
export declare const ContentOptimizationPrompts: {
    /**
     * Optimize text for readability
     */
    optimizeText: (text: string, audience: string, purpose: string) => string;
    /**
     * Generate compelling headlines
     */
    generateHeadlines: (topic: string, tone: string, count: number) => string;
    /**
     * Improve bullet points
     */
    improveBulletPoints: (bullets: string[], context: string) => string;
    /**
     * Generate executive summary
     */
    generateExecutiveSummary: (fullContent: string, maxWords: number) => string;
};
/**
 * Accessibility Analysis Prompts
 */
export declare const AccessibilityAnalysisPrompts: {
    /**
     * Analyze accessibility compliance
     */
    analyzeAccessibility: (designElements: string) => string;
    /**
     * Generate alt text for images
     */
    generateAltText: (imageDescription: string, context: string) => string;
    /**
     * Suggest accessibility improvements
     */
    suggestAccessibilityImprovements: (currentState: string, targetLevel: string) => string;
};
/**
 * Brand Compliance Prompts
 */
export declare const BrandCompliancePrompts: {
    /**
     * Check brand compliance
     */
    checkBrandCompliance: (design: string, brandGuidelines: string) => string;
    /**
     * Suggest brand-compliant alternatives
     */
    suggestBrandAlternatives: (currentElement: string, brandGuidelines: string) => string;
    /**
     * Generate brand-aligned content
     */
    generateBrandContent: (topic: string, brandVoice: string, contentType: string) => string;
};
/**
 * Color Palette Generation Prompts
 */
export declare const ColorPalettePrompts: {
    /**
     * Generate color palette from description
     */
    generatePalette: (description: string, mood: string) => string;
    /**
     * Suggest color harmonies
     */
    suggestHarmonies: (baseColor: string) => string;
};
/**
 * Typography Pairing Prompts
 */
export declare const TypographyPairingPrompts: {
    /**
     * Suggest font pairings
     */
    suggestFontPairings: (primaryFont: string, purpose: string) => string;
};
/**
 * Helper function to format prompts
 */
export declare function formatPrompt(template: string, variables: Record<string, string>): string;
/**
 * Get all prompt categories
 */
export declare function getAllPromptCategories(): string[];
/**
 * Get prompts by category
 */
export declare function getPromptsByCategory(category: string): Record<string, Function>;
//# sourceMappingURL=AIPrompts.d.ts.map