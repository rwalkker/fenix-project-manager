#!/usr/bin/env node
// FENIX Project Manager - Word Generation CLI
// Command-line tool for generating Word documents
// Created: January 5, 2026

import { createWordAgent } from '../agents/WordAgent';
import { getWordTemplate, listWordTemplates } from '../templates/word-templates';
import { WordTemplateType } from '../models/word-types';

/**
 * Main CLI function
 */
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    showHelp();
    return;
  }

  if (command === 'list') {
    listAvailableTemplates();
    return;
  }

  if (command === 'generate') {
    const templateType = args[1] as WordTemplateType;
    if (!templateType) {
      console.error('❌ Error: Template type required');
      console.log('Usage: npm run generate:word generate <template-type>');
      console.log('Run "npm run generate:word list" to see available templates');
      process.exit(1);
    }

    await generateDocument(templateType);
    return;
  }

  if (command === 'test') {
    await testAllTemplates();
    return;
  }

  console.error(`❌ Unknown command: ${command}`);
  showHelp();
  process.exit(1);
}

/**
 * Show help information
 */
function showHelp() {
  console.log(`
📄 FENIX Word Document Generator

Usage:
  npm run generate:word <command> [options]

Commands:
  list                    List all available templates
  generate <template>     Generate a Word document from template
  test                    Generate all templates for testing
  help                    Show this help message

Examples:
  npm run generate:word list
  npm run generate:word generate white-paper
  npm run generate:word generate meeting-minutes
  npm run generate:word test

Available Templates:
  - white-paper           Technical white paper
  - change-management     Change management plan
  - project-charter       Project charter document
  - sop                   Standard Operating Procedure
  - meeting-minutes       Meeting minutes
  - executive-summary     Executive summary
`);
}

/**
 * List available templates
 */
function listAvailableTemplates() {
  console.log('\n📋 Available Word Templates:\n');
  
  const templates = listWordTemplates();
  templates.forEach((template, index) => {
    console.log(`${index + 1}. ${template.name}`);
    console.log(`   ID: ${template.id}`);
    console.log(`   ${template.description}\n`);
  });

  console.log('Usage: npm run generate:word generate <template-id>');
}

/**
 * Generate a Word document
 */
async function generateDocument(templateType: WordTemplateType) {
  console.log(`\n📄 Generating Word document: ${templateType}...\n`);

  try {
    // Get sample data based on template type
    const data = getSampleData(templateType);

    // Get template
    const template = getWordTemplate(templateType, data);

    // Create agent and generate
    const agent = createWordAgent();
    const result = await agent.generate(template);

    if (result.success) {
      console.log('✅ Document generated successfully!\n');
      console.log(`📁 File: ${result.fileName}`);
      console.log(`📍 Path: ${result.filePath}`);
      console.log(`📊 Sections: ${result.sections}`);
      console.log(`📝 Word Count: ${result.wordCount}`);
      console.log(`💾 File Size: ${(result.fileSize / 1024).toFixed(2)} KB`);
      console.log(`⏱️  Generation Time: ${result.generationTime}ms\n`);
    } else {
      console.error('❌ Generation failed:', result.error);
      process.exit(1);
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

/**
 * Test all templates
 */
async function testAllTemplates() {
  console.log('\n🧪 Testing all Word templates...\n');

  const templates = listWordTemplates();
  const results: any[] = [];

  for (const template of templates) {
    console.log(`Testing: ${template.name}...`);
    
    try {
      const data = getSampleData(template.id);
      const templateOptions = getWordTemplate(template.id, data);
      const agent = createWordAgent();
      const result = await agent.generate(templateOptions);

      results.push({
        template: template.name,
        success: result.success,
        fileName: result.fileName,
        wordCount: result.wordCount,
        time: result.generationTime
      });

      console.log(`  ✅ Success - ${result.wordCount} words in ${result.generationTime}ms\n`);
    } catch (error: any) {
      results.push({
        template: template.name,
        success: false,
        error: error.message
      });
      console.log(`  ❌ Failed: ${error.message}\n`);
    }
  }

  // Summary
  console.log('\n📊 Test Summary:\n');
  const successful = results.filter(r => r.success).length;
  console.log(`Total Templates: ${results.length}`);
  console.log(`Successful: ${successful}`);
  console.log(`Failed: ${results.length - successful}\n`);

  if (successful === results.length) {
    console.log('🎉 All templates generated successfully!\n');
  }
}

/**
 * Get sample data for template
 */
function getSampleData(templateType: WordTemplateType): Record<string, any> {
  const sampleData: Record<string, any> = {
    'white-paper': {
      title: 'AI-Powered Operations Management',
      author: 'PHX6 Operations Team',
      topic: 'artificial intelligence in warehouse operations'
    },
    'change-management': {
      title: 'New WMS Implementation',
      author: 'Change Management Team',
      changeName: 'Warehouse Management System Upgrade'
    },
    'project-charter': {
      projectName: 'FENIX Project Manager',
      author: 'Project Leadership'
    },
    'sop': {
      title: 'Package Sorting Procedure',
      author: 'Operations Standards Team'
    },
    'meeting-minutes': {
      title: 'Weekly Operations Review',
      author: 'Operations Manager',
      date: new Date().toLocaleDateString()
    },
    'executive-summary': {
      title: 'Q1 2026 Operations Review',
      author: 'Executive Team',
      topic: 'quarterly operations performance and strategic initiatives'
    }
  };

  return sampleData[templateType] || {};
}

// Run CLI
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
