import type { ExcelWorkbookOptions, ExcelChartDefinition, ExcelGenerationResult, ExcelTheme } from '../models/excel-types';
/**
 * Excel Agent - Generates Excel workbooks with AI enhancement
 */
export declare class ExcelAgent {
    private workbook;
    private theme;
    private outputDir;
    private dataService;
    private macroService;
    private validationService;
    constructor(theme?: ExcelTheme);
    /**
     * Generate Excel workbook
     */
    generate(options: ExcelWorkbookOptions): Promise<ExcelGenerationResult>;
    /**
     * Create worksheet
     */
    private createSheet;
    /**
     * Apply cell style with enhanced color handling
     */
    private applyStyle;
    /**
     * Apply sheet formatting
     */
    private applyFormatting;
    /**
     * Add chart to worksheet
     */
    private addChart;
    /**
     * Add table to worksheet
     */
    private addTable;
    /**
     * Generate from template using the comprehensive template system
     */
    generateFromTemplate(templateId: string, title: string, data: any): Promise<ExcelGenerationResult>;
    /**
     * Save workbook to file
     */
    save(filePath: string): Promise<void>;
    /**
     * AI-enhanced data analysis
     */
    analyzeData(data: any[][]): Promise<string>;
    /**
     * AI-powered formula suggestions
     */
    suggestFormulas(columnName: string, sampleData: any[]): Promise<string[]>;
    /**
     * Generate chart recommendations
     */
    recommendCharts(data: any[][], headers: string[]): Promise<ExcelChartDefinition[]>;
    /**
     * Generate workbook (orchestrator compatibility method)
     * Wrapper around generate() for AgentOrchestrator
     */
    generateWorkbook(inputs: any): Promise<any>;
}
/**
 * Create Excel agent instance
 */
export declare function createExcelAgent(theme?: ExcelTheme): ExcelAgent;
//# sourceMappingURL=ExcelAgent.d.ts.map