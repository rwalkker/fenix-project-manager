"use strict";
// FENIX Project Manager - Key Point Extraction Service
// Extract key points, action items, and critical information from content
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeyPointExtractionService = void 0;
/**
 * Key Point Extraction Service
 * Extracts key points, action items, and critical information from content
 */
class KeyPointExtractionService {
    pointIdCounter = 0;
    actionIdCounter = 0;
    /**
     * Extract key points from content
     */
    async extractKeyPoints(content, options = {}) {
        const { maxPoints = 10, minImportance = 0.3, categories
        // groupByTheme option is available but not used in this implementation
         } = options;
        // Split content into sentences
        const sentences = this.splitIntoSentences(content);
        // Analyze each sentence
        const points = [];
        for (const sentence of sentences) {
            const point = this.analyzeSentence(sentence, content);
            if (point && point.importance >= minImportance) {
                if (!categories || categories.includes(point.category)) {
                    points.push(point);
                }
            }
        }
        // Sort by importance
        points.sort((a, b) => b.importance - a.importance);
        // Limit to max points
        const topPoints = points.slice(0, maxPoints);
        // Find related points
        this.findRelatedPoints(topPoints);
        return topPoints;
    }
    /**
     * Extract action items from content
     */
    async extractActionItems(content) {
        const sentences = this.splitIntoSentences(content);
        const actionItems = [];
        for (const sentence of sentences) {
            if (this.isActionItem(sentence)) {
                const item = this.createActionItem(sentence);
                actionItems.push(item);
            }
        }
        // Sort by priority
        actionItems.sort((a, b) => {
            const priorityOrder = { high: 0, medium: 1, low: 2 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
        });
        return actionItems;
    }
    /**
     * Prioritize points by importance
     */
    async prioritizePoints(points) {
        // Recalculate importance based on multiple factors
        const prioritized = points.map(point => ({
            ...point,
            importance: this.calculatePriority(point, points)
        }));
        // Sort by new importance
        prioritized.sort((a, b) => b.importance - a.importance);
        return prioritized;
    }
    /**
     * Group points by theme
     */
    async groupByTheme(points) {
        const themes = this.identifyThemes(points);
        const groups = [];
        for (const theme of themes) {
            const themePoints = points.filter(p => this.belongsToTheme(p, theme));
            if (themePoints.length > 0) {
                const avgImportance = themePoints.reduce((sum, p) => sum + p.importance, 0) / themePoints.length;
                groups.push({
                    id: this.generateId('group'),
                    name: theme,
                    theme,
                    points: themePoints,
                    importance: avgImportance
                });
            }
        }
        // Sort groups by importance
        groups.sort((a, b) => b.importance - a.importance);
        return groups;
    }
    /**
     * Extract critical information
     */
    async extractCriticalInfo(content) {
        return this.extractKeyPoints(content, {
            categories: ['critical-info'],
            minImportance: 0.7,
            maxPoints: 5
        });
    }
    /**
     * Extract main ideas
     */
    async extractMainIdeas(content, count = 3) {
        return this.extractKeyPoints(content, {
            categories: ['main-idea'],
            minImportance: 0.6,
            maxPoints: count
        });
    }
    /**
     * Extract insights
     */
    async extractInsights(content) {
        return this.extractKeyPoints(content, {
            categories: ['insight'],
            minImportance: 0.5,
            maxPoints: 5
        });
    }
    // Private helper methods
    splitIntoSentences(content) {
        // Simple sentence splitting (can be enhanced)
        return content
            .split(/[.!?]+/)
            .map(s => s.trim())
            .filter(s => s.length > 10);
    }
    analyzeSentence(sentence, fullContent) {
        const category = this.categorize(sentence);
        const importance = this.calculateImportance(sentence, fullContent);
        if (importance < 0.1) {
            return null;
        }
        return {
            id: this.generateId('point'),
            text: sentence,
            importance,
            category,
            context: this.extractContext(sentence, fullContent)
        };
    }
    categorize(sentence) {
        const lower = sentence.toLowerCase();
        // Action items
        if (this.isActionItem(sentence)) {
            return 'action-item';
        }
        // Critical information
        if (lower.includes('critical') || lower.includes('important') ||
            lower.includes('must') || lower.includes('required')) {
            return 'critical-info';
        }
        // Insights
        if (lower.includes('insight') || lower.includes('finding') ||
            lower.includes('discovered') || lower.includes('learned')) {
            return 'insight';
        }
        // Main ideas (typically at start of paragraphs or contain key concepts)
        if (this.isMainIdea(sentence)) {
            return 'main-idea';
        }
        return 'supporting-detail';
    }
    isActionItem(sentence) {
        const lower = sentence.toLowerCase();
        const actionVerbs = ['need to', 'should', 'must', 'will', 'plan to', 'going to', 'have to'];
        return actionVerbs.some(verb => lower.includes(verb));
    }
    isMainIdea(sentence) {
        const lower = sentence.toLowerCase();
        const indicators = ['overall', 'in summary', 'the key', 'primarily', 'mainly', 'essentially'];
        return indicators.some(ind => lower.includes(ind)) || sentence.length > 50;
    }
    calculateImportance(sentence, fullContent) {
        let score = 0.5; // Base score
        // Length factor (longer sentences often more important)
        if (sentence.length > 100)
            score += 0.1;
        if (sentence.length > 150)
            score += 0.1;
        // Keyword presence
        const keywords = ['key', 'important', 'critical', 'significant', 'major', 'primary'];
        const lower = sentence.toLowerCase();
        keywords.forEach(keyword => {
            if (lower.includes(keyword))
                score += 0.1;
        });
        // Position factor (earlier sentences often more important)
        const position = fullContent.indexOf(sentence) / fullContent.length;
        if (position < 0.2)
            score += 0.1; // First 20%
        if (position > 0.8)
            score += 0.05; // Last 20% (conclusions)
        // Numbers and data (often important)
        if (/\d+/.test(sentence))
            score += 0.05;
        if (/%/.test(sentence))
            score += 0.05;
        return Math.min(score, 1.0);
    }
    calculatePriority(point, _allPoints) {
        let priority = point.importance;
        // Boost for critical info and action items
        if (point.category === 'critical-info')
            priority += 0.2;
        if (point.category === 'action-item')
            priority += 0.15;
        if (point.category === 'main-idea')
            priority += 0.1;
        // Boost for points with many related points
        if (point.relatedPoints && point.relatedPoints.length > 2) {
            priority += 0.1;
        }
        return Math.min(priority, 1.0);
    }
    extractContext(sentence, fullContent) {
        const index = fullContent.indexOf(sentence);
        if (index === -1)
            return '';
        // Get surrounding text (50 chars before and after)
        const start = Math.max(0, index - 50);
        const end = Math.min(fullContent.length, index + sentence.length + 50);
        return fullContent.substring(start, end).trim();
    }
    findRelatedPoints(points) {
        for (let i = 0; i < points.length; i++) {
            const related = [];
            for (let j = 0; j < points.length; j++) {
                if (i !== j && this.areRelated(points[i], points[j])) {
                    related.push(points[j].id);
                }
            }
            points[i].relatedPoints = related;
        }
    }
    areRelated(point1, point2) {
        // Simple word overlap check
        const words1 = new Set(point1.text.toLowerCase().split(/\s+/).filter(w => w.length > 4));
        const words2 = new Set(point2.text.toLowerCase().split(/\s+/).filter(w => w.length > 4));
        let overlap = 0;
        words1.forEach(word => {
            if (words2.has(word))
                overlap++;
        });
        return overlap >= 2;
    }
    createActionItem(sentence) {
        return {
            id: this.generateId('action'),
            text: sentence,
            priority: this.determinePriority(sentence),
            status: 'pending'
        };
    }
    determinePriority(sentence) {
        const lower = sentence.toLowerCase();
        if (lower.includes('urgent') || lower.includes('immediately') || lower.includes('asap')) {
            return 'high';
        }
        if (lower.includes('soon') || lower.includes('priority')) {
            return 'medium';
        }
        return 'low';
    }
    identifyThemes(points) {
        // Extract common words/phrases as themes
        const wordFreq = new Map();
        points.forEach(point => {
            const words = point.text.toLowerCase().split(/\s+/).filter(w => w.length > 4);
            words.forEach(word => {
                wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
            });
        });
        // Get top themes
        const themes = Array.from(wordFreq.entries())
            .filter(([_, count]) => count >= 2)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)
            .map(([word]) => word);
        return themes.length > 0 ? themes : ['general'];
    }
    belongsToTheme(point, theme) {
        return point.text.toLowerCase().includes(theme);
    }
    generateId(prefix) {
        if (prefix === 'point') {
            return `${prefix}-${++this.pointIdCounter}`;
        }
        else {
            return `${prefix}-${++this.actionIdCounter}`;
        }
    }
}
exports.KeyPointExtractionService = KeyPointExtractionService;
//# sourceMappingURL=KeyPointExtractionService.js.map