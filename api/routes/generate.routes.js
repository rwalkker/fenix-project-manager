"use strict";
// FENIX Project Manager - Generate Routes
// API routes for document generation with role-based access control
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRoutes = void 0;
const express_1 = require("express");
const generate_controller_1 = require("../controllers/generate.controller");
const upload_controller_1 = require("../controllers/upload.controller");
const validate_request_1 = require("../middleware/validate-request");
const error_handler_1 = require("../middleware/error-handler");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.generateRoutes = router;
const controller = new generate_controller_1.GenerateController();
const uploadController = new upload_controller_1.UploadController();
/**
 * POST /api/v1/generate/powerpoint
 * Generate PowerPoint presentation (public access with user role)
 */
router.post('/powerpoint', auth_1.publicAccess, (0, validate_request_1.validateRequest)({
    title: { type: 'string', required: true, minLength: 1, maxLength: 200 },
    description: { type: 'string', required: false, maxLength: 500 },
    template: { type: 'string', required: false },
    content: { type: 'object', required: false },
    options: { type: 'object', required: false },
}), (0, error_handler_1.asyncHandler)(controller.generatePowerPoint.bind(controller)));
/**
 * POST /api/v1/generate/excel
 * Generate Excel workbook (public access with user role)
 */
router.post('/excel', auth_1.publicAccess, (0, validate_request_1.validateRequest)({
    title: { type: 'string', required: true, minLength: 1, maxLength: 200 },
    description: { type: 'string', required: false, maxLength: 500 },
    template: { type: 'string', required: false },
    data: { type: 'object', required: false },
    options: { type: 'object', required: false },
}), (0, error_handler_1.asyncHandler)(controller.generateExcel.bind(controller)));
/**
 * POST /api/v1/generate/word
 * Generate Word document (public access with user role)
 */
router.post('/word', auth_1.publicAccess, (0, validate_request_1.validateRequest)({
    title: { type: 'string', required: true, minLength: 1, maxLength: 200 },
    description: { type: 'string', required: false, maxLength: 500 },
    template: { type: 'string', required: false },
    content: { type: 'object', required: false },
    options: { type: 'object', required: false },
}), (0, error_handler_1.asyncHandler)(controller.generateWord.bind(controller)));
/**
 * POST /api/v1/generate/process-map
 * Generate Process Map presentation (public access with user role)
 */
router.post('/process-map', auth_1.publicAccess, (0, validate_request_1.validateRequest)({
    title: { type: 'string', required: true, minLength: 1, maxLength: 200 },
    problemStatement: { type: 'string', required: false, maxLength: 500 },
    swimLanes: { type: 'array', required: false },
    steps: { type: 'array', required: false },
    options: { type: 'object', required: false },
}), (0, error_handler_1.asyncHandler)(controller.generateProcessMap.bind(controller)));
/**
 * POST /api/v1/generate/fishbone-diagram
 * Generate Fishbone Diagram presentation (public access with user role)
 */
router.post('/fishbone-diagram', auth_1.publicAccess, (0, validate_request_1.validateRequest)({
    title: { type: 'string', required: true, minLength: 1, maxLength: 200 },
    problemStatement: { type: 'string', required: true, minLength: 1, maxLength: 500 },
    categories: { type: 'array', required: false },
    options: { type: 'object', required: false },
}), (0, error_handler_1.asyncHandler)(controller.generateFishboneDiagram.bind(controller)));
/**
 * POST /api/v1/generate/5-whys
 * Generate 5 Whys Analysis presentation (public access with user role)
 */
router.post('/5-whys', auth_1.publicAccess, (0, validate_request_1.validateRequest)({
    title: { type: 'string', required: true, minLength: 1, maxLength: 200 },
    problemStatement: { type: 'string', required: true, minLength: 1, maxLength: 500 },
    categories: { type: 'array', required: false },
    options: { type: 'object', required: false },
}), (0, error_handler_1.asyncHandler)(controller.generateFiveWhys.bind(controller)));
/**
 * POST /api/v1/generate/workflow
 * Execute multi-document workflow (public access with user role)
 */
