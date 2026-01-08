// FENIX Project Manager - WebSocket Service
// Real-time communication for progress tracking and notifications
// Created: January 6, 2026

import { Server as SocketIOServer, Socket } from 'socket.io';
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
export class WebSocketService {
  private io: SocketIOServer;
  private connectedClients: Map<string, Socket>;

  constructor(httpServer: HTTPServer) {
    this.io = new SocketIOServer(httpServer, {
      cors: {
        origin: process.env.CORS_ORIGIN || '*',
        methods: ['GET', 'POST'],
        credentials: true,
      },
    });

    this.connectedClients = new Map();
    this.setupEventHandlers();
  }

  /**
   * Set up WebSocket event handlers
   */
  private setupEventHandlers(): void {
    this.io.on('connection', (socket: Socket) => {
      console.log(`[WebSocket] Client connected: ${socket.id}`);
      this.connectedClients.set(socket.id, socket);

      // Handle subscription to workflow updates
      socket.on('subscribe', (workflowId: string) => {
        console.log(`[WebSocket] Client ${socket.id} subscribed to workflow ${workflowId}`);
        socket.join(`workflow-${workflowId}`);
      });

      // Handle unsubscription
      socket.on('unsubscribe', (workflowId: string) => {
        console.log(`[WebSocket] Client ${socket.id} unsubscribed from workflow ${workflowId}`);
        socket.leave(`workflow-${workflowId}`);
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        console.log(`[WebSocket] Client disconnected: ${socket.id}`);
        this.connectedClients.delete(socket.id);
      });

      // Send welcome message
      socket.emit('notification', {
        type: 'notification',
        level: 'info',
        message: 'Connected to FENIX real-time updates',
        timestamp: new Date(),
      });
    });
  }

  /**
   * Emit progress update for a workflow
   */
  public emitProgress(
    workflowId: string,
    progress: number,
    currentStep: string,
    message: string
  ): void {
    const event: ProgressEvent = {
      type: 'progress',
      workflowId,
      progress,
      currentStep,
      message,
      timestamp: new Date(),
    };

    this.io.to(`workflow-${workflowId}`).emit('progress', event);
    console.log(`[WebSocket] Progress update sent for workflow ${workflowId}: ${progress}%`);
  }

  /**
   * Emit status update for a workflow
   */
  public emitStatus(
    workflowId: string,
    status: 'pending' | 'in-progress' | 'complete' | 'failed',
    result?: any,
    error?: string
  ): void {
    const event: StatusEvent = {
      type: 'status',
      workflowId,
      status,
      result,
      error,
      timestamp: new Date(),
    };

    this.io.to(`workflow-${workflowId}`).emit('status', event);
    console.log(`[WebSocket] Status update sent for workflow ${workflowId}: ${status}`);
  }

  /**
   * Emit notification to all connected clients
   */
  public emitNotification(
    level: 'info' | 'success' | 'warning' | 'error',
    message: string
  ): void {
    const event: NotificationEvent = {
      type: 'notification',
      level,
      message,
      timestamp: new Date(),
    };

    this.io.emit('notification', event);
    console.log(`[WebSocket] Notification sent: ${level} - ${message}`);
  }

  /**
   * Emit notification to specific workflow subscribers
   */
  public emitWorkflowNotification(
    workflowId: string,
    level: 'info' | 'success' | 'warning' | 'error',
    message: string
  ): void {
    const event: NotificationEvent = {
      type: 'notification',
      level,
      message,
      timestamp: new Date(),
    };

    this.io.to(`workflow-${workflowId}`).emit('notification', event);
    console.log(`[WebSocket] Workflow notification sent to ${workflowId}: ${level} - ${message}`);
  }

  /**
   * Get number of connected clients
   */
  public getConnectedClientsCount(): number {
    return this.connectedClients.size;
  }

  /**
   * Get Socket.IO server instance
   */
  public getIO(): SocketIOServer {
    return this.io;
  }
}
