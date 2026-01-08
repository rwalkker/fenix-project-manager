"use strict";
// FENIX Project Manager - Error Handler Middleware
// Centralized error handling for API
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.ApiError = void 0;
exports.errorHandler = errorHandler;
exports.asyncHandler = asyncHandler;
/**
 * Custom API Error class
 */
class ApiError extends Error {
    statusCode;
    message;
    details;
    constructor(statusCode, message, details) {
        super(message);
        this.statusCode = statusCode;
        this.message = message;
        this.details = details;
        this.name = 'ApiError';
    }
}
exports.ApiError = ApiError;
/**
 * Error handler middleware
 */
function errorHandler(err, req, res, _next // Required by Express error handler signature
) {
    // Log error
    console.error('Error:', {
        name: err.name,
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
    });
    // Determine status code
    const statusCode = err instanceof ApiError ? err.statusCode : 500;
    // Determine error message
    const message = err.message || 'Internal Server Error';
    // Get details if available
    const details = err instanceof ApiError ? err.details : undefined;
    // Send error response
    res.status(statusCode).json({
        error: err.name || 'Error',
        message,
        details,
        timestamp: new Date().toISOString(),
        path: req.path,
    });
}
/**
 * Async handler wrapper to catch errors in async route handlers
 */
function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}
//# sourceMappingURL=error-handler.js.map