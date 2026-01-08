// FENIX Project Manager - Intelligent Document Service
// Automatically determine optimal document formats and content structure
// Created: January 6, 2026

/**
 * Simple UUID generator (fallback when uuid package not available)
 */
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

import type {
  FormatRecommendation,
  DocumentFormat,
  Workflow,
  WorkflowStep,
  WorkflowDependency,
  WorkflowCreationRequest,
  DocumentReference,
  WorkflowTemplate,
  StepStatus
} from '../models/orchestration-types';

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
 * Template Metadata
 */
interface TemplateMetadata {
  id: string;
  name: string;
  format: DocumentFormat;
  category: string;
  keywords: string[];
  complexity: 'simple' | 'moderate' | 'complex';
  bestFor: string[];
}

/**
 * Document Relationship
 */
interface DocumentRelationship {
  id: string;
  sourceDocument: string;
  targetDocument: string;
  relationshipType: 'supports' | 'summarizes' | 'extends' | 'references';
  sharedContent: string[];
  version: string;
  createdAt: Date;
}

/**
 * Intelligent Document Service
 * Analyzes content and recommends optimal document formats and workflows
 */
export class IntelligentDocumentService {
  private templates: Map<string, TemplateMetadata>;
  private relationships: Map<string, DocumentRelationship[]>;
  private workflowTemplates: Map<string, WorkflowTemplate>;

  constructor() {
    this.templates = new Map();
    this.relationships = new Map();
    this.workflowTemplates = new Map();
    
    // Initialize with default templates
    this.initializeTemplates();
    this.initializeWorkflowTemplates();
  }

  /**
   * Analyze content to determine document type and characteristics
   */
  async analyzeContent(content: string | any): Promise<ContentAnalysis> {
    const text = typeof content === 'string' ? content : JSON.stringify(content);
    const lowerText = text.toLowerCase();

    // Extract keywords
    const keywords = this.extractKeywords(text);

    // Determine content type
    const type = this.determineContentType(lowerText, keywords);

    // Assess complexity
    const complexity = this.assessComplexity(text);

    // Check characteristics
    const dataIntensive = this.isDataIntensive(lowerText, keywords);
    const visualHeavy = this.isVisualHeavy(lowerText, keywords);
    const narrativeFocused = this.isNarrativeFocused(lowerText, keywords);

    // Suggest formats based on analysis
    const suggestedFormats = this.suggestFormats(type, dataIntensive, visualHeavy, narrativeFocused);

    return {
      type,
      complexity,
      dataIntensive,
      visualHeavy,
      narrativeFocused,
      keywords,
      suggestedFormats
    };
  }

  /**
   * Recommend optimal format and template for content
   */
  async recommendFormat(content: string | any): Promise<FormatRecommendation> {
    const analysis = await this.analyzeContent(content);

    // Determine primary format
    const primaryFormat = analysis.suggestedFormats[0] || 'powerpoint';

    // Find best template
    const template = this.findBestTemplate(primaryFormat, analysis);

    // Calculate confidence
    const confidence = this.calculateConfidence(analysis, primaryFormat);

    // Generate rationale
    const rationale = this.generateRationale(analysis, primaryFormat, template);

    // Suggest supporting documents
    const supportingDocs = this.suggestSupportingDocuments(analysis, primaryFormat);

    return {
      primaryFormat,
      template,
      confidence,
      rationale,
      supportingDocs
    };
  }

  /**
   * Create multi-document workflow based on request
   */
  async createWorkflow(request: WorkflowCreationRequest): Promise<Workflow> {
    // Check if template is specified
    if (request.template) {
      const template = this.workflowTemplates.get(request.template);
      if (template) {
        return this.createWorkflowFromTemplate(template, request);
      }
    }

    // Analyze content to determine workflow
    const recommendation = await this.recommendFormat(request.inputs);

    // Build workflow steps
    const steps = this.buildWorkflowSteps(recommendation, request.inputs);

    // Build dependencies
    const dependencies = this.buildWorkflowDependencies(steps);

    // Create workflow
    const workflow: Workflow = {
      id: generateId(),
      name: request.name,
      description: request.description || `Workflow for ${recommendation.primaryFormat} generation`,
      steps,
      dependencies,
      context: request.context,
      status: 'pending',
      createdAt: new Date()
    };

    return workflow;
  }

