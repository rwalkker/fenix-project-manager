import type { PowerPointOptions, PowerPointTemplateType } from '../models/powerpoint-types';
/**
 * Get PowerPoint template by type
 */
export declare function getPowerPointTemplate(type: PowerPointTemplateType, data?: Record<string, any>): PowerPointOptions;
/**
 * List all available templates
 */
export declare function listPowerPointTemplates(): Array<{
    id: PowerPointTemplateType;
    name: string;
    description: string;
    slideCount: number;
}>;
//# sourceMappingURL=powerpoint-templates.d.ts.map