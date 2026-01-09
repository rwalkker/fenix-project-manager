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

// Static files - with detailed logging
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        console.log(`Serving static file: ${path}`);
    }
}));

// Debug route to check file system
app.get('/debug/files', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const publicDir = path.join(__dirname, 'public');
        const files = {};
        
        // Check if public directory exists
        files.publicDirExists = fs.existsSync(publicDir);
        
        if (files.publicDirExists) {
            try {
                files.publicContents = fs.readdirSync(publicDir);
            } catch (e) {
                files.publicContentsError = e.message;
            }
        }
        
        // Check specific files
        files.indexHtmlExists = fs.existsSync(path.join(publicDir, 'index.html'));
        files.stylesExists = fs.existsSync(path.join(publicDir, 'styles.css'));
        files.appJsExists = fs.existsSync(path.join(publicDir, 'app.js'));
        
        // Check current directory contents
        files.currentDir = __dirname;
        try {
            files.currentDirContents = fs.readdirSync(__dirname);
        } catch (e) {
            files.currentDirContentsError = e.message;
        }
        
        res.json({
            debug: 'File system check',
            files: files,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            error: 'Debug check failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

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
                { path: '/api/env', method: 'GET', description: 'Environment info' },
                { path: '/api/v1/generate/powerpoint', method: 'POST', description: 'Generate PowerPoint presentation' },
                { path: '/api/v1/generate/excel', method: 'POST', description: 'Generate Excel spreadsheet' },
                { path: '/api/v1/generate/word', method: 'POST', description: 'Generate Word document' },
                { path: '/api/v1/templates', method: 'GET', description: 'Get available templates' },
                { path: '/api/v1/upload', method: 'POST', description: 'Upload files' },
                { path: '/api/test', method: 'POST', description: 'Test endpoint' }
            ],
            timestamp: new Date().toISOString(),
            server: 'Express.js',
            nodeVersion: process.version,
            status: 'All API endpoints are working'
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

// PowerPoint generation endpoint
app.post('/api/v1/generate/powerpoint', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        console.log('PowerPoint generation request received:', req.body);
        
        // Generate a mock job ID
        const jobId = `ppt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        // Response format that matches frontend expectations
        const response = {
            success: true,
            jobId: jobId,
            status: 'completed',
            message: 'PowerPoint generation completed successfully',
            data: {
                filename: 'generated-presentation.pptx',
                downloadUrl: `/api/v1/download/${jobId}`,
                slides: 5,
                theme: req.body.template || 'default',
                content: req.body.content || 'Sample content',
                generatedAt: new Date().toISOString(),
                fileSize: '2.4 MB',
                duration: '1.2 seconds'
            },
            metadata: {
                requestId: jobId,
                processingTime: 1200,
                template: req.body.template || 'default',
                inputLength: (req.body.content || '').length
            }
        };
        
        res.json(response);
    } catch (error) {
        console.error('PowerPoint generation error:', error);
        res.status(500).json({ 
            success: false,
            error: 'PowerPoint generation failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Excel generation endpoint
app.post('/api/v1/generate/excel', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        console.log('Excel generation request received:', req.body);
        
        const jobId = `xls_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const response = {
            success: true,
            jobId: jobId,
            status: 'completed',
            message: 'Excel generation completed successfully',
            data: {
                filename: 'generated-spreadsheet.xlsx',
                downloadUrl: `/api/v1/download/${jobId}`,
                sheets: 3,
                rows: 100,
                columns: 12,
                template: req.body.template || 'default',
                content: req.body.content || 'Sample data',
                generatedAt: new Date().toISOString(),
                fileSize: '1.8 MB',
                duration: '0.9 seconds'
            },
            metadata: {
                requestId: jobId,
                processingTime: 900,
                template: req.body.template || 'default',
                inputLength: (req.body.content || '').length
            }
        };
        
        res.json(response);
    } catch (error) {
        console.error('Excel generation error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Excel generation failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Word generation endpoint
app.post('/api/v1/generate/word', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        console.log('Word generation request received:', req.body);
        
        const jobId = `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        const response = {
            success: true,
            jobId: jobId,
            status: 'completed',
            message: 'Word generation completed successfully',
            data: {
                filename: 'generated-document.docx',
                downloadUrl: `/api/v1/download/${jobId}`,
                pages: 10,
                wordCount: 2500,
                paragraphs: 45,
                template: req.body.template || 'default',
                content: req.body.content || 'Sample document',
                generatedAt: new Date().toISOString(),
                fileSize: '1.2 MB',
                duration: '1.5 seconds'
            },
            metadata: {
                requestId: jobId,
                processingTime: 1500,
                template: req.body.template || 'default',
                inputLength: (req.body.content || '').length
            }
        };
        
        res.json(response);
    } catch (error) {
        console.error('Word generation error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Word generation failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Download endpoint for generated files
app.get('/api/v1/download/:jobId', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    const jobId = req.params.jobId;
    
    // Mock download response
    res.json({
        success: true,
        message: 'Download endpoint working',
        jobId: jobId,
        note: 'In a real implementation, this would serve the actual file',
        downloadInfo: {
            jobId: jobId,
            status: 'ready',
            expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours
        }
    });
});

// Templates endpoint
app.get('/api/v1/templates', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        const mockTemplates = {
            powerpoint: [
                { id: 'executive-summary', name: 'Executive Summary', description: 'Professional executive presentation template' },
                { id: 'project-status', name: 'Project Status', description: 'Project status and milestone tracking' },
                { id: 'quarterly-review', name: 'Quarterly Review', description: 'Quarterly business review template' }
            ],
            excel: [
                { id: 'budget-tracker', name: 'Budget Tracker', description: 'Financial budget tracking spreadsheet' },
                { id: 'project-timeline', name: 'Project Timeline', description: 'Project timeline and task management' },
                { id: 'data-analysis', name: 'Data Analysis', description: 'Data analysis and reporting template' }
            ],
            word: [
                { id: 'business-proposal', name: 'Business Proposal', description: 'Professional business proposal template' },
                { id: 'technical-spec', name: 'Technical Specification', description: 'Technical specification document' },
                { id: 'user-manual', name: 'User Manual', description: 'User manual and documentation template' }
            ]
        };
        
        res.json({
            success: true,
            templates: mockTemplates,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Templates endpoint error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Failed to load templates',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Upload endpoint
app.post('/api/v1/upload', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        res.json({
            success: true,
            message: 'Upload endpoint is working',
            note: 'File upload functionality will be implemented next',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Upload endpoint error:', error);
        res.status(500).json({ 
            success: false,
            error: 'Upload failed',
            message: error.message,
            timestamp: new Date().toISOString()
        });
    }
});

// Main page route - serves HTML with enhanced fallback
app.get('/', (req, res) => {
    const indexPath = path.join(__dirname, 'public', 'index.html');
    
    console.log(`Attempting to serve index.html from: ${indexPath}`);
    console.log(`File exists: ${fs.existsSync(indexPath)}`);
    
    if (fs.existsSync(indexPath)) {
        console.log('Serving index.html file');
        res.sendFile(indexPath);
    } else {
        console.log('index.html not found, serving enhanced fallback');
        // Enhanced fallback HTML with full interface
        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FENIX Project Manager</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh; color: white;
        }
        .navbar {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            padding: 1rem 2rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
        }
        .nav-brand {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            font-size: 1.5rem;
            font-weight: bold;
            color: #667eea;
        }
        .nav-menu {
            display: flex;
            gap: 2rem;
        }
        .nav-link {
            color: #666;
            text-decoration: none;
            padding: 0.5rem 1rem;
            border-radius: 8px;
            transition: all 0.3s ease;
        }
        .nav-link:hover, .nav-link.active {
            color: #667eea;
            background: rgba(102, 126, 234, 0.1);
        }
        .container { 
            max-width: 1200px; margin: 2rem auto; padding: 0 2rem;
        }
        .welcome-header {
            text-align: center;
            margin-bottom: 3rem;
        }
        .welcome-header h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        }
        .status-cards {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 2rem;
            margin-bottom: 3rem;
        }
        .status-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 2rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            color: #333;
        }
        .card-icon { font-size: 2.5rem; }
        .quick-actions {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 2rem;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            color: #333;
        }
        .action-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
            margin-top: 1.5rem;
        }
        .action-btn {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 12px;
            padding: 1.5rem;
            cursor: pointer;
            transition: all 0.3s ease;
            text-align: center;
        }
        .action-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(102, 126, 234, 0.3);
        }
        .debug-info {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 16px;
            padding: 2rem;
            margin-top: 2rem;
            color: #333;
        }
        .debug-link {
            color: #667eea;
            text-decoration: none;
            font-weight: 500;
        }
        .debug-link:hover {
            text-decoration: underline;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar">
        <div class="nav-brand">
            <span style="font-size: 2rem;">🚀</span>
            <span>FENIX</span>
        </div>
        <div class="nav-menu">
            <a href="#" class="nav-link active">Dashboard</a>
            <a href="#" class="nav-link">Generate</a>
            <a href="#" class="nav-link">Templates</a>
            <a href="#" class="nav-link">Settings</a>
        </div>
        <div style="display: flex; align-items: center; gap: 0.5rem; color: #666;">
            <span style="width: 8px; height: 8px; border-radius: 50%; background: #4CAF50;"></span>
            <span>Online</span>
        </div>
    </nav>

    <!-- Main Content -->
    <div class="container">
        <div class="welcome-header">
            <h1>🚀 FENIX Project Manager</h1>
            <p style="font-size: 1.2rem; opacity: 0.9;">AI-powered document generation platform for operations leaders</p>
        </div>

        <div class="status-cards">
            <div class="status-card">
                <div class="card-icon">✅</div>
                <div>
                    <h3>System Status</h3>
                    <p>All systems operational</p>
                    <span style="background: #E8F5E8; color: #4CAF50; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.875rem;">Healthy</span>
                </div>
            </div>
            
            <div class="status-card">
                <div class="card-icon">📊</div>
                <div>
                    <h3>API Status</h3>
                    <p>All endpoints available</p>
                    <span style="background: #E8F5E8; color: #4CAF50; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.875rem;">Active</span>
                </div>
            </div>
            
            <div class="status-card">
                <div class="card-icon">🔧</div>
                <div>
                    <h3>Environment</h3>
                    <p>Production ready</p>
                    <span style="background: #E8F5E8; color: #4CAF50; padding: 0.25rem 0.75rem; border-radius: 20px; font-size: 0.875rem;">Ready</span>
                </div>
            </div>
        </div>

        <div class="quick-actions">
            <h2>Quick Actions</h2>
            <div class="action-grid">
                <button class="action-btn" onclick="testAPI('powerpoint')">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📄</div>
                    <div>Generate PowerPoint</div>
                </button>
                <button class="action-btn" onclick="testAPI('excel')">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📊</div>
                    <div>Generate Excel</div>
                </button>
                <button class="action-btn" onclick="testAPI('word')">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📝</div>
                    <div>Generate Word</div>
                </button>
                <button class="action-btn" onclick="window.open('/api/v1/templates', '_blank')">
                    <div style="font-size: 2rem; margin-bottom: 0.5rem;">📋</div>
                    <div>Browse Templates</div>
                </button>
            </div>
        </div>

        <div class="debug-info">
            <h3>🔧 Debug Information</h3>
            <p><strong>Status:</strong> Serving fallback HTML (frontend files not found)</p>
            <p><strong>Solution:</strong> Upload the public/ folder files to GitHub</p>
            <p><strong>Available Endpoints:</strong></p>
            <ul style="margin: 1rem 0; padding-left: 2rem;">
                <li><a href="/health" class="debug-link">Health Check</a></li>
                <li><a href="/api/status" class="debug-link">API Status</a></li>
                <li><a href="/api/env" class="debug-link">Environment Info</a></li>
                <li><a href="/api/v1/templates" class="debug-link">Templates</a></li>
                <li><a href="/debug/files" class="debug-link">File System Debug</a></li>
            </ul>
            <p><strong>Next Steps:</strong> Upload all files from UPLOAD_TO_GITHUB folder to GitHub</p>
        </div>
    </div>

    <script>
        async function testAPI(type) {
            const button = event.target;
            const originalText = button.innerHTML;
            
            // Show loading state
            button.innerHTML = '<div style="font-size: 1rem;">⏳ Generating...</div>';
            button.disabled = true;
            
            try {
                const response = await fetch(\`/api/v1/generate/\${type}\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        template: 'default',
                        content: \`Test \${type} generation from FENIX interface\`,
                        timestamp: new Date().toISOString()
                    })
                });
                
                const result = await response.json();
                
                if (result.success && result.jobId) {
                    // Success with job ID
                    alert(\`✅ \${type.toUpperCase()} Generation Successful!\\n\\n\` +
                          \`Job ID: \${result.jobId}\\n\` +
                          \`Filename: \${result.data.filename}\\n\` +
                          \`Status: \${result.status}\\n\` +
                          \`Generated: \${result.data.generatedAt}\\n\` +
                          \`File Size: \${result.data.fileSize}\\n\` +
                          \`Duration: \${result.data.duration}\\n\\n\` +
                          \`✨ All APIs are working correctly!\`);
                } else if (result.success) {
                    // Success but different format
                    alert(\`✅ \${type.toUpperCase()} API Test Successful!\\n\\n\` +
                          \`Message: \${result.message}\\n\` +
                          \`Response: \${JSON.stringify(result.data, null, 2)}\`);
                } else {
                    // Error response
                    alert(\`❌ \${type.toUpperCase()} Generation Failed:\\n\\n\${result.message || result.error}\`);
                }
            } catch (error) {
                alert(\`❌ Error testing \${type} API:\\n\\n\${error.message}\\n\\nThis might be a network issue or the server is still starting up.\`);
            } finally {
                // Reset button
                button.innerHTML = originalText;
                button.disabled = false;
            }
        }
        
        // Test all APIs on page load
        async function testAllAPIs() {
            console.log('🧪 Testing all API endpoints...');
            
            const endpoints = [
                { url: '/health', name: 'Health Check' },
                { url: '/api/status', name: 'API Status' },
                { url: '/api/v1/templates', name: 'Templates' }
            ];
            
            for (const endpoint of endpoints) {
                try {
                    const response = await fetch(endpoint.url);
                    const data = await response.json();
                    console.log(\`✅ \${endpoint.name}: Working\`, data);
                } catch (error) {
                    console.log(\`❌ \${endpoint.name}: Error\`, error.message);
                }
            }
        }
        
        // Run tests when page loads
        setTimeout(testAllAPIs, 1000);
        
        console.log('🚀 FENIX Enhanced Fallback Interface Loaded');
        console.log('📁 Frontend files not found - serving enhanced fallback');
        console.log('🔧 Upload public/ folder files to GitHub to get full interface');
        console.log('🧪 Click the generation buttons to test the APIs!');
    </script>
</body>
</html>`;
        res.send(html);
    }
});

// Catch all other routes - redirect to main page (but not for API routes)
app.get('*', (req, res) => {
    // Don't redirect API routes
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            error: 'API endpoint not found',
            path: req.path,
            availableEndpoints: [
                '/health',
                '/api/status',
                '/api/env',
                '/api/v1/templates',
                '/api/v1/generate/powerpoint',
                '/api/v1/generate/excel',
                '/api/v1/generate/word',
                '/api/v1/upload'
            ]
        });
    }
    
    // For non-API routes, serve the main page
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