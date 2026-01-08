// FENIX Project Manager - Visual Design Agent
// AI-powered design analysis and recommendations
// Created: January 6, 2026

import { getBedrockService } from '../services/AWSBedrockService';
import { createDesignSystemService, type DesignElement } from '../services/DesignSystemService';
import type {
  DesignSystem,
  DesignValidationResult,
  ColorPalette
} from '../models/design-system-types';

/**
 * Visual Design Agent
 * Provides AI-powered design analysis, recommendations, and generation
 */
export class VisualDesignAgent {
  private designSystem: DesignSystem;
  private designSystemService: ReturnType<typeof createDesignSystemService>;
  private bedrock: ReturnType<typeof getBedrockService>;

  constructor(designSystem?: DesignSystem) {
    this.designSystemService = createDesignSystemService(designSystem);
    this.designSystem = this.designSystemService.getDesignSystem();
    this.bedrock = getBedrockService();
  }

  /**
   * Analyze design and provide comprehensive feedback
   */
  async analyzeDesign(elements: DesignElement[]): Promise<DesignAnalysisResult> {
    // Validate design
    const validation = this.designSystemService.validateDesign(elements);

    // Get AI critique
    const critique = await this.getAICritique(elements, validation);

    // Generate recommendations
    const recommendations = await this.generateRecommendations(elements, validation);

    // Calculate metrics
    const metrics = this.calculateDesignMetrics(elements);

    return {
      validation,
      critique,
      recommendations,
      metrics,
      score: validation.score
    };
  }

  /**
   * Get AI-powered design critique
   */
  private async getAICritique(
    elements: DesignElement[],
    validation: DesignValidationResult
  ): Promise<string> {
    const prompt = `As a professional design critic, analyze this design:

Elements: ${JSON.stringify(elements, null, 2)}

Validation Results:
- Valid: ${validation.valid}
- Errors: ${validation.errors.length}
- Warnings: ${validation.warnings.length}
- Score: ${validation.score}/100

Provide a brief, constructive critique focusing on:
1. Visual hierarchy
2. Color usage
3. Typography
4. Spacing and layout
5. Accessibility

Keep response under 200 words.`;

    const response = await this.bedrock.invoke({
      prompt,
      maxTokens: 400,
      temperature: 0.7
    });

    return response.completion;
  }

  /**
   * Generate design recommendations
   */
  private async generateRecommendations(
    elements: DesignElement[],
    validation: DesignValidationResult
  ): Promise<DesignRecommendation[]> {
    const recommendations: DesignRecommendation[] = [];

    // Add recommendations based on validation errors
    for (const error of validation.errors) {
      recommendations.push({
        type: 'fix',
        priority: error.severity === 'critical' ? 'high' : error.severity === 'high' ? 'medium' : 'low',
        title: error.message,
        description: error.fix || 'Address this issue to improve design quality',
        impact: 'Improves accessibility and usability'
      });
    }

    // Add recommendations based on warnings
    for (const warning of validation.warnings) {
      recommendations.push({
        type: 'improve',
        priority: 'low',
        title: warning.message,
        description: warning.recommendation || 'Consider this improvement',
        impact: 'Enhances visual quality'
      });
    }

    // Get AI-generated recommendations
    const aiRecs = await this.getAIRecommendations(elements);
    recommendations.push(...aiRecs);

    return recommendations;
  }

  /**
   * Get AI-generated recommendations
   */
  private async getAIRecommendations(elements: DesignElement[]): Promise<DesignRecommendation[]> {
    const prompt = `Analyze this design and suggest 3 specific improvements:

Elements: ${JSON.stringify(elements, null, 2)}

For each suggestion, provide:
1. Title (brief)
2. Description (specific action)
3. Impact (expected benefit)

Format as JSON array:
[
  {
    "title": "...",
    "description": "...",
    "impact": "..."
  }
]`;

    try {
      const response = await this.bedrock.invoke({
        prompt,
        maxTokens: 600,
        temperature: 0.8
      });

      const suggestions = JSON.parse(response.completion);
      return suggestions.map((s: any) => ({
        type: 'enhance' as const,
        priority: 'medium' as const,
        title: s.title,
        description: s.description,
        impact: s.impact
      }));
    } catch (error) {
      console.error('Failed to parse AI recommendations:', error);
      return [];
    }
  }

