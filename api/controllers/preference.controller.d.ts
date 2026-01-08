import { Request, Response } from 'express';
export declare class PreferenceController {
    private preferenceService;
    constructor();
    getPreferences(_req: Request, res: Response): Promise<void>;
    updatePreferences(req: Request, res: Response): Promise<void>;
    getSmartDefaults(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=preference.controller.d.ts.map