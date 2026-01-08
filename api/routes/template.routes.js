"use strict";
// FENIX Project Manager - Template Routes
// API routes for template management
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.templateRoutes = void 0;
const express_1 = require("express");
const template_controller_1 = require("../controllers/template.controller");
const error_handler_1 = require("../middleware/error-handler");
const router = (0, express_1.Router)();
exports.templateRoutes = router;
const controller = new template_controller_1.TemplateController();
// GET /api/v1/templates - List all templates
router.get('/', (0, error_handler_1.asyncHandler)(controller.listTemplates.bind(controller)));
// GET /api/v1/templates/:type - List templates by type
router.get('/:type', (0, error_handler_1.asyncHandler)(controller.getTemplatesByType.bind(controller)));
// GET /api/v1/templates/detail/:id - Get template details
router.get('/detail/:id', (0, error_handler_1.asyncHandler)(controller.getTemplateDetails.bind(controller)));
//# sourceMappingURL=template.routes.js.map