import { Request, Response } from 'express';
export declare class TemplateController {
    private templateService;
    constructor();
    listTemplates(_req: Request, res: Response): Promise<void>;
    getTemplatesByType(req: Request, res: Response): Promise<void>;
    getTemplateDetails(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=template.controller.d.ts.map