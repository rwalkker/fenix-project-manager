"use strict";
// FENIX Project Manager - AI Routes
// API routes for AI services
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.aiRoutes = void 0;
const express_1 = require("express");
const ai_controller_1 = require("../controllers/ai.controller");
const validate_request_1 = require("../middleware/validate-request");
const error_handler_1 = require("../middleware/error-handler");
const router = (0, express_1.Router)();
exports.aiRoutes = router;
const controller = new ai_controller_1.AIController();
// POST /api/v1/ai/summarize - Summarize document
router.post('/summarize', (0, validate_request_1.validateRequest)({
    content: { type: 'string', required: true, minLength: 10 },
    options: { type: 'object', required: false },
}), (0, error_handler_1.asyncHandler)(controller.summarize.bind(controller)));
// POST /api/v1/ai/extract-points - Extract key points
router.post('/extract-points', (0, validate_request_1.validateRequest)({
    content: { type: 'string', required: true, minLength: 10 },
    maxPoints: { type: 'number', required: false },
}), (0, error_handler_1.asyncHandler)(controller.extractPoints.bind(controller)));
// POST /api/v1/ai/analyze-sentiment - Analyze sentiment
router.post('/analyze-sentiment', (0, validate_request_1.validateRequest)({
    content: { type: 'string', required: true, minLength: 10 },
}), (0, error_handler_1.asyncHandler)(controller.analyzeSentiment.bind(controller)));
// POST /api/v1/ai/check-readability - Check readability
router.post('/check-readability', (0, validate_request_1.validateRequest)({
    content: { type: 'string', required: true, minLength: 10 },
}), (0, error_handler_1.asyncHandler)(controller.checkReadability.bind(controller)));
// POST /api/v1/ai/check-compliance - Check compliance
router.post('/check-compliance', (0, validate_request_1.validateRequest)({
    content: { type: 'string', required: true, minLength: 10 },
    styleGuide: { type: 'string', required: false },
}), (0, error_handler_1.asyncHandler)(controller.checkCompliance.bind(controller)));
// POST /api/v1/ai/recommend-format - Recommend document format
router.post('/recommend-format', (0, validate_request_1.validateRequest)({
    description: { type: 'string', required: true, minLength: 10 },
}), (0, error_handler_1.asyncHandler)(controller.recommendFormat.bind(controller)));
//# sourceMappingURL=ai.routes.js.map