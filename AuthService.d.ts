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
export declare class AuthService {
    private users;
    private jwtSecret;
    private jwtExpiresIn;
    constructor();
    /**
     * Initialize default users for development
     */
    private initializeDefaultUsers;
    /**
     * Create a new user
     */
    createUser(username: string, email: string, password: string, role?: UserRole): User;
    /**
     * Authenticate user with username and password
     */
    authenticate(username: string, password: string): Promise<string | null>;
    /**
     * Generate JWT token
     */
    private generateToken;
    /**
     * Verify JWT token
     */
    verifyToken(token: string): JWTPayload | null;
    /**
     * Get user by ID
     */
    getUserById(userId: string): User | undefined;
    /**
     * Get user by username
     */
    getUserByUsername(username: string): User | undefined;
    /**
     * Get user by API key
     */
    getUserByApiKey(apiKey: string): User | undefined;
    /**
     * Generate API key
     */
    private generateApiKey;
    /**
     * Regenerate API key for user
     */
    regenerateApiKey(userId: string): string | null;
    /**
     * Check if user has permission
     */
    hasPermission(role: UserRole, requiredRole: UserRole): boolean;
    /**
     * Check if user can create documents
     */
    canCreateDocuments(role: UserRole): boolean;
    /**
     * Check if user can create macros
     */
    canCreateMacros(role: UserRole): boolean;
    /**
     * Check if user can view all documents
     */
    canViewAllDocuments(role: UserRole): boolean;
    /**
     * Check if user can view team documents
     */
    canViewTeamDocuments(role: UserRole): boolean;
    /**
     * Check if user can manage users
     */
    canManageUsers(role: UserRole): boolean;
    /**
     * Get all users (admin only)
     */
    getAllUsers(): User[];
    /**
     * Delete user
     */
    deleteUser(userId: string): boolean;
    /**
     * Update user role
     */
    updateUserRole(userId: string, newRole: UserRole): boolean;
}
//# sourceMappingURL=AuthService.d.ts.map