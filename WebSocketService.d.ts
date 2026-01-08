import { Server as SocketIOServer } from 'socket.io';
import { Server as HTTPServer } from 'http';
/**
 * Progress event data
 */
export interface ProgressEvent {
    type: 'progress';
    workflowId: string;
    progress: number;
    currentStep: string;
    message: string;
    timestamp: Date;
}
/**
 * Status event data
 */
export interface StatusEvent {
    type: 'status';
    workflowId: string;
    status: 'pending' | 'in-progress' | 'complete' | 'failed';
    result?: any;
    error?: string;
    timestamp: Date;
}
/**
 * Notification event data
 */
export interface NotificationEvent {
    type: 'notification';
    level: 'info' | 'success' | 'warning' | 'error';
    message: string;
    timestamp: Date;
}
/**
 * WebSocket Service for real-time communication
 */
export declare class WebSocketService {
    private io;
    private connectedClients;
    constructor(httpServer: HTTPServer);
    /**
     * Set up WebSocket event handlers
     */
    private setupEventHandlers;
    /**
     * Emit progress update for a workflow
     */
    emitProgress(workflowId: string, progress: number, currentStep: string, message: string): void;
    /**
     * Emit status update for a workflow
     */
    emitStatus(workflowId: string, status: 'pending' | 'in-progress' | 'complete' | 'failed', result?: any, error?: string): void;
    /**
     * Emit notification to all connected clients
     */
    emitNotification(level: 'info' | 'success' | 'warning' | 'error', message: string): void;
    /**
     * Emit notification to specific workflow subscribers
     */
    emitWorkflowNotification(workflowId: string, level: 'info' | 'success' | 'warning' | 'error', message: string): void;
    /**
     * Get number of connected clients
     */
    getConnectedClientsCount(): number;
    /**
     * Get Socket.IO server instance
     */
    getIO(): SocketIOServer;
}
//# sourceMappingURL=WebSocketService.d.ts.map