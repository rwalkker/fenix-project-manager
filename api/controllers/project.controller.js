"use strict";
// FENIX Project Manager - Project Controller
// Business logic for project management
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectController = void 0;
const ProjectContextService_1 = require("../../services/ProjectContextService");
class ProjectController {
    projectService;
    constructor() {
        this.projectService = new ProjectContextService_1.ProjectContextService();
    }
    async listProjects(_req, res) {
        const projects = await this.projectService.listProjects();
        res.json({
            count: projects.length,
            projects,
        });
    }
    async getProjectDetails(req, res) {
        const { id } = req.params;
        const project = await this.projectService.getContext(id);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.json(project);
    }
    async getProjectDocuments(req, res) {
        const { id } = req.params;
        const project = await this.projectService.getContext(id);
        if (!project) {
            res.status(404).json({ error: 'Project not found' });
            return;
        }
        res.json({
            projectId: id,
            count: project.documents?.length || 0,
            documents: project.documents || [],
        });
    }
}
exports.ProjectController = ProjectController;
//# sourceMappingURL=project.controller.js.map