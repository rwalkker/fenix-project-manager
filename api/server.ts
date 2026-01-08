// FENIX Project Manager - Express Server
// Main server setup with middleware and routes
// Created: January 6, 2026

// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import express, { Express, Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { createServer as createHTTPServer } from 'http';
import { WebSocketService } from '../services/WebSocketService';
import { initializeAuthService } from './middleware/auth';

// Import routes
import { generateRoutes } from './routes/generate.routes';
import { templateRoutes } from './routes/template.routes';
import { workflowRoutes } from './routes/workflow.routes';
import { aiRoutes } from './routes/ai.routes';
import { preferenceRoutes } from './routes/preference.routes';
import { projectRoutes } from './routes/project.routes';
import { authRoutes } from './routes/auth.routes';
import { previewRoutes } from './routes/preview.routes';

// Import middleware
import { errorHandler } from './middleware/error-handler';
import { requestLogger } from './middleware/request-logger';

// Global WebSocket service instance
let wsService: WebSocketService | null = null;

/**
 * Get WebSocket service instance
 */
export function getWebSocketService(): WebSocketService | null {
  return wsService;
}

/**
 * Create and configure Express application
 */
export function createServer(): Express {
  const app = express();

  // Security middleware
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "*.ngrok-free.app", "*.ngrok-free.dev", "*.ngrok.io"],
        styleSrc: ["'self'", "'unsafe-inline'", "*.ngrok-free.app", "*.ngrok-free.dev", "*.ngrok.io"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "*.ngrok-free.app", "*.ngrok-free.dev", "*.ngrok.io", "https://cdn.socket.io"],
        imgSrc: ["'self'", 'data:', 'https:', "*.ngrok-free.app", "*.ngrok-free.dev", "*.ngrok.io"],
        connectSrc: ["'self'", "*.ngrok-free.app", "*.ngrok-free.dev", "*.ngrok.io", "ws:", "wss:", "https://cdn.socket.io"],
        fontSrc: ["'self'", 'data:', "*.ngrok-free.app", "*.ngrok-free.dev", "*.ngrok.io"],
      },
    },
  }));

  // CORS configuration
  app.use(cors({
    origin: process.env.CORS_ORIGIN || '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }));

  // Body parsing middleware
  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ extended: true, limit: '50mb' }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, // Increased limit for development
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => {
      // Skip rate limiting for ngrok requests in development
      return req.headers['x-forwarded-for'] !== undefined;
    }
  });
  app.use('/api/', limiter);

  // Request logging
  app.use(requestLogger);

  // Initialize authentication service
  initializeAuthService();

  // Serve static files
  app.use(express.static(path.join(__dirname, '../../public')));

  // Health check endpoint
  app.get('/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || '1.0.0',
    });
  });

  // API routes
  app.use('/api/v1/auth', authRoutes);
  app.use('/api/v1/preview', previewRoutes);
  app.use('/api/v1/generate', generateRoutes);
  app.use('/api/v1/templates', templateRoutes);
  app.use('/api/v1/workflows', workflowRoutes);
  app.use('/api/v1/ai', aiRoutes);
  app.use('/api/v1/preferences', preferenceRoutes);
  app.use('/api/v1/projects', projectRoutes);

  // API documentation endpoint
  app.get('/api/v1/docs', (_req: Request, res: Response) => {
    res.json({
      version: '1.0.0',
      endpoints: {
        auth: '/api/v1/auth',
        preview: '/api/v1/preview',
        generate: '/api/v1/generate',
        templates: '/api/v1/templates',
        workflows: '/api/v1/workflows',
        ai: '/api/v1/ai',
        preferences: '/api/v1/preferences',
        projects: '/api/v1/projects',
      },
      documentation: 'See PHASE6_PLAN.md for detailed API documentation',
    });
  });

  // 404 handler for API routes
  app.use('/api/*', (req: Request, res: Response) => {
    res.status(404).json({
      error: 'Not Found',
      message: `API endpoint ${req.path} not found`,
      timestamp: new Date().toISOString(),
    });
  });

  // Serve index.html for all other routes (SPA support)
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../../public/index.html'));
  });

  // Error handling middleware (must be last)
  app.use(errorHandler);

  return app;
}

/**
 * Start the server
 */
export function startServer(port: number = 3100): void {
  const app = createServer();
  const httpServer = createHTTPServer(app);

  // Initialize WebSocket service
  wsService = new WebSocketService(httpServer);

  httpServer.listen(port, () => {
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║         FENIX Project Manager - Server Started            ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    console.log(`\n🚀 Server running on http://localhost:${port}`);
    console.log(`📊 Health check: http://localhost:${port}/health`);
    console.log(`📚 API docs: http://localhost:${port}/api/v1/docs`);
    console.log(`🔌 WebSocket: ws://localhost:${port}`);
    console.log(`\n✨ Ready to generate documents!\n`);
  });
}

// Start server if this file is run directly
if (require.main === module) {
  const port = parseInt(process.env.PORT || '3100', 10);
  startServer(port);
}
