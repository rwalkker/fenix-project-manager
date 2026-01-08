"use strict";
// FENIX Project Manager - Word Types
// Type definitions for Word document generation
// Created: January 5, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.WordTemplateType = exports.AMAZON_WORD_THEME = void 0;
// Pre-defined Amazon theme for Word
exports.AMAZON_WORD_THEME = {
    name: 'Amazon',
    colorScheme: {
        primary: '#FF9900',
        secondary: '#232F3E',
        accent: '#146EB4',
        background: '#FFFFFF',
        text: '#000000',
        success: '#067D62',
        warning: '#F0B323',
        error: '#D13212'
    },
    fonts: {
        heading: 'Amazon Ember',
        body: 'Amazon Ember',
        code: 'Courier New'
    },
    headingStyles: {
        1: {
            font: 'Amazon Ember',
            size: 28,
            bold: true,
            color: '#232F3E'
        },
        2: {
            font: 'Amazon Ember',
            size: 22,
            bold: true,
            color: '#232F3E'
        },
        3: {
            font: 'Amazon Ember',
            size: 18,
            bold: true,
            color: '#146EB4'
        },
        4: {
            font: 'Amazon Ember',
            size: 14,
            bold: true,
            color: '#146EB4'
        },
        5: {
            font: 'Amazon Ember',
            size: 12,
            bold: true,
            color: '#000000'
        },
        6: {
            font: 'Amazon Ember',
            size: 11,
            bold: true,
            italic: true,
            color: '#000000'
        }
    },
    bodyStyle: {
        font: 'Amazon Ember',
        size: 11,
        color: '#000000'
    },
    quoteStyle: {
        font: 'Amazon Ember',
        size: 11,
        italic: true,
        color: '#666666'
    },
    codeStyle: {
        font: 'Courier New',
        size: 10,
        color: '#000000',
        highlight: '#F5F5F5'
    }
};
// Document templates enum
var WordTemplateType;
(function (WordTemplateType) {
    WordTemplateType["WHITE_PAPER"] = "white-paper";
    WordTemplateType["CHANGE_MANAGEMENT"] = "change-management";
    WordTemplateType["PROJECT_CHARTER"] = "project-charter";
    WordTemplateType["SOP"] = "sop";
    WordTemplateType["MEETING_MINUTES"] = "meeting-minutes";
    WordTemplateType["EXECUTIVE_SUMMARY"] = "executive-summary";
    WordTemplateType["TECHNICAL_SPEC"] = "technical-spec";
    WordTemplateType["TRAINING_MANUAL"] = "training-manual";
})(WordTemplateType || (exports.WordTemplateType = WordTemplateType = {}));
//# sourceMappingURL=word-types.js.map