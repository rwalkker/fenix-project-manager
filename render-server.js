// FENIX Render Server - Simplified for deployment
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

console.log('🚀 Starting FENIX server...');

// Basic middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Security headers
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Static files
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'production'
    });
});

// API status endpoint
app.get('/api/status', (req, res) => {
    res.json({
        message: 'FENIX API is running',
        endpoints: ['/health', '/api/status'],
        timestamp: new Date().toISOString()
    });
});

// Environment info (for debugging)
app.get('/api/env', (req, res) => {
    res.json({
        nodeVersion: process.version,
        platform: process.platform,
        uptime: process.uptime(),
        memory: process.memoryUsage(),
        env: {
            NODE_ENV: process.env.NODE_ENV,
            PORT: process.env.PORT,
            AWS_REGION: process.env.AWS_REGION ? 'configured' : 'not configured'
        }
    });
});

// Catch all route - serve index.html or create one
app.get('*', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        // Create basic HTML response
        const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FENIX Project Manager</title>
    <style>
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0; padding: 40px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; color: white;
        }
        .container { 
            max-width: 800px; margin: 0 auto; background: rgba(255,255,255,0.1);
            padding: 40px; border-radius: 16px; backdrop-filter: blur(10px);
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
        }
        h1 { font-size: 3em; margin-bottom: 20px; text-align: center; }
        .status { 
            background: rgba(255,255,255,0.2); padding: 20px; border-radius: 8px; 
            margin: 20px 0; text-align: center;
        }
        .endpoints { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; }
        .endpoint { 
            background: rgba(255,255,255,0.2); padding: 15px 25px; border-radius: 8px;
            text-decoration: none; color: white; transition: all 0.3s;
            border: 1px solid rgba(255,255,255,0.3);
        }
        .endpoint:hover { 
            background: rgba(255,255,255,0.3); transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        }
        .info { margin-top: 30px; text-align: center; opacity: 0.8; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 FENIX</h1>
        <div class="status">
            <h2>✅ Successfully Deployed on Render!</h2>
            <p>Your FENIX Project Manager is now live and running.</p>
        </div>
        
        <h3 style="text-align: center;">Available Endpoints:</h3>
        <div class="endpoints">
            <a href="/health" class="endpoint">🏥 Health Check</a>
            <a href="/api/status" class="endpoint">📊 API Status</a>
            <a href="/api/env" class="endpoint">🔧 Environment Info</a>
        </div>
        
        <div class="info">
            <p><strong>Deployment Time:</strong> ${new Date().toISOString()}</p>
            <p><strong>Server:</strong> Node.js ${process.version}</p>
            <p><strong>Status:</strong> Production Ready</p>
        </div>
    </div>
</body>
</html>
        `;
        res.send(html);
    }
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Internal server error',
        message: err.message,
        timestamp: new Date().toISOString()
    });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FENIX server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log(`⚡ Ready to serve requests!`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Received SIGTERM, shutting down gracefully...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Received SIGINT, shutting down gracefully...');
    process.exit(0);
});