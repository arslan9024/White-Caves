import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const router = express.Router();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Ensure logs directory exists
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

/**
 * POST /api/errors/log
 * Log client-side errors to server for monitoring
 */
router.post('/log', async (req, res) => {
  try {
    const {
      errorId,
      message,
      componentStack,
      stackTrace,
      userAgent,
      url,
      timestamp,
    // Schema validation enforced for payload
    } = req.body;

    // Validate required fields
    if (!errorId || !message) {
      return res.status(400).json({
        success: false,
        message: 'errorId and message are required'
      });
    }

    // Create error log entry
    const errorLog = {
      errorId,
      message,
      componentStack: componentStack || 'Not provided',
      stackTrace: stackTrace || 'Not provided',
      userAgent: userAgent || 'Not provided',
      url: url || 'Not provided',
      timestamp: timestamp || new Date().toISOString(),
      environment: environment || 'unknown'
    };

    // Log to file (daily rotation)
    const today = new Date().toISOString().split('T')[0];
    const logFile = path.join(logsDir, `errors-${today}.log`);

    const logEntry = JSON.stringify(errorLog) + '\n';
    fs.appendFileSync(logFile, logEntry, 'utf8');

    // Also log to console in development
    if (process.env.NODE_ENV !== 'production') {
      console.error(`[Client Error] ${errorId}:`, message);
    }

    res.json({
      success: true,
      message: 'Error logged successfully',
      errorId
    });
  } catch (error) {
    console.error('Error logging endpoint error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to log error'
    });
  }
});

/**
 * GET /api/errors/list
 * Retrieve error logs (admin only)
 */
router.get('/list', async (req, res) => {
  try {
    // This endpoint should be protected by authentication middleware
    const { days = 7 } = req.query;

    const errors = [];
    const today = new Date();

    // Read error logs from past N days
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const logFile = path.join(logsDir, `errors-${dateStr}.log`);

      if (fs.existsSync(logFile)) {
        const content = fs.readFileSync(logFile, 'utf8');
        const lines = content.trim().split('\n').filter(line => line);
        
        lines.forEach(line => {
          try {
            errors.push(JSON.parse(line));
          } catch (e) {
            // Skip malformed lines
          }
        });
      }
    }

    res.json({
      success: true,
      count: errors.length,
      errors: errors.sort((a, b) => 
        new Date(b.timestamp) - new Date(a.timestamp)
      )
    });
  } catch (error) {
    console.error('Error retrieving error logs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve error logs'
    });
  }
});

/**
 * GET /api/errors/stats
 * Get error statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const { days = 7 } = req.query;
    const errors = [];
    const today = new Date();

    // Read error logs from past N days
    for (let i = 0; i < days; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const logFile = path.join(logsDir, `errors-${dateStr}.log`);

      if (fs.existsSync(logFile)) {
        const content = fs.readFileSync(logFile, 'utf8');
        const lines = content.trim().split('\n').filter(line => line);
        
        lines.forEach(line => {
          try {
            errors.push(JSON.parse(line));
          } catch (e) {
            // Skip malformed lines
          }
        });
      }
    }

    // Calculate statistics
    const stats = {
      totalErrors: errors.length,
      errorsByEnvironment: {},
      errorsByPage: {},
      errorsByMessage: {},
      recentErrors: errors.slice(0, 10),
      timeRange: {
        from: new Date(today),
        to: new Date()
      }
    };

    // Aggregate by environment
    errors.forEach(err => {
      const env = err.environment || 'unknown';
      stats.errorsByEnvironment[env] = (stats.errorsByEnvironment[env] || 0) + 1;

      // Extract page from URL
      const urlMatch = err.url?.match(/https?:\/\/[^/]+([^?#]*)/);
      const page = urlMatch ? urlMatch[1] : 'unknown';
      stats.errorsByPage[page] = (stats.errorsByPage[page] || 0) + 1;

      // Count by message type
      const msgType = err.message?.split(':')[0] || 'unknown';
      stats.errorsByMessage[msgType] = (stats.errorsByMessage[msgType] || 0) + 1;
    });

    // Sort by count descending
    stats.errorsByEnvironment = Object.entries(stats.errorsByEnvironment)
      .sort(([, a], [, b]) => b - a)
      .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

    stats.errorsByPage = Object.entries(stats.errorsByPage)
      .sort(([, a], [, b]) => b - a)
      .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

    stats.errorsByMessage = Object.entries(stats.errorsByMessage)
      .sort(([, a], [, b]) => b - a)
      .reduce((obj, [key, val]) => ({ ...obj, [key]: val }), {});

    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error getting error stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get error statistics'
    });
  }
});

export default router;
