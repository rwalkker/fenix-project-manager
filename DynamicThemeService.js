"use strict";
// FENIX Project Manager - Dynamic Theme Service
// AI-powered creative theming based on content and user preferences
// Created: January 7, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamicThemeService = void 0;
exports.createDynamicThemeService = createDynamicThemeService;
const AWSBedrockService_1 = require("./AWSBedrockService");
/**
 * Dynamic Theme Service
 * Generates creative, AI-powered themes based on content and user input
 */
class DynamicThemeService {
    bedrock;
    themeHistory = new Map();
    defaultTheme;
    constructor() {
        this.bedrock = (0, AWSBedrockService_1.getBedrockService)();
        this.defaultTheme = this.createAmazonDefaultTheme();
        this.loadThemeHistory();
    }
    /**
     * Generate dynamic theme based on content and user preferences
     */
    async generateDynamicTheme(request) {
        console.log('🎨 Generating dynamic theme for:', request.contentType, request.mood);
        try {
            // Check if we have a similar theme in history
            const existingTheme = this.findSimilarTheme(request);
            if (existingTheme) {
                console.log('♻️ Using existing similar theme:', existingTheme.name);
                existingTheme.usageCount++;
                return existingTheme;
            }
            // Generate new creative theme using AI
            const aiTheme = await this.generateAITheme(request);
            // Save to history
            this.themeHistory.set(aiTheme.id, aiTheme);
            this.saveThemeHistory();
            console.log('✨ Generated new dynamic theme:', aiTheme.name);
            return aiTheme;
        }
        catch (error) {
            console.error('Failed to generate dynamic theme:', error);
            console.log('🔄 Falling back to Amazon default theme');
            return this.defaultTheme;
        }
    }
    /**
     * Generate AI-powered theme using Bedrock
     */
    async generateAITheme(request) {
        const prompt = `Create a highly creative and visually stunning presentation theme based on these requirements:

Content Type: ${request.contentType}
Industry: ${request.industry || 'General'}
Mood: ${request.mood}
Audience: ${request.audience}
Keywords: ${request.keywords.join(', ')}

Generate a comprehensive theme with:
1. Creative name and description
2. Color palette (5 colors: primary, secondary, accent, background, text)
3. Optional gradient colors for backgrounds
4. Visual style preferences
5. Widget suggestions for enhanced interactivity
6. Data visualization colors (5 colors for charts)

Make it visually striking, professional, and perfectly suited to the content type and mood.
Be creative with color combinations while maintaining readability and professionalism.

Format as JSON:
{
  "name": "Creative Theme Name",
  "description": "Brief description of the theme's visual approach",
  "colors": {
    "primary": "#HEX",
    "secondary": "#HEX", 
    "accent": "#HEX",
    "background": "#HEX",
    "text": "#HEX",
    "gradient": ["#HEX1", "#HEX2", "#HEX3"]
  },
  "visualElements": {
    "backgroundStyle": "gradient|solid|pattern|geometric",
    "accentStyle": "minimal|bold|creative|corporate", 
    "iconStyle": "modern|classic|playful|technical",
    "layoutStyle": "clean|dynamic|artistic|data-focused"
  },
  "widgets": [
    {
      "type": "progress-bar|metric-card|timeline|callout|icon-grid|quote-box",
      "position": "header|footer|sidebar|content|overlay"
    }
  ],
  "chartColors": ["#HEX1", "#HEX2", "#HEX3", "#HEX4", "#HEX5"]
}`;
        const response = await this.bedrock.invoke({
            prompt,
            maxTokens: 1000,
            temperature: 0.8 // Higher creativity
        });
        const aiData = JSON.parse(response.completion);
        // Create full theme configuration
        const themeConfig = {
            id: `theme-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`,
            name: aiData.name,
            description: aiData.description,
            colors: aiData.colors,
            fonts: {
                title: this.selectFont(request.contentType, 'title'),
                body: this.selectFont(request.contentType, 'body')
            },
            visualElements: aiData.visualElements,
            widgets: aiData.widgets || [],
            dataVisualization: {
                chartColors: aiData.chartColors,
                chartStyle: this.selectChartStyle(request.mood),
                iconSet: this.selectIconSet(aiData.visualElements.iconStyle)
            },
            createdAt: new Date(),
            usageCount: 1
        };
        return themeConfig;
    }
    /**
     * Convert dynamic theme to PowerPoint theme format
     */
    convertToPowerPointTheme(dynamicTheme) {
        return {
            name: dynamicTheme.name,
            colors: {
                primary: dynamicTheme.colors.primary,
                secondary: dynamicTheme.colors.secondary,
                accent: dynamicTheme.colors.accent,
                background: dynamicTheme.colors.background,
                text: dynamicTheme.colors.text
            },
            fonts: dynamicTheme.fonts,
            // Remove master slide configuration as requested
            masterSlide: undefined
        };
    }
    /**
     * Generate theme suggestions based on content analysis
     */
    async generateThemeSuggestions(contentText, title) {
        const prompt = `Analyze this presentation content and suggest 3 different theme approaches:

Title: ${title}
Content: ${contentText.substring(0, 500)}...

For each theme suggestion, determine:
- Content type (business/technical/creative/educational/financial/marketing)
- Industry (if identifiable)
- Appropriate mood (professional/energetic/calm/innovative/trustworthy/playful)
- Target audience (executive/technical/general/creative/academic)
- Key themes and keywords

Format as JSON array:
[
  {
    "contentType": "business",
    "industry": "technology", 
    "mood": "innovative",
    "audience": "executive",
    "keywords": ["innovation", "growth", "technology"],
    "reasoning": "Why this theme fits the content"
  }
]`;
        try {
            const response = await this.bedrock.invoke({
                prompt,
                maxTokens: 600,
                temperature: 0.7
            });
            const suggestions = JSON.parse(response.completion);
            return suggestions.map((s) => ({
                contentType: s.contentType,
                industry: s.industry,
                mood: s.mood,
                audience: s.audience,
                keywords: s.keywords
            }));
        }
        catch (error) {
            console.error('Failed to generate theme suggestions:', error);
            // Return default business theme
            return [{
                    contentType: 'business',
                    mood: 'professional',
                    audience: 'executive',
                    keywords: ['business', 'professional', 'corporate']
                }];
        }
    }
    /**
     * Find similar theme in history
     */
    findSimilarTheme(request) {
        for (const theme of this.themeHistory.values()) {
            // Simple similarity check based on content type and mood
            const similarity = this.calculateThemeSimilarity(theme, request);
            if (similarity > 0.7) {
                return theme;
            }
        }
        return null;
    }
    /**
     * Calculate theme similarity score
     */
    calculateThemeSimilarity(theme, request) {
        let score = 0;
        // Check description for content type and mood keywords
        const description = theme.description.toLowerCase();
        if (description.includes(request.contentType))
            score += 0.3;
        if (description.includes(request.mood))
            score += 0.3;
        if (request.industry && description.includes(request.industry.toLowerCase()))
            score += 0.2;
        // Check keyword overlap
        const keywordOverlap = request.keywords.filter(keyword => description.includes(keyword.toLowerCase())).length;
        score += (keywordOverlap / request.keywords.length) * 0.2;
        return score;
    }
    /**
     * Select appropriate font based on content type
     */
    selectFont(contentType, fontType) {
        const fontMap = {
            business: { title: 'Segoe UI', body: 'Segoe UI' },
            technical: { title: 'Consolas', body: 'Segoe UI' },
            creative: { title: 'Georgia', body: 'Georgia' },
            educational: { title: 'Times New Roman', body: 'Times New Roman' },
            financial: { title: 'Arial', body: 'Arial' },
            marketing: { title: 'Trebuchet MS', body: 'Trebuchet MS' }
        };
        return fontMap[contentType]?.[fontType] || 'Arial';
    }
    /**
     * Select chart style based on mood
     */
    selectChartStyle(mood) {
        const styleMap = {
            professional: 'classic',
            energetic: 'vibrant',
            calm: 'minimal',
            innovative: 'modern',
            trustworthy: 'classic',
            playful: 'vibrant'
        };
        return styleMap[mood] || 'modern';
    }
    /**
     * Select icon set based on style
     */
    selectIconSet(iconStyle) {
        const iconSets = {
            modern: 'fluent-ui',
            classic: 'office-icons',
            playful: 'emoji-style',
            technical: 'line-icons'
        };
        return iconSets[iconStyle] || 'fluent-ui';
    }
    /**
     * Create Amazon default theme
     */
    createAmazonDefaultTheme() {
        return {
            id: 'amazon-default',
            name: 'Amazon Professional',
            description: 'Classic Amazon branding with professional orange and blue color scheme',
            colors: {
                primary: '#FF9900',
                secondary: '#232F3E',
                accent: '#146EB4',
                background: '#FFFFFF',
                text: '#000000',
                gradient: ['#FF9900', '#FFB84D', '#FFC266']
            },
            fonts: {
                title: 'Arial',
                body: 'Arial'
            },
            visualElements: {
                backgroundStyle: 'gradient',
                accentStyle: 'corporate',
                iconStyle: 'modern',
                layoutStyle: 'clean'
            },
            widgets: [
                { type: 'metric-card', style: {}, position: 'content' },
                { type: 'progress-bar', style: {}, position: 'content' }
            ],
            dataVisualization: {
                chartColors: ['#FF9900', '#232F3E', '#146EB4', '#87CEEB', '#FFA500'],
                chartStyle: 'modern',
                iconSet: 'fluent-ui'
            },
            createdAt: new Date(),
            usageCount: 0
        };
    }
    /**
     * Get theme history
     */
    getThemeHistory() {
        return Array.from(this.themeHistory.values())
            .sort((a, b) => b.usageCount - a.usageCount);
    }
    /**
     * Rate a theme
     */
    rateTheme(themeId, rating) {
        const theme = this.themeHistory.get(themeId);
        if (theme) {
            theme.userRating = rating;
            this.saveThemeHistory();
        }
    }
    /**
     * Load theme history from storage
     */
    loadThemeHistory() {
        try {
            // In a real implementation, this would load from a database
            // For now, we'll start with an empty history
            console.log('📚 Theme history loaded');
        }
        catch (error) {
            console.error('Failed to load theme history:', error);
        }
    }
    /**
     * Save theme history to storage
     */
    saveThemeHistory() {
        try {
            // In a real implementation, this would save to a database
            console.log('💾 Theme history saved');
        }
        catch (error) {
            console.error('Failed to save theme history:', error);
        }
    }
}
exports.DynamicThemeService = DynamicThemeService;
/**
 * Create Dynamic Theme Service instance
 */
function createDynamicThemeService() {
    return new DynamicThemeService();
}
//# sourceMappingURL=DynamicThemeService.js.map