  /**
   * Track relationship between documents
   */
  async trackRelationship(
    sourceId: string,
    targetId: string,
    type: 'supports' | 'summarizes' | 'extends' | 'references',
    sharedContent: string[] = []
  ): Promise<void> {
    const relationship: DocumentRelationship = {
      id: generateId(),
      sourceDocument: sourceId,
      targetDocument: targetId,
      relationshipType: type,
      sharedContent,
      version: '1.0',
      createdAt: new Date()
    };

    // Store relationship for both documents
    if (!this.relationships.has(sourceId)) {
      this.relationships.set(sourceId, []);
    }
    if (!this.relationships.has(targetId)) {
      this.relationships.set(targetId, []);
    }

    this.relationships.get(sourceId)!.push(relationship);
    this.relationships.get(targetId)!.push(relationship);
  }

  /**
   * Get related documents
   */
  async getRelatedDocuments(documentId: string): Promise<DocumentReference[]> {
    const relationships = this.relationships.get(documentId) || [];
    
    // Extract unique related document IDs
    const relatedIds = new Set<string>();
    relationships.forEach(rel => {
      if (rel.sourceDocument !== documentId) {
        relatedIds.add(rel.sourceDocument);
      }
      if (rel.targetDocument !== documentId) {
        relatedIds.add(rel.targetDocument);
      }
    });

    // Convert to document references (placeholder implementation)
    return Array.from(relatedIds).map(id => ({
      id,
      name: `Document ${id}`,
      type: 'powerpoint' as DocumentFormat,
      path: `/documents/${id}`,
      createdAt: new Date()
    }));
  }

  /**
   * Get workflow template by ID
   */
  getWorkflowTemplate(templateId: string): WorkflowTemplate | undefined {
    return this.workflowTemplates.get(templateId);
  }

  /**
   * Get all workflow templates
   */
  getAllWorkflowTemplates(): WorkflowTemplate[] {
    return Array.from(this.workflowTemplates.values());
  }

  /**
   * Get workflow templates by category
   */
  getWorkflowTemplatesByCategory(category: string): WorkflowTemplate[] {
    return Array.from(this.workflowTemplates.values())
      .filter(template => template.category === category);
  }

  // ========== Private Helper Methods ==========

