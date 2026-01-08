// FENIX Project Manager - Upload Routes
// File upload API endpoints
// Created: January 7, 2026

import { Router } from 'express';
import { UploadController } from '../controllers/upload.controller';
import { publicAccess } from '../middleware/auth';

const router = Router();
const uploadController = new UploadController();

/**
 * @route POST /api/v1/generate/upload
 * @desc Upload file for AI analysis
 * @access Public (with user role assignment)
 */
router.post('/upload', publicAccess, (req, res) => {
  uploadController.uploadFile(req, res);
});

/**
 * @route GET /api/v1/generate/upload/:fileId
 * @desc Get file metadata
 * @access Public (with user role assignment)
 */
router.get('/upload/:fileId', publicAccess, (req, res) => {
  uploadController.getFileMetadata(req, res);
});

/**
 * @route GET /api/v1/generate/upload/:fileId/download
 * @desc Download uploaded file
 * @access Public (with user role assignment)
 */
router.get('/upload/:fileId/download', publicAccess, (req, res) => {
  uploadController.downloadFile(req, res);
});

/**
 * @route DELETE /api/v1/generate/upload/:fileId
 * @desc Delete uploaded file
 * @access Public (with user role assignment)
 */
router.delete('/upload/:fileId', publicAccess, (req, res) => {
  uploadController.deleteFile(req, res);
});

/**
 * @route GET /api/v1/generate/uploads
 * @desc List uploaded files for user
 * @access Public (with user role assignment)
 */
router.get('/uploads', publicAccess, (req, res) => {
  uploadController.listFiles(req, res);
});

export default router;