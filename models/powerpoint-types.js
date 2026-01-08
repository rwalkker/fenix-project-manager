"use strict";
// FENIX Project Manager - PowerPoint Types
// Type definitions for PowerPoint presentation generation
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.AMAZON_POWERPOINT_THEME = void 0;
/**
 * Amazon PowerPoint Theme
 */
exports.AMAZON_POWERPOINT_THEME = {
    name: 'Amazon',
    colors: {
        primary: '#FF9900',
        secondary: '#232F3E',
        accent: '#146EB4',
        background: '#FFFFFF',
        text: '#000000'
    },
    fonts: {
        title: 'Amazon Ember',
        body: 'Amazon Ember'
    },
    masterSlide: {
        background: {
            type: 'solid',
            color: '#FFFFFF'
        },
        footer: {
            text: 'Amazon Confidential',
            position: { x: '5%', y: '95%' },
            style: {
                font: 'Amazon Ember',
                size: 10,
                color: '#666666'
            }
        },
        slideNumber: {
            show: true,
            position: { x: '95%', y: '95%' },
            style: {
                font: 'Amazon Ember',
                size: 10,
                color: '#666666'
            }
        }
    }
};
//# sourceMappingURL=powerpoint-types.js.map