// FENIX Project Manager - WebSocket Test
// Test real-time features
// Created: January 6, 2026

import { createServer } from 'http';
import express from 'express';
import { WebSocketService } from '../services/WebSocketService';

async function testWebSocket() {
  console.log('╔════════════════════════════════════════════════════════════╗');
  console.log('║         FENIX WebSocket Service - Test                    ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  // Create Express app and HTTP server
  const app = express();
  const httpServer = createServer(app);

  // Initialize WebSocket service
  const wsService = new WebSocketService(httpServer);

  // Start server
  const port = 3101;
  httpServer.listen(port, () => {
    console.log(`✅ WebSocket server started on port ${port}`);
    console.log(`🔌 Connect to: ws://localhost:${port}\n`);
  });

  // Simulate workflow progress updates
  setTimeout(() => {
    console.log('📊 Simulating workflow progress...\n');
    
    const workflowId = 'test-workflow-123';
    
    // Progress updates
    wsService.emitProgress(workflowId, 0, 'Initializing', 'Starting document generation');
    
    setTimeout(() => {
      wsService.emitProgress(workflowId, 25, 'Processing', 'Analyzing content');
    }, 1000);
    
    setTimeout(() => {
      wsService.emitProgress(workflowId, 50, 'Generating', 'Creating document structure');
    }, 2000);
    
    setTimeout(() => {
      wsService.emitProgress(workflowId, 75, 'Formatting', 'Applying styles and formatting');
    }, 3000);
    
    setTimeout(() => {
      wsService.emitProgress(workflowId, 100, 'Complete', 'Document generated successfully');
      wsService.emitStatus(workflowId, 'complete', {
        filename: 'test-document.pptx',
        downloadUrl: '/api/v1/generate/download/test-workflow-123',
      });
      wsService.emitNotification('success', 'Document generation complete!');
    }, 4000);
  }, 2000);

  // Keep server running
  console.log('Press Ctrl+C to stop the server\n');
}

// Run test
testWebSocket().catch(console.error);
