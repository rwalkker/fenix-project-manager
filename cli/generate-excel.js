#!/usr/bin/env node
"use strict";
// FENIX Project Manager - Excel Generation CLI
// Command-line tool for generating Excel workbooks
// Created: January 5, 2026
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const ExcelAgent_1 = require("../agents/ExcelAgent");
const excel_templates_1 = require("../templates/excel-templates");
const dotenv = __importStar(require("dotenv"));
dotenv.config();
async function main() {
    const args = process.argv.slice(2);
    if (args.length === 0 || args[0] === '--help') {
        showHelp();
        return;
    }
    const command = args[0];
    switch (command) {
        case 'list':
            listAvailableTemplates();
            break;
        case 'generate':
            await generateExcel(args[1], args[2]);
            break;
        case 'test':
            await testGeneration();
            break;
        default:
            console.error(`Unknown command: ${command}`);
            showHelp();
    }
}
function showHelp() {
    console.log(`
FENIX Project Manager - Excel Generation CLI

Usage:
  npm run generate:excel <command> [options]

Commands:
  list                    List available templates
  generate <template>     Generate Excel from template
  test                    Generate test workbook
  --help                  Show this help message

Examples:
  npm run generate:excel list
  npm run generate:excel generate project-status
  npm run generate:excel test

Templates:
  - project-status        Project status report
  - budget-tracker        Budget tracking workbook
  - kpi-dashboard         KPI dashboard
  - resource-allocation   Resource allocation
  - timeline              Project timeline
  - data-analysis         Data analysis workbook
  `);
}
function listAvailableTemplates() {
    console.log('\n📊 Available Excel Templates:\n');
    const templates = (0, excel_templates_1.listTemplates)();
    templates.forEach((t, i) => {
        console.log(`${i + 1}. ${t.name}`);
        console.log(`   ${t.description}\n`);
    });
}
async function generateExcel(templateName, _outputName) {
    // outputName reserved for future custom naming
    if (!templateName) {
        console.error('❌ Template name required');
        console.log('Run "npm run generate:excel list" to see available templates');
        return;
    }
    console.log(`\n📊 Generating Excel workbook from template: ${templateName}\n`);
    // Sample data for demonstration
    const sampleData = getSampleData(templateName);
    const template = (0, excel_templates_1.getTemplate)(templateName, sampleData);
    if (!template) {
        console.error(`❌ Template not found: ${templateName}`);
        return;
    }
    const agent = (0, ExcelAgent_1.createExcelAgent)();
    const result = await agent.generate(template);
    if (result.success) {
        console.log('✅ Excel workbook generated successfully!\n');
        console.log(`📁 File: ${result.fileName}`);
        console.log(`📍 Path: ${result.filePath}`);
        console.log(`📊 Sheets: ${result.sheets.join(', ')}`);
        console.log(`💾 Size: ${(result.fileSize / 1024).toFixed(2)} KB`);
        console.log(`⏱️  Time: ${result.generationTime}ms\n`);
    }
    else {
        console.error(`❌ Generation failed: ${result.error}`);
    }
}
async function testGeneration() {
    console.log('\n🧪 Running Excel generation test...\n');
    const agent = (0, ExcelAgent_1.createExcelAgent)();
    const testWorkbook = {
        title: 'Test_Workbook',
        author: 'FENIX Test',
        subject: 'Test Generation',
        sheets: [
            {
                name: 'Test Data',
                headers: ['Name', 'Value', 'Status', 'Date'],
                data: [
                    ['Item 1', 100, 'Active', '2026-01-05'],
                    ['Item 2', 200, 'Pending', '2026-01-06'],
                    ['Item 3', 150, 'Complete', '2026-01-07']
                ],
                formatting: {
                    freezePanes: { row: 1, col: 0 },
                    autoFilter: true
                }
            }
        ]
    };
    const result = await agent.generate(testWorkbook);
    if (result.success) {
        console.log('✅ Test passed!\n');
        console.log(`📁 File: ${result.fileName}`);
        console.log(`📍 Path: ${result.filePath}`);
        console.log(`💾 Size: ${(result.fileSize / 1024).toFixed(2)} KB\n`);
    }
    else {
        console.error(`❌ Test failed: ${result.error}`);
    }
}
function getSampleData(templateName) {
    const samples = {
        'project-status': {
            projectName: 'FENIX Enhancement',
            completion: '75%',
            budgetUsed: '$45,000',
            teamSize: '8',
            riskLevel: 'Low',
            tasks: [
                ['T001', 'Requirements Gathering', 'John Doe', 'Complete', '2026-01-15', 'High'],
                ['T002', 'Design Phase', 'Jane Smith', 'In Progress', '2026-01-20', 'High'],
                ['T003', 'Development', 'Team', 'Not Started', '2026-02-01', 'Medium']
            ],
            timeline: [
                ['Planning', '2026-01-01', '2026-01-15', '15', 'Complete'],
                ['Design', '2026-01-16', '2026-01-31', '16', 'In Progress'],
                ['Development', '2026-02-01', '2026-03-15', '43', 'Not Started']
            ]
        },
        'budget-tracker': {
            period: 'Q1_2026',
            summary: [
                ['Personnel', 50000, 48000, 2000, 0.04],
                ['Equipment', 20000, 22000, -2000, -0.10],
                ['Software', 15000, 14500, 500, 0.03],
                ['Travel', 10000, 8500, 1500, 0.15]
            ],
            expenses: [
                ['2026-01-05', 'Personnel', 'Salaries', 15000, 'Payroll', 'Manager'],
                ['2026-01-10', 'Equipment', 'Laptops', 5000, 'Dell', 'IT Director']
            ],
            monthlyTrend: [
                ['January', 30000, 28500, 1500],
                ['February', 32000, 31000, 1000],
                ['March', 33000, 33500, -500]
            ]
        },
        'kpi-dashboard': {
            period: 'January_2026',
            kpis: [
                ['Customer Satisfaction', '90%', '92%', '102%', 'Exceeds', '↑'],
                ['On-Time Delivery', '95%', '93%', '98%', 'Meets', '→'],
                ['Cost per Unit', '$50', '$48', '104%', 'Exceeds', '↑']
            ],
            kpiNames: ['Customer Satisfaction', 'On-Time Delivery', 'Cost per Unit'],
            historical: [
                ['2026-01-01', 90, 94, 50],
                ['2026-01-08', 91, 93, 49],
                ['2026-01-15', 92, 93, 48]
            ],
            analysis: [
                ['Customer Satisfaction', '95%', '88%', '91%', '2.1%'],
                ['On-Time Delivery', '97%', '90%', '93%', '2.5%']
            ]
        }
    };
    return samples[templateName] || {};
}
// Run CLI
main().catch(console.error);
//# sourceMappingURL=generate-excel.js.map