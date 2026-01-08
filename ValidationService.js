"use strict";
// FENIX Project Manager - Validation Service
// Comprehensive input validation using joi
// Created: January 6, 2026
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ValidationService = void 0;
const joi_1 = __importDefault(require("joi"));
/**
 * Validation Service
 * Provides comprehensive input validation
 */
class ValidationService {
    /**
     * Validate data against schema
     */
    validate(data, schema) {
        const result = schema.validate(data, {
            abortEarly: false,
            stripUnknown: true
        });
        if (result.error) {
            const errors = result.error.details.map(detail => ({
                field: detail.path.join('.'),
                message: detail.message,
                type: detail.type
            }));
            return {
                valid: false,
                errors,
                warnings: []
            };
        }
        return {
            valid: true,
            errors: [],
            warnings: [],
            data: result.value
        };
    }
    /**
     * PowerPoint generation validation schema
     */
    getPowerPointSchema() {
        return joi_1.default.object({
            title: joi_1.default.string().required().min(1).max(200).messages({
                'string.empty': 'Title is required',
                'string.max': 'Title must be less than 200 characters'
            }),
            slides: joi_1.default.array().items(joi_1.default.object({
                title: joi_1.default.string().max(100),
                content: joi_1.default.string().max(5000),
                layout: joi_1.default.string().valid('title', 'content', 'two-column', 'comparison', 'image-focus', 'section-header', 'blank'),
                bullets: joi_1.default.array().items(joi_1.default.string().max(500)),
                images: joi_1.default.array().items(joi_1.default.object({
                    src: joi_1.default.string().required(),
                    altText: joi_1.default.string().required().min(5).messages({
                        'string.min': 'Alt text must be at least 5 characters for accessibility'
                    }),
                    width: joi_1.default.number().positive(),
                    height: joi_1.default.number().positive()
                }))
            })).min(1).messages({
                'array.min': 'At least one slide is required'
            }),
            theme: joi_1.default.string().valid('amazon', 'professional', 'modern', 'minimal').default('amazon'),
            options: joi_1.default.object({
                includePageNumbers: joi_1.default.boolean().default(true),
                includeDate: joi_1.default.boolean().default(false),
                fontSize: joi_1.default.number().min(10).max(72).default(14)
            })
        });
    }
    /**
     * Word document validation schema
     */
    getWordSchema() {
        return joi_1.default.object({
            title: joi_1.default.string().required().min(1).max(200),
            sections: joi_1.default.array().items(joi_1.default.object({
                heading: joi_1.default.string().max(200),
                content: joi_1.default.string().required().max(50000),
                level: joi_1.default.number().min(1).max(6).default(1)
            })).min(1),
            theme: joi_1.default.string().valid('amazon', 'professional', 'modern', 'minimal').default('amazon'),
            options: joi_1.default.object({
                includeTableOfContents: joi_1.default.boolean().default(false),
                includePageNumbers: joi_1.default.boolean().default(true),
                fontSize: joi_1.default.number().min(8).max(72).default(11),
                lineSpacing: joi_1.default.number().min(1).max(3).default(1.5)
            })
        });
    }
    /**
     * Excel workbook validation schema
     */
    getExcelSchema() {
        return joi_1.default.object({
            title: joi_1.default.string().required().min(1).max(200),
            sheets: joi_1.default.array().items(joi_1.default.object({
                name: joi_1.default.string().required().max(31).pattern(/^[^\\\/\?\*\[\]]+$/).messages({
                    'string.pattern.base': 'Sheet name cannot contain: \\ / ? * [ ]'
                }),
                data: joi_1.default.array().items(joi_1.default.array()).min(1),
                headers: joi_1.default.array().items(joi_1.default.string()),
                formatting: joi_1.default.object({
                    headerStyle: joi_1.default.object(),
                    dataStyle: joi_1.default.object(),
                    columnWidths: joi_1.default.array().items(joi_1.default.number().positive())
                })
            })).min(1),
            theme: joi_1.default.string().valid('amazon', 'professional', 'modern', 'minimal').default('amazon')
        });
    }
    /**
     * Design validation schema
     */
    getDesignSchema() {
        return joi_1.default.object({
            colors: joi_1.default.object({
                primary: joi_1.default.string().pattern(/^#[0-9A-Fa-f]{6}$/).required().messages({
                    'string.pattern.base': 'Primary color must be a valid hex color (e.g., #FF9900)'
                }),
                secondary: joi_1.default.string().pattern(/^#[0-9A-Fa-f]{6}$/),
                background: joi_1.default.string().pattern(/^#[0-9A-Fa-f]{6}$/),
                text: joi_1.default.string().pattern(/^#[0-9A-Fa-f]{6}$/)
            }),
            typography: joi_1.default.object({
                fontFamily: joi_1.default.string().required(),
                fontSize: joi_1.default.number().min(8).max(72).required(),
                lineHeight: joi_1.default.number().min(1).max(3)
            }),
            spacing: joi_1.default.object({
                padding: joi_1.default.number().min(0).max(100),
                margin: joi_1.default.number().min(0).max(100)
            })
        });
    }
    /**
     * Validate PowerPoint generation request
     */
    validatePowerPointRequest(data) {
        return this.validate(data, this.getPowerPointSchema());
    }
    /**
     * Validate Word document request
     */
    validateWordRequest(data) {
        return this.validate(data, this.getWordSchema());
    }
    /**
     * Validate Excel workbook request
     */
    validateExcelRequest(data) {
        return this.validate(data, this.getExcelSchema());
    }
    /**
     * Validate design system
     */
    validateDesign(data) {
        return this.validate(data, this.getDesignSchema());
    }
    /**
     * Validate email address
     */
    validateEmail(email) {
        const schema = joi_1.default.string().email();
        const result = schema.validate(email);
        return !result.error;
    }
    /**
     * Validate URL
     */
    validateUrl(url) {
        const schema = joi_1.default.string().uri();
        const result = schema.validate(url);
        return !result.error;
    }
    /**
     * Validate hex color
     */
    validateHexColor(color) {
        const schema = joi_1.default.string().pattern(/^#[0-9A-Fa-f]{6}$/);
        const result = schema.validate(color);
        return !result.error;
    }
    /**
     * Validate date range
     */
    validateDateRange(startDate, endDate) {
        const schema = joi_1.default.object({
            startDate: joi_1.default.date().required(),
            endDate: joi_1.default.date().greater(joi_1.default.ref('startDate')).required().messages({
                'date.greater': 'End date must be after start date'
            })
        });
        return this.validate({ startDate, endDate }, schema);
    }
    /**
     * Validate file size
     */
    validateFileSize(sizeInBytes, maxSizeInMB = 10) {
        const maxBytes = maxSizeInMB * 1024 * 1024;
        if (sizeInBytes > maxBytes) {
            return {
                valid: false,
                errors: [{
                        field: 'fileSize',
                        message: `File size exceeds maximum of ${maxSizeInMB}MB`,
                        type: 'file.size'
                    }],
                warnings: []
            };
        }
        return {
            valid: true,
            errors: [],
            warnings: []
        };
    }
    /**
     * Validate image dimensions
     */
    validateImageDimensions(width, height, maxWidth = 1920, maxHeight = 1080) {
        const errors = [];
        if (width > maxWidth) {
            errors.push({
                field: 'width',
                message: `Image width ${width}px exceeds maximum of ${maxWidth}px`,
                type: 'dimension.width'
            });
        }
        if (height > maxHeight) {
            errors.push({
                field: 'height',
                message: `Image height ${height}px exceeds maximum of ${maxHeight}px`,
                type: 'dimension.height'
            });
        }
        return {
            valid: errors.length === 0,
            errors,
            warnings: []
        };
    }
    /**
     * Create custom validation schema
     */
    createSchema(definition) {
        return joi_1.default.object(definition);
    }
    /**
     * Sanitize string input
     */
    sanitizeString(input) {
        // Remove potentially dangerous characters
        return input
            .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
            .trim();
    }
    /**
     * Validate and sanitize user input
     */
    validateAndSanitize(data, schema) {
        // First validate
        const validationResult = this.validate(data, schema);
        if (!validationResult.valid) {
            return validationResult;
        }
        // Then sanitize string fields
        const sanitized = this.sanitizeObject(validationResult.data);
        return {
            valid: true,
            errors: [],
            warnings: [],
            data: sanitized
        };
    }
    /**
     * Recursively sanitize object
     */
    sanitizeObject(obj) {
        if (typeof obj === 'string') {
            return this.sanitizeString(obj);
        }
        if (Array.isArray(obj)) {
            return obj.map(item => this.sanitizeObject(item));
        }
        if (obj && typeof obj === 'object') {
            const sanitized = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    sanitized[key] = this.sanitizeObject(obj[key]);
                }
            }
            return sanitized;
        }
        return obj;
    }
}
exports.ValidationService = ValidationService;
//# sourceMappingURL=ValidationService.js.map