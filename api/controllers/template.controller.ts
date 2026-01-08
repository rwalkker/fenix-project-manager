// FENIX Project Manager - Template Controller
// Business logic for template management
// Created: January 6, 2026

import { Request, Response } from 'express';
import { TemplateLibraryService } from '../../services/TemplateLibraryService';

export class TemplateController {
  private templateService: TemplateLibraryService;

  constructor() {
    this.templateService = new TemplateLibraryService();
  }

  async listTemplates(_req: Request, res: Response): Promise<void> {
    const templates = this.templateService.getAllTemplates();
    
    res.json({
      count: templates.length,
      templates: templates.map(t => ({
        id: t.id,
        name: t.name,
        type: t.type,
        category: t.category,
        description: t.description,
      })),
    });
  }

  async getTemplatesByType(req: Request, res: Response): Promise<void> {
    const { type } = req.params;
    const templates = this.templateService.getTemplatesByType(type as any);
    
    res.json({
      type,
      count: templates.length,
      templates: templates.map(t => ({
        id: t.id,
        name: t.name,
        category: t.category,
        description: t.description,
      })),
    });
  }

  async getTemplateDetails(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const template = this.templateService.getTemplate(id);
    
    if (!template) {
      res.status(404).json({ error: 'Template not found' });
      return;
    }

    res.json(template);
  }
}
