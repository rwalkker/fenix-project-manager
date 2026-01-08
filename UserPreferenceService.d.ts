import type { DocumentFormat, ProjectContext } from '../models/orchestration-types';
/**
 * User Preferences
 */
export interface UserPreferences {
    userId: string;
    favoriteTemplates: {
        powerpoint: string[];
        excel: string[];
        word: string[];
    };
    stylePreferences: {
        colorScheme: string;
        fontFamily: string;
        layoutStyle: string;
    };
    contentPreferences: {
        detailLevel: 'high' | 'medium' | 'low';
        tone: 'formal' | 'casual' | 'technical';
        audienceType: string[];
    };
    recentProjects: ProjectContext[];
    learningData: {
        templateUsage: Record<string, number>;
        contentPatterns: string[];
        commonPhrases: string[];
    };
    lastUpdated: Date;
}
/**
 * User Action
 */
export interface UserAction {
    userId: string;
    actionType: 'template_selected' | 'document_created' | 'style_applied' | 'content_generated';
    timestamp: Date;
    metadata: {
        template?: string;
        format?: DocumentFormat;
        style?: string;
        content?: string;
        projectId?: string;
    };
}
/**
 * Smart Defaults
 */
export interface SmartDefaults {
    template: string;
    colorScheme: string;
    fontFamily: string;
    detailLevel: 'high' | 'medium' | 'low';
    tone: 'formal' | 'casual' | 'technical';
    confidence: number;
    rationale: string;
}
/**
 * User Preference Service
 * Learns from user actions and provides personalized defaults
 */
export declare class UserPreferenceService {
    private preferences;
    private actionHistory;
    constructor();
    /**
     * Learn from user action
     */
    learnFromAction(userId: string, action: UserAction): Promise<void>;
    /**
     * Get user preferences
     */
    getPreferences(userId: string): Promise<UserPreferences>;
    /**
     * Apply preferences to document request
     */
    applyPreferences(request: any, userId: string): Promise<any>;
    /**
     * Get smart defaults for user and context
     */
    getSmartDefaults(userId: string, context?: ProjectContext): Promise<SmartDefaults>;
    /**
     * Get template usage statistics
     */
    getTemplateUsageStats(userId: string): Promise<Record<string, number>>;
    /**
     * Get recent projects
     */
    getRecentProjects(userId: string, limit?: number): Promise<ProjectContext[]>;
    /**
     * Add project to recent projects
     */
    addRecentProject(userId: string, project: ProjectContext): Promise<void>;
    /**
     * Update style preferences
     */
    updateStylePreferences(userId: string, stylePrefs: Partial<UserPreferences['stylePreferences']>): Promise<void>;
    /**
     * Update content preferences
     */
    updateContentPreferences(userId: string, contentPrefs: Partial<UserPreferences['contentPreferences']>): Promise<void>;
    /**
     * Get action history
     */
    getActionHistory(userId: string, limit?: number): Promise<UserAction[]>;
    /**
     * Clear user preferences (for testing or reset)
     */
    clearPreferences(userId: string): Promise<void>;
    /**
     * Create default preferences for new user
     */
    private createDefaultPreferences;
    /**
     * Update preferences based on user action
     */
    private updatePreferencesFromAction;
    /**
     * Update template preference
     */
    private updateTemplatePreference;
    /**
     * Update template usage count
     */
    private updateTemplateUsage;
    /**
     * Update style from action
     */
    private updateStyleFromAction;
    /**
     * Update content patterns
     */
    private updateContentPatterns;
    /**
     * Extract common phrases from words
     */
    private extractPhrases;
    /**
     * Get favorite templates for format
     */
    private getFavoriteTemplatesForFormat;
    /**
     * Get most used template
     */
    private getMostUsedTemplate;
    /**
     * Calculate confidence score
     */
    private calculateConfidence;
    /**
     * Generate rationale for defaults
     */
    private generateDefaultsRationale;
}
/**
 * Create User Preference Service instance
 */
export declare function createUserPreferenceService(): UserPreferenceService;
//# sourceMappingURL=UserPreferenceService.d.ts.map