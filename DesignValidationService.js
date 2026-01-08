"use strict";
// FENIX Project Manager - Design Validation Service
// Comprehensive validation for design elements and documents
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignValidationService = void 0;
exports.createDesignValidationService = createDesignValidationService;
const DesignSystemService_1 = require("./DesignSystemService");
/**
 * Design Validation Service
 * Provides comprehensive validation for design elements and documents
 */
class DesignValidationService {
    designSystem;
    rules;
    constructor() {
        this.designSystem = (0, DesignSystemService_1.createDesignSystemService)();
        this.rules = this.initializeRules();
    }
    /**
     * Initialize validation rules
     */
    initializeRules() {
        return [
            // Accessibility Rules
            ...this.getAccessibilityRules(),
            // Branding Rules
            ...this.getBrandingRules(),
            // Typography Rules
            ...this.getTypographyRules(),
            // Color Rules
            ...this.getColorRules(),
            // Layout Rules
            ...this.getLayoutRules(),
            // Content Rules
            ...this.getContentRules()
        ];
    }
    /**
     * Validate design element
     */
    validate(context) {
        const issues = [];
        // Run all validation rules
        for (const rule of this.rules) {
            try {
                const ruleIssues = rule.validate(context);
                issues.push(...ruleIssues);
            }
            catch (error) {
                console.error(`Error running validation rule ${rule.id}:`, error);
            }
        }
        // Categorize issues
        const errors = issues.filter(i => i.severity === 'error');
        const warnings = issues.filter(i => i.severity === 'warning');
        const info = issues.filter(i => i.severity === 'info');
        // Calculate category counts
        const categoryCounts = {
            accessibility: 0,
            branding: 0,
            typography: 0,
            color: 0,
            layout: 0,
            content: 0
        };
        issues.forEach(issue => {
            categoryCounts[issue.category]++;
        });
        // Calculate score (0-100)
        const score = this.calculateScore(errors.length, warnings.length, info.length);
        // Generate recommendations
        const recommendations = this.generateRecommendations(issues);
        return {
            valid: errors.length === 0,
            score,
            errors,
            warnings,
            info,
            summary: {
                totalIssues: issues.length,
                errorCount: errors.length,
                warningCount: warnings.length,
                infoCount: info.length,
                categoryCounts
            },
            recommendations
        };
    }
    /**
     * Validate design element (convenience method)
     */
    validateDesignElement(element) {
        const result = this.validate({ element });
        return {
            issues: [...result.errors, ...result.warnings, ...result.info],
            score: result.score
        };
    }
    /**
     * Validate color contrast (WCAG 2.1)
     */
    validateColorContrast(foreground, background, fontSize = 14, isBold = false) {
        const issues = [];
        const ratio = this.designSystem.calculateContrastRatio(foreground, background);
        // Determine if text is large (18pt+ or 14pt+ bold)
        const isLargeText = fontSize >= 18 || (fontSize >= 14 && isBold);
        const requiredRatio = isLargeText ? 3 : 4.5;
        if (ratio < requiredRatio) {
            issues.push({
                ruleId: 'contrast-ratio',
                severity: 'error',
                category: 'accessibility',
                message: `Insufficient color contrast: ${ratio.toFixed(2)}:1 (required: ${requiredRatio}:1)`,
                suggestion: `Increase contrast between foreground (${foreground}) and background (${background})`,
                autoFixable: true
            });
        }
        else if (ratio < 7 && !isLargeText) {
            issues.push({
                ruleId: 'contrast-ratio-aaa',
                severity: 'info',
                category: 'accessibility',
                message: `Contrast meets AA but not AAA: ${ratio.toFixed(2)}:1 (AAA requires 7:1)`,
                suggestion: 'Consider increasing contrast for enhanced accessibility (AAA compliance)'
            });
        }
        return issues;
    }
    /**
     * Validate typography
     */
    validateTypography(style) {
        const issues = [];
        // Check font size
        if (style.size < 12) {
            issues.push({
                ruleId: 'font-size-minimum',
                severity: 'error',
                category: 'typography',
                message: `Font size too small: ${style.size}px (minimum: 12px)`,
                suggestion: 'Increase font size to at least 12px for readability',
                autoFixable: true
            });
        }
        // Check line height
        const lineHeight = style.lineHeight || style.size * 1.5;
        if (lineHeight < style.size * 1.2) {
            issues.push({
                ruleId: 'line-height-minimum',
                severity: 'warning',
                category: 'typography',
                message: `Line height too tight: ${lineHeight}px (recommended: ${style.size * 1.5}px)`,
                suggestion: 'Increase line height to 1.5x font size for better readability'
            });
        }
        // Check font family
        if (!style.family || style.family.trim() === '') {
            issues.push({
                ruleId: 'font-family-required',
                severity: 'error',
                category: 'typography',
                message: 'Font family is required',
                suggestion: 'Specify a font family with fallbacks'
            });
        }
        return issues;
    }
    /**
     * Validate brand compliance
     */
    validateBrandCompliance(colors) {
        const issues = [];
        const brandColors = this.designSystem.getDesignSystem().colors;
        // Check if colors are from brand palette
        const nonBrandColors = colors.filter(color => {
            return !this.isColorInPalette(color, brandColors);
        });
        if (nonBrandColors.length > 0) {
            issues.push({
                ruleId: 'brand-colors',
                severity: 'warning',
                category: 'branding',
                message: `Non-brand colors detected: ${nonBrandColors.join(', ')}`,
                suggestion: 'Use colors from the Amazon brand palette for consistency'
            });
        }
        return issues;
    }
    /**
     * Validate layout spacing
     */
    validateLayoutSpacing(spacing) {
        const issues = [];
        const baseUnit = 4;
        // Check if spacing follows 4px grid
        if (spacing % baseUnit !== 0) {
            issues.push({
                ruleId: 'spacing-grid',
                severity: 'warning',
                category: 'layout',
                message: `Spacing ${spacing}px doesn't follow 4px grid system`,
                suggestion: `Use multiples of 4px (nearest: ${Math.round(spacing / baseUnit) * baseUnit}px)`,
                autoFixable: true
            });
        }
        return issues;
    }
    /**
     * Validate content accessibility
     */
    validateContentAccessibility(content, type) {
        const issues = [];
        // Check for empty content
        if (!content || content.trim() === '') {
            issues.push({
                ruleId: 'content-empty',
                severity: type === 'alt' ? 'error' : 'warning',
                category: 'content',
                message: `${type} content is empty`,
                suggestion: `Provide meaningful ${type} content`
            });
            return issues;
        }
        // Check alt text length
        if (type === 'alt') {
            if (content.length < 10) {
                issues.push({
                    ruleId: 'alt-text-too-short',
                    severity: 'warning',
                    category: 'accessibility',
                    message: 'Alt text is very short',
                    suggestion: 'Provide more descriptive alt text (recommended: 10-125 characters)'
                });
            }
            else if (content.length > 125) {
                issues.push({
                    ruleId: 'alt-text-too-long',
                    severity: 'info',
                    category: 'accessibility',
                    message: 'Alt text is quite long',
                    suggestion: 'Consider shortening alt text (recommended: 10-125 characters)'
                });
            }
        }
        // Check for all caps (accessibility issue)
        if (content === content.toUpperCase() && content.length > 10) {
            issues.push({
                ruleId: 'all-caps-text',
                severity: 'warning',
                category: 'accessibility',
                message: 'Text is all uppercase',
                suggestion: 'Use sentence case or title case for better readability'
            });
        }
        return issues;
    }
    /**
     * Get accessibility validation rules
     */
    getAccessibilityRules() {
        return [
            {
                id: 'wcag-contrast',
                name: 'WCAG Color Contrast',
                category: 'accessibility',
                severity: 'error',
                description: 'Ensures sufficient color contrast for text',
                validate: (context) => {
                    if (!context.element?.color || !context.element?.backgroundColor) {
                        return [];
                    }
                    return this.validateColorContrast(context.element.color, context.element.backgroundColor, context.element.fontSize, context.element.fontWeight === 'bold');
                }
            },
            {
                id: 'alt-text-required',
                name: 'Alt Text Required',
                category: 'accessibility',
                severity: 'error',
                description: 'Images must have alt text',
                validate: (context) => {
                    if (context.element?.type === 'image' && !context.element.altText) {
                        return [{
                                ruleId: 'alt-text-required',
                                severity: 'error',
                                category: 'accessibility',
                                message: 'Image missing alt text',
                                suggestion: 'Add descriptive alt text for screen readers',
                                autoFixable: false
                            }];
                    }
                    return [];
                }
            },
            {
                id: 'touch-target-size',
                name: 'Touch Target Size',
                category: 'accessibility',
                severity: 'warning',
                description: 'Interactive elements must be large enough',
                validate: (context) => {
                    if (context.element?.interactive) {
                        const width = context.element.width || 0;
                        const height = context.element.height || 0;
                        const minSize = 44;
                        if (width < minSize || height < minSize) {
                            return [{
                                    ruleId: 'touch-target-size',
                                    severity: 'warning',
                                    category: 'accessibility',
                                    message: `Touch target too small: ${width}x${height}px (minimum: ${minSize}x${minSize}px)`,
                                    suggestion: `Increase size to at least ${minSize}x${minSize}px`,
                                    autoFixable: true
                                }];
                        }
                    }
                    return [];
                }
            }
        ];
    }
    /**
     * Get branding validation rules
     */
    getBrandingRules() {
        return [
            {
                id: 'brand-colors-usage',
                name: 'Brand Colors Usage',
                category: 'branding',
                severity: 'warning',
                description: 'Colors should be from brand palette',
                validate: (context) => {
                    if (context.colors && context.colors.length > 0) {
                        return this.validateBrandCompliance(context.colors);
                    }
                    return [];
                }
            },
            {
                id: 'brand-typography',
                name: 'Brand Typography',
                category: 'branding',
                severity: 'warning',
                description: 'Typography should use brand fonts',
                validate: (context) => {
                    if (context.element?.fontFamily) {
                        const brandFonts = ['Amazon Ember', 'Arial', 'Helvetica', 'sans-serif'];
                        const usedFont = context.element.fontFamily.toLowerCase();
                        const isBrandFont = brandFonts.some(font => usedFont.includes(font.toLowerCase()));
                        if (!isBrandFont) {
                            return [{
                                    ruleId: 'brand-typography',
                                    severity: 'warning',
                                    category: 'branding',
                                    message: `Non-brand font detected: ${context.element.fontFamily}`,
                                    suggestion: 'Use Amazon Ember or approved fallback fonts'
                                }];
                        }
                    }
                    return [];
                }
            }
        ];
    }
    /**
     * Get typography validation rules
     */
    getTypographyRules() {
        return [
            {
                id: 'font-size-readable',
                name: 'Readable Font Size',
                category: 'typography',
                severity: 'error',
                description: 'Font size must be readable',
                validate: (context) => {
                    if (context.element?.fontSize) {
                        return this.validateTypography({
                            size: context.element.fontSize,
                            family: context.element.fontFamily || '',
                            weight: context.element.fontWeight || 'normal',
                            lineHeight: context.element.lineHeight
                        });
                    }
                    return [];
                }
            },
            {
                id: 'heading-hierarchy',
                name: 'Heading Hierarchy',
                category: 'typography',
                severity: 'warning',
                description: 'Headings should follow proper hierarchy',
                validate: (_context) => {
                    // This would need document context to validate properly
                    // Placeholder for now
                    return [];
                }
            }
        ];
    }
    /**
     * Get color validation rules
     */
    getColorRules() {
        return [
            {
                id: 'color-format',
                name: 'Color Format',
                category: 'color',
                severity: 'info',
                description: 'Colors should use consistent format',
                validate: (context) => {
                    if (context.colors) {
                        const inconsistentFormats = context.colors.filter(color => {
                            return !color.match(/^#[0-9A-Fa-f]{6}$/);
                        });
                        if (inconsistentFormats.length > 0) {
                            return [{
                                    ruleId: 'color-format',
                                    severity: 'info',
                                    category: 'color',
                                    message: 'Inconsistent color formats detected',
                                    suggestion: 'Use 6-digit hex format (#RRGGBB) for consistency'
                                }];
                        }
                    }
                    return [];
                }
            }
        ];
    }
    /**
     * Get layout validation rules
     */
    getLayoutRules() {
        return [
            {
                id: 'spacing-consistency',
                name: 'Spacing Consistency',
                category: 'layout',
                severity: 'warning',
                description: 'Spacing should follow grid system',
                validate: (context) => {
                    if (context.element?.spacing) {
                        return this.validateLayoutSpacing(context.element.spacing);
                    }
                    return [];
                }
            }
        ];
    }
    /**
     * Get content validation rules
     */
    getContentRules() {
        return [
            {
                id: 'content-quality',
                name: 'Content Quality',
                category: 'content',
                severity: 'warning',
                description: 'Content should be meaningful',
                validate: (context) => {
                    if (context.content) {
                        return this.validateContentAccessibility(context.content, 'body');
                    }
                    return [];
                }
            }
        ];
    }
    /**
     * Calculate validation score
     */
    calculateScore(errors, warnings, info) {
        const errorPenalty = errors * 20;
        const warningPenalty = warnings * 5;
        const infoPenalty = info * 1;
        const score = Math.max(0, 100 - errorPenalty - warningPenalty - infoPenalty);
        return Math.round(score);
    }
    /**
     * Generate recommendations
     */
    generateRecommendations(issues) {
        const recommendations = [];
        // Group by category
        const byCategory = issues.reduce((acc, issue) => {
            if (!acc[issue.category])
                acc[issue.category] = [];
            acc[issue.category].push(issue);
            return acc;
        }, {});
        // Generate category-specific recommendations
        if (byCategory.accessibility && byCategory.accessibility.length > 0) {
            recommendations.push('Focus on accessibility improvements to ensure WCAG 2.1 AA compliance');
        }
        if (byCategory.branding && byCategory.branding.length > 0) {
            recommendations.push('Align design elements with Amazon brand guidelines');
        }
        if (byCategory.typography && byCategory.typography.length > 0) {
            recommendations.push('Review typography for readability and consistency');
        }
        // Add auto-fixable recommendation
        const autoFixable = issues.filter(i => i.autoFixable);
        if (autoFixable.length > 0) {
            recommendations.push(`${autoFixable.length} issues can be automatically fixed`);
        }
        return recommendations;
    }
    /**
     * Check if color is in palette
     */
    isColorInPalette(color, palette) {
        const normalizedColor = color.toLowerCase();
        // Check all color values in palette
        const checkObject = (obj) => {
            for (const key in obj) {
                const value = obj[key];
                if (typeof value === 'string' && value.toLowerCase() === normalizedColor) {
                    return true;
                }
                if (typeof value === 'object' && value !== null) {
                    if (checkObject(value))
                        return true;
                }
            }
            return false;
        };
        return checkObject(palette);
    }
    /**
     * Get all validation rules
     */
    getRules() {
        return this.rules;
    }
    /**
     * Get rules by category
     */
    getRulesByCategory(category) {
        return this.rules.filter(rule => rule.category === category);
    }
    /**
     * Get rules by severity
     */
    getRulesBySeverity(severity) {
        return this.rules.filter(rule => rule.severity === severity);
    }
}
exports.DesignValidationService = DesignValidationService;
/**
 * Create design validation service instance
 */
function createDesignValidationService() {
    return new DesignValidationService();
}
//# sourceMappingURL=DesignValidationService.js.map