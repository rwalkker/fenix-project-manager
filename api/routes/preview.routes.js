"use strict";
// FENIX Project Manager - Preview Routes
// Document preview endpoints
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.previewRoutes = void 0;
const express_1 = require("express");
const preview_controller_1 = require("../controllers/preview.controller");
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
exports.previewRoutes = router;
const controller = new preview_controller_1.PreviewController();
// All preview routes require authentication
router.use(auth_1.authenticate);
// Preview routes
router.get('/:id', (req, res) => controller.getPreview(req, res));
router.get('/:id/metadata', (req, res) => controller.getMetadata(req, res));
router.get('/:id/thumbnail', (req, res) => controller.getThumbnail(req, res));
//# sourceMappingURL=preview.routes.js.map