  /**
   * Initialize default templates
   */
  private initializeTemplates(): void {
    const templates: TemplateMetadata[] = [
      // PowerPoint Templates
      {
        id: 'project-status',
        name: 'Project Status Report',
        format: 'powerpoint',
        category: 'project-management',
        keywords: ['status', 'project', 'update', 'progress', 'milestone'],
        complexity: 'moderate',
        bestFor: ['status updates', 'project reviews', 'stakeholder updates']
      },
      {
        id: 'executive-presentation',
        name: 'Executive Presentation',
        format: 'powerpoint',
        category: 'executive',
        keywords: ['executive', 'leadership', 'strategy', 'vision', 'overview'],
        complexity: 'simple',
        bestFor: ['executive briefings', 'board presentations', 'high-level overviews']
      },
      {
        id: 'change-management',
        name: 'Change Management Presentation',
        format: 'powerpoint',
        category: 'change-management',
        keywords: ['change', 'transformation', 'transition', 'impact', 'stakeholder'],
        complexity: 'complex',
        bestFor: ['change initiatives', 'transformation programs', 'stakeholder communication']
      },
      {
        id: 'quarterly-review',
        name: 'Quarterly Business Review',
        format: 'powerpoint',
        category: 'business-review',
        keywords: ['quarterly', 'review', 'business', 'performance', 'metrics', 'kpi'],
        complexity: 'complex',
        bestFor: ['quarterly reviews', 'business performance', 'metric reviews']
      },

      // Excel Templates
      {
        id: 'kpi-dashboard',
        name: 'KPI Dashboard',
        format: 'excel',
        category: 'analytics',
        keywords: ['kpi', 'metrics', 'dashboard', 'performance', 'data', 'analytics'],
        complexity: 'moderate',
        bestFor: ['performance tracking', 'metric monitoring', 'data analysis']
      },
      {
        id: 'data-analysis',
        name: 'Data Analysis Workbook',
        format: 'excel',
        category: 'analytics',
        keywords: ['data', 'analysis', 'statistics', 'trends', 'insights'],
        complexity: 'complex',
        bestFor: ['data analysis', 'statistical analysis', 'trend analysis']
      },
      {
        id: 'financial-report',
        name: 'Financial Report',
        format: 'excel',
        category: 'finance',
        keywords: ['financial', 'budget', 'cost', 'revenue', 'profit', 'expense'],
        complexity: 'complex',
        bestFor: ['financial reporting', 'budget tracking', 'cost analysis']
      },

      // Word Templates
      {
        id: 'executive-summary',
        name: 'Executive Summary',
        format: 'word',
        category: 'documentation',
        keywords: ['summary', 'executive', 'overview', 'highlights', 'key points'],
        complexity: 'simple',
        bestFor: ['executive summaries', 'document overviews', 'key highlights']
      },
      {
        id: 'technical-documentation',
        name: 'Technical Documentation',
        format: 'word',
        category: 'documentation',
        keywords: ['technical', 'documentation', 'specification', 'architecture', 'design'],
        complexity: 'complex',
        bestFor: ['technical docs', 'specifications', 'architecture documents']
      },
      {
        id: 'project-plan',
        name: 'Project Plan',
        format: 'word',
        category: 'project-management',
        keywords: ['plan', 'project', 'timeline', 'deliverables', 'scope'],
        complexity: 'moderate',
        bestFor: ['project planning', 'scope documents', 'project charters']
      }
    ];

    templates.forEach(template => {
      this.templates.set(template.id, template);
    });
  }

  /**
   * Initialize workflow templates
   */
  private initializeWorkflowTemplates(): void {
    const templates: WorkflowTemplate[] = [
      {
        id: 'project-status-package',
        name: 'Project Status Package',
        description: 'Complete project status update with presentation, metrics, and documentation',
        category: 'project-management',
        steps: [
          {
            id: 'step-1',
            name: 'Create Status Presentation',
            agent: 'powerpoint',
            task: 'Create project status presentation',
            inputs: {},
            dependencies: []
          },
          {
            id: 'step-2',
            name: 'Create KPI Dashboard',
            agent: 'excel',
            task: 'Create KPI dashboard',
            inputs: {},
            dependencies: []
          },
          {
            id: 'step-3',
            name: 'Create Executive Summary',
            agent: 'word',
            task: 'Create executive summary',
            inputs: {},
            dependencies: ['step-1']
          }
        ],
        dependencies: [
          {
            fromStep: 'step-1',
            toStep: 'step-3',
            dataMapping: { content: 'presentation.summary' }
          }
        ],
        requiredInputs: ['projectData', 'metrics'],
        expectedOutputs: ['presentation', 'dashboard', 'summary'],
        estimatedDuration: 120000 // 2 minutes
      },
      {
        id: 'change-management-suite',
        name: 'Change Management Suite',
        description: 'Complete change management package with plan, presentation, and impact analysis',
        category: 'change-management',
        steps: [
          {
            id: 'step-1',
            name: 'Create Change Plan',
            agent: 'word',
            task: 'Create change management plan',
            inputs: {},
            dependencies: []
          },
          {
            id: 'step-2',
            name: 'Create Stakeholder Presentation',
            agent: 'powerpoint',
            task: 'Create stakeholder presentation',
            inputs: {},
            dependencies: ['step-1']
          },
          {
            id: 'step-3',
            name: 'Create Impact Analysis',
            agent: 'excel',
            task: 'Create impact analysis',
            inputs: {},
            dependencies: []
          }
        ],
        dependencies: [
          {
            fromStep: 'step-1',
            toStep: 'step-2',
            dataMapping: { content: 'document.content' }
          }
        ],
        requiredInputs: ['changeData', 'impactData'],
        expectedOutputs: ['plan', 'presentation', 'analysis'],
        estimatedDuration: 120000 // 2 minutes
      },
      {
        id: 'quarterly-review-package',
        name: 'Quarterly Business Review Package',
        description: 'Complete quarterly review with presentation, financial analysis, and executive summary',
        category: 'business-review',
        steps: [
          {
            id: 'step-1',
            name: 'Create Review Presentation',
            agent: 'powerpoint',
            task: 'Create quarterly review presentation',
            inputs: {},
            dependencies: []
          },
          {
            id: 'step-2',
            name: 'Create Financial Analysis',
            agent: 'excel',
            task: 'Create financial analysis',
            inputs: {},
            dependencies: []
          },
          {
            id: 'step-3',
            name: 'Create Executive Summary',
            agent: 'word',
            task: 'Create executive summary',
            inputs: {},
            dependencies: ['step-1', 'step-2']
          }
        ],
        dependencies: [
          {
            fromStep: 'step-1',
            toStep: 'step-3',
            dataMapping: { presentationContent: 'presentation.content' }
          },
          {
            fromStep: 'step-2',
            toStep: 'step-3',
            dataMapping: { financialData: 'workbook.data' }
          }
        ],
        requiredInputs: ['quarterData', 'financialData', 'metrics'],
        expectedOutputs: ['presentation', 'analysis', 'summary'],
        estimatedDuration: 150000 // 2.5 minutes
      }
    ];

    templates.forEach(template => {
      this.workflowTemplates.set(template.id, template);
    });
  }

