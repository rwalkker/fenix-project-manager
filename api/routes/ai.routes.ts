// FENIX Project Manager - AI Routes
// API routes for AI services
// Created: January 6, 2026

import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { validateRequest } from '../middleware/validate-request';
import { asyncHandler } from '../middleware/error-handler';

const router = Router();
const controller = new AIController();

// POST /api/v1/ai/summarize - Summarize document
router.post(
  '/summarize',
  validateRequest({
    content: { type: 'string', required: true, minLength: 10 },
    options: { type: 'object', required: false },
  }),
  asyncHandler(controller.summarize.bind(controller))
);

// POST /api/v1/ai/extract-points - Extract key points
router.post(
  '/extract-points',
  validateRequest({
    content: { type: 'string', required: true, minLength: 10 },
    maxPoints: { type: 'number', required: false },
  }),
  asyncHandler(controller.extractPoints.bind(controller))
);

// POST /api/v1/ai/analyze-sentiment - Analyze sentiment
router.post(
  '/analyze-sentiment',
  validateRequest({
    content: { type: 'string', required: true, minLength: 10 },
  }),
  asyncHandler(controller.analyzeSentiment.bind(controller))
);

// POST /api/v1/ai/check-readability - Check readability
router.post(
  '/check-readability',
  validateRequest({
    content: { type: 'string', required: true, minLength: 10 },
  }),
  asyncHandler(controller.checkReadability.bind(controller))
);

// POST /api/v1/ai/check-compliance - Check compliance
router.post(
  '/check-compliance',
  validateRequest({
    content: { type: 'string', required: true, minLength: 10 },
    styleGuide: { type: 'string', required: false },
  }),
  asyncHandler(controller.checkCompliance.bind(controller))
);

// POST /api/v1/ai/recommend-format - Recommend document format
router.post(
  '/recommend-format',
  validateRequest({
    description: { type: 'string', required: true, minLength: 10 },
  }),
  asyncHandler(controller.recommendFormat.bind(controller))
);

export { router as aiRoutes };
