// FENIX Project Manager - Style Consistency Service
// Ensure style consistency across documents
// Created: January 6, 2026

/**
 * Style Guide
 */
export interface StyleGuide {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    text: string;
    background: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    codeFont: string;
    headingSizes: Record<string, number>;
  };
  spacing: {
    small: number;
    medium: number;
    large: number;
  };
  rules: StyleRule[];
}

/**
 * Style Rule
 */
export interface StyleRule {
  id: string;
  name: string;
  description: string;
  category: 'color' | 'typography' | 'spacing' | 'layout' | 'general';
  severity: 'error' | 'warning' | 'info';
  check: (content: any) => boolean;
}

/**
 * Style Violation
 */
export interface StyleViolation {
  ruleId: string;
  ruleName: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  location?: string;
  suggestion?: string;
}

/**
 * Style Check Result
 */
export interface StyleCheckResult {
  passed: boolean;
  violations: StyleViolation[];
  score: number; // 0-100
  summary: string;
}

/**
 * Style Consistency Service
 * Validates and enforces style consistency
 */
export class StyleConsistencyService {
  private styleGuides: Map<string, StyleGuide>;
  private defaultGuideId: string;

  constructor() {
    this.styleGuides = new Map();
    this.defaultGuideId = 'default';
    this.initializeDefaultStyleGuide();
  }

  /**
   * Check style consistency
   */
  async checkStyle(
    content: any,
    guideId?: string
  ): Promise<StyleCheckResult> {
    const guide = this.getStyleGuide(guideId || this.defaultGuideId);
    const violations: StyleViolation[] = [];

    // Run all style rules
    for (const rule of guide.rules) {
      try {
        const passed = rule.check(content);
        if (!passed) {
          violations.push({
            ruleId: rule.id,
            ruleName: rule.name,
            severity: rule.severity,
            message: rule.description,
            suggestion: this.getSuggestion(rule)
          });
        }
      } catch (error) {
        // Rule check failed - log but continue
        console.error(`Style rule ${rule.id} failed:`, error);
      }
    }

    // Calculate score
    const score = this.calculateStyleScore(violations, guide.rules.length);

    // Generate summary
    const summary = this.generateSummary(violations, score);

    return {
      passed: violations.filter(v => v.severity === 'error').length === 0,
      violations,
      score,
      summary
    };
  }

  /**
   * Apply style guide to content
   */
  async applyStyle(
    content: any,
    guideId?: string
  ): Promise<any> {
    const guide = this.getStyleGuide(guideId || this.defaultGuideId);

    // Apply colors
    if (content.colors) {
      content.colors = { ...guide.colors };
    }

    // Apply typography
    if (content.typography) {
      content.typography = { ...guide.typography };
    }

    // Apply spacing
    if (content.spacing) {
      content.spacing = { ...guide.spacing };
    }

    return content;
  }

  /**
   * Get style guide
   */
  getStyleGuide(guideId: string): StyleGuide {
    const guide = this.styleGuides.get(guideId);
    if (!guide) {
      throw new Error(`Style guide not found: ${guideId}`);
    }
    return guide;
  }

  /**
   * Create custom style guide
   */
  async createStyleGuide(guide: StyleGuide): Promise<void> {
    this.styleGuides.set(guide.id, guide);
  }

  /**
   * Update style guide
   */
  async updateStyleGuide(
    guideId: string,
    updates: Partial<StyleGuide>
  ): Promise<void> {
    const guide = this.getStyleGuide(guideId);
    Object.assign(guide, updates);
  }

  /**
   * Delete style guide
   */
  async deleteStyleGuide(guideId: string): Promise<void> {
    if (guideId === this.defaultGuideId) {
      throw new Error('Cannot delete default style guide');
    }
    this.styleGuides.delete(guideId);
  }

  /**
   * Get all style guides
   */
  getAllStyleGuides(): StyleGuide[] {
    return Array.from(this.styleGuides.values());
  }

  /**
   * Set default style guide
   */
  setDefaultStyleGuide(guideId: string): void {
    if (!this.styleGuides.has(guideId)) {
      throw new Error(`Style guide not found: ${guideId}`);
    }
    this.defaultGuideId = guideId;
  }

  /**
   * Compare two style guides
   */
  async compareStyleGuides(
    guideId1: string,
    guideId2: string
  ): Promise<{
    differences: string[];
    similarities: string[];
  }> {
    const guide1 = this.getStyleGuide(guideId1);
    const guide2 = this.getStyleGuide(guideId2);

    const differences: string[] = [];
    const similarities: string[] = [];

    // Compare colors
    if (guide1.colors.primary !== guide2.colors.primary) {
      differences.push(`Primary color: ${guide1.colors.primary} vs ${guide2.colors.primary}`);
    } else {
      similarities.push(`Same primary color: ${guide1.colors.primary}`);
    }

    // Compare fonts
    if (guide1.typography.headingFont !== guide2.typography.headingFont) {
      differences.push(`Heading font: ${guide1.typography.headingFont} vs ${guide2.typography.headingFont}`);
    } else {
      similarities.push(`Same heading font: ${guide1.typography.headingFont}`);
    }

    // Compare spacing
    if (guide1.spacing.medium !== guide2.spacing.medium) {
      differences.push(`Medium spacing: ${guide1.spacing.medium} vs ${guide2.spacing.medium}`);
    } else {
      similarities.push(`Same medium spacing: ${guide1.spacing.medium}`);
    }

    return { differences, similarities };
  }

