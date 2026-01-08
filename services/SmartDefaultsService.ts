// FENIX Project Manager - Smart Defaults Service
// Apply intelligent defaults based on context
// Created: January 6, 2026

import type { ProjectContext, DocumentFormat } from '../models/orchestration-types';
import type { UserPreferences } from './UserPreferenceService';

/**
 * Default Settings
 */
export interface DefaultSettings {
  template: string;
  format: DocumentFormat;
  style: {
    colorScheme: string;
    fontFamily: string;
    layoutStyle: string;
  };
  content: {
    detailLevel: 'high' | 'medium' | 'low';
    tone: 'formal' | 'casual' | 'technical';
  };
  metadata: {
    confidence: number;
    rationale: string;
    sources: string[];
  };
}

/**
 * Context Factors
 */
export interface ContextFactors {
  userPreferences?: UserPreferences;
  projectContext?: ProjectContext;
  documentType?: string;
  audience?: string;
  purpose?: string;
}

/**
 * Smart Defaults Service
 * Intelligently determines optimal defaults
 */
export class SmartDefaultsService {
  private defaultTemplates: Map<DocumentFormat, string[]>;
  private contextRules: Map<string, (factors: ContextFactors) => Partial<DefaultSettings>>;

  constructor() {
    this.defaultTemplates = new Map();
    this.contextRules = new Map();
    this.initializeDefaults();
    this.initializeContextRules();
  }

  /**
   * Get smart defaults
   */
  async getDefaults(factors: ContextFactors): Promise<DefaultSettings> {
    // Start with base defaults
    let settings: DefaultSettings = this.getBaseDefaults();

    // Apply user preferences
    if (factors.userPreferences) {
      settings = this.applyUserPreferences(settings, factors.userPreferences);
    }

    // Apply project context
    if (factors.projectContext) {
      settings = this.applyProjectContext(settings, factors.projectContext);
    }

    // Apply document type rules
    if (factors.documentType) {
      settings = this.applyDocumentTypeRules(settings, factors.documentType);
    }

    // Apply audience rules
    if (factors.audience) {
      settings = this.applyAudienceRules(settings, factors.audience);
    }

    // Apply purpose rules
    if (factors.purpose) {
      settings = this.applyPurposeRules(settings, factors.purpose);
    }

    // Calculate confidence and generate rationale
    settings.metadata = this.calculateMetadata(factors, settings);

    return settings;
  }

  /**
   * Get defaults for document type
   */
  async getDefaultsForType(
    documentType: string,
    factors?: Partial<ContextFactors>
  ): Promise<DefaultSettings> {
    return this.getDefaults({
      ...factors,
      documentType
    });
  }

  /**
   * Get defaults for audience
   */
  async getDefaultsForAudience(
    audience: string,
    factors?: Partial<ContextFactors>
  ): Promise<DefaultSettings> {
    return this.getDefaults({
      ...factors,
      audience
    });
  }

  /**
   * Get template recommendations
   */
  async getTemplateRecommendations(
    format: DocumentFormat,
    factors?: ContextFactors
  ): Promise<string[]> {
    const templates = this.defaultTemplates.get(format) || [];

    // If we have user preferences, prioritize their favorites
    if (factors?.userPreferences) {
      const formatKey = format as 'powerpoint' | 'excel' | 'word';
      if (formatKey in factors.userPreferences.favoriteTemplates) {
        const favorites = factors.userPreferences.favoriteTemplates[formatKey];
        if (favorites.length > 0) {
          return [...favorites, ...templates.filter(t => !favorites.includes(t))];
        }
      }
    }

    return templates;
  }

  /**
   * Explain defaults
   */
  async explainDefaults(settings: DefaultSettings): Promise<string> {
    const explanations: string[] = [];

    // Explain template choice
    explanations.push(`Template: ${settings.template}`);

    // Explain format choice
    explanations.push(`Format: ${settings.format}`);

    // Explain style choices
    explanations.push(`Style: ${settings.style.colorScheme} color scheme, ${settings.style.fontFamily} font`);

    // Explain content choices
    explanations.push(`Content: ${settings.content.detailLevel} detail, ${settings.content.tone} tone`);

    // Add rationale
    if (settings.metadata.rationale) {
      explanations.push(`\nRationale: ${settings.metadata.rationale}`);
    }

    // Add confidence
    explanations.push(`\nConfidence: ${(settings.metadata.confidence * 100).toFixed(0)}%`);

    return explanations.join('\n');
  }

