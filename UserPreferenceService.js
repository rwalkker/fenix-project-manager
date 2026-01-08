"use strict";
// FENIX Project Manager - User Preference Service
// Learn user preferences and apply smart defaults
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserPreferenceService = void 0;
exports.createUserPreferenceService = createUserPreferenceService;
/**
 * User Preference Service
 * Learns from user actions and provides personalized defaults
 */
class UserPreferenceService {
    preferences;
    actionHistory;
    constructor() {
        this.preferences = new Map();
        this.actionHistory = new Map();
    }
    /**
     * Learn from user action
     */
    async learnFromAction(userId, action) {
        // Get or create user preferences
        let prefs = this.preferences.get(userId);
        if (!prefs) {
            prefs = this.createDefaultPreferences(userId);
            this.preferences.set(userId, prefs);
        }
        // Store action in history
        if (!this.actionHistory.has(userId)) {
            this.actionHistory.set(userId, []);
        }
        this.actionHistory.get(userId).push(action);
        // Update preferences based on action
        await this.updatePreferencesFromAction(prefs, action);
        // Update timestamp
        prefs.lastUpdated = new Date();
    }
    /**
     * Get user preferences
     */
    async getPreferences(userId) {
        let prefs = this.preferences.get(userId);
        if (!prefs) {
            prefs = this.createDefaultPreferences(userId);
            this.preferences.set(userId, prefs);
        }
        return prefs;
    }
    /**
     * Apply preferences to document request
     */
    async applyPreferences(request, userId) {
        const prefs = await this.getPreferences(userId);
        // Apply template preferences
        if (!request.template && request.format) {
            const favoriteTemplates = this.getFavoriteTemplatesForFormat(prefs, request.format);
            if (favoriteTemplates.length > 0) {
                request.template = favoriteTemplates[0];
            }
        }
        // Apply style preferences
        if (!request.style) {
            request.style = {
                colorScheme: prefs.stylePreferences.colorScheme,
                fontFamily: prefs.stylePreferences.fontFamily,
                layoutStyle: prefs.stylePreferences.layoutStyle
            };
        }
        // Apply content preferences
        if (!request.contentOptions) {
            request.contentOptions = {
                detailLevel: prefs.contentPreferences.detailLevel,
                tone: prefs.contentPreferences.tone
            };
        }
        return request;
    }
    /**
     * Get smart defaults for user and context
     */
    async getSmartDefaults(userId, context) {
        const prefs = await this.getPreferences(userId);
        // Determine most used template
        const mostUsedTemplate = this.getMostUsedTemplate(prefs);
        // Get style preferences
        const colorScheme = prefs.stylePreferences.colorScheme || 'professional';
        const fontFamily = prefs.stylePreferences.fontFamily || 'Arial';
        // Get content preferences
        const detailLevel = prefs.contentPreferences.detailLevel || 'medium';
        const tone = prefs.contentPreferences.tone || 'formal';
        // Calculate confidence based on learning data
        const confidence = this.calculateConfidence(prefs);
        // Generate rationale
        const rationale = this.generateDefaultsRationale(prefs, context);
        return {
            template: mostUsedTemplate,
            colorScheme,
            fontFamily,
            detailLevel,
            tone,
            confidence,
            rationale
        };
    }
    /**
     * Get template usage statistics
     */
    async getTemplateUsageStats(userId) {
        const prefs = await this.getPreferences(userId);
        return prefs.learningData.templateUsage;
    }
    /**
     * Get recent projects
     */
    async getRecentProjects(userId, limit = 5) {
        const prefs = await this.getPreferences(userId);
        return prefs.recentProjects.slice(0, limit);
    }
    /**
     * Add project to recent projects
     */
    async addRecentProject(userId, project) {
        const prefs = await this.getPreferences(userId);
        // Remove if already exists
        prefs.recentProjects = prefs.recentProjects.filter(p => p.projectId !== project.projectId);
        // Add to front
        prefs.recentProjects.unshift(project);
        // Keep only last 10
        prefs.recentProjects = prefs.recentProjects.slice(0, 10);
        prefs.lastUpdated = new Date();
    }
    /**
     * Update style preferences
     */
    async updateStylePreferences(userId, stylePrefs) {
        const prefs = await this.getPreferences(userId);
        prefs.stylePreferences = {
            ...prefs.stylePreferences,
            ...stylePrefs
        };
        prefs.lastUpdated = new Date();
    }
    /**
     * Update content preferences
     */
    async updateContentPreferences(userId, contentPrefs) {
        const prefs = await this.getPreferences(userId);
        prefs.contentPreferences = {
            ...prefs.contentPreferences,
            ...contentPrefs
        };
        prefs.lastUpdated = new Date();
    }
    /**
     * Get action history
     */
    async getActionHistory(userId, limit) {
        const history = this.actionHistory.get(userId) || [];
        return limit ? history.slice(-limit) : history;
    }
    /**
     * Clear user preferences (for testing or reset)
     */
    async clearPreferences(userId) {
        this.preferences.delete(userId);
        this.actionHistory.delete(userId);
    }
    // ========== Private Helper Methods ==========
    /**
     * Create default preferences for new user
     */
    createDefaultPreferences(userId) {
        return {
            userId,
            favoriteTemplates: {
                powerpoint: [],
                excel: [],
                word: []
            },
            stylePreferences: {
                colorScheme: 'professional',
                fontFamily: 'Arial',
                layoutStyle: 'clean'
            },
            contentPreferences: {
                detailLevel: 'medium',
                tone: 'formal',
                audienceType: []
            },
            recentProjects: [],
            learningData: {
                templateUsage: {},
                contentPatterns: [],
                commonPhrases: []
            },
            lastUpdated: new Date()
        };
    }
    /**
     * Update preferences based on user action
     */
    async updatePreferencesFromAction(prefs, action) {
        switch (action.actionType) {
            case 'template_selected':
                if (action.metadata.template && action.metadata.format) {
                    this.updateTemplatePreference(prefs, action.metadata.template, action.metadata.format);
                }
                break;
            case 'document_created':
                if (action.metadata.template) {
                    this.updateTemplateUsage(prefs, action.metadata.template);
                }
                break;
            case 'style_applied':
                if (action.metadata.style) {
                    this.updateStyleFromAction(prefs, action.metadata.style);
                }
                break;
            case 'content_generated':
                if (action.metadata.content) {
                    this.updateContentPatterns(prefs, action.metadata.content);
                }
                break;
        }
    }
    /**
     * Update template preference
     */
    updateTemplatePreference(prefs, template, format) {
        const formatKey = format;
        if (formatKey in prefs.favoriteTemplates) {
            const favorites = prefs.favoriteTemplates[formatKey];
            // Remove if exists
            const index = favorites.indexOf(template);
            if (index > -1) {
                favorites.splice(index, 1);
            }
            // Add to front
            favorites.unshift(template);
            // Keep only top 5
            prefs.favoriteTemplates[formatKey] = favorites.slice(0, 5);
        }
    }
    /**
     * Update template usage count
     */
    updateTemplateUsage(prefs, template) {
        if (!prefs.learningData.templateUsage[template]) {
            prefs.learningData.templateUsage[template] = 0;
        }
        prefs.learningData.templateUsage[template]++;
    }
    /**
     * Update style from action
     */
    updateStyleFromAction(prefs, style) {
        // Parse style string and update preferences
        // This is a simplified implementation
        if (style.includes('professional')) {
            prefs.stylePreferences.colorScheme = 'professional';
        }
        else if (style.includes('creative')) {
            prefs.stylePreferences.colorScheme = 'creative';
        }
    }
    /**
     * Update content patterns
     */
    updateContentPatterns(prefs, content) {
        // Extract common phrases (simplified)
        const words = content.toLowerCase().split(/\s+/);
        const phrases = this.extractPhrases(words);
        phrases.forEach(phrase => {
            if (!prefs.learningData.commonPhrases.includes(phrase)) {
                prefs.learningData.commonPhrases.push(phrase);
            }
        });
        // Keep only top 50 phrases
        prefs.learningData.commonPhrases = prefs.learningData.commonPhrases.slice(0, 50);
    }
    /**
     * Extract common phrases from words
     */
    extractPhrases(words) {
        const phrases = [];
        // Extract 2-word phrases
        for (let i = 0; i < words.length - 1; i++) {
            const phrase = `${words[i]} ${words[i + 1]}`;
            if (phrase.length > 5) {
                phrases.push(phrase);
            }
        }
        return phrases;
    }
    /**
     * Get favorite templates for format
     */
    getFavoriteTemplatesForFormat(prefs, format) {
        const formatKey = format;
        if (formatKey in prefs.favoriteTemplates) {
            return prefs.favoriteTemplates[formatKey];
        }
        return [];
    }
    /**
     * Get most used template
     */
    getMostUsedTemplate(prefs) {
        const usage = prefs.learningData.templateUsage;
        const entries = Object.entries(usage);
        if (entries.length === 0) {
            return 'default';
        }
        entries.sort((a, b) => b[1] - a[1]);
        return entries[0][0];
    }
    /**
     * Calculate confidence score
     */
    calculateConfidence(prefs) {
        let confidence = 0.5; // Base confidence
        // Increase based on template usage
        const templateCount = Object.keys(prefs.learningData.templateUsage).length;
        if (templateCount > 5) {
            confidence += 0.2;
        }
        else if (templateCount > 2) {
            confidence += 0.1;
        }
        // Increase based on action history
        const totalActions = Object.values(prefs.learningData.templateUsage).reduce((a, b) => a + b, 0);
        if (totalActions > 10) {
            confidence += 0.2;
        }
        else if (totalActions > 5) {
            confidence += 0.1;
        }
        // Increase based on recent projects
        if (prefs.recentProjects.length > 3) {
            confidence += 0.1;
        }
        return Math.min(confidence, 1.0);
    }
    /**
     * Generate rationale for defaults
     */
    generateDefaultsRationale(prefs, context) {
        const reasons = [];
        // Template usage
        const mostUsed = this.getMostUsedTemplate(prefs);
        if (mostUsed !== 'default') {
            const count = prefs.learningData.templateUsage[mostUsed];
            reasons.push(`You've used ${mostUsed} template ${count} times`);
        }
        // Style preferences
        if (prefs.stylePreferences.colorScheme !== 'professional') {
            reasons.push(`Your preferred color scheme is ${prefs.stylePreferences.colorScheme}`);
        }
        // Content preferences
        if (prefs.contentPreferences.tone !== 'formal') {
            reasons.push(`Your preferred tone is ${prefs.contentPreferences.tone}`);
        }
        // Context
        if (context) {
            reasons.push(`Based on project: ${context.projectName}`);
        }
        if (reasons.length === 0) {
            return 'Using default settings';
        }
        return `Smart defaults applied: ${reasons.join(', ')}`;
    }
}
exports.UserPreferenceService = UserPreferenceService;
/**
 * Create User Preference Service instance
 */
function createUserPreferenceService() {
    return new UserPreferenceService();
}
//# sourceMappingURL=UserPreferenceService.js.map