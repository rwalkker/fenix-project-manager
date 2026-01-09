// FENIX Render Server - Fixed JSON parsing issues
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

console.log('🚀 Starting FENIX server...');

// Enhanced JSON middleware with proper error handling
app.use((req, res, next) => {
    // Only parse JSON for API routes
    if (req.path.startsWith('/api/') || req.path === '/health') {
        express.json({ 
            limit: '10mb',
            strict: true,
            type: 'application/json'
        })(req, res, (err) => {
            if (err) {
                console.log('JSON parsing error handled:', err.message);
                return res.status(400).json({ 
                    error: 'Invalid JSON format',
                    message: 'Please send valid JSON data'
                });
            }
            next();
        });
    } else {
        next();
    }
});

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

// Health check endpoint - guaranteed valid JSON
app.get('/health', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const healthData = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '1.0.0',
            environment: process.env.NODE_ENV || 'production',
            uptime: Math.floor(process.uptime()),
            memory: {
                used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
                total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
            }
        };
        res.json(healthData);
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({ status: 'error', message: 'Health check failed' });
    }
});

// API status endpoint - guaranteed valid JSON
app.get('/api/status', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const statusData = {
            message: 'FENIX API is running successfully',
            endpoints: [
                { path: '/health', method: 'GET', description: 'Health check' },
                { path: '/api/status', method: 'GET', description: 'API status' },
                { path: '/api/env', method: 'GET', description: 'Environment info' }
            ],
            timestamp: new Date().toISOString(),
            server: 'Express.js',
            nodeVersion: process.version
        };
        res.json(statusData);
    } catch (error) {
        console.error('Status check error:', error);
        res.status(500).json({ status: 'error', message: 'Status check failed' });
    }
});

// Environment info endpoint - guaranteed valid JSON
app.get('/api/env', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const envData = {
            nodeVersion: process.version,
            platform: process.platform,
            uptime: Math.floor(process.uptime()),
            memory: process.memoryUsage(),
            environment: {
                NODE_ENV: process.env.NODE_ENV || 'production',
                PORT: process.env.PORT || '10000',
                AWS_REGION: process.env.AWS_REGION ? 'configured' : 'not configured',
                hasAWSCredentials: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY)
            },
            timestamp: new Date().toISOString()
        };
        res.json(envData);
    } catch (error) {
        console.error('Environment check error:', error);
        res.status(500).json({ status: 'error', message: 'Environment check failed' });
    }
});

// Test endpoint for JSON handling
app.post('/api/test', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        res.json({
            message: 'Test endpoint working',
            receivedData: req.body || {},
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Test endpoint error:', error);
        res.status(500).json({ status: 'error', message: 'Test failed' });
    }
});

// Main page route - serves HTML
app.get('/', (req, res) => {
    const html = `<!DOCTYPE html>
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
        .endpoints { display: flex; gap: 20px; justify-content: center; flex-wrap: wrap; margin: 30px 0; }
        .endpoint { 
            background: rgba(255,255,255,0.2); padding: 15px 25px; border-radius: 8px;
            text-decoration: none; color: white; transition: all 0.3s;
            border: 1px solid rgba(255,255,255,0.3); display: block;
        }
        .endpoint:hover { 
            background: rgba(255,255,255,0.3); transform: translateY(-2px);
            box-shadow: 0 4px 16px rgba(0,0,0,0.2);
        }
        .info { margin-top: 30px; text-align: center; opacity: 0.8; }
        .success { color: #4CAF50; font-weight: bold; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 FENIX</h1>
        <div class="status">
            <h2 class="success">✅ Successfully Deployed on Render!</h2>
            <p>Your FENIX Project Manager is now live and running.</p>
            <p><strong>All JSON parsing issues have been resolved!</strong></p>
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
            <p><strong>JSON Parsing:</strong> <span class="success">Fixed ✅</span></p>
        </div>
    </div>
</body>
</html>`;
    res.send(html);
});

// Catch all other routes - redirect to main page
app.get('*', (req, res) => {
    res.redirect('/');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    
    // If it's a JSON parsing error, return JSON response
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({
            error: 'Invalid JSON format',
            message: 'Please send valid JSON data',
            timestamp: new Date().toISOString()
        });
    }
    
    // For API routes, return JSON error
    if (req.path.startsWith('/api/') || req.path === '/health') {
        return res.status(500).json({
            error: 'Internal server error',
            message: err.message,
            timestamp: new Date().toISOString()
        });
    }
    
    // For other routes, return HTML error page
    res.status(500).send(`
        <h1>Server Error</h1>
        <p>Something went wrong: ${err.message}</p>
        <a href="/">Go back to main page</a>
    `);
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FENIX server running on port ${PORT}`);
    console.log(`📍 Health check: http://localhost:${PORT}/health`);
    console.log(`🌐 Environment: ${process.env.NODE_ENV || 'production'}`);
    console.log(`✅ JSON parsing issues resolved!`);
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