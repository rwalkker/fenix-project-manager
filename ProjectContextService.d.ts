import type { ProjectContext, DocumentReference, ProjectMetric, TeamMember, Milestone } from '../models/orchestration-types';
/**
 * Project
 */
export interface Project {
    id: string;
    name: string;
    description?: string;
    status: 'active' | 'completed' | 'archived';
    createdAt: Date;
    updatedAt: Date;
}
/**
 * Context Update
 */
export interface ContextUpdate {
    description?: string;
    team?: TeamMember[];
    timeline?: {
        startDate?: Date;
        endDate?: Date;
        milestones?: Milestone[];
    };
    documents?: DocumentReference[];
    metrics?: ProjectMetric[];
    tags?: string[];
    metadata?: Record<string, any>;
}
/**
 * Project Context Service
 * Manages project context and relationships
 */
export declare class ProjectContextService {
    private contexts;
    private projects;
    constructor();
    /**
     * Create project context
     */
    createContext(project: Project): Promise<ProjectContext>;
    /**
     * Update context
     */
    updateContext(projectId: string, updates: ContextUpdate): Promise<void>;
    /**
     * Get context
     */
    getContext(projectId: string): Promise<ProjectContext>;
    /**
     * Add document to context
     */
    addDocument(projectId: string, document: DocumentReference): Promise<void>;
    /**
     * Remove document from context
     */
    removeDocument(projectId: string, documentId: string): Promise<void>;
    /**
     * Add team member
     */
    addTeamMember(projectId: string, member: TeamMember): Promise<void>;
    /**
     * Remove team member
     */
    removeTeamMember(projectId: string, memberId: string): Promise<void>;
    /**
     * Add milestone
     */
    addMilestone(projectId: string, milestone: Milestone): Promise<void>;
    /**
     * Update milestone
     */
    updateMilestone(projectId: string, milestoneId: string, updates: Partial<Milestone>): Promise<void>;
    /**
     * Add metric
     */
    addMetric(projectId: string, metric: ProjectMetric): Promise<void>;
    /**
     * Get metrics by name
     */
    getMetricsByName(projectId: string, metricName: string): Promise<ProjectMetric[]>;
    /**
     * Get latest metric value
     */
    getLatestMetric(projectId: string, metricName: string): Promise<ProjectMetric | null>;
    /**
     * Add tag
     */
    addTag(projectId: string, tag: string): Promise<void>;
    /**
     * Remove tag
     */
    removeTag(projectId: string, tag: string): Promise<void>;
    /**
     * List all projects (alias for getAllProjects)
     */
    listProjects(): Promise<Project[]>;
    /**
     * Get all projects
     */
    getAllProjects(): Promise<Project[]>;
    /**
     * Get active projects
     */
    getActiveProjects(): Promise<Project[]>;
    /**
     * Get project by ID
     */
    getProject(projectId: string): Promise<Project | null>;
    /**
     * Update project status
     */
    updateProjectStatus(projectId: string, status: 'active' | 'completed' | 'archived'): Promise<void>;
    /**
     * Search projects by name
     */
    searchProjects(query: string): Promise<Project[]>;
    /**
     * Get projects by tag
     */
    getProjectsByTag(tag: string): Promise<Project[]>;
    /**
     * Get project statistics
     */
    getProjectStats(projectId: string): Promise<{
        documentCount: number;
        teamSize: number;
        milestoneCount: number;
        completedMilestones: number;
        metricCount: number;
        tagCount: number;
    }>;
    /**
     * Delete project and context
     */
    deleteProject(projectId: string): Promise<void>;
    /**
     * Export context (for backup/sharing)
     */
    exportContext(projectId: string): Promise<string>;
    /**
     * Import context (from backup/sharing)
     */
    importContext(data: string): Promise<string>;
}
/**
 * Create Project Context Service instance
 */
export declare function createProjectContextService(): ProjectContextService;
//# sourceMappingURL=ProjectContextService.d.ts.map