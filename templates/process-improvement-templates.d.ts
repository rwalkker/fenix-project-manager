import type { ProcessMapOptions, FishboneDiagramOptions, FiveWhysOptions } from '../models/process-improvement-types';
/**
 * Get process map template
 */
export declare function getProcessMapTemplate(): ProcessMapOptions;
/**
 * Get fishbone diagram template
 */
export declare function getFishboneTemplate(): FishboneDiagramOptions;
/**
 * Get 5 Whys template
 */
export declare function getFiveWhysTemplate(): FiveWhysOptions;
/**
 * List all process improvement templates
 */
export declare function listProcessImprovementTemplates(): string[];
/**
 * Get process improvement template by type
 */
export declare function getProcessImprovementTemplate(type: string): ProcessMapOptions | FishboneDiagramOptions | FiveWhysOptions;
/**
 * Get template metadata
 */
export declare function getTemplateMetadata(type: string): {
    id: string;
    name: string;
    description: string;
    category: string;
    type: 'powerpoint' | 'word' | 'excel';
};
/**
 * Create custom process map with specified swim lanes
 */
export declare function createCustomProcessMap(title: string, swimLanes: Array<{
    name: string;
    role: string;
    color?: string;
}>): ProcessMapOptions;
/**
 * Create custom fishbone with specified categories
 */
export declare function createCustomFishbone(problemStatement: string, categories: string[]): FishboneDiagramOptions;
/**
 * Create custom 5 Whys with specified format
 */
export declare function createCustomFiveWhys(problemStatement: string, format: 'powerpoint' | 'word' | 'excel'): FiveWhysOptions;
//# sourceMappingURL=process-improvement-templates.d.ts.map