"use strict";
// FENIX Project Manager - Color Utilities
// Enhanced color handling for PowerPoint theming
// Created: January 7, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColorUtils = void 0;
/**
 * Color utility class for PowerPoint theming
 */
class ColorUtils {
    /**
     * Convert hex color to RGB object
     * PptxGenJS may work better with RGB objects in some cases
     */
    static hexToRgb(hex) {
        // Remove # if present
        hex = hex.replace('#', '');
        // Validate hex format
        if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
            console.warn(`Invalid hex color: ${hex}`);
            return null;
        }
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);
        return { r, g, b };
    }
    /**
     * Convert RGB to hex
     */
    static rgbToHex(r, g, b) {
        const toHex = (n) => {
            const hex = Math.round(Math.max(0, Math.min(255, n))).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        };
        return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
    }
    /**
     * Get color in the format that works best with PptxGenJS
     * Based on testing, hex colors seem to work better than RGB objects
     */
    static getPptxColor(color) {
        // If it's already a hex color, ensure it's properly formatted
        if (color.startsWith('#')) {
            return color.toUpperCase();
        }
        // If it's a named color, convert to hex
        const namedColors = {
            'white': '#FFFFFF',
            'black': '#000000',
            'red': '#FF0000',
            'green': '#00FF00',
            'blue': '#0000FF',
            'yellow': '#FFFF00',
            'orange': '#FFA500',
            'purple': '#800080',
            'gray': '#808080',
            'grey': '#808080'
        };
        const lowerColor = color.toLowerCase();
        if (namedColors[lowerColor]) {
            return namedColors[lowerColor];
        }
        // Return as-is if we can't convert
        return color;
    }
    /**
     * Validate color format
     */
    static isValidColor(color) {
        // Check hex format
        if (color.startsWith('#')) {
            return /^#[0-9A-Fa-f]{6}$/.test(color);
        }
        // Check named colors
        const namedColors = ['white', 'black', 'red', 'green', 'blue', 'yellow', 'orange', 'purple', 'gray', 'grey'];
        return namedColors.includes(color.toLowerCase());
    }
    /**
     * Get contrasting text color (black or white) for a background color
     */
    static getContrastingTextColor(backgroundColor) {
        const rgb = this.hexToRgb(backgroundColor);
        if (!rgb)
            return '#000000';
        // Calculate luminance
        const luminance = (0.299 * rgb.r + 0.587 * rgb.g + 0.114 * rgb.b) / 255;
        // Return white for dark backgrounds, black for light backgrounds
        return luminance > 0.5 ? '#000000' : '#FFFFFF';
    }
    /**
     * Lighten a color by a percentage
     */
    static lighten(color, percent) {
        const rgb = this.hexToRgb(color);
        if (!rgb)
            return color;
        const factor = 1 + (percent / 100);
        const r = Math.min(255, Math.round(rgb.r * factor));
        const g = Math.min(255, Math.round(rgb.g * factor));
        const b = Math.min(255, Math.round(rgb.b * factor));
        return this.rgbToHex(r, g, b);
    }
    /**
     * Darken a color by a percentage
     */
    static darken(color, percent) {
        const rgb = this.hexToRgb(color);
        if (!rgb)
            return color;
        const factor = 1 - (percent / 100);
        const r = Math.max(0, Math.round(rgb.r * factor));
        const g = Math.max(0, Math.round(rgb.g * factor));
        const b = Math.max(0, Math.round(rgb.b * factor));
        return this.rgbToHex(r, g, b);
    }
    /**
     * Amazon brand colors with proper formatting
     */
    static AMAZON_COLORS = {
        ORANGE: '#FF9900',
        DARK_BLUE: '#232F3E',
        LIGHT_BLUE: '#146EB4',
        WHITE: '#FFFFFF',
        BLACK: '#000000',
        GRAY: '#666666',
        LIGHT_GRAY: '#F5F5F5'
    };
    /**
     * Get Amazon color palette for theming
     */
    static getAmazonPalette() {
        return {
            primary: this.AMAZON_COLORS.ORANGE,
            secondary: this.AMAZON_COLORS.DARK_BLUE,
            accent: this.AMAZON_COLORS.LIGHT_BLUE,
            background: this.AMAZON_COLORS.WHITE,
            text: this.AMAZON_COLORS.BLACK,
            textLight: this.AMAZON_COLORS.GRAY,
            backgroundLight: this.AMAZON_COLORS.LIGHT_GRAY
        };
    }
    /**
     * Test color compatibility with PptxGenJS
     */
    static testColorFormats() {
        console.log('🎨 Testing color formats for PptxGenJS compatibility:');
        const testColors = [
            this.AMAZON_COLORS.ORANGE,
            this.AMAZON_COLORS.DARK_BLUE,
            this.AMAZON_COLORS.LIGHT_BLUE
        ];
        testColors.forEach(color => {
            const rgb = this.hexToRgb(color);
            console.log(`${color} -> RGB: ${rgb ? `{r:${rgb.r}, g:${rgb.g}, b:${rgb.b}}` : 'Invalid'}`);
            console.log(`  Formatted: ${this.getPptxColor(color)}`);
            console.log(`  Valid: ${this.isValidColor(color)}`);
            console.log(`  Contrast: ${this.getContrastingTextColor(color)}`);
        });
    }
}
exports.ColorUtils = ColorUtils;
//# sourceMappingURL=ColorUtils.js.map