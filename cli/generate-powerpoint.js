#!/usr/bin/env node
"use strict";
// FENIX Project Manager - PowerPoint Generation CLI
// Command-line tool for generating PowerPoint presentations
// Created: January 6, 2026
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
const commander_1 = require("commander");
const PowerPointAgent_1 = require("../agents/PowerPointAgent");
const powerpoint_templates_1 = require("../templates/powerpoint-templates");
const fs = __importStar(require("fs"));
// import * as path from 'path'; // Reserved for future use
const program = new commander_1.Command();
program
    .name('generate-powerpoint')
    .description('Generate PowerPoint presentations using FENIX templates')
    .version('1.0.0');
/**
 * List available templates
 */
program
    .command('list')
    .description('List all available PowerPoint templates')
    .action(() => {
    console.log('\n📊 Available PowerPoint Templates:\n');
    const templates = (0, powerpoint_templates_1.listPowerPointTemplates)();
    templates.forEach((template, index) => {
        console.log(`${index + 1}. ${template.name}`);
        console.log(`   ID: ${template.id}`);
        console.log(`   Description: ${template.description}`);
        console.log(`   Slides: ${template.slideCount}`);
        console.log('');
    });
    console.log('Usage: generate-powerpoint generate <template-id> [options]\n');
});
/**
 * Generate presentation from template
 */
program
    .command('generate <template>')
    .description('Generate a PowerPoint presentation from a template')
    .option('-o, --output <path>', 'Output directory', './output/powerpoint')
    .option('-d, --data <json>', 'Custom data as JSON string')
    .option('-f, --file <path>', 'Custom data from JSON file')
    .option('--project-name <name>', 'Project name (for project-status template)')
    .option('--topic <topic>', 'Topic (for executive-presentation, training-deck templates)')
    .option('--presenter <name>', 'Presenter name')
    .option('--trainer <name>', 'Trainer name (for training-deck template)')
    .option('--change-name <name>', 'Change name (for change-management template)')
    .option('--system-name <name>', 'System name (for technical-review template)')
    .option('--quarter <quarter>', 'Quarter (for quarterly-review template)')
    .option('--department <dept>', 'Department name')
    .action(async (template, options) => {
    try {
        console.log(`\n📊 Generating PowerPoint presentation: ${template}\n`);
        // Validate template
        const templates = (0, powerpoint_templates_1.listPowerPointTemplates)();
        const templateInfo = templates.find(t => t.id === template);
        if (!templateInfo) {
            console.error(`❌ Error: Template '${template}' not found`);
            console.log('\nAvailable templates:');
            templates.forEach(t => console.log(`  - ${t.id}`));
            process.exit(1);
        }
        // Prepare custom data
        let customData = {};
        if (options.data) {
            try {
                customData = JSON.parse(options.data);
            }
            catch (error) {
                console.error('❌ Error: Invalid JSON in --data option');
                process.exit(1);
            }
        }
        if (options.file) {
            try {
                const fileContent = fs.readFileSync(options.file, 'utf-8');
                customData = { ...customData, ...JSON.parse(fileContent) };
            }
            catch (error) {
                console.error(`❌ Error reading data file: ${error.message}`);
                process.exit(1);
            }
        }
        // Add command-line options to custom data
        if (options.projectName)
            customData.projectName = options.projectName;
        if (options.topic)
            customData.topic = options.topic;
        if (options.presenter)
            customData.presenter = options.presenter;
        if (options.trainer)
            customData.trainer = options.trainer;
        if (options.changeName)
            customData.changeName = options.changeName;
        if (options.systemName)
            customData.systemName = options.systemName;
        if (options.quarter)
            customData.quarter = options.quarter;
        if (options.department)
            customData.department = options.department;
        // Get template
        const presentationOptions = (0, powerpoint_templates_1.getPowerPointTemplate)(template, customData);
        // Create agent and generate
        const agent = (0, PowerPointAgent_1.createPowerPointAgent)();
        const result = await agent.generate(presentationOptions);
        if (result.success) {
            console.log('✅ PowerPoint presentation generated successfully!\n');
            console.log(`📄 File: ${result.fileName}`);
            console.log(`📁 Path: ${result.filePath}`);
            console.log(`📊 Slides: ${result.slideCount}`);
            console.log(`💾 Size: ${(result.fileSize / 1024).toFixed(2)} KB`);
            console.log(`⏱️  Time: ${result.generationTime}ms`);
            if (result.warnings && result.warnings.length > 0) {
                console.log('\n⚠️  Warnings:');
                result.warnings.forEach(warning => console.log(`  - ${warning}`));
            }
            console.log('');
        }
        else {
            console.error(`\n❌ Error generating presentation: ${result.error}\n`);
            if (result.warnings && result.warnings.length > 0) {
                console.log('Warnings:');
                result.warnings.forEach(warning => console.log(`  - ${warning}`));
            }
            process.exit(1);
        }
    }
    catch (error) {
        console.error(`\n❌ Error: ${error.message}\n`);
        process.exit(1);
    }
});
/**
 * Test template generation
 */
