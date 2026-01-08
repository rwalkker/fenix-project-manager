import type { ExcelWorkbookOptions } from '../models/excel-types';
/**
 * Project Status Report Template
 */
export declare function createProjectStatusTemplate(projectData: any): ExcelWorkbookOptions;
/**
 * Budget Tracker Template
 */
export declare function createBudgetTrackerTemplate(budgetData: any): ExcelWorkbookOptions;
/**
 * KPI Dashboard Template
 */
export declare function createKPIDashboardTemplate(kpiData: any): ExcelWorkbookOptions;
/**
 * Resource Allocation Template
 */
export declare function createResourceAllocationTemplate(resourceData: any): ExcelWorkbookOptions;
/**
 * Timeline/Gantt Chart Template
 */
export declare function createTimelineTemplate(timelineData: any): ExcelWorkbookOptions;
/**
 * Data Analysis Template
 */
export declare function createDataAnalysisTemplate(analysisData: any): ExcelWorkbookOptions;
/**
 * Get template by name
 */
export declare function getTemplate(templateName: string, data: any): ExcelWorkbookOptions | null;
/**
 * List available templates
 */
export declare function listTemplates(): Array<{
    name: string;
    description: string;
}>;
//# sourceMappingURL=excel-templates.d.ts.map