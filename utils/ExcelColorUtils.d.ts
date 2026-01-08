/**
 * Excel Color Utilities
 * Excel uses ARGB format (Alpha + RGB) for colors
 */
export declare class ExcelColorUtils {
    /**
     * Convert hex color to Excel ARGB format
     * Excel requires ARGB format: AARRGGBB where AA is alpha (FF for opaque)
     */
    static hexToArgb(hex: string): string;
    /**
     * Convert ARGB to hex
     */
    static argbToHex(argb: string): string;
    /**
     * Get Excel-compatible color object
     */
    static getExcelColor(color: string): {
        argb: string;
    };
    /**
     * Validate Excel color format
     */
    static isValidExcelColor(color: string): boolean;
    /**
     * Amazon brand colors in Excel ARGB format
     */
    static readonly AMAZON_EXCEL_COLORS: {
        readonly ORANGE: "FFFF9900";
        readonly DARK_BLUE: "FF232F3E";
        readonly LIGHT_BLUE: "FF146EB4";
        readonly WHITE: "FFFFFFFF";
        readonly BLACK: "FF000000";
        readonly GRAY: "FF666666";
        readonly LIGHT_GRAY: "FFF0F0F0";
        readonly SUCCESS: "FF067D62";
        readonly WARNING: "FFF0B323";
        readonly ERROR: "FFD13212";
    };
    /**
     * Get Amazon color palette for Excel
     */
    static getAmazonExcelPalette(): {
        primary: "FFFF9900";
        secondary: "FF232F3E";
        accent: "FF146EB4";
        background: "FFFFFFFF";
        text: "FF000000";
        textLight: "FF666666";
        backgroundLight: "FFF0F0F0";
        success: "FF067D62";
        warning: "FFF0B323";
        error: "FFD13212";
    };
    /**
     * Create Excel font object with Amazon styling
     */
    static createAmazonFont(options?: {
        size?: number;
        bold?: boolean;
        italic?: boolean;
        color?: string;
        name?: string;
    }): {
        name: string;
        size: number;
        bold: boolean;
        italic: boolean;
        color: {
            argb: string;
        };
    };
    /**
     * Create Excel fill object with Amazon styling
     */
    static createAmazonFill(color: string, pattern?: string): {
        type: "pattern";
        pattern: any;
        fgColor: {
            argb: string;
        };
    };
    /**
     * Create Excel border object with Amazon styling
     */
    static createAmazonBorder(color?: string, style?: string): {
        top: {
            style: any;
            color: {
                argb: string;
            };
        };
        left: {
            style: any;
            color: {
                argb: string;
            };
        };
        bottom: {
            style: any;
            color: {
                argb: string;
            };
        };
        right: {
            style: any;
            color: {
                argb: string;
            };
        };
    };
    /**
     * Create Amazon header style
     */
    static createAmazonHeaderStyle(): {
        font: {
            name: string;
            size: number;
            bold: boolean;
            italic: boolean;
            color: {
                argb: string;
            };
        };
        fill: {
            type: "pattern";
            pattern: any;
            fgColor: {
                argb: string;
            };
        };
        alignment: {
            horizontal: "center";
            vertical: "middle";
        };
        border: {
            top: {
                style: any;
                color: {
                    argb: string;
                };
            };
            left: {
                style: any;
                color: {
                    argb: string;
                };
            };
            bottom: {
                style: any;
                color: {
                    argb: string;
                };
            };
            right: {
                style: any;
                color: {
                    argb: string;
                };
            };
        };
    };
    /**
     * Create Amazon data style
     */
    static createAmazonDataStyle(): {
        font: {
            name: string;
            size: number;
            bold: boolean;
            italic: boolean;
            color: {
                argb: string;
            };
        };
        alignment: {
            horizontal: "left";
            vertical: "middle";
        };
    };
    /**
     * Create Amazon total style
     */
    static createAmazonTotalStyle(): {
        font: {
            name: string;
            size: number;
            bold: boolean;
            italic: boolean;
            color: {
                argb: string;
            };
        };
        fill: {
            type: "pattern";
            pattern: any;
            fgColor: {
                argb: string;
            };
        };
        alignment: {
            horizontal: "right";
            vertical: "middle";
        };
    };
    /**
     * Test Excel color formats
     */
    static testExcelColorFormats(): void;
}
//# sourceMappingURL=ExcelColorUtils.d.ts.map