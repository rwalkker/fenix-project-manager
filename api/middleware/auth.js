"use strict";
// FENIX Project Manager - Authentication Middleware
// JWT and API key authentication
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireViewer = exports.requireUser = exports.requireAdmin = void 0;
exports.initializeAuthService = initializeAuthService;
exports.getAuthService = getAuthService;
exports.authenticate = authenticate;
exports.publicAccess = publicAccess;
exports.requireRole = requireRole;
const AuthService_1 = require("../../services/AuthService");
// Global auth service instance
let authService = null;
/**
 * Initialize auth service
 */
function initializeAuthService() {
    if (!authService) {
        authService = new AuthService_1.AuthService();
    }
    return authService;
}
/**
 * Get auth service instance
 */
function getAuthService() {
    if (!authService) {
        authService = new AuthService_1.AuthService();
    }
    return authService;
}
/**
 * Authentication middleware
 * Checks for JWT token in Authorization header or API key
 */
function authenticate(req, res, next) {
    const auth = getAuthService();
    // Check for JWT token
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const payload = auth.verifyToken(token);
        if (payload) {
            req.user = payload;
            return next();
        }
    }
    // Check for API key
    const apiKey = req.headers['x-api-key'];
    if (apiKey) {
        const user = auth.getUserByApiKey(apiKey);
        if (user) {
            req.user = {
                userId: user.id,
                username: user.username,
                role: user.role,
            };
            return next();
        }
    }
    // No valid authentication
    res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required. Provide a valid JWT token or API key.',
    });
}
/**
 * Public access middleware
 * Auto-assigns "user" role to anonymous visitors, allows admin sign-in
 */
function publicAccess(req, _res, next) {
    const auth = getAuthService();
    // Check for JWT token first
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        const payload = auth.verifyToken(token);
        if (payload) {
            req.user = payload;
            return next();
        }
    }
    // Check for API key
    const apiKey = req.headers['x-api-key'];
    if (apiKey) {
        const user = auth.getUserByApiKey(apiKey);
        if (user) {
            req.user = {
                userId: user.id,
                username: user.username,
                role: user.role,
            };
            return next();
        }
    }
    // No authentication provided - assign public user role
    req.user = {
        userId: 'public-user',
        username: 'Public User',
        role: 'user', // Auto-assign user role for public access
    };
    next();
}
/**
 * Authorization middleware factory
 * Requires specific role or higher
 */
function requireRole(requiredRole) {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Authentication required',
            });
            return;
        }
        const auth = getAuthService();
        if (!auth.hasPermission(req.user.role, requiredRole)) {
            res.status(403).json({
                error: 'Forbidden',
                message: `Requires ${requiredRole} role or higher`,
            });
            return;
        }
        next();
    };
}
/**
 * Admin-only middleware
 */
exports.requireAdmin = requireRole('admin');
/**
 * User-only middleware (user or admin)
 */
exports.requireUser = requireRole('user');
/**
 * Viewer-only middleware (any authenticated user)
 */
exports.requireViewer = requireRole('viewer');
//# sourceMappingURL=auth.js.map