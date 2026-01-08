import type { PowerPointOptions, SlideDefinition, PowerPointGenerationResult, PowerPointTheme, ChartContent, PresentationValidationResult, AttachedFile } from '../models/powerpoint-types';
/**
 * PowerPoint Agent
 * Generates professional PowerPoint presentations with AI enhancement
 */
export declare class PowerPointAgent {
    private theme;
    private outputDir;
    private bedrock;
    private accessibilityService;
    private layoutService;
    private validationService;
    private dynamicThemeService;
    private currentDynamicTheme?;
    constructor(theme?: PowerPointTheme);
    /**
     * Generate PowerPoint presentation with dynamic AI-powered theming
     */
    generate(options: PowerPointOptions): Promise<PowerPointGenerationResult>;
    /**
     * Validate presentation options
     */
    private validateOptions;
    /**
     * Generate dynamic theme based on presentation content
     */
    private generateDynamicTheme;
    /**
     * Extract text content from slides for theme analysis
     */
    private extractContentText;
    /**
     * Apply dynamic theme without master slide configuration
     */
    private applyDynamicTheme;
    /**
     * Create a slide with dynamic theming (no master slide configuration)
     */
    private createDynamicSlide;
    /**
     * Apply dynamic background based on theme configuration
     */
    private applyDynamicBackground;
    /**
     * Add pattern elements for pattern background style
     */
    private addPatternElements;
    /**
     * Add geometric elements for geometric background style
     */
    private addGeometricElements;
    /**
     * Add dynamic visual elements and widgets
     */
    private addDynamicVisualElements;
    /**
     * Add bold accent elements
     */
    private addBoldAccents;
    /**
     * Add creative accent elements
     */
    private addCreativeAccents;
    /**
     * Add minimal accent elements
     */
    private addMinimalAccents;
    /**
     * Add corporate accent elements
     */
    private addCorporateAccents;
    /**
     * Add dynamic widgets to slide
     */
    private addDynamicWidgets;
    /**
     * Add individual widget to slide
     */
    private addWidget;
    /**
     * Add progress bar widget
     */
    private addProgressBarWidget;
    /**
     * Add metric card widget
     */
    private addMetricCardWidget;
    /**
     * Add callout widget
     */
    private addCalloutWidget;
    /**
     * Create dynamic title slide with AI-powered theming
     */
    private createDynamicTitleSlide;
    /**
     * Create dynamic section slide with AI-powered theming
     */
    private createDynamicSectionSlide;
    /**
     * Create dynamic content slide with AI-powered theming
     */
    private createDynamicContentSlide;
    /**
     * Create dynamic two-column slide
     */
    private createDynamicTwoColumnSlide;
    /**
     * Create dynamic chart slide
     */
    private createDynamicChartSlide;
    /**
     * Create dynamic table slide
     */
    private createDynamicTableSlide;
    /**
     * Create dynamic quote slide
     */
    private createDynamicQuoteSlide;
    /**
     * Create dynamic agenda slide
     */
    private createDynamicAgendaSlide;
    /**
     * Create dynamic thank you slide
     */
    private createDynamicThankYouSlide;
    /**
     * Add dynamic content to slide with theming
     */
    private addDynamicContent;
    /**
     * Add dynamic text content with theming
     */
    private addDynamicText;
    /**
     * Add dynamic bullet list with theming
     */
    private addDynamicBullets;
    /**
     * Add dynamic chart with theming
     */
    private addDynamicChart;
    /**
     * Add dynamic table with theming
     */
    private addDynamicTable;
    /**
     * Create two-column slide
     */
    private createTwoColumnSlide;
    /**
     * Create chart slide
     */
    private createChartSlide;
    /**
     * Create table slide
     */
    private createTableSlide;
    /**
     * Create quote slide
     */
    private createQuoteSlide;
    /**
     * Create agenda slide
     */
    private createAgendaSlide;
    /**
     * Create thank you slide
     */
    private createThankYouSlide;
    /**
     * Add content to slide
     */
    private addContent;
    /**
     * Add text content with enhanced styling
     */
    private addText;
    /**
     * Add bullet list with enhanced styling
     */
    private addBullets;
    /**
     * Add image
     */
    private addImage;
    /**
     * Add chart
     */
    private addChart;
    /**
     * Get PptxGenJS chart type
     */
    private getChartType;
    /**
     * Add table
     */
    private addTable;
    /**
     * Apply background
     */
    private applyBackground;
    /**
     * Process attached files and extract content for AI analysis
     */
    processAttachedFiles(attachedFiles: AttachedFile[]): Promise<string>;
    /**
     * AI: Generate slide content with enhanced visuals and file context
     */
    generateSlideContent(topic: string, slideType: string, attachedFiles?: AttachedFile[]): Promise<SlideDefinition>;
    /**
     * AI: Generate sample data and charts for presentations
     */
    generateSampleChart(topic: string, chartType?: string): Promise<ChartContent>;
    /**
     * AI: Optimize presentation
     */
    optimizePresentation(slides: SlideDefinition[]): Promise<string[]>;
    /**
     * Generate from template using the comprehensive template system
     */
    generateFromTemplate(templateId: string, title: string, data: any): Promise<PowerPointGenerationResult>;
    /**
     * Save presentation to file
     */
    save(filePath: string): Promise<void>;
    /**
     * Validate presentation
     */
    validatePresentation(options: PowerPointOptions): PresentationValidationResult;
    /**
     * Generate presentation (orchestrator compatibility method)
     * Wrapper around generate() for AgentOrchestrator
     */
    generatePresentation(inputs: any): Promise<any>;
    /**
     * Generate process map presentation
     */
    generateProcessMap(options: import('../models/process-improvement-types').ProcessMapOptions): Promise<PowerPointGenerationResult>;
    /**
     * Generate fishbone diagram presentation
     */
    generateFishboneDiagram(options: import('../models/process-improvement-types').FishboneDiagramOptions): Promise<PowerPointGenerationResult>;
}
/**
 * Create PowerPoint agent instance
 */
export declare function createPowerPointAgent(theme?: PowerPointTheme): PowerPointAgent;
//# sourceMappingURL=PowerPointAgent.d.ts.map