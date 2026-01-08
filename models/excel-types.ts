// FENIX Project Manager - Excel Types
// Type definitions for Excel workbook generation
// Created: January 5, 2026

import type { ColorScheme } from './document-types';

export interface ExcelWorkbookOptions {
  title: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  theme?: ExcelTheme;
  sheets: ExcelSheetDefinition[];
}

export interface ExcelSheetDefinition {
  name: string;
  data?: any[][];
  headers?: string[];
  columns?: ExcelColumnDefinition[];
  charts?: ExcelChartDefinition[];
  tables?: ExcelTableDefinition[];
  formatting?: ExcelSheetFormatting;
}

export interface ExcelColumnDefinition {
  header: string;
  key: string;
  width?: number;
  style?: ExcelCellStyle;
  formula?: string;
}

export interface ExcelCellStyle {
  font?: {
    name?: string;
    size?: number;
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
    color?: string;
  };
  fill?: {
    type: 'pattern' | 'gradient';
    pattern?: string;
    fgColor?: string;
    bgColor?: string;
  };
  border?: {
    top?: ExcelBorderStyle;
    left?: ExcelBorderStyle;
    bottom?: ExcelBorderStyle;
    right?: ExcelBorderStyle;
  };
  alignment?: {
    horizontal?: 'left' | 'center' | 'right';
    vertical?: 'top' | 'middle' | 'bottom';
    wrapText?: boolean;
  };
  numFmt?: string;
}

export interface ExcelBorderStyle {
  style: 'thin' | 'medium' | 'thick' | 'double';
  color?: string;
}

export interface ExcelChartDefinition {
  type: 'bar' | 'line' | 'pie' | 'scatter' | 'area' | 'column';
  title: string;
  position: { row: number; col: number };
  size?: { width: number; height: number };
  dataRange: string;
  categories?: string;
  series: ExcelChartSeries[];
  options?: ExcelChartOptions;
}

export interface ExcelChartSeries {
  name: string;
  values: string;
  color?: string;
}

export interface ExcelChartOptions {
  showLegend?: boolean;
  showDataLabels?: boolean;
  showGridlines?: boolean;
  xAxisTitle?: string;
  yAxisTitle?: string;
}

export interface ExcelTableDefinition {
  name: string;
  ref: string;
  headerRow?: boolean;
  totalsRow?: boolean;
  style?: string;
  columns?: Array<{
    name: string;
    totalsRowFunction?: 'sum' | 'average' | 'count' | 'max' | 'min';
  }>;
}

export interface ExcelSheetFormatting {
  freezePanes?: { row: number; col: number };
  autoFilter?: boolean;
  columnWidths?: Record<string, number>;
  rowHeights?: Record<number, number>;
  conditionalFormatting?: ExcelConditionalFormat[];
}

export interface ExcelConditionalFormat {
  ref: string;
  type: 'cellIs' | 'colorScale' | 'dataBar' | 'iconSet';
  operator?: 'greaterThan' | 'lessThan' | 'between' | 'equal';
  formula?: string;
  style?: ExcelCellStyle;
  priority?: number;
}

export interface ExcelTheme {
  name: string;
  colorScheme: ColorScheme;
  fonts: {
    heading: string;
    body: string;
  };
  headerStyle: ExcelCellStyle;
  dataStyle: ExcelCellStyle;
  totalStyle?: ExcelCellStyle;
}

export interface ExcelGenerationResult {
  success: boolean;
  filePath: string;
  fileName: string;
  fileSize: number;
  sheets: string[];
  generationTime: number;
  error?: string;
}

// Pre-defined Amazon theme with enhanced color handling
export const AMAZON_EXCEL_THEME: ExcelTheme = {
  name: 'Amazon Enhanced',
  colorScheme: {
    primary: '#FF9900',    // Amazon orange (will be converted to ARGB)
    secondary: '#232F3E',  // Amazon dark blue
    accent: '#146EB4',     // Amazon light blue
    background: '#FFFFFF', // White
    text: '#000000',       // Black
    success: '#067D62',    // Amazon green
    warning: '#F0B323',    // Amazon yellow
    error: '#D13212'       // Amazon red
  },
  fonts: {
    heading: 'Arial', // Use Arial as fallback instead of Amazon Ember
    body: 'Arial'     // Use Arial as fallback instead of Amazon Ember
  },
  headerStyle: {
    font: {
      name: 'Arial',
      size: 11,
      bold: true,
      color: '#FFFFFF'
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: '#FF9900' // Amazon orange (will be converted to ARGB)
    },
    alignment: {
      horizontal: 'center',
      vertical: 'middle'
    }
  },
  dataStyle: {
    font: {
      name: 'Arial',
      size: 10,
      color: '#000000'
    },
    alignment: {
      horizontal: 'left',
      vertical: 'middle'
    }
  },
  totalStyle: {
    font: {
      name: 'Arial',
      size: 10,
      bold: true,
      color: '#232F3E' // Amazon dark blue
    },
    fill: {
      type: 'pattern',
      pattern: 'solid',
      fgColor: '#F0F0F0' // Light gray
    },
    alignment: {
      horizontal: 'right',
      vertical: 'middle'
    }
  }
};
