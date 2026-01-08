"use strict";
// FENIX Project Manager - Request Validation Middleware
// Validate request bodies against schemas
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateRequest = validateRequest;
const error_handler_1 = require("./error-handler");
/**
 * Validate request body against schema
 */
function validateRequest(schema) {
    return (req, _res, next) => {
        const errors = [];
        // Check each field in schema
        for (const [field, rules] of Object.entries(schema)) {
            const value = req.body[field];
            // Check required
            if (rules.required && (value === undefined || value === null)) {
                errors.push(`Field '${field}' is required`);
                continue;
            }
            // Skip validation if field is not required and not provided
            if (!rules.required && (value === undefined || value === null)) {
                continue;
            }
            // Check type
            const actualType = Array.isArray(value) ? 'array' : typeof value;
            if (actualType !== rules.type) {
                errors.push(`Field '${field}' must be of type ${rules.type}`);
                continue;
            }
            // String validations
            if (rules.type === 'string') {
                if (rules.minLength && value.length < rules.minLength) {
                    errors.push(`Field '${field}' must be at least ${rules.minLength} characters`);
                }
                if (rules.maxLength && value.length > rules.maxLength) {
                    errors.push(`Field '${field}' must be at most ${rules.maxLength} characters`);
                }
                if (rules.pattern && !rules.pattern.test(value)) {
                    errors.push(`Field '${field}' has invalid format`);
                }
            }
            // Number validations
            if (rules.type === 'number') {
                if (rules.min !== undefined && value < rules.min) {
                    errors.push(`Field '${field}' must be at least ${rules.min}`);
                }
                if (rules.max !== undefined && value > rules.max) {
                    errors.push(`Field '${field}' must be at most ${rules.max}`);
                }
            }
            // Enum validation
            if (rules.enum && !rules.enum.includes(value)) {
                errors.push(`Field '${field}' must be one of: ${rules.enum.join(', ')}`);
            }
        }
        // If there are errors, throw validation error
        if (errors.length > 0) {
            throw new error_handler_1.ApiError(400, 'Validation failed', errors);
        }
        next();
    };
}
//# sourceMappingURL=validate-request.js.map