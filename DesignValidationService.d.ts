import type { DesignElement } from '../models/design-system-types';
/**
 * Validation rule severity levels
 */
export type ValidationSeverity = 'error' | 'warning' | 'info';
/**
 * Validation rule category
 */
export type ValidationCategory = 'accessibility' | 'branding' | 'typography' | 'color' | 'layout' | 'content';
/**
 * Validation rule definition
 */
export interface ValidationRule {
    id: string;
    name: string;
    category: ValidationCategory;
    severity: ValidationSeverity;
    description: string;
    validate: (context: ValidationContext) => ValidationIssue[];
}
/**
 * Typography style definition
 */
export interface TypographyStyle {
    size: number;
    family: string;
    weight: string | number;
    lineHeight?: number;
}
/**
 * Validation context
 */
export interface ValidationContext {
    element?: DesignElement;
    colors?: string[];
    typography?: TypographyStyle[];
    content?: string;
    metadata?: Record<string, any>;
}
/**
 * Validation issue
 */
export interface ValidationIssue {
    ruleId: string;
    severity: ValidationSeverity;
    category: ValidationCategory;
    message: string;
    location?: string;
    suggestion?: string;
    autoFixable?: boolean;
}
/**
 * Comprehensive validation result
 */
export interface ComprehensiveValidationResult {
    valid: boolean;
    score: number;
    errors: ValidationIssue[];
    warnings: ValidationIssue[];
    info: ValidationIssue[];
    summary: {
        totalIssues: number;
        errorCount: number;
        warningCount: number;
        infoCount: number;
        categoryCounts: Record<ValidationCategory, number>;
    };
    recommendations: string[];
}
/**
 * Design Validation Service
 * Provides comprehensive validation for design elements and documents
 */
export declare class DesignValidationService {
    private designSystem;
    private rules;
    constructor();
    /**
     * Initialize validation rules
     */
    private initializeRules;
    /**
     * Validate design element
     */
    validate(context: ValidationContext): ComprehensiveValidationResult;
    /**
     * Validate design element (convenience method)
     */
    validateDesignElement(element: DesignElement): {
        issues: ValidationIssue[];
        score: number;
    };
    /**
     * Validate color contrast (WCAG 2.1)
     */
    validateColorContrast(foreground: string, background: string, fontSize?: number, isBold?: boolean): ValidationIssue[];
    /**
     * Validate typography
     */
    validateTypography(style: TypographyStyle): ValidationIssue[];
    /**
     * Validate brand compliance
     */
    validateBrandCompliance(colors: string[]): ValidationIssue[];
    /**
     * Validate layout spacing
     */
    validateLayoutSpacing(spacing: number): ValidationIssue[];
    /**
     * Validate content accessibility
     */
    validateContentAccessibility(content: string, type: 'heading' | 'body' | 'alt'): ValidationIssue[];
    /**
     * Get accessibility validation rules
     */
    private getAccessibilityRules;
    /**
     * Get branding validation rules
     */
    private getBrandingRules;
    /**
     * Get typography validation rules
     */
    private getTypographyRules;
    /**
     * Get color validation rules
     */
    private getColorRules;
    /**
     * Get layout validation rules
     */
    private getLayoutRules;
    /**
     * Get content validation rules
     */
    private getContentRules;
    /**
     * Calculate validation score
     */
    private calculateScore;
    /**
     * Generate recommendations
     */
    private generateRecommendations;
    /**
     * Check if color is in palette
     */
    private isColorInPalette;
    /**
     * Get all validation rules
     */
    getRules(): ValidationRule[];
    /**
     * Get rules by category
     */
    getRulesByCategory(category: ValidationCategory): ValidationRule[];
    /**
     * Get rules by severity
     */
    getRulesBySeverity(severity: ValidationSeverity): ValidationRule[];
}
/**
 * Create design validation service instance
 */
export declare function createDesignValidationService(): DesignValidationService;
//# sourceMappingURL=DesignValidationService.d.ts.map