  /**
   * Compare defaults
   */
  async compareDefaults(
    settings1: DefaultSettings,
    settings2: DefaultSettings
  ): Promise<{
    differences: string[];
    similarities: string[];
  }> {
    const differences: string[] = [];
    const similarities: string[] = [];

    // Compare templates
    if (settings1.template !== settings2.template) {
      differences.push(`Template: ${settings1.template} vs ${settings2.template}`);
    } else {
      similarities.push(`Same template: ${settings1.template}`);
    }

    // Compare formats
    if (settings1.format !== settings2.format) {
      differences.push(`Format: ${settings1.format} vs ${settings2.format}`);
    } else {
      similarities.push(`Same format: ${settings1.format}`);
    }

    // Compare color schemes
    if (settings1.style.colorScheme !== settings2.style.colorScheme) {
      differences.push(`Color scheme: ${settings1.style.colorScheme} vs ${settings2.style.colorScheme}`);
    } else {
      similarities.push(`Same color scheme: ${settings1.style.colorScheme}`);
    }

    // Compare detail levels
    if (settings1.content.detailLevel !== settings2.content.detailLevel) {
      differences.push(`Detail level: ${settings1.content.detailLevel} vs ${settings2.content.detailLevel}`);
    } else {
      similarities.push(`Same detail level: ${settings1.content.detailLevel}`);
    }

    return { differences, similarities };
  }

  // ========== Private Helper Methods ==========

  /**
   * Initialize default templates
   */
  private initializeDefaults(): void {
    this.defaultTemplates.set('powerpoint', [
      'project-status',
      'executive-presentation',
      'quarterly-review',
      'change-management'
    ]);

    this.defaultTemplates.set('excel', [
      'kpi-dashboard',
      'data-analysis',
      'financial-report'
    ]);

    this.defaultTemplates.set('word', [
      'executive-summary',
      'technical-documentation',
      'project-plan'
    ]);
  }

  /**
   * Initialize context rules
   */
  private initializeContextRules(): void {
    // Rule for status updates
    this.contextRules.set('status-update', (_factors) => ({
      template: 'project-status',
      format: 'powerpoint',
      content: {
        detailLevel: 'medium',
        tone: 'formal'
      }
    }));

    // Rule for technical documentation
    this.contextRules.set('technical-doc', (_factors) => ({
      template: 'technical-documentation',
      format: 'word',
      content: {
        detailLevel: 'high',
        tone: 'technical'
      }
    }));

    // Rule for executive briefing
    this.contextRules.set('executive-briefing', (_factors) => ({
      template: 'executive-presentation',
      format: 'powerpoint',
      content: {
        detailLevel: 'low',
        tone: 'formal'
      }
    }));
  }

  /**
   * Get base defaults
   */
  private getBaseDefaults(): DefaultSettings {
    return {
      template: 'default',
      format: 'powerpoint',
      style: {
        colorScheme: 'professional',
        fontFamily: 'Arial',
        layoutStyle: 'clean'
      },
      content: {
        detailLevel: 'medium',
        tone: 'formal'
      },
      metadata: {
        confidence: 0.5,
        rationale: 'Using base defaults',
        sources: ['base']
      }
    };
  }

  /**
   * Apply user preferences
   */
  private applyUserPreferences(
    settings: DefaultSettings,
    prefs: UserPreferences
  ): DefaultSettings {
    // Apply style preferences
    settings.style = {
      ...settings.style,
      ...prefs.stylePreferences
    };

    // Apply content preferences
    settings.content = {
      ...settings.content,
      ...prefs.contentPreferences
    };

    // Update metadata
    settings.metadata.sources.push('user-preferences');

    return settings;
  }

