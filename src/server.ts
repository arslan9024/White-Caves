// src/server.ts
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { json, urlencoded } from 'body-parser';
import { v4 as uuidv4 } from 'uuid';
import pinoHttp from 'pino-http';
import logger from './utils/logger.js';
import { authRateLimiter } from './middleware/authRateLimiter';

import { errorHandler } from './middleware/errorHandler';
import healthRouter from './routes/health';
import metricsRouter from './routes/metrics';
import cookieParser from './middleware/cookieParser';
import { csrfProtection, setCsrfCookie, csrfTokenHandler } from './middleware/csrfProtection';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './docs/swagger';
import './tracing'; // initialize OpenTelemetry tracing
import { initMongo, closeMongo } from './services/db';
import { metricsMiddleware } from './middleware/metricsMiddleware';

app.use(cookieParser());

// ---- Security middlewares ----
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
      },
    },
    referrerPolicy: { policy: 'no-referrer' },
    hidePoweredBy: true,
  })
);

// ---- Security hardening ----
app.disable('x-powered-by');

// ---- CORS configuration ----
app.use(
  cors({
    origin: process.env.CORS_ORIGINS ? process.env.CORS_ORIGINS.split(',') : [
      'https://whitecaves.com',
      'https://app.whitecaves.com',
      // add more trusted origins here
    ],
    credentials: true,
  })
);

// ---- Basic middlewares ----
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(morgan('combined'));
app.use(compression());

// ---- Request ID for tracing ----
app.use((req, _res, next) => {
  const requestId = req.headers['x-request-id'] ?? uuidv4();
  req.headers['x-request-id'] = requestId as string;
  _res.setHeader('X-Request-ID', requestId as string);
  next();
});

// ---- Rate limiting ----
app.use(authRateLimiter);

// ---- CSRF protection ----
app.use(setCsrfCookie);
app.use(csrfProtection);
app.get('/csrf-token', csrfTokenHandler);

// ---- Health & metrics endpoints ----
app.use('/healthz', healthRouter);
// ---- API Documentation ----
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ---- Your existing API routes go here ----
// e.g., app.use('/api', apiRouter);

// ---- Global error handler (must be the last middleware) ----
app.use(errorHandler);

// ---- Graceful shutdown handling ----
const server = app.listen(process.env.PORT ?? 3000, () => {
  backendLogger.info({ port: process.env.PORT ?? 3000 }, 'Server listening');
});

async function shutdown(signal: string) {
  console.info(`Received ${signal}. Shutting down gracefully...`);
  server.close(async () => {
    console.info('HTTP server closed.');
    try {
      await closeMongo();
      console.info('MongoDB connection closed.');
    } catch (e) {
      console.error('Error closing MongoDB:', e);
    }
    process.exit(0);
  });
}

['SIGINT', 'SIGTERM'].forEach(sig => process.on(sig, () => shutdown(sig)));

export default app;
