import { Request, Response } from 'express';
/**
 * File Upload Controller
 * Handles file uploads and provides analysis for AI agents
 */
export declare class UploadController {
    private fileAnalysisService;
    private uploadDir;
    constructor();
    /**
     * Ensure upload directory exists
     */
    private ensureUploadDir;
    /**
     * Upload file endpoint (simplified without multer for now)
     */
    uploadFile(req: Request, res: Response): Promise<void>;
    /**
     * Get uploaded file metadata
     */
    getFileMetadata(req: Request, res: Response): Promise<void>;
    /**
     * Download uploaded file
     */
    downloadFile(req: Request, res: Response): Promise<void>;
    /**
     * Delete uploaded file
     */
    deleteFile(req: Request, res: Response): Promise<void>;
    /**
     * List uploaded files for user
     */
    listFiles(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=upload.controller.d.ts.map