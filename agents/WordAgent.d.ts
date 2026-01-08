import type { WordDocumentOptions, WordGenerationResult, WordTheme } from '../models/word-types';
/**
 * Word Agent - Generates Word documents with AI enhancement
 */
export declare class WordAgent {
    private theme;
    private outputDir;
    private qualityService;
    private validationService;
    constructor(theme?: WordTheme);
    /**
     * Generate Word document
     */
    generate(options: WordDocumentOptions): Promise<WordGenerationResult>;
    /**
     * Create section content
     */
    private createSection;
    /**
     * Create content element
     */
    private createContent;
    /**
     * Create paragraph
     */
    private createParagraph;
    /**
     * Create table
     */
    private createTable;
    /**
     * Create list
     */
    private createList;
    /**
     * Create quote
     */
    private createQuote;
    /**
     * Get heading level
     */
    private getHeadingLevel;
    /**
     * Get alignment
     */
    private getAlignment;
    /**
     * Count words in section
     */
    private countWords;
    /**
     * Generate from template using the comprehensive template system
     */
    generateFromTemplate(templateId: string, title: string, data: any): Promise<WordGenerationResult>;
    /**
     * Save document to file
     */
    save(filePath: string): Promise<void>;
    /**
     * AI-powered content generation
     */
    generateContent(prompt: string, tone?: string, length?: string): Promise<string>;
    /**
     * AI-powered outline generation
     */
    generateOutline(topic: string, sections?: number): Promise<string[]>;
    /**
     * AI-powered grammar and style checking
     */
    checkGrammar(text: string): Promise<string[]>;
    /**
     * AI-powered summarization
     */
    summarize(text: string, maxLength?: number): Promise<string>;
    /**
     * Generate document (orchestrator compatibility method)
     * Wrapper around generate() for AgentOrchestrator
     */
    generateDocument(inputs: any): Promise<any>;
}
/**
 * Create Word agent instance
 */
export declare function createWordAgent(theme?: WordTheme): WordAgent;
//# sourceMappingURL=WordAgent.d.ts.map