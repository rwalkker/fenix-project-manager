"use strict";
// FENIX Project Manager - Excel Templates
// Pre-built templates for common operations documents
// Created: January 5, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectStatusTemplate = createProjectStatusTemplate;
exports.createBudgetTrackerTemplate = createBudgetTrackerTemplate;
exports.createKPIDashboardTemplate = createKPIDashboardTemplate;
exports.createResourceAllocationTemplate = createResourceAllocationTemplate;
exports.createTimelineTemplate = createTimelineTemplate;
exports.createDataAnalysisTemplate = createDataAnalysisTemplate;
exports.getTemplate = getTemplate;
exports.listTemplates = listTemplates;
/**
 * Project Status Report Template
 */
function createProjectStatusTemplate(projectData) {
    return {
        title: `Project_Status_${projectData.projectName}`,
        author: projectData.author || 'Operations Team',
        subject: 'Project Status Report',
        keywords: ['project', 'status', 'report', 'operations'],
        sheets: [
            {
                name: 'Executive Summary',
                headers: ['Metric', 'Value', 'Status', 'Trend'],
                data: [
                    ['Project Name', projectData.projectName, 'Active', '→'],
                    ['Completion %', projectData.completion || '0%', 'On Track', '↑'],
                    ['Budget Used', projectData.budgetUsed || '$0', 'Within Budget', '→'],
                    ['Team Size', projectData.teamSize || '0', 'Adequate', '→'],
                    ['Risk Level', projectData.riskLevel || 'Low', 'Acceptable', '↓']
                ],
                formatting: {
                    freezePanes: { row: 1, col: 0 },
                    autoFilter: true,
                    columnWidths: { A: 20, B: 15, C: 15, D: 10 }
                }
            },
            {
                name: 'Tasks',
                headers: ['Task ID', 'Task Name', 'Owner', 'Status', 'Due Date', 'Priority'],
                data: projectData.tasks || [],
                formatting: {
                    freezePanes: { row: 1, col: 0 },
                    autoFilter: true
                }
            },
            {
                name: 'Timeline',
                headers: ['Phase', 'Start Date', 'End Date', 'Duration (Days)', 'Status'],
                data: projectData.timeline || []
            }
        ]
    };
}
/**
 * Budget Tracker Template
 */
function createBudgetTrackerTemplate(budgetData) {
    return {
        title: `Budget_Tracker_${budgetData.period}`,
        author: budgetData.author || 'Finance Team',
        subject: 'Budget Tracking',
        keywords: ['budget', 'finance', 'tracking', 'expenses'],
        sheets: [
            {
                name: 'Summary',
                headers: ['Category', 'Budgeted', 'Actual', 'Variance', 'Variance %'],
                data: budgetData.summary || [],
                columns: [
                    { header: 'Category', key: 'category', width: 20 },
                    { header: 'Budgeted', key: 'budgeted', width: 15, style: { numFmt: '$#,##0.00' } },
                    { header: 'Actual', key: 'actual', width: 15, style: { numFmt: '$#,##0.00' } },
                    { header: 'Variance', key: 'variance', width: 15, style: { numFmt: '$#,##0.00' } },
                    { header: 'Variance %', key: 'variancePct', width: 12, style: { numFmt: '0.0%' } }
                ],
                formatting: {
                    freezePanes: { row: 1, col: 0 },
                    autoFilter: true
                }
            },
            {
                name: 'Detailed Expenses',
                headers: ['Date', 'Category', 'Description', 'Amount', 'Vendor', 'Approved By'],
                data: budgetData.expenses || [],
                formatting: {
                    freezePanes: { row: 1, col: 0 },
                    autoFilter: true
                }
            },
            {
                name: 'Monthly Trend',
                headers: ['Month', 'Budgeted', 'Actual', 'Variance'],
                data: budgetData.monthlyTrend || []
            }
        ]
    };
}
/**
 * KPI Dashboard Template
 */
function createKPIDashboardTemplate(kpiData) {
    return {
        title: `KPI_Dashboard_${kpiData.period}`,
        author: kpiData.author || 'Operations Team',
        subject: 'KPI Dashboard',
        keywords: ['kpi', 'metrics', 'dashboard', 'performance'],
        sheets: [
            {
                name: 'KPI Overview',
                headers: ['KPI', 'Target', 'Actual', 'Achievement %', 'Status', 'Trend'],
                data: kpiData.kpis || [],
                formatting: {
                    freezePanes: { row: 1, col: 0 },
                    autoFilter: true,
                    columnWidths: { A: 25, B: 12, C: 12, D: 15, E: 12, F: 10 }
                }
            },
            {
                name: 'Historical Data',
                headers: ['Date', ...kpiData.kpiNames || []],
                data: kpiData.historical || []
            },
            {
                name: 'Analysis',
                headers: ['KPI', 'Best Performance', 'Worst Performance', 'Average', 'Std Dev'],
                data: kpiData.analysis || []
            }
        ]
    };
}
/**
 * Resource Allocation Template
 */