  /**
   * Extract keywords from content
   */
  private extractKeywords(text: string): string[] {
    const lowerText = text.toLowerCase();
    const keywords: string[] = [];

    // Common business keywords
    const keywordPatterns = [
      'status', 'project', 'update', 'progress', 'milestone',
      'executive', 'leadership', 'strategy', 'vision',
      'change', 'transformation', 'impact',
      'quarterly', 'review', 'business', 'performance',
      'kpi', 'metrics', 'dashboard', 'analytics',
      'data', 'analysis', 'statistics', 'trends',
      'financial', 'budget', 'cost', 'revenue',
      'summary', 'overview', 'highlights',
      'technical', 'documentation', 'specification',
      'plan', 'timeline', 'deliverables', 'scope'
    ];

    keywordPatterns.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        keywords.push(keyword);
      }
    });

    return keywords;
  }

  /**
   * Determine content type
   */
  private determineContentType(
    _text: string,
    keywords: string[]
  ): 'presentation' | 'report' | 'data-analysis' | 'documentation' | 'mixed' {
    // Check for presentation indicators
    const presentationScore = keywords.filter(k => 
      ['status', 'update', 'executive', 'review', 'presentation'].includes(k)
    ).length;

    // Check for data analysis indicators
    const dataScore = keywords.filter(k =>
      ['kpi', 'metrics', 'data', 'analytics', 'statistics', 'trends'].includes(k)
    ).length;

    // Check for documentation indicators
    const docScore = keywords.filter(k =>
      ['documentation', 'specification', 'technical', 'plan'].includes(k)
    ).length;

    // Determine type based on scores
    if (presentationScore > dataScore && presentationScore > docScore) {
      return 'presentation';
    } else if (dataScore > presentationScore && dataScore > docScore) {
      return 'data-analysis';
    } else if (docScore > presentationScore && docScore > dataScore) {
      return 'documentation';
    } else if (presentationScore > 0 && dataScore > 0) {
      return 'mixed';
    }

    return 'report';
  }

  /**
   * Assess content complexity
   */
  private assessComplexity(text: string): 'simple' | 'moderate' | 'complex' {
    const length = text.length;
    const sentences = text.split(/[.!?]+/).length;
    const avgSentenceLength = length / sentences;

    if (length < 500 || avgSentenceLength < 15) {
      return 'simple';
    } else if (length < 2000 || avgSentenceLength < 25) {
      return 'moderate';
    }

    return 'complex';
  }

  /**
   * Check if content is data intensive
   */
  private isDataIntensive(text: string, keywords: string[]): boolean {
    const dataKeywords = ['data', 'metrics', 'kpi', 'analytics', 'statistics', 'numbers', 'chart', 'graph'];
    const dataScore = keywords.filter(k => dataKeywords.includes(k)).length;
    
    // Check for numeric content
    const numberMatches = text.match(/\d+/g);
    const hasNumbers = numberMatches && numberMatches.length > 10;

    return dataScore >= 2 || Boolean(hasNumbers);
  }

  /**
   * Check if content is visual heavy
   */
  private isVisualHeavy(text: string, keywords: string[]): boolean {
    const visualKeywords = ['chart', 'graph', 'diagram', 'visual', 'image', 'graphic', 'illustration'];
    const visualScore = keywords.filter(k => visualKeywords.includes(k)).length;

    return visualScore >= 2 || text.includes('visual') || text.includes('chart');
  }

  /**
   * Check if content is narrative focused
   */
  private isNarrativeFocused(lowerText: string, keywords: string[]): boolean {
    const narrativeKeywords = ['story', 'narrative', 'summary', 'overview', 'description', 'explanation'];
    const narrativeScore = keywords.filter(k => narrativeKeywords.includes(k)).length;

    const sentences = lowerText.split(/[.!?]+/).length;
    const hasLongNarrative = sentences > 10;

    return narrativeScore >= 1 || hasLongNarrative;
  }

  /**
   * Suggest formats based on analysis
   */
  private suggestFormats(
    type: string,
    dataIntensive: boolean,
    visualHeavy: boolean,
    narrativeFocused: boolean
  ): DocumentFormat[] {
    const formats: DocumentFormat[] = [];

    if (type === 'presentation' || visualHeavy) {
      formats.push('powerpoint');
    }

    if (dataIntensive) {
      formats.push('excel');
    }

    if (narrativeFocused || type === 'documentation') {
      formats.push('word');
    }

    // Default to PowerPoint if no clear preference
    if (formats.length === 0) {
      formats.push('powerpoint');
    }

    return formats;
  }

  /**
   * Find best template for format and analysis
   */
  private findBestTemplate(format: DocumentFormat, analysis: ContentAnalysis): string {
    const candidates = Array.from(this.templates.values())
      .filter(t => t.format === format);

    if (candidates.length === 0) {
      return 'default';
    }

    // Score each template
    const scored = candidates.map(template => {
      let score = 0;

      // Match keywords
      const matchingKeywords = template.keywords.filter(k => 
        analysis.keywords.includes(k)
      );
      score += matchingKeywords.length * 2;

      // Match complexity
      if (template.complexity === analysis.complexity) {
        score += 3;
      }

      return { template, score };
    });

    // Sort by score and return best
    scored.sort((a, b) => b.score - a.score);
    return scored[0].template.id;
  }

  /**
   * Calculate confidence score
   */
  private calculateConfidence(analysis: ContentAnalysis, format: DocumentFormat): number {
    let confidence = 0.5; // Base confidence

    // Increase confidence based on clear indicators
    if (analysis.suggestedFormats[0] === format) {
      confidence += 0.3;
    }

    if (analysis.keywords.length > 3) {
      confidence += 0.1;
    }

    if (analysis.complexity !== 'simple') {
      confidence += 0.1;
    }

    return Math.min(confidence, 1.0);
  }

  /**
   * Generate rationale for recommendation
   */
  private generateRationale(
    analysis: ContentAnalysis,
    format: DocumentFormat,
    templateId: string
  ): string {
    const template = this.templates.get(templateId);
    const reasons: string[] = [];

    // Add content type reason
    reasons.push(`Content type is ${analysis.type}`);

    // Add characteristic reasons
    if (analysis.dataIntensive) {
      reasons.push('content is data-intensive');
    }
    if (analysis.visualHeavy) {
      reasons.push('content requires visual elements');
    }
    if (analysis.narrativeFocused) {
      reasons.push('content is narrative-focused');
    }

    // Add template reason
    if (template) {
      reasons.push(`${template.name} template is best suited for this content`);
    }

    return `${format.charAt(0).toUpperCase() + format.slice(1)} format recommended because ${reasons.join(', ')}.`;
  }

  /**
   * Suggest supporting documents
   */
  private suggestSupportingDocuments(
    analysis: ContentAnalysis,
    primaryFormat: DocumentFormat
  ): Array<{ format: DocumentFormat; template: string; rationale: string }> {
    const supporting: Array<{ format: DocumentFormat; template: string; rationale: string }> = [];

    // If primary is PowerPoint, suggest Excel for data
    if (primaryFormat === 'powerpoint' && analysis.dataIntensive) {
      supporting.push({
        format: 'excel',
        template: 'kpi-dashboard',
        rationale: 'Detailed metrics and data analysis to support presentation'
      });
    }

    // If primary is PowerPoint, suggest Word for summary
    if (primaryFormat === 'powerpoint' && analysis.complexity === 'complex') {
      supporting.push({
        format: 'word',
        template: 'executive-summary',
        rationale: 'Executive summary to accompany presentation'
      });
    }

    // If primary is Excel, suggest PowerPoint for visualization
    if (primaryFormat === 'excel' && analysis.visualHeavy) {
      supporting.push({
        format: 'powerpoint',
        template: 'executive-presentation',
        rationale: 'Visual presentation of key data insights'
      });
    }

    return supporting;
  }

  /**
   * Build workflow steps from recommendation
   */
  private buildWorkflowSteps(
    recommendation: FormatRecommendation,
    inputs: any
  ): WorkflowStep[] {
    const steps: WorkflowStep[] = [];

    // Primary document step
    steps.push({
      id: 'step-1',
      name: `Create ${recommendation.primaryFormat} document`,
      agent: this.formatToAgent(recommendation.primaryFormat),
      task: `Create ${recommendation.template}`,
      inputs: { ...inputs, template: recommendation.template },
      status: 'pending',
      dependencies: []
    });

    // Supporting document steps
    recommendation.supportingDocs?.forEach((doc, index) => {
      const stepId = `step-${index + 2}`;
      steps.push({
        id: stepId,
        name: `Create ${doc.format} document`,
        agent: this.formatToAgent(doc.format),
        task: `Create ${doc.template}`,
        inputs: { ...inputs, template: doc.template },
        status: 'pending',
        dependencies: index === 0 ? ['step-1'] : [] // First supporting doc depends on primary
      });
    });

    return steps;
  }

  /**
   * Build workflow dependencies
   */
  private buildWorkflowDependencies(steps: WorkflowStep[]): WorkflowDependency[] {
    const dependencies: WorkflowDependency[] = [];

    // Create dependencies based on step dependencies
    steps.forEach(step => {
      step.dependencies.forEach(depId => {
        dependencies.push({
          fromStep: depId,
          toStep: step.id,
          dataMapping: { content: 'output.content' }
        });
      });
    });

    return dependencies;
  }

  /**
   * Create workflow from template
   */
  private createWorkflowFromTemplate(
    template: WorkflowTemplate,
    request: WorkflowCreationRequest
  ): Workflow {
    // Clone template steps and add inputs
    const steps: WorkflowStep[] = template.steps.map(step => ({
      ...step,
      inputs: { ...step.inputs, ...request.inputs },
      status: 'pending' as StepStatus
    }));

    return {
      id: generateId(),
      name: request.name || template.name,
      description: request.description || template.description,
      steps,
      dependencies: template.dependencies,
      context: request.context,
      status: 'pending',
      createdAt: new Date()
    };
  }

  /**
   * Convert document format to agent type
   */
  private formatToAgent(format: DocumentFormat): 'powerpoint' | 'excel' | 'word' | 'visual-design' {
    switch (format) {
      case 'powerpoint':
        return 'powerpoint';
      case 'excel':
        return 'excel';
      case 'word':
        return 'word';
      case 'image':
        return 'visual-design';
      default:
        return 'powerpoint';
    }
  }
}

/**
 * Create Intelligent Document Service instance
 */
export function createIntelligentDocumentService(): IntelligentDocumentService {
  return new IntelligentDocumentService();
}
