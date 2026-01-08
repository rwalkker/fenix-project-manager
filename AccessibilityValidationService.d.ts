export interface AccessibilityIssue {
    type: 'contrast' | 'alt-text' | 'reading-order' | 'aria' | 'touch-target';
    severity: 'critical' | 'serious' | 'moderate' | 'minor';
    element: string;
    message: string;
    suggestion: string;
    wcagCriterion?: string;
}
export interface ContrastResult {
    pass: boolean;
    ratio: number;
    required: number;
    level: 'AA' | 'AAA';
}
export interface AccessiblePalette {
    primary: string;
    secondary: string;
    text: string;
    background: string;
    success: string;
    warning: string;
    error: string;
    info: string;
}
/**
 * Accessibility Validation Service
 * Provides WCAG 2.1 compliance checking and accessible design generation
 */
export declare class AccessibilityValidationService {
    /**
     * Validate color contrast for WCAG compliance
     */
    validateColorContrast(foreground: string, background: string, level?: 'AA' | 'AAA', fontSize?: number): ContrastResult;
    /**
     * Validate slide/document accessibility
     */
    validateElement(element: {
        background?: string;
        textColor?: string;
        fontSize?: number;
        images?: Array<{
            altText?: string;
            src: string;
        }>;
        interactive?: boolean;
        width?: number;
        height?: number;
    }): Promise<AccessibilityIssue[]>;
    /**
     * Generate accessible color palette from brand color
     */
    generateAccessiblePalette(brandColor: string): AccessiblePalette;
    /**
     * Generate color scale with guaranteed accessibility
     */
    generateAccessibleScale(baseColor: string, steps?: number): string[];
    /**
     * Suggest accessible color combinations
     */
    suggestAccessibleCombinations(colors: string[]): Array<{
        foreground: string;
        background: string;
        contrast: number;
        rating: 'AAA' | 'AA' | 'Fail';
    }>;
    /**
     * Calculate accessibility score (0-100)
     */
    calculateAccessibilityScore(issues: AccessibilityIssue[]): number;
    /**
     * Generate accessibility report
     */
    generateReport(issues: AccessibilityIssue[]): {
        score: number;
        level: 'Excellent' | 'Good' | 'Fair' | 'Poor';
        summary: string;
        criticalCount: number;
        seriousCount: number;
        moderateCount: number;
        minorCount: number;
    };
}
//# sourceMappingURL=AccessibilityValidationService.d.ts.map