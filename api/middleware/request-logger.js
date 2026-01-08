"use strict";
// FENIX Project Manager - Request Logger Middleware
// Log all incoming requests
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = requestLogger;
/**
 * Request logger middleware
 */
function requestLogger(req, res, next) {
    const start = Date.now();
    // Log request
    console.log(`→ ${req.method} ${req.path}`);
    // Log response when finished
    res.on('finish', () => {
        const duration = Date.now() - start;
        const statusColor = res.statusCode >= 400 ? '\x1b[31m' : '\x1b[32m';
        const reset = '\x1b[0m';
        console.log(`← ${req.method} ${req.path} ${statusColor}${res.statusCode}${reset} ${duration}ms`);
    });
    next();
}
//# sourceMappingURL=request-logger.js.map