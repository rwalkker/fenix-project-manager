import { Request, Response } from 'express';
/**
 * Preview Controller
 * Handles document preview requests
 */
export declare class PreviewController {
    private previewService;
    private outputDir;
    constructor();
    /**
     * Get document preview
     */
    getPreview(req: Request, res: Response): Promise<void>;
    /**
     * Get document metadata
     */
    getMetadata(req: Request, res: Response): Promise<void>;
    /**
     * Get document thumbnail
     */
    getThumbnail(_req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=preview.controller.d.ts.map