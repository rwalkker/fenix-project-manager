import Joi from 'joi';
export interface ValidationResult {
    valid: boolean;
    errors: Array<{
        field: string;
        message: string;
        type: string;
    }>;
    warnings: Array<{
        field: string;
        message: string;
    }>;
    data?: any;
}
export interface ValidationSchema {
    [key: string]: Joi.Schema;
}
/**
 * Validation Service
 * Provides comprehensive input validation
 */
export declare class ValidationService {
    /**
     * Validate data against schema
     */
    validate(data: any, schema: Joi.Schema): ValidationResult;
    /**
     * PowerPoint generation validation schema
     */
    getPowerPointSchema(): Joi.Schema;
    /**
     * Word document validation schema
     */
    getWordSchema(): Joi.Schema;
    /**
     * Excel workbook validation schema
     */
    getExcelSchema(): Joi.Schema;
    /**
     * Design validation schema
     */
    getDesignSchema(): Joi.Schema;
    /**
     * Validate PowerPoint generation request
     */
    validatePowerPointRequest(data: any): ValidationResult;
    /**
     * Validate Word document request
     */
    validateWordRequest(data: any): ValidationResult;
    /**
     * Validate Excel workbook request
     */
    validateExcelRequest(data: any): ValidationResult;
    /**
     * Validate design system
     */
    validateDesign(data: any): ValidationResult;
    /**
     * Validate email address
     */
    validateEmail(email: string): boolean;
    /**
     * Validate URL
     */
    validateUrl(url: string): boolean;
    /**
     * Validate hex color
     */
    validateHexColor(color: string): boolean;
    /**
     * Validate date range
     */
    validateDateRange(startDate: Date, endDate: Date): ValidationResult;
    /**
     * Validate file size
     */
    validateFileSize(sizeInBytes: number, maxSizeInMB?: number): ValidationResult;
    /**
     * Validate image dimensions
     */
    validateImageDimensions(width: number, height: number, maxWidth?: number, maxHeight?: number): ValidationResult;
    /**
     * Create custom validation schema
     */
    createSchema(definition: ValidationSchema): Joi.Schema;
    /**
     * Sanitize string input
     */
    sanitizeString(input: string): string;
    /**
     * Validate and sanitize user input
     */
    validateAndSanitize(data: any, schema: Joi.Schema): ValidationResult;
    /**
     * Recursively sanitize object
     */
    private sanitizeObject;
}
//# sourceMappingURL=ValidationService.d.ts.map