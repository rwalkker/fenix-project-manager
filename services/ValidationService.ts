// FENIX Project Manager - Validation Service
// Comprehensive input validation using joi
// Created: January 6, 2026

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
export class ValidationService {
  /**
   * Validate data against schema
   */
  validate(data: any, schema: Joi.Schema): ValidationResult {
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
  getPowerPointSchema(): Joi.Schema {
    return Joi.object({
      title: Joi.string().required().min(1).max(200).messages({
        'string.empty': 'Title is required',
        'string.max': 'Title must be less than 200 characters'
      }),
      slides: Joi.array().items(
        Joi.object({
          title: Joi.string().max(100),
          content: Joi.string().max(5000),
          layout: Joi.string().valid('title', 'content', 'two-column', 'comparison', 'image-focus', 'section-header', 'blank'),
          bullets: Joi.array().items(Joi.string().max(500)),
          images: Joi.array().items(
            Joi.object({
              src: Joi.string().required(),
              altText: Joi.string().required().min(5).messages({
                'string.min': 'Alt text must be at least 5 characters for accessibility'
              }),
              width: Joi.number().positive(),
              height: Joi.number().positive()
            })
          )
        })
      ).min(1).messages({
        'array.min': 'At least one slide is required'
      }),
      theme: Joi.string().valid('amazon', 'professional', 'modern', 'minimal').default('amazon'),
      options: Joi.object({
        includePageNumbers: Joi.boolean().default(true),
        includeDate: Joi.boolean().default(false),
        fontSize: Joi.number().min(10).max(72).default(14)
      })
    });
  }

  /**
   * Word document validation schema
   */
  getWordSchema(): Joi.Schema {
    return Joi.object({
      title: Joi.string().required().min(1).max(200),
      sections: Joi.array().items(
        Joi.object({
          heading: Joi.string().max(200),
          content: Joi.string().required().max(50000),
          level: Joi.number().min(1).max(6).default(1)
        })
      ).min(1),
      theme: Joi.string().valid('amazon', 'professional', 'modern', 'minimal').default('amazon'),
      options: Joi.object({
        includeTableOfContents: Joi.boolean().default(false),
        includePageNumbers: Joi.boolean().default(true),
        fontSize: Joi.number().min(8).max(72).default(11),
        lineSpacing: Joi.number().min(1).max(3).default(1.5)
      })
    });
  }

  /**
   * Excel workbook validation schema
   */
  getExcelSchema(): Joi.Schema {
    return Joi.object({
      title: Joi.string().required().min(1).max(200),
      sheets: Joi.array().items(
        Joi.object({
          name: Joi.string().required().max(31).pattern(/^[^\\\/\?\*\[\]]+$/).messages({
            'string.pattern.base': 'Sheet name cannot contain: \\ / ? * [ ]'
          }),
          data: Joi.array().items(Joi.array()).min(1),
          headers: Joi.array().items(Joi.string()),
          formatting: Joi.object({
            headerStyle: Joi.object(),
            dataStyle: Joi.object(),
            columnWidths: Joi.array().items(Joi.number().positive())
          })
        })
      ).min(1),
      theme: Joi.string().valid('amazon', 'professional', 'modern', 'minimal').default('amazon')
    });
  }

  /**
   * Design validation schema
   */
  getDesignSchema(): Joi.Schema {
    return Joi.object({
      colors: Joi.object({
        primary: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).required().messages({
          'string.pattern.base': 'Primary color must be a valid hex color (e.g., #FF9900)'
        }),
        secondary: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
        background: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/),
        text: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/)
      }),
      typography: Joi.object({
        fontFamily: Joi.string().required(),
        fontSize: Joi.number().min(8).max(72).required(),
        lineHeight: Joi.number().min(1).max(3)
      }),
      spacing: Joi.object({
        padding: Joi.number().min(0).max(100),
        margin: Joi.number().min(0).max(100)
      })
    });
  }

  /**
   * Validate PowerPoint generation request
   */
  validatePowerPointRequest(data: any): ValidationResult {
    return this.validate(data, this.getPowerPointSchema());
  }

  /**
   * Validate Word document request
   */
  validateWordRequest(data: any): ValidationResult {
    return this.validate(data, this.getWordSchema());
  }

  /**
   * Validate Excel workbook request
   */
  validateExcelRequest(data: any): ValidationResult {
    return this.validate(data, this.getExcelSchema());
  }

  /**
   * Validate design system
   */
  validateDesign(data: any): ValidationResult {
    return this.validate(data, this.getDesignSchema());
  }

  /**
   * Validate email address
   */
  validateEmail(email: string): boolean {
    const schema = Joi.string().email();
    const result = schema.validate(email);
    return !result.error;
  }

  /**
   * Validate URL
   */
  validateUrl(url: string): boolean {
    const schema = Joi.string().uri();
    const result = schema.validate(url);
    return !result.error;
  }

  /**
   * Validate hex color
   */
  validateHexColor(color: string): boolean {
    const schema = Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/);
    const result = schema.validate(color);
    return !result.error;
  }

  /**
   * Validate date range
   */
  validateDateRange(startDate: Date, endDate: Date): ValidationResult {
    const schema = Joi.object({
      startDate: Joi.date().required(),
      endDate: Joi.date().greater(Joi.ref('startDate')).required().messages({
        'date.greater': 'End date must be after start date'
      })
    });

    return this.validate({ startDate, endDate }, schema);
  }

  /**
   * Validate file size
   */
  validateFileSize(sizeInBytes: number, maxSizeInMB: number = 10): ValidationResult {
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
  validateImageDimensions(
    width: number,
    height: number,
    maxWidth: number = 1920,
    maxHeight: number = 1080
  ): ValidationResult {
    const errors: ValidationResult['errors'] = [];

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
  createSchema(definition: ValidationSchema): Joi.Schema {
    return Joi.object(definition);
  }

  /**
   * Sanitize string input
   */
  sanitizeString(input: string): string {
    // Remove potentially dangerous characters
    return input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .trim();
  }

  /**
   * Validate and sanitize user input
   */
  validateAndSanitize(data: any, schema: Joi.Schema): ValidationResult {
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
  private sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
      return this.sanitizeString(obj);
    }

    if (Array.isArray(obj)) {
      return obj.map(item => this.sanitizeObject(item));
    }

    if (obj && typeof obj === 'object') {
      const sanitized: any = {};
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

