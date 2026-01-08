"use strict";
// FENIX Project Manager - Authentication Routes
// Login, logout, user management
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoutes = void 0;
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.authRoutes = router;
const controller = new auth_controller_1.AuthController();
// Public routes
router.post('/login', (req, res) => controller.login(req, res));
router.post('/register', (req, res) => controller.register(req, res));
// Protected routes
router.post('/logout', auth_1.authenticate, (req, res) => controller.logout(req, res));
router.get('/me', auth_1.publicAccess, (req, res) => controller.getCurrentUser(req, res));
router.post('/refresh', auth_1.authenticate, (req, res) => controller.refreshToken(req, res));
router.post('/api-key/regenerate', auth_1.authenticate, (req, res) => controller.regenerateApiKey(req, res));
// Admin routes
router.get('/users', auth_1.authenticate, auth_1.requireAdmin, (req, res) => controller.getAllUsers(req, res));
router.delete('/users/:id', auth_1.authenticate, auth_1.requireAdmin, (req, res) => controller.deleteUser(req, res));
router.put('/users/:id/role', auth_1.authenticate, auth_1.requireAdmin, (req, res) => controller.updateUserRole(req, res));
//# sourceMappingURL=auth.routes.js.map