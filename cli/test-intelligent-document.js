"use strict";
// FENIX Project Manager - Intelligent Document Service Test
// Test suite for intelligent document generation capabilities
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
const IntelligentDocumentService_1 = require("../services/IntelligentDocumentService");
/**
 * Test Intelligent Document Service
 */
async function testIntelligentDocumentService() {
    console.log('='.repeat(80));
    console.log('FENIX Project Manager - Intelligent Document Service Test');
    console.log('='.repeat(80));
    console.log();
    const service = new IntelligentDocumentService_1.IntelligentDocumentService();
    // Test 1: Content Analysis
    console.log('Test 1: Content Analysis');
    console.log('-'.repeat(80));
    const testContents = [
        {
            name: 'Project Status Update',
            content: 'Create a project status update presentation with current progress, milestones achieved, and upcoming deliverables. Include KPI metrics and team performance data.'
        },
        {
            name: 'Financial Report',
            content: 'Generate a quarterly financial report with revenue analysis, cost breakdown, profit margins, and budget variance. Include detailed data tables and trend charts.'
        },
        {
            name: 'Technical Documentation',
            content: 'Write comprehensive technical documentation for the new API architecture, including design specifications, implementation details, and integration guidelines.'
        },
        {
            name: 'Change Management Plan',
            content: 'Develop a change management plan for the organizational transformation initiative. Include stakeholder analysis, communication strategy, and impact assessment.'
        }
    ];
    for (const test of testContents) {
        console.log(`\nAnalyzing: ${test.name}`);
        const analysis = await service.analyzeContent(test.content);
        console.log(`  Type: ${analysis.type}`);
        console.log(`  Complexity: ${analysis.complexity}`);
        console.log(`  Data Intensive: ${analysis.dataIntensive}`);
        console.log(`  Visual Heavy: ${analysis.visualHeavy}`);
        console.log(`  Narrative Focused: ${analysis.narrativeFocused}`);
        console.log(`  Keywords: ${analysis.keywords.join(', ')}`);
        console.log(`  Suggested Formats: ${analysis.suggestedFormats.join(', ')}`);
    }
    console.log();
    // Test 2: Format Recommendation
    console.log('Test 2: Format Recommendation');
    console.log('-'.repeat(80));
    for (const test of testContents) {
        console.log(`\nRecommending format for: ${test.name}`);
        const recommendation = await service.recommendFormat(test.content);
        console.log(`  Primary Format: ${recommendation.primaryFormat}`);
        console.log(`  Template: ${recommendation.template}`);
        console.log(`  Confidence: ${(recommendation.confidence * 100).toFixed(1)}%`);
        console.log(`  Rationale: ${recommendation.rationale}`);
        if (recommendation.supportingDocs && recommendation.supportingDocs.length > 0) {
            console.log(`  Supporting Documents:`);
            recommendation.supportingDocs.forEach(doc => {
                console.log(`    - ${doc.format} (${doc.template}): ${doc.rationale}`);
            });
        }
    }
    console.log();
    // Test 3: Workflow Creation
    console.log('Test 3: Workflow Creation');
    console.log('-'.repeat(80));
    const workflowRequest = {
        name: 'Project Status Package',
        description: 'Complete project status update package',
        inputs: {
            projectData: {
                name: 'FENIX Project Manager',
                status: 'On Track',
                progress: 75,
                milestones: [
                    { name: 'Phase 1', completed: true },
                    { name: 'Phase 2', completed: true },
                    { name: 'Phase 3', completed: false }
                ]
            },
            metrics: {
                tasksCompleted: 45,
                tasksRemaining: 15,
                teamSize: 8,
                velocity: 12
            }
        }
    };
    console.log(`\nCreating workflow: ${workflowRequest.name}`);
    const workflow = await service.createWorkflow(workflowRequest);
    console.log(`  Workflow ID: ${workflow.id}`);
    console.log(`  Name: ${workflow.name}`);
    console.log(`  Description: ${workflow.description}`);
    console.log(`  Status: ${workflow.status}`);
    console.log(`  Steps: ${workflow.steps.length}`);
    workflow.steps.forEach((step, index) => {
        console.log(`    ${index + 1}. ${step.name} (${step.agent})`);
        console.log(`       Task: ${step.task}`);
        console.log(`       Dependencies: ${step.dependencies.length > 0 ? step.dependencies.join(', ') : 'None'}`);
    });
    console.log(`  Dependencies: ${workflow.dependencies.length}`);
    workflow.dependencies.forEach((dep, index) => {
        console.log(`    ${index + 1}. ${dep.fromStep} → ${dep.toStep}`);
    });
    console.log();
    // Test 4: Workflow Templates
    console.log('Test 4: Workflow Templates');
    console.log('-'.repeat(80));
    const templates = service.getAllWorkflowTemplates();
    console.log(`\nAvailable Workflow Templates: ${templates.length}`);
    templates.forEach((template, index) => {
        console.log(`\n${index + 1}. ${template.name}`);
        console.log(`   ID: ${template.id}`);
        console.log(`   Category: ${template.category}`);
        console.log(`   Description: ${template.description}`);
        console.log(`   Steps: ${template.steps.length}`);
        console.log(`   Required Inputs: ${template.requiredInputs.join(', ')}`);
        console.log(`   Expected Outputs: ${template.expectedOutputs.join(', ')}`);
        console.log(`   Estimated Duration: ${(template.estimatedDuration / 1000).toFixed(1)}s`);
    });
    console.log();
    // Test 5: Template-Based Workflow Creation
    console.log('Test 5: Template-Based Workflow Creation');
    console.log('-'.repeat(80));
    const templateRequest = {
        name: 'Q4 Business Review',
        template: 'quarterly-review-package',
        inputs: {
            quarterData: { quarter: 'Q4', year: 2026 },
            financialData: { revenue: 1000000, costs: 750000 },
            metrics: { growth: 15, satisfaction: 92 }
        }
    };
    console.log(`\nCreating workflow from template: ${templateRequest.template}`);
    const templateWorkflow = await service.createWorkflow(templateRequest);
    console.log(`  Workflow ID: ${templateWorkflow.id}`);
    console.log(`  Name: ${templateWorkflow.name}`);
    console.log(`  Description: ${templateWorkflow.description}`);
    console.log(`  Steps: ${templateWorkflow.steps.length}`);
    templateWorkflow.steps.forEach((step, index) => {
        console.log(`    ${index + 1}. ${step.name} (${step.agent})`);
    });
    console.log();
    // Test 6: Document Relationships
    console.log('Test 6: Document Relationships');
    console.log('-'.repeat(80));
    console.log('\nTracking document relationships...');
    await service.trackRelationship('doc-1', 'doc-2', 'supports', ['project data', 'metrics']);
    await service.trackRelationship('doc-1', 'doc-3', 'summarizes', ['key points', 'highlights']);
    await service.trackRelationship('doc-2', 'doc-4', 'extends', ['detailed analysis']);
    console.log('  Tracked 3 relationships');
    const relatedDocs = await service.getRelatedDocuments('doc-1');
    console.log(`\nRelated documents for doc-1: ${relatedDocs.length}`);
    relatedDocs.forEach((doc, index) => {
        console.log(`  ${index + 1}. ${doc.name} (${doc.type})`);
    });
    console.log();
    // Test 7: Category-Based Template Search
    console.log('Test 7: Category-Based Template Search');
    console.log('-'.repeat(80));
    const categories = ['project-management', 'change-management', 'business-review'];
    categories.forEach(category => {
        const categoryTemplates = service.getWorkflowTemplatesByCategory(category);
        console.log(`\n${category}: ${categoryTemplates.length} template(s)`);
        categoryTemplates.forEach(template => {
            console.log(`  - ${template.name}`);
        });
    });
    console.log();
    console.log('='.repeat(80));
    console.log('All Tests Completed Successfully!');
    console.log('='.repeat(80));
}
// Run tests
testIntelligentDocumentService().catch(error => {
    console.error('Test failed:', error);
    process.exit(1);
});
//# sourceMappingURL=test-intelligent-document.js.map