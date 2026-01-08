"use strict";
// FENIX Project Manager - Template Controller
// Business logic for template management
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.TemplateController = void 0;
const TemplateLibraryService_1 = require("../../services/TemplateLibraryService");
class TemplateController {
    templateService;
    constructor() {
        this.templateService = new TemplateLibraryService_1.TemplateLibraryService();
    }
    async listTemplates(_req, res) {
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
    async getTemplatesByType(req, res) {
        const { type } = req.params;
        const templates = this.templateService.getTemplatesByType(type);
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
    async getTemplateDetails(req, res) {
        const { id } = req.params;
        const template = this.templateService.getTemplate(id);
        if (!template) {
            res.status(404).json({ error: 'Template not found' });
            return;
        }
        res.json(template);
    }
}
exports.TemplateController = TemplateController;
//# sourceMappingURL=template.controller.js.map