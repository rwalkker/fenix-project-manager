"use strict";
// FENIX Project Manager - Authentication Service
// User authentication and authorization
// Created: January 6, 2026
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
/**
 * Authentication Service
 */
class AuthService {
    users = new Map();
    jwtSecret;
    jwtExpiresIn = '24h';
    constructor() {
        this.jwtSecret = process.env.JWT_SECRET || 'fenix-secret-key-change-in-production';
        this.initializeDefaultUsers();
    }
    /**
     * Initialize default users for development
     */
    initializeDefaultUsers() {
        // Admin user with production credentials
        this.createUser('Admin', 'admin@fenix.local', 'PHX6!2026', 'admin');
        // Power user
        this.createUser('poweruser', 'poweruser@fenix.local', 'power123', 'power-user');
        // Regular user
        this.createUser('user', 'user@fenix.local', 'user123', 'user');
        // Viewer
        this.createUser('viewer', 'viewer@fenix.local', 'viewer123', 'viewer');
        console.log('[Auth] Default users initialized (Role-Based Access)');
        console.log('[Auth] Admin: Admin / PHX6!2026 (view all documents)');
        console.log('[Auth] Power-User: poweruser / power123 (create with macros, view team docs)');
        console.log('[Auth] User: user / user123 (create documents, view own)');
        console.log('[Auth] Viewer: viewer / viewer123 (view shared documents only)');
    }
    /**
     * Create a new user
     */
    createUser(username, email, password, role = 'user') {
        const passwordHash = bcryptjs_1.default.hashSync(password, 10);
        const user = {
            id: (0, uuid_1.v4)(),
            username,
            email,
            passwordHash,
            role,
            apiKey: this.generateApiKey(),
            createdAt: new Date(),
        };
        this.users.set(user.id, user);
        return user;
    }
    /**
     * Authenticate user with username and password
     */
    async authenticate(username, password) {
        // Find user by username
        const user = Array.from(this.users.values()).find(u => u.username === username);
        if (!user) {
            return null;
        }
        // Verify password
        const isValid = bcryptjs_1.default.compareSync(password, user.passwordHash);
        if (!isValid) {
            return null;
        }
        // Update last login
        user.lastLogin = new Date();
        // Generate JWT token
        const token = this.generateToken(user);
        return token;
    }
    /**
     * Generate JWT token
     */
    generateToken(user) {
        const payload = {
            userId: user.id,
            username: user.username,
            role: user.role,
        };
        return jsonwebtoken_1.default.sign(payload, this.jwtSecret, {
            expiresIn: this.jwtExpiresIn,
        });
    }
    /**
     * Verify JWT token
     */
    verifyToken(token) {
        try {
            const payload = jsonwebtoken_1.default.verify(token, this.jwtSecret);
            return payload;
        }
        catch (error) {
            return null;
        }
    }
    /**
     * Get user by ID
     */
    getUserById(userId) {
        return this.users.get(userId);
    }
    /**
     * Get user by username
     */
    getUserByUsername(username) {
        return Array.from(this.users.values()).find(u => u.username === username);
    }
    /**
     * Get user by API key
     */
    getUserByApiKey(apiKey) {
        return Array.from(this.users.values()).find(u => u.apiKey === apiKey);
    }
    /**
     * Generate API key
     */
    generateApiKey() {
        return `fenix_${(0, uuid_1.v4)().replace(/-/g, '')}`;
    }
    /**
     * Regenerate API key for user
     */
    regenerateApiKey(userId) {
        const user = this.users.get(userId);
        if (!user) {
            return null;
        }
        user.apiKey = this.generateApiKey();
        return user.apiKey;
    }
    /**
     * Check if user has permission
     */
    hasPermission(role, requiredRole) {
        const roleHierarchy = {
            viewer: 1,
            user: 2,
            'power-user': 3,
            admin: 4,
        };
        return roleHierarchy[role] >= roleHierarchy[requiredRole];
    }
    /**
     * Check if user can create documents
     */
    canCreateDocuments(role) {
        return ['user', 'power-user', 'admin'].includes(role);
    }
    /**
     * Check if user can create macros
     */
    canCreateMacros(role) {
        return ['power-user', 'admin'].includes(role);
    }
    /**
     * Check if user can view all documents
     */
    canViewAllDocuments(role) {
        return role === 'admin';
    }
    /**
     * Check if user can view team documents
     */
    canViewTeamDocuments(role) {
        return ['power-user', 'admin'].includes(role);
    }
    /**
     * Check if user can manage users
     */
    canManageUsers(role) {
        return role === 'admin';
    }
    /**
     * Get all users (admin only)
     */
    getAllUsers() {
        return Array.from(this.users.values()).map(user => ({
            ...user,
            passwordHash: '[REDACTED]',
        }));
    }
    /**
     * Delete user
     */
    deleteUser(userId) {
        return this.users.delete(userId);
    }
    /**
     * Update user role
     */
    updateUserRole(userId, newRole) {
        const user = this.users.get(userId);
        if (!user) {
            return false;
        }
        user.role = newRole;
        return true;
    }
}
exports.AuthService = AuthService;
//# sourceMappingURL=AuthService.js.map