  /**
   * Calculate design metrics
   */
  private calculateDesignMetrics(elements: DesignElement[]): DesignMetrics {
    const colors = new Set<string>();
    const fontSizes = new Set<number>();
    let totalElements = elements.length;
    let interactiveElements = 0;
    let imagesWithAlt = 0;
    let imagesWithoutAlt = 0;

    for (const element of elements) {
      if (element.foreground) colors.add(element.foreground);
      if (element.background) colors.add(element.background);
      if (element.fontSize) fontSizes.add(element.fontSize);
      if (element.interactive) interactiveElements++;
      if (element.type === 'image') {
        if (element.altText) imagesWithAlt++;
        else imagesWithoutAlt++;
      }
    }

    return {
      totalElements,
      uniqueColors: colors.size,
      uniqueFontSizes: fontSizes.size,
      interactiveElements,
      imagesWithAlt,
      imagesWithoutAlt,
      colorDiversity: colors.size / Math.max(1, totalElements),
      typographyConsistency: 1 - (fontSizes.size / Math.max(1, totalElements))
    };
  }

  /**
   * Generate color palette from description
   */
  async generateColorPalette(description: string): Promise<ColorPalette> {
    const prompt = `Generate a professional color palette for: ${description}

Requirements:
- Primary color (main brand color)
- Secondary color (complementary)
- Success, warning, error, info colors
- Neutral colors (black, grays, white)
- Background colors

Return as JSON:
{
  "primary": { "main": "#...", "light": "#...", "dark": "#..." },
  "secondary": { "main": "#...", "light": "#...", "dark": "#..." },
  "semantic": {
    "success": { "main": "#..." },
    "warning": { "main": "#..." },
    "error": { "main": "#..." },
    "info": { "main": "#..." }
  },
  "neutrals": {
    "black": "#000000",
    "darkGray": "#...",
    "mediumGray": "#...",
    "lightGray": "#...",
    "white": "#FFFFFF"
  },
  "backgrounds": {
    "primary": "#FFFFFF",
    "secondary": "#...",
    "tertiary": "#..."
  }
}`;

    try {
      const response = await this.bedrock.invoke({
        prompt,
        maxTokens: 800,
        temperature: 0.9
      });

      return JSON.parse(response.completion);
    } catch (error) {
      console.error('Failed to generate color palette:', error);
      // Return default Amazon palette
      return this.designSystem.colors;
    }
  }

  /**
   * Suggest font pairings
   */
  async suggestFontPairings(context: string): Promise<FontPairing[]> {
    const prompt = `Suggest 3 professional font pairings for: ${context}

For each pairing, provide:
- Heading font
- Body font
- Rationale (why they work together)

Format as JSON array:
[
  {
    "heading": "Font Name",
    "body": "Font Name",
    "rationale": "..."
  }
]`;

    try {
      const response = await this.bedrock.invoke({
        prompt,
        maxTokens: 500,
        temperature: 0.8
      });

      return JSON.parse(response.completion);
    } catch (error) {
      console.error('Failed to suggest font pairings:', error);
      return [];
    }
  }

  /**
   * Generate layout suggestions
   */
  async suggestLayout(content: LayoutContent): Promise<LayoutSuggestion[]> {
    const prompt = `Suggest 3 layout options for this content:

Type: ${content.type}
Elements: ${content.elements.join(', ')}
Priority: ${content.priority || 'balanced'}

For each layout, provide:
- Name
- Description
- Structure (how elements are arranged)
- Best for (use case)

Format as JSON array.`;

    try {
      const response = await this.bedrock.invoke({
        prompt,
        maxTokens: 600,
        temperature: 0.8
      });

      return JSON.parse(response.completion);
    } catch (error) {
      console.error('Failed to suggest layouts:', error);
      return [];
    }
  }

  /**
   * Optimize text for readability
   */
  async optimizeText(text: string, context: string): Promise<TextOptimization> {
    const prompt = `Optimize this text for ${context}:

"${text}"

Provide:
1. Optimized version (clearer, more concise)
2. Improvements made
3. Readability score (1-10)

Format as JSON:
{
  "optimized": "...",
  "improvements": ["...", "..."],
  "readabilityScore": 8
}`;

    try {
      const response = await this.bedrock.invoke({
        prompt,
        maxTokens: 400,
        temperature: 0.7
      });

      return JSON.parse(response.completion);
    } catch (error) {
      console.error('Failed to optimize text:', error);
      return {
        optimized: text,
        improvements: [],
        readabilityScore: 5
      };
    }
  }

