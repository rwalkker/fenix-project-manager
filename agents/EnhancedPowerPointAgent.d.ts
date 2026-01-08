import { PowerPointAgent } from './PowerPointAgent';
import { EnhancedPowerPointTheme } from '../models/enhanced-powerpoint-types';
import type { PowerPointOptions, PowerPointGenerationResult } from '../models/powerpoint-types';
/**
 * Enhanced PowerPoint Agent with improved theming
 */
export declare class EnhancedPowerPointAgent extends PowerPointAgent {
    private enhancedTheme;
    constructor(theme?: EnhancedPowerPointTheme);
    /**
     * Generate PowerPoint with enhanced theming
     */
    generate(options: PowerPointOptions): Promise<PowerPointGenerationResult>;
    /**
     * Apply enhanced theme to presentation
     */
    private applyEnhancedTheme;
    /**
     * Create enhanced slide with better theming
     */
    private createEnhancedSlide;
    /**
     * Create enhanced title slide with better color application
     */
    private createEnhancedTitleSlide;
    /**
     * Create enhanced section slide with colored background
     */
    private createEnhancedSectionSlide;
    /**
     * Create enhanced content slide
     */
    private createEnhancedContentSlide;
    /**
     * Create enhanced two-column slide
     */
    private createEnhancedTwoColumnSlide;
    /**
     * Add enhanced content with better styling
     */
    private addEnhancedContent;
    /**
     * Add enhanced text with proper color
     */
    private addEnhancedText;
    /**
     * Add enhanced bullet list with proper styling
     */
    private addEnhancedBullets;
    /**
     * Apply enhanced background
     */
    private applyEnhancedBackground;
    /**
     * Add enhanced footer and slide number
     */
    private addEnhancedFooter;
    /**
     * Get current theme
     */
    getTheme(): EnhancedPowerPointTheme;
    /**
     * Set new theme
     */
    setTheme(theme: EnhancedPowerPointTheme): void;
}
//# sourceMappingURL=EnhancedPowerPointAgent.d.ts.map