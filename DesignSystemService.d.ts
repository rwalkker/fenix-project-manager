import type { DesignSystem, ColorPalette, TypographySystem, SpacingSystem, DesignValidationResult, ThemeConfig } from '../models/design-system-types';
/**
 * Design System Service
 * Provides design tokens, validation, and utilities
 */
export declare class DesignSystemService {
    private designSystem;
    private customThemes;
    constructor(designSystem?: DesignSystem);
    /**
     * Get current design system
     */
    getDesignSystem(): DesignSystem;
    /**
     * Get color palette
     */
    getColors(): ColorPalette;
    /**
     * Get typography system
     */
    getTypography(): TypographySystem;
    /**
     * Get spacing system
     */
    getSpacing(): SpacingSystem;
    /**
     * Get color by path (e.g., 'primary.main', 'semantic.success.main')
     */
    getColor(path: string): string;
    /**
     * Get spacing value
     */
    getSpacingValue(size: keyof SpacingSystem['scale']): number;
    /**
     * Calculate contrast ratio between two colors
     */
    calculateContrastRatio(color1: string, color2: string): number;
    /**
     * Get contrast ratio (alias for calculateContrastRatio)
     */
    getContrastRatio(color1: string, color2: string): number;
    /**
     * Get relative luminance of a color
     */
    private getLuminance;
    /**
     * Convert hex color to RGB
     */
    private hexToRgb;
    /**
     * Validate color contrast
     */
    validateContrast(foreground: string, background: string, isLargeText?: boolean): {
        valid: boolean;
        ratio: number;
        required: number;
    };
    /**
     * Validate design elements
     */
    validateDesign(elements: DesignElement[]): DesignValidationResult;
    /**
     * Check if color is in brand palette
     */
    private isValidBrandColor;
    /**
     * Generate accessible color palette
     */
    generateAccessiblePalette(baseColor: string): {
        light: string;
        main: string;
        dark: string;
        contrast: string;
    };
    /**
     * Convert RGB to hex
     */
    private rgbToHex;
    /**
     * Get font stack
     */
    getFontStack(type?: 'primary' | 'secondary' | 'monospace'): string;
    /**
     * Get responsive spacing
     */
    getResponsiveSpacing(base: keyof SpacingSystem['scale'], breakpoint: string): number;
    /**
     * Create custom theme
     */
    createTheme(config: ThemeConfig): DesignSystem;
    /**
     * Get custom theme
     */
    getTheme(name: string): DesignSystem | undefined;
    /**
     * List all themes
     */
    listThemes(): string[];
    /**
     * Export design tokens
     */
    exportTokens(): Record<string, any>;
    /**
     * Flatten color palette for export
     */
    private flattenColors;
}
/**
 * Design Element Interface
 */
export interface DesignElement {
    id: string;
    type: 'text' | 'image' | 'button' | 'container' | 'other';
    foreground?: string;
    background?: string;
    fontSize?: number;
    width?: number;
    height?: number;
    interactive?: boolean;
    isLargeText?: boolean;
    altText?: string;
}
/**
 * Create design system service instance
 */
export declare function createDesignSystemService(designSystem?: DesignSystem): DesignSystemService;
/**
 * Get default Amazon design system
 */
export declare function getAmazonDesignSystem(): DesignSystem;
//# sourceMappingURL=DesignSystemService.d.ts.map