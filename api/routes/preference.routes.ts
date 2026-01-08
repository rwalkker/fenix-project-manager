// FENIX Project Manager - Preference Routes
// API routes for user preferences
// Created: January 6, 2026

import { Router } from 'express';
import { PreferenceController } from '../controllers/preference.controller';
import { asyncHandler } from '../middleware/error-handler';

const router = Router();
const controller = new PreferenceController();

// GET /api/v1/preferences - Get user preferences
router.get('/', asyncHandler(controller.getPreferences.bind(controller)));

// PUT /api/v1/preferences - Update preferences
router.put('/', asyncHandler(controller.updatePreferences.bind(controller)));

// GET /api/v1/preferences/defaults - Get smart defaults
router.get('/defaults', asyncHandler(controller.getSmartDefaults.bind(controller)));

export { router as preferenceRoutes };
