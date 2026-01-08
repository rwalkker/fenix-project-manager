// FENIX Project Manager - Project Routes
// API routes for project management
// Created: January 6, 2026

import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller';
import { asyncHandler } from '../middleware/error-handler';

const router = Router();
const controller = new ProjectController();

// GET /api/v1/projects - List projects
router.get('/', asyncHandler(controller.listProjects.bind(controller)));

// GET /api/v1/projects/:id - Get project details
router.get('/:id', asyncHandler(controller.getProjectDetails.bind(controller)));

// GET /api/v1/projects/:id/documents - Get project documents
router.get('/:id/documents', asyncHandler(controller.getProjectDocuments.bind(controller)));

export { router as projectRoutes };
