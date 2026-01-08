// Render.com optimized server entry point
// Handles TypeScript build issues gracefully for deployment

const fs = require('fs');
const path = require('path');

// Check if compiled server exists
const serverPath = path.join(__dirname, 'dist', 'api', 'server.js');

if (fs.existsSync(serverPath)) {
  console.log('✅ Using compiled TypeScript server');
  require('./dist/api/server.js');
} else {
  console.log('⚠️  Compiled server not found, using fallback');
  
  // Fallback: Create a simple Express server
  const express = require('express');
  const app = express();
  const PORT = process.env.PORT || 10000;
  
  // Serve static files
  app.use(express.static('public'));
  
  // Health check
  app.get('/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      mode: 'fallback'
    });
  });
  
  // Basic API endpoint
  app.get('/api/v1/health', (req, res) => {
    res.json({ 
      status: 'healthy', 
      message: 'FENIX API is running in fallback mode',
      timestamp: new Date().toISOString()
    });
  });
  
  // Catch all for SPA
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
  
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 FENIX Server (fallback) running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
}