router.post('/workflow', auth_1.publicAccess, (0, validate_request_1.validateRequest)({
    name: { type: 'string', required: true, minLength: 1, maxLength: 200 },
    steps: { type: 'array', required: true },
    projectId: { type: 'string', required: false },
}), (0, error_handler_1.asyncHandler)(controller.executeWorkflow.bind(controller)));
/**
 * GET /api/v1/generate/status/:id
 * Get generation status (public access)
 */
router.get('/status/:id', auth_1.publicAccess, (0, error_handler_1.asyncHandler)(controller.getStatus.bind(controller)));
/**
 * GET /api/v1/generate/download/:id
 * Download generated document (public access)
 */
router.get('/download/:id', auth_1.publicAccess, (0, error_handler_1.asyncHandler)(controller.downloadDocument.bind(controller)));
/**
 * GET /api/v1/generate/files/recent
 * List recent files for download (public access)
 */
router.get('/files/recent', auth_1.publicAccess, (0, error_handler_1.asyncHandler)(controller.listRecentFiles.bind(controller)));
/**
 * GET /api/v1/generate/files/download/:filename
 * Download file by filename (public access)
 */
router.get('/files/download/:filename', auth_1.publicAccess, (0, error_handler_1.asyncHandler)(controller.downloadByFilename.bind(controller)));
/**
 * GET /api/v1/generate/list
 * List documents (public access with role-based filtering)
 */
router.get('/list', auth_1.publicAccess, (0, error_handler_1.asyncHandler)(controller.listDocuments.bind(controller)));
/**
 * DELETE /api/v1/generate/:id
 * Delete generated document (admin only)
 */
router.delete('/:id', auth_1.authenticate, (0, auth_1.requireRole)('admin'), (0, error_handler_1.asyncHandler)(controller.deleteDocument.bind(controller)));
/**
 * POST /api/v1/generate/theme-suggestions
 * Get AI-powered theme suggestions for presentation (public access)
 */
router.post('/theme-suggestions', auth_1.publicAccess, (0, validate_request_1.validateRequest)({
    title: { type: 'string', required: false, maxLength: 200 },
    content: { type: 'string', required: false, maxLength: 5000 },
}), (0, error_handler_1.asyncHandler)(controller.getThemeSuggestions.bind(controller)));
/**
 * GET /api/v1/generate/theme-history
 * Get theme usage history (public access)
 */
router.get('/theme-history', auth_1.publicAccess, (0, error_handler_1.asyncHandler)(controller.getThemeHistory.bind(controller)));
/**
 * POST /api/v1/generate/rate-theme
 * Rate a theme (public access)
 */
router.post('/rate-theme', auth_1.publicAccess, (0, validate_request_1.validateRequest)({
    themeId: { type: 'string', required: true, minLength: 1 },
    rating: { type: 'number', required: true, min: 1, max: 5 },
}), (0, error_handler_1.asyncHandler)(controller.rateTheme.bind(controller)));
/**
 * POST /api/v1/generate/upload
 * Upload file for AI analysis (public access)
 */
router.post('/upload', auth_1.publicAccess, (0, error_handler_1.asyncHandler)(uploadController.uploadFile.bind(uploadController)));
/**
 * GET /api/v1/generate/upload/:fileId
 * Get file metadata (public access)
 */
router.get('/upload/:fileId', auth_1.publicAccess, (0, error_handler_1.asyncHandler)(uploadController.getFileMetadata.bind(uploadController)));
/**
 * GET /api/v1/generate/upload/:fileId/download
 * Download uploaded file (public access)
 */
router.get('/upload/:fileId/download', auth_1.publicAccess, (0, error_handler_1.asyncHandler)(uploadController.downloadFile.bind(uploadController)));
/**
 * DELETE /api/v1/generate/upload/:fileId
 * Delete uploaded file (public access)
 */
router.delete('/upload/:fileId', auth_1.publicAccess, (0, error_handler_1.asyncHandler)(uploadController.deleteFile.bind(uploadController)));
/**
 * GET /api/v1/generate/uploads
 * List uploaded files for user (public access)
 */
router.get('/uploads', auth_1.publicAccess, (0, error_handler_1.asyncHandler)(uploadController.listFiles.bind(uploadController)));
//# sourceMappingURL=generate.routes.js.map