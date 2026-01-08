// FENIX Project Manager - Smart Layout Service
// Intelligent layout suggestions for PowerPoint presentations
// Created: January 6, 2026

import natural from 'natural';

const { TfIdf } = natural;

export interface LayoutSuggestion {
  layout: 'title' | 'content' | 'two-column' | 'comparison' | 'image-focus' | 'section-header' | 'blank';
  confidence: number;
  reason: string;
  alternatives?: Array<{
    layout: string;
    confidence: number;
    reason: string;
  }>;
}

export interface ComplexityAnalysis {
  score: number;
  level: 'simple' | 'moderate' | 'complex' | 'very-complex';
  factors: {
    wordCount: number;
    sentenceCount: number;
    avgWordsPerSentence: number;
    longWords: number;
    bulletPoints: number;
    images: number;
  };
  suggestions: string[];
}

export interface ContentAnalysis {
  type: 'title' | 'content' | 'list' | 'comparison' | 'visual' | 'data' | 'mixed';
  keywords: string[];
  sentiment: 'positive' | 'neutral' | 'negative';
  hasNumbers: boolean;
  hasComparison: boolean;
  hasList: boolean;
  hasQuestions: boolean;
}

/**
 * Smart Layout Service
 * Provides intelligent layout suggestions for presentations
 */
export class SmartLayoutService {
  private tfidf: typeof TfIdf.prototype;

  constructor() {
    this.tfidf = new TfIdf();
  }

  /**
   * Suggest optimal slide layout based on content
   */
  suggestLayout(content: {
    title?: string;
    text?: string;
    images?: number;
    bullets?: number;
    charts?: number;
    tables?: number;
  }): LayoutSuggestion {
    const { title, text, images = 0, bullets = 0, charts = 0, tables = 0 } = content;

    // Title slide detection
    if (this.isTitleSlide(title, text)) {
      return {
        layout: 'title',
        confidence: 0.95,
        reason: 'Short title with minimal content suggests title slide',
        alternatives: [
          {
            layout: 'section-header',
            confidence: 0.7,
            reason: 'Could also work as section header'
          }
        ]
      };
    }

    // Section header detection
    if (this.isSectionHeader(title, text)) {
      return {
        layout: 'section-header',
        confidence: 0.9,
        reason: 'Brief content suggests section divider',
        alternatives: [
          {
            layout: 'title',
            confidence: 0.6,
            reason: 'Could work as title slide'
          }
        ]
      };
    }

    // Image-focused layout
    if (this.isImageFocused(images, text, charts)) {
      return {
        layout: 'image-focus',
        confidence: 0.9,
        reason: 'High visual-to-text ratio suggests image-focused layout',
        alternatives: [
          {
            layout: 'content',
            confidence: 0.5,
            reason: 'Standard content layout as fallback'
          }
        ]
      };
    }

    // Comparison layout detection
    if (text && this.detectComparison(text)) {
      return {
        layout: 'comparison',
        confidence: 0.85,
        reason: 'Comparison keywords detected in content',
        alternatives: [
          {
            layout: 'two-column',
            confidence: 0.8,
            reason: 'Two-column layout works well for comparisons'
          }
        ]
      };
    }

    // Two-column layout for lists
    if (bullets > 4 || (text && this.hasMultipleLists(text))) {
      return {
        layout: 'two-column',
        confidence: 0.8,
        reason: 'Multiple bullet points work better in columns',
        alternatives: [
          {
            layout: 'content',
            confidence: 0.6,
            reason: 'Single column as alternative'
          }
        ]
      };
    }

    // Data-heavy content
    if (tables > 0 || charts > 0) {
      return {
        layout: 'content',
        confidence: 0.85,
        reason: 'Data visualization needs standard content layout',
        alternatives: [
          {
            layout: 'blank',
            confidence: 0.5,
            reason: 'Blank layout for custom data arrangement'
          }
        ]
      };
    }

    // Default content layout
    return {
      layout: 'content',
      confidence: 0.7,
      reason: 'Standard content layout for mixed content',
      alternatives: [
        {
          layout: 'two-column',
          confidence: 0.5,
          reason: 'Two-column for better organization'
        }
      ]
    };
  }

  /**
   * Check if content is a title slide
   */
  private isTitleSlide(title?: string, text?: string): boolean {
    if (!title) return false;
    
    // Title slide characteristics:
    // - Short title (< 60 chars)
    // - No body text or very short (< 50 chars)
    // - No bullet points
    
    const titleLength = title.length;
    const textLength = text ? text.length : 0;
    
    return titleLength < 60 && textLength < 50;
  }

