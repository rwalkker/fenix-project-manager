// FENIX Project Manager - Template Routes
// API routes for template management
// Created: January 6, 2026

import { Router } from 'express';
import { TemplateController } from '../controllers/template.controller';
import { asyncHandler } from '../middleware/error-handler';

const router = Router();
const controller = new TemplateController();

// GET /api/v1/templates - List all templates
router.get('/', asyncHandler(controller.listTemplates.bind(controller)));

// GET /api/v1/templates/:type - List templates by type
router.get('/:type', asyncHandler(controller.getTemplatesByType.bind(controller)));

// GET /api/v1/templates/detail/:id - Get template details
router.get('/detail/:id', asyncHandler(controller.getTemplateDetails.bind(controller)));

export { router as templateRoutes };
