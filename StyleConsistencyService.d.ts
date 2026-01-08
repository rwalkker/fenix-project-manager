/**
 * Style Guide
 */
export interface StyleGuide {
    id: string;
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        text: string;
        background: string;
    };
    typography: {
        headingFont: string;
        bodyFont: string;
        codeFont: string;
        headingSizes: Record<string, number>;
    };
    spacing: {
        small: number;
        medium: number;
        large: number;
    };
    rules: StyleRule[];
}
/**
 * Style Rule
 */
export interface StyleRule {
    id: string;
    name: string;
    description: string;
    category: 'color' | 'typography' | 'spacing' | 'layout' | 'general';
    severity: 'error' | 'warning' | 'info';
    check: (content: any) => boolean;
}
/**
 * Style Violation
 */
export interface StyleViolation {
    ruleId: string;
    ruleName: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
    location?: string;
    suggestion?: string;
}
/**
 * Style Check Result
 */
export interface StyleCheckResult {
    passed: boolean;
    violations: StyleViolation[];
    score: number;
    summary: string;
}
/**
 * Style Consistency Service
 * Validates and enforces style consistency
 */
export declare class StyleConsistencyService {
    private styleGuides;
    private defaultGuideId;
    constructor();
    /**
     * Check style consistency
     */
    checkStyle(content: any, guideId?: string): Promise<StyleCheckResult>;
    /**
     * Apply style guide to content
     */
    applyStyle(content: any, guideId?: string): Promise<any>;
    /**
     * Get style guide
     */
    getStyleGuide(guideId: string): StyleGuide;
    /**
     * Create custom style guide
     */
    createStyleGuide(guide: StyleGuide): Promise<void>;
    /**
     * Update style guide
     */
    updateStyleGuide(guideId: string, updates: Partial<StyleGuide>): Promise<void>;
    /**
     * Delete style guide
     */
    deleteStyleGuide(guideId: string): Promise<void>;
    /**
     * Get all style guides
     */
    getAllStyleGuides(): StyleGuide[];
    /**
     * Set default style guide
     */
    setDefaultStyleGuide(guideId: string): void;
    /**
     * Compare two style guides
     */
    compareStyleGuides(guideId1: string, guideId2: string): Promise<{
        differences: string[];
        similarities: string[];
    }>;
    /**
     * Validate color contrast
     */
    validateColorContrast(foreground: string, background: string): Promise<{
        ratio: number;
        passes: boolean;
        level: 'AAA' | 'AA' | 'fail';
    }>;
    /**
     * Initialize default style guide
     */
    private initializeDefaultStyleGuide;
    /**
     * Calculate style score
     */
    private calculateStyleScore;
    /**
     * Generate summary
     */
    private generateSummary;
    /**
     * Get suggestion for rule
     */
    private getSuggestion;
    /**
     * Calculate contrast ratio
     */
    private calculateContrastRatio;
}
/**
 * Create Style Consistency Service instance
 */
export declare function createStyleConsistencyService(): StyleConsistencyService;
//# sourceMappingURL=StyleConsistencyService.d.ts.map