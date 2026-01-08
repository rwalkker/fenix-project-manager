// FENIX Project Manager - Project Controller
// Business logic for project management
// Created: January 6, 2026

import { Request, Response } from 'express';
import { ProjectContextService } from '../../services/ProjectContextService';

export class ProjectController {
  private projectService: ProjectContextService;

  constructor() {
    this.projectService = new ProjectContextService();
  }

  async listProjects(_req: Request, res: Response): Promise<void> {
    const projects = await this.projectService.listProjects();
    
    res.json({
      count: projects.length,
      projects,
    });
  }

  async getProjectDetails(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const project = await this.projectService.getContext(id);
    
    if (!project) {
      res.status(404).json({ error: 'Project not found' });
      return;
    }

    res.json(project);
  }

  async getProjectDocuments(req: Request, res: Response): Promise<void> {
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
