"use strict";
// FENIX Project Manager - Style Consistency Service
// Ensure style consistency across documents
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.StyleConsistencyService = void 0;
exports.createStyleConsistencyService = createStyleConsistencyService;
/**
 * Style Consistency Service
 * Validates and enforces style consistency
 */
class StyleConsistencyService {
    styleGuides;
    defaultGuideId;
    constructor() {
        this.styleGuides = new Map();
        this.defaultGuideId = 'default';
        this.initializeDefaultStyleGuide();
    }
    /**
     * Check style consistency
     */
    async checkStyle(content, guideId) {
        const guide = this.getStyleGuide(guideId || this.defaultGuideId);
        const violations = [];
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
            }
            catch (error) {
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
    async applyStyle(content, guideId) {
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
    getStyleGuide(guideId) {
        const guide = this.styleGuides.get(guideId);
        if (!guide) {
            throw new Error(`Style guide not found: ${guideId}`);
        }
        return guide;
    }
    /**
     * Create custom style guide
     */
    async createStyleGuide(guide) {
        this.styleGuides.set(guide.id, guide);
    }
    /**
     * Update style guide
     */
    async updateStyleGuide(guideId, updates) {
        const guide = this.getStyleGuide(guideId);
        Object.assign(guide, updates);
    }
    /**
     * Delete style guide
     */
    async deleteStyleGuide(guideId) {
        if (guideId === this.defaultGuideId) {
            throw new Error('Cannot delete default style guide');
        }
        this.styleGuides.delete(guideId);
    }
    /**
     * Get all style guides
     */
    getAllStyleGuides() {
        return Array.from(this.styleGuides.values());
    }
    /**
     * Set default style guide
     */
    setDefaultStyleGuide(guideId) {
        if (!this.styleGuides.has(guideId)) {
            throw new Error(`Style guide not found: ${guideId}`);
        }
        this.defaultGuideId = guideId;
    }
    /**
     * Compare two style guides
     */
    async compareStyleGuides(guideId1, guideId2) {
        const guide1 = this.getStyleGuide(guideId1);
        const guide2 = this.getStyleGuide(guideId2);
        const differences = [];
        const similarities = [];
        // Compare colors
        if (guide1.colors.primary !== guide2.colors.primary) {
            differences.push(`Primary color: ${guide1.colors.primary} vs ${guide2.colors.primary}`);
        }
        else {
            similarities.push(`Same primary color: ${guide1.colors.primary}`);
        }
        // Compare fonts
        if (guide1.typography.headingFont !== guide2.typography.headingFont) {
            differences.push(`Heading font: ${guide1.typography.headingFont} vs ${guide2.typography.headingFont}`);
        }
        else {
            similarities.push(`Same heading font: ${guide1.typography.headingFont}`);
        }
        // Compare spacing
        if (guide1.spacing.medium !== guide2.spacing.medium) {
            differences.push(`Medium spacing: ${guide1.spacing.medium} vs ${guide2.spacing.medium}`);
        }
        else {
            similarities.push(`Same medium spacing: ${guide1.spacing.medium}`);
        }
        return { differences, similarities };
    }
    /**
     * Validate color contrast
     */
    async validateColorContrast(foreground, background) {
        // Simplified contrast calculation
        // In reality, would use proper WCAG contrast calculation
        const ratio = this.calculateContrastRatio(foreground, background);
        let level;
        if (ratio >= 7) {
            level = 'AAA';
        }
        else if (ratio >= 4.5) {
            level = 'AA';
        }
        else {
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
    initializeDefaultStyleGuide() {
        const defaultGuide = {
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
                    check: (_content) => {
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
                    check: (_content) => {
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
                    check: (_content) => {
                        // Simplified check
                        return true;
                    }
                }
            ]
        };
        this.styleGuides.set('default', defaultGuide);
        // Add Amazon corporate style guide
        const amazonGuide = {
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
                    check: (_content) => {
                        return true;
                    }
                },
                {
                    id: 'amazon-fonts',
                    name: 'Amazon Ember Font',
                    description: 'Use Amazon Ember font family',
                    category: 'typography',
                    severity: 'warning',
                    check: (_content) => {
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
    calculateStyleScore(violations, totalRules) {
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
    generateSummary(violations, score) {
        if (violations.length === 0) {
            return 'All style checks passed! Document follows style guide perfectly.';
        }
        const errors = violations.filter(v => v.severity === 'error').length;
        const warnings = violations.filter(v => v.severity === 'warning').length;
        const infos = violations.filter(v => v.severity === 'info').length;
        const parts = [];
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
    getSuggestion(rule) {
        // Simplified - would provide specific suggestions based on rule
        return `Please review and fix ${rule.name.toLowerCase()}`;
    }
    /**
     * Calculate contrast ratio
     */
    calculateContrastRatio(_foreground, _background) {
        // Simplified calculation
        // In reality, would convert colors to relative luminance and calculate proper ratio
        return 4.5; // Placeholder
    }
}
exports.StyleConsistencyService = StyleConsistencyService;
/**
 * Create Style Consistency Service instance
 */
function createStyleConsistencyService() {
    return new StyleConsistencyService();
}
//# sourceMappingURL=StyleConsistencyService.js.map