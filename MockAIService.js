"use strict";
// Mock AI Service - Generates intelligent content without AWS Bedrock
// Used when AWS credentials are not available
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockAIService = void 0;
exports.getMockAIService = getMockAIService;
class MockAIService {
    /**
     * Generate slide topics based on title and content
     */
    async generateSlideTopics(title, content, count) {
        // Analyze the title and content to generate relevant topics
        const keywords = this.extractKeywords(title + ' ' + content);
        const topicTemplates = [
            'Executive Summary',
            'Current State Analysis',
            'Key Challenges',
            'Proposed Solutions',
            'Implementation Strategy',
            'Timeline and Milestones',
            'Resource Requirements',
            'Risk Assessment',
            'Success Metrics',
            'Next Steps',
            'Budget Overview',
            'Stakeholder Impact',
            'Technical Architecture',
            'Performance Indicators',
            'Recommendations'
        ];
        // Customize topics based on keywords
        const topics = [];
        for (let i = 0; i < Math.min(count, topicTemplates.length); i++) {
            if (keywords.length > 0 && i < keywords.length) {
                topics.push(`${topicTemplates[i]}: ${keywords[i]}`);
            }
            else {
                topics.push(topicTemplates[i]);
            }
        }
        return topics;
    }
    /**
     * Generate slide content with bullets and notes
     */
    async generateSlideContent(topic, type) {
        const bullets = this.generateBullets(topic);
        const notes = this.generateNotes(topic);
        return {
            type: 'content',
            title: topic,
            content: [{
                    type: 'bullets',
                    items: bullets.map(text => ({ text }))
                }],
            notes
        };
    }
    /**
     * Generate document outline
     */
    async generateOutline(topic, sectionCount) {
        const keywords = this.extractKeywords(topic);
        const outlineTemplates = [
            'Introduction',
            'Background and Context',
            'Current Situation',
            'Analysis and Findings',
            'Recommendations',
            'Implementation Plan',
            'Conclusion'
        ];
        const outline = [];
        for (let i = 0; i < Math.min(sectionCount, outlineTemplates.length); i++) {
            if (keywords.length > 0 && i < keywords.length) {
                outline.push(`${outlineTemplates[i]}: ${keywords[i]}`);
            }
            else {
                outline.push(outlineTemplates[i]);
            }
        }
        return outline;
    }
    /**
     * Generate section content
     */
    async generateContent(prompt, tone, length) {
        const keywords = this.extractKeywords(prompt);
        const paragraphs = [];
        // Generate introduction
        paragraphs.push(`This section provides a comprehensive overview of ${keywords[0] || 'the topic'}. ` +
            `Our analysis reveals several key insights that are critical for understanding ` +
            `the current landscape and future opportunities.`);
        // Generate body based on length
        const bodyParaCount = length === 'brief' ? 1 : length === 'detailed' ? 3 : 2;
        for (let i = 0; i < bodyParaCount; i++) {
            const keyword = keywords[i + 1] || 'this area';
            paragraphs.push(`Regarding ${keyword}, we have identified significant factors that influence outcomes. ` +
                `Through careful examination, it becomes clear that strategic approaches must be ` +
                `implemented to achieve optimal results. Key considerations include resource allocation, ` +
                `timeline management, and stakeholder engagement.`);
        }
        // Generate conclusion
        paragraphs.push(`In summary, the path forward requires careful planning and execution. ` +
            `By addressing these key areas systematically, we can ensure successful outcomes ` +
            `and sustainable progress toward our objectives.`);
        return paragraphs.join('\n\n');
    }
    /**
     * Extract keywords from text
     */
    extractKeywords(text) {
        // Remove common words and extract meaningful terms
        const commonWords = new Set([
            'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
            'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
            'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
            'could', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
        ]);
        const words = text
            .toLowerCase()
            .replace(/[^a-z0-9\s]/g, ' ')
            .split(/\s+/)
            .filter(word => word.length > 3 && !commonWords.has(word));
        // Get unique words and capitalize
        const unique = Array.from(new Set(words));
        return unique.slice(0, 10).map(word => word.charAt(0).toUpperCase() + word.slice(1));
    }
    /**
     * Generate bullet points for a topic
     */
    generateBullets(topic) {
        const keywords = this.extractKeywords(topic);
        const bullets = [
            `Key aspects of ${keywords[0] || 'this topic'} that drive success`,
            `Strategic approaches to optimize ${keywords[1] || 'outcomes'}`,
            `Critical factors influencing ${keywords[2] || 'performance'}`,
            `Best practices for implementing ${keywords[3] || 'solutions'}`,
            `Measurable results and success indicators`
        ];
        return bullets;
    }
    /**
     * Generate speaker notes
     */
    generateNotes(topic) {
        const keywords = this.extractKeywords(topic);
        return `When presenting this slide, emphasize the importance of ${keywords[0] || 'the topic'}. ` +
            `Highlight key points and provide specific examples where possible. ` +
            `Be prepared to answer questions about implementation details and expected outcomes. ` +
            `Connect this content to the overall presentation narrative and business objectives.`;
    }
}
exports.MockAIService = MockAIService;
function getMockAIService() {
    return new MockAIService();
}
//# sourceMappingURL=MockAIService.js.map