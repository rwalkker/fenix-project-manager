"use strict";
// FENIX Project Manager - Authentication Controller
// Business logic for authentication
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_1 = require("../middleware/auth");
/**
 * Authentication Controller
 */
class AuthController {
    /**
     * Login user
     */
    async login(req, res) {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({
                error: 'Bad Request',
                message: 'Username and password are required',
            });
            return;
        }
        const auth = (0, auth_1.getAuthService)();
        const token = await auth.authenticate(username, password);
        if (!token) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Invalid username or password',
            });
            return;
        }
        const user = auth.getUserByUsername(username);
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                apiKey: user.apiKey,
            },
        });
    }
    /**
     * Register new user
     */
    async register(req, res) {
        const { username, email, password, role } = req.body;
        if (!username || !email || !password) {
            res.status(400).json({
                error: 'Bad Request',
                message: 'Username, email, and password are required',
            });
            return;
        }
        const auth = (0, auth_1.getAuthService)();
        // Check if username already exists
        if (auth.getUserByUsername(username)) {
            res.status(409).json({
                error: 'Conflict',
                message: 'Username already exists',
            });
            return;
        }
        // Create user (default role is 'user')
        const userRole = role || 'user';
        const user = auth.createUser(username, email, password, userRole);
        // Generate token
        const token = await auth.authenticate(username, password);
        res.status(201).json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role,
                apiKey: user.apiKey,
            },
        });
    }
    /**
     * Logout user
     */
    async logout(_req, res) {
        // In a stateless JWT system, logout is handled client-side
        // by removing the token. We just return success.
        res.json({
            message: 'Logged out successfully',
        });
    }
    /**
     * Get current user
     */
    async getCurrentUser(req, res) {
        if (!req.user) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Not authenticated',
            });
            return;
        }
        const auth = (0, auth_1.getAuthService)();
        const user = auth.getUserById(req.user.userId);
        if (!user) {
            res.status(404).json({
                error: 'Not Found',
                message: 'User not found',
            });
            return;
        }
        res.json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            apiKey: user.apiKey,
            createdAt: user.createdAt,
            lastLogin: user.lastLogin,
        });
    }
    /**
     * Refresh token
     */
    async refreshToken(req, res) {
        if (!req.user) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Not authenticated',
            });
            return;
        }
        const auth = (0, auth_1.getAuthService)();
        const user = auth.getUserById(req.user.userId);
        if (!user) {
            res.status(404).json({
                error: 'Not Found',
                message: 'User not found',
            });
            return;
        }
        // Generate new token
        const token = await auth.authenticate(user.username, ''); // Password not needed for refresh
        res.json({
            token,
        });
    }
    /**
     * Regenerate API key
     */
    async regenerateApiKey(req, res) {
        if (!req.user) {
            res.status(401).json({
                error: 'Unauthorized',
                message: 'Not authenticated',
            });
            return;
        }
        const auth = (0, auth_1.getAuthService)();
        const apiKey = auth.regenerateApiKey(req.user.userId);
        if (!apiKey) {
            res.status(404).json({
                error: 'Not Found',
                message: 'User not found',
            });
            return;
        }
        res.json({
            apiKey,
        });
    }
    /**
     * Get all users (admin only)
     */
    async getAllUsers(_req, res) {
        const auth = (0, auth_1.getAuthService)();
        const users = auth.getAllUsers();
        res.json({
            users,
            total: users.length,
        });
    }
    /**
     * Delete user (admin only)
     */
    async deleteUser(req, res) {
        const { id } = req.params;
        const auth = (0, auth_1.getAuthService)();
        const success = auth.deleteUser(id);
        if (!success) {
            res.status(404).json({
                error: 'Not Found',
                message: 'User not found',
            });
            return;
        }
        res.json({
            message: 'User deleted successfully',
        });
    }
    /**
     * Update user role (admin only)
     */
    async updateUserRole(req, res) {
        const { id } = req.params;
        const { role } = req.body;
        if (!role || !['admin', 'user', 'viewer'].includes(role)) {
            res.status(400).json({
                error: 'Bad Request',
                message: 'Valid role is required (admin, user, or viewer)',
            });
            return;
        }
        const auth = (0, auth_1.getAuthService)();
        const success = auth.updateUserRole(id, role);
        if (!success) {
            res.status(404).json({
                error: 'Not Found',
                message: 'User not found',
            });
            return;
        }
        res.json({
            message: 'User role updated successfully',
        });
    }
}
exports.AuthController = AuthController;
//# sourceMappingURL=auth.controller.js.map