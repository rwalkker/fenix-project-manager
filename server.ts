// FENIX Project Manager - Main Entry Point
// Simple wrapper that starts the server with error handling
// Created: January 7, 2026

try {
  // Import and start the server
  require('./api/server');
} catch (error) {
  console.error('Failed to start FENIX server:', error);
  process.exit(1);
}
