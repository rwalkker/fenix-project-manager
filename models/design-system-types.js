"use strict";
// FENIX Project Manager - Design System Types
// Comprehensive type definitions for unified design system
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.AMAZON_DESIGN_SYSTEM = exports.ValidationSuggestionType = exports.ValidationWarningType = exports.ValidationErrorType = void 0;
var ValidationErrorType;
(function (ValidationErrorType) {
    ValidationErrorType["CONTRAST_TOO_LOW"] = "contrast_too_low";
    ValidationErrorType["FONT_TOO_SMALL"] = "font_too_small";
    ValidationErrorType["TOUCH_TARGET_TOO_SMALL"] = "touch_target_too_small";
    ValidationErrorType["MISSING_ALT_TEXT"] = "missing_alt_text";
    ValidationErrorType["INVALID_COLOR"] = "invalid_color";
    ValidationErrorType["BRAND_VIOLATION"] = "brand_violation";
    ValidationErrorType["LAYOUT_OVERFLOW"] = "layout_overflow";
    ValidationErrorType["MISSING_REQUIRED"] = "missing_required";
})(ValidationErrorType || (exports.ValidationErrorType = ValidationErrorType = {}));
var ValidationWarningType;
(function (ValidationWarningType) {
    ValidationWarningType["SUBOPTIMAL_CONTRAST"] = "suboptimal_contrast";
    ValidationWarningType["LONG_LINE_LENGTH"] = "long_line_length";
    ValidationWarningType["INCONSISTENT_SPACING"] = "inconsistent_spacing";
    ValidationWarningType["MIXED_FONTS"] = "mixed_fonts";
    ValidationWarningType["COLOR_OVERUSE"] = "color_overuse";
})(ValidationWarningType || (exports.ValidationWarningType = ValidationWarningType = {}));
var ValidationSuggestionType;
(function (ValidationSuggestionType) {
    ValidationSuggestionType["IMPROVE_HIERARCHY"] = "improve_hierarchy";
    ValidationSuggestionType["ADD_WHITESPACE"] = "add_whitespace";
    ValidationSuggestionType["SIMPLIFY_LAYOUT"] = "simplify_layout";
    ValidationSuggestionType["ENHANCE_CONTRAST"] = "enhance_contrast";
    ValidationSuggestionType["USE_BRAND_COLORS"] = "use_brand_colors";
})(ValidationSuggestionType || (exports.ValidationSuggestionType = ValidationSuggestionType = {}));
/**
 * Amazon Design System (Default)
 */
exports.AMAZON_DESIGN_SYSTEM = {
    name: 'Amazon',
    version: '1.0.0',
    colors: {
        primary: {
            main: '#FF9900',
            light: '#FFB84D',
            dark: '#CC7A00',
            contrast: '#FFFFFF'
        },
        secondary: {
            main: '#232F3E',
            light: '#37475A',
            dark: '#0F1419',
            contrast: '#FFFFFF'
        },
        semantic: {
            success: {
                main: '#067D62',
                light: '#0A9F7D',
                dark: '#045A46',
                contrast: '#FFFFFF'
            },
            warning: {
                main: '#F0B323',
                light: '#F3C556',
                dark: '#C08F1C',
                contrast: '#000000'
            },
            error: {
                main: '#D13212',
                light: '#E04A2A',
                dark: '#A6280E',
                contrast: '#FFFFFF'
            },
            info: {
                main: '#0073BB',
                light: '#338FCC',
                dark: '#005A95',
                contrast: '#FFFFFF'
            }
        },
        neutrals: {
            black: '#000000',
            darkGray: '#333333',
            mediumGray: '#666666',
            lightGray: '#CCCCCC',
            white: '#FFFFFF'
        },
        backgrounds: {
            primary: '#FFFFFF',
            secondary: '#F5F5F5',
            tertiary: '#EAEDED'
        }
    },
    typography: {
        fonts: {
            primary: 'Amazon Ember',
            monospace: 'Courier New',
            fallback: ['Arial', 'Helvetica', 'sans-serif']
        },
        scale: {
            h1: { size: 32, weight: 700, lineHeight: 1.2 },
            h2: { size: 24, weight: 700, lineHeight: 1.3 },
            h3: { size: 20, weight: 700, lineHeight: 1.4 },
            h4: { size: 18, weight: 700, lineHeight: 1.4 },
            h5: { size: 16, weight: 700, lineHeight: 1.5 },
            h6: { size: 14, weight: 700, lineHeight: 1.5 },
            body: { size: 14, weight: 400, lineHeight: 1.5 },
            small: { size: 12, weight: 400, lineHeight: 1.5 },
            tiny: { size: 10, weight: 400, lineHeight: 1.5 }
        },
        lineHeights: {
            tight: 1.2,
            normal: 1.5,
            relaxed: 1.75,
            loose: 2.0
        },
        letterSpacing: {
            tight: -0.02,
            normal: 0,
            wide: 0.05
        },
        fontWeights: {
            thin: 100,
            light: 300,
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700,
            black: 900
        }
    },
    spacing: {
        baseUnit: 4,
        scale: {
            xs: 4,
            sm: 8,
            md: 16,
            lg: 24,
            xl: 32,
            '2xl': 48,
            '3xl': 64
        },
        component: {
            padding: {
                xs: 4,
                sm: 8,
                md: 16,
                lg: 24,
                xl: 32,
                '2xl': 48,
                '3xl': 64
            },
            margin: {
                xs: 4,
                sm: 8,
                md: 16,
                lg: 24,
                xl: 32,
                '2xl': 48,
                '3xl': 64
            },
            gap: {
                xs: 4,
                sm: 8,
                md: 16,
                lg: 24,
                xl: 32,
                '2xl': 48,
                '3xl': 64
            }
        }
    },
    layout: {
        grid: {
            columns: 12,
            gutter: 16,
            margin: 16
        },
        breakpoints: {
            xs: 0,
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            '2xl': 1536
        },
        containers: {
            sm: 640,
            md: 768,
            lg: 1024,
            xl: 1280,
            '2xl': 1536,
            full: '100%'
        }
    },
    borders: {
        radius: {
            none: 0,
            sm: 2,
            md: 4,
            lg: 8,
            xl: 16,
            full: 9999
        },
        width: {
            thin: 1,
            medium: 2,
            thick: 4
        },
        styles: {
            solid: 'solid',
            dashed: 'dashed',
            dotted: 'dotted',
            double: 'double'
        }
    },
    shadows: {
        sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        none: 'none'
    },
    animations: {
        durations: {
            fast: 150,
            normal: 300,
            slow: 500
        },
        easings: {
            linear: 'linear',
            easeIn: 'cubic-bezier(0.4, 0, 1, 1)',
            easeOut: 'cubic-bezier(0, 0, 0.2, 1)',
            easeInOut: 'cubic-bezier(0.4, 0, 0.2, 1)'
        },
        transitions: {
            fade: 'opacity 300ms ease-in-out',
            slide: 'transform 300ms ease-in-out',
            scale: 'transform 300ms ease-in-out',
            all: 'all 300ms ease-in-out'
        }
    },
    accessibility: {
        contrastRatios: {
            normalText: 4.5,
            largeText: 3.0,
            uiComponents: 3.0,
            enhanced: 7.0
        },
        touchTargets: {
            minimum: 44,
            recommended: 48
        },
        focusIndicators: {
            width: 2,
            style: 'solid',
            color: '#0073BB',
            offset: 2
        },
        textSizes: {
            body: 14,
            small: 12,
            minimum: 10
        }
    }
};
//# sourceMappingURL=design-system-types.js.map