/**
 * Compliance Rule
 */
export interface ComplianceRule {
    id: string;
    name: string;
    description: string;
    category: 'style' | 'structure' | 'content' | 'accessibility' | 'data';
    severity: 'error' | 'warning' | 'info';
    check: (content: string, metadata?: any) => boolean;
}
/**
 * Compliance Issue
 */
export interface ComplianceIssue {
    ruleId: string;
    ruleName: string;
    severity: 'error' | 'warning' | 'info';
    category: string;
    message: string;
    location?: string;
    suggestion?: string;
}
/**
 * Compliance Report
 */
export interface ComplianceReport {
    passed: boolean;
    score: number;
    totalRules: number;
    passedRules: number;
    failedRules: number;
    issues: ComplianceIssue[];
    summary: string;
}
/**
 * Style Guide
 */
export interface StyleGuide {
    id: string;
    name: string;
    version: string;
    rules: ComplianceRule[];
}
/**
 * Compliance Checking Service
 * Validates content against style guides and compliance standards
 */
export declare class ComplianceCheckingService {
    private styleGuides;
    constructor();
    /**
     * Check compliance against a style guide
     */
    checkCompliance(content: string, styleGuideId: string, metadata?: any): Promise<ComplianceReport>;
    /**
     * Validate required sections
     */
    validateRequiredSections(content: string, requiredSections: string[]): Promise<ComplianceIssue[]>;
    /**
     * Check data accuracy
     */
    checkDataAccuracy(content: string, _expectedData?: Record<string, any>): Promise<ComplianceIssue[]>;
    /**
     * Ensure accessibility standards
     */
    checkAccessibility(content: string, metadata?: any): Promise<ComplianceIssue[]>;
    /**
     * Flag potential compliance issues
     */
    flagIssues(content: string, styleGuideId?: string): Promise<ComplianceIssue[]>;
    /**
     * Get available style guides
     */
    getStyleGuides(): StyleGuide[];
    /**
     * Add custom style guide
     */
    addStyleGuide(styleGuide: StyleGuide): void;
    private initializeDefaultStyleGuides;
    private getSuggestion;
    private generateSummary;
}
//# sourceMappingURL=ComplianceCheckingService.d.ts.map