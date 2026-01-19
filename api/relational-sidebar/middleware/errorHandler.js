/**
 * Error Handler Middleware
 * Provides consistent error handling across all endpoints
 */

/**
 * Async error wrapper
 * Wraps async route handlers to catch errors
 */
const errorHandler = (fn) => {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((error) => {
      console.error('[ErrorHandler] Error caught:', {
        message: error.message,
        stack: error.stack,
        url: req.originalUrl,
        method: req.method,
      });

      // Determine status code
      let statusCode = 500;
      let errorMessage = 'Internal server error';

      if (error.message && error.message.includes('not found')) {
        statusCode = 404;
        errorMessage = error.message;
      } else if (error.message && error.message.includes('required')) {
        statusCode = 400;
        errorMessage = error.message;
      } else if (error.statusCode) {
        statusCode = error.statusCode;
        errorMessage = error.message;
      }

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        statusCode,
        timestamp: new Date().toISOString(),
      });
    });
  };
};

/**
 * Global error handler middleware
 * Must be the last middleware
 */
const globalErrorHandler = (err, req, res, next) => {
  console.error('[GlobalErrorHandler] Unhandled error:', {
    message: err.message,
    stack: err.stack,
    url: req.originalUrl,
  });

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    success: false,
    error: message,
    statusCode,
    timestamp: new Date().toISOString(),
  });
};

/**
 * 404 handler
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    error: `Route not found: ${req.method} ${req.originalUrl}`,
    statusCode: 404,
    timestamp: new Date().toISOString(),
  });
};

module.exports = {
  errorHandler,
  globalErrorHandler,
  notFoundHandler,
};
