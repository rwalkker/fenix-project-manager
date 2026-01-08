#!/usr/bin/env node
/**
 * Design Validation CLI
 */
declare class DesignValidationCLI {
    private validationService;
    private designSystem;
    constructor();
    /**
     * Run CLI
     */
    run(args: string[]): Promise<void>;
    /**
     * Parse command line arguments
     */
    private parseArgs;
    /**
     * Validate complete design
     */
    private validateDesign;
    /**
     * Check color contrast
     */
    private checkContrast;
    /**
     * Check accessibility compliance
     */
    private checkAccessibility;
    /**
     * Check brand compliance
     */
    private checkBrand;
    /**
     * Analyze design quality
     */
    private analyzeDesign;
    /**
     * Auto-fix issues
     */
    private fixIssues;
    /**
     * Show help
     */
    private showHelp;
    /**
     * Load design from file or stdin
     */
    private loadDesign;
    /**
     * Save results to file
     */
    private saveResults;
    /**
     * Save design to file
     */
    private saveDesign;
    /**
     * Display validation results
     */
    private displayValidationResults;
    /**
     * Calculate overall score
     */
    private calculateOverallScore;
    /**
     * Calculate category scores
     */
    private calculateCategoryScores;
    /**
     * Identify design strengths
     */
    private identifyStrengths;
    /**
     * Apply auto-fix to element
     */
    private applyAutoFix;
    /**
     * Get emoji for score
     */
    private getScoreEmoji;
}
export { DesignValidationCLI };
//# sourceMappingURL=validate-design.d.ts.map