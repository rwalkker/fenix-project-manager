"use strict";
// FENIX Project Manager - Enhanced PowerPoint Agent
// Improved PowerPoint generation with better theming support
// Created: January 7, 2026
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnhancedPowerPointAgent = void 0;
const pptxgenjs_1 = __importDefault(require("pptxgenjs"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const PowerPointAgent_1 = require("./PowerPointAgent");
const ColorUtils_1 = require("../utils/ColorUtils");
const enhanced_powerpoint_types_1 = require("../models/enhanced-powerpoint-types");
/**
 * Enhanced PowerPoint Agent with improved theming
 */
class EnhancedPowerPointAgent extends PowerPointAgent_1.PowerPointAgent {
    enhancedTheme;
    constructor(theme) {
        // Call parent constructor with basic theme
        super();
        this.enhancedTheme = theme || enhanced_powerpoint_types_1.ENHANCED_AMAZON_THEME;
        // Validate and format theme colors
        if (!(0, enhanced_powerpoint_types_1.validateTheme)(this.enhancedTheme)) {
            console.warn('Theme validation failed, using default colors');
            this.enhancedTheme = enhanced_powerpoint_types_1.ENHANCED_AMAZON_THEME;
        }
        this.enhancedTheme = (0, enhanced_powerpoint_types_1.formatThemeColors)(this.enhancedTheme);
        console.log(`🎨 Enhanced PowerPoint Agent initialized with theme: ${this.enhancedTheme.name}`);
        console.log(`   Primary: ${this.enhancedTheme.colors.primary}`);
        console.log(`   Secondary: ${this.enhancedTheme.colors.secondary}`);
        console.log(`   Background: ${this.enhancedTheme.colors.background}`);
    }
    /**
     * Generate PowerPoint with enhanced theming
     */
    async generate(options) {
        const startTime = Date.now();
        const warnings = [];
        try {
            console.log('🚀 Starting enhanced PowerPoint generation...');
            // Validate options
            this.validateOptions(options);
            // Create presentation with enhanced settings
            const pptx = new pptxgenjs_1.default();
            // Set metadata
            pptx.author = options.author || 'FENIX Project Manager';
            pptx.title = options.title;
            pptx.subject = options.subject || '';
            pptx.company = options.company || 'Amazon';
            // Apply enhanced theme
            this.applyEnhancedTheme(pptx);
            // Generate slides with enhanced theming
            for (let i = 0; i < options.slides.length; i++) {
                const slideDefinition = options.slides[i];
                try {
                    await this.createEnhancedSlide(pptx, slideDefinition, i + 1);
                }
                catch (error) {
                    warnings.push(`Slide ${i + 1}: ${error.message}`);
                    console.error(`Error creating slide ${i + 1}:`, error);
                }
            }
            // Generate filename
            const fileName = `${options.title.replace(/[^a-z0-9]/gi, '_')}_enhanced_${Date.now()}.pptx`;
            const filePath = path.join(this.outputDir, fileName);
            console.log(`💾 Saving presentation to: ${filePath}`);
            // Write file
            await pptx.writeFile({ fileName: filePath });
            // Get file size
            const stats = fs.statSync(filePath);
            console.log('✅ Enhanced PowerPoint generation completed successfully!');
            return {
                success: true,
                filePath,
                fileName,
                fileSize: stats.size,
                slideCount: options.slides.length,
                generationTime: Date.now() - startTime,
                warnings: warnings.length > 0 ? warnings : undefined
            };
        }
        catch (error) {
            console.error('❌ Enhanced PowerPoint generation error:', error);
            return {
                success: false,
                filePath: '',
                fileName: '',
                fileSize: 0,
                slideCount: 0,
                generationTime: Date.now() - startTime,
                error: error.message,
                warnings
            };
        }
    }
    /**
     * Apply enhanced theme to presentation
     */
    applyEnhancedTheme(pptx) {
        console.log('🎨 Applying enhanced theme...');
        // Set layout
        pptx.defineLayout({
            name: 'ENHANCED_LAYOUT',
            width: 10,
            height: 5.625
        });
        pptx.layout = 'ENHANCED_LAYOUT';
        // Test color application
        console.log('🧪 Testing color formats:');
        console.log(`   Primary color: ${this.enhancedTheme.colors.primary}`);
        console.log(`   Secondary color: ${this.enhancedTheme.colors.secondary}`);
        console.log(`   Background color: ${this.enhancedTheme.colors.background}`);
        // Validate colors are properly formatted
        const colors = [
            this.enhancedTheme.colors.primary,
            this.enhancedTheme.colors.secondary,
            this.enhancedTheme.colors.background
        ];
        colors.forEach(color => {
            if (!ColorUtils_1.ColorUtils.isValidColor(color)) {
                console.warn(`⚠️  Invalid color detected: ${color}`);
            }
        });
    }
    /**
     * Create enhanced slide with better theming
     */
    async createEnhancedSlide(pptx, slideDefinition, slideNumber) {
        console.log(`📄 Creating enhanced slide ${slideNumber}: ${slideDefinition.type}`);
        const slide = pptx.addSlide();
        // Set background with enhanced color handling
        if (slideDefinition.background) {
            this.applyEnhancedBackground(slide, slideDefinition.background);
        }
        else {
            slide.background = { color: this.enhancedTheme.colors.background };
        }
        // Create slide based on type with enhanced theming
        switch (slideDefinition.type) {
            case 'title':
                this.createEnhancedTitleSlide(slide, slideDefinition);
                break;
            case 'section':
                this.createEnhancedSectionSlide(slide, slideDefinition);
                break;
            case 'content':
                this.createEnhancedContentSlide(slide, slideDefinition);
                break;
            case 'two-column':
                this.createEnhancedTwoColumnSlide(slide, slideDefinition);
                break;
            default:
                this.createEnhancedContentSlide(slide, slideDefinition);
        }
        // Add enhanced footer and slide number
        this.addEnhancedFooter(slide, slideNumber);
    }
    /**
     * Create enhanced title slide with better color application
     */
    createEnhancedTitleSlide(slide, definition) {
        console.log('🎯 Creating enhanced title slide');
        // Main title with Amazon orange
        if (definition.title) {
            slide.addText(definition.title, {
                x: '10%',
                y: '35%',
                w: '80%',
                h: '15%',
                fontSize: 44,
                bold: true,
                color: this.enhancedTheme.colors.primary, // Amazon orange
                align: 'center',
                fontFace: this.enhancedTheme.fonts.fallbackTitle || 'Arial' // Use fallback font
            });
            console.log(`   Title color applied: ${this.enhancedTheme.colors.primary}`);
        }
        // Subtitle with dark blue
        if (definition.subtitle) {
            slide.addText(definition.subtitle, {
                x: '10%',
                y: '52%',
                w: '80%',
                h: '10%',
                fontSize: 24,
                color: this.enhancedTheme.colors.secondary, // Amazon dark blue
                align: 'center',
                fontFace: this.enhancedTheme.fonts.fallbackBody || 'Arial'
            });
            console.log(`   Subtitle color applied: ${this.enhancedTheme.colors.secondary}`);
        }
    }
    /**
     * Create enhanced section slide with colored background
     */
    createEnhancedSectionSlide(slide, definition) {
        console.log('🎯 Creating enhanced section slide');
        // Add colored background bar with Amazon orange
        slide.addShape('rect', {
            x: 0,
            y: '40%',
            w: '100%',
            h: '20%',
            fill: { color: this.enhancedTheme.colors.primary } // Amazon orange background
        });
        console.log(`   Section background color: ${this.enhancedTheme.colors.primary}`);
        // Section title with white text on orange background
        if (definition.title) {
            const textColor = ColorUtils_1.ColorUtils.getContrastingTextColor(this.enhancedTheme.colors.primary);
            slide.addText(definition.title, {
                x: '10%',
                y: '42%',
                w: '80%',
                h: '16%',
                fontSize: 36,
                bold: true,
                color: textColor,
                align: 'center',
                fontFace: this.enhancedTheme.fonts.fallbackTitle || 'Arial'
            });
            console.log(`   Section title color: ${textColor} (contrasting with ${this.enhancedTheme.colors.primary})`);
        }
    }
    /**
     * Create enhanced content slide
     */
    createEnhancedContentSlide(slide, definition) {
        console.log('🎯 Creating enhanced content slide');
        // Title with dark blue
        if (definition.title) {
            slide.addText(definition.title, {
                x: '5%',
                y: '5%',
                w: '90%',
                h: '10%',
                fontSize: 32,
                bold: true,
                color: this.enhancedTheme.colors.secondary, // Amazon dark blue
                fontFace: this.enhancedTheme.fonts.fallbackTitle || 'Arial'
            });
            console.log(`   Content title color: ${this.enhancedTheme.colors.secondary}`);
        }
        // Content with enhanced styling
        if (definition.content) {
            let yOffset = 18;
            for (const content of definition.content) {
                yOffset = this.addEnhancedContent(slide, content, yOffset);
            }
        }
    }
    /**
     * Create enhanced two-column slide
     */
    createEnhancedTwoColumnSlide(slide, definition) {
        console.log('🎯 Creating enhanced two-column slide');
        // Title
        if (definition.title) {
            slide.addText(definition.title, {
                x: '5%',
                y: '5%',
                w: '90%',
                h: '10%',
                fontSize: 32,
                bold: true,
                color: this.enhancedTheme.colors.secondary,
                fontFace: this.enhancedTheme.fonts.fallbackTitle || 'Arial'
            });
        }
        // Add column divider line
        slide.addShape('line', {
            x: '50%',
            y: '18%',
            w: 0,
            h: '70%',
            line: { color: this.enhancedTheme.colors.accent, width: 2 }
        });
        // Divide content into two columns
        if (definition.content) {
            const midpoint = Math.ceil(definition.content.length / 2);
            const leftContent = definition.content.slice(0, midpoint);
            const rightContent = definition.content.slice(midpoint);
            // Left column
            let yOffset = 18;
            for (const content of leftContent) {
                yOffset = this.addEnhancedContent(slide, content, yOffset, '5%', '42%');
            }
            // Right column
            yOffset = 18;
            for (const content of rightContent) {
                yOffset = this.addEnhancedContent(slide, content, yOffset, '53%', '42%');
            }
        }
    }
    /**
     * Add enhanced content with better styling
     */
    addEnhancedContent(slide, content, yOffset, xPos = '5%', width = '90%') {
        switch (content.type) {
            case 'text':
                return this.addEnhancedText(slide, content, yOffset, xPos, width);
            case 'bullets':
                return this.addEnhancedBullets(slide, content, yOffset, xPos, width);
            default:
                return yOffset;
        }
    }
    /**
     * Add enhanced text with proper color
     */
    addEnhancedText(slide, content, yOffset, xPos = '5%', width = '90%') {
        slide.addText(content.text, {
            x: xPos,
            y: `${yOffset}%`,
            w: width,
            h: '8%',
            fontSize: content.style?.size || 18,
            color: content.style?.color || this.enhancedTheme.colors.text,
            bold: content.style?.bold,
            italic: content.style?.italic,
            fontFace: this.enhancedTheme.fonts.fallbackBody || 'Arial'
        });
        return yOffset + 10;
    }
    /**
     * Add enhanced bullet list with proper styling
     */
    addEnhancedBullets(slide, content, yOffset, xPos = '5%', width = '90%') {
        const bullets = content.items.map((item) => ({
            text: item.text,
            options: {
                bullet: true,
                indentLevel: item.level || 0
            }
        }));
        slide.addText(bullets, {
            x: xPos,
            y: `${yOffset}%`,
            w: width,
            h: `${Math.min(60, bullets.length * 8)}%`,
            fontSize: 16,
            color: this.enhancedTheme.colors.text,
            fontFace: this.enhancedTheme.fonts.fallbackBody || 'Arial'
        });
        return yOffset + Math.min(60, bullets.length * 8) + 2;
    }
    /**
     * Apply enhanced background
     */
    applyEnhancedBackground(slide, background) {
        if (background.type === 'solid') {
            const color = ColorUtils_1.ColorUtils.getPptxColor(background.color);
            slide.background = { color };
            console.log(`   Background color applied: ${color}`);
        }
        else if (background.type === 'image' && background.image) {
            slide.background = { path: background.image };
        }
    }
    /**
     * Add enhanced footer and slide number
     */
    addEnhancedFooter(slide, slideNumber) {
        // Add footer if configured
        if (this.enhancedTheme.masterSlide?.footer) {
            const footer = this.enhancedTheme.masterSlide.footer;
            slide.addText(footer.text, {
                x: footer.position.x,
                y: footer.position.y,
                w: '30%',
                h: '4%',
                fontSize: footer.style.size,
                color: footer.style.color,
                fontFace: this.enhancedTheme.fonts.fallbackBody || 'Arial'
            });
        }
        // Add slide number if configured
        if (this.enhancedTheme.masterSlide?.slideNumber?.show) {
            const slideNum = this.enhancedTheme.masterSlide.slideNumber;
            slide.addText(slideNumber.toString(), {
                x: slideNum.position.x,
                y: slideNum.position.y,
                w: '5%',
                h: '4%',
                fontSize: slideNum.style.size,
                color: slideNum.style.color,
                align: 'right',
                fontFace: this.enhancedTheme.fonts.fallbackBody || 'Arial'
            });
        }
    }
    /**
     * Get current theme
     */
    getTheme() {
        return this.enhancedTheme;
    }
    /**
     * Set new theme
     */
    setTheme(theme) {
        if ((0, enhanced_powerpoint_types_1.validateTheme)(theme)) {
            this.enhancedTheme = (0, enhanced_powerpoint_types_1.formatThemeColors)(theme);
            console.log(`🎨 Theme changed to: ${this.enhancedTheme.name}`);
        }
        else {
            console.warn('Invalid theme provided, keeping current theme');
        }
    }
}
exports.EnhancedPowerPointAgent = EnhancedPowerPointAgent;
//# sourceMappingURL=EnhancedPowerPointAgent.js.map