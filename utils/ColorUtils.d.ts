/**
 * Color format types supported by PptxGenJS
 */
export interface RGBColor {
    r: number;
    g: number;
    b: number;
}
export interface HSLColor {
    h: number;
    s: number;
    l: number;
}
/**
 * Color utility class for PowerPoint theming
 */
export declare class ColorUtils {
    /**
     * Convert hex color to RGB object
     * PptxGenJS may work better with RGB objects in some cases
     */
    static hexToRgb(hex: string): RGBColor | null;
    /**
     * Convert RGB to hex
     */
    static rgbToHex(r: number, g: number, b: number): string;
    /**
     * Get color in the format that works best with PptxGenJS
     * Based on testing, hex colors seem to work better than RGB objects
     */
    static getPptxColor(color: string): string;
    /**
     * Validate color format
     */
    static isValidColor(color: string): boolean;
    /**
     * Get contrasting text color (black or white) for a background color
     */
    static getContrastingTextColor(backgroundColor: string): string;
    /**
     * Lighten a color by a percentage
     */
    static lighten(color: string, percent: number): string;
    /**
     * Darken a color by a percentage
     */
    static darken(color: string, percent: number): string;
    /**
     * Amazon brand colors with proper formatting
     */
    static readonly AMAZON_COLORS: {
        readonly ORANGE: "#FF9900";
        readonly DARK_BLUE: "#232F3E";
        readonly LIGHT_BLUE: "#146EB4";
        readonly WHITE: "#FFFFFF";
        readonly BLACK: "#000000";
        readonly GRAY: "#666666";
        readonly LIGHT_GRAY: "#F5F5F5";
    };
    /**
     * Get Amazon color palette for theming
     */
    static getAmazonPalette(): {
        primary: "#FF9900";
        secondary: "#232F3E";
        accent: "#146EB4";
        background: "#FFFFFF";
        text: "#000000";
        textLight: "#666666";
        backgroundLight: "#F5F5F5";
    };
    /**
     * Test color compatibility with PptxGenJS
     */
    static testColorFormats(): void;
}
//# sourceMappingURL=ColorUtils.d.ts.map