// FENIX Project Manager - Workflow Routes
// API routes for workflow management
// Created: January 6, 2026

import { Router } from 'express';
import { WorkflowController } from '../controllers/workflow.controller';
import { asyncHandler } from '../middleware/error-handler';

const router = Router();
const controller = new WorkflowController();

// GET /api/v1/workflows - List workflow templates
router.get('/', asyncHandler(controller.listWorkflows.bind(controller)));

// GET /api/v1/workflows/:id - Get workflow details
router.get('/:id', asyncHandler(controller.getWorkflowDetails.bind(controller)));

export { router as workflowRoutes };
