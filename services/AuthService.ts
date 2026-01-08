// FENIX Project Manager - Authentication Service
// User authentication and authorization
// Created: January 6, 2026

import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

/**
 * User role types (matching Bindle permissions)
 */
export type UserRole = 'viewer' | 'user' | 'power-user' | 'admin';

/**
 * User interface
 */
export interface User {
  id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  apiKey?: string;
  createdAt: Date;
  lastLogin?: Date;
}

/**
 * JWT payload interface
 */
export interface JWTPayload {
  userId: string;
  username: string;
  role: UserRole;
}

/**
 * Authentication Service
 */
export class AuthService {
  private users: Map<string, User> = new Map();
  private jwtSecret: string;
  private jwtExpiresIn: string = '24h';

  constructor() {
    this.jwtSecret = process.env.JWT_SECRET || 'fenix-secret-key-change-in-production';
    this.initializeDefaultUsers();
  }

  /**
   * Initialize default users for development
   */
  private initializeDefaultUsers(): void {
    // Admin user with production credentials
    this.createUser('Admin', 'admin@fenix.local', 'PHX6!2026', 'admin');
    
    // Power user
    this.createUser('poweruser', 'poweruser@fenix.local', 'power123', 'power-user');
    
    // Regular user
    this.createUser('user', 'user@fenix.local', 'user123', 'user');
    
    // Viewer
    this.createUser('viewer', 'viewer@fenix.local', 'viewer123', 'viewer');
    
    console.log('[Auth] Default users initialized (Role-Based Access)');
    console.log('[Auth] Admin: Admin / PHX6!2026 (view all documents)');
    console.log('[Auth] Power-User: poweruser / power123 (create with macros, view team docs)');
    console.log('[Auth] User: user / user123 (create documents, view own)');
    console.log('[Auth] Viewer: viewer / viewer123 (view shared documents only)');
  }

  /**
   * Create a new user
   */
  public createUser(
    username: string,
    email: string,
    password: string,
    role: UserRole = 'user'
  ): User {
    const passwordHash = bcrypt.hashSync(password, 10);
    const user: User = {
      id: uuidv4(),
      username,
      email,
      passwordHash,
      role,
      apiKey: this.generateApiKey(),
      createdAt: new Date(),
    };

    this.users.set(user.id, user);
    return user;
  }

  /**
   * Authenticate user with username and password
   */
  public async authenticate(username: string, password: string): Promise<string | null> {
    // Find user by username
    const user = Array.from(this.users.values()).find(u => u.username === username);
    
    if (!user) {
      return null;
    }

    // Verify password
    const isValid = bcrypt.compareSync(password, user.passwordHash);
    
    if (!isValid) {
      return null;
    }

    // Update last login
    user.lastLogin = new Date();

    // Generate JWT token
    const token = this.generateToken(user);
    
    return token;
  }

  /**
   * Generate JWT token
   */
  private generateToken(user: User): string {
    const payload: JWTPayload = {
      userId: user.id,
      username: user.username,
      role: user.role,
    };

    return jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiresIn,
    } as jwt.SignOptions);
  }

  /**
   * Verify JWT token
   */
  public verifyToken(token: string): JWTPayload | null {
    try {
      const payload = jwt.verify(token, this.jwtSecret) as JWTPayload;
      return payload;
    } catch (error) {
      return null;
    }
  }

  /**
   * Get user by ID
   */
  public getUserById(userId: string): User | undefined {
    return this.users.get(userId);
  }

  /**
   * Get user by username
   */
  public getUserByUsername(username: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  /**
   * Get user by API key
   */
  public getUserByApiKey(apiKey: string): User | undefined {
    return Array.from(this.users.values()).find(u => u.apiKey === apiKey);
  }

  /**
   * Generate API key
   */
  private generateApiKey(): string {
    return `fenix_${uuidv4().replace(/-/g, '')}`;
  }

  /**
   * Regenerate API key for user
   */
  public regenerateApiKey(userId: string): string | null {
    const user = this.users.get(userId);
    
    if (!user) {
      return null;
    }

    user.apiKey = this.generateApiKey();
    return user.apiKey;
  }

  /**
   * Check if user has permission
   */
  public hasPermission(role: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy: Record<UserRole, number> = {
      viewer: 1,
      user: 2,
      'power-user': 3,
      admin: 4,
    };

    return roleHierarchy[role] >= roleHierarchy[requiredRole];
  }

  /**
   * Check if user can create documents
   */
  public canCreateDocuments(role: UserRole): boolean {
    return ['user', 'power-user', 'admin'].includes(role);
  }

  /**
   * Check if user can create macros
   */
  public canCreateMacros(role: UserRole): boolean {
    return ['power-user', 'admin'].includes(role);
  }

  /**
   * Check if user can view all documents
   */
  public canViewAllDocuments(role: UserRole): boolean {
    return role === 'admin';
  }

  /**
   * Check if user can view team documents
   */
  public canViewTeamDocuments(role: UserRole): boolean {
    return ['power-user', 'admin'].includes(role);
  }

  /**
   * Check if user can manage users
   */
  public canManageUsers(role: UserRole): boolean {
    return role === 'admin';
  }

  /**
   * Get all users (admin only)
   */
  public getAllUsers(): User[] {
    return Array.from(this.users.values()).map(user => ({
      ...user,
      passwordHash: '[REDACTED]',
    }));
  }

  /**
   * Delete user
   */
  public deleteUser(userId: string): boolean {
    return this.users.delete(userId);
  }

  /**
   * Update user role
   */
  public updateUserRole(userId: string, newRole: UserRole): boolean {
    const user = this.users.get(userId);
    
    if (!user) {
      return false;
    }

    user.role = newRole;
    return true;
  }
}