  /**
   * Apply project context
   */
  private applyProjectContext(
    settings: DefaultSettings,
    context: ProjectContext
  ): DefaultSettings {
    // If project has specific tags, adjust defaults
    if (context.tags) {
      if (context.tags.includes('executive')) {
        settings.content.detailLevel = 'low';
        settings.content.tone = 'formal';
      }
      if (context.tags.includes('technical')) {
        settings.content.detailLevel = 'high';
        settings.content.tone = 'technical';
      }
    }

    // Update metadata
    settings.metadata.sources.push('project-context');

    return settings;
  }

  /**
   * Apply document type rules
   */
  private applyDocumentTypeRules(
    settings: DefaultSettings,
    documentType: string
  ): DefaultSettings {
    const rule = this.contextRules.get(documentType);
    if (rule) {
      const ruleSettings = rule({});
      Object.assign(settings, ruleSettings);
      settings.metadata.sources.push(`document-type:${documentType}`);
    }

    return settings;
  }

  /**
   * Apply audience rules
   */
  private applyAudienceRules(
    settings: DefaultSettings,
    audience: string
  ): DefaultSettings {
    const lowerAudience = audience.toLowerCase();

    if (lowerAudience.includes('executive')) {
      settings.content.detailLevel = 'low';
      settings.content.tone = 'formal';
      settings.metadata.sources.push('audience:executive');
    } else if (lowerAudience.includes('technical')) {
      settings.content.detailLevel = 'high';
      settings.content.tone = 'technical';
      settings.metadata.sources.push('audience:technical');
    } else if (lowerAudience.includes('general')) {
      settings.content.detailLevel = 'medium';
      settings.content.tone = 'casual';
      settings.metadata.sources.push('audience:general');
    }

    return settings;
  }

  /**
   * Apply purpose rules
   */
  private applyPurposeRules(
    settings: DefaultSettings,
    purpose: string
  ): DefaultSettings {
    const lowerPurpose = purpose.toLowerCase();

    if (lowerPurpose.includes('status') || lowerPurpose.includes('update')) {
      settings.template = 'project-status';
      settings.format = 'powerpoint';
      settings.metadata.sources.push('purpose:status-update');
    } else if (lowerPurpose.includes('analysis') || lowerPurpose.includes('data')) {
      settings.template = 'data-analysis';
      settings.format = 'excel';
      settings.metadata.sources.push('purpose:data-analysis');
    } else if (lowerPurpose.includes('documentation') || lowerPurpose.includes('spec')) {
      settings.template = 'technical-documentation';
      settings.format = 'word';
      settings.metadata.sources.push('purpose:documentation');
    }

    return settings;
  }

  /**
   * Calculate metadata
   */
  private calculateMetadata(
    factors: ContextFactors,
    settings: DefaultSettings
  ): DefaultSettings['metadata'] {
    // Calculate confidence based on number of factors
    let confidence = 0.5; // Base confidence

    if (factors.userPreferences) confidence += 0.15;
    if (factors.projectContext) confidence += 0.1;
    if (factors.documentType) confidence += 0.1;
    if (factors.audience) confidence += 0.1;
    if (factors.purpose) confidence += 0.05;

    confidence = Math.min(confidence, 1.0);

    // Generate rationale
    const rationale = this.generateRationale(factors, settings);

    return {
      confidence,
      rationale,
      sources: settings.metadata.sources
    };
  }

  /**
   * Generate rationale
   */
  private generateRationale(
    factors: ContextFactors,
    _settings: DefaultSettings
  ): string {
    const reasons: string[] = [];

    if (factors.userPreferences) {
      reasons.push('based on your preferences');
    }

    if (factors.projectContext) {
      reasons.push(`for project "${factors.projectContext.projectName}"`);
    }

    if (factors.documentType) {
      reasons.push(`optimized for ${factors.documentType}`);
    }

    if (factors.audience) {
      reasons.push(`tailored for ${factors.audience} audience`);
    }

    if (factors.purpose) {
      reasons.push(`designed for ${factors.purpose}`);
    }

    if (reasons.length === 0) {
      return 'Using standard defaults';
    }

    return `Smart defaults applied ${reasons.join(', ')}`;
  }
}

/**
 * Create Smart Defaults Service instance
 */
export function createSmartDefaultsService(): SmartDefaultsService {
  return new SmartDefaultsService();
}
