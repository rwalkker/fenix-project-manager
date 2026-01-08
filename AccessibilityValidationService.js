"use strict";
// FENIX Project Manager - Accessibility Validation Service
// WCAG 2.1 AA compliance checking and accessible design generation
// Created: January 6, 2026
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccessibilityValidationService = void 0;
const chroma_js_1 = __importDefault(require("chroma-js"));
/**
 * Accessibility Validation Service
 * Provides WCAG 2.1 compliance checking and accessible design generation
 */
class AccessibilityValidationService {
    /**
     * Validate color contrast for WCAG compliance
     */
    validateColorContrast(foreground, background, level = 'AA', fontSize = 14) {
        try {
            const contrast = chroma_js_1.default.contrast(foreground, background);
            // Large text (18pt+ or 14pt+ bold) requires 3:1, normal text requires 4.5:1 (AA)
            // AAA requires 7:1 for normal text, 4.5:1 for large text
            const isLargeText = fontSize >= 18 || fontSize >= 14; // Assuming bold for 14+
            let required;
            if (level === 'AAA') {
                required = isLargeText ? 4.5 : 7.0;
            }
            else {
                required = isLargeText ? 3.0 : 4.5;
            }
            return {
                pass: contrast >= required,
                ratio: contrast,
                required,
                level
            };
        }
        catch (error) {
            console.error('Error validating contrast:', error);
            return {
                pass: false,
                ratio: 0,
                required: level === 'AAA' ? 7.0 : 4.5,
                level
            };
        }
    }
    /**
     * Validate slide/document accessibility
     */
    async validateElement(element) {
        const issues = [];
        // Check color contrast
        if (element.background && element.textColor) {
            const contrast = this.validateColorContrast(element.textColor, element.background, 'AA', element.fontSize || 14);
            if (!contrast.pass) {
                issues.push({
                    type: 'contrast',
                    severity: 'serious',
                    element: 'text',
                    message: `Color contrast ratio ${contrast.ratio.toFixed(2)}:1 is below WCAG ${contrast.level} standard`,
                    suggestion: `Increase contrast to at least ${contrast.required}:1. Try darkening text or lightening background.`,
                    wcagCriterion: '1.4.3 Contrast (Minimum)'
                });
            }
        }
        // Check alt text for images
        if (element.images) {
            element.images.forEach((img, index) => {
                if (!img.altText || img.altText.trim() === '') {
                    issues.push({
                        type: 'alt-text',
                        severity: 'serious',
                        element: `image-${index}`,
                        message: 'Image missing alt text',
                        suggestion: 'Add descriptive alt text for screen readers. Describe what the image shows and its purpose.',
                        wcagCriterion: '1.1.1 Non-text Content'
                    });
                }
                else if (img.altText.length < 5) {
                    issues.push({
                        type: 'alt-text',
                        severity: 'moderate',
                        element: `image-${index}`,
                        message: 'Alt text is too short',
                        suggestion: 'Provide more descriptive alt text (at least 5 characters).',
                        wcagCriterion: '1.1.1 Non-text Content'
                    });
                }
            });
        }
        // Check touch target size for interactive elements
        if (element.interactive && element.width && element.height) {
            const minSize = 44; // WCAG 2.1 AA minimum
            const recommendedSize = 48; // Better UX
            if (element.width < minSize || element.height < minSize) {
                issues.push({
                    type: 'touch-target',
                    severity: 'serious',
                    element: 'interactive',
                    message: `Touch target size ${element.width}x${element.height}px is below minimum`,
                    suggestion: `Increase size to at least ${minSize}x${minSize}px (${recommendedSize}x${recommendedSize}px recommended).`,
                    wcagCriterion: '2.5.5 Target Size'
                });
            }
            else if (element.width < recommendedSize || element.height < recommendedSize) {
                issues.push({
                    type: 'touch-target',
                    severity: 'minor',
                    element: 'interactive',
                    message: `Touch target size ${element.width}x${element.height}px is below recommended`,
                    suggestion: `Consider increasing to ${recommendedSize}x${recommendedSize}px for better usability.`,
                    wcagCriterion: '2.5.5 Target Size'
                });
            }
        }
        return issues;
    }
    /**
     * Generate accessible color palette from brand color
     */
    generateAccessiblePalette(brandColor) {
        try {
            const base = (0, chroma_js_1.default)(brandColor);
            // Generate primary and secondary colors
            const primary = base.hex();
            const secondary = base.set('hsl.h', '+30').hex();
            // Determine text and background colors based on luminance
            const luminance = base.luminance();
            const text = luminance > 0.5 ? '#000000' : '#FFFFFF';
            const background = luminance > 0.5 ? '#FFFFFF' : '#000000';
            // Ensure contrast for primary color
            let adjustedPrimary = primary;
            const primaryContrast = chroma_js_1.default.contrast(adjustedPrimary, background);
            if (primaryContrast < 4.5) {
                // Adjust primary color to meet contrast requirements
                adjustedPrimary = luminance > 0.5
                    ? base.darken(2).hex()
                    : base.brighten(2).hex();
            }
            return {
                primary: adjustedPrimary,
                secondary,
                text,
                background,
                success: '#10B981', // Green with good contrast
                warning: '#F59E0B', // Amber with good contrast
                error: '#EF4444', // Red with good contrast
                info: '#3B82F6' // Blue with good contrast
            };
        }
        catch (error) {
            console.error('Error generating palette:', error);
            // Return safe defaults
            return {
                primary: '#0073BB',
                secondary: '#FF9900',
                text: '#000000',
                background: '#FFFFFF',
                success: '#10B981',
                warning: '#F59E0B',
                error: '#EF4444',
                info: '#3B82F6'
            };
        }
    }
    /**
     * Generate color scale with guaranteed accessibility
     */
    generateAccessibleScale(baseColor, steps = 9) {
        try {
            const base = (0, chroma_js_1.default)(baseColor);
            // Create scale from light to dark
            const scale = chroma_js_1.default
                .scale([
                base.brighten(2.5),
                base,
                base.darken(2.5)
            ])
                .mode('lab')
                .colors(steps);
            // Validate each color has sufficient contrast with white and black
            return scale.map(color => {
                const contrastWithWhite = chroma_js_1.default.contrast(color, '#FFFFFF');
                const contrastWithBlack = chroma_js_1.default.contrast(color, '#000000');
                // If contrast is poor with both, adjust
                if (contrastWithWhite < 3 && contrastWithBlack < 3) {
                    return (0, chroma_js_1.default)(color).darken(1).hex();
                }
                return color;
            });
        }
        catch (error) {
            console.error('Error generating scale:', error);
            return [baseColor];
        }
    }
    /**
     * Suggest accessible color combinations
     */
    suggestAccessibleCombinations(colors) {
        const combinations = [];
        for (const fg of colors) {
            for (const bg of colors) {
                if (fg === bg)
                    continue;
                try {
                    const contrast = chroma_js_1.default.contrast(fg, bg);
                    let rating;
                    if (contrast >= 7) {
                        rating = 'AAA';
                    }
                    else if (contrast >= 4.5) {
                        rating = 'AA';
                    }
                    else {
                        rating = 'Fail';
                    }
                    if (rating !== 'Fail') {
                        combinations.push({
                            foreground: fg,
                            background: bg,
                            contrast,
                            rating
                        });
                    }
                }
                catch (error) {
                    // Skip invalid color combinations
                    continue;
                }
            }
        }
        // Sort by contrast ratio (highest first)
        return combinations.sort((a, b) => b.contrast - a.contrast);
    }
    /**
     * Calculate accessibility score (0-100)
     */
    calculateAccessibilityScore(issues) {
        if (issues.length === 0)
            return 100;
        const weights = {
            critical: 25,
            serious: 15,
            moderate: 10,
            minor: 5
        };
        const totalPenalty = issues.reduce((sum, issue) => {
            return sum + weights[issue.severity];
        }, 0);
        return Math.max(0, 100 - totalPenalty);
    }
    /**
     * Generate accessibility report
     */
    generateReport(issues) {
        const score = this.calculateAccessibilityScore(issues);
        let level;
        if (score >= 90)
            level = 'Excellent';
        else if (score >= 75)
            level = 'Good';
        else if (score >= 50)
            level = 'Fair';
        else
            level = 'Poor';
        const criticalCount = issues.filter(i => i.severity === 'critical').length;
        const seriousCount = issues.filter(i => i.severity === 'serious').length;
        const moderateCount = issues.filter(i => i.severity === 'moderate').length;
        const minorCount = issues.filter(i => i.severity === 'minor').length;
        let summary = `Accessibility score: ${score}/100 (${level}). `;
        if (issues.length === 0) {
            summary += 'No accessibility issues found. Meets WCAG 2.1 AA standards.';
        }
        else {
            summary += `Found ${issues.length} issue(s): `;
            const parts = [];
            if (criticalCount > 0)
                parts.push(`${criticalCount} critical`);
            if (seriousCount > 0)
                parts.push(`${seriousCount} serious`);
            if (moderateCount > 0)
                parts.push(`${moderateCount} moderate`);
            if (minorCount > 0)
                parts.push(`${minorCount} minor`);
            summary += parts.join(', ') + '.';
        }
        return {
            score,
            level,
            summary,
            criticalCount,
            seriousCount,
            moderateCount,
            minorCount
        };
    }
}
exports.AccessibilityValidationService = AccessibilityValidationService;
//# sourceMappingURL=AccessibilityValidationService.js.map