"use strict";
// FENIX Project Manager - WebSocket Service
// Real-time communication for progress tracking and notifications
// Created: January 6, 2026
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebSocketService = void 0;
const socket_io_1 = require("socket.io");
/**
 * WebSocket Service for real-time communication
 */
class WebSocketService {
    io;
    connectedClients;
    constructor(httpServer) {
        this.io = new socket_io_1.Server(httpServer, {
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
    setupEventHandlers() {
        this.io.on('connection', (socket) => {
            console.log(`[WebSocket] Client connected: ${socket.id}`);
            this.connectedClients.set(socket.id, socket);
            // Handle subscription to workflow updates
            socket.on('subscribe', (workflowId) => {
                console.log(`[WebSocket] Client ${socket.id} subscribed to workflow ${workflowId}`);
                socket.join(`workflow-${workflowId}`);
            });
            // Handle unsubscription
            socket.on('unsubscribe', (workflowId) => {
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
    emitProgress(workflowId, progress, currentStep, message) {
        const event = {
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
    emitStatus(workflowId, status, result, error) {
        const event = {
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
    emitNotification(level, message) {
        const event = {
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
    emitWorkflowNotification(workflowId, level, message) {
        const event = {
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
    getConnectedClientsCount() {
        return this.connectedClients.size;
    }
    /**
     * Get Socket.IO server instance
     */
    getIO() {
        return this.io;
    }
}
exports.WebSocketService = WebSocketService;
//# sourceMappingURL=WebSocketService.js.map