// FENIX Project Manager - Citation Management Service
// Track sources, manage citations, and generate bibliographies
// Created: January 6, 2026

/**
 * Citation Style
 */
export type CitationStyle = 'APA' | 'MLA' | 'Chicago' | 'Harvard' | 'IEEE';

/**
 * Source Type
 */
export type SourceType = 'book' | 'article' | 'website' | 'journal' | 'report' | 'conference' | 'other';

/**
 * Citation Source
 */
export interface CitationSource {
  id: string;
  type: SourceType;
  title: string;
  authors: string[];
  year?: number;
  publisher?: string;
  url?: string;
  doi?: string;
  pages?: string;
  volume?: string;
  issue?: string;
  accessDate?: Date;
  metadata?: Record<string, any>;
}

/**
 * Citation Reference
 */
export interface CitationReference {
  id: string;
  sourceId: string;
  location: string; // Where in document
  page?: number;
  context?: string;
}

/**
 * Bibliography Entry
 */
export interface BibliographyEntry {
  sourceId: string;
  formatted: string;
  style: CitationStyle;
}

/**
 * Citation Validation Result
 */
export interface CitationValidationResult {
  valid: boolean;
  issues: string[];
  missingFields: string[];
  suggestions: string[];
}

/**
 * Plagiarism Check Result
 */
export interface PlagiarismCheckResult {
  suspicious: boolean;
  matches: {
    text: string;
    sourceId?: string;
    similarity: number; // 0-1
  }[];
  overallSimilarity: number; // 0-1
}

/**
 * Citation Management Service
 * Tracks sources, manages citations, and generates bibliographies
 */
export class CitationManagementService {
  private sources: Map<string, CitationSource> = new Map();
  private references: CitationReference[] = [];
  private sourceIdCounter = 0;
  private referenceIdCounter = 0;

  /**
   * Add a source
   */
  async addSource(source: Omit<CitationSource, 'id'>): Promise<string> {
    const id = this.generateSourceId();
    const fullSource: CitationSource = { ...source, id };
    this.sources.set(id, fullSource);
    return id;
  }

  /**
   * Get a source
   */
  async getSource(sourceId: string): Promise<CitationSource | undefined> {
    return this.sources.get(sourceId);
  }

  /**
   * Update a source
   */
  async updateSource(sourceId: string, updates: Partial<CitationSource>): Promise<void> {
    const source = this.sources.get(sourceId);
    if (!source) {
      throw new Error(`Source not found: ${sourceId}`);
    }
    this.sources.set(sourceId, { ...source, ...updates });
  }

  /**
   * Delete a source
   */
  async deleteSource(sourceId: string): Promise<void> {
    this.sources.delete(sourceId);
    // Remove associated references
    this.references = this.references.filter(ref => ref.sourceId !== sourceId);
  }

  /**
   * Track a citation reference
   */
  async addReference(sourceId: string, location: string, context?: string): Promise<string> {
    if (!this.sources.has(sourceId)) {
      throw new Error(`Source not found: ${sourceId}`);
    }

    const id = this.generateReferenceId();
    const reference: CitationReference = {
      id,
      sourceId,
      location,
      context
    };

    this.references.push(reference);
    return id;
  }

  /**
   * Get all references for a source
   */
  async getReferences(sourceId: string): Promise<CitationReference[]> {
    return this.references.filter(ref => ref.sourceId === sourceId);
  }

  /**
   * Generate bibliography
   */
  async generateBibliography(style: CitationStyle = 'APA'): Promise<BibliographyEntry[]> {
    const entries: BibliographyEntry[] = [];

    // Get all cited sources (sources that have references)
    const citedSourceIds = new Set(this.references.map(ref => ref.sourceId));

    for (const sourceId of citedSourceIds) {
      const source = this.sources.get(sourceId);
      if (source) {
        const formatted = this.formatCitationByStyle(source, style);
        entries.push({
          sourceId,
          formatted,
          style
        });
      }
    }

    // Sort alphabetically by formatted citation
    entries.sort((a, b) => a.formatted.localeCompare(b.formatted));

    return entries;
  }

