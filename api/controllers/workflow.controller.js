"use strict";
// FENIX Project Manager - Workflow Controller
// Business logic for workflow management
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkflowController = void 0;
class WorkflowController {
    workflows = [
        {
            id: 'project-status-package',
            name: 'Project Status Package',
            description: 'Complete project status update with presentation, metrics, and documentation',
            steps: 4,
        },
        {
            id: 'change-management-suite',
            name: 'Change Management Suite',
            description: 'Complete change management package with plan, presentation, and impact analysis',
            steps: 4,
        },
        {
            id: 'quarterly-business-review',
            name: 'Quarterly Business Review',
            description: 'Executive presentation with financial analysis and summary',
            steps: 3,
        },
    ];
    async listWorkflows(_req, res) {
        res.json({
            count: this.workflows.length,
            workflows: this.workflows,
        });
    }
    async getWorkflowDetails(req, res) {
        const { id } = req.params;
        const workflow = this.workflows.find(w => w.id === id);
        if (!workflow) {
            res.status(404).json({ error: 'Workflow not found' });
            return;
        }
        res.json(workflow);
    }
}
exports.WorkflowController = WorkflowController;
//# sourceMappingURL=workflow.controller.js.map