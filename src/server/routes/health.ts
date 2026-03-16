/**
 * Health Check Endpoint for Production Monitoring
 * Provides comprehensive system status for load balancers and monitoring
 */

import express, { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router: Router = express.Router();

interface HealthCheckResponse {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: string;
  uptime: number;
  environment: string;
  services: {
    database: 'connected' | 'disconnected' | 'unknown';
    whatsapp: 'ready' | 'disconnected' | 'unknown';
    redis: 'connected' | 'disconnected' | 'unknown';
  };
  memory: {
    rss: number;
    heapTotal: number;
    heapUsed: number;
    external: number;
  };
  version: string;
  checks: {
    database: {
      status: 'pass' | 'fail';
      responseTime: number;
    };
    whatsapp: {
      status: 'pass' | 'fail' | 'unknown';
      activeSessions: number;
    };
  };
}

/**
 * GET /health
 * Quick liveness probe (for Kubernetes)
 */
router.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString()
  });
});

/**
 * GET /health/ready
 * Detailed readiness probe (for Kubernetes)
 */
router.get('/ready', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    
    // Check MongoDB connection
    const dbConnected = mongoose.connection.readyState === 1; // 1 = connected
    const dbResponseTime = Date.now() - startTime;

    const response: HealthCheckResponse = {
      status: dbConnected ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      services: {
        database: dbConnected ? 'connected' : 'disconnected',
        whatsapp: 'unknown', // Can be enhanced with actual service status
        redis: 'unknown' // Can be enhanced with Redis client check
      },
      memory: process.memoryUsage(),
      version: process.env.APP_VERSION || '1.0.0',
      checks: {
        database: {
          status: dbConnected ? 'pass' : 'fail',
          responseTime: dbResponseTime
        },
        whatsapp: {
          status: 'unknown',
          activeSessions: 0
        }
      }
    };

    const statusCode = dbConnected ? 200 : 503;
    res.status(statusCode).json(response);
  } catch (error) {
    console.error('Health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal server error'
    });
  }
});

/**
 * GET /health/live
 * Liveness probe (for Docker/Kubernetes)
 */
router.get('/live', (req: Request, res: Response) => {
  const memory = process.memoryUsage();
  const heapUsedPercent = (memory.heapUsed / memory.heapTotal) * 100;

  // If heap usage exceeds 95%, consider unhealthy
  if (heapUsedPercent > 95) {
    return res.status(503).json({
      status: 'unhealthy',
      message: 'High memory usage',
      heapUsedPercent
    });
  }

  res.status(200).json({
    status: 'alive',
    uptime: process.uptime(),
    heapUsedPercent
  });
});

/**
 * GET /health/deep
 * Comprehensive health check (for manual monitoring)
 */
router.get('/deep', async (req: Request, res: Response) => {
  try {
    const startTime = Date.now();
    const checks: any = {};

    // Database health
    const dbConnected = mongoose.connection.readyState === 1;
    checks.database = {
      connected: dbConnected,
      state: mongoose.connection.readyState, // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
      responseTime: Date.now() - startTime
    };

    // Memory health
    const memory = process.memoryUsage();
    checks.memory = {
      rss: Math.round(memory.rss / 1024 / 1024) + ' MB',
      heapTotal: Math.round(memory.heapTotal / 1024 / 1024) + ' MB',
      heapUsed: Math.round(memory.heapUsed / 1024 / 1024) + ' MB',
      heapUsedPercent: ((memory.heapUsed / memory.heapTotal) * 100).toFixed(2) + '%',
      external: Math.round(memory.external / 1024 / 1024) + ' MB'
    };

    // System health
    checks.system = {
      uptime: Math.floor(process.uptime()) + ' seconds',
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: process.version,
      platform: process.platform
    };

    // API health
    checks.api = {
      status: 'operational',
      port: process.env.PORT || 5000,
      url: process.env.API_URL || 'http://localhost:5000'
    };

    // Build overall status
    const overallStatus = dbConnected ? 'healthy' : 'degraded';
    const statusCode = dbConnected ? 200 : 503;

    res.status(statusCode).json({
      status: overallStatus,
      timestamp: new Date().toISOString(),
      checks,
      recommendations: dbConnected ? [] : ['Restart MongoDB connection']
    });
  } catch (error) {
    console.error('Deep health check error:', error);
    res.status(503).json({
      status: 'unhealthy',
      error: process.env.NODE_ENV === 'development' ? (error as Error).message : 'Internal error'
    });
  }
});

export default router;