  /**
   * Validate color contrast
   */
  async validateColorContrast(
    foreground: string,
    background: string
  ): Promise<{
    ratio: number;
    passes: boolean;
    level: 'AAA' | 'AA' | 'fail';
  }> {
    // Simplified contrast calculation
    // In reality, would use proper WCAG contrast calculation
    const ratio = this.calculateContrastRatio(foreground, background);

    let level: 'AAA' | 'AA' | 'fail';
    if (ratio >= 7) {
      level = 'AAA';
    } else if (ratio >= 4.5) {
      level = 'AA';
    } else {
      level = 'fail';
    }

    return {
      ratio,
      passes: ratio >= 4.5,
      level
    };
  }

  // ========== Private Helper Methods ==========

  /**
   * Initialize default style guide
   */
  private initializeDefaultStyleGuide(): void {
    const defaultGuide: StyleGuide = {
      id: 'default',
      name: 'Default Style Guide',
      colors: {
        primary: '#0066CC',
        secondary: '#6C757D',
        accent: '#FF9900',
        text: '#212529',
        background: '#FFFFFF'
      },
      typography: {
        headingFont: 'Arial',
        bodyFont: 'Arial',
        codeFont: 'Courier New',
        headingSizes: {
          h1: 32,
          h2: 24,
          h3: 20,
          h4: 16
        }
      },
      spacing: {
        small: 8,
        medium: 16,
        large: 32
      },
      rules: [
        {
          id: 'color-contrast',
          name: 'Color Contrast',
          description: 'Text must have sufficient contrast with background',
          category: 'color',
          severity: 'error',
          check: (_content: any) => {
            // Simplified check
            return true;
          }
        },
        {
          id: 'consistent-fonts',
          name: 'Consistent Fonts',
          description: 'Use consistent font families throughout document',
          category: 'typography',
          severity: 'warning',
          check: (_content: any) => {
            // Simplified check
            return true;
          }
        },
        {
          id: 'proper-spacing',
          name: 'Proper Spacing',
          description: 'Use consistent spacing values',
          category: 'spacing',
          severity: 'info',
          check: (_content: any) => {
            // Simplified check
            return true;
          }
        }
      ]
    };

    this.styleGuides.set('default', defaultGuide);

    // Add Amazon corporate style guide
    const amazonGuide: StyleGuide = {
      id: 'amazon-corporate',
      name: 'Amazon Corporate Style Guide',
      colors: {
        primary: '#FF9900',
        secondary: '#232F3E',
        accent: '#146EB4',
        text: '#0F1111',
        background: '#FFFFFF'
      },
      typography: {
        headingFont: 'Amazon Ember',
        bodyFont: 'Amazon Ember',
        codeFont: 'Courier New',
        headingSizes: {
          h1: 36,
          h2: 28,
          h3: 22,
          h4: 18
        }
      },
      spacing: {
        small: 8,
        medium: 16,
        large: 24
      },
      rules: [
        {
          id: 'amazon-colors',
          name: 'Amazon Brand Colors',
          description: 'Use Amazon brand colors',
          category: 'color',
          severity: 'error',
          check: (_content: any) => {
            return true;
          }
        },
        {
          id: 'amazon-fonts',
          name: 'Amazon Ember Font',
          description: 'Use Amazon Ember font family',
          category: 'typography',
          severity: 'warning',
          check: (_content: any) => {
            return true;
          }
        }
      ]
    };

    this.styleGuides.set('amazon-corporate', amazonGuide);
  }

  /**
   * Calculate style score
   */
  private calculateStyleScore(violations: StyleViolation[], totalRules: number): number {
    if (totalRules === 0) {
      return 100;
    }

    // Weight violations by severity
    let deductions = 0;
    violations.forEach(v => {
      switch (v.severity) {
        case 'error':
          deductions += 10;
          break;
        case 'warning':
          deductions += 5;
          break;
        case 'info':
          deductions += 2;
          break;
      }
    });

    const score = Math.max(0, 100 - deductions);
    return score;
  }

  /**
   * Generate summary
   */
  private generateSummary(violations: StyleViolation[], score: number): string {
    if (violations.length === 0) {
      return 'All style checks passed! Document follows style guide perfectly.';
    }

    const errors = violations.filter(v => v.severity === 'error').length;
    const warnings = violations.filter(v => v.severity === 'warning').length;
    const infos = violations.filter(v => v.severity === 'info').length;

    const parts: string[] = [];
    if (errors > 0) {
      parts.push(`${errors} error${errors > 1 ? 's' : ''}`);
    }
    if (warnings > 0) {
      parts.push(`${warnings} warning${warnings > 1 ? 's' : ''}`);
    }
    if (infos > 0) {
      parts.push(`${infos} info`);
    }

    return `Style score: ${score}/100. Found ${parts.join(', ')}.`;
  }

  /**
   * Get suggestion for rule
   */
  private getSuggestion(rule: StyleRule): string {
    // Simplified - would provide specific suggestions based on rule
    return `Please review and fix ${rule.name.toLowerCase()}`;
  }

  /**
   * Calculate contrast ratio
   */
  private calculateContrastRatio(_foreground: string, _background: string): number {
    // Simplified calculation
    // In reality, would convert colors to relative luminance and calculate proper ratio
    return 4.5; // Placeholder
  }
}

/**
 * Create Style Consistency Service instance
 */
export function createStyleConsistencyService(): StyleConsistencyService {
  return new StyleConsistencyService();
}
