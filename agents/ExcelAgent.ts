// FENIX Project Manager - Excel Agent
// AI-powered Excel workbook generation
// Created: January 5, 2026

import ExcelJS from 'exceljs';
import * as path from 'path';
import * as fs from 'fs';
import type {
  ExcelWorkbookOptions,
  ExcelSheetDefinition,
  ExcelCellStyle,
  ExcelChartDefinition,
  ExcelGenerationResult,
  ExcelTheme
} from '../models/excel-types';
import { getBedrockService } from '../services/AWSBedrockService';
import { DataIntelligenceService } from '../services/DataIntelligenceService';
import { MacroBuilderService } from '../services/MacroBuilderService';
import { ValidationService } from '../services/ValidationService';
import { ExcelColorUtils } from '../utils/ExcelColorUtils';

/**
 * Excel Agent - Generates Excel workbooks with AI enhancement
 */
export class ExcelAgent {
  private workbook: ExcelJS.Workbook;
  private theme: ExcelTheme;
  private outputDir: string;
  private dataService: DataIntelligenceService;
  private macroService: MacroBuilderService;
  private validationService: ValidationService;

  constructor(theme?: ExcelTheme) {
    this.workbook = new ExcelJS.Workbook();
    this.theme = theme || require('../models/excel-types').AMAZON_EXCEL_THEME;
    this.outputDir = process.env.STORAGE_PATH || './output/excel';
    this.dataService = new DataIntelligenceService();
    this.macroService = new MacroBuilderService();
    this.validationService = new ValidationService();
    
    console.log(`📊 Excel Agent initialized with enhanced theming: ${this.theme.name}`);
    console.log(`   Primary: ${this.theme.colorScheme.primary}`);
    console.log(`   Secondary: ${this.theme.colorScheme.secondary}`);
    console.log(`   Fonts: ${this.theme.fonts.heading}`);
    
    // Ensure output directory exists
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * Generate Excel workbook
   */
  async generate(options: ExcelWorkbookOptions): Promise<ExcelGenerationResult> {
    const startTime = Date.now();

    try {
      // Set workbook properties
      this.workbook.creator = options.author || 'FENIX Project Manager';
      this.workbook.created = new Date();
      this.workbook.modified = new Date();
      this.workbook.lastModifiedBy = options.author || 'FENIX Project Manager';
      this.workbook.title = options.title || '';
      this.workbook.subject = options.subject || '';
      this.workbook.keywords = options.keywords?.join(', ') || '';

      // Create sheets
      const sheetNames: string[] = [];
      for (const sheetDef of options.sheets) {
        await this.createSheet(sheetDef);
        sheetNames.push(sheetDef.name);
      }

      // Generate filename
      const fileName = `${options.title.replace(/[^a-z0-9]/gi, '_')}_${Date.now()}.xlsx`;
      const filePath = path.join(this.outputDir, fileName);

      // Write file
      await this.workbook.xlsx.writeFile(filePath);

      // Get file size
      const stats = fs.statSync(filePath);

      return {
        success: true,
        filePath,
        fileName,
        fileSize: stats.size,
        sheets: sheetNames,
        generationTime: Date.now() - startTime
      };

    } catch (error: any) {
      console.error('Excel generation error:', error);
      return {
        success: false,
        filePath: '',
        fileName: '',
        fileSize: 0,
        sheets: [],
        generationTime: Date.now() - startTime,
        error: error.message
      };
    }
  }

  /**
   * Create worksheet
   */
  private async createSheet(sheetDef: ExcelSheetDefinition): Promise<void> {
    const worksheet = this.workbook.addWorksheet(sheetDef.name);

    // Add headers if provided
    if (sheetDef.headers) {
      const headerRow = worksheet.addRow(sheetDef.headers);
      this.applyStyle(headerRow, this.theme.headerStyle);
    }

    // Add data
    if (sheetDef.data) {
      sheetDef.data.forEach(row => {
        const dataRow = worksheet.addRow(row);
        this.applyStyle(dataRow, this.theme.dataStyle);
      });
    }

    // Add columns with definitions
    if (sheetDef.columns) {
      worksheet.columns = sheetDef.columns.map(col => ({
        header: col.header,
        key: col.key,
        width: col.width || 15
      }));
    }

    // Apply formatting
    if (sheetDef.formatting) {
      this.applyFormatting(worksheet, sheetDef.formatting);
    }

    // Add charts
    if (sheetDef.charts) {
      for (const chartDef of sheetDef.charts) {
        this.addChart(worksheet, chartDef);
      }
    }

    // Add tables
    if (sheetDef.tables) {
      for (const tableDef of sheetDef.tables) {
        this.addTable(worksheet, tableDef);
      }
    }
  }

  /**
   * Apply cell style with enhanced color handling
   */
  private applyStyle(row: ExcelJS.Row, style: ExcelCellStyle): void {
    console.log('🎨 Applying enhanced Excel styling...');
    
    row.eachCell(cell => {
      if (style.font) {
        cell.font = {
          name: style.font.name || 'Arial', // Use Arial as fallback
          size: style.font.size || 10,
          bold: style.font.bold || false,
          italic: style.font.italic || false,
          underline: style.font.underline || false,
          color: style.font.color ? ExcelColorUtils.getExcelColor(style.font.color) : undefined
        };
        
        if (style.font.color) {
          console.log(`   Font color applied: ${style.font.color} -> ${ExcelColorUtils.hexToArgb(style.font.color)}`);
        }
      }

      if (style.fill) {
        cell.fill = {
          type: 'pattern',
          pattern: (style.fill.pattern as any) || 'solid',
          fgColor: style.fill.fgColor ? ExcelColorUtils.getExcelColor(style.fill.fgColor) : undefined,
          bgColor: style.fill.bgColor ? ExcelColorUtils.getExcelColor(style.fill.bgColor) : undefined
        };
        
        if (style.fill.fgColor) {
          console.log(`   Fill color applied: ${style.fill.fgColor} -> ${ExcelColorUtils.hexToArgb(style.fill.fgColor)}`);
        }
      }

      if (style.alignment) {
        cell.alignment = {
          horizontal: style.alignment.horizontal,
          vertical: style.alignment.vertical,
          wrapText: style.alignment.wrapText
        };
      }

      if (style.numFmt) {
        cell.numFmt = style.numFmt;
      }
      
      // Add borders for better visual separation
      if (style.font?.bold) {
        cell.border = ExcelColorUtils.createAmazonBorder(this.theme.colorScheme.secondary);
      }
    });
  }

  /**
   * Apply sheet formatting
   */
  private applyFormatting(worksheet: ExcelJS.Worksheet, formatting: any): void {
    // Freeze panes
    if (formatting.freezePanes) {
      worksheet.views = [{
        state: 'frozen',
        xSplit: formatting.freezePanes.col,
        ySplit: formatting.freezePanes.row
      }];
    }

    // Auto filter
    if (formatting.autoFilter) {
      worksheet.autoFilter = {
        from: { row: 1, column: 1 },
        to: { row: worksheet.rowCount, column: worksheet.columnCount }
      };
    }

    // Column widths
    if (formatting.columnWidths) {
      Object.entries(formatting.columnWidths).forEach(([col, width]) => {
        const column = worksheet.getColumn(col);
        if (column) column.width = width as number;
      });
    }
  }

  /**
   * Add chart to worksheet
   */
  private addChart(_worksheet: ExcelJS.Worksheet, chartDef: ExcelChartDefinition): void {
    // Note: ExcelJS has limited chart support
    // For production, consider using additional libraries or manual chart creation
    console.log(`Chart "${chartDef.title}" would be added at position (${chartDef.position.row}, ${chartDef.position.col})`);
  }

  /**
   * Add table to worksheet
   */
  private addTable(worksheet: ExcelJS.Worksheet, tableDef: any): void {
    worksheet.addTable({
      name: tableDef.name,
      ref: tableDef.ref,
      headerRow: tableDef.headerRow !== false,
      totalsRow: tableDef.totalsRow || false,
      style: {
        theme: tableDef.style || 'TableStyleMedium2',
        showRowStripes: true,
      },
      columns: tableDef.columns || [],
      rows: tableDef.rows || [],
    } as any); // Type assertion needed due to ExcelJS type limitations
  }

  /**
   * Generate from template using the comprehensive template system
   */
  async generateFromTemplate(templateId: string, title: string, data: any): Promise<ExcelGenerationResult> {
    console.log(`📊 Generating Excel from template: ${templateId}`);
    
    try {
      // Import the template system
      const { getTemplate } = await import('../templates/excel-templates');
      
      // Get the template
      const templateOptions = getTemplate(templateId, {
        ...data,
        title: title
      });
      
      console.log(`   Template loaded: ${templateOptions.sheets.length} sheets`);
      
      // Generate using the template
      return this.generate(templateOptions);
      
    } catch (error) {
      console.error(`Failed to load Excel template ${templateId}:`, error);
      
      // Fallback to basic generation
      const options: ExcelWorkbookOptions = {
        title,
        author: data.author || 'FENIX Project Manager',
        subject: data.subject || title,
        sheets: data.sheets || [
          {
            name: 'Sheet1',
            headers: ['Column 1', 'Column 2', 'Column 3'],
            data: [
              ['Sample', 'Data', 'Row 1'],
              ['Sample', 'Data', 'Row 2']
            ]
          }
        ]
      };
      
      return this.generate(options);
    }
  }

  /**
   * Save workbook to file
   */
  async save(filePath: string): Promise<void> {
    // This method is called after generate() which already saves the file
    // For now, this is a no-op as the file is saved in generate()
    console.log(`Workbook would be saved to: ${filePath}`);
  }

  /**
   * AI-enhanced data analysis
   */
  async analyzeData(data: any[][]): Promise<string> {
    const bedrock = getBedrockService();
    
    const prompt = `Analyze this data and provide insights:
${JSON.stringify(data.slice(0, 10))}

Provide:
1. Key patterns or trends
2. Suggested visualizations
3. Recommended calculations
4. Data quality observations`;

    const response = await bedrock.invoke({
      prompt,
      maxTokens: 1000,
      temperature: 0.7
    });

    return response.completion;
  }

  /**
   * AI-powered formula suggestions
   */
  async suggestFormulas(columnName: string, sampleData: any[]): Promise<string[]> {
    const bedrock = getBedrockService();
    
    const prompt = `For an Excel column named "${columnName}" with sample data:
${JSON.stringify(sampleData.slice(0, 5))}

Suggest 3-5 useful Excel formulas that could be applied to this column.
Format: Just list the formulas, one per line.`;

    const response = await bedrock.invoke({
      prompt,
      maxTokens: 500,
      temperature: 0.5
    });

    return response.completion.split('\n').filter(f => f.trim());
  }

  /**
   * Generate chart recommendations
   */
  async recommendCharts(data: any[][], headers: string[]): Promise<ExcelChartDefinition[]> {
    const bedrock = getBedrockService();
    
    const prompt = `Given this data with headers: ${headers.join(', ')}
Sample data: ${JSON.stringify(data.slice(0, 5))}

Recommend 2-3 appropriate chart types and configurations.
Format as JSON array with: type, title, dataRange, categories`;

    const response = await bedrock.invoke({
      prompt,
      maxTokens: 800,
      temperature: 0.6
    });

    try {
      return JSON.parse(response.completion);
    } catch {
      return [];
    }
  }

  /**
   * Generate workbook (orchestrator compatibility method)
   * Wrapper around generate() for AgentOrchestrator
   */
  async generateWorkbook(inputs: any): Promise<any> {
    // Convert inputs to ExcelWorkbookOptions format
    const options: ExcelWorkbookOptions = {
      title: inputs.title || 'Workbook',
      author: inputs.author,
      subject: inputs.subject,
      sheets: inputs.sheets || inputs.worksheets || [],
      theme: inputs.theme
    };

    const result = await this.generate(options);
    
    return {
      filePath: result.filePath,
      fileName: result.fileName,
      sheetCount: result.sheets.length,
      success: result.success,
      error: result.error
    };
  }
}

/**
 * Create Excel agent instance
 */
export function createExcelAgent(theme?: ExcelTheme): ExcelAgent {
  return new ExcelAgent(theme);
}
