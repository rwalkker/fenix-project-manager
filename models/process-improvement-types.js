"use strict";
// FENIX Project Manager - Process Improvement Types
// Type definitions for process maps, fishbone diagrams, and 5 Whys analysis
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.STANDARD_FISHBONE_CATEGORIES = void 0;
exports.createEmptyWhyLevels = createEmptyWhyLevels;
exports.validateConnectors = validateConnectors;
exports.validateFishboneCategories = validateFishboneCategories;
exports.validateFiveWhys = validateFiveWhys;
/**
 * Standard fishbone categories (6M method)
 */
exports.STANDARD_FISHBONE_CATEGORIES = [
    { name: 'People', position: 'top' },
    { name: 'Process', position: 'bottom' },
    { name: 'Technology', position: 'top' },
    { name: 'Environment', position: 'bottom' },
    { name: 'Materials', position: 'top' },
    { name: 'Measurement', position: 'bottom' }
];
/**
 * Helper function to create empty why levels
 */
function createEmptyWhyLevels() {
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
function validateConnectors(connectors, steps, decisions) {
    const errors = [];
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
function validateFishboneCategories(categories) {
    const errors = [];
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
function validateFiveWhys(options) {
    const errors = [];
    if (!options.problemStatement || options.problemStatement.trim() === '') {
        errors.push('Problem statement is required');
    }
    if (options.categories.length !== 3) {
        errors.push('Exactly 3 categories required (People, Organizational, Technical)');
    }
    const requiredCategories = [
        'People',
        'Organizational',
        'Technical'
    ];
    requiredCategories.forEach(reqCat => {
        const found = options.categories.find(c => c.name === reqCat);
        if (!found) {
            errors.push(`Missing required category: ${reqCat}`);
        }
        else if (found.whyLevels.length !== 5) {
            errors.push(`Category "${reqCat}": must have exactly 5 why levels`);
        }
        else {
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
//# sourceMappingURL=process-improvement-types.js.map