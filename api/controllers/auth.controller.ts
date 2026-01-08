// FENIX Project Manager - Authentication Controller
// Business logic for authentication
// Created: January 6, 2026

import { Request, Response } from 'express';
import { getAuthService } from '../middleware/auth';
import { UserRole } from '../../services/AuthService';

/**
 * Authentication Controller
 */
export class AuthController {
  /**
   * Login user
   */
  async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Username and password are required',
      });
      return;
    }

    const auth = getAuthService();
    const token = await auth.authenticate(username, password);

    if (!token) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid username or password',
      });
      return;
    }

    const user = auth.getUserByUsername(username);

    res.json({
      token,
      user: {
        id: user!.id,
        username: user!.username,
        email: user!.email,
        role: user!.role,
        apiKey: user!.apiKey,
      },
    });
  }

  /**
   * Register new user
   */
  async register(req: Request, res: Response): Promise<void> {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Username, email, and password are required',
      });
      return;
    }

    const auth = getAuthService();

    // Check if username already exists
    if (auth.getUserByUsername(username)) {
      res.status(409).json({
        error: 'Conflict',
        message: 'Username already exists',
      });
      return;
    }

    // Create user (default role is 'user')
    const userRole: UserRole = role || 'user';
    const user = auth.createUser(username, email, password, userRole);

    // Generate token
    const token = await auth.authenticate(username, password);

    res.status(201).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        apiKey: user.apiKey,
      },
    });
  }

  /**
   * Logout user
   */
  async logout(_req: Request, res: Response): Promise<void> {
    // In a stateless JWT system, logout is handled client-side
    // by removing the token. We just return success.
    res.json({
      message: 'Logged out successfully',
    });
  }

  /**
   * Get current user
   */
  async getCurrentUser(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Not authenticated',
      });
      return;
    }

    const auth = getAuthService();
    const user = auth.getUserById(req.user.userId);

    if (!user) {
      res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
      return;
    }

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      apiKey: user.apiKey,
      createdAt: user.createdAt,
      lastLogin: user.lastLogin,
    });
  }

  /**
   * Refresh token
   */
  async refreshToken(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Not authenticated',
      });
      return;
    }

    const auth = getAuthService();
    const user = auth.getUserById(req.user.userId);

    if (!user) {
      res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
      return;
    }

    // Generate new token
    const token = await auth.authenticate(user.username, ''); // Password not needed for refresh
    
    res.json({
      token,
    });
  }

  /**
   * Regenerate API key
   */
  async regenerateApiKey(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      res.status(401).json({
        error: 'Unauthorized',
        message: 'Not authenticated',
      });
      return;
    }

    const auth = getAuthService();
    const apiKey = auth.regenerateApiKey(req.user.userId);

    if (!apiKey) {
      res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
      return;
    }

    res.json({
      apiKey,
    });
  }

  /**
   * Get all users (admin only)
   */
  async getAllUsers(_req: Request, res: Response): Promise<void> {
    const auth = getAuthService();
    const users = auth.getAllUsers();

    res.json({
      users,
      total: users.length,
    });
  }

  /**
   * Delete user (admin only)
   */
  async deleteUser(req: Request, res: Response): Promise<void> {
    const { id } = req.params;

    const auth = getAuthService();
    const success = auth.deleteUser(id);

    if (!success) {
      res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
      return;
    }

    res.json({
      message: 'User deleted successfully',
    });
  }

  /**
   * Update user role (admin only)
   */
  async updateUserRole(req: Request, res: Response): Promise<void> {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !['admin', 'user', 'viewer'].includes(role)) {
      res.status(400).json({
        error: 'Bad Request',
        message: 'Valid role is required (admin, user, or viewer)',
      });
      return;
    }

    const auth = getAuthService();
    const success = auth.updateUserRole(id, role as UserRole);

    if (!success) {
      res.status(404).json({
        error: 'Not Found',
        message: 'User not found',
      });
      return;
    }

    res.json({
      message: 'User role updated successfully',
    });
  }
}
