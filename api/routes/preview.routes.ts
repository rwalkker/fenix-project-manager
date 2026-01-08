// FENIX Project Manager - Preview Routes
// Document preview endpoints
// Created: January 6, 2026

import { Router } from 'express';
import { PreviewController } from '../controllers/preview.controller';
import { authenticate } from '../middleware/auth';

const router = Router();
const controller = new PreviewController();

// All preview routes require authentication
router.use(authenticate);

// Preview routes
router.get('/:id', (req, res) => controller.getPreview(req, res));
router.get('/:id/metadata', (req, res) => controller.getMetadata(req, res));
router.get('/:id/thumbnail', (req, res) => controller.getThumbnail(req, res));

export { router as previewRoutes };
