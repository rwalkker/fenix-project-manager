export interface DataAnalysis {
    type: 'numeric' | 'text' | 'date' | 'boolean' | 'mixed';
    statistics?: {
        mean: number;
        median: number;
        mode: number | number[];
        stdDev: number;
        variance: number;
        min: number;
        max: number;
        range: number;
        quartiles: {
            q1: number;
            q2: number;
            q3: number;
        };
        outliers: number[];
    };
    quality: {
        completeness: number;
        uniqueness: number;
        validity: number;
        consistency: number;
        issues: string[];
    };
    suggestions: {
        chartType: string;
        formatting: string;
        validation: string;
        aggregation: string;
    };
    patterns?: {
        trend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
        seasonality: boolean;
        correlation?: number;
    };
}
export interface FormulaResult {
    formula: string;
    explanation: string;
    example: string;
    category: 'math' | 'statistical' | 'logical' | 'lookup' | 'text' | 'date';
}
/**
 * Data Intelligence Service
 * Provides smart data analysis and formula generation
 */
export declare class DataIntelligenceService {
    /**
     * Analyze column data and provide insights
     */
    analyzeColumn(data: any[], columnName?: string): DataAnalysis;
    /**
     * Detect data type
     */
    private detectDataType;
    /**
     * Check if string is a date
     */
    private isDateString;
    /**
     * Calculate comprehensive statistics
     */
    private calculateStatistics;
    /**
     * Detect outliers using IQR method
     */
    private detectOutliers;
    /**
     * Assess data quality
     */
    private assessDataQuality;
    /**
     * Detect patterns in numeric data
     */
    private detectPatterns;
    /**
     * Calculate trend correlation coefficient
     */
    private calculateTrendCorrelation;
    /**
     * Detect seasonality in data
     */
    private detectSeasonality;
    /**
     * Calculate correlation between two arrays
     */
    private calculateCorrelation;
    /**
     * Generate suggestions based on data analysis
     */
    private generateSuggestions;
    /**
     * Generate formula from natural language
     */
    generateFormula(description: string): FormulaResult;
    /**
     * Suggest formulas based on data analysis
     */
    suggestFormulas(analysis: DataAnalysis): FormulaResult[];
    /**
     * Suggest macros based on data analysis
     */
    suggestMacros(analysis: DataAnalysis): string[];
    /**
     * Generate automation recommendations
     */
    generateAutomationRecommendations(analysis: DataAnalysis): Array<{
        task: string;
        macro: string;
        benefit: string;
        priority: 'high' | 'medium' | 'low';
    }>;
}
//# sourceMappingURL=DataIntelligenceService.d.ts.map