"use strict";
// FENIX Project Manager - Data Intelligence Service
// Smart data analysis and formula generation for Excel
// Created: January 6, 2026
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataIntelligenceService = void 0;
const ss = __importStar(require("simple-statistics"));
const lodash_1 = __importDefault(require("lodash"));
/**
 * Data Intelligence Service
 * Provides smart data analysis and formula generation
 */
class DataIntelligenceService {
    /**
     * Analyze column data and provide insights
     */
    analyzeColumn(data, columnName = 'Column') {
        const type = this.detectDataType(data);
        const quality = this.assessDataQuality(data);
        const suggestions = this.generateSuggestions(type, data, quality);
        const analysis = {
            type,
            quality,
            suggestions
        };
        if (type === 'numeric') {
            analysis.statistics = this.calculateStatistics(data);
            analysis.patterns = this.detectPatterns(data);
        }
        return analysis;
    }
    /**
     * Detect data type
     */
    detectDataType(data) {
        const types = data.map(value => {
            if (value === null || value === undefined || value === '')
                return 'empty';
            if (typeof value === 'number' && !isNaN(value))
                return 'numeric';
            if (typeof value === 'boolean')
                return 'boolean';
            if (value instanceof Date || this.isDateString(value))
                return 'date';
            return 'text';
        });
        const typeCounts = lodash_1.default.countBy(types);
        delete typeCounts.empty;
        if (Object.keys(typeCounts).length === 0)
            return 'text';
        if (Object.keys(typeCounts).length > 1)
            return 'mixed';
        const dominantType = lodash_1.default.maxBy(Object.keys(typeCounts), key => typeCounts[key]);
        return dominantType;
    }
    /**
     * Check if string is a date
     */
    isDateString(value) {
        if (typeof value !== 'string')
            return false;
        const date = new Date(value);
        return !isNaN(date.getTime()) && value.match(/\d{1,4}[-/]\d{1,2}[-/]\d{1,4}/) !== null;
    }
    /**
     * Calculate comprehensive statistics
     */
    calculateStatistics(data) {
        const numbers = data
            .filter(v => typeof v === 'number' && !isNaN(v))
            .sort((a, b) => a - b);
        if (numbers.length === 0) {
            return undefined;
        }
        const mean = ss.mean(numbers);
        const median = ss.median(numbers);
        const mode = ss.mode(numbers);
        const stdDev = ss.standardDeviation(numbers);
        const variance = ss.variance(numbers);
        const min = ss.min(numbers);
        const max = ss.max(numbers);
        const range = max - min;
        const quartiles = ss.quantile(numbers, [0.25, 0.5, 0.75]);
        const q1 = quartiles[0];
        const q2 = quartiles[1];
        const q3 = quartiles[2];
        const outliers = this.detectOutliers(numbers, q1, q3);
        return {
            mean: Number(mean.toFixed(2)),
            median: Number(median.toFixed(2)),
            mode,
            stdDev: Number(stdDev.toFixed(2)),
            variance: Number(variance.toFixed(2)),
            min,
            max,
            range,
            quartiles: {
                q1: Number(q1.toFixed(2)),
                q2: Number(q2.toFixed(2)),
                q3: Number(q3.toFixed(2))
            },
            outliers
        };
    }
    /**
     * Detect outliers using IQR method
     */
    detectOutliers(numbers, q1, q3) {
        if (numbers.length < 4)
            return [];
        const iqr = q3 - q1;
        const lowerBound = q1 - (1.5 * iqr);
        const upperBound = q3 + (1.5 * iqr);
        return numbers.filter(n => n < lowerBound || n > upperBound);
    }
    /**
     * Assess data quality
     */
    assessDataQuality(data) {
        const total = data.length;
        if (total === 0) {
            return {
                completeness: 0,
                uniqueness: 0,
                validity: 0,
                consistency: 0,
                issues: ['No data to analyze']
            };
        }
        const nonEmpty = data.filter(v => v !== null && v !== undefined && v !== '').length;
        const unique = new Set(data.filter(v => v !== null && v !== undefined && v !== '')).size;
        const completeness = (nonEmpty / total) * 100;
        const uniqueness = nonEmpty > 0 ? (unique / nonEmpty) * 100 : 0;
        const issues = [];
        // Completeness check
        if (completeness < 90) {
            const missingPercent = (100 - completeness).toFixed(1);
            issues.push(`${missingPercent}% missing values`);
        }
        // Uniqueness check
        if (uniqueness < 50 && total > 10) {
            issues.push('Low data variety - many duplicate values');
        }
        // Consistency check (for numeric data)
        const numbers = data.filter(v => typeof v === 'number' && !isNaN(v));
        let consistency = 100;
        if (numbers.length > 0) {
            const outliers = this.detectOutliers(numbers.sort((a, b) => a - b), ss.quantile(numbers, 0.25), ss.quantile(numbers, 0.75));
            if (outliers.length > 0) {
                const outlierPercent = (outliers.length / numbers.length) * 100;
                consistency = Math.max(0, 100 - outlierPercent * 5);
                issues.push(`${outliers.length} potential outliers detected`);
            }
        }
        // Validity check
        const validity = issues.length === 0 ? 100 : Math.max(0, 100 - (issues.length * 10));
        return {
            completeness: Number(completeness.toFixed(1)),
            uniqueness: Number(uniqueness.toFixed(1)),
            validity,
            consistency: Number(consistency.toFixed(1)),
            issues
        };
    }
    /**
     * Detect patterns in numeric data
     */
    detectPatterns(data) {
        const numbers = data.filter(v => typeof v === 'number' && !isNaN(v));
        if (numbers.length < 3) {
            return {
                trend: 'stable',
                seasonality: false
            };
        }
        // Calculate trend using linear regression
        const indices = numbers.map((_, i) => i);
        const regression = ss.linearRegression([indices, numbers]);
        const slope = regression.m;
        let trend;
        if (Math.abs(slope) < 0.1) {
            trend = 'stable';
        }
        else if (slope > 0) {
            trend = 'increasing';
        }
        else {
            trend = 'decreasing';
        }
        // Check volatility
        const stdDev = ss.standardDeviation(numbers);
        const mean = ss.mean(numbers);
        const coefficientOfVariation = (stdDev / mean) * 100;
        if (coefficientOfVariation > 50) {
            trend = 'volatile';
        }
        // Simple seasonality detection (check for repeating patterns)
        const seasonality = this.detectSeasonality(numbers);
        // Calculate correlation coefficient manually
        const correlation = this.calculateTrendCorrelation(numbers);
        return {
            trend,
            seasonality,
            correlation: Number(correlation.toFixed(3))
        };
    }
    /**
     * Calculate trend correlation coefficient
     */
    calculateTrendCorrelation(data) {
        const n = data.length;
        const indices = Array.from({ length: n }, (_, i) => i);
        const meanX = indices.reduce((a, b) => a + b, 0) / n;
        const meanY = data.reduce((a, b) => a + b, 0) / n;
        let numerator = 0;
        let denomX = 0;
        let denomY = 0;
        for (let i = 0; i < n; i++) {
            const dx = indices[i] - meanX;
            const dy = data[i] - meanY;
            numerator += dx * dy;
            denomX += dx * dx;
            denomY += dy * dy;
        }
        return numerator / Math.sqrt(denomX * denomY);
    }
    /**
     * Detect seasonality in data
     */
    detectSeasonality(numbers) {
        if (numbers.length < 12)
            return false;
        // Check for repeating patterns every 4, 7, or 12 periods
        const periods = [4, 7, 12];
        for (const period of periods) {
            if (numbers.length < period * 2)
                continue;
            const chunks = lodash_1.default.chunk(numbers, period);
            if (chunks.length < 2)
                continue;
            // Calculate correlation between first and second period
            const firstPeriod = chunks[0];
            const secondPeriod = chunks[1];
            if (firstPeriod.length === secondPeriod.length) {
                const correlation = this.calculateCorrelation(firstPeriod, secondPeriod);
                if (correlation > 0.7) {
                    return true;
                }
            }
        }
        return false;
    }
    /**
     * Calculate correlation between two arrays
     */
    calculateCorrelation(arr1, arr2) {
        if (arr1.length !== arr2.length || arr1.length === 0)
            return 0;
        try {
            return ss.sampleCorrelation(arr1, arr2);
        }
        catch {
            return 0;
        }
    }
    /**
     * Generate suggestions based on data analysis
     */
    generateSuggestions(type, data, quality) {
        const suggestions = {
            chartType: 'column',
            formatting: 'general',
            validation: 'none',
            aggregation: 'sum'
        };
        switch (type) {
            case 'numeric':
                suggestions.chartType = 'line or column chart for trends, scatter for relationships';
                suggestions.formatting = 'number with 2 decimals or currency';
                suggestions.validation = 'number between min and max values';
                suggestions.aggregation = 'sum, average, min, max, count';
                break;
            case 'date':
                suggestions.chartType = 'timeline or line chart for time series';
                suggestions.formatting = 'date format (MM/DD/YYYY or DD-MMM-YYYY)';
                suggestions.validation = 'date within valid range';
                suggestions.aggregation = 'count by period, earliest, latest';
                break;
            case 'text':
                const unique = new Set(data.filter(v => v)).size;
                if (unique < 20) {
                    suggestions.chartType = 'pie or bar chart for categories';
                    suggestions.validation = 'dropdown list of valid values';
                    suggestions.aggregation = 'count, count unique';
                }
                else {
                    suggestions.chartType = 'not recommended for text data';
                    suggestions.validation = 'text length limit (e.g., 255 characters)';
                    suggestions.aggregation = 'count, count unique, concatenate';
                }
                suggestions.formatting = 'text';
                break;
            case 'boolean':
                suggestions.chartType = 'pie chart for yes/no distribution';
                suggestions.formatting = 'checkbox or TRUE/FALSE';
                suggestions.validation = 'boolean (TRUE/FALSE only)';
                suggestions.aggregation = 'count true, count false, percentage';
                break;
            case 'mixed':
                suggestions.chartType = 'clean data first - mixed types detected';
                suggestions.formatting = 'standardize data type';
                suggestions.validation = 'enforce single data type';
                suggestions.aggregation = 'clean data before aggregating';
                break;
        }
        // Adjust based on quality
        if (quality.completeness < 90) {
            suggestions.validation += ' + require non-empty values';
        }
        return suggestions;
    }
    /**
     * Generate formula from natural language
     */
    generateFormula(description) {
        const lower = description.toLowerCase();
        // Sum patterns
        if (lower.match(/\b(sum|total|add)\b/)) {
            return {
                formula: '=SUM(A1:A10)',
                explanation: 'Adds all values in the specified range',
                example: 'SUM(A1:A10) adds values from A1 to A10',
                category: 'math'
            };
        }
        // Average patterns
        if (lower.match(/\b(average|mean|avg)\b/)) {
            return {
                formula: '=AVERAGE(A1:A10)',
                explanation: 'Calculates the arithmetic mean of values',
                example: 'AVERAGE(A1:A10) returns the average of A1 to A10',
                category: 'statistical'
            };
        }
        // Count patterns
        if (lower.match(/\bcount\b/) && !lower.match(/\bif\b/)) {
            return {
                formula: '=COUNT(A1:A10)',
                explanation: 'Counts numeric values in the range',
                example: 'COUNT(A1:A10) counts how many numbers are in A1 to A10',
                category: 'statistical'
            };
        }
        // Count if patterns
        if (lower.match(/\bcount.*if\b/) || lower.match(/\bif.*count\b/)) {
            return {
                formula: '=COUNTIF(A1:A10, ">100")',
                explanation: 'Counts cells that meet a specific condition',
                example: 'COUNTIF(A1:A10, ">100") counts values greater than 100',
                category: 'statistical'
            };
        }
        // Max/Min patterns
        if (lower.match(/\b(maximum|max|largest|highest)\b/)) {
            return {
                formula: '=MAX(A1:A10)',
                explanation: 'Finds the largest value in the range',
                example: 'MAX(A1:A10) returns the highest value',
                category: 'statistical'
            };
        }
        if (lower.match(/\b(minimum|min|smallest|lowest)\b/)) {
            return {
                formula: '=MIN(A1:A10)',
                explanation: 'Finds the smallest value in the range',
                example: 'MIN(A1:A10) returns the lowest value',
                category: 'statistical'
            };
        }
        // If patterns
        if (lower.match(/\bif\b/) && lower.match(/\bthen\b/)) {
            return {
                formula: '=IF(A1>100, "High", "Low")',
                explanation: 'Returns one value if condition is true, another if false',
                example: 'IF(A1>100, "High", "Low") shows "High" if A1 > 100, else "Low"',
                category: 'logical'
            };
        }
        // VLOOKUP patterns
        if (lower.match(/\b(lookup|find|search|match)\b/)) {
            return {
                formula: '=VLOOKUP(A1, B1:C10, 2, FALSE)',
                explanation: 'Searches for a value in the first column and returns a value from another column',
                example: 'VLOOKUP(A1, B1:C10, 2, FALSE) finds A1 in column B and returns the corresponding value from column C',
                category: 'lookup'
            };
        }
        // Percentage patterns
        if (lower.match(/\b(percent|percentage|%)\b/)) {
            return {
                formula: '=(A1/B1)*100',
                explanation: 'Calculates percentage',
                example: '(A1/B1)*100 calculates A1 as a percentage of B1',
                category: 'math'
            };
        }
        // Concatenate patterns
        if (lower.match(/\b(concatenate|combine|join|merge)\b/)) {
            return {
                formula: '=CONCATENATE(A1, " ", B1)',
                explanation: 'Combines text from multiple cells',
                example: 'CONCATENATE(A1, " ", B1) joins A1 and B1 with a space',
                category: 'text'
            };
        }
        // Date patterns
        if (lower.match(/\b(today|current date|now)\b/)) {
            return {
                formula: '=TODAY()',
                explanation: 'Returns the current date',
                example: 'TODAY() shows today\'s date',
                category: 'date'
            };
        }
        // Default
        return {
            formula: '=A1',
            explanation: 'Simple cell reference',
            example: 'A1 refers to the value in cell A1',
            category: 'math'
        };
    }
    /**
     * Suggest formulas based on data analysis
     */
    suggestFormulas(analysis) {
        const suggestions = [];
        if (analysis.type === 'numeric' && analysis.statistics) {
            suggestions.push(this.generateFormula('sum'), this.generateFormula('average'), this.generateFormula('max'), this.generateFormula('min'));
            if (analysis.patterns?.trend === 'increasing' || analysis.patterns?.trend === 'decreasing') {
                suggestions.push({
                    formula: '=FORECAST(x, A1:A10, B1:B10)',
                    explanation: 'Predicts future values based on existing data trend',
                    example: 'FORECAST(11, A1:A10, B1:B10) predicts the value for period 11',
                    category: 'statistical'
                });
            }
        }
        if (analysis.type === 'text') {
            suggestions.push(this.generateFormula('count'), {
                formula: '=COUNTIF(A1:A10, "Specific Value")',
                explanation: 'Counts how many times a specific value appears',
                example: 'COUNTIF(A1:A10, "Complete") counts "Complete" entries',
                category: 'statistical'
            });
        }
        return suggestions;
    }
    /**
     * Suggest macros based on data analysis
     */
    suggestMacros(analysis) {
        const suggestions = [];
        // Always useful macros
        suggestions.push('auto-format', 'export-csv');
        // Based on data quality
        if (analysis.quality.uniqueness < 100) {
            suggestions.push('remove-duplicates', 'highlight-duplicates');
        }
        // Based on data type
        if (analysis.type === 'numeric') {
            suggestions.push('conditional-format', 'create-pivot');
        }
        if (analysis.type === 'text' || analysis.type === 'mixed') {
            suggestions.push('add-validation', 'sort-data');
        }
        // Based on data size
        if (analysis.quality.completeness < 100) {
            suggestions.push('filter-data');
        }
        return suggestions;
    }
    /**
     * Generate automation recommendations
     */
    generateAutomationRecommendations(analysis) {
        const recommendations = [];
        // Data quality issues
        if (analysis.quality.uniqueness < 100) {
            recommendations.push({
                task: 'Remove duplicate entries',
                macro: 'remove-duplicates',
                benefit: 'Clean data and improve accuracy',
                priority: 'high'
            });
        }
        if (analysis.quality.completeness < 90) {
            recommendations.push({
                task: 'Filter out incomplete records',
                macro: 'filter-data',
                benefit: 'Focus on complete data for analysis',
                priority: 'medium'
            });
        }
        // Formatting recommendations
        recommendations.push({
            task: 'Apply professional formatting',
            macro: 'auto-format',
            benefit: 'Improve readability and presentation',
            priority: 'medium'
        });
        // Analysis recommendations
        if (analysis.type === 'numeric' && analysis.statistics) {
            recommendations.push({
                task: 'Create pivot table for analysis',
                macro: 'create-pivot',
                benefit: 'Summarize and analyze data quickly',
                priority: 'high'
            });
            if (analysis.statistics.outliers.length > 0) {
                recommendations.push({
                    task: 'Highlight outliers with conditional formatting',
                    macro: 'conditional-format',
                    benefit: 'Identify unusual values at a glance',
                    priority: 'medium'
                });
            }
        }
        // Data validation
        if (analysis.type === 'text' && analysis.quality.validity < 100) {
            recommendations.push({
                task: 'Add data validation rules',
                macro: 'add-validation',
                benefit: 'Prevent invalid data entry',
                priority: 'high'
            });
        }
        // Export recommendations
        recommendations.push({
            task: 'Export data to CSV',
            macro: 'export-csv',
            benefit: 'Share data with other systems',
            priority: 'low'
        });
        return recommendations.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
    }
}
exports.DataIntelligenceService = DataIntelligenceService;
//# sourceMappingURL=DataIntelligenceService.js.map