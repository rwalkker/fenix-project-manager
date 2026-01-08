"use strict";
// FENIX Project Manager - Project Routes
// API routes for project management
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRoutes = void 0;
const express_1 = require("express");
const project_controller_1 = require("../controllers/project.controller");
const error_handler_1 = require("../middleware/error-handler");
const router = (0, express_1.Router)();
exports.projectRoutes = router;
const controller = new project_controller_1.ProjectController();
// GET /api/v1/projects - List projects
router.get('/', (0, error_handler_1.asyncHandler)(controller.listProjects.bind(controller)));
// GET /api/v1/projects/:id - Get project details
router.get('/:id', (0, error_handler_1.asyncHandler)(controller.getProjectDetails.bind(controller)));
// GET /api/v1/projects/:id/documents - Get project documents
router.get('/:id/documents', (0, error_handler_1.asyncHandler)(controller.getProjectDocuments.bind(controller)));
//# sourceMappingURL=project.routes.js.map