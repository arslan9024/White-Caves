import './config/env.js';
import express from 'express';
import { mountDomainRoutes } from './routes/registry.js';
import { configureMiddleware } from './bootstrap/middleware.js';
import { mountPublicRoutes } from './bootstrap/publicRoutes.js';
import { configureAuthentication } from './bootstrap/authentication.js';
import { mountWhatsappCompatibilityRoutes } from './routes/whatsappCompatibility.js';
import { mountPaymentCompatibilityRoutes } from './routes/paymentCompatibility.js';
import { mountValuationCompatibilityRoutes } from './routes/valuationCompatibility.js';
import { mountSystemCompatibilityRoutes } from './routes/systemCompatibility.js';
import { configureFinalHandlers } from './bootstrap/finalHandlers.js';
import { startApplication } from './bootstrap/lifecycle.js';
import type { ServerRuntime } from './bootstrap/runtime.js';

const app = express();
const runtime: ServerRuntime = { dbInitPromise: null, httpServer: null, realtimeService: null };
app.set('trust proxy', 1);
configureMiddleware(app, runtime);
mountPublicRoutes(app);
configureAuthentication(app);
mountDomainRoutes(app);
mountWhatsappCompatibilityRoutes(app);
mountPaymentCompatibilityRoutes(app);
mountValuationCompatibilityRoutes(app);
mountSystemCompatibilityRoutes(app);
configureFinalHandlers(app);
startApplication(app, runtime);

export default app;
