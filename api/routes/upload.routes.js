"use strict";
// FENIX Project Manager - Upload Routes
// File upload API endpoints
// Created: January 7, 2026
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const upload_controller_1 = require("../controllers/upload.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const uploadController = new upload_controller_1.UploadController();
/**
 * @route POST /api/v1/generate/upload
 * @desc Upload file for AI analysis
 * @access Public (with user role assignment)
 */
router.post('/upload', auth_1.publicAccess, (req, res) => {
    uploadController.uploadFile(req, res);
});
/**
 * @route GET /api/v1/generate/upload/:fileId
 * @desc Get file metadata
 * @access Public (with user role assignment)
 */
router.get('/upload/:fileId', auth_1.publicAccess, (req, res) => {
    uploadController.getFileMetadata(req, res);
});
/**
 * @route GET /api/v1/generate/upload/:fileId/download
 * @desc Download uploaded file
 * @access Public (with user role assignment)
 */
router.get('/upload/:fileId/download', auth_1.publicAccess, (req, res) => {
    uploadController.downloadFile(req, res);
});
/**
 * @route DELETE /api/v1/generate/upload/:fileId
 * @desc Delete uploaded file
 * @access Public (with user role assignment)
 */
router.delete('/upload/:fileId', auth_1.publicAccess, (req, res) => {
    uploadController.deleteFile(req, res);
});
/**
 * @route GET /api/v1/generate/uploads
 * @desc List uploaded files for user
 * @access Public (with user role assignment)
 */
router.get('/uploads', auth_1.publicAccess, (req, res) => {
    uploadController.listFiles(req, res);
});
exports.default = router;
//# sourceMappingURL=upload.routes.js.map