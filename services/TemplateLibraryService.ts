// FENIX Project Manager - Template Library Service
// Centralized template management with inheritance and composition
// Created: January 6, 2026

import { getPowerPointTemplate, listPowerPointTemplates } from '../templates/powerpoint-templates';
import { getWordTemplate, listWordTemplates } from '../templates/word-templates';
import { getTemplate as getExcelTemplate, listTemplates as listExcelTemplates } from '../templates/excel-templates';
import { getProcessImprovementTemplate, listProcessImprovementTemplates, getTemplateMetadata } from '../templates/process-improvement-templates';
import { createDesignValidationService } from './DesignValidationService';
import type { PowerPointTemplateType } from '../models/powerpoint-types';
import { WordTemplateType } from '../models/word-types';

/**
 * Template type
 */
export type TemplateType = 'powerpoint' | 'word' | 'excel';

/**
 * Template metadata
 */
export interface TemplateMetadata {
  id: string;
  name: string;
  type: TemplateType;
  description: string;
  version: string;
  author: string;
  created: Date;
  modified: Date;
  tags: string[];
  category: string;
  baseTemplate?: string; // For inheritance
  components?: string[]; // For composition
}

/**
 * Template definition
 */
export interface TemplateDefinition {
  id: string;
  name: string;
  type: TemplateType;
  category: string;
  description: string;
  metadata: TemplateMetadata;
  generator: (data?: Record<string, any>) => any;
  validator?: (data?: Record<string, any>) => ValidationResult;
}

/**
 * Template validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Template search criteria
 */
export interface TemplateSearchCriteria {
  type?: TemplateType;
  category?: string;
  tags?: string[];
  searchTerm?: string;
}

/**
 * Template composition options
 */
export interface CompositionOptions {
  baseTemplateId: string;
  components: string[];
  mergeStrategy?: 'replace' | 'merge' | 'append';
}

/**
 * Template version info
 */
export interface TemplateVersion {
  version: string;
  date: Date;
  changes: string[];
  author: string;
}

/**
 * Template Library Service
 * Manages templates with inheritance, composition, and versioning
 */
export class TemplateLibraryService {
  private templates: Map<string, TemplateDefinition>;
  private versions: Map<string, TemplateVersion[]>;

  constructor() {
    this.templates = new Map();
    this.versions = new Map();
    this.initializeTemplates();
  }

  /**
   * Initialize built-in templates
   */
  private initializeTemplates(): void {
    // Register PowerPoint templates
    const pptTemplates = listPowerPointTemplates();
    pptTemplates.forEach(template => {
      const metadata = {
        id: `ppt-${template.id}`,
        name: template.name,
        type: 'powerpoint' as TemplateType,
        description: template.description,
        version: '1.0.0',
        author: 'FENIX Team',
        created: new Date('2026-01-06'),
        modified: new Date('2026-01-06'),
        tags: this.extractTags(template.description),
        category: this.categorizeTemplate(template.name)
      };
      
      this.registerTemplate({
        id: metadata.id,
        name: metadata.name,
        type: metadata.type,
        category: metadata.category,
        description: metadata.description,
        metadata,
        generator: (data) => getPowerPointTemplate(template.id as PowerPointTemplateType, data)
      });
    });

    // Register Word templates
    const wordTemplates = listWordTemplates();
    wordTemplates.forEach(template => {
      const metadata = {
        id: `word-${template.id}`,
        name: template.name,
        type: 'word' as TemplateType,
        description: template.description,
        version: '1.0.0',
        author: 'FENIX Team',
        created: new Date('2026-01-05'),
        modified: new Date('2026-01-05'),
        tags: this.extractTags(template.description),
        category: this.categorizeTemplate(template.name)
      };
      
      this.registerTemplate({
        id: metadata.id,
        name: metadata.name,
        type: metadata.type,
        category: metadata.category,
        description: metadata.description,
        metadata,
        generator: (data) => getWordTemplate(template.id as WordTemplateType, data)
      });
    });

    // Register Excel templates
    const excelTemplates = listExcelTemplates();
    excelTemplates.forEach(template => {
      const metadata = {
        id: `excel-${template.name}`,
        name: template.name,
        type: 'excel' as TemplateType,
        description: template.description,
        version: '1.0.0',
        author: 'FENIX Team',
        created: new Date('2026-01-05'),
        modified: new Date('2026-01-05'),
        tags: this.extractTags(template.description),
        category: this.categorizeTemplate(template.name)
      };
      
      this.registerTemplate({
        id: metadata.id,
        name: metadata.name,
        type: metadata.type,
        category: metadata.category,
        description: metadata.description,
        metadata,
        generator: (data) => getExcelTemplate(template.name, data)
      });
    });

    // Register Process Improvement templates
    const processImprovementTemplates = listProcessImprovementTemplates();
    processImprovementTemplates.forEach(templateId => {
      const templateMetadata = getTemplateMetadata(templateId);
      const metadata = {
        id: `process-${templateId}`,
        name: templateMetadata.name,
        type: 'powerpoint' as TemplateType, // Process improvement templates generate PowerPoint
        description: templateMetadata.description,
        version: '1.0.0',
        author: 'FENIX Team',
        created: new Date('2026-01-06'),
        modified: new Date('2026-01-06'),
        tags: ['process', 'improvement', 'analysis', 'workflow'],
        category: 'Process Improvement'
      };
      
      this.registerTemplate({
        id: metadata.id,
        name: metadata.name,
        type: metadata.type,
        category: metadata.category,
        description: metadata.description,
        metadata,
        generator: (data) => getProcessImprovementTemplate(templateId)
      });
    });
  }

