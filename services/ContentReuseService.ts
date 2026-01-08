// FENIX Project Manager - Content Reuse Service
// Suggest reusable content from past documents
// Created: January 6, 2026

import type { DocumentReference } from '../models/orchestration-types';

/**
 * Content Block
 */
export interface ContentBlock {
  id: string;
  content: string;
  type: 'text' | 'heading' | 'list' | 'table' | 'image' | 'chart';
  source: DocumentReference;
  usageCount: number;
  tags: string[];
  createdAt: Date;
  lastUsed: Date;
}

/**
 * Content Suggestion
 */
export interface ContentSuggestion {
  block: ContentBlock;
  relevance: number; // 0-1
  rationale: string;
  context: string;
}

/**
 * Reuse Statistics
 */
export interface ReuseStatistics {
  totalBlocks: number;
  reusedBlocks: number;
  reuseRate: number;
  mostReusedBlocks: ContentBlock[];
  recentlyUsedBlocks: ContentBlock[];
}

/**
 * Content Reuse Service
 * Manages and suggests reusable content
 */
export class ContentReuseService {
  private contentBlocks: Map<string, ContentBlock>;
  private contentIndex: Map<string, Set<string>>; // keyword -> block IDs

  constructor() {
    this.contentBlocks = new Map();
    this.contentIndex = new Map();
  }

  /**
   * Add content block
   */
  async addContentBlock(block: ContentBlock): Promise<void> {
    this.contentBlocks.set(block.id, block);

    // Index by tags
    block.tags.forEach(tag => {
      if (!this.contentIndex.has(tag)) {
        this.contentIndex.set(tag, new Set());
      }
      this.contentIndex.get(tag)!.add(block.id);
    });

    // Index by keywords in content
    const keywords = this.extractKeywords(block.content);
    keywords.forEach(keyword => {
      if (!this.contentIndex.has(keyword)) {
        this.contentIndex.set(keyword, new Set());
      }
      this.contentIndex.get(keyword)!.add(block.id);
    });
  }

  /**
   * Get content suggestions for query
   */
  async getSuggestions(
    query: string,
    limit: number = 5
  ): Promise<ContentSuggestion[]> {
    const keywords = this.extractKeywords(query);
    const blockScores = new Map<string, number>();

    // Score blocks based on keyword matches
    keywords.forEach(keyword => {
      const blockIds = this.contentIndex.get(keyword);
      if (blockIds) {
        blockIds.forEach(blockId => {
          const currentScore = blockScores.get(blockId) || 0;
          blockScores.set(blockId, currentScore + 1);
        });
      }
    });

    // Convert to suggestions
    const suggestions: ContentSuggestion[] = [];
    for (const [blockId, score] of blockScores.entries()) {
      const block = this.contentBlocks.get(blockId);
      if (block) {
        const relevance = Math.min(score / keywords.length, 1.0);
        suggestions.push({
          block,
          relevance,
          rationale: this.generateRationale(block, keywords, score),
          context: this.generateContext(block)
        });
      }
    }

    // Sort by relevance and usage count
    suggestions.sort((a, b) => {
      const relevanceDiff = b.relevance - a.relevance;
      if (Math.abs(relevanceDiff) > 0.1) {
        return relevanceDiff;
      }
      return b.block.usageCount - a.block.usageCount;
    });

    return suggestions.slice(0, limit);
  }

  /**
   * Get suggestions by tags
   */
  async getSuggestionsByTags(
    tags: string[],
    limit: number = 5
  ): Promise<ContentSuggestion[]> {
    const blockIds = new Set<string>();

    // Find blocks with matching tags
    tags.forEach(tag => {
      const ids = this.contentIndex.get(tag);
      if (ids) {
        ids.forEach(id => blockIds.add(id));
      }
    });

    // Convert to suggestions
    const suggestions: ContentSuggestion[] = [];
    for (const blockId of blockIds) {
      const block = this.contentBlocks.get(blockId);
      if (block) {
        const matchingTags = block.tags.filter(t => tags.includes(t));
        const relevance = matchingTags.length / tags.length;
        
        suggestions.push({
          block,
          relevance,
          rationale: `Matches ${matchingTags.length} of ${tags.length} tags`,
          context: this.generateContext(block)
        });
      }
    }

    // Sort by relevance
    suggestions.sort((a, b) => b.relevance - a.relevance);

    return suggestions.slice(0, limit);
  }

  /**
   * Mark content as used
   */
  async markAsUsed(blockId: string): Promise<void> {
    const block = this.contentBlocks.get(blockId);
    if (block) {
      block.usageCount++;
      block.lastUsed = new Date();
    }
  }

  /**
   * Get most reused content
   */
  async getMostReused(limit: number = 10): Promise<ContentBlock[]> {
    const blocks = Array.from(this.contentBlocks.values());
    blocks.sort((a, b) => b.usageCount - a.usageCount);
    return blocks.slice(0, limit);
  }

  /**
   * Get recently used content
   */
  async getRecentlyUsed(limit: number = 10): Promise<ContentBlock[]> {
    const blocks = Array.from(this.contentBlocks.values());
    blocks.sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());
    return blocks.slice(0, limit);
  }

  /**
   * Get content by type
   */
  async getContentByType(
    type: ContentBlock['type'],
    limit?: number
  ): Promise<ContentBlock[]> {
    const blocks = Array.from(this.contentBlocks.values())
      .filter(b => b.type === type);
    
    return limit ? blocks.slice(0, limit) : blocks;
  }

  /**
   * Get reuse statistics
   */
  async getReuseStatistics(): Promise<ReuseStatistics> {
    const blocks = Array.from(this.contentBlocks.values());
    const reusedBlocks = blocks.filter(b => b.usageCount > 1);

    return {
      totalBlocks: blocks.length,
      reusedBlocks: reusedBlocks.length,
      reuseRate: blocks.length > 0 ? reusedBlocks.length / blocks.length : 0,
      mostReusedBlocks: await this.getMostReused(5),
      recentlyUsedBlocks: await this.getRecentlyUsed(5)
    };
  }

  /**
   * Search content
   */
  async searchContent(
    query: string,
    options?: {
      type?: ContentBlock['type'];
      tags?: string[];
      minUsageCount?: number;
    }
  ): Promise<ContentBlock[]> {
    let blocks = Array.from(this.contentBlocks.values());

    // Filter by type
    if (options?.type) {
      blocks = blocks.filter(b => b.type === options.type);
    }

    // Filter by tags
    if (options?.tags && options.tags.length > 0) {
      blocks = blocks.filter(b => 
        options.tags!.some(tag => b.tags.includes(tag))
      );
    }

    // Filter by usage count
    if (options?.minUsageCount !== undefined) {
      blocks = blocks.filter(b => b.usageCount >= options.minUsageCount!);
    }

    // Filter by query
    const lowerQuery = query.toLowerCase();
    blocks = blocks.filter(b => 
      b.content.toLowerCase().includes(lowerQuery) ||
      b.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );

    return blocks;
  }

  /**
   * Delete content block
   */
  async deleteContentBlock(blockId: string): Promise<void> {
    const block = this.contentBlocks.get(blockId);
    if (block) {
      // Remove from index
      block.tags.forEach(tag => {
        const blockIds = this.contentIndex.get(tag);
        if (blockIds) {
          blockIds.delete(blockId);
          if (blockIds.size === 0) {
            this.contentIndex.delete(tag);
          }
        }
      });

      // Remove block
      this.contentBlocks.delete(blockId);
    }
  }

  /**
   * Update content block
   */
  async updateContentBlock(
    blockId: string,
    updates: Partial<ContentBlock>
  ): Promise<void> {
    const block = this.contentBlocks.get(blockId);
    if (block) {
      // If tags changed, update index
      if (updates.tags) {
        // Remove old tags from index
        block.tags.forEach(tag => {
          const blockIds = this.contentIndex.get(tag);
          if (blockIds) {
            blockIds.delete(blockId);
          }
        });

        // Add new tags to index
        updates.tags.forEach(tag => {
          if (!this.contentIndex.has(tag)) {
            this.contentIndex.set(tag, new Set());
          }
          this.contentIndex.get(tag)!.add(blockId);
        });
      }

      // Update block
      Object.assign(block, updates);
    }
  }

  /**
   * Get content block by ID
   */
  async getContentBlock(blockId: string): Promise<ContentBlock | null> {
    return this.contentBlocks.get(blockId) || null;
  }

  /**
   * Get all content blocks
   */
  async getAllContentBlocks(): Promise<ContentBlock[]> {
    return Array.from(this.contentBlocks.values());
  }

  // ========== Private Helper Methods ==========

  /**
   * Extract keywords from text
   */
  private extractKeywords(text: string): string[] {
    // Simplified keyword extraction
    const words = text.toLowerCase()
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => word.length > 3);

    // Remove duplicates
    return Array.from(new Set(words));
  }

  /**
   * Generate rationale for suggestion
   */
  private generateRationale(
    block: ContentBlock,
    keywords: string[],
    score: number
  ): string {
    const matchCount = score;
    const usageInfo = block.usageCount > 1 
      ? ` Used ${block.usageCount} times before.`
      : '';

    return `Matches ${matchCount} of ${keywords.length} keywords.${usageInfo}`;
  }

  /**
   * Generate context for block
   */
  private generateContext(block: ContentBlock): string {
    const source = block.source.name;
    const type = block.type;
    const date = block.createdAt.toLocaleDateString();

    return `From "${source}" (${type}, created ${date})`;
  }
}

/**
 * Create Content Reuse Service instance
 */
export function createContentReuseService(): ContentReuseService {
  return new ContentReuseService();
}
