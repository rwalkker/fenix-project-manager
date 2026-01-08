/**
 * Key Point
 */
export interface KeyPoint {
    id: string;
    text: string;
    importance: number;
    category: 'main-idea' | 'supporting-detail' | 'action-item' | 'critical-info' | 'insight';
    context?: string;
    relatedPoints?: string[];
}
/**
 * Action Item
 */
export interface ActionItem {
    id: string;
    text: string;
    priority: 'high' | 'medium' | 'low';
    assignee?: string;
    dueDate?: Date;
    status: 'pending' | 'in-progress' | 'completed';
    dependencies?: string[];
}
/**
 * Point Group
 */
export interface PointGroup {
    id: string;
    name: string;
    theme: string;
    points: KeyPoint[];
    importance: number;
}
/**
 * Extraction Options
 */
export interface ExtractionOptions {
    maxPoints?: number;
    minImportance?: number;
    categories?: KeyPoint['category'][];
    groupByTheme?: boolean;
    extractActionItems?: boolean;
}
/**
 * Key Point Extraction Service
 * Extracts key points, action items, and critical information from content
 */
export declare class KeyPointExtractionService {
    private pointIdCounter;
    private actionIdCounter;
    /**
     * Extract key points from content
     */
    extractKeyPoints(content: string, options?: ExtractionOptions): Promise<KeyPoint[]>;
    /**
     * Extract action items from content
     */
    extractActionItems(content: string): Promise<ActionItem[]>;
    /**
     * Prioritize points by importance
     */
    prioritizePoints(points: KeyPoint[]): Promise<KeyPoint[]>;
    /**
     * Group points by theme
     */
    groupByTheme(points: KeyPoint[]): Promise<PointGroup[]>;
    /**
     * Extract critical information
     */
    extractCriticalInfo(content: string): Promise<KeyPoint[]>;
    /**
     * Extract main ideas
     */
    extractMainIdeas(content: string, count?: number): Promise<KeyPoint[]>;
    /**
     * Extract insights
     */
    extractInsights(content: string): Promise<KeyPoint[]>;
    private splitIntoSentences;
    private analyzeSentence;
    private categorize;
    private isActionItem;
    private isMainIdea;
    private calculateImportance;
    private calculatePriority;
    private extractContext;
    private findRelatedPoints;
    private areRelated;
    private createActionItem;
    private determinePriority;
    private identifyThemes;
    private belongsToTheme;
    private generateId;
}
//# sourceMappingURL=KeyPointExtractionService.d.ts.map