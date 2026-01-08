// FENIX Project Manager - Error Handler Middleware
// Centralized error handling for API
// Created: January 6, 2026

import { Request, Response, NextFunction } from 'express';

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Error handler middleware
 */
export function errorHandler(
  err: Error | ApiError,
  req: Request,
  res: Response,
  _next: NextFunction // Required by Express error handler signature
): void {
  // Log error
  console.error('Error:', {
    name: err.name,
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Determine status code
  const statusCode = err instanceof ApiError ? err.statusCode : 500;

  // Determine error message
  const message = err.message || 'Internal Server Error';

  // Get details if available
  const details = err instanceof ApiError ? err.details : undefined;

  // Send error response
  res.status(statusCode).json({
    error: err.name || 'Error',
    message,
    details,
    timestamp: new Date().toISOString(),
    path: req.path,
  });
}

/**
 * Async handler wrapper to catch errors in async route handlers
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<any>
) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
