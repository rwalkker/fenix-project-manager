"use strict";
// FENIX Project Manager - Process Improvement Templates
// Template definitions for process maps, fishbone diagrams, and 5 Whys analysis
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProcessMapTemplate = getProcessMapTemplate;
exports.getFishboneTemplate = getFishboneTemplate;
exports.getFiveWhysTemplate = getFiveWhysTemplate;
exports.listProcessImprovementTemplates = listProcessImprovementTemplates;
exports.getProcessImprovementTemplate = getProcessImprovementTemplate;
exports.getTemplateMetadata = getTemplateMetadata;
exports.createCustomProcessMap = createCustomProcessMap;
exports.createCustomFishbone = createCustomFishbone;
exports.createCustomFiveWhys = createCustomFiveWhys;
const process_improvement_types_1 = require("../models/process-improvement-types");
/**
 * Get process map template
 */
function getProcessMapTemplate() {
    return {
        title: 'Process Map',
        swimLanes: [
            {
                id: 'lane1',
                name: 'Customer',
                role: 'External',
                color: '#FF9900' // Amazon Orange
            },
            {
                id: 'lane2',
                name: 'Operations',
                role: 'Internal',
                color: '#146EB4' // Amazon Blue
            },
            {
                id: 'lane3',
                name: 'Support',
                role: 'Internal',
                color: '#232F3E' // Amazon Dark
            }
        ],
        steps: [
            {
                id: 'start',
                swimLaneId: 'lane1',
                text: 'Start',
                type: 'start',
                position: { x: 100, y: 100 }
            },
            {
                id: 'step1',
                swimLaneId: 'lane1',
                text: 'Submit Request',
                type: 'process',
                position: { x: 250, y: 100 }
            },
            {
                id: 'step2',
                swimLaneId: 'lane2',
                text: 'Review Request',
                type: 'process',
                position: { x: 250, y: 250 }
            },
            {
                id: 'decision1',
                swimLaneId: 'lane2',
                text: 'Approved?',
                type: 'process',
                position: { x: 400, y: 250 }
            },
            {
                id: 'step3',
                swimLaneId: 'lane2',
                text: 'Process Request',
                type: 'process',
                position: { x: 550, y: 250 }
            },
            {
                id: 'step4',
                swimLaneId: 'lane3',
                text: 'Provide Support',
                type: 'subprocess',
                position: { x: 550, y: 400 }
            },
            {
                id: 'end',
                swimLaneId: 'lane1',
                text: 'End',
                type: 'end',
                position: { x: 700, y: 100 }
            }
        ],
        decisions: [
            {
                id: 'decision1',
                swimLaneId: 'lane2',
                question: 'Request Approved?',
                position: { x: 400, y: 250 },
                branches: [
                    { label: 'Yes', targetId: 'step3' },
                    { label: 'No', targetId: 'end' }
                ]
            }
        ],
        connectors: [
            { id: 'conn1', fromId: 'start', toId: 'step1', label: '' },
            { id: 'conn2', fromId: 'step1', toId: 'step2', label: '' },
            { id: 'conn3', fromId: 'step2', toId: 'decision1', label: '' },
            { id: 'conn4', fromId: 'decision1', toId: 'step3', label: 'Yes' },
            { id: 'conn5', fromId: 'decision1', toId: 'end', label: 'No' },
            { id: 'conn6', fromId: 'step3', toId: 'step4', label: '' },
            { id: 'conn7', fromId: 'step4', toId: 'end', label: '' }
        ]
    };
}
/**
 * Get fishbone diagram template
 */
function getFishboneTemplate() {
    return {
        problemStatement: 'Problem Statement: [Describe the problem or effect here]',
        title: 'Fishbone Diagram (Ishikawa)',
        categories: process_improvement_types_1.STANDARD_FISHBONE_CATEGORIES.map(cat => ({
            name: cat.name,
            position: cat.position,
            causes: [
                {
                    text: `Primary ${cat.name.toLowerCase()} cause`,
                    subCauses: [
                        'Contributing factor 1',
                        'Contributing factor 2'
                    ]
                },
                {
                    text: `Secondary ${cat.name.toLowerCase()} cause`,
                    subCauses: []
                }
            ]
        }))
    };
}
/**
 * Get 5 Whys template
 */
function getFiveWhysTemplate() {
    return {
        problemStatement: 'Problem Statement: [Describe the problem here]',
        format: 'powerpoint',
        categories: [
            { name: 'People', whyLevels: (0, process_improvement_types_1.createEmptyWhyLevels)() },
            { name: 'Organizational', whyLevels: (0, process_improvement_types_1.createEmptyWhyLevels)() },
            { name: 'Technical', whyLevels: (0, process_improvement_types_1.createEmptyWhyLevels)() }
        ]
    };
}
/**
 * List all process improvement templates
 */
function listProcessImprovementTemplates() {
    return ['process-map', 'fishbone-diagram', '5-whys'];
}
/**
 * Get process improvement template by type
 */
function getProcessImprovementTemplate(type) {
    switch (type) {
        case 'process-map':
            return getProcessMapTemplate();
        case 'fishbone-diagram':
        case 'fishbone':
        case 'ishikawa':
            return getFishboneTemplate();
        case '5-whys':
        case 'five-whys':
        case '5whys':
            return getFiveWhysTemplate();
        default:
            throw new Error(`Unknown process improvement template: ${type}`);
    }
}
/**
 * Get template metadata
 */
function getTemplateMetadata(type) {
    switch (type) {
        case 'process-map':
            return {
                id: 'process-map',
                name: 'Process Map',
                description: 'Visual workflow diagram with swim lanes, steps, and decision points',
                category: 'process-improvement',
                type: 'powerpoint'
            };
        case 'fishbone-diagram':
        case 'fishbone':
        case 'ishikawa':
            return {
                id: 'fishbone-diagram',
                name: 'Fishbone Diagram (Ishikawa)',
                description: 'Cause-and-effect analysis diagram using the 6M method',
                category: 'process-improvement',
                type: 'powerpoint'
            };
        case '5-whys':
        case 'five-whys':
        case '5whys':
            return {
                id: '5-whys',
                name: '5 Whys Analysis',
                description: 'Root cause analysis using five levels of "why" questions across People, Organizational, and Technical categories',
                category: 'process-improvement',
                type: 'powerpoint'
            };
        default:
            throw new Error(`Unknown process improvement template: ${type}`);
    }
}
/**
 * Create custom process map with specified swim lanes
 */
function createCustomProcessMap(title, swimLanes) {
    const template = getProcessMapTemplate();
    return {
        ...template,
        title,
        swimLanes: swimLanes.map((lane, index) => ({
            id: `lane${index + 1}`,
            name: lane.name,
            role: lane.role,
            color: lane.color
        })),
        steps: [],
        decisions: [],
        connectors: []
    };
}
/**
 * Create custom fishbone with specified categories
 */
function createCustomFishbone(problemStatement, categories) {
    const positions = [];
    // Alternate between top and bottom
    categories.forEach((_, index) => {
        positions.push(index % 2 === 0 ? 'top' : 'bottom');
    });
    return {
        problemStatement,
        title: 'Fishbone Diagram',
        categories: categories.map((name, index) => ({
            name,
            position: positions[index],
            causes: [
                { text: `Primary ${name.toLowerCase()} cause`, subCauses: [] }
            ]
        }))
    };
}
/**
 * Create custom 5 Whys with specified format
 */
function createCustomFiveWhys(problemStatement, format) {
    const template = getFiveWhysTemplate();
    return {
        ...template,
        problemStatement,
        format
    };
}
//# sourceMappingURL=process-improvement-templates.js.map