"use strict";
// FENIX Project Manager - AI Controller
// Business logic for AI services
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.AIController = void 0;
const DocumentSummarizationService_1 = require("../../services/DocumentSummarizationService");
const KeyPointExtractionService_1 = require("../../services/KeyPointExtractionService");
const SentimentAnalysisService_1 = require("../../services/SentimentAnalysisService");
const ReadabilityService_1 = require("../../services/ReadabilityService");
const ComplianceCheckingService_1 = require("../../services/ComplianceCheckingService");
const IntelligentDocumentService_1 = require("../../services/IntelligentDocumentService");
class AIController {
    summarizationService;
    keyPointService;
    sentimentService;
    readabilityService;
    complianceService;
    intelligentDocService;
    constructor() {
        this.summarizationService = new DocumentSummarizationService_1.DocumentSummarizationService();
        this.keyPointService = new KeyPointExtractionService_1.KeyPointExtractionService();
        this.sentimentService = new SentimentAnalysisService_1.SentimentAnalysisService();
        this.readabilityService = new ReadabilityService_1.ReadabilityService();
        this.complianceService = new ComplianceCheckingService_1.ComplianceCheckingService();
        this.intelligentDocService = new IntelligentDocumentService_1.IntelligentDocumentService();
    }
    async summarize(req, res) {
        const { content, options } = req.body;
        const summary = await this.summarizationService.summarize(content, options || {});
        const takeaways = await this.summarizationService.extractTakeaways(content, 3);
        res.json({
            summary,
            takeaways,
            originalLength: content.length,
            summaryLength: summary.length,
        });
    }
    async extractPoints(req, res) {
        const { content, maxPoints } = req.body;
        const points = await this.keyPointService.extractKeyPoints(content, {
            maxPoints: maxPoints || 10,
        });
        res.json({
            count: points.length,
            points,
        });
    }
    async analyzeSentiment(req, res) {
        const { content } = req.body;
        const sentiment = await this.sentimentService.analyzeSentiment(content);
        const tone = await this.sentimentService.analyzeTone(content);
        res.json({
            sentiment,
            tone,
        });
    }
    async checkReadability(req, res) {
        const { content } = req.body;
        const score = await this.readabilityService.calculateScore(content);
        const improvements = await this.readabilityService.suggestImprovements(content);
        res.json({
            score,
            improvements: improvements.slice(0, 5),
        });
    }
    async checkCompliance(req, res) {
        const { content, styleGuide } = req.body;
        const report = await this.complianceService.checkCompliance(content, styleGuide || 'amazon');
        res.json(report);
    }
    async recommendFormat(req, res) {
        const { description } = req.body;
        const analysis = await this.intelligentDocService.analyzeContent(description);
        const recommendation = await this.intelligentDocService.recommendFormat(description);
        res.json({
            analysis,
            recommendation,
        });
    }
}
exports.AIController = AIController;
//# sourceMappingURL=ai.controller.js.map