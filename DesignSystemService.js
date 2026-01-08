"use strict";
// FENIX Project Manager - Design System Service
// Comprehensive design system with validation and utilities
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignSystemService = void 0;
exports.createDesignSystemService = createDesignSystemService;
exports.getAmazonDesignSystem = getAmazonDesignSystem;
const design_system_types_1 = require("../models/design-system-types");
/**
 * Design System Service
 * Provides design tokens, validation, and utilities
 */
class DesignSystemService {
    designSystem;
    customThemes;
    constructor(designSystem) {
        this.designSystem = designSystem || design_system_types_1.AMAZON_DESIGN_SYSTEM;
        this.customThemes = new Map();
    }
    /**
     * Get current design system
     */
    getDesignSystem() {
        return this.designSystem;
    }
    /**
     * Get color palette
     */
    getColors() {
        return this.designSystem.colors;
    }
    /**
     * Get typography system
     */
    getTypography() {
        return this.designSystem.typography;
    }
    /**
     * Get spacing system
     */
    getSpacing() {
        return this.designSystem.spacing;
    }
    /**
     * Get color by path (e.g., 'primary.main', 'semantic.success.main')
     */
    getColor(path) {
        const parts = path.split('.');
        let current = this.designSystem.colors;
        for (const part of parts) {
            if (current[part] === undefined) {
                throw new Error(`Color not found: ${path}`);
            }
            current = current[part];
        }
        if (typeof current !== 'string') {
            throw new Error(`Invalid color path: ${path}`);
        }
        return current;
    }
    /**
     * Get spacing value
     */
    getSpacingValue(size) {
        return this.designSystem.spacing.scale[size];
    }
    /**
     * Calculate contrast ratio between two colors
     */
    calculateContrastRatio(color1, color2) {
        const l1 = this.getLuminance(color1);
        const l2 = this.getLuminance(color2);
        const lighter = Math.max(l1, l2);
        const darker = Math.min(l1, l2);
        return (lighter + 0.05) / (darker + 0.05);
    }
    /**
     * Get contrast ratio (alias for calculateContrastRatio)
     */
    getContrastRatio(color1, color2) {
        return this.calculateContrastRatio(color1, color2);
    }
    /**
     * Get relative luminance of a color
     */
    getLuminance(color) {
        const rgb = this.hexToRgb(color);
        if (!rgb)
            return 0;
        const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(val => {
            val = val / 255;
            return val <= 0.03928 ? val / 12.92 : Math.pow((val + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }
    /**
     * Convert hex color to RGB
     */
    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }
    /**
     * Validate color contrast
     */
    validateContrast(foreground, background, isLargeText = false) {
        const ratio = this.calculateContrastRatio(foreground, background);
        const required = isLargeText
            ? this.designSystem.accessibility.contrastRatios.largeText
            : this.designSystem.accessibility.contrastRatios.normalText;
        return {
            valid: ratio >= required,
            ratio,
            required
        };
    }
    /**
     * Validate design elements
     */
    validateDesign(elements) {
        const errors = [];
        const warnings = [];
        const suggestions = [];
        for (const element of elements) {
            // Validate colors
            if (element.foreground && element.background) {
                const contrast = this.validateContrast(element.foreground, element.background, element.isLargeText);
                if (!contrast.valid) {
                    errors.push({
                        type: design_system_types_1.ValidationErrorType.CONTRAST_TOO_LOW,
                        message: `Contrast ratio ${contrast.ratio.toFixed(2)}:1 is below required ${contrast.required}:1`,
                        location: element.id,
                        severity: 'high',
                        fix: `Increase contrast between ${element.foreground} and ${element.background}`
                    });
                }
                else if (contrast.ratio < this.designSystem.accessibility.contrastRatios.enhanced) {
                    warnings.push({
                        type: design_system_types_1.ValidationWarningType.SUBOPTIMAL_CONTRAST,
                        message: `Contrast ratio ${contrast.ratio.toFixed(2)}:1 could be improved`,
                        location: element.id,
                        recommendation: 'Consider increasing contrast for better accessibility'
                    });
                }
            }
            // Validate font size
            if (element.fontSize) {
                const minSize = this.designSystem.accessibility.textSizes.minimum;
                if (element.fontSize < minSize) {
                    errors.push({
                        type: design_system_types_1.ValidationErrorType.FONT_TOO_SMALL,
                        message: `Font size ${element.fontSize}px is below minimum ${minSize}px`,
                        location: element.id,
                        severity: 'high',
                        fix: `Increase font size to at least ${minSize}px`
                    });
                }
            }
            // Validate touch targets
            if (element.width && element.height && element.interactive) {
                const minSize = this.designSystem.accessibility.touchTargets.minimum;
                if (element.width < minSize || element.height < minSize) {
                    errors.push({
                        type: design_system_types_1.ValidationErrorType.TOUCH_TARGET_TOO_SMALL,
                        message: `Touch target ${element.width}x${element.height}px is below minimum ${minSize}x${minSize}px`,
                        location: element.id,
                        severity: 'medium',
                        fix: `Increase size to at least ${minSize}x${minSize}px`
                    });
                }
            }
            // Validate alt text for images
            if (element.type === 'image' && !element.altText) {
                errors.push({
                    type: design_system_types_1.ValidationErrorType.MISSING_ALT_TEXT,
                    message: 'Image is missing alt text',
                    location: element.id,
                    severity: 'high',
                    fix: 'Add descriptive alt text for accessibility'
                });
            }
            // Validate brand colors
            if (element.foreground && !this.isValidBrandColor(element.foreground)) {
                warnings.push({
                    type: design_system_types_1.ValidationWarningType.COLOR_OVERUSE,
                    message: `Color ${element.foreground} is not in brand palette`,
                    location: element.id,
                    recommendation: 'Consider using brand colors for consistency'
                });
            }
        }
        // Calculate score
        const totalChecks = elements.length * 5; // 5 checks per element
        const issueCount = errors.length + warnings.length * 0.5;
        const score = Math.max(0, Math.min(100, 100 - (issueCount / totalChecks) * 100));
        return {
            valid: errors.length === 0,
            errors,
            warnings,
            suggestions,
            score: Math.round(score)
        };
    }
    /**
     * Check if color is in brand palette
     */
    isValidBrandColor(color) {
        const colors = this.designSystem.colors;
        const allColors = [
            colors.primary.main,
            colors.primary.light,
            colors.primary.dark,
            colors.secondary.main,
            colors.secondary.light,
            colors.secondary.dark,
            colors.semantic.success.main,
            colors.semantic.warning.main,
            colors.semantic.error.main,
            colors.semantic.info.main,
            ...Object.values(colors.neutrals),
            ...Object.values(colors.backgrounds)
        ];
        return allColors.includes(color.toUpperCase());
    }
    /**
     * Generate accessible color palette
     */
    generateAccessiblePalette(baseColor) {
        // This is a simplified version - in production, use a proper color library
        const rgb = this.hexToRgb(baseColor);
        if (!rgb) {
            throw new Error('Invalid color format');
        }
        // Generate lighter version
        const light = this.rgbToHex(Math.min(255, rgb.r + 40), Math.min(255, rgb.g + 40), Math.min(255, rgb.b + 40));
        // Generate darker version
        const dark = this.rgbToHex(Math.max(0, rgb.r - 40), Math.max(0, rgb.g - 40), Math.max(0, rgb.b - 40));
        // Determine contrast color (white or black)
        const luminance = this.getLuminance(baseColor);
        const contrast = luminance > 0.5 ? '#000000' : '#FFFFFF';
        return {
            light,
            main: baseColor,
            dark,
            contrast
        };
    }
    /**
     * Convert RGB to hex
     */
    rgbToHex(r, g, b) {
        return '#' + [r, g, b].map(x => {
            const hex = Math.round(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }
    /**
     * Get font stack
     */
    getFontStack(type = 'primary') {
        const fonts = this.designSystem.typography.fonts;
        const fallbacks = fonts.fallback.join(', ');
        switch (type) {
            case 'primary':
                return `${fonts.primary}, ${fallbacks}`;
            case 'secondary':
                return fonts.secondary ? `${fonts.secondary}, ${fallbacks}` : `${fonts.primary}, ${fallbacks}`;
            case 'monospace':
                return `${fonts.monospace}, monospace`;
            default:
                return `${fonts.primary}, ${fallbacks}`;
        }
    }
    /**
     * Get responsive spacing
     */
    getResponsiveSpacing(base, breakpoint) {
        const baseValue = this.getSpacingValue(base);
        // Scale spacing based on breakpoint
        const multipliers = {
            xs: 0.75,
            sm: 0.875,
            md: 1,
            lg: 1.125,
            xl: 1.25,
            '2xl': 1.5
        };
        return Math.round(baseValue * (multipliers[breakpoint] || 1));
    }
    /**
     * Create custom theme
     */
    createTheme(config) {
        let baseSystem = this.designSystem;
        // If extending another theme, start with that
        if (config.extends && this.customThemes.has(config.extends)) {
            baseSystem = this.customThemes.get(config.extends);
        }
        // Apply overrides
        const customSystem = {
            ...baseSystem,
            name: config.name,
            ...config.overrides
        };
        // Store custom theme
        this.customThemes.set(config.name, customSystem);
        return customSystem;
    }
    /**
     * Get custom theme
     */
    getTheme(name) {
        return this.customThemes.get(name);
    }
    /**
     * List all themes
     */
    listThemes() {
        return [this.designSystem.name, ...Array.from(this.customThemes.keys())];
    }
    /**
     * Export design tokens
     */
    exportTokens() {
        return {
            colors: this.flattenColors(this.designSystem.colors),
            spacing: this.designSystem.spacing.scale,
            typography: this.designSystem.typography.scale,
            borders: {
                radius: this.designSystem.borders.radius,
                width: this.designSystem.borders.width
            },
            shadows: this.designSystem.shadows,
            animations: {
                durations: this.designSystem.animations.durations,
                easings: this.designSystem.animations.easings
            }
        };
    }
    /**
     * Flatten color palette for export
     */
    flattenColors(colors, _prefix = '') {
        const result = {};
        const flatten = (obj, path = '') => {
            for (const key in obj) {
                const value = obj[key];
                const newPath = path ? `${path}.${key}` : key;
                if (typeof value === 'string') {
                    result[newPath] = value;
                }
                else if (typeof value === 'object' && value !== null) {
                    flatten(value, newPath);
                }
            }
        };
        flatten(colors);
        return result;
    }
}
exports.DesignSystemService = DesignSystemService;
/**
 * Create design system service instance
 */
function createDesignSystemService(designSystem) {
    return new DesignSystemService(designSystem);
}
/**
 * Get default Amazon design system
 */
function getAmazonDesignSystem() {
    return design_system_types_1.AMAZON_DESIGN_SYSTEM;
}
//# sourceMappingURL=DesignSystemService.js.map