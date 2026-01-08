import { Express } from 'express';
import { WebSocketService } from '../services/WebSocketService';
/**
 * Get WebSocket service instance
 */
export declare function getWebSocketService(): WebSocketService | null;
/**
 * Create and configure Express application
 */
export declare function createServer(): Express;
/**
 * Start the server
 */
export declare function startServer(port?: number): void;
//# sourceMappingURL=server.d.ts.map