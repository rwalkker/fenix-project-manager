// FENIX Project Manager - Authentication Routes
// Login, logout, user management
// Created: January 6, 2026

import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
import { authenticate, requireAdmin, publicAccess } from '../middleware/auth';

const router = Router();
const controller = new AuthController();

// Public routes
router.post('/login', (req, res) => controller.login(req, res));
router.post('/register', (req, res) => controller.register(req, res));

// Protected routes
router.post('/logout', authenticate, (req, res) => controller.logout(req, res));
router.get('/me', publicAccess, (req, res) => controller.getCurrentUser(req, res));
router.post('/refresh', authenticate, (req, res) => controller.refreshToken(req, res));
router.post('/api-key/regenerate', authenticate, (req, res) => controller.regenerateApiKey(req, res));

// Admin routes
router.get('/users', authenticate, requireAdmin, (req, res) => controller.getAllUsers(req, res));
router.delete('/users/:id', authenticate, requireAdmin, (req, res) => controller.deleteUser(req, res));
router.put('/users/:id/role', authenticate, requireAdmin, (req, res) => controller.updateUserRole(req, res));

export { router as authRoutes };