  /**
   * Format a single citation
   */
  async formatCitation(sourceId: string, style: CitationStyle = 'APA'): Promise<string> {
    const source = this.sources.get(sourceId);
    if (!source) {
      throw new Error(`Source not found: ${sourceId}`);
    }
    return this.formatCitationByStyle(source, style);
  }

  /**
   * Validate citation format
   */
  async validateCitation(sourceId: string): Promise<CitationValidationResult> {
    const source = this.sources.get(sourceId);
    if (!source) {
      return {
        valid: false,
        issues: ['Source not found'],
        missingFields: [],
        suggestions: []
      };
    }

    const issues: string[] = [];
    const missingFields: string[] = [];
    const suggestions: string[] = [];

    // Check required fields
    if (!source.title) missingFields.push('title');
    if (!source.authors || source.authors.length === 0) missingFields.push('authors');

    // Type-specific validation
    switch (source.type) {
      case 'book':
        if (!source.publisher) missingFields.push('publisher');
        if (!source.year) missingFields.push('year');
        break;
      case 'article':
      case 'journal':
        if (!source.volume) suggestions.push('Consider adding volume number');
        if (!source.pages) suggestions.push('Consider adding page numbers');
        break;
      case 'website':
        if (!source.url) missingFields.push('url');
        if (!source.accessDate) suggestions.push('Consider adding access date');
        break;
    }

    // Check for DOI
    if ((source.type === 'article' || source.type === 'journal') && !source.doi) {
      suggestions.push('Consider adding DOI if available');
    }

    const valid = missingFields.length === 0;

    return {
      valid,
      issues,
      missingFields,
      suggestions
    };
  }

  /**
   * Check for plagiarism
   */
  async checkPlagiarism(content: string): Promise<PlagiarismCheckResult> {
    const matches: PlagiarismCheckResult['matches'] = [];
    const sentences = this.splitIntoSentences(content);

    // Check each sentence against source content
    for (const sentence of sentences) {
      if (sentence.length < 20) continue; // Skip short sentences

      for (const [sourceId, source] of this.sources) {
        // Simple similarity check (in real implementation, use more sophisticated algorithm)
        const sourceText = this.getSourceText(source);
        if (sourceText && this.calculateSimilarity(sentence, sourceText) > 0.8) {
          matches.push({
            text: sentence,
            sourceId,
            similarity: this.calculateSimilarity(sentence, sourceText)
          });
        }
      }
    }

    const overallSimilarity = matches.length / sentences.length;
    const suspicious = overallSimilarity > 0.3 || matches.some(m => m.similarity > 0.9);

    return {
      suspicious,
      matches,
      overallSimilarity
    };
  }

  /**
   * Maintain citation consistency
   */
  async checkConsistency(style: CitationStyle): Promise<string[]> {
    const issues: string[] = [];

    // Check if all sources can be formatted in the given style
    for (const [sourceId, source] of this.sources) {
      const validation = await this.validateCitation(sourceId);
      if (!validation.valid) {
        issues.push(`Source "${source.title}" has missing required fields for ${style} style`);
      }
    }

    // Check for duplicate sources
    const titles = Array.from(this.sources.values()).map(s => s.title.toLowerCase());
    const duplicates = titles.filter((title, index) => titles.indexOf(title) !== index);
    if (duplicates.length > 0) {
      issues.push(`Duplicate sources detected: ${duplicates.join(', ')}`);
    }

    return issues;
  }

  /**
   * Get citation statistics
   */
  async getStatistics(): Promise<{
    totalSources: number;
    totalReferences: number;
    sourcesByType: Record<SourceType, number>;
    mostCitedSources: { sourceId: string; title: string; count: number }[];
  }> {
    const sourcesByType: Record<SourceType, number> = {
      book: 0,
      article: 0,
      website: 0,
      journal: 0,
      report: 0,
      conference: 0,
      other: 0
    };

    for (const source of this.sources.values()) {
      sourcesByType[source.type]++;
    }

    // Count references per source
    const referenceCounts = new Map<string, number>();
    for (const ref of this.references) {
      referenceCounts.set(ref.sourceId, (referenceCounts.get(ref.sourceId) || 0) + 1);
    }

    // Get most cited sources
    const mostCited = Array.from(referenceCounts.entries())
      .map(([sourceId, count]) => {
        const source = this.sources.get(sourceId);
        return {
          sourceId,
          title: source?.title || 'Unknown',
          count
        };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    return {
      totalSources: this.sources.size,
      totalReferences: this.references.length,
      sourcesByType,
      mostCitedSources: mostCited
    };
  }

  // Private helper methods

  private formatCitationByStyle(source: CitationSource, style: CitationStyle): string {
    switch (style) {
      case 'APA':
        return this.formatAPA(source);
      case 'MLA':
        return this.formatMLA(source);
      case 'Chicago':
        return this.formatChicago(source);
      case 'Harvard':
        return this.formatHarvard(source);
      case 'IEEE':
        return this.formatIEEE(source);
      default:
        return this.formatAPA(source);
    }
  }

  private formatAPA(source: CitationSource): string {
    const authors = this.formatAuthorsAPA(source.authors);
    const year = source.year ? `(${source.year})` : '(n.d.)';
    const title = source.title;

    let citation = `${authors} ${year}. ${title}.`;

    if (source.publisher) {
      citation += ` ${source.publisher}.`;
    }

    if (source.url) {
      citation += ` Retrieved from ${source.url}`;
    }

    return citation;
  }

  private formatMLA(source: CitationSource): string {
    const authors = this.formatAuthorsMLA(source.authors);
    const title = `"${source.title}"`;

    let citation = `${authors}. ${title}.`;

    if (source.publisher) {
      citation += ` ${source.publisher},`;
    }

    if (source.year) {
      citation += ` ${source.year}.`;
    }

    return citation;
  }

  private formatChicago(source: CitationSource): string {
    const authors = this.formatAuthorsChicago(source.authors);
    const title = source.title;
    const year = source.year || 'n.d.';

    let citation = `${authors}. ${title}.`;

    if (source.publisher) {
      citation += ` ${source.publisher}, ${year}.`;
    }

    return citation;
  }

  private formatHarvard(source: CitationSource): string {
    return this.formatAPA(source); // Harvard is similar to APA
  }

  private formatIEEE(source: CitationSource): string {
    const authors = this.formatAuthorsIEEE(source.authors);
    const title = `"${source.title}"`;
    const year = source.year || 'n.d.';

    return `${authors}, ${title}, ${year}.`;
  }

  private formatAuthorsAPA(authors: string[]): string {
    if (authors.length === 0) return 'Unknown';
    if (authors.length === 1) return authors[0];
    if (authors.length === 2) return `${authors[0]} & ${authors[1]}`;
    return `${authors[0]} et al.`;
  }

  private formatAuthorsMLA(authors: string[]): string {
    if (authors.length === 0) return 'Unknown';
    if (authors.length === 1) return authors[0];
    return `${authors[0]}, et al`;
  }

  private formatAuthorsChicago(authors: string[]): string {
    return this.formatAuthorsAPA(authors);
  }

  private formatAuthorsIEEE(authors: string[]): string {
    if (authors.length === 0) return 'Unknown';
    if (authors.length <= 3) return authors.join(', ');
    return `${authors[0]} et al.`;
  }

  private splitIntoSentences(content: string): string[] {
    return content
      .split(/[.!?]+/)
      .map(s => s.trim())
      .filter(s => s.length > 0);
  }

  private getSourceText(source: CitationSource): string {
    // In real implementation, this would fetch actual source content
    // For now, return title and metadata
    return `${source.title} ${JSON.stringify(source.metadata || {})}`;
  }

  private calculateSimilarity(text1: string, text2: string): number {
    // Simple word overlap similarity
    const words1 = new Set(text1.toLowerCase().split(/\s+/));
    const words2 = new Set(text2.toLowerCase().split(/\s+/));

    let overlap = 0;
    words1.forEach(word => {
      if (words2.has(word)) overlap++;
    });

    return overlap / Math.max(words1.size, words2.size);
  }

  private generateSourceId(): string {
    return `source-${++this.sourceIdCounter}`;
  }

  private generateReferenceId(): string {
    return `ref-${++this.referenceIdCounter}`;
  }
}
