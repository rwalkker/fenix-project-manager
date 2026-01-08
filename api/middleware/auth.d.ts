import { Request, Response, NextFunction } from 'express';
import { AuthService, UserRole } from '../../services/AuthService';
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                username: string;
                role: UserRole;
            };
        }
    }
}
/**
 * Initialize auth service
 */
export declare function initializeAuthService(): AuthService;
/**
 * Get auth service instance
 */
export declare function getAuthService(): AuthService;
/**
 * Authentication middleware
 * Checks for JWT token in Authorization header or API key
 */
export declare function authenticate(req: Request, res: Response, next: NextFunction): void;
/**
 * Public access middleware
 * Auto-assigns "user" role to anonymous visitors, allows admin sign-in
 */
export declare function publicAccess(req: Request, _res: Response, next: NextFunction): void;
/**
 * Authorization middleware factory
 * Requires specific role or higher
 */
export declare function requireRole(requiredRole: UserRole): (req: Request, res: Response, next: NextFunction) => void;
/**
 * Admin-only middleware
 */
export declare const requireAdmin: (req: Request, res: Response, next: NextFunction) => void;
/**
 * User-only middleware (user or admin)
 */
export declare const requireUser: (req: Request, res: Response, next: NextFunction) => void;
/**
 * Viewer-only middleware (any authenticated user)
 */
export declare const requireViewer: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.d.ts.map