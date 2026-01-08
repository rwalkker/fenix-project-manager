// FENIX Project Manager - Process Improvement Types
// Type definitions for process maps, fishbone diagrams, and 5 Whys analysis
// Created: January 6, 2026

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
  position: { x: number; y: number };
}

export interface DecisionPoint {
  id: string;
  swimLaneId: string;
  question: string;
  position: { x: number; y: number };
  branches: { label: string; targetId: string }[];
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
export const STANDARD_FISHBONE_CATEGORIES = [
  { name: 'People', position: 'top' as const },
  { name: 'Process', position: 'bottom' as const },
  { name: 'Technology', position: 'top' as const },
  { name: 'Environment', position: 'bottom' as const },
  { name: 'Materials', position: 'top' as const },
  { name: 'Measurement', position: 'bottom' as const }
];

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
export function createEmptyWhyLevels(): WhyLevel[] {
  return [
    { level: 1, question: 'Why did this problem occur?' },
    { level: 2, question: 'Why did that happen?' },
    { level: 3, question: 'Why did that happen?' },
    { level: 4, question: 'Why did that happen?' },
    { level: 5, question: 'Why did that happen?' }
  ];
}

/**
 * Helper function to validate process map connectors
 */
export function validateConnectors(
  connectors: Connector[],
  steps: ProcessStep[],
  decisions: DecisionPoint[]
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const allIds = new Set([
    ...steps.map(s => s.id),
    ...decisions.map(d => d.id)
  ]);

  connectors.forEach(connector => {
    if (!allIds.has(connector.fromId)) {
      errors.push(`Connector ${connector.id}: fromId "${connector.fromId}" does not exist`);
    }
    if (!allIds.has(connector.toId)) {
      errors.push(`Connector ${connector.id}: toId "${connector.toId}" does not exist`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Helper function to validate fishbone categories
 */
export function validateFishboneCategories(categories: FishboneCategory[]): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (categories.length === 0) {
    errors.push('At least one category is required');
  }

  const topCount = categories.filter(c => c.position === 'top').length;
  const bottomCount = categories.filter(c => c.position === 'bottom').length;

  if (Math.abs(topCount - bottomCount) > 1) {
    errors.push('Categories should be balanced between top and bottom positions');
  }

  categories.forEach((cat, index) => {
    if (!cat.name || cat.name.trim() === '') {
      errors.push(`Category ${index}: name is required`);
    }
    if (!cat.causes || cat.causes.length === 0) {
      errors.push(`Category "${cat.name}": at least one cause is required`);
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Helper function to validate 5 Whys structure
 */
export function validateFiveWhys(options: FiveWhysOptions): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!options.problemStatement || options.problemStatement.trim() === '') {
    errors.push('Problem statement is required');
  }

  if (options.categories.length !== 3) {
    errors.push('Exactly 3 categories required (People, Organizational, Technical)');
  }

  const requiredCategories: Array<'People' | 'Organizational' | 'Technical'> = [
    'People',
    'Organizational',
    'Technical'
  ];

  requiredCategories.forEach(reqCat => {
    const found = options.categories.find(c => c.name === reqCat);
    if (!found) {
      errors.push(`Missing required category: ${reqCat}`);
    } else if (found.whyLevels.length !== 5) {
      errors.push(`Category "${reqCat}": must have exactly 5 why levels`);
    } else {
      // Validate level numbers
      const levels = found.whyLevels.map(w => w.level).sort();
      const expectedLevels = [1, 2, 3, 4, 5];
      if (JSON.stringify(levels) !== JSON.stringify(expectedLevels)) {
        errors.push(`Category "${reqCat}": why levels must be numbered 1-5`);
      }
    }
  });

  return {
    valid: errors.length === 0,
    errors
  };
}
