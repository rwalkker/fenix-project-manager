import { Request, Response } from 'express';
export declare class AIController {
    private summarizationService;
    private keyPointService;
    private sentimentService;
    private readabilityService;
    private complianceService;
    private intelligentDocService;
    constructor();
    summarize(req: Request, res: Response): Promise<void>;
    extractPoints(req: Request, res: Response): Promise<void>;
    analyzeSentiment(req: Request, res: Response): Promise<void>;
    checkReadability(req: Request, res: Response): Promise<void>;
    checkCompliance(req: Request, res: Response): Promise<void>;
    recommendFormat(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=ai.controller.d.ts.map