  /**
   * Check if content is a section header
   */
  private isSectionHeader(title?: string, text?: string): boolean {
    if (!title) return false;
    
    // Section header characteristics:
    // - Medium title (< 80 chars)
    // - Brief subtitle or no text (< 100 chars)
    
    const titleLength = title.length;
    const textLength = text ? text.length : 0;
    
    return titleLength < 80 && textLength < 100 && textLength > 0;
  }

  /**
   * Check if content is image-focused
   */
  private isImageFocused(images: number, text?: string, charts: number = 0): boolean {
    const visualCount = images + charts;
    const textLength = text ? text.length : 0;
    
    // Image-focused if:
    // - Has visuals and minimal text (< 100 chars)
    // - Or has multiple visuals (2+) and moderate text (< 200 chars)
    
    return (visualCount > 0 && textLength < 100) || 
           (visualCount >= 2 && textLength < 200);
  }

  /**
   * Detect comparison keywords
   */
  private detectComparison(text: string): boolean {
    const comparisonKeywords = [
      'versus', 'vs', 'vs.', 'compared to', 'difference between',
      'pros and cons', 'advantages', 'disadvantages',
      'before and after', 'old vs new', 'traditional vs modern',
      'compare', 'contrast', 'better than', 'worse than'
    ];

    const lowerText = text.toLowerCase();
    return comparisonKeywords.some(keyword => lowerText.includes(keyword));
  }

  /**
   * Check if text has multiple lists
   */
  private hasMultipleLists(text: string): boolean {
    // Count bullet point indicators
    const bulletIndicators = [
      /^[\s]*[-•*]\s/gm,  // Dash, bullet, asterisk
      /^[\s]*\d+\.\s/gm,  // Numbered lists
      /^[\s]*[a-z]\.\s/gm // Lettered lists
    ];

    let totalBullets = 0;
    for (const pattern of bulletIndicators) {
      const matches = text.match(pattern);
      if (matches) {
        totalBullets += matches.length;
      }
    }

    return totalBullets > 4;
  }

  /**
   * Calculate content complexity score
   */
  calculateComplexity(content: string): ComplexityAnalysis {
    if (!content || content.trim().length === 0) {
      return this.getEmptyComplexity();
    }

    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const words = content.match(/\b\w+\b/g) || [];
    
    const wordCount = words.length;
    const sentenceCount = sentences.length;
    const avgWordsPerSentence = sentenceCount > 0 ? wordCount / sentenceCount : 0;
    const longWords = words.filter(w => w.length > 7).length;
    const bulletPoints = (content.match(/^[\s]*[-•*]\s/gm) || []).length;
    const images = 0; // Would be passed separately

    // Calculate complexity score (0-100)
    let score = 0;
    
    // Word count factor (0-30 points)
    if (wordCount > 200) score += 30;
    else if (wordCount > 100) score += 20;
    else if (wordCount > 50) score += 10;
    
    // Sentence complexity (0-30 points)
    if (avgWordsPerSentence > 25) score += 30;
    else if (avgWordsPerSentence > 20) score += 20;
    else if (avgWordsPerSentence > 15) score += 10;
    
    // Long words (0-20 points)
    const longWordRatio = wordCount > 0 ? longWords / wordCount : 0;
    if (longWordRatio > 0.3) score += 20;
    else if (longWordRatio > 0.2) score += 10;
    
    // Bullet points (0-20 points)
    if (bulletPoints > 8) score += 20;
    else if (bulletPoints > 5) score += 10;

    // Determine level
    let level: 'simple' | 'moderate' | 'complex' | 'very-complex';
    if (score < 25) level = 'simple';
    else if (score < 50) level = 'moderate';
    else if (score < 75) level = 'complex';
    else level = 'very-complex';

    // Generate suggestions
    const suggestions = this.generateComplexitySuggestions({
      wordCount,
      sentenceCount,
      avgWordsPerSentence,
      longWords,
      bulletPoints,
      images
    }, level);

    return {
      score,
      level,
      factors: {
        wordCount,
        sentenceCount,
        avgWordsPerSentence: Number(avgWordsPerSentence.toFixed(1)),
        longWords,
        bulletPoints,
        images
      },
      suggestions
    };
  }

  /**
   * Generate complexity suggestions
   */
  private generateComplexitySuggestions(
    factors: ComplexityAnalysis['factors'],
    level: ComplexityAnalysis['level']
  ): string[] {
    const suggestions: string[] = [];

    if (level === 'very-complex' || level === 'complex') {
      suggestions.push('Consider splitting content across multiple slides');
    }

    if (factors.avgWordsPerSentence > 20) {
      suggestions.push('Break long sentences into shorter ones for clarity');
    }

    if (factors.longWords > factors.wordCount * 0.25) {
      suggestions.push('Use simpler words where possible');
    }

    if (factors.bulletPoints > 6) {
      suggestions.push('Reduce bullet points to 5-6 key points per slide');
    }

    if (factors.wordCount > 150) {
      suggestions.push('Aim for 50-100 words per slide for better engagement');
    }

    if (factors.bulletPoints === 0 && factors.wordCount > 100) {
      suggestions.push('Consider using bullet points to organize content');
    }

    return suggestions;
  }

