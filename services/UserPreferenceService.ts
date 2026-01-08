// FENIX Project Manager - User Preference Service
// Learn user preferences and apply smart defaults
// Created: January 6, 2026

import type {
  DocumentFormat,
  ProjectContext
} from '../models/orchestration-types';

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
export class UserPreferenceService {
  private preferences: Map<string, UserPreferences>;
  private actionHistory: Map<string, UserAction[]>;

  constructor() {
    this.preferences = new Map();
    this.actionHistory = new Map();
  }

  /**
   * Learn from user action
   */
  async learnFromAction(userId: string, action: UserAction): Promise<void> {
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
    this.actionHistory.get(userId)!.push(action);

    // Update preferences based on action
    await this.updatePreferencesFromAction(prefs, action);

    // Update timestamp
    prefs.lastUpdated = new Date();
  }

  /**
   * Get user preferences
   */
  async getPreferences(userId: string): Promise<UserPreferences> {
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
  async applyPreferences(
    request: any,
    userId: string
  ): Promise<any> {
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
  async getSmartDefaults(
    userId: string,
    context?: ProjectContext
  ): Promise<SmartDefaults> {
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
  async getTemplateUsageStats(userId: string): Promise<Record<string, number>> {
    const prefs = await this.getPreferences(userId);
    return prefs.learningData.templateUsage;
  }

  /**
   * Get recent projects
   */
  async getRecentProjects(userId: string, limit: number = 5): Promise<ProjectContext[]> {
    const prefs = await this.getPreferences(userId);
    return prefs.recentProjects.slice(0, limit);
  }

  /**
   * Add project to recent projects
   */
  async addRecentProject(userId: string, project: ProjectContext): Promise<void> {
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
  async updateStylePreferences(
    userId: string,
    stylePrefs: Partial<UserPreferences['stylePreferences']>
  ): Promise<void> {
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
  async updateContentPreferences(
    userId: string,
    contentPrefs: Partial<UserPreferences['contentPreferences']>
  ): Promise<void> {
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
  async getActionHistory(userId: string, limit?: number): Promise<UserAction[]> {
    const history = this.actionHistory.get(userId) || [];
    return limit ? history.slice(-limit) : history;
  }

  /**
   * Clear user preferences (for testing or reset)
   */
  async clearPreferences(userId: string): Promise<void> {
    this.preferences.delete(userId);
    this.actionHistory.delete(userId);
  }

  // ========== Private Helper Methods ==========

  /**
   * Create default preferences for new user
   */
  private createDefaultPreferences(userId: string): UserPreferences {
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
  private async updatePreferencesFromAction(
    prefs: UserPreferences,
    action: UserAction
  ): Promise<void> {
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
  private updateTemplatePreference(
    prefs: UserPreferences,
    template: string,
    format: DocumentFormat
  ): void {
    const formatKey = format as 'powerpoint' | 'excel' | 'word';
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
  private updateTemplateUsage(prefs: UserPreferences, template: string): void {
    if (!prefs.learningData.templateUsage[template]) {
      prefs.learningData.templateUsage[template] = 0;
    }
    prefs.learningData.templateUsage[template]++;
  }

  /**
   * Update style from action
   */
  private updateStyleFromAction(prefs: UserPreferences, style: string): void {
    // Parse style string and update preferences
    // This is a simplified implementation
    if (style.includes('professional')) {
      prefs.stylePreferences.colorScheme = 'professional';
    } else if (style.includes('creative')) {
      prefs.stylePreferences.colorScheme = 'creative';
    }
  }

  /**
   * Update content patterns
   */
  private updateContentPatterns(prefs: UserPreferences, content: string): void {
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
  private extractPhrases(words: string[]): string[] {
    const phrases: string[] = [];
    
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
  private getFavoriteTemplatesForFormat(
    prefs: UserPreferences,
    format: DocumentFormat
  ): string[] {
    const formatKey = format as 'powerpoint' | 'excel' | 'word';
    if (formatKey in prefs.favoriteTemplates) {
      return prefs.favoriteTemplates[formatKey];
    }
    return [];
  }

  /**
   * Get most used template
   */
  private getMostUsedTemplate(prefs: UserPreferences): string {
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
  private calculateConfidence(prefs: UserPreferences): number {
    let confidence = 0.5; // Base confidence

    // Increase based on template usage
    const templateCount = Object.keys(prefs.learningData.templateUsage).length;
    if (templateCount > 5) {
      confidence += 0.2;
    } else if (templateCount > 2) {
      confidence += 0.1;
    }

    // Increase based on action history
    const totalActions = Object.values(prefs.learningData.templateUsage).reduce((a, b) => a + b, 0);
    if (totalActions > 10) {
      confidence += 0.2;
    } else if (totalActions > 5) {
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
  private generateDefaultsRationale(
    prefs: UserPreferences,
    context?: ProjectContext
  ): string {
    const reasons: string[] = [];

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

/**
 * Create User Preference Service instance
 */
export function createUserPreferenceService(): UserPreferenceService {
  return new UserPreferenceService();
}
