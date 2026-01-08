import { Request, Response } from 'express';
/**
 * Generate Controller
 * Handles document generation requests with persistent storage
 */
export declare class GenerateController {
    private storageService;
    constructor();
    /**
     * Initialize storage service
     */
    private initializeStorage;
    /**
     * Generate PowerPoint presentation
     */
    generatePowerPoint(req: Request, res: Response): Promise<void>;
    /**
     * Generate PowerPoint asynchronously with Agent Orchestration and Dynamic Theming
     */
    private generatePowerPointAsync;
    /**
     * Generate PowerPoint with full AI orchestration and dynamic theming (multi-agent collaboration)
     */
    private generateWithFullAIOrchestrationAndDynamicTheming;
    /**
     * Generate with template using orchestration and dynamic theming
     */
    private generateWithTemplateAndDynamicTheming;
    /**
     * Generate with explicit slides using visual enhancement and dynamic theming
     */
    private generateWithExplicitSlidesAndDynamicTheming;
    /**
     * Generate enhanced slide content with richer AI prompts
     */
    private generateEnhancedSlideContent;
    /**
     * Generate visual enhancements using Visual Design Agent
     */
    private generateVisualEnhancements;
    /**
     * Generate with template using orchestration
     */
    private generateWithTemplate;
    /**
     * Generate with explicit slides using visual enhancement
     */
    private generateWithExplicitSlides;
    /**
     * Generate Excel workbook
     */
    generateExcel(req: Request, res: Response): Promise<void>;
    /**
     * Generate Excel asynchronously
     */
    private generateExcelAsync;
    /**
     * Generate Word document
     */
    generateWord(req: Request, res: Response): Promise<void>;
    /**
     * Generate Word asynchronously
     */
    private generateWordAsync;
    /**
     * Execute workflow
     */
    executeWorkflow(req: Request, res: Response): Promise<void>;
    /**
     * Execute workflow asynchronously
     */
    private executeWorkflowAsync;
    /**
     * Get generation status with access control
     */
    getStatus(req: Request, res: Response): Promise<void>;
    /**
     * Download generated document with access control using DocumentStorageService
     */
    downloadDocument(req: Request, res: Response): Promise<void>;
    /**
     * List documents with role-based filtering using DocumentStorageService
     */
    listDocuments(req: Request, res: Response): Promise<void>;
    /**
     * Delete generated document with access control using DocumentStorageService
     */
    deleteDocument(req: Request, res: Response): Promise<void>;
    /**
     * Generate Process Map presentation
     */
    generateProcessMap(req: Request, res: Response): Promise<void>;
    /**
     * Generate Fishbone Diagram presentation
     */
    generateFishboneDiagram(req: Request, res: Response): Promise<void>;
    /**
     * Generate 5 Whys Analysis presentation
     */
    generateFiveWhys(req: Request, res: Response): Promise<void>;
    /**
     * Generate Process Map asynchronously
     */
    private generateProcessMapAsync;
    /**
     * Generate Fishbone Diagram asynchronously
     */
    private generateFishboneDiagramAsync;
    /**
     * Generate 5 Whys Analysis asynchronously
     */
    private generateFiveWhysAsync;
    /**
     * List recent files (fallback when job tracking fails)
     */
    listRecentFiles(req: Request, res: Response): Promise<void>;
    /**
     * Download file by filename (fallback method)
     */
    downloadByFilename(req: Request, res: Response): Promise<void>;
    /**
     * Get theme suggestions for presentation
     */
    getThemeSuggestions(req: Request, res: Response): Promise<void>;
    /**
     * Get theme history
     */
    getThemeHistory(req: Request, res: Response): Promise<void>;
    /**
     * Rate a theme
     */
    rateTheme(req: Request, res: Response): Promise<void>;
    /**
     * Generate slide topics using Bedrock AI (no fallback)
     */
    private generateSlideTopics;
}
//# sourceMappingURL=generate.controller.d.ts.map