  /**
   * Analyze content type and characteristics
   */
  analyzeContent(content: {
    title?: string;
    text?: string;
  }): ContentAnalysis {
    const text = (content.title || '') + ' ' + (content.text || '');
    
    if (!text.trim()) {
      return {
        type: 'mixed',
        keywords: [],
        sentiment: 'neutral',
        hasNumbers: false,
        hasComparison: false,
        hasList: false,
        hasQuestions: false
      };
    }

    // Detect content type
    const type = this.detectContentType(text);
    
    // Extract keywords
    const keywords = this.extractKeywords(text);
    
    // Analyze sentiment (simple)
    const sentiment = this.analyzeSentiment(text);
    
    // Detect features
    const hasNumbers = /\d+/.test(text);
    const hasComparison = this.detectComparison(text);
    const hasList = this.hasMultipleLists(text);
    const hasQuestions = /\?/.test(text);

    return {
      type,
      keywords,
      sentiment,
      hasNumbers,
      hasComparison,
      hasList,
      hasQuestions
    };
  }

  /**
   * Detect content type
   */
  private detectContentType(text: string): ContentAnalysis['type'] {
    const lower = text.toLowerCase();
    
    // Title detection
    if (text.length < 100 && !text.includes('.')) {
      return 'title';
    }
    
    // List detection
    if (this.hasMultipleLists(text)) {
      return 'list';
    }
    
    // Comparison detection
    if (this.detectComparison(text)) {
      return 'comparison';
    }
    
    // Data detection
    if (/\d+%|\$\d+|\d+\.\d+/.test(text)) {
      return 'data';
    }
    
    // Visual detection
    if (lower.includes('image') || lower.includes('chart') || lower.includes('graph')) {
      return 'visual';
    }
    
    // Default to content
    return 'content';
  }

  /**
   * Extract keywords
   */
  private extractKeywords(text: string, limit: number = 5): string[] {
    this.tfidf = new TfIdf();
    this.tfidf.addDocument(text);
    
    const keywords: Array<{ term: string; score: number }> = [];
    
    this.tfidf.listTerms(0).forEach((item: any) => {
      if (item.term.length > 3) {
        keywords.push({ term: item.term, score: item.tfidf });
      }
    });

    return keywords
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(k => k.term);
  }

  /**
   * Simple sentiment analysis
   */
  private analyzeSentiment(text: string): 'positive' | 'neutral' | 'negative' {
    const positiveWords = ['good', 'great', 'excellent', 'success', 'achieve', 'improve', 'benefit', 'advantage'];
    const negativeWords = ['bad', 'poor', 'fail', 'problem', 'issue', 'challenge', 'risk', 'disadvantage'];
    
    const lower = text.toLowerCase();
    const positiveCount = positiveWords.filter(word => lower.includes(word)).length;
    const negativeCount = negativeWords.filter(word => lower.includes(word)).length;
    
    if (positiveCount > negativeCount) return 'positive';
    if (negativeCount > positiveCount) return 'negative';
    return 'neutral';
  }

  /**
   * Get empty complexity analysis
   */
  private getEmptyComplexity(): ComplexityAnalysis {
    return {
      score: 0,
      level: 'simple',
      factors: {
        wordCount: 0,
        sentenceCount: 0,
        avgWordsPerSentence: 0,
        longWords: 0,
        bulletPoints: 0,
        images: 0
      },
      suggestions: ['Add content to analyze']
    };
  }

  /**
   * Suggest slide improvements
   */
  suggestImprovements(content: {
    title?: string;
    text?: string;
    images?: number;
    bullets?: number;
  }): string[] {
    const suggestions: string[] = [];
    const { title, text, images = 0, bullets = 0 } = content;

    // Title suggestions
    if (!title || title.length === 0) {
      suggestions.push('Add a descriptive title to the slide');
    } else if (title.length > 80) {
      suggestions.push('Shorten title to under 80 characters');
    }

    // Content suggestions
    if (text) {
      const complexity = this.calculateComplexity(text);
      suggestions.push(...complexity.suggestions);
    }

    // Visual balance
    if (text && text.length > 200 && images === 0) {
      suggestions.push('Add visuals to break up text-heavy content');
    }

    if (images > 3) {
      suggestions.push('Consider reducing number of images for clarity');
    }

    // Bullet point suggestions
    if (bullets > 7) {
      suggestions.push('Reduce to 5-7 bullet points maximum');
    }

    return suggestions;
  }
}

