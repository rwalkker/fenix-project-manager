"use strict";
// FENIX Project Manager - Compliance Checking Service
// Validate content against style guides and compliance standards
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplianceCheckingService = void 0;
/**
 * Compliance Checking Service
 * Validates content against style guides and compliance standards
 */
class ComplianceCheckingService {
    styleGuides = new Map();
    constructor() {
        this.initializeDefaultStyleGuides();
    }
    /**
     * Check compliance against a style guide
     */
    async checkCompliance(content, styleGuideId, metadata) {
        const styleGuide = this.styleGuides.get(styleGuideId);
        if (!styleGuide) {
            throw new Error(`Style guide not found: ${styleGuideId}`);
        }
        const issues = [];
        let passedRules = 0;
        let failedRules = 0;
        for (const rule of styleGuide.rules) {
            try {
                const passed = rule.check(content, metadata);
                if (passed) {
                    passedRules++;
                }
                else {
                    failedRules++;
                    issues.push({
                        ruleId: rule.id,
                        ruleName: rule.name,
                        severity: rule.severity,
                        category: rule.category,
                        message: rule.description,
                        suggestion: this.getSuggestion(rule.id)
                    });
                }
            }
            catch (error) {
                // Rule check failed - treat as warning
                issues.push({
                    ruleId: rule.id,
                    ruleName: rule.name,
                    severity: 'warning',
                    category: rule.category,
                    message: `Rule check failed: ${error}`
                });
            }
        }
        const totalRules = styleGuide.rules.length;
        const score = (passedRules / totalRules) * 100;
        const passed = failedRules === 0;
        return {
            passed,
            score,
            totalRules,
            passedRules,
            failedRules,
            issues,
            summary: this.generateSummary(passed, score, issues.length)
        };
    }
    /**
     * Validate required sections
     */
    async validateRequiredSections(content, requiredSections) {
        const issues = [];
        const lower = content.toLowerCase();
        requiredSections.forEach(section => {
            if (!lower.includes(section.toLowerCase())) {
                issues.push({
                    ruleId: 'required-section',
                    ruleName: 'Required Section',
                    severity: 'error',
                    category: 'structure',
                    message: `Missing required section: ${section}`,
                    suggestion: `Add a section for "${section}"`
                });
            }
        });
        return issues;
    }
    /**
     * Check data accuracy
     */
    async checkDataAccuracy(content, _expectedData) {
        const issues = [];
        // expectedData parameter is available for future validation but not currently used
        // Check for inconsistent numbers
        const numbers = content.match(/\d+(\.\d+)?/g);
        if (numbers) {
            const uniqueNumbers = new Set(numbers);
            if (uniqueNumbers.size < numbers.length / 2) {
                issues.push({
                    ruleId: 'data-consistency',
                    ruleName: 'Data Consistency',
                    severity: 'warning',
                    category: 'data',
                    message: 'Repeated numbers detected - verify data accuracy'
                });
            }
        }
        // Check for placeholder data
        const placeholders = ['TBD', 'TODO', 'XXX', '[INSERT', 'PLACEHOLDER'];
        placeholders.forEach(placeholder => {
            if (content.includes(placeholder)) {
                issues.push({
                    ruleId: 'placeholder-data',
                    ruleName: 'Placeholder Data',
                    severity: 'error',
                    category: 'data',
                    message: `Placeholder found: ${placeholder}`,
                    suggestion: 'Replace placeholder with actual data'
                });
            }
        });
        return issues;
    }
    /**
     * Ensure accessibility standards
     */
    async checkAccessibility(content, metadata) {
        const issues = [];
        // Check for alt text mentions (for images)
        if (metadata?.hasImages && !content.toLowerCase().includes('alt')) {
            issues.push({
                ruleId: 'alt-text',
                ruleName: 'Alt Text',
                severity: 'error',
                category: 'accessibility',
                message: 'Images should have alt text descriptions',
                suggestion: 'Add alt text for all images'
            });
        }
        // Check for color-only information
        const colorWords = ['red', 'green', 'blue', 'yellow'];
        const hasColorReferences = colorWords.some(color => content.toLowerCase().includes(`see ${color}`) ||
            content.toLowerCase().includes(`${color} indicates`));
        if (hasColorReferences) {
            issues.push({
                ruleId: 'color-only',
                ruleName: 'Color-Only Information',
                severity: 'warning',
                category: 'accessibility',
                message: 'Avoid using color as the only means of conveying information',
                suggestion: 'Add text labels or patterns in addition to colors'
            });
        }
        // Check for proper heading structure
        if (metadata?.hasHeadings) {
            const headingPattern = /^(#{1,6})\s/gm;
            const headings = content.match(headingPattern);
            if (!headings || headings.length === 0) {
                issues.push({
                    ruleId: 'heading-structure',
                    ruleName: 'Heading Structure',
                    severity: 'warning',
                    category: 'accessibility',
                    message: 'Document should have proper heading structure',
                    suggestion: 'Use hierarchical headings (H1, H2, H3, etc.)'
                });
            }
        }
        return issues;
    }
    /**
     * Flag potential compliance issues
     */
    async flagIssues(content, styleGuideId = 'amazon') {
        const report = await this.checkCompliance(content, styleGuideId);
        return report.issues.filter(issue => issue.severity === 'error' || issue.severity === 'warning');
    }
    /**
     * Get available style guides
     */
    getStyleGuides() {
        return Array.from(this.styleGuides.values());
    }
    /**
     * Add custom style guide
     */
    addStyleGuide(styleGuide) {
        this.styleGuides.set(styleGuide.id, styleGuide);
    }
    // Private helper methods
    initializeDefaultStyleGuides() {
        // Amazon Style Guide
        const amazonGuide = {
            id: 'amazon',
            name: 'Amazon Style Guide',
            version: '1.0',
            rules: [
                {
                    id: 'customer-obsession',
                    name: 'Customer Obsession',
                    description: 'Content should focus on customer benefits',
                    category: 'content',
                    severity: 'warning',
                    check: (content) => {
                        const lower = content.toLowerCase();
                        return lower.includes('customer') || lower.includes('user');
                    }
                },
                {
                    id: 'data-driven',
                    name: 'Data-Driven',
                    description: 'Include metrics and data to support claims',
                    category: 'content',
                    severity: 'warning',
                    check: (content) => /\d+/.test(content)
                },
                {
                    id: 'bias-for-action',
                    name: 'Bias for Action',
                    description: 'Include clear action items or next steps',
                    category: 'content',
                    severity: 'info',
                    check: (content) => {
                        const lower = content.toLowerCase();
                        return lower.includes('action') || lower.includes('next step');
                    }
                },
                {
                    id: 'no-jargon',
                    name: 'No Jargon',
                    description: 'Avoid unnecessary jargon and acronyms',
                    category: 'style',
                    severity: 'warning',
                    check: (content) => {
                        const acronyms = content.match(/\b[A-Z]{3,}\b/g);
                        return !acronyms || acronyms.length < 5;
                    }
                },
                {
                    id: 'concise',
                    name: 'Concise Writing',
                    description: 'Keep sentences concise (under 25 words)',
                    category: 'style',
                    severity: 'info',
                    check: (content) => {
                        const sentences = content.split(/[.!?]+/);
                        const longSentences = sentences.filter(s => s.split(/\s+/).length > 25);
                        return longSentences.length < sentences.length * 0.3;
                    }
                }
            ]
        };
        // General Style Guide
        const generalGuide = {
            id: 'general',
            name: 'General Style Guide',
            version: '1.0',
            rules: [
                {
                    id: 'proper-grammar',
                    name: 'Proper Grammar',
                    description: 'Use proper grammar and punctuation',
                    category: 'style',
                    severity: 'error',
                    check: (content) => {
                        // Basic check: sentences should start with capital letter
                        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
                        const improper = sentences.filter(s => !/^[A-Z]/.test(s.trim()));
                        return improper.length < sentences.length * 0.2;
                    }
                },
                {
                    id: 'no-placeholders',
                    name: 'No Placeholders',
                    description: 'Remove all placeholder text',
                    category: 'content',
                    severity: 'error',
                    check: (content) => {
                        const placeholders = ['TBD', 'TODO', 'XXX', '[INSERT'];
                        return !placeholders.some(p => content.includes(p));
                    }
                },
                {
                    id: 'consistent-formatting',
                    name: 'Consistent Formatting',
                    description: 'Use consistent formatting throughout',
                    category: 'style',
                    severity: 'info',
                    check: (_content) => true // Placeholder for more complex check
                }
            ]
        };
        this.styleGuides.set('amazon', amazonGuide);
        this.styleGuides.set('general', generalGuide);
    }
    getSuggestion(ruleId) {
        const suggestions = {
            'customer-obsession': 'Add customer benefits and value propositions',
            'data-driven': 'Include relevant metrics, percentages, or data points',
            'bias-for-action': 'Add clear action items or next steps section',
            'no-jargon': 'Define acronyms on first use or use simpler terms',
            'concise': 'Break long sentences into shorter ones',
            'proper-grammar': 'Review grammar and punctuation',
            'no-placeholders': 'Replace placeholder text with actual content',
            'consistent-formatting': 'Ensure consistent use of headings, lists, and formatting'
        };
        return suggestions[ruleId] || 'Review and update content';
    }
    generateSummary(passed, score, issueCount) {
        if (passed) {
            return 'All compliance checks passed';
        }
        const parts = [];
        parts.push(`Compliance score: ${score.toFixed(1)}%`);
        parts.push(`${issueCount} issue${issueCount > 1 ? 's' : ''} found`);
        if (score >= 80) {
            parts.push('Minor issues detected');
        }
        else if (score >= 60) {
            parts.push('Several issues need attention');
        }
        else {
            parts.push('Significant compliance issues detected');
        }
        return parts.join('. ') + '.';
    }
}
exports.ComplianceCheckingService = ComplianceCheckingService;
//# sourceMappingURL=ComplianceCheckingService.js.map