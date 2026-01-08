/**
 * Enhanced PowerPoint Theme with better color handling
 */
export interface EnhancedPowerPointTheme {
    name: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        textLight?: string;
        backgroundLight?: string;
        success?: string;
        warning?: string;
        error?: string;
    };
    fonts: {
        title: string;
        body: string;
        fallbackTitle?: string;
        fallbackBody?: string;
    };
    masterSlide?: {
        background?: {
            type: 'solid' | 'gradient' | 'image';
            color?: string;
            gradient?: {
                type: 'linear' | 'radial';
                colors: string[];
                angle?: number;
            };
            image?: string;
        };
        logo?: {
            path: string;
            position: {
                x: string;
                y: string;
            };
            size: {
                width: string;
                height: string;
            };
        };
        footer?: {
            text: string;
            position: {
                x: string;
                y: string;
            };
            style: {
                font: string;
                size: number;
                color: string;
            };
        };
        slideNumber?: {
            show: boolean;
            position: {
                x: string;
                y: string;
            };
            style: {
                font: string;
                size: number;
                color: string;
            };
        };
    };
    _formatColor?: (color: string) => string;
    _validateColors?: () => boolean;
}
/**
 * Enhanced Amazon PowerPoint Theme with better color handling
 */
export declare const ENHANCED_AMAZON_THEME: EnhancedPowerPointTheme;
/**
 * Professional Theme (alternative to Amazon)
 */
export declare const PROFESSIONAL_THEME: EnhancedPowerPointTheme;
/**
 * Modern Theme (clean and minimal)
 */
export declare const MODERN_THEME: EnhancedPowerPointTheme;
/**
 * Theme registry for easy access
 */
export declare const THEME_REGISTRY: {
    readonly amazon: EnhancedPowerPointTheme;
    readonly professional: EnhancedPowerPointTheme;
    readonly modern: EnhancedPowerPointTheme;
};
export type ThemeName = keyof typeof THEME_REGISTRY;
/**
 * Get theme by name
 */
export declare function getTheme(name: ThemeName): EnhancedPowerPointTheme;
/**
 * Validate theme colors
 */
export declare function validateTheme(theme: EnhancedPowerPointTheme): boolean;
/**
 * Format theme colors for PptxGenJS
 */
export declare function formatThemeColors(theme: EnhancedPowerPointTheme): EnhancedPowerPointTheme;
//# sourceMappingURL=enhanced-powerpoint-types.d.ts.map