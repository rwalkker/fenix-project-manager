"use strict";
// FENIX Project Manager - Excel Types
// Type definitions for Excel workbook generation
// Created: January 5, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.AMAZON_EXCEL_THEME = void 0;
// Pre-defined Amazon theme with enhanced color handling
exports.AMAZON_EXCEL_THEME = {
    name: 'Amazon Enhanced',
    colorScheme: {
        primary: '#FF9900', // Amazon orange (will be converted to ARGB)
        secondary: '#232F3E', // Amazon dark blue
        accent: '#146EB4', // Amazon light blue
        background: '#FFFFFF', // White
        text: '#000000', // Black
        success: '#067D62', // Amazon green
        warning: '#F0B323', // Amazon yellow
        error: '#D13212' // Amazon red
    },
    fonts: {
        heading: 'Arial', // Use Arial as fallback instead of Amazon Ember
        body: 'Arial' // Use Arial as fallback instead of Amazon Ember
    },
    headerStyle: {
        font: {
            name: 'Arial',
            size: 11,
            bold: true,
            color: '#FFFFFF'
        },
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: '#FF9900' // Amazon orange (will be converted to ARGB)
        },
        alignment: {
            horizontal: 'center',
            vertical: 'middle'
        }
    },
    dataStyle: {
        font: {
            name: 'Arial',
            size: 10,
            color: '#000000'
        },
        alignment: {
            horizontal: 'left',
            vertical: 'middle'
        }
    },
    totalStyle: {
        font: {
            name: 'Arial',
            size: 10,
            bold: true,
            color: '#232F3E' // Amazon dark blue
        },
        fill: {
            type: 'pattern',
            pattern: 'solid',
            fgColor: '#F0F0F0' // Light gray
        },
        alignment: {
            horizontal: 'right',
            vertical: 'middle'
        }
    }
};
//# sourceMappingURL=excel-types.js.map