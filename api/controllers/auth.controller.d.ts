import { Request, Response } from 'express';
/**
 * Authentication Controller
 */
export declare class AuthController {
    /**
     * Login user
     */
    login(req: Request, res: Response): Promise<void>;
    /**
     * Register new user
     */
    register(req: Request, res: Response): Promise<void>;
    /**
     * Logout user
     */
    logout(_req: Request, res: Response): Promise<void>;
    /**
     * Get current user
     */
    getCurrentUser(req: Request, res: Response): Promise<void>;
    /**
     * Refresh token
     */
    refreshToken(req: Request, res: Response): Promise<void>;
    /**
     * Regenerate API key
     */
    regenerateApiKey(req: Request, res: Response): Promise<void>;
    /**
     * Get all users (admin only)
     */
    getAllUsers(_req: Request, res: Response): Promise<void>;
    /**
     * Delete user (admin only)
     */
    deleteUser(req: Request, res: Response): Promise<void>;
    /**
     * Update user role (admin only)
     */
    updateUserRole(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=auth.controller.d.ts.map