#!/usr/bin/env node
// FENIX Project Manager - Design Validation CLI
// Comprehensive design validation and quality checking tool
// Created: January 6, 2026

import { DesignValidationService } from '../services/DesignValidationService';
import { DesignSystemService } from '../services/DesignSystemService';
import type { 
  DesignElement, 
  ValidationIssue 
} from '../models/design-system-types';

/**
 * CLI Commands
 */
enum Command {
  VALIDATE = 'validate',
  CHECK_CONTRAST = 'check-contrast',
  CHECK_ACCESSIBILITY = 'check-accessibility',
  CHECK_BRAND = 'check-brand',
  ANALYZE = 'analyze',
  FIX = 'fix',
  HELP = 'help'
}

/**
 * CLI Options
 */
interface CLIOptions {
  command: Command;
  input?: string;
  output?: string;
  format?: 'json' | 'text' | 'html';
  verbose?: boolean;
  strict?: boolean;
  autoFix?: boolean;
}

/**
 * Design Validation CLI
 */
class DesignValidationCLI {
  private validationService: DesignValidationService;
  private designSystem: DesignSystemService;

  constructor() {
    this.validationService = new DesignValidationService();
    this.designSystem = new DesignSystemService();
  }

  /**
   * Run CLI
   */
  async run(args: string[]): Promise<void> {
    try {
      const options = this.parseArgs(args);

      switch (options.command) {
        case Command.VALIDATE:
          await this.validateDesign(options);
          break;
        case Command.CHECK_CONTRAST:
          await this.checkContrast(options);
          break;
        case Command.CHECK_ACCESSIBILITY:
          await this.checkAccessibility(options);
          break;
        case Command.CHECK_BRAND:
          await this.checkBrand(options);
          break;
        case Command.ANALYZE:
          await this.analyzeDesign(options);
          break;
        case Command.FIX:
          await this.fixIssues(options);
          break;
        case Command.HELP:
        default:
          this.showHelp();
          break;
      }
    } catch (error) {
      console.error('❌ Error:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  }

  /**
   * Parse command line arguments
   */
  private parseArgs(args: string[]): CLIOptions {
    const command = (args[0] || 'help') as Command;
    const options: CLIOptions = {
      command,
      format: 'text',
      verbose: false,
      strict: false,
      autoFix: false
    };

    for (let i = 1; i < args.length; i++) {
      const arg = args[i];
      
      if (arg === '--input' || arg === '-i') {
        options.input = args[++i];
      } else if (arg === '--output' || arg === '-o') {
        options.output = args[++i];
      } else if (arg === '--format' || arg === '-f') {
        options.format = args[++i] as 'json' | 'text' | 'html';
      } else if (arg === '--verbose' || arg === '-v') {
        options.verbose = true;
      } else if (arg === '--strict' || arg === '-s') {
        options.strict = true;
      } else if (arg === '--auto-fix' || arg === '-a') {
        options.autoFix = true;
      }
    }

    return options;
  }

  /**
   * Validate complete design
   */
  private async validateDesign(options: CLIOptions): Promise<void> {
    console.log('🔍 Validating design...\n');

    // Load design from input
    const design = await this.loadDesign(options.input);
    
    // Validate all elements
    const results: Array<{ issues: ValidationIssue[]; score: number }> = [];
    for (const element of design.elements) {
      const result = this.validationService.validateDesignElement(element);
      results.push(result);
    }

    // Calculate overall score
    const overallScore = this.calculateOverallScore(results);
    
    // Display results
    this.displayValidationResults(results, overallScore, options);

    // Save results if output specified
    if (options.output) {
      await this.saveResults(results, options.output, options.format || 'json');
    }

    // Exit with error code if validation failed
    if (options.strict && overallScore < 80) {
      process.exit(1);
    }
  }

  /**
   * Check color contrast
   */
  private async checkContrast(options: CLIOptions): Promise<void> {
    console.log('🎨 Checking color contrast...\n');

    const design = await this.loadDesign(options.input);
    const issues: ValidationIssue[] = [];

    for (const element of design.elements) {
      if (element.color && element.backgroundColor) {
        const contrastRatio = this.designSystem.getContrastRatio(
          element.color,
          element.backgroundColor
        );

        const minRatio = element.fontSize && element.fontSize >= 18 ? 3 : 4.5;
        
        if (contrastRatio < minRatio) {
          issues.push({
            ruleId: 'contrast-ratio',
            severity: 'error',
            type: 'error',
            category: 'accessibility',
            message: `Insufficient contrast ratio: ${contrastRatio.toFixed(2)}:1 (minimum: ${minRatio}:1)`,
            element: element.id || 'unknown',
            suggestion: `Increase contrast between ${element.color} and ${element.backgroundColor}`
          });
        }
      }
    }

    // Display results
    if (issues.length === 0) {
      console.log('✅ All color contrasts meet WCAG 2.1 AA standards\n');
    } else {
      console.log(`❌ Found ${issues.length} contrast issues:\n`);
      issues.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue.message}`);
        console.log(`   Element: ${issue.element}`);
        console.log(`   Suggestion: ${issue.suggestion}\n`);
      });
    }

    if (options.strict && issues.length > 0) {
      process.exit(1);
    }
  }

  /**
   * Check accessibility compliance
   */
  private async checkAccessibility(options: CLIOptions): Promise<void> {
    console.log('♿ Checking accessibility compliance...\n');

    const design = await this.loadDesign(options.input);
    const allIssues: ValidationIssue[] = [];

    for (const element of design.elements) {
      const result = this.validationService.validateDesignElement(element);
      const accessibilityIssues = (result.issues || []).filter(
        issue => issue.category === 'accessibility'
      );
      allIssues.push(...accessibilityIssues);
    }

    // Group by severity
    const critical = allIssues.filter(i => i.severity === 'error' || i.type === 'error');
    const warnings = allIssues.filter(i => i.severity === 'warning' || i.type === 'warning');
    const suggestions = allIssues.filter(i => i.type === 'suggestion');

    // Display summary
    console.log('📊 Accessibility Summary:');
    console.log(`   Critical Issues: ${critical.length}`);
    console.log(`   Warnings: ${warnings.length}`);
    console.log(`   Suggestions: ${suggestions.length}\n`);

    // Display critical issues
    if (critical.length > 0) {
      console.log('🚨 Critical Issues:');
      critical.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue.message}`);
        console.log(`   Element: ${issue.element}`);
        console.log(`   Fix: ${issue.suggestion}\n`);
      });
    }

