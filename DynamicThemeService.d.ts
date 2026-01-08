import type { PowerPointTheme } from '../models/powerpoint-types';
/**
 * Dynamic Theme Configuration
 */
export interface DynamicThemeConfig {
    id: string;
    name: string;
    description: string;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        text: string;
        gradient?: string[];
    };
    fonts: {
        title: string;
        body: string;
    };
    visualElements: {
        backgroundStyle: 'solid' | 'gradient' | 'pattern' | 'geometric';
        accentStyle: 'minimal' | 'bold' | 'creative' | 'corporate';
        iconStyle: 'modern' | 'classic' | 'playful' | 'technical';
        layoutStyle: 'clean' | 'dynamic' | 'artistic' | 'data-focused';
    };
    widgets: ThemeWidget[];
    dataVisualization: {
        chartColors: string[];
        chartStyle: 'modern' | 'classic' | 'vibrant' | 'minimal';
        iconSet: string;
    };
    createdAt: Date;
    usageCount: number;
    userRating?: number;
}
/**
 * Theme Widget Configuration
 */
export interface ThemeWidget {
    type: 'progress-bar' | 'metric-card' | 'timeline' | 'callout' | 'icon-grid' | 'quote-box';
    style: any;
    position: 'header' | 'footer' | 'sidebar' | 'content' | 'overlay';
}
/**
 * Theme Generation Request
 */
export interface ThemeGenerationRequest {
    contentType: 'business' | 'technical' | 'creative' | 'educational' | 'financial' | 'marketing';
    industry?: string;
    mood: 'professional' | 'energetic' | 'calm' | 'innovative' | 'trustworthy' | 'playful';
    audience: 'executive' | 'technical' | 'general' | 'creative' | 'academic';
    keywords: string[];
    userPreferences?: {
        favoriteColors?: string[];
        avoidColors?: string[];
        preferredStyle?: string;
    };
}
/**
 * Dynamic Theme Service
 * Generates creative, AI-powered themes based on content and user input
 */
export declare class DynamicThemeService {
    private bedrock;
    private themeHistory;
    private defaultTheme;
    constructor();
    /**
     * Generate dynamic theme based on content and user preferences
     */
    generateDynamicTheme(request: ThemeGenerationRequest): Promise<DynamicThemeConfig>;
    /**
     * Generate AI-powered theme using Bedrock
     */
    private generateAITheme;
    /**
     * Convert dynamic theme to PowerPoint theme format
     */
    convertToPowerPointTheme(dynamicTheme: DynamicThemeConfig): PowerPointTheme;
    /**
     * Generate theme suggestions based on content analysis
     */
    generateThemeSuggestions(contentText: string, title: string): Promise<ThemeGenerationRequest[]>;
    /**
     * Find similar theme in history
     */
    private findSimilarTheme;
    /**
     * Calculate theme similarity score
     */
    private calculateThemeSimilarity;
    /**
     * Select appropriate font based on content type
     */
    private selectFont;
    /**
     * Select chart style based on mood
     */
    private selectChartStyle;
    /**
     * Select icon set based on style
     */
    private selectIconSet;
    /**
     * Create Amazon default theme
     */
    private createAmazonDefaultTheme;
    /**
     * Get theme history
     */
    getThemeHistory(): DynamicThemeConfig[];
    /**
     * Rate a theme
     */
    rateTheme(themeId: string, rating: number): void;
    /**
     * Load theme history from storage
     */
    private loadThemeHistory;
    /**
     * Save theme history to storage
     */
    private saveThemeHistory;
}
/**
 * Create Dynamic Theme Service instance
 */
export declare function createDynamicThemeService(): DynamicThemeService;
//# sourceMappingURL=DynamicThemeService.d.ts.map