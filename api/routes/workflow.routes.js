"use strict";
// FENIX Project Manager - Workflow Routes
// API routes for workflow management
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.workflowRoutes = void 0;
const express_1 = require("express");
const workflow_controller_1 = require("../controllers/workflow.controller");
const error_handler_1 = require("../middleware/error-handler");
const router = (0, express_1.Router)();
exports.workflowRoutes = router;
const controller = new workflow_controller_1.WorkflowController();
// GET /api/v1/workflows - List workflow templates
router.get('/', (0, error_handler_1.asyncHandler)(controller.listWorkflows.bind(controller)));
// GET /api/v1/workflows/:id - Get workflow details
router.get('/:id', (0, error_handler_1.asyncHandler)(controller.getWorkflowDetails.bind(controller)));
//# sourceMappingURL=workflow.routes.js.map