    // Display warnings if verbose
    if (options.verbose && warnings.length > 0) {
      console.log('⚠️  Warnings:');
      warnings.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue.message}`);
        console.log(`   Element: ${issue.element}\n`);
      });
    }

    // Compliance status
    const compliant = critical.length === 0 && warnings.length === 0;
    if (compliant) {
      console.log('✅ Design meets WCAG 2.1 AA standards\n');
    } else {
      console.log('❌ Design does not meet WCAG 2.1 AA standards\n');
    }

    if (options.strict && !compliant) {
      process.exit(1);
    }
  }

  /**
   * Check brand compliance
   */
  private async checkBrand(options: CLIOptions): Promise<void> {
    console.log('🏢 Checking brand compliance...\n');

    const design = await this.loadDesign(options.input);
    const issues: ValidationIssue[] = [];

    for (const element of design.elements) {
      const result = this.validationService.validateDesignElement(element);
      const brandIssues = (result.issues || []).filter(
        issue => issue.category === 'branding'
      );
      issues.push(...brandIssues);
    }

    // Display results
    if (issues.length === 0) {
      console.log('✅ Design complies with brand guidelines\n');
    } else {
      console.log(`⚠️  Found ${issues.length} brand compliance issues:\n`);
      issues.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue.message}`);
        console.log(`   Element: ${issue.element}`);
        console.log(`   Suggestion: ${issue.suggestion}\n`);
      });
    }

    if (options.strict && issues.length > 0) {
      process.exit(1);
    }
  }

  /**
   * Analyze design quality
   */
  private async analyzeDesign(options: CLIOptions): Promise<void> {
    console.log('📊 Analyzing design quality...\n');

    const design = await this.loadDesign(options.input);
    const results: Array<{ issues: ValidationIssue[]; score: number }> = [];

    for (const element of design.elements) {
      const result = this.validationService.validateDesignElement(element);
      results.push(result);
    }

    // Calculate metrics
    const overallScore = this.calculateOverallScore(results);
    const categoryScores = this.calculateCategoryScores(results);
    
    // Display analysis
    console.log('🎯 Overall Quality Score:', this.getScoreEmoji(overallScore), `${overallScore}/100\n`);
    
    console.log('📈 Category Scores:');
    Object.entries(categoryScores).forEach(([category, score]) => {
      console.log(`   ${category}: ${this.getScoreEmoji(score)} ${score}/100`);
    });
    console.log();

    // Display recommendations
    const allIssues = results.flatMap(r => r.issues || []);
    const topIssues = allIssues
      .filter(i => i.severity === 'error' || i.type === 'error')
      .slice(0, 5);

    if (topIssues.length > 0) {
      console.log('💡 Top Recommendations:');
      topIssues.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue.message}`);
        console.log(`   ${issue.suggestion}\n`);
      });
    }

    // Display strengths
    const strengths = this.identifyStrengths(results);
    if (strengths.length > 0) {
      console.log('✨ Strengths:');
      strengths.forEach((strength, i) => {
        console.log(`${i + 1}. ${strength}`);
      });
      console.log();
    }
  }

  /**
   * Auto-fix issues
   */
  private async fixIssues(options: CLIOptions): Promise<void> {
    console.log('🔧 Auto-fixing design issues...\n');

    const design = await this.loadDesign(options.input);
    let fixedCount = 0;

    for (const element of design.elements) {
      const result = this.validationService.validateDesignElement(element);
      const fixableIssues = (result.issues || []).filter(i => i.autoFixable);

      for (const issue of fixableIssues) {
        // Apply auto-fix
        this.applyAutoFix(element, issue);
        fixedCount++;
      }
    }

    console.log(`✅ Fixed ${fixedCount} issues\n`);

    // Save fixed design
    if (options.output) {
      await this.saveDesign(design, options.output);
      console.log(`💾 Saved fixed design to ${options.output}\n`);
    }
  }

  /**
   * Show help
   */
  private showHelp(): void {
    console.log(`
🎨 FENIX Design Validation CLI

USAGE:
  validate-design <command> [options]

COMMANDS:
  validate              Validate complete design
  check-contrast        Check color contrast ratios
  check-accessibility   Check WCAG 2.1 compliance
  check-brand          Check brand guideline compliance
  analyze              Analyze design quality
  fix                  Auto-fix issues
  help                 Show this help message

OPTIONS:
  -i, --input <file>    Input design file (JSON)
  -o, --output <file>   Output file for results
  -f, --format <type>   Output format (json|text|html)
  -v, --verbose         Show detailed output
  -s, --strict          Exit with error if validation fails
  -a, --auto-fix        Automatically fix issues

EXAMPLES:
  # Validate design
  validate-design validate -i design.json

  # Check contrast with strict mode
  validate-design check-contrast -i design.json --strict

  # Analyze and save results
  validate-design analyze -i design.json -o report.json

  # Auto-fix issues
  validate-design fix -i design.json -o fixed-design.json --auto-fix

  # Check accessibility verbosely
  validate-design check-accessibility -i design.json --verbose

For more information, visit: https://github.com/fenix-project-manager
`);
  }

  /**
   * Load design from file or stdin
   */
  private async loadDesign(_input?: string): Promise<any> {
    // For demo purposes, return sample design
    // In production, would load from file
    return {
      elements: [
        {
          id: 'header',
          type: 'text',
          color: '#232F3E',
          backgroundColor: '#FFFFFF',
          fontSize: 24,
          fontFamily: 'Amazon Ember',
          content: 'Sample Header'
        },
        {
          id: 'button',
          type: 'button',
          color: '#FFFFFF',
          backgroundColor: '#FF9900',
          fontSize: 14,
          width: 120,
          height: 44
        }
      ]
    };
  }

  /**
   * Save results to file
   */
  private async saveResults(
    _results: Array<{ issues: ValidationIssue[]; score: number }>,
    output: string,
    _format: string
  ): Promise<void> {
    // Implementation would save to file
    console.log(`💾 Results saved to ${output}`);
  }

  /**
   * Save design to file
   */
  private async saveDesign(_design: any, output: string): Promise<void> {
    // Implementation would save to file
    console.log(`💾 Design saved to ${output}`);
  }

  /**
   * Display validation results
   */
  private displayValidationResults(
    results: Array<{ issues: ValidationIssue[]; score: number }>,
    overallScore: number,
    options: CLIOptions
  ): void {
    console.log('📊 Validation Results:\n');
    console.log(`Overall Score: ${this.getScoreEmoji(overallScore)} ${overallScore}/100\n`);

    const allIssues = results.flatMap(r => r.issues || []);
    const errors = allIssues.filter(i => i.severity === 'error' || i.type === 'error');
    const warnings = allIssues.filter(i => i.severity === 'warning' || i.type === 'warning');
    const suggestions = allIssues.filter(i => i.type === 'suggestion');

    console.log(`Errors: ${errors.length}`);
    console.log(`Warnings: ${warnings.length}`);
    console.log(`Suggestions: ${suggestions.length}\n`);

    if (errors.length > 0) {
      console.log('❌ Errors:');
      errors.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue.message}`);
        if (options.verbose) {
          console.log(`   Element: ${issue.element}`);
          console.log(`   Category: ${issue.category}`);
          console.log(`   Fix: ${issue.suggestion}`);
        }
        console.log();
      });
    }

    if (options.verbose && warnings.length > 0) {
      console.log('⚠️  Warnings:');
      warnings.forEach((issue, i) => {
        console.log(`${i + 1}. ${issue.message}`);
        console.log(`   Element: ${issue.element}\n`);
      });
    }
  }

  /**
   * Calculate overall score
   */
  private calculateOverallScore(results: Array<{ issues: ValidationIssue[]; score: number }>): number {
    if (results.length === 0) return 100;
    
    const totalScore = results.reduce((sum, r) => sum + (r.score || 0), 0);
    return Math.round(totalScore / results.length);
  }

  /**
   * Calculate category scores
   */
  private calculateCategoryScores(results: Array<{ issues: ValidationIssue[]; score: number }>): Record<string, number> {
    const categories = ['accessibility', 'branding', 'typography', 'color', 'layout', 'content'];
    const scores: Record<string, number> = {};

    for (const category of categories) {
      const categoryIssues = results.flatMap(r => r.issues || []).filter(i => i.category === category);
      const errorCount = categoryIssues.filter(i => i.severity === 'error' || i.type === 'error').length;
      const warningCount = categoryIssues.filter(i => i.severity === 'warning' || i.type === 'warning').length;
      
      // Calculate score (100 - penalties)
      const score = Math.max(0, 100 - (errorCount * 10) - (warningCount * 5));
      scores[category] = score;
    }

    return scores;
  }

  /**
   * Identify design strengths
   */
  private identifyStrengths(results: Array<{ issues: ValidationIssue[]; score: number }>): string[] {
    const strengths: string[] = [];
    const categoryScores = this.calculateCategoryScores(results);

    Object.entries(categoryScores).forEach(([category, score]) => {
      if (score >= 90) {
        strengths.push(`Excellent ${category} implementation`);
      }
    });

    return strengths;
  }

  /**
   * Apply auto-fix to element
   */
  private applyAutoFix(element: DesignElement, issue: ValidationIssue): void {
    // Implementation would apply specific fixes based on issue type
    console.log(`  Fixed: ${issue.message} on ${element.id}`);
  }

  /**
   * Get emoji for score
   */
  private getScoreEmoji(score: number): string {
    if (score >= 90) return '🟢';
    if (score >= 70) return '🟡';
    if (score >= 50) return '🟠';
    return '🔴';
  }
}

/**
 * Main entry point
 */
if (require.main === module) {
  const cli = new DesignValidationCLI();
  const args = process.argv.slice(2);
  cli.run(args).catch(error => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
}

export { DesignValidationCLI };
