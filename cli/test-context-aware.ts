// FENIX Project Manager - Context-Aware Services Test
// Test suite for context-aware generation capabilities
// Created: January 6, 2026

import { UserPreferenceService } from '../services/UserPreferenceService';
import { ProjectContextService } from '../services/ProjectContextService';
import { AudienceAdaptationService } from '../services/AudienceAdaptationService';
import { StyleConsistencyService } from '../services/StyleConsistencyService';
import { ContentReuseService } from '../services/ContentReuseService';
import { SmartDefaultsService } from '../services/SmartDefaultsService';
import type { UserAction } from '../services/UserPreferenceService';
import type { Project } from '../services/ProjectContextService';
import type { ContentBlock } from '../services/ContentReuseService';

/**
 * Test Context-Aware Services
 */
async function testContextAwareServices() {
  console.log('='.repeat(80));
  console.log('FENIX Project Manager - Context-Aware Services Test');
  console.log('='.repeat(80));
  console.log();

  // Test 1: User Preference Service
  console.log('Test 1: User Preference Service');
  console.log('-'.repeat(80));

  const userPrefService = new UserPreferenceService();
  const userId = 'user-123';

  // Learn from actions
  console.log('\nLearning from user actions...');
  const actions: UserAction[] = [
    {
      userId,
      actionType: 'template_selected',
      timestamp: new Date(),
      metadata: { template: 'project-status', format: 'powerpoint' }
    },
    {
      userId,
      actionType: 'document_created',
      timestamp: new Date(),
      metadata: { template: 'project-status' }
    },
    {
      userId,
      actionType: 'document_created',
      timestamp: new Date(),
      metadata: { template: 'kpi-dashboard' }
    }
  ];

  for (const action of actions) {
    await userPrefService.learnFromAction(userId, action);
  }
  console.log(`  Learned from ${actions.length} actions`);

  // Get preferences
  const prefs = await userPrefService.getPreferences(userId);
  console.log(`\nUser Preferences:`);
  console.log(`  Favorite PowerPoint templates: ${prefs.favoriteTemplates.powerpoint.join(', ')}`);
  console.log(`  Color scheme: ${prefs.stylePreferences.colorScheme}`);
  console.log(`  Detail level: ${prefs.contentPreferences.detailLevel}`);
  console.log(`  Tone: ${prefs.contentPreferences.tone}`);

  // Get smart defaults
  const smartDefaults = await userPrefService.getSmartDefaults(userId);
  console.log(`\nSmart Defaults:`);
  console.log(`  Template: ${smartDefaults.template}`);
  console.log(`  Confidence: ${(smartDefaults.confidence * 100).toFixed(0)}%`);
  console.log(`  Rationale: ${smartDefaults.rationale}`);

  console.log();

  // Test 2: Project Context Service
  console.log('Test 2: Project Context Service');
  console.log('-'.repeat(80));

  const projectService = new ProjectContextService();

  // Create project
  const project: Project = {
    id: 'proj-001',
    name: 'FENIX Project Manager',
    description: 'AI-powered document generation platform',
    status: 'active',
    createdAt: new Date(),
    updatedAt: new Date()
  };

  console.log(`\nCreating project: ${project.name}`);
  const context = await projectService.createContext(project);
  console.log(`  Project ID: ${context.projectId}`);
  console.log(`  Status: ${project.status}`);

  // Add team members
  await projectService.addTeamMember(project.id, {
    id: 'member-1',
    name: 'Alice Johnson',
    role: 'Project Manager',
    email: 'alice@example.com'
  });
  await projectService.addTeamMember(project.id, {
    id: 'member-2',
    name: 'Bob Smith',
    role: 'Developer',
    email: 'bob@example.com'
  });
  console.log(`\nAdded 2 team members`);

  // Add milestones
  await projectService.addMilestone(project.id, {
    id: 'milestone-1',
    name: 'Phase 1 Complete',
    date: new Date('2026-01-15'),
    completed: true
  });
  await projectService.addMilestone(project.id, {
    id: 'milestone-2',
    name: 'Phase 2 Complete',
    date: new Date('2026-02-01'),
    completed: false
  });
  console.log(`Added 2 milestones`);

  // Add metrics
  await projectService.addMetric(project.id, {
    id: 'metric-1',
    name: 'Tasks Completed',
    value: 45,
    unit: 'tasks',
    target: 60,
    timestamp: new Date()
  });
  console.log(`Added 1 metric`);

  // Get project stats
  const stats = await projectService.getProjectStats(project.id);
  console.log(`\nProject Statistics:`);
  console.log(`  Team size: ${stats.teamSize}`);
  console.log(`  Milestones: ${stats.completedMilestones}/${stats.milestoneCount} completed`);
  console.log(`  Metrics tracked: ${stats.metricCount}`);

  console.log();

  // Test 3: Audience Adaptation Service
  console.log('Test 3: Audience Adaptation Service');
  console.log('-'.repeat(80));

  const audienceService = new AudienceAdaptationService();

  const testContent = 'We need to implement the new API architecture with microservices and containerization using Docker and Kubernetes.';

  console.log(`\nOriginal content: "${testContent}"`);

  // Adapt for different audiences
  const audiences = ['executive', 'technical', 'general'];
  for (const audience of audiences) {
    await audienceService.adaptContent(testContent, audience as any);
    const profile = audienceService.getAudienceProfile(audience as any);
    console.log(`\n${audience.charAt(0).toUpperCase() + audience.slice(1)} Audience:`);
    console.log(`  Detail level: ${profile.detailLevel}`);
    console.log(`  Tone: ${profile.tone}`);
    console.log(`  Technical level: ${profile.technicalLevel}`);
  }

  // Recommend audience
  const recommendation = await audienceService.recommendAudience(testContent);
  console.log(`\nRecommended audience: ${recommendation.audience}`);
  console.log(`Confidence: ${(recommendation.confidence * 100).toFixed(0)}%`);
  console.log(`Rationale: ${recommendation.rationale}`);

  console.log();

  // Test 4: Style Consistency Service
  console.log('Test 4: Style Consistency Service');
  console.log('-'.repeat(80));

  const styleService = new StyleConsistencyService();

  // Get style guides
  const guides = styleService.getAllStyleGuides();
  console.log(`\nAvailable Style Guides: ${guides.length}`);
  guides.forEach(guide => {
    console.log(`  - ${guide.name} (${guide.id})`);
    console.log(`    Primary color: ${guide.colors.primary}`);
    console.log(`    Heading font: ${guide.typography.headingFont}`);
  });

  // Check style
  const testDoc = {
    colors: { primary: '#0066CC', text: '#212529' },
    typography: { headingFont: 'Arial' }
  };

  console.log(`\nChecking document style...`);
  const styleCheck = await styleService.checkStyle(testDoc);
  console.log(`  Passed: ${styleCheck.passed}`);
  console.log(`  Score: ${styleCheck.score}/100`);
  console.log(`  Summary: ${styleCheck.summary}`);

  // Validate color contrast
  const contrast = await styleService.validateColorContrast('#000000', '#FFFFFF');
  console.log(`\nColor Contrast Check:`);
  console.log(`  Ratio: ${contrast.ratio}:1`);
  console.log(`  Level: ${contrast.level}`);
  console.log(`  Passes: ${contrast.passes}`);

  console.log();

  // Test 5: Content Reuse Service
  console.log('Test 5: Content Reuse Service');
  console.log('-'.repeat(80));

  const contentService = new ContentReuseService();

  // Add content blocks
  const blocks: ContentBlock[] = [
    {
      id: 'block-1',
      content: 'Project status update for Q4 2025 showing 85% completion rate',
      type: 'text',
      source: {
        id: 'doc-1',
        name: 'Q4 Status Report',
        type: 'powerpoint',
        path: '/docs/q4-status.pptx',
        createdAt: new Date()
      },
      usageCount: 3,
      tags: ['status', 'q4', 'completion'],
      createdAt: new Date(),
      lastUsed: new Date()
    },
    {
      id: 'block-2',
      content: 'Key performance indicators showing 15% improvement in efficiency',
      type: 'text',
      source: {
        id: 'doc-2',
        name: 'KPI Dashboard',
        type: 'excel',
        path: '/docs/kpi-dashboard.xlsx',
        createdAt: new Date()
      },
      usageCount: 5,
      tags: ['kpi', 'performance', 'efficiency'],
      createdAt: new Date(),
      lastUsed: new Date()
    }
  ];

  console.log(`\nAdding ${blocks.length} content blocks...`);
  for (const block of blocks) {
    await contentService.addContentBlock(block);
  }

  // Get suggestions
  const query = 'project status and performance metrics';
  console.log(`\nGetting suggestions for: "${query}"`);
  const suggestions = await contentService.getSuggestions(query, 3);
  console.log(`  Found ${suggestions.length} suggestions:`);
  suggestions.forEach((suggestion, index) => {
    console.log(`\n  ${index + 1}. ${suggestion.block.content.substring(0, 60)}...`);
    console.log(`     Relevance: ${(suggestion.relevance * 100).toFixed(0)}%`);
    console.log(`     ${suggestion.rationale}`);
    console.log(`     ${suggestion.context}`);
  });

  // Get reuse statistics
  const reuseStats = await contentService.getReuseStatistics();
  console.log(`\nReuse Statistics:`);
  console.log(`  Total blocks: ${reuseStats.totalBlocks}`);
  console.log(`  Reused blocks: ${reuseStats.reusedBlocks}`);
  console.log(`  Reuse rate: ${(reuseStats.reuseRate * 100).toFixed(0)}%`);

  console.log();

  // Test 6: Smart Defaults Service
  console.log('Test 6: Smart Defaults Service');
  console.log('-'.repeat(80));

  const defaultsService = new SmartDefaultsService();

  // Get defaults for different scenarios
  const scenarios = [
    { documentType: 'status-update', audience: 'executive' },
    { documentType: 'technical-doc', audience: 'technical' },
    { purpose: 'data analysis', audience: 'business' }
  ];

  for (const scenario of scenarios) {
    console.log(`\nScenario: ${JSON.stringify(scenario)}`);
    const defaults = await defaultsService.getDefaults({
      ...scenario,
      userPreferences: prefs,
      projectContext: context
    });

    console.log(`  Template: ${defaults.template}`);
    console.log(`  Format: ${defaults.format}`);
    console.log(`  Color scheme: ${defaults.style.colorScheme}`);
    console.log(`  Detail level: ${defaults.content.detailLevel}`);
    console.log(`  Tone: ${defaults.content.tone}`);
    console.log(`  Confidence: ${(defaults.metadata.confidence * 100).toFixed(0)}%`);
    console.log(`  Rationale: ${defaults.metadata.rationale}`);
  }

  // Get template recommendations
  console.log(`\nTemplate Recommendations for PowerPoint:`);
  const templates = await defaultsService.getTemplateRecommendations('powerpoint', {
    userPreferences: prefs
  });
  templates.forEach((template, index) => {
    console.log(`  ${index + 1}. ${template}`);
  });

  console.log();

  // Test 7: Integration Test
  console.log('Test 7: Integration Test');
  console.log('-'.repeat(80));

  console.log(`\nIntegrating all services for complete workflow...`);

  // Get smart defaults with full context
  const fullDefaults = await defaultsService.getDefaults({
    userPreferences: prefs,
    projectContext: context,
    documentType: 'status-update',
    audience: 'executive',
    purpose: 'quarterly review'
  });

  console.log(`\nFull Context Smart Defaults:`);
  console.log(`  Template: ${fullDefaults.template}`);
  console.log(`  Format: ${fullDefaults.format}`);
  console.log(`  Style: ${fullDefaults.style.colorScheme} / ${fullDefaults.style.fontFamily}`);
  console.log(`  Content: ${fullDefaults.content.detailLevel} detail, ${fullDefaults.content.tone} tone`);
  console.log(`  Confidence: ${(fullDefaults.metadata.confidence * 100).toFixed(0)}%`);
  console.log(`  Sources: ${fullDefaults.metadata.sources.join(', ')}`);
  console.log(`\n  ${fullDefaults.metadata.rationale}`);

  // Get content suggestions
  const contentSuggestions = await contentService.getSuggestions('status update', 2);
  if (contentSuggestions.length > 0) {
    console.log(`\nReusable Content Suggestions:`);
    contentSuggestions.forEach((suggestion, index) => {
      console.log(`  ${index + 1}. ${suggestion.block.content.substring(0, 50)}...`);
      console.log(`     Relevance: ${(suggestion.relevance * 100).toFixed(0)}%`);
    });
  }

  // Adapt for audience
  const sampleContent = 'The project has achieved 85% completion with key milestones met.';
  const adaptedContent = await audienceService.adaptContent(sampleContent, 'executive');
  console.log(`\nAudience-Adapted Content:`);
  console.log(`  Original: "${sampleContent}"`);
  console.log(`  Adapted: "${adaptedContent}"`);

  console.log();
  console.log('='.repeat(80));
  console.log('All Tests Completed Successfully!');
  console.log('='.repeat(80));
}

// Run tests
testContextAwareServices().catch(error => {
  console.error('Test failed:', error);
  process.exit(1);
});
