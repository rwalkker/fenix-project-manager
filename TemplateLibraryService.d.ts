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
    baseTemplate?: string;
    components?: string[];
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
export declare class TemplateLibraryService {
    private templates;
    private versions;
    constructor();
    /**
     * Initialize built-in templates
     */
    private initializeTemplates;
    /**
     * Register a new template
     */
    registerTemplate(definition: TemplateDefinition): void;
    /**
     * Get template by ID
     */
    getTemplate(id: string): TemplateDefinition | undefined;
    /**
     * Get all templates
     */
    getAllTemplates(): TemplateDefinition[];
    /**
     * Search templates
     */
    searchTemplates(criteria: TemplateSearchCriteria): TemplateDefinition[];
    /**
     * Create template from inheritance
     */
    createFromBase(baseId: string, customizations: Partial<TemplateMetadata>): TemplateDefinition | null;
    /**
     * Compose template from multiple components
     */
    composeTemplate(options: CompositionOptions, metadata: Partial<TemplateMetadata>): TemplateDefinition | null;
    /**
     * Update template version
     */
    updateTemplateVersion(id: string, newVersion: string, changes: string[], updatedGenerator?: (data?: Record<string, any>) => any): boolean;
    /**
     * Get template version history
     */
    getVersionHistory(id: string): TemplateVersion[];
    /**
     * Validate template
     */
    validateTemplate(id: string, data?: Record<string, any>): ValidationResult;
    /**
     * Clone template
     */
    cloneTemplate(id: string, newId: string, newName?: string): TemplateDefinition | null;
    /**
     * Delete template
     */
    deleteTemplate(id: string): boolean;
    /**
     * Get templates by type
     */
    getTemplatesByType(type: TemplateType): TemplateDefinition[];
    /**
     * Get templates by category
     */
    getTemplatesByCategory(category: string): TemplateDefinition[];
    /**
     * Get templates by tag
     */
    getTemplatesByTag(tag: string): TemplateDefinition[];
    /**
     * Get template statistics
     */
    getStatistics(): {
        totalTemplates: number;
        byType: Record<TemplateType, number>;
        byCategory: Record<string, number>;
        totalVersions: number;
    };
    /**
     * Export template metadata
     */
    exportMetadata(id: string): string | null;
    /**
     * Import template metadata
     */
    importMetadata(json: string): boolean;
    /**
     * Extract tags from description
     */
    private extractTags;
    /**
     * Categorize template
     */
    private categorizeTemplate;
}
/**
 * Create template library service instance
 */
export declare function createTemplateLibraryService(): TemplateLibraryService;
//# sourceMappingURL=TemplateLibraryService.d.ts.map