"use strict";
// FENIX Project Manager - Enhanced PowerPoint Types
// Enhanced theming system with better color support
// Created: January 7, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.THEME_REGISTRY = exports.MODERN_THEME = exports.PROFESSIONAL_THEME = exports.ENHANCED_AMAZON_THEME = void 0;
exports.getTheme = getTheme;
exports.validateTheme = validateTheme;
exports.formatThemeColors = formatThemeColors;
const ColorUtils_1 = require("../utils/ColorUtils");
/**
 * Enhanced Amazon PowerPoint Theme with better color handling
 */
exports.ENHANCED_AMAZON_THEME = {
    name: 'Amazon Enhanced',
    colors: {
        primary: ColorUtils_1.ColorUtils.AMAZON_COLORS.ORANGE,
        secondary: ColorUtils_1.ColorUtils.AMAZON_COLORS.DARK_BLUE,
        accent: ColorUtils_1.ColorUtils.AMAZON_COLORS.LIGHT_BLUE,
        background: ColorUtils_1.ColorUtils.AMAZON_COLORS.WHITE,
        text: ColorUtils_1.ColorUtils.AMAZON_COLORS.BLACK,
        textLight: ColorUtils_1.ColorUtils.AMAZON_COLORS.GRAY,
        backgroundLight: ColorUtils_1.ColorUtils.AMAZON_COLORS.LIGHT_GRAY,
        success: '#28A745',
        warning: '#FFC107',
        error: '#DC3545'
    },
    fonts: {
        title: 'Amazon Ember',
        body: 'Amazon Ember',
        fallbackTitle: 'Arial',
        fallbackBody: 'Arial'
    },
    masterSlide: {
        background: {
            type: 'solid',
            color: ColorUtils_1.ColorUtils.AMAZON_COLORS.WHITE
        },
        footer: {
            text: 'Amazon Confidential',
            position: { x: '5%', y: '95%' },
            style: {
                font: 'Amazon Ember',
                size: 10,
                color: ColorUtils_1.ColorUtils.AMAZON_COLORS.GRAY
            }
        },
        slideNumber: {
            show: true,
            position: { x: '95%', y: '95%' },
            style: {
                font: 'Amazon Ember',
                size: 10,
                color: ColorUtils_1.ColorUtils.AMAZON_COLORS.GRAY
            }
        }
    },
    _formatColor: (color) => ColorUtils_1.ColorUtils.getPptxColor(color),
    _validateColors: function () {
        const colors = Object.values(this.colors);
        return colors.every(color => ColorUtils_1.ColorUtils.isValidColor(color));
    }
};
/**
 * Professional Theme (alternative to Amazon)
 */
exports.PROFESSIONAL_THEME = {
    name: 'Professional',
    colors: {
        primary: '#2E86AB',
        secondary: '#A23B72',
        accent: '#F18F01',
        background: '#FFFFFF',
        text: '#333333',
        textLight: '#666666',
        backgroundLight: '#F8F9FA'
    },
    fonts: {
        title: 'Calibri',
        body: 'Calibri',
        fallbackTitle: 'Arial',
        fallbackBody: 'Arial'
    },
    masterSlide: {
        background: {
            type: 'solid',
            color: '#FFFFFF'
        },
        footer: {
            text: 'Confidential',
            position: { x: '5%', y: '95%' },
            style: {
                font: 'Calibri',
                size: 10,
                color: '#666666'
            }
        },
        slideNumber: {
            show: true,
            position: { x: '95%', y: '95%' },
            style: {
                font: 'Calibri',
                size: 10,
                color: '#666666'
            }
        }
    },
    _formatColor: (color) => ColorUtils_1.ColorUtils.getPptxColor(color),
    _validateColors: function () {
        const colors = Object.values(this.colors);
        return colors.every(color => ColorUtils_1.ColorUtils.isValidColor(color));
    }
};
/**
 * Modern Theme (clean and minimal)
 */
exports.MODERN_THEME = {
    name: 'Modern',
    colors: {
        primary: '#6C5CE7',
        secondary: '#2D3436',
        accent: '#00B894',
        background: '#FFFFFF',
        text: '#2D3436',
        textLight: '#636E72',
        backgroundLight: '#F8F9FA'
    },
    fonts: {
        title: 'Segoe UI',
        body: 'Segoe UI',
        fallbackTitle: 'Arial',
        fallbackBody: 'Arial'
    },
    masterSlide: {
        background: {
            type: 'solid',
            color: '#FFFFFF'
        },
        slideNumber: {
            show: true,
            position: { x: '95%', y: '95%' },
            style: {
                font: 'Segoe UI',
                size: 10,
                color: '#636E72'
            }
        }
    },
    _formatColor: (color) => ColorUtils_1.ColorUtils.getPptxColor(color),
    _validateColors: function () {
        const colors = Object.values(this.colors);
        return colors.every(color => ColorUtils_1.ColorUtils.isValidColor(color));
    }
};
/**
 * Theme registry for easy access
 */
exports.THEME_REGISTRY = {
    amazon: exports.ENHANCED_AMAZON_THEME,
    professional: exports.PROFESSIONAL_THEME,
    modern: exports.MODERN_THEME
};
/**
 * Get theme by name
 */
function getTheme(name) {
    return exports.THEME_REGISTRY[name];
}
/**
 * Validate theme colors
 */
function validateTheme(theme) {
    if (theme._validateColors) {
        return theme._validateColors();
    }
    // Fallback validation
    const colors = Object.values(theme.colors);
    return colors.every(color => ColorUtils_1.ColorUtils.isValidColor(color));
}
/**
 * Format theme colors for PptxGenJS
 */
function formatThemeColors(theme) {
    const formattedTheme = { ...theme };
    if (theme._formatColor) {
        Object.keys(formattedTheme.colors).forEach(key => {
            const colorKey = key;
            const color = formattedTheme.colors[colorKey];
            if (color) {
                formattedTheme.colors[colorKey] = theme._formatColor(color);
            }
        });
    }
    return formattedTheme;
}
//# sourceMappingURL=enhanced-powerpoint-types.js.map