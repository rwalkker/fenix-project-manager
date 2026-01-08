/**
 * Process Map Types
 */
export interface ProcessMapOptions {
    title: string;
    swimLanes: SwimLane[];
    steps: ProcessStep[];
    decisions: DecisionPoint[];
    connectors: Connector[];
}
export interface SwimLane {
    id: string;
    name: string;
    role: string;
    color?: string;
}
export interface ProcessStep {
    id: string;
    swimLaneId: string;
    text: string;
    type: 'start' | 'end' | 'process' | 'subprocess';
    position: {
        x: number;
        y: number;
    };
}
export interface DecisionPoint {
    id: string;
    swimLaneId: string;
    question: string;
    position: {
        x: number;
        y: number;
    };
    branches: {
        label: string;
        targetId: string;
    }[];
}
export interface Connector {
    id: string;
    fromId: string;
    toId: string;
    label?: string;
}
/**
 * Fishbone Diagram Types
 */
export interface FishboneDiagramOptions {
    problemStatement: string;
    categories: FishboneCategory[];
    title?: string;
}
export interface FishboneCategory {
    name: string;
    causes: FishboneCause[];
    position: 'top' | 'bottom';
}
export interface FishboneCause {
    text: string;
    subCauses?: string[];
}
/**
 * Standard fishbone categories (6M method)
 */
export declare const STANDARD_FISHBONE_CATEGORIES: ({
    name: string;
    position: "top";
} | {
    name: string;
    position: "bottom";
})[];
/**
 * 5 Whys Analysis Types
 */
export interface FiveWhysOptions {
    problemStatement: string;
    categories: WhyCategory[];
    format: 'powerpoint' | 'word' | 'excel';
}
export interface WhyCategory {
    name: 'People' | 'Organizational' | 'Technical';
    whyLevels: WhyLevel[];
}
export interface WhyLevel {
    level: 1 | 2 | 3 | 4 | 5;
    question: string;
    answer?: string;
}
export interface FiveWhysResult {
    problemStatement: string;
    categories: WhyCategory[];
    rootCauses: string[];
    recommendations?: string[];
}
/**
 * Helper function to create empty why levels
 */
export declare function createEmptyWhyLevels(): WhyLevel[];
/**
 * Helper function to validate process map connectors
 */
export declare function validateConnectors(connectors: Connector[], steps: ProcessStep[], decisions: DecisionPoint[]): {
    valid: boolean;
    errors: string[];
};
/**
 * Helper function to validate fishbone categories
 */
export declare function validateFishboneCategories(categories: FishboneCategory[]): {
    valid: boolean;
    errors: string[];
};
/**
 * Helper function to validate 5 Whys structure
 */
export declare function validateFiveWhys(options: FiveWhysOptions): {
    valid: boolean;
    errors: string[];
};
//# sourceMappingURL=process-improvement-types.d.ts.map