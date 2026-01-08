import { Request, Response, NextFunction } from 'express';
/**
 * Custom API Error class
 */
export declare class ApiError extends Error {
    statusCode: number;
    message: string;
    details?: any;
    constructor(statusCode: number, message: string, details?: any);
}
/**
 * Error handler middleware
 */
export declare function errorHandler(err: Error | ApiError, req: Request, res: Response, _next: NextFunction): void;
/**
 * Async handler wrapper to catch errors in async route handlers
 */
export declare function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>): (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=error-handler.d.ts.map