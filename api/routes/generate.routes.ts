// FENIX Project Manager - Generate Routes
// API routes for document generation with role-based access control
// Created: January 6, 2026

import { Router } from 'express';
import { GenerateController } from '../controllers/generate.controller';
import { UploadController } from '../controllers/upload.controller';
import { validateRequest } from '../middleware/validate-request';
import { asyncHandler } from '../middleware/error-handler';
import { authenticate, requireRole, publicAccess } from '../middleware/auth';

const router = Router();
const controller = new GenerateController();
const uploadController = new UploadController();

/**
 * POST /api/v1/generate/powerpoint
 * Generate PowerPoint presentation (public access with user role)
 */
router.post(
  '/powerpoint',
  publicAccess,
  validateRequest({
    title: { type: 'string', required: true, minLength: 1, maxLength: 200 },
    description: { type: 'string', required: false, maxLength: 500 },
    template: { type: 'string', required: false },
    content: { type: 'object', required: false },
    options: { type: 'object', required: false },
  }),
  asyncHandler(controller.generatePowerPoint.bind(controller))
);

/**
 * POST /api/v1/generate/excel
 * Generate Excel workbook (public access with user role)
 */
router.post(
  '/excel',
  publicAccess,
  validateRequest({
    title: { type: 'string', required: true, minLength: 1, maxLength: 200 },
    description: { type: 'string', required: false, maxLength: 500 },
    template: { type: 'string', required: false },
    data: { type: 'object', required: false },
    options: { type: 'object', required: false },
  }),
  asyncHandler(controller.generateExcel.bind(controller))
);

/**
 * POST /api/v1/generate/word
 * Generate Word document (public access with user role)
 */
router.post(
  '/word',
  publicAccess,
  validateRequest({
    title: { type: 'string', required: true, minLength: 1, maxLength: 200 },
    description: { type: 'string', required: false, maxLength: 500 },
    template: { type: 'string', required: false },
    content: { type: 'object', required: false },
    options: { type: 'object', required: false },
  }),
  asyncHandler(controller.generateWord.bind(controller))
);

/**
 * POST /api/v1/generate/process-map
 * Generate Process Map presentation (public access with user role)
 */
router.post(
  '/process-map',
  publicAccess,
  validateRequest({
    title: { type: 'string', required: true, minLength: 1, maxLength: 200 },
    problemStatement: { type: 'string', required: false, maxLength: 500 },
    swimLanes: { type: 'array', required: false },
    steps: { type: 'array', required: false },
    options: { type: 'object', required: false },
  }),
  asyncHandler(controller.generateProcessMap.bind(controller))
);

/**
 * POST /api/v1/generate/fishbone-diagram
 * Generate Fishbone Diagram presentation (public access with user role)
 */
router.post(
  '/fishbone-diagram',
  publicAccess,
  validateRequest({
    title: { type: 'string', required: true, minLength: 1, maxLength: 200 },
    problemStatement: { type: 'string', required: true, minLength: 1, maxLength: 500 },
    categories: { type: 'array', required: false },
    options: { type: 'object', required: false },
  }),
  asyncHandler(controller.generateFishboneDiagram.bind(controller))
);

/**
 * POST /api/v1/generate/5-whys
 * Generate 5 Whys Analysis presentation (public access with user role)
 */
router.post(
  '/5-whys',
  publicAccess,
  validateRequest({
    title: { type: 'string', required: true, minLength: 1, maxLength: 200 },
    problemStatement: { type: 'string', required: true, minLength: 1, maxLength: 500 },
    categories: { type: 'array', required: false },
    options: { type: 'object', required: false },
  }),
  asyncHandler(controller.generateFiveWhys.bind(controller))
);

/**
 * POST /api/v1/generate/workflow
 * Execute multi-document workflow (public access with user role)
 */
router.post(
  '/workflow',
  publicAccess,
  validateRequest({
    name: { type: 'string', required: true, minLength: 1, maxLength: 200 },
    steps: { type: 'array', required: true },
    projectId: { type: 'string', required: false },
  }),
  asyncHandler(controller.executeWorkflow.bind(controller))
);

/**
 * GET /api/v1/generate/status/:id
 * Get generation status (public access)
 */
router.get(
  '/status/:id',
  publicAccess,
  asyncHandler(controller.getStatus.bind(controller))
);

/**
 * GET /api/v1/generate/download/:id
 * Download generated document (public access)
 */
router.get(
  '/download/:id',
  publicAccess,
  asyncHandler(controller.downloadDocument.bind(controller))
);

/**
 * GET /api/v1/generate/files/recent
 * List recent files for download (public access)
 */
router.get(
  '/files/recent',
  publicAccess,
  asyncHandler(controller.listRecentFiles.bind(controller))
);

/**
 * GET /api/v1/generate/files/download/:filename
 * Download file by filename (public access)
 */
router.get(
  '/files/download/:filename',
  publicAccess,
  asyncHandler(controller.downloadByFilename.bind(controller))
);

/**
 * GET /api/v1/generate/list
 * List documents (public access with role-based filtering)
 */
router.get(
  '/list',
  publicAccess,
  asyncHandler(controller.listDocuments.bind(controller))
);

/**
 * DELETE /api/v1/generate/:id
 * Delete generated document (admin only)
 */
router.delete(
  '/:id',
  authenticate,
  requireRole('admin'),
  asyncHandler(controller.deleteDocument.bind(controller))
);

/**
 * POST /api/v1/generate/theme-suggestions
 * Get AI-powered theme suggestions for presentation (public access)
 */
router.post(
  '/theme-suggestions',
  publicAccess,
  validateRequest({
    title: { type: 'string', required: false, maxLength: 200 },
    content: { type: 'string', required: false, maxLength: 5000 },
  }),
  asyncHandler(controller.getThemeSuggestions.bind(controller))
);

/**
 * GET /api/v1/generate/theme-history
 * Get theme usage history (public access)
 */
router.get(
  '/theme-history',
  publicAccess,
  asyncHandler(controller.getThemeHistory.bind(controller))
);

/**
 * POST /api/v1/generate/rate-theme
 * Rate a theme (public access)
 */
router.post(
  '/rate-theme',
  publicAccess,
  validateRequest({
    themeId: { type: 'string', required: true, minLength: 1 },
    rating: { type: 'number', required: true, min: 1, max: 5 },
  }),
  asyncHandler(controller.rateTheme.bind(controller))
);

/**
 * POST /api/v1/generate/upload
 * Upload file for AI analysis (public access)
 */
router.post(
  '/upload',
  publicAccess,
  asyncHandler(uploadController.uploadFile.bind(uploadController))
);

/**
 * GET /api/v1/generate/upload/:fileId
 * Get file metadata (public access)
 */
router.get(
  '/upload/:fileId',
  publicAccess,
  asyncHandler(uploadController.getFileMetadata.bind(uploadController))
);

/**
 * GET /api/v1/generate/upload/:fileId/download
 * Download uploaded file (public access)
 */
router.get(
  '/upload/:fileId/download',
  publicAccess,
  asyncHandler(uploadController.downloadFile.bind(uploadController))
);

/**
 * DELETE /api/v1/generate/upload/:fileId
 * Delete uploaded file (public access)
 */
router.delete(
  '/upload/:fileId',
  publicAccess,
  asyncHandler(uploadController.deleteFile.bind(uploadController))
);

/**
 * GET /api/v1/generate/uploads
 * List uploaded files for user (public access)
 */
router.get(
  '/uploads',
  publicAccess,
  asyncHandler(uploadController.listFiles.bind(uploadController))
);

export { router as generateRoutes };