program
    .command('test <template>')
    .description('Test a template by generating with sample data')
    .action(async (template) => {
    try {
        console.log(`\n🧪 Testing template: ${template}\n`);
        // Validate template
        const templates = (0, powerpoint_templates_1.listPowerPointTemplates)();
        const templateInfo = templates.find(t => t.id === template);
        if (!templateInfo) {
            console.error(`❌ Error: Template '${template}' not found`);
            process.exit(1);
        }
        // Sample data for each template
        const sampleData = {
            'project-status': {
                projectName: 'Digital Transformation Initiative',
                date: new Date().toLocaleDateString(),
                status: 'On Track',
                author: 'Jane Smith',
                completion: '65%',
                budgetStatus: 'Within budget',
                teamSize: '12 members',
                nextMilestone: 'Phase 2 completion'
            },
            'executive-presentation': {
                topic: 'Cloud Migration Strategy',
                presenter: 'John Doe',
                date: new Date().toLocaleDateString()
            },
            'training-deck': {
                topic: 'AWS Best Practices',
                trainer: 'Sarah Johnson',
                duration: '3.5 hours'
            },
            'change-management': {
                changeName: 'New CRM System Implementation',
                effectiveDate: 'March 1, 2026'
            },
            'technical-review': {
                systemName: 'Customer Data Platform',
                architect: 'Mike Chen',
                date: new Date().toLocaleDateString()
            },
            'quarterly-review': {
                quarter: 'Q4 2025',
                department: 'Engineering',
                presenter: 'Alex Rodriguez'
            }
        };
        const data = sampleData[template] || {};
        // Get template and generate
        const presentationOptions = (0, powerpoint_templates_1.getPowerPointTemplate)(template, data);
        const agent = (0, PowerPointAgent_1.createPowerPointAgent)();
        const result = await agent.generate(presentationOptions);
        if (result.success) {
            console.log('✅ Test successful!\n');
            console.log(`📄 File: ${result.fileName}`);
            console.log(`📁 Path: ${result.filePath}`);
            console.log(`📊 Slides: ${result.slideCount}`);
            console.log(`💾 Size: ${(result.fileSize / 1024).toFixed(2)} KB`);
            console.log(`⏱️  Time: ${result.generationTime}ms\n`);
        }
        else {
            console.error(`\n❌ Test failed: ${result.error}\n`);
            process.exit(1);
        }
    }
    catch (error) {
        console.error(`\n❌ Error: ${error.message}\n`);
        process.exit(1);
    }
});
/**
 * Validate presentation
 */
program
    .command('validate <template>')
    .description('Validate a template structure')
    .option('-d, --data <json>', 'Custom data as JSON string')
    .action((template, options) => {
    try {
        console.log(`\n🔍 Validating template: ${template}\n`);
        // Validate template exists
        const templates = (0, powerpoint_templates_1.listPowerPointTemplates)();
        const templateInfo = templates.find(t => t.id === template);
        if (!templateInfo) {
            console.error(`❌ Error: Template '${template}' not found`);
            process.exit(1);
        }
        // Prepare data
        let customData = {};
        if (options.data) {
            try {
                customData = JSON.parse(options.data);
            }
            catch (error) {
                console.error('❌ Error: Invalid JSON in --data option');
                process.exit(1);
            }
        }
        // Get template
        const presentationOptions = (0, powerpoint_templates_1.getPowerPointTemplate)(template, customData);
        // Validate with agent
        const agent = (0, PowerPointAgent_1.createPowerPointAgent)();
        const validation = agent.validatePresentation(presentationOptions);
        console.log(`Template: ${templateInfo.name}`);
        console.log(`Slides: ${presentationOptions.slides.length}`);
        console.log(`Valid: ${validation.valid ? '✅ Yes' : '❌ No'}\n`);
        if (validation.errors.length > 0) {
            console.log('❌ Errors:');
            validation.errors.forEach(error => {
                console.log(`  Slide ${error.slide}: ${error.message} (${error.severity})`);
            });
            console.log('');
        }
        if (validation.warnings.length > 0) {
            console.log('⚠️  Warnings:');
            validation.warnings.forEach(warning => {
                console.log(`  Slide ${warning.slide}: ${warning.message}`);
                if (warning.recommendation) {
                    console.log(`    → ${warning.recommendation}`);
                }
            });
            console.log('');
        }
        if (validation.suggestions.length > 0) {
            console.log('💡 Suggestions:');
            validation.suggestions.forEach(suggestion => {
                console.log(`  - ${suggestion}`);
            });
            console.log('');
        }
        console.log(`Accessibility Score: ${validation.accessibilityScore}/100`);
        console.log(`Readability Score: ${validation.readabilityScore}/100\n`);
        if (!validation.valid) {
            process.exit(1);
        }
    }
    catch (error) {
        console.error(`\n❌ Error: ${error.message}\n`);
        process.exit(1);
    }
});
// Parse command line arguments
program.parse(process.argv);
// Show help if no command provided
if (!process.argv.slice(2).length) {
    program.outputHelp();
}
//# sourceMappingURL=generate-powerpoint.js.map