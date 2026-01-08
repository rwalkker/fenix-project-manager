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
    position: {
        row: number;
        col: number;
    };
    size?: {
        width: number;
        height: number;
    };
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
    freezePanes?: {
        row: number;
        col: number;
    };
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
export declare const AMAZON_EXCEL_THEME: ExcelTheme;
//# sourceMappingURL=excel-types.d.ts.map