  /**
   * Register a new template
   */
  registerTemplate(definition: TemplateDefinition): void {
    const { id, version } = definition.metadata;

    // Store template
    this.templates.set(id, definition);

    // Initialize version history
    if (!this.versions.has(id)) {
      this.versions.set(id, []);
    }

    // Add version entry
    this.versions.get(id)!.push({
      version,
      date: definition.metadata.modified,
      changes: ['Initial version'],
      author: definition.metadata.author
    });
  }

  /**
   * Get template by ID
   */
  getTemplate(id: string): TemplateDefinition | undefined {
    return this.templates.get(id);
  }

  /**
   * Get all templates
   */
  getAllTemplates(): TemplateDefinition[] {
    return Array.from(this.templates.values());
  }

  /**
   * Search templates
   */
  searchTemplates(criteria: TemplateSearchCriteria): TemplateDefinition[] {
    let results = this.getAllTemplates();

    // Filter by type
    if (criteria.type) {
      results = results.filter(t => t.metadata.type === criteria.type);
    }

    // Filter by category
    if (criteria.category) {
      results = results.filter(t => t.metadata.category === criteria.category);
    }

    // Filter by tags
    if (criteria.tags && criteria.tags.length > 0) {
      results = results.filter(t => 
        criteria.tags!.some(tag => t.metadata.tags.includes(tag))
      );
    }

    // Filter by search term
    if (criteria.searchTerm) {
      const term = criteria.searchTerm.toLowerCase();
      results = results.filter(t => 
        t.metadata.name.toLowerCase().includes(term) ||
        t.metadata.description.toLowerCase().includes(term) ||
        t.metadata.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }

    return results;
  }

  /**
   * Create template from inheritance
   */
  createFromBase(baseId: string, customizations: Partial<TemplateMetadata>): TemplateDefinition | null {
    const baseTemplate = this.getTemplate(baseId);
    if (!baseTemplate) {
      return null;
    }

    // Create new template with inheritance
    const newMetadata = {
      ...baseTemplate.metadata,
      ...customizations,
      id: customizations.id || `${baseId}-custom-${Date.now()}`,
      baseTemplate: baseId,
      version: '1.0.0',
      created: new Date(),
      modified: new Date()
    };

    const newTemplate: TemplateDefinition = {
      id: newMetadata.id,
      name: newMetadata.name,
      type: newMetadata.type,
      category: newMetadata.category,
      description: newMetadata.description,
      metadata: newMetadata,
      generator: baseTemplate.generator,
      validator: baseTemplate.validator
    };

    // Register the new template
    this.registerTemplate(newTemplate);

    return newTemplate;
  }

  /**
   * Compose template from multiple components
   */
  composeTemplate(options: CompositionOptions, metadata: Partial<TemplateMetadata>): TemplateDefinition | null {
    const baseTemplate = this.getTemplate(options.baseTemplateId);
    if (!baseTemplate) {
      return null;
    }

    // Validate all components exist
    const components = options.components
      .map(id => this.getTemplate(id))
      .filter(t => t !== undefined) as TemplateDefinition[];

    if (components.length !== options.components.length) {
      return null;
    }

    // Create composed generator
    const composedGenerator = (data?: Record<string, any>) => {
      const baseResult = baseTemplate.generator(data);
      
      // Apply components based on merge strategy
      components.forEach(component => {
        const componentResult = component.generator(data);
        // Merge logic would go here based on template type
        // This is a simplified version
        Object.assign(baseResult, componentResult);
      });

      return baseResult;
    };

    // Create new template
    const newMetadata = {
      ...baseTemplate.metadata,
      ...metadata,
      id: metadata.id || `composed-${Date.now()}`,
      baseTemplate: options.baseTemplateId,
      components: options.components,
      version: '1.0.0',
      created: new Date(),
      modified: new Date()
    };

    const newTemplate: TemplateDefinition = {
      id: newMetadata.id,
      name: newMetadata.name,
      type: newMetadata.type,
      category: newMetadata.category,
      description: newMetadata.description,
      metadata: newMetadata,
      generator: composedGenerator
    };

    // Register the new template
    this.registerTemplate(newTemplate);

    return newTemplate;
  }

  /**
   * Update template version
   */
  updateTemplateVersion(
    id: string,
    newVersion: string,
    changes: string[],
    updatedGenerator?: (data?: Record<string, any>) => any
  ): boolean {
    const template = this.getTemplate(id);
    if (!template) {
      return false;
    }

    // Update metadata
    template.metadata.version = newVersion;
    template.metadata.modified = new Date();

    // Update generator if provided
    if (updatedGenerator) {
      template.generator = updatedGenerator;
    }

    // Add version history
    this.versions.get(id)!.push({
      version: newVersion,
      date: new Date(),
      changes,
      author: template.metadata.author
    });

    return true;
  }

  /**
   * Get template version history
   */
  getVersionHistory(id: string): TemplateVersion[] {
    return this.versions.get(id) || [];
  }

  /**
   * Validate template
   */
  validateTemplate(id: string, data?: Record<string, any>): ValidationResult {
    const template = this.getTemplate(id);
    if (!template) {
      return {
        valid: false,
        errors: ['Template not found'],
        warnings: []
      };
    }

    // Use custom validator if provided
    if (template.validator) {
      return template.validator(data);
    }

    // Default validation
    try {
      template.generator(data); // Validate generator works
      return {
        valid: true,
        errors: [],
        warnings: []
      };
    } catch (error: any) {
      return {
        valid: false,
        errors: [error.message],
        warnings: []
      };
    }
  }

  /**
   * Clone template
   */
  cloneTemplate(id: string, newId: string, newName?: string): TemplateDefinition | null {
    const template = this.getTemplate(id);
    if (!template) {
      return null;
    }

    const clonedMetadata = {
      ...template.metadata,
      id: newId,
      name: newName || `${template.metadata.name} (Copy)`,
      version: '1.0.0',
      created: new Date(),
      modified: new Date(),
      baseTemplate: id
    };

    const clonedTemplate: TemplateDefinition = {
      id: clonedMetadata.id,
      name: clonedMetadata.name,
      type: clonedMetadata.type,
      category: clonedMetadata.category,
      description: clonedMetadata.description,
      metadata: clonedMetadata,
      generator: template.generator,
      validator: template.validator
    };

    this.registerTemplate(clonedTemplate);

    return clonedTemplate;
  }

  /**
   * Delete template
   */
  deleteTemplate(id: string): boolean {
    if (!this.templates.has(id)) {
      return false;
    }

    this.templates.delete(id);
    this.versions.delete(id);

    return true;
  }

  /**
   * Get templates by type
   */
  getTemplatesByType(type: TemplateType): TemplateDefinition[] {
    return this.getAllTemplates().filter(t => t.metadata.type === type);
  }

  /**
   * Get templates by category
   */
  getTemplatesByCategory(category: string): TemplateDefinition[] {
    return this.getAllTemplates().filter(t => t.metadata.category === category);
  }

  /**
   * Get templates by tag
   */
  getTemplatesByTag(tag: string): TemplateDefinition[] {
    return this.getAllTemplates().filter(t => t.metadata.tags.includes(tag));
  }

  /**
   * Get template statistics
   */
  getStatistics(): {
    totalTemplates: number;
    byType: Record<TemplateType, number>;
    byCategory: Record<string, number>;
    totalVersions: number;
  } {
    const templates = this.getAllTemplates();

    const byType: Record<TemplateType, number> = {
      powerpoint: 0,
      word: 0,
      excel: 0
    };

    const byCategory: Record<string, number> = {};

    templates.forEach(template => {
      byType[template.metadata.type]++;
      
      const category = template.metadata.category;
      byCategory[category] = (byCategory[category] || 0) + 1;
    });

    const totalVersions = Array.from(this.versions.values())
      .reduce((sum, versions) => sum + versions.length, 0);

    return {
      totalTemplates: templates.length,
      byType,
      byCategory,
      totalVersions
    };
  }

  /**
   * Export template metadata
   */
  exportMetadata(id: string): string | null {
    const template = this.getTemplate(id);
    if (!template) {
      return null;
    }

    return JSON.stringify({
      metadata: template.metadata,
      versions: this.getVersionHistory(id)
    }, null, 2);
  }

  /**
   * Import template metadata
   */
  importMetadata(json: string): boolean {
    try {
      JSON.parse(json); // Validate JSON format
      // Import logic would go here
      return true;
    } catch (error) {
      return false;
    }
  }

  /**
   * Extract tags from description
   */
  private extractTags(description: string): string[] {
    const tags: string[] = [];
    const lowerDesc = description.toLowerCase();

    // Common keywords
    const keywords = [
      'status', 'report', 'executive', 'presentation', 'training',
      'change', 'management', 'technical', 'review', 'quarterly',
      'business', 'project', 'budget', 'kpi', 'dashboard',
      'resource', 'allocation', 'timeline', 'data', 'analysis',
      'white', 'paper', 'charter', 'sop', 'meeting', 'minutes',
      'summary'
    ];

    keywords.forEach(keyword => {
      if (lowerDesc.includes(keyword)) {
        tags.push(keyword);
      }
    });

    return tags;
  }

  /**
   * Categorize template
   */
  private categorizeTemplate(name: string): string {
    const lowerName = name.toLowerCase();

    if (lowerName.includes('status') || lowerName.includes('report')) {
      return 'Reporting';
    }
    if (lowerName.includes('executive') || lowerName.includes('presentation')) {
      return 'Executive';
    }
    if (lowerName.includes('training')) {
      return 'Training';
    }
    if (lowerName.includes('change') || lowerName.includes('management')) {
      return 'Change Management';
    }
    if (lowerName.includes('technical') || lowerName.includes('review')) {
      return 'Technical';
    }
    if (lowerName.includes('quarterly') || lowerName.includes('business')) {
      return 'Business Review';
    }
    if (lowerName.includes('budget') || lowerName.includes('kpi')) {
      return 'Financial';
    }
    if (lowerName.includes('resource') || lowerName.includes('allocation')) {
      return 'Resource Management';
    }
    if (lowerName.includes('data') || lowerName.includes('analysis')) {
      return 'Analytics';
    }
    if (lowerName.includes('white') || lowerName.includes('paper')) {
      return 'Documentation';
    }
    if (lowerName.includes('charter')) {
      return 'Planning';
    }
    if (lowerName.includes('sop') || lowerName.includes('procedure')) {
      return 'Operations';
    }
    if (lowerName.includes('meeting') || lowerName.includes('minutes')) {
      return 'Meetings';
    }
    if (lowerName.includes('process') || lowerName.includes('fishbone') || lowerName.includes('whys')) {
      return 'Process Improvement';
    }

    return 'General';
  }
}

/**
 * Create template library service instance
 */
export function createTemplateLibraryService(): TemplateLibraryService {
  return new TemplateLibraryService();
}
