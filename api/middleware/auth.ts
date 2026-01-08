// FENIX Project Manager - Authentication Middleware
// JWT and API key authentication
// Created: January 6, 2026

import { Request, Response, NextFunction } from 'express';
import { AuthService, UserRole } from '../../services/AuthService';

// Extend Express Request to include user
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

// Global auth service instance
let authService: AuthService | null = null;

/**
 * Initialize auth service
 */
export function initializeAuthService(): AuthService {
  if (!authService) {
    authService = new AuthService();
  }
  return authService;
}

/**
 * Get auth service instance
 */
export function getAuthService(): AuthService {
  if (!authService) {
    authService = new AuthService();
  }
  return authService;
}

/**
 * Authentication middleware
 * Checks for JWT token in Authorization header or API key
 */
export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const auth = getAuthService();

  // Check for JWT token
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = auth.verifyToken(token);
    
    if (payload) {
      req.user = payload;
      return next();
    }
  }

  // Check for API key
  const apiKey = req.headers['x-api-key'] as string;
  
  if (apiKey) {
    const user = auth.getUserByApiKey(apiKey);
    
    if (user) {
      req.user = {
        userId: user.id,
        username: user.username,
        role: user.role,
      };
      return next();
    }
  }

  // No valid authentication
  res.status(401).json({
    error: 'Unauthorized',
    message: 'Authentication required. Provide a valid JWT token or API key.',
  });
}

/**
 * Public access middleware
 * Auto-assigns "user" role to anonymous visitors, allows admin sign-in
 */
export function publicAccess(req: Request, _res: Response, next: NextFunction): void {
  const auth = getAuthService();

  // Check for JWT token first
  const authHeader = req.headers.authorization;
  
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const payload = auth.verifyToken(token);
    
    if (payload) {
      req.user = payload;
      return next();
    }
  }

  // Check for API key
  const apiKey = req.headers['x-api-key'] as string;
  
  if (apiKey) {
    const user = auth.getUserByApiKey(apiKey);
    
    if (user) {
      req.user = {
        userId: user.id,
        username: user.username,
        role: user.role,
      };
      return next();
    }
  }

  // No authentication provided - assign public user role
  req.user = {
    userId: 'public-user',
    username: 'Public User',
    role: 'user' as UserRole, // Auto-assign user role for public access
  };

  next();
}

/**
 * Authorization middleware factory
 * Requires specific role or higher
 */
export function requireRole(requiredRole: UserRole) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Authentication required',
      });
      return;
    }

    const auth = getAuthService();
    
    if (!auth.hasPermission(req.user.role, requiredRole)) {
      res.status(403).json({
        error: 'Forbidden',
        message: `Requires ${requiredRole} role or higher`,
      });
      return;
    }

    next();
  };
}

/**
 * Admin-only middleware
 */
export const requireAdmin = requireRole('admin');

/**
 * User-only middleware (user or admin)
 */
export const requireUser = requireRole('user');

/**
 * Viewer-only middleware (any authenticated user)
 */
export const requireViewer = requireRole('viewer');
