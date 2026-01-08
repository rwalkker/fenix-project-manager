"use strict";
// FENIX Project Manager - Content Reuse Service
// Suggest reusable content from past documents
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContentReuseService = void 0;
exports.createContentReuseService = createContentReuseService;
/**
 * Content Reuse Service
 * Manages and suggests reusable content
 */
class ContentReuseService {
    contentBlocks;
    contentIndex; // keyword -> block IDs
    constructor() {
        this.contentBlocks = new Map();
        this.contentIndex = new Map();
    }
    /**
     * Add content block
     */
    async addContentBlock(block) {
        this.contentBlocks.set(block.id, block);
        // Index by tags
        block.tags.forEach(tag => {
            if (!this.contentIndex.has(tag)) {
                this.contentIndex.set(tag, new Set());
            }
            this.contentIndex.get(tag).add(block.id);
        });
        // Index by keywords in content
        const keywords = this.extractKeywords(block.content);
        keywords.forEach(keyword => {
            if (!this.contentIndex.has(keyword)) {
                this.contentIndex.set(keyword, new Set());
            }
            this.contentIndex.get(keyword).add(block.id);
        });
    }
    /**
     * Get content suggestions for query
     */
    async getSuggestions(query, limit = 5) {
        const keywords = this.extractKeywords(query);
        const blockScores = new Map();
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
        const suggestions = [];
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
    async getSuggestionsByTags(tags, limit = 5) {
        const blockIds = new Set();
        // Find blocks with matching tags
        tags.forEach(tag => {
            const ids = this.contentIndex.get(tag);
            if (ids) {
                ids.forEach(id => blockIds.add(id));
            }
        });
        // Convert to suggestions
        const suggestions = [];
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
    async markAsUsed(blockId) {
        const block = this.contentBlocks.get(blockId);
        if (block) {
            block.usageCount++;
            block.lastUsed = new Date();
        }
    }
    /**
     * Get most reused content
     */
    async getMostReused(limit = 10) {
        const blocks = Array.from(this.contentBlocks.values());
        blocks.sort((a, b) => b.usageCount - a.usageCount);
        return blocks.slice(0, limit);
    }
    /**
     * Get recently used content
     */
    async getRecentlyUsed(limit = 10) {
        const blocks = Array.from(this.contentBlocks.values());
        blocks.sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());
        return blocks.slice(0, limit);
    }
    /**
     * Get content by type
     */
    async getContentByType(type, limit) {
        const blocks = Array.from(this.contentBlocks.values())
            .filter(b => b.type === type);
        return limit ? blocks.slice(0, limit) : blocks;
    }
    /**
     * Get reuse statistics
     */
    async getReuseStatistics() {
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
    async searchContent(query, options) {
        let blocks = Array.from(this.contentBlocks.values());
        // Filter by type
        if (options?.type) {
            blocks = blocks.filter(b => b.type === options.type);
        }
        // Filter by tags
        if (options?.tags && options.tags.length > 0) {
            blocks = blocks.filter(b => options.tags.some(tag => b.tags.includes(tag)));
        }
        // Filter by usage count
        if (options?.minUsageCount !== undefined) {
            blocks = blocks.filter(b => b.usageCount >= options.minUsageCount);
        }
        // Filter by query
        const lowerQuery = query.toLowerCase();
        blocks = blocks.filter(b => b.content.toLowerCase().includes(lowerQuery) ||
            b.tags.some(tag => tag.toLowerCase().includes(lowerQuery)));
        return blocks;
    }
    /**
     * Delete content block
     */
    async deleteContentBlock(blockId) {
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
    async updateContentBlock(blockId, updates) {
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
                    this.contentIndex.get(tag).add(blockId);
                });
            }
            // Update block
            Object.assign(block, updates);
        }
    }
    /**
     * Get content block by ID
     */
    async getContentBlock(blockId) {
        return this.contentBlocks.get(blockId) || null;
    }
    /**
     * Get all content blocks
     */
    async getAllContentBlocks() {
        return Array.from(this.contentBlocks.values());
    }
    // ========== Private Helper Methods ==========
    /**
     * Extract keywords from text
     */
    extractKeywords(text) {
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
    generateRationale(block, keywords, score) {
        const matchCount = score;
        const usageInfo = block.usageCount > 1
            ? ` Used ${block.usageCount} times before.`
            : '';
        return `Matches ${matchCount} of ${keywords.length} keywords.${usageInfo}`;
    }
    /**
     * Generate context for block
     */
    generateContext(block) {
        const source = block.source.name;
        const type = block.type;
        const date = block.createdAt.toLocaleDateString();
        return `From "${source}" (${type}, created ${date})`;
    }
}
exports.ContentReuseService = ContentReuseService;
/**
 * Create Content Reuse Service instance
 */
function createContentReuseService() {
    return new ContentReuseService();
}
//# sourceMappingURL=ContentReuseService.js.map