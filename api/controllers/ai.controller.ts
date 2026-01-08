// FENIX Project Manager - AI Controller
// Business logic for AI services
// Created: January 6, 2026

import { Request, Response } from 'express';
import { DocumentSummarizationService } from '../../services/DocumentSummarizationService';
import { KeyPointExtractionService } from '../../services/KeyPointExtractionService';
import { SentimentAnalysisService } from '../../services/SentimentAnalysisService';
import { ReadabilityService } from '../../services/ReadabilityService';
import { ComplianceCheckingService } from '../../services/ComplianceCheckingService';
import { IntelligentDocumentService } from '../../services/IntelligentDocumentService';

export class AIController {
  private summarizationService: DocumentSummarizationService;
  private keyPointService: KeyPointExtractionService;
  private sentimentService: SentimentAnalysisService;
  private readabilityService: ReadabilityService;
  private complianceService: ComplianceCheckingService;
  private intelligentDocService: IntelligentDocumentService;

  constructor() {
    this.summarizationService = new DocumentSummarizationService();
    this.keyPointService = new KeyPointExtractionService();
    this.sentimentService = new SentimentAnalysisService();
    this.readabilityService = new ReadabilityService();
    this.complianceService = new ComplianceCheckingService();
    this.intelligentDocService = new IntelligentDocumentService();
  }

  async summarize(req: Request, res: Response): Promise<void> {
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

  async extractPoints(req: Request, res: Response): Promise<void> {
    const { content, maxPoints } = req.body;
    
    const points = await this.keyPointService.extractKeyPoints(content, {
      maxPoints: maxPoints || 10,
    });
    
    res.json({
      count: points.length,
      points,
    });
  }

  async analyzeSentiment(req: Request, res: Response): Promise<void> {
    const { content } = req.body;
    
    const sentiment = await this.sentimentService.analyzeSentiment(content);
    const tone = await this.sentimentService.analyzeTone(content);
    
    res.json({
      sentiment,
      tone,
    });
  }

  async checkReadability(req: Request, res: Response): Promise<void> {
    const { content } = req.body;
    
    const score = await this.readabilityService.calculateScore(content);
    const improvements = await this.readabilityService.suggestImprovements(content);
    
    res.json({
      score,
      improvements: improvements.slice(0, 5),
    });
  }

  async checkCompliance(req: Request, res: Response): Promise<void> {
    const { content, styleGuide } = req.body;
    
    const report = await this.complianceService.checkCompliance(
      content,
      styleGuide || 'amazon'
    );
    
    res.json(report);
  }

  async recommendFormat(req: Request, res: Response): Promise<void> {
    const { description } = req.body;
    
    const analysis = await this.intelligentDocService.analyzeContent(description);
    const recommendation = await this.intelligentDocService.recommendFormat(description);
    
    res.json({
      analysis,
      recommendation,
    });
  }
}