  /**
   * Generate alt text for images
   */
  async generateAltText(imageDescription: string, context: string): Promise<string> {
    const prompt = `Generate concise, descriptive alt text for an image:

Image: ${imageDescription}
Context: ${context}

Requirements:
- Descriptive but concise (under 125 characters)
- Convey essential information
- Appropriate for screen readers

Return only the alt text, no explanation.`;

    const response = await this.bedrock.invoke({
      prompt,
      maxTokens: 100,
      temperature: 0.6
    });

    return response.completion.trim();
  }

  /**
   * Check brand compliance
   */
  async checkBrandCompliance(elements: DesignElement[]): Promise<BrandComplianceResult> {
    const colors = this.designSystem.colors;
    const issues: string[] = [];
    const suggestions: string[] = [];

    // Check color usage
    for (const element of elements) {
      if (element.foreground && !this.isValidBrandColor(element.foreground)) {
        issues.push(`Non-brand color used: ${element.foreground} in ${element.id}`);
        suggestions.push(`Consider using brand colors like ${colors.primary.main} or ${colors.secondary.main}`);
      }
    }

    // Get AI analysis
    const aiAnalysis = await this.getAIBrandAnalysis(elements);

    return {
      compliant: issues.length === 0,
      issues,
      suggestions: [...suggestions, ...aiAnalysis.suggestions],
      score: Math.max(0, 100 - (issues.length * 10))
    };
  }

  /**
   * Get AI brand compliance analysis
   */
  private async getAIBrandAnalysis(elements: DesignElement[]): Promise<{ suggestions: string[] }> {
    const prompt = `Analyze brand consistency for Amazon:

Elements: ${JSON.stringify(elements, null, 2)}

Brand Guidelines:
- Primary: ${this.designSystem.colors.primary.main}
- Secondary: ${this.designSystem.colors.secondary.main}
- Font: ${this.designSystem.typography.fonts.primary}

Provide 2-3 specific suggestions for better brand alignment.
Format as JSON: { "suggestions": ["...", "..."] }`;

    try {
      const response = await this.bedrock.invoke({
        prompt,
        maxTokens: 300,
        temperature: 0.7
      });

      return JSON.parse(response.completion);
    } catch (error) {
      return { suggestions: [] };
    }
  }

  /**
   * Check if color is valid brand color
   */
  private isValidBrandColor(color: string): boolean {
    const colors = this.designSystem.colors;
    const brandColors = [
      colors.primary.main,
      colors.primary.light,
      colors.primary.dark,
      colors.secondary.main,
      colors.secondary.light,
      colors.secondary.dark,
      ...Object.values(colors.neutrals),
      ...Object.values(colors.backgrounds)
    ];

    return brandColors.includes(color.toUpperCase());
  }
}

/**
 * Design Analysis Result
 */
export interface DesignAnalysisResult {
  validation: DesignValidationResult;
  critique: string;
  recommendations: DesignRecommendation[];
  metrics: DesignMetrics;
  score: number;
}

export interface DesignRecommendation {
  type: 'fix' | 'improve' | 'enhance';
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
}

export interface DesignMetrics {
  totalElements: number;
  uniqueColors: number;
  uniqueFontSizes: number;
  interactiveElements: number;
  imagesWithAlt: number;
  imagesWithoutAlt: number;
  colorDiversity: number;
  typographyConsistency: number;
}

export interface FontPairing {
  heading: string;
  body: string;
  rationale: string;
}

export interface LayoutContent {
  type: string;
  elements: string[];
  priority?: 'visual' | 'content' | 'balanced';
}

export interface LayoutSuggestion {
  name: string;
  description: string;
  structure: string;
  bestFor: string;
}

export interface TextOptimization {
  optimized: string;
  improvements: string[];
  readabilityScore: number;
}

export interface BrandComplianceResult {
  compliant: boolean;
  issues: string[];
  suggestions: string[];
  score: number;
}

/**
 * Create visual design agent instance
 */
export function createVisualDesignAgent(designSystem?: DesignSystem): VisualDesignAgent {
  return new VisualDesignAgent(designSystem);
}
