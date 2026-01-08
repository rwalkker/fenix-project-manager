export interface MacroDefinition {
    name: string;
    description: string;
    code: string;
    category: 'data-processing' | 'formatting' | 'automation' | 'analysis' | 'utility';
    parameters?: Array<{
        name: string;
        type: 'string' | 'number' | 'boolean' | 'range';
        description: string;
        required: boolean;
    }>;
    usage: string;
    example: string;
}
export interface MacroTemplate {
    id: string;
    name: string;
    description: string;
    category: string;
    generate: (params: Record<string, any>) => MacroDefinition;
}
/**
 * Macro Builder Service
 * Generates VBA macros for Excel automation
 */
export declare class MacroBuilderService {
    private templates;
    constructor();
    /**
     * Initialize macro templates
     */
    private initializeTemplates;
    /**
     * Generate validation code based on type
     */
    private generateValidationCode;
    /**
     * Get all available macro templates
     */
    getTemplates(): MacroTemplate[];
    /**
     * Get template by ID
     */
    getTemplate(id: string): MacroTemplate | undefined;
    /**
     * Generate macro from template
     */
    generateMacro(templateId: string, params?: Record<string, any>): MacroDefinition | null;
    /**
     * Generate custom macro from natural language description
     */
    generateCustomMacro(description: string): MacroDefinition;
    /**
     * Get macro categories
     */
    getCategories(): string[];
    /**
     * Get templates by category
     */
    getTemplatesByCategory(category: string): MacroTemplate[];
    /**
     * Validate macro code
     */
    validateMacroCode(code: string): {
        valid: boolean;
        errors: string[];
        warnings: string[];
    };
}
//# sourceMappingURL=MacroBuilderService.d.ts.map