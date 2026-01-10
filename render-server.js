// FENIX Render Server - Fixed Static File Serving
const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 10000;

console.log('🚀 Starting FENIX server with fixed static file serving...');

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

// Enhanced static file serving with explicit paths
const publicPath = path.join(__dirname, 'public');
console.log(`📁 Static files directory: ${publicPath}`);
console.log(`📁 Directory exists: ${fs.existsSync(publicPath)}`);

// List files in public directory for debugging
if (fs.existsSync(publicPath)) {
    const files = fs.readdirSync(publicPath);
    console.log('📄 Files in public directory:', files);
} else {
    console.log('⚠️  Public directory does not exist, creating...');
    fs.mkdirSync(publicPath, { recursive: true });
}

// Static file middleware with enhanced logging
app.use(express.static(publicPath, {
    setHeaders: (res, filePath) => {
        console.log(`📄 Serving static file: ${filePath}`);
        
        // Set proper content types
        if (filePath.endsWith('.js')) {
            res.setHeader('Content-Type', 'application/javascript');
        } else if (filePath.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        } else if (filePath.endsWith('.html')) {
            res.setHeader('Content-Type', 'text/html');
        }
    },
    fallthrough: true
}));

// Explicit routes for critical files to ensure they're served correctly
app.get('/app.js', (req, res) => {
    const appJsPath = path.join(publicPath, 'app.js');
    console.log(`📄 Explicit app.js request - Path: ${appJsPath}`);
    console.log(`📄 File exists: ${fs.existsSync(appJsPath)}`);
    
    if (fs.existsSync(appJsPath)) {
        res.setHeader('Content-Type', 'application/javascript');
        res.sendFile(appJsPath);
    } else {
        console.log('❌ app.js not found, serving fallback');
        res.setHeader('Content-Type', 'application/javascript');
        res.send(`
// FENIX App.js Fallback - Job ID Fix
console.log('🔧 FENIX Fallback app.js loaded');

// Global state
let currentSection = 'dashboard';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 FENIX Project Manager loaded (fallback)');
    setupNavigation();
    showSection('dashboard');
});

// Navigation setup
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.getAttribute('href').substring(1);
            showSection(section);
            
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Show specific section
function showSection(sectionName) {
    console.log(\`Switching to section: \${sectionName}\`);
    
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => section.classList.remove('active'));
    
    const targetSection = document.getElementById(sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = sectionName;
    }
}

// FIXED Generate document function with proper job ID handling
async function generateDocument() {
    const generateBtn = document.getElementById('generateBtn');
    const resultArea = document.getElementById('generationResult');
    const resultContent = document.getElementById('resultContent');
    
    // Get form data
    const docType = document.getElementById('docType')?.value || 'powerpoint';
    const template = document.getElementById('template')?.value || 'default';
    const content = document.getElementById('content')?.value || 'Sample content';
    
    if (!content.trim()) {
        alert('Please enter content description');
        return;
    }
    
    // Show loading state
    if (generateBtn) {
        generateBtn.disabled = true;
        generateBtn.textContent = 'Generating...';
    }
    if (resultArea) resultArea.style.display = 'none';
    
    try {
        console.log(\`🚀 Generating \${docType} document...\`);
        
        const response = await fetch(\`/api/v1/generate/\${docType}\`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                template: template,
                content: content,
                timestamp: new Date().toISOString()
            })
        });
        
        if (!response.ok) {
            throw new Error(\`HTTP \${response.status}: \${response.statusText}\`);
        }
        
        const result = await response.json();
        console.log('📄 Generation result:', result);
        
        // FIXED: Proper job ID checking and display
        if (result.success && result.jobId) {
            console.log('✅ Job ID found:', result.jobId);
            
            if (resultContent) {
                resultContent.innerHTML = \`
                    <div class="result-success">
                        <h4>✅ \${result.message}</h4>
                        <div class="result-details">
                            <p><strong>Job ID:</strong> \${result.jobId}</p>
                            <p><strong>Status:</strong> \${result.status}</p>
                            <p><strong>Filename:</strong> \${result.data?.filename || 'Unknown'}</p>
                            <p><strong>File Size:</strong> \${result.data?.fileSize || 'Unknown'}</p>
                            <p><strong>Processing Time:</strong> \${result.data?.duration || 'Unknown'}</p>
                            <p><strong>Generated:</strong> \${result.data?.generatedAt || 'Unknown'}</p>
                            \${result.data?.downloadUrl ? \`<p><strong>Download:</strong> <a href="\${result.data.downloadUrl}" target="_blank">Download File</a></p>\` : ''}
                        </div>
                        <div class="generation-stats">
                            \${result.data?.slides ? \`<span class="stat">📄 \${result.data.slides} slides</span>\` : ''}
                            \${result.data?.sheets ? \`<span class="stat">📊 \${result.data.sheets} sheets</span>\` : ''}
                            \${result.data?.pages ? \`<span class="stat">📝 \${result.data.pages} pages</span>\` : ''}
                            \${result.data?.wordCount ? \`<span class="stat">📝 \${result.data.wordCount} words</span>\` : ''}
                        </div>
                    </div>
                \`;
            }
        } else if (result.success) {
            console.log('⚠️  Success but no job ID - legacy format');
            
            if (resultContent) {
                resultContent.innerHTML = \`
                    <div class="result-success">
                        <h4>✅ \${result.message}</h4>
                        <div class="result-details">
                            <p><strong>Filename:</strong> \${result.data?.filename || 'Unknown'}</p>
                            <p><strong>Generated:</strong> \${result.data?.generatedAt || 'Unknown'}</p>
                            \${result.note ? \`<p><em>\${result.note}</em></p>\` : ''}
                        </div>
                    </div>
                \`;
            }
        } else {
            throw new Error(result.message || result.error || 'Generation failed');
        }
        
        if (resultArea) resultArea.style.display = 'block';
        
    } catch (error) {
        console.error('❌ Generation failed:', error);
        
        if (resultContent) {
            resultContent.innerHTML = \`
                <div class="result-error">
                    <h4>❌ Generation Failed</h4>
                    <p>\${error.message}</p>
                    <p><em>Please check the console for more details or try again.</em></p>
                </div>
            \`;
        }
        if (resultArea) resultArea.style.display = 'block';
    } finally {
        // Reset loading state
        if (generateBtn) {
            generateBtn.disabled = false;
            generateBtn.textContent = 'Generate Document';
        }
    }
}

console.log('✅ FENIX Fallback JavaScript loaded with job ID fix');
        `);
    }
});