function createResourceAllocationTemplate(resourceData) {
    return {
        title: `Resource_Allocation_${resourceData.period}`,
        author: resourceData.author || 'Resource Manager',
        subject: 'Resource Allocation',
        keywords: ['resources', 'allocation', 'capacity', 'planning'],
        sheets: [
            {
                name: 'Resource Summary',
                headers: ['Resource Name', 'Role', 'Capacity %', 'Allocated %', 'Available %', 'Status'],
                data: resourceData.resources || [],
                formatting: {
                    freezePanes: { row: 1, col: 0 },
                    autoFilter: true
                }
            },
            {
                name: 'Project Assignments',
                headers: ['Resource', 'Project', 'Role', 'Allocation %', 'Start Date', 'End Date'],
                data: resourceData.assignments || []
            },
            {
                name: 'Capacity Planning',
                headers: ['Week', 'Total Capacity', 'Allocated', 'Available', 'Utilization %'],
                data: resourceData.capacityPlan || []
            }
        ]
    };
}
/**
 * Timeline/Gantt Chart Template
 */
function createTimelineTemplate(timelineData) {
    return {
        title: `Timeline_${timelineData.projectName}`,
        author: timelineData.author || 'Project Manager',
        subject: 'Project Timeline',
        keywords: ['timeline', 'gantt', 'schedule', 'milestones'],
        sheets: [
            {
                name: 'Timeline',
                headers: ['Task', 'Owner', 'Start Date', 'End Date', 'Duration', 'Dependencies', 'Status'],
                data: timelineData.tasks || [],
                formatting: {
                    freezePanes: { row: 1, col: 0 },
                    autoFilter: true,
                    columnWidths: { A: 30, B: 15, C: 12, D: 12, E: 10, F: 20, G: 12 }
                }
            },
            {
                name: 'Milestones',
                headers: ['Milestone', 'Target Date', 'Actual Date', 'Status', 'Notes'],
                data: timelineData.milestones || []
            },
            {
                name: 'Critical Path',
                headers: ['Task', 'Duration', 'Slack', 'Critical?'],
                data: timelineData.criticalPath || []
            }
        ]
    };
}
/**
 * Data Analysis Template
 */
function createDataAnalysisTemplate(analysisData) {
    return {
        title: `Data_Analysis_${analysisData.title}`,
        author: analysisData.author || 'Data Analyst',
        subject: 'Data Analysis',
        keywords: ['data', 'analysis', 'statistics', 'insights'],
        sheets: [
            {
                name: 'Raw Data',
                headers: analysisData.headers || [],
                data: analysisData.rawData || [],
                formatting: {
                    freezePanes: { row: 1, col: 0 },
                    autoFilter: true
                }
            },
            {
                name: 'Summary Statistics',
                headers: ['Metric', 'Count', 'Mean', 'Median', 'Std Dev', 'Min', 'Max'],
                data: analysisData.statistics || []
            },
            {
                name: 'Pivot Analysis',
                headers: analysisData.pivotHeaders || [],
                data: analysisData.pivotData || []
            },
            {
                name: 'Insights',
                headers: ['Finding', 'Impact', 'Recommendation', 'Priority'],
                data: analysisData.insights || []
            }
        ]
    };
}
/**
 * Get template by name
 */
function getTemplate(templateName, data) {
    const templates = {
        'project-status': createProjectStatusTemplate,
        'budget-tracker': createBudgetTrackerTemplate,
        'kpi-dashboard': createKPIDashboardTemplate,
        'resource-allocation': createResourceAllocationTemplate,
        'timeline': createTimelineTemplate,
        'data-analysis': createDataAnalysisTemplate
    };
    const templateFn = templates[templateName];
    return templateFn ? templateFn(data) : null;
}
/**
 * List available templates
 */
function listTemplates() {
    return [
        { name: 'project-status', description: 'Project status report with tasks and timeline' },
        { name: 'budget-tracker', description: 'Budget tracking with expenses and variance analysis' },
        { name: 'kpi-dashboard', description: 'KPI dashboard with metrics and trends' },
        { name: 'resource-allocation', description: 'Resource allocation and capacity planning' },
        { name: 'timeline', description: 'Project timeline with Gantt-style layout' },
        { name: 'data-analysis', description: 'Data analysis with statistics and insights' }
    ];
}
//# sourceMappingURL=excel-templates.js.map