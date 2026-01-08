"use strict";
// FENIX Project Manager - Project Context Service
// Track project context across documents
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectContextService = void 0;
exports.createProjectContextService = createProjectContextService;
/**
 * Simple ID generator
 */
function generateId() {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
/**
 * Project Context Service
 * Manages project context and relationships
 */
class ProjectContextService {
    contexts;
    projects;
    constructor() {
        this.contexts = new Map();
        this.projects = new Map();
    }
    /**
     * Create project context
     */
    async createContext(project) {
        // Store project
        this.projects.set(project.id, project);
        // Create context
        const context = {
            projectId: project.id,
            projectName: project.name,
            description: project.description,
            team: [],
            timeline: {
                startDate: new Date(),
                milestones: []
            },
            documents: [],
            metrics: [],
            tags: [],
            metadata: {
                status: project.status,
                createdAt: project.createdAt,
                updatedAt: project.updatedAt
            }
        };
        this.contexts.set(project.id, context);
        return context;
    }
    /**
     * Update context
     */
    async updateContext(projectId, updates) {
        const context = this.contexts.get(projectId);
        if (!context) {
            throw new Error(`Project context not found: ${projectId}`);
        }
        // Update fields
        if (updates.description !== undefined) {
            context.description = updates.description;
        }
        if (updates.team) {
            context.team = updates.team;
        }
        if (updates.timeline) {
            if (!context.timeline) {
                context.timeline = { startDate: new Date(), milestones: [] };
            }
            context.timeline = {
                startDate: updates.timeline.startDate || context.timeline.startDate,
                endDate: updates.timeline.endDate,
                milestones: updates.timeline.milestones || context.timeline.milestones
            };
        }
        if (updates.documents) {
            context.documents = updates.documents;
        }
        if (updates.metrics) {
            context.metrics = updates.metrics;
        }
        if (updates.tags) {
            context.tags = updates.tags;
        }
        if (updates.metadata) {
            context.metadata = {
                ...context.metadata,
                ...updates.metadata
            };
        }
        // Update project timestamp
        const project = this.projects.get(projectId);
        if (project) {
            project.updatedAt = new Date();
        }
    }
    /**
     * Get context
     */
    async getContext(projectId) {
        const context = this.contexts.get(projectId);
        if (!context) {
            throw new Error(`Project context not found: ${projectId}`);
        }
        return context;
    }
    /**
     * Add document to context
     */
    async addDocument(projectId, document) {
        const context = await this.getContext(projectId);
        // Check if document already exists
        const exists = context.documents?.some(d => d.id === document.id);
        if (!exists) {
            if (!context.documents) {
                context.documents = [];
            }
            context.documents.push(document);
        }
        // Update project timestamp
        const project = this.projects.get(projectId);
        if (project) {
            project.updatedAt = new Date();
        }
    }
    /**
     * Remove document from context
     */
    async removeDocument(projectId, documentId) {
        const context = await this.getContext(projectId);
        if (context.documents) {
            context.documents = context.documents.filter(d => d.id !== documentId);
        }
        // Update project timestamp
        const project = this.projects.get(projectId);
        if (project) {
            project.updatedAt = new Date();
        }
    }
    /**
     * Add team member
     */
    async addTeamMember(projectId, member) {
        const context = await this.getContext(projectId);
        if (!context.team) {
            context.team = [];
        }
        // Check if member already exists
        const exists = context.team.some(m => m.id === member.id);
        if (!exists) {
            context.team.push(member);
        }
    }
    /**
     * Remove team member
     */
    async removeTeamMember(projectId, memberId) {
        const context = await this.getContext(projectId);
        if (context.team) {
            context.team = context.team.filter(m => m.id !== memberId);
        }
    }
    /**
     * Add milestone
     */
    async addMilestone(projectId, milestone) {
        const context = await this.getContext(projectId);
        if (!context.timeline) {
            context.timeline = { startDate: new Date(), milestones: [] };
        }
        if (!context.timeline.milestones) {
            context.timeline.milestones = [];
        }
        // Check if milestone already exists
        const exists = context.timeline.milestones.some(m => m.id === milestone.id);
        if (!exists) {
            context.timeline.milestones.push(milestone);
        }
    }
    /**
     * Update milestone
     */
    async updateMilestone(projectId, milestoneId, updates) {
        const context = await this.getContext(projectId);
        if (context.timeline?.milestones) {
            const milestone = context.timeline.milestones.find(m => m.id === milestoneId);
            if (milestone) {
                Object.assign(milestone, updates);
            }
        }
    }
    /**
     * Add metric
     */
    async addMetric(projectId, metric) {
        const context = await this.getContext(projectId);
        if (!context.metrics) {
            context.metrics = [];
        }
        context.metrics.push(metric);
        // Keep only last 100 metrics
        if (context.metrics.length > 100) {
            context.metrics = context.metrics.slice(-100);
        }
    }
    /**
     * Get metrics by name
     */
    async getMetricsByName(projectId, metricName) {
        const context = await this.getContext(projectId);
        if (!context.metrics) {
            return [];
        }
        return context.metrics.filter(m => m.name === metricName);
    }
    /**
     * Get latest metric value
     */
    async getLatestMetric(projectId, metricName) {
        const metrics = await this.getMetricsByName(projectId, metricName);
        if (metrics.length === 0) {
            return null;
        }
        // Sort by timestamp descending
        metrics.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
        return metrics[0];
    }
    /**
     * Add tag
     */
    async addTag(projectId, tag) {
        const context = await this.getContext(projectId);
        if (!context.tags) {
            context.tags = [];
        }
        if (!context.tags.includes(tag)) {
            context.tags.push(tag);
        }
    }
    /**
     * Remove tag
     */
    async removeTag(projectId, tag) {
        const context = await this.getContext(projectId);
        if (context.tags) {
            context.tags = context.tags.filter(t => t !== tag);
        }
    }
    /**
     * List all projects (alias for getAllProjects)
     */
    async listProjects() {
        return this.getAllProjects();
    }
    /**
     * Get all projects
     */
    async getAllProjects() {
        return Array.from(this.projects.values());
    }
    /**
     * Get active projects
     */
    async getActiveProjects() {
        return Array.from(this.projects.values())
            .filter(p => p.status === 'active');
    }
    /**
     * Get project by ID
     */
    async getProject(projectId) {
        return this.projects.get(projectId) || null;
    }
    /**
     * Update project status
     */
    async updateProjectStatus(projectId, status) {
        const project = this.projects.get(projectId);
        if (project) {
            project.status = status;
            project.updatedAt = new Date();
        }
        // Update context metadata
        const context = this.contexts.get(projectId);
        if (context && context.metadata) {
            context.metadata.status = status;
        }
    }
    /**
     * Search projects by name
     */
    async searchProjects(query) {
        const lowerQuery = query.toLowerCase();
        return Array.from(this.projects.values())
            .filter(p => p.name.toLowerCase().includes(lowerQuery));
    }
    /**
     * Get projects by tag
     */
    async getProjectsByTag(tag) {
        const projectsWithTag = [];
        for (const [projectId, context] of this.contexts.entries()) {
            if (context.tags?.includes(tag)) {
                const project = this.projects.get(projectId);
                if (project) {
                    projectsWithTag.push(project);
                }
            }
        }
        return projectsWithTag;
    }
    /**
     * Get project statistics
     */
    async getProjectStats(projectId) {
        const context = await this.getContext(projectId);
        return {
            documentCount: context.documents?.length || 0,
            teamSize: context.team?.length || 0,
            milestoneCount: context.timeline?.milestones?.length || 0,
            completedMilestones: context.timeline?.milestones?.filter(m => m.completed).length || 0,
            metricCount: context.metrics?.length || 0,
            tagCount: context.tags?.length || 0
        };
    }
    /**
     * Delete project and context
     */
    async deleteProject(projectId) {
        this.projects.delete(projectId);
        this.contexts.delete(projectId);
    }
    /**
     * Export context (for backup/sharing)
     */
    async exportContext(projectId) {
        const context = await this.getContext(projectId);
        const project = await this.getProject(projectId);
        return JSON.stringify({
            project,
            context
        }, null, 2);
    }
    /**
     * Import context (from backup/sharing)
     */
    async importContext(data) {
        const parsed = JSON.parse(data);
        const { project, context } = parsed;
        // Generate new ID to avoid conflicts
        const newId = generateId();
        project.id = newId;
        context.projectId = newId;
        // Store
        this.projects.set(newId, project);
        this.contexts.set(newId, context);
        return newId;
    }
}
exports.ProjectContextService = ProjectContextService;
/**
 * Create Project Context Service instance
 */
function createProjectContextService() {
    return new ProjectContextService();
}
//# sourceMappingURL=ProjectContextService.js.map