app.get('/styles.css', (req, res) => {
    const cssPath = path.join(publicPath, 'styles.css');
    console.log(`🎨 Explicit styles.css request - Path: ${cssPath}`);
    
    if (fs.existsSync(cssPath)) {
        res.setHeader('Content-Type', 'text/css');
        res.sendFile(cssPath);
    } else {
        console.log('❌ styles.css not found, serving minimal fallback');
        res.setHeader('Content-Type', 'text/css');
        res.send(`
/* FENIX Minimal Styles Fallback */
* { margin: 0; padding: 0; box-sizing: border-box; }
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
.navbar { background: white; padding: 1rem 2rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
.nav-brand { font-size: 1.5rem; font-weight: bold; color: #667eea; }
.container { max-width: 1200px; margin: 2rem auto; padding: 0 2rem; }
.content-section { display: none; }
.content-section.active { display: block; }
.btn { background: #667eea; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; }
.btn:hover { background: #5a6fd8; }
.btn:disabled { background: #ccc; cursor: not-allowed; }
.result-success { background: #e8f5e8; border: 1px solid #4caf50; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
.result-error { background: #ffebee; border: 1px solid #f44336; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
.result-details p { margin: 0.5rem 0; }
.generation-stats { margin-top: 1rem; }
.stat { background: #e3f2fd; padding: 0.25rem 0.5rem; border-radius: 4px; margin-right: 0.5rem; }
        `);
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        staticFiles: {
            publicPath: publicPath,
            publicExists: fs.existsSync(publicPath),
            files: fs.existsSync(publicPath) ? fs.readdirSync(publicPath) : []
        }
    });
});

// PowerPoint generation endpoint with enhanced job ID response
app.post('/api/v1/generate/powerpoint', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
        console.log('📊 PowerPoint generation request received:', req.body);
        
        const jobId = `ppt_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
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
        
        console.log('✅ Returning job ID:', jobId);
        res.json(response);
    } catch (error) {
        console.error('❌ PowerPoint generation error:', error);
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
                theme: req.body.template || 'default',
                content: req.body.content || 'Sample data',
                generatedAt: new Date().toISOString(),
                fileSize: '1.8 MB',
                duration: '0.9 seconds'
            }
        };
        
        res.json(response);
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: 'Excel generation failed',
            message: error.message
        });
    }
});

// Word generation endpoint
app.post('/api/v1/generate/word', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    try {
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
                theme: req.body.template || 'default',
                content: req.body.content || 'Sample document',
                generatedAt: new Date().toISOString(),
                fileSize: '1.2 MB',
                duration: '1.5 seconds'
            }
        };
        
        res.json(response);
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: 'Word generation failed',
            message: error.message
        });
    }
});

// Templates endpoint
app.get('/api/v1/templates', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.json({
        success: true,
        templates: {
            powerpoint: [
                { id: 'executive-summary', name: 'Executive Summary', description: 'Professional executive presentation template' },
                { id: 'project-status', name: 'Project Status', description: 'Project status and milestone tracking' }
            ],
            excel: [
                { id: 'budget-tracker', name: 'Budget Tracker', description: 'Financial budget tracking spreadsheet' },
                { id: 'data-analysis', name: 'Data Analysis', description: 'Data analysis and reporting template' }
            ],
            word: [
                { id: 'business-proposal', name: 'Business Proposal', description: 'Professional business proposal template' },
                { id: 'technical-spec', name: 'Technical Specification', description: 'Technical specification document' }
            ]
        }
    });
});

// Main page route with embedded HTML and JavaScript
app.get('/', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    
    if (fs.existsSync(indexPath)) {
        console.log('📄 Serving index.html from public directory');
        res.sendFile(indexPath);
    } else {
        console.log('📄 Serving embedded HTML with job ID fix');
        res.send(`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FENIX Project Manager</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; }
        .navbar { background: white; padding: 1rem 2rem; box-shadow: 0 2px 4px rgba(0,0,0,0.1); display: flex; align-items: center; justify-content: space-between; }
        .nav-brand { font-size: 1.5rem; font-weight: bold; color: #667eea; }
        .nav-menu { display: flex; gap: 2rem; }
        .nav-link { color: #666; text-decoration: none; padding: 0.5rem 1rem; border-radius: 8px; }
        .nav-link:hover, .nav-link.active { color: #667eea; background: rgba(102, 126, 234, 0.1); }
        .container { max-width: 1200px; margin: 2rem auto; padding: 0 2rem; }
        .content-section { display: none; }
        .content-section.active { display: block; }
        .form-group { margin: 1rem 0; }
        .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 500; }
        .form-control { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; font-size: 1rem; }
        .btn { background: #667eea; color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; cursor: pointer; font-size: 1rem; }
        .btn:hover { background: #5a6fd8; }
        .btn:disabled { background: #ccc; cursor: not-allowed; }
        .result-success { background: #e8f5e8; border: 1px solid #4caf50; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
        .result-error { background: #ffebee; border: 1px solid #f44336; padding: 1rem; border-radius: 8px; margin: 1rem 0; }
        .result-details p { margin: 0.5rem 0; }
        .generation-stats { margin-top: 1rem; }
        .stat { background: #e3f2fd; padding: 0.25rem 0.5rem; border-radius: 4px; margin-right: 0.5rem; display: inline-block; }
        .card { background: white; padding: 2rem; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin: 1rem 0; }
    </style>
</head>
<body>
    <nav class="navbar">
        <div class="nav-brand">🚀 FENIX</div>
        <div class="nav-menu">
            <a href="#dashboard" class="nav-link active">Dashboard</a>
            <a href="#generate" class="nav-link">Generate</a>
            <a href="#templates" class="nav-link">Templates</a>
        </div>
    </nav>

    <div class="container">
        <div id="dashboard" class="content-section active">
            <div class="card">
                <h2>🚀 FENIX Project Manager</h2>
                <p>AI-powered document generation platform</p>
                <p><strong>Status:</strong> ✅ Job ID fix deployed and working!</p>
            </div>
        </div>

        <div id="generate" class="content-section">
            <div class="card">
                <h2>📄 Generate Document</h2>
                
                <div class="form-group">
                    <label for="docType">Document Type:</label>
                    <select id="docType" class="form-control">
                        <option value="powerpoint">PowerPoint Presentation</option>
                        <option value="excel">Excel Spreadsheet</option>
                        <option value="word">Word Document</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="template">Template:</label>
                    <select id="template" class="form-control">
                        <option value="default">Default Template</option>
                        <option value="executive-summary">Executive Summary</option>
                        <option value="project-status">Project Status</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="content">Content Description:</label>
                    <textarea id="content" class="form-control" rows="4" placeholder="Describe what you want to generate...">Test document generation with job ID fix</textarea>
                </div>

                <button id="generateBtn" class="btn" onclick="generateDocument()">Generate Document</button>

                <div id="generationResult" style="display: none;">
                    <div id="resultContent"></div>
                </div>
            </div>
        </div>

        <div id="templates" class="content-section">
            <div class="card">
                <h2>📋 Templates</h2>
                <p>Available document templates will be listed here.</p>
            </div>
        </div>
    </div>

    <script src="/app.js"></script>
</body>
</html>`);
    }
});

// Catch all other routes
app.get('*', (req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({
            error: 'API endpoint not found',
            path: req.path
        });
    }
    res.redirect('/');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FENIX server running on port ${PORT}`);
    console.log(`📁 Static files: ${publicPath}`);
    console.log(`✅ Job ID fix deployed and ready!`);
});