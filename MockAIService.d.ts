export declare class MockAIService {
    /**
     * Generate slide topics based on title and content
     */
    generateSlideTopics(title: string, content: string, count: number): Promise<string[]>;
    /**
     * Generate slide content with bullets and notes
     */
    generateSlideContent(topic: string, type: string): Promise<any>;
    /**
     * Generate document outline
     */
    generateOutline(topic: string, sectionCount: number): Promise<string[]>;
    /**
     * Generate section content
     */
    generateContent(prompt: string, tone: string, length: string): Promise<string>;
    /**
     * Extract keywords from text
     */
    private extractKeywords;
    /**
     * Generate bullet points for a topic
     */
    private generateBullets;
    /**
     * Generate speaker notes
     */
    private generateNotes;
}
export declare function getMockAIService(): MockAIService;
//# sourceMappingURL=MockAIService.d.ts.map