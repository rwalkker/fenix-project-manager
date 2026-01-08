import type { WordDocumentOptions } from '../models/word-types';
import { WordTemplateType } from '../models/word-types';
/**
 * Get Word template by type
 */
export declare function getWordTemplate(type: WordTemplateType, data?: Record<string, any>): WordDocumentOptions;
/**
 * List all available templates
 */
export declare function listWordTemplates(): Array<{
    id: WordTemplateType;
    name: string;
    description: string;
}>;
//# sourceMappingURL=word-templates.d.ts.map