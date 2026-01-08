#!/usr/bin/env ts-node
// FENIX Project Manager - Advanced AI Services Test
// Test all advanced AI features
// Created: January 6, 2026

import { DocumentSummarizationService } from '../services/DocumentSummarizationService';
import { KeyPointExtractionService } from '../services/KeyPointExtractionService';
import { SentimentAnalysisService } from '../services/SentimentAnalysisService';
import { ReadabilityService } from '../services/ReadabilityService';
import { ComplianceCheckingService } from '../services/ComplianceCheckingService';
import { CitationManagementService } from '../services/CitationManagementService';

// Test content
const sampleContent = `
Project Status Update: Q4 2025

Executive Summary:
Our team has achieved significant milestones this quarter. We successfully launched three major features 
that have improved customer satisfaction by 25%. The implementation was completed ahead of schedule, 
demonstrating our team's excellent execution capabilities.

Key Achievements:
1. Feature A deployment - Completed on November 15th with zero downtime
2. Customer feedback integration - 95% positive response rate
3. Performance optimization - Reduced load times by 40%

Challenges and Risks:
We encountered some technical difficulties during the migration phase. The database performance issues 
required immediate attention and additional resources. However, our team quickly identified the root cause 
and implemented effective solutions.

Next Steps:
We need to focus on scaling our infrastructure to handle increased traffic. The team should prioritize 
security enhancements and conduct thorough testing before the next release. It is critical that we 
maintain our high quality standards while accelerating delivery.

Financial Impact:
The project has generated $2.5M in additional revenue and reduced operational costs by 15%. 
We expect continued growth in Q1 2026 with projected revenue of $4M.

Team Recognition:
Special thanks to the engineering team for their dedication and hard work. Their commitment to excellence 
has been instrumental in our success.
`;

async function testDocumentSummarization() {
  console.log('\n=== Testing Document Summarization Service ===\n');
  
  const service = new DocumentSummarizationService();

  // Test basic summarization
  console.log('1. Basic Summary:');
  const summary = await service.summarize(sampleContent, { length: 'short' });
  console.log(summary);

  // Test key takeaways
  console.log('\n2. Key Takeaways:');
  const takeaways = await service.extractTakeaways(sampleContent, 3);
  takeaways.forEach((takeaway, i) => {
    console.log(`   ${i + 1}. ${takeaway}`);
  });

  // Test executive summary
  console.log('\n3. Executive Summary:');
  const execSummary = await service.createExecutiveSummary(sampleContent);
  console.log(execSummary);

  // Test bullet points
  console.log('\n4. Bullet Point Summary:');
  const bullets = await service.summarize(sampleContent, { 
    style: 'bullets',
    length: 'medium'
  });
  console.log(bullets);

  console.log('\n✓ Document Summarization tests completed');
}

async function testKeyPointExtraction() {
  console.log('\n=== Testing Key Point Extraction Service ===\n');
  
  const service = new KeyPointExtractionService();

  // Test key point extraction
  console.log('1. Key Points:');
  const points = await service.extractKeyPoints(sampleContent, { maxPoints: 5 });
  points.forEach((point, i) => {
    console.log(`   ${i + 1}. [${point.category}] ${point.text.substring(0, 60)}...`);
    console.log(`      Importance: ${(point.importance * 100).toFixed(0)}%`);
  });

  // Test action items
  console.log('\n2. Action Items:');
  const actions = await service.extractActionItems(sampleContent);
  actions.forEach((action, i) => {
    console.log(`   ${i + 1}. [${action.priority}] ${action.text}`);
  });

  // Test main ideas
  console.log('\n3. Main Ideas:');
  const mainIdeas = await service.extractMainIdeas(sampleContent, 3);
  mainIdeas.forEach((idea, i) => {
    console.log(`   ${i + 1}. ${idea.text.substring(0, 80)}...`);
  });

  // Test grouping by theme
  console.log('\n4. Grouped by Theme:');
  const groups = await service.groupByTheme(points);
  groups.forEach(group => {
    console.log(`   Theme: ${group.theme} (${group.points.length} points)`);
  });

  console.log('\n✓ Key Point Extraction tests completed');
}

async function testSentimentAnalysis() {
  console.log('\n=== Testing Sentiment Analysis Service ===\n');
  
  const service = new SentimentAnalysisService();

  // Test sentiment analysis
  console.log('1. Sentiment Analysis:');
  const sentiment = await service.analyzeSentiment(sampleContent);
  console.log(`   Overall: ${sentiment.overall}`);
  console.log(`   Score: ${sentiment.score.toFixed(2)} (${(sentiment.confidence * 100).toFixed(0)}% confidence)`);
  console.log(`   Breakdown:`);
  console.log(`     Positive: ${(sentiment.breakdown.positive * 100).toFixed(1)}%`);
  console.log(`     Neutral: ${(sentiment.breakdown.neutral * 100).toFixed(1)}%`);
  console.log(`     Negative: ${(sentiment.breakdown.negative * 100).toFixed(1)}%`);

  // Test tone analysis
  console.log('\n2. Tone Analysis:');
  const tone = await service.analyzeTone(sampleContent);
  console.log(`   Primary: ${tone.primary}`);
  if (tone.secondary) console.log(`   Secondary: ${tone.secondary}`);
  console.log(`   Confidence: ${(tone.confidence * 100).toFixed(0)}%`);
  console.log(`   Characteristics:`);
  tone.characteristics.forEach(char => {
    console.log(`     - ${char}`);
  });

  // Test emotional language
  console.log('\n3. Emotional Language:');
  const emotional = await service.identifyEmotionalLanguage(sampleContent);
  console.log(`   Has emotional content: ${emotional.hasEmotionalContent}`);
  console.log(`   Intensity: ${(emotional.intensity * 100).toFixed(0)}%`);
  if (emotional.emotionalWords.length > 0) {
    console.log(`   Emotional words: ${emotional.emotionalWords.slice(0, 5).join(', ')}`);
  }

  // Test complete analysis
  console.log('\n4. Complete Analysis:');
  const analysis = await service.analyze(sampleContent, 'executive');
  console.log(`   Appropriate for audience: ${analysis.appropriateForAudience}`);
  if (analysis.suggestions.length > 0) {
    console.log(`   Suggestions:`);
    analysis.suggestions.forEach(suggestion => {
      console.log(`     - ${suggestion}`);
    });
  }

  console.log('\n✓ Sentiment Analysis tests completed');
}

async function testReadability() {
  console.log('\n=== Testing Readability Service ===\n');
  
  const service = new ReadabilityService();

  // Test readability score
  console.log('1. Readability Score:');
  const score = await service.calculateScore(sampleContent);
  console.log(`   Grade Level: ${score.gradeLevel}`);
  console.log(`   Difficulty: ${score.difficulty}`);
  console.log(`   Flesch-Kincaid: ${score.fleschKincaid.toFixed(1)}`);
  console.log(`   Reading Ease: ${score.fleschReadingEase.toFixed(1)}/100`);
  console.log(`   Avg Sentence Length: ${score.averageSentenceLength.toFixed(1)} words`);
  console.log(`   Avg Word Length: ${score.averageWordLength.toFixed(1)} characters`);
  console.log(`   Complex Words: ${score.complexWordPercentage.toFixed(1)}%`);

  // Test improvements
  console.log('\n2. Suggested Improvements:');
  const improvements = await service.suggestImprovements(sampleContent);
  improvements.slice(0, 5).forEach((improvement, i) => {
    console.log(`   ${i + 1}. [${improvement.severity}] ${improvement.type}`);
    console.log(`      Issue: ${improvement.issue}`);
    console.log(`      Suggestion: ${improvement.suggestion}`);
  });

  // Test complete analysis
  console.log('\n3. Complete Analysis:');
  const analysis = await service.analyze(sampleContent);
  console.log(`   Summary: ${analysis.summary}`);
  console.log(`   Complex Sentences: ${analysis.complexSentences.length}`);
  console.log(`   Complex Words: ${analysis.complexWords.length}`);

  console.log('\n✓ Readability tests completed');
}

async function testComplianceChecking() {
  console.log('\n=== Testing Compliance Checking Service ===\n');
  
  const service = new ComplianceCheckingService();

  // Test compliance check
  console.log('1. Amazon Style Guide Compliance:');
  const report = await service.checkCompliance(sampleContent, 'amazon');
  console.log(`   Passed: ${report.passed}`);
  console.log(`   Score: ${report.score.toFixed(1)}%`);
  console.log(`   Rules: ${report.passedRules}/${report.totalRules} passed`);
  console.log(`   Summary: ${report.summary}`);

  if (report.issues.length > 0) {
    console.log(`\n   Issues:`);
    report.issues.forEach((issue, i) => {
      console.log(`   ${i + 1}. [${issue.severity}] ${issue.ruleName}`);
      console.log(`      ${issue.message}`);
      if (issue.suggestion) {
        console.log(`      Suggestion: ${issue.suggestion}`);
      }
    });
  }

  // Test required sections
  console.log('\n2. Required Sections Check:');
  const sectionIssues = await service.validateRequiredSections(sampleContent, [
    'Executive Summary',
    'Key Achievements',
    'Next Steps'
  ]);
  if (sectionIssues.length === 0) {
    console.log('   ✓ All required sections present');
  } else {
    sectionIssues.forEach(issue => {
      console.log(`   - ${issue.message}`);
    });
  }

  // Test accessibility
  console.log('\n3. Accessibility Check:');
  const accessibilityIssues = await service.checkAccessibility(sampleContent, {
    hasImages: true,
    hasHeadings: true
  });
  if (accessibilityIssues.length === 0) {
    console.log('   ✓ No accessibility issues found');
  } else {
    accessibilityIssues.forEach(issue => {
      console.log(`   - [${issue.severity}] ${issue.message}`);
    });
  }

  // Test available style guides
  console.log('\n4. Available Style Guides:');
  const guides = service.getStyleGuides();
  guides.forEach(guide => {
    console.log(`   - ${guide.name} (${guide.rules.length} rules)`);
  });

  console.log('\n✓ Compliance Checking tests completed');
}

async function testCitationManagement() {
  console.log('\n=== Testing Citation Management Service ===\n');
  
  const service = new CitationManagementService();

  // Add sources
  console.log('1. Adding Sources:');
  const source1 = await service.addSource({
    type: 'book',
    title: 'The Lean Startup',
    authors: ['Eric Ries'],
    year: 2011,
    publisher: 'Crown Business'
  });
  console.log(`   ✓ Added book: ${source1}`);

  const source2 = await service.addSource({
    type: 'article',
    title: 'Agile Software Development',
    authors: ['Kent Beck', 'Martin Fowler'],
    year: 2001,
    volume: '15',
    pages: '45-52'
  });
  console.log(`   ✓ Added article: ${source2}`);

  const source3 = await service.addSource({
    type: 'website',
    title: 'Amazon Leadership Principles',
    authors: ['Amazon'],
    url: 'https://www.amazon.jobs/principles',
    accessDate: new Date()
  });
  console.log(`   ✓ Added website: ${source3}`);

  // Add references
  console.log('\n2. Adding References:');
  await service.addReference(source1, 'Introduction, paragraph 2');
  await service.addReference(source1, 'Chapter 3, page 45');
  await service.addReference(source2, 'Methodology section');
  console.log('   ✓ Added 3 references');

  // Generate bibliography
  console.log('\n3. Bibliography (APA Style):');
  const bibliography = await service.generateBibliography('APA');
  bibliography.forEach((entry, i) => {
    console.log(`   ${i + 1}. ${entry.formatted}`);
  });

  // Validate citations
  console.log('\n4. Citation Validation:');
  const validation1 = await service.validateCitation(source1);
  console.log(`   Source 1: ${validation1.valid ? '✓ Valid' : '✗ Invalid'}`);
  if (validation1.missingFields.length > 0) {
    console.log(`     Missing: ${validation1.missingFields.join(', ')}`);
  }

  // Get statistics
  console.log('\n5. Citation Statistics:');
  const stats = await service.getStatistics();
  console.log(`   Total Sources: ${stats.totalSources}`);
  console.log(`   Total References: ${stats.totalReferences}`);
  console.log(`   Sources by Type:`);
  Object.entries(stats.sourcesByType).forEach(([type, count]) => {
    if (count > 0) {
      console.log(`     ${type}: ${count}`);
    }
  });

  if (stats.mostCitedSources.length > 0) {
    console.log(`   Most Cited:`);
    stats.mostCitedSources.forEach(source => {
      console.log(`     - ${source.title} (${source.count} citations)`);
    });
  }

  console.log('\n✓ Citation Management tests completed');
}

async function runAllTests() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║   FENIX Advanced AI Services - Comprehensive Test Suite   ║');
  console.log('╚════════════════════════════════════════════════════════════╝');

  try {
    await testDocumentSummarization();
    await testKeyPointExtraction();
    await testSentimentAnalysis();
    await testReadability();
    await testComplianceChecking();
    await testCitationManagement();

    console.log('\n╔════════════════════════════════════════════════════════════╗');
    console.log('║                  ALL TESTS COMPLETED ✓                     ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log('\nTask 5.4: Advanced AI Features - Implementation Complete!');
    console.log('\nServices Implemented:');
    console.log('  ✓ DocumentSummarizationService');
    console.log('  ✓ KeyPointExtractionService');
    console.log('  ✓ SentimentAnalysisService');
    console.log('  ✓ ReadabilityService');
    console.log('  ✓ ComplianceCheckingService');
    console.log('  ✓ CitationManagementService');

  } catch (error) {
    console.error('\n✗ Test failed:', error);
    process.exit(1);
  }
}

// Run tests
runAllTests();
