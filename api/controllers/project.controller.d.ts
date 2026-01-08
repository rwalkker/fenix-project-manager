import { Request, Response } from 'express';
export declare class ProjectController {
    private projectService;
    constructor();
    listProjects(_req: Request, res: Response): Promise<void>;
    getProjectDetails(req: Request, res: Response): Promise<void>;
    getProjectDocuments(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=project.controller.d.ts.map