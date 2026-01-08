import type { FormatRecommendation, DocumentFormat, Workflow, WorkflowCreationRequest, DocumentReference, WorkflowTemplate } from '../models/orchestration-types';
/**
 * Content Analysis Result
 */
interface ContentAnalysis {
    type: 'presentation' | 'report' | 'data-analysis' | 'documentation' | 'mixed';
    complexity: 'simple' | 'moderate' | 'complex';
    dataIntensive: boolean;
    visualHeavy: boolean;
    narrativeFocused: boolean;
    keywords: string[];
    suggestedFormats: DocumentFormat[];
}
/**
 * Intelligent Document Service
 * Analyzes content and recommends optimal document formats and workflows
 */
export declare class IntelligentDocumentService {
    private templates;
    private relationships;
    private workflowTemplates;
    constructor();
    /**
     * Analyze content to determine document type and characteristics
     */
    analyzeContent(content: string | any): Promise<ContentAnalysis>;
    /**
     * Recommend optimal format and template for content
     */
    recommendFormat(content: string | any): Promise<FormatRecommendation>;
    /**
     * Create multi-document workflow based on request
     */
    createWorkflow(request: WorkflowCreationRequest): Promise<Workflow>;
    /**
     * Track relationship between documents
     */
    trackRelationship(sourceId: string, targetId: string, type: 'supports' | 'summarizes' | 'extends' | 'references', sharedContent?: string[]): Promise<void>;
    /**
     * Get related documents
     */
    getRelatedDocuments(documentId: string): Promise<DocumentReference[]>;
    /**
     * Get workflow template by ID
     */
    getWorkflowTemplate(templateId: string): WorkflowTemplate | undefined;
    /**
     * Get all workflow templates
     */
    getAllWorkflowTemplates(): WorkflowTemplate[];
    /**
     * Get workflow templates by category
     */
    getWorkflowTemplatesByCategory(category: string): WorkflowTemplate[];
    /**
     * Initialize default templates
     */
    private initializeTemplates;
    /**
     * Initialize workflow templates
     */
    private initializeWorkflowTemplates;
    /**
     * Extract keywords from content
     */
    private extractKeywords;
    /**
     * Determine content type
     */
    private determineContentType;
    /**
     * Assess content complexity
     */
    private assessComplexity;
    /**
     * Check if content is data intensive
     */
    private isDataIntensive;
    /**
     * Check if content is visual heavy
     */
    private isVisualHeavy;
    /**
     * Check if content is narrative focused
     */
    private isNarrativeFocused;
    /**
     * Suggest formats based on analysis
     */
    private suggestFormats;
    /**
     * Find best template for format and analysis
     */
    private findBestTemplate;
    /**
     * Calculate confidence score
     */
    private calculateConfidence;
    /**
     * Generate rationale for recommendation
     */
    private generateRationale;
    /**
     * Suggest supporting documents
     */
    private suggestSupportingDocuments;
    /**
     * Build workflow steps from recommendation
     */
    private buildWorkflowSteps;
    /**
     * Build workflow dependencies
     */
    private buildWorkflowDependencies;
    /**
     * Create workflow from template
     */
    private createWorkflowFromTemplate;
    /**
     * Convert document format to agent type
     */
    private formatToAgent;
}
/**
 * Create Intelligent Document Service instance
 */
export declare function createIntelligentDocumentService(): IntelligentDocumentService;
export {};
//# sourceMappingURL=IntelligentDocumentService.d.ts.map