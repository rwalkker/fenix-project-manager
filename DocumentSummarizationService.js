"use strict";
// FENIX Project Manager - Document Summarization Service
// Generate executive summaries and key takeaways
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocumentSummarizationService = void 0;
exports.createDocumentSummarizationService = createDocumentSummarizationService;
/**
 * Document Summarization Service
 * Generates summaries and extracts key information
 */
class DocumentSummarizationService {
    constructor() { }
    /**
     * Generate summary
     */
    async summarize(content, options = {}) {
        const { length = 'medium', style = 'paragraph', maxSentences, maxWords } = options;
        // Extract sentences
        const sentences = this.extractSentences(content);
        // Determine target length
        let targetSentences;
        if (maxSentences) {
            targetSentences = maxSentences;
        }
        else {
            targetSentences = this.calculateTargetLength(sentences.length, length);
        }
        // Score and rank sentences
        const scoredSentences = this.scoreSentences(sentences, content);
        // Select top sentences
        const selectedSentences = scoredSentences
            .slice(0, targetSentences)
            .sort((a, b) => a.position - b.position)
            .map(s => s.text);
        // Format based on style
        let summary = this.formatSummary(selectedSentences, style);
        // Apply word limit if specified
        if (maxWords) {
            summary = this.limitWords(summary, maxWords);
        }
        return summary;
    }
    /**
     * Generate detailed summary result
     */
    async summarizeDetailed(content, options = {}) {
        const summary = await this.summarize(content, options);
        const originalLength = content.split(/\s+/).length;
        const summaryLength = summary.split(/\s+/).length;
        const compressionRatio = summaryLength / originalLength;
        const keywords = options.includeKeywords
            ? this.extractKeywords(content, 10)
            : undefined;
        return {
            summary,
            originalLength,
            summaryLength,
            compressionRatio,
            keywords,
            confidence: this.calculateConfidence(content, summary)
        };
    }
    /**
     * Extract key takeaways
     */
    async extractTakeaways(content, count = 5) {
        const sentences = this.extractSentences(content);
        const scoredSentences = this.scoreSentences(sentences, content);
        return scoredSentences
            .slice(0, count)
            .map(s => s.text);
    }
    /**
     * Create executive summary
     */
    async createExecutiveSummary(content) {
        return this.summarize(content, {
            length: 'short',
            style: 'paragraph',
            maxSentences: 3
        });
    }
    /**
     * Create bullet point summary
     */
    async createBulletSummary(content, points = 5) {
        return this.summarize(content, {
            style: 'bullets',
            maxSentences: points
        });
    }
    /**
     * Extract highlights
     */
    async extractHighlights(content, count = 3) {
        const sentences = this.extractSentences(content);
        const scoredSentences = this.scoreSentences(sentences, content);
        // Get highest scoring sentences
        return scoredSentences
            .slice(0, count)
            .sort((a, b) => a.position - b.position)
            .map(s => s.text);
    }
    // ========== Private Helper Methods ==========
    /**
     * Extract sentences from text
     */
    extractSentences(text) {
        // Split on sentence boundaries
        return text
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 10); // Filter out very short fragments
    }
    /**
     * Calculate target length based on original length
     */
    calculateTargetLength(originalCount, length) {
        switch (length) {
            case 'short':
                return Math.max(2, Math.ceil(originalCount * 0.2));
            case 'medium':
                return Math.max(3, Math.ceil(originalCount * 0.3));
            case 'long':
                return Math.max(5, Math.ceil(originalCount * 0.5));
            default:
                return Math.max(3, Math.ceil(originalCount * 0.3));
        }
    }
    /**
     * Score sentences by importance
     */
    scoreSentences(sentences, fullText) {
        const keywords = this.extractKeywords(fullText, 20);
        const keywordSet = new Set(keywords);
        return sentences.map((sentence, index) => {
            let score = 0;
            // Position score (earlier sentences often more important)
            if (index < 3) {
                score += 2;
            }
            else if (index < 5) {
                score += 1;
            }
            // Keyword score
            const words = sentence.toLowerCase().split(/\s+/);
            const keywordMatches = words.filter(w => keywordSet.has(w)).length;
            score += keywordMatches * 2;
            // Length score (prefer medium-length sentences)
            const wordCount = words.length;
            if (wordCount >= 10 && wordCount <= 25) {
                score += 1;
            }
            // Numeric data score (sentences with numbers often important)
            if (/\d+/.test(sentence)) {
                score += 1;
            }
            return {
                text: sentence,
                score,
                position: index
            };
        }).sort((a, b) => b.score - a.score);
    }
    /**
     * Extract keywords from text
     */
    extractKeywords(text, count) {
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, '')
            .split(/\s+/)
            .filter(word => word.length > 4); // Filter short words
        // Count word frequency
        const frequency = new Map();
        words.forEach(word => {
            frequency.set(word, (frequency.get(word) || 0) + 1);
        });
        // Sort by frequency
        const sorted = Array.from(frequency.entries())
            .sort((a, b) => b[1] - a[1]);
        return sorted.slice(0, count).map(([word]) => word);
    }
    /**
     * Format summary based on style
     */
    formatSummary(sentences, style) {
        switch (style) {
            case 'bullets':
                return sentences.map(s => `• ${s}`).join('\n');
            case 'highlights':
                return sentences.map(s => `**${s}**`).join('\n\n');
            case 'paragraph':
            default:
                return sentences.join('. ') + '.';
        }
    }
    /**
     * Limit summary to maximum word count
     */
    limitWords(text, maxWords) {
        const words = text.split(/\s+/);
        if (words.length <= maxWords) {
            return text;
        }
        return words.slice(0, maxWords).join(' ') + '...';
    }
    /**
     * Calculate confidence score
     */
    calculateConfidence(original, summary) {
        const originalWords = original.split(/\s+/).length;
        const summaryWords = summary.split(/\s+/).length;
        // Higher confidence for appropriate compression ratios
        const ratio = summaryWords / originalWords;
        if (ratio >= 0.1 && ratio <= 0.4) {
            return 0.9;
        }
        else if (ratio >= 0.05 && ratio <= 0.5) {
            return 0.75;
        }
        else {
            return 0.6;
        }
    }
}
exports.DocumentSummarizationService = DocumentSummarizationService;
/**
 * Create Document Summarization Service instance
 */
function createDocumentSummarizationService() {
    return new DocumentSummarizationService();
}
//# sourceMappingURL=DocumentSummarizationService.js.map