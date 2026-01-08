// FENIX Project Manager - Excel Color Utilities
// Enhanced color handling for Excel theming
// Created: January 7, 2026

/**
 * Excel Color Utilities
 * Excel uses ARGB format (Alpha + RGB) for colors
 */
export class ExcelColorUtils {
  /**
   * Convert hex color to Excel ARGB format
   * Excel requires ARGB format: AARRGGBB where AA is alpha (FF for opaque)
   */
  static hexToArgb(hex: string): string {
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Validate hex format
    if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
      console.warn(`Invalid hex color: ${hex}`);
      return 'FF000000'; // Default to black
    }
    
    // Add alpha channel (FF for fully opaque)
    return `FF${hex.toUpperCase()}`;
  }

  /**
   * Convert ARGB to hex
   */
  static argbToHex(argb: string): string {
    if (argb.length === 8) {
      return `#${argb.substring(2)}`;
    }
    return argb;
  }

  /**
   * Get Excel-compatible color object
   */
  static getExcelColor(color: string): { argb: string } {
    return { argb: this.hexToArgb(color) };
  }

  /**
   * Validate Excel color format
   */
  static isValidExcelColor(color: string): boolean {
    // Check ARGB format
    if (/^[0-9A-Fa-f]{8}$/.test(color)) {
      return true;
    }
    
    // Check hex format
    if (/^#?[0-9A-Fa-f]{6}$/.test(color)) {
      return true;
    }
    
    return false;
  }

  /**
   * Amazon brand colors in Excel ARGB format
   */
  static readonly AMAZON_EXCEL_COLORS = {
    ORANGE: 'FFFF9900',
    DARK_BLUE: 'FF232F3E',
    LIGHT_BLUE: 'FF146EB4',
    WHITE: 'FFFFFFFF',
    BLACK: 'FF000000',
    GRAY: 'FF666666',
    LIGHT_GRAY: 'FFF0F0F0',
    SUCCESS: 'FF067D62',
    WARNING: 'FFF0B323',
    ERROR: 'FFD13212'
  } as const;

  /**
   * Get Amazon color palette for Excel
   */
  static getAmazonExcelPalette() {
    return {
      primary: this.AMAZON_EXCEL_COLORS.ORANGE,
      secondary: this.AMAZON_EXCEL_COLORS.DARK_BLUE,
      accent: this.AMAZON_EXCEL_COLORS.LIGHT_BLUE,
      background: this.AMAZON_EXCEL_COLORS.WHITE,
      text: this.AMAZON_EXCEL_COLORS.BLACK,
      textLight: this.AMAZON_EXCEL_COLORS.GRAY,
      backgroundLight: this.AMAZON_EXCEL_COLORS.LIGHT_GRAY,
      success: this.AMAZON_EXCEL_COLORS.SUCCESS,
      warning: this.AMAZON_EXCEL_COLORS.WARNING,
      error: this.AMAZON_EXCEL_COLORS.ERROR
    };
  }

  /**
   * Create Excel font object with Amazon styling
   */
  static createAmazonFont(options: {
    size?: number;
    bold?: boolean;
    italic?: boolean;
    color?: string;
    name?: string;
  } = {}) {
    return {
      name: options.name || 'Arial', // Use Arial as fallback
      size: options.size || 10,
      bold: options.bold || false,
      italic: options.italic || false,
      color: options.color ? this.getExcelColor(options.color) : this.getExcelColor('#000000')
    };
  }

  /**
   * Create Excel fill object with Amazon styling
   */
  static createAmazonFill(color: string, pattern: string = 'solid') {
    return {
      type: 'pattern' as const,
      pattern: pattern as any,
      fgColor: this.getExcelColor(color)
    };
  }

  /**
   * Create Excel border object with Amazon styling
   */
  static createAmazonBorder(color: string = '#232F3E', style: string = 'thin') {
    const borderColor = this.getExcelColor(color);
    const borderStyle = { style: style as any, color: borderColor };
    
    return {
      top: borderStyle,
      left: borderStyle,
      bottom: borderStyle,
      right: borderStyle
    };
  }

  /**
   * Create Amazon header style
   */
  static createAmazonHeaderStyle() {
    return {
      font: this.createAmazonFont({
        size: 11,
        bold: true,
        color: '#FFFFFF',
        name: 'Arial'
      }),
      fill: this.createAmazonFill('#FF9900'), // Amazon orange
      alignment: {
        horizontal: 'center' as const,
        vertical: 'middle' as const
      },
      border: this.createAmazonBorder('#232F3E')
    };
  }

  /**
   * Create Amazon data style
   */
  static createAmazonDataStyle() {
    return {
      font: this.createAmazonFont({
        size: 10,
        color: '#000000',
        name: 'Arial'
      }),
      alignment: {
        horizontal: 'left' as const,
        vertical: 'middle' as const
      }
    };
  }

  /**
   * Create Amazon total style
   */
  static createAmazonTotalStyle() {
    return {
      font: this.createAmazonFont({
        size: 10,
        bold: true,
        color: '#232F3E',
        name: 'Arial'
      }),
      fill: this.createAmazonFill('#F0F0F0'), // Light gray
      alignment: {
        horizontal: 'right' as const,
        vertical: 'middle' as const
      }
    };
  }

  /**
   * Test Excel color formats
   */
  static testExcelColorFormats(): void {
    console.log('📊 Testing Excel color formats:');
    
    const testColors = ['#FF9900', '#232F3E', '#146EB4'];
    
    testColors.forEach(color => {
      const argb = this.hexToArgb(color);
      const excelColor = this.getExcelColor(color);
      console.log(`${color} -> ARGB: ${argb} -> Excel: ${JSON.stringify(excelColor)}`);
      console.log(`  Valid: ${this.isValidExcelColor(color)}`);
    });
  }
}