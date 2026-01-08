"use strict";
// FENIX Project Manager - Express Server
// Main server setup with middleware and routes
// Created: January 6, 2026
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getWebSocketService = getWebSocketService;
exports.createServer = createServer;
exports.startServer = startServer;
// Load environment variables FIRST
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
const WebSocketService_1 = require("../services/WebSocketService");
const auth_1 = require("./middleware/auth");
// Import routes
const generate_routes_1 = require("./routes/generate.routes");
const template_routes_1 = require("./routes/template.routes");
const workflow_routes_1 = require("./routes/workflow.routes");
const ai_routes_1 = require("./routes/ai.routes");
const preference_routes_1 = require("./routes/preference.routes");
const project_routes_1 = require("./routes/project.routes");
const auth_routes_1 = require("./routes/auth.routes");
const preview_routes_1 = require("./routes/preview.routes");
// Import middleware
const error_handler_1 = require("./middleware/error-handler");
const request_logger_1 = require("./middleware/request-logger");
// Global WebSocket service instance
let wsService = null;
/**
 * Get WebSocket service instance
 */
function getWebSocketService() {
    return wsService;
}
/**
 * Create and configure Express application
 */
function createServer() {
    const app = (0, express_1.default)();
    // Security middleware
    app.use((0, helmet_1.default)({
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
    app.use((0, cors_1.default)({
        origin: process.env.CORS_ORIGIN || '*',
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    }));
    // Body parsing middleware
    app.use(express_1.default.json({ limit: '50mb' }));
    app.use(express_1.default.urlencoded({ extended: true, limit: '50mb' }));
    // Rate limiting
    const limiter = (0, express_rate_limit_1.default)({
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
    app.use(request_logger_1.requestLogger);
    // Initialize authentication service
    (0, auth_1.initializeAuthService)();
    // Serve static files
    app.use(express_1.default.static(path_1.default.join(__dirname, '../../public')));
    // Health check endpoint
    app.get('/health', (_req, res) => {
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            version: process.env.npm_package_version || '1.0.0',
        });
    });
    // API routes
    app.use('/api/v1/auth', auth_routes_1.authRoutes);
    app.use('/api/v1/preview', preview_routes_1.previewRoutes);
    app.use('/api/v1/generate', generate_routes_1.generateRoutes);
    app.use('/api/v1/templates', template_routes_1.templateRoutes);
    app.use('/api/v1/workflows', workflow_routes_1.workflowRoutes);
    app.use('/api/v1/ai', ai_routes_1.aiRoutes);
    app.use('/api/v1/preferences', preference_routes_1.preferenceRoutes);
    app.use('/api/v1/projects', project_routes_1.projectRoutes);
    // API documentation endpoint
    app.get('/api/v1/docs', (_req, res) => {
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
    app.use('/api/*', (req, res) => {
        res.status(404).json({
            error: 'Not Found',
            message: `API endpoint ${req.path} not found`,
            timestamp: new Date().toISOString(),
        });
    });
    // Serve index.html for all other routes (SPA support)
    app.get('*', (_req, res) => {
        res.sendFile(path_1.default.join(__dirname, '../../public/index.html'));
    });
    // Error handling middleware (must be last)
    app.use(error_handler_1.errorHandler);
    return app;
}
/**
 * Start the server
 */
function startServer(port = 3100) {
    const app = createServer();
    const httpServer = (0, http_1.createServer)(app);
    // Initialize WebSocket service
    wsService = new WebSocketService_1.WebSocketService(httpServer);
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
//# sourceMappingURL=server.js.map