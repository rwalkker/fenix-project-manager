"use strict";
// FENIX Project Manager - Preference Routes
// API routes for user preferences
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.preferenceRoutes = void 0;
const express_1 = require("express");
const preference_controller_1 = require("../controllers/preference.controller");
const error_handler_1 = require("../middleware/error-handler");
const router = (0, express_1.Router)();
exports.preferenceRoutes = router;
const controller = new preference_controller_1.PreferenceController();
// GET /api/v1/preferences - Get user preferences
router.get('/', (0, error_handler_1.asyncHandler)(controller.getPreferences.bind(controller)));
// PUT /api/v1/preferences - Update preferences
router.put('/', (0, error_handler_1.asyncHandler)(controller.updatePreferences.bind(controller)));
// GET /api/v1/preferences/defaults - Get smart defaults
router.get('/defaults', (0, error_handler_1.asyncHandler)(controller.getSmartDefaults.bind(controller)));
//# sourceMappingURL=preference.routes.js.map