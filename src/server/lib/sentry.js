import * as Sentry from '@sentry/node';

/**
 * Initialize Sentry for production error tracking
 * Captures unhandled exceptions, rejections, and HTTP errors
 */
export function initializeSentry(app) {
  const dsn = process.env.SENTRY_DSN;

  if (!dsn) {
    console.warn('⚠️  SENTRY_DSN not configured - error tracking disabled');
    console.warn('   To enable: set SENTRY_DSN in .env.staging');
    return false;
  }

  Sentry.init({
    dsn,
    environment: process.env.NODE_ENV || 'production',
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
    integrations: [
      new Sentry.Integrations.Http({ tracing: true }),
      new Sentry.Integrations.OnUncaughtException(),
      new Sentry.Integrations.OnUnhandledRejection(),
    ],
    beforeSend(event, hint) {
      // Don't send 404 errors to Sentry
      if (event.request && event.request.url) {
        if (event.request.url.includes('/health')) {
          return null;
        }
      }
      return event;
    },
  });

  // Request handler - must be first middleware
  app.use(Sentry.Handlers.requestHandler());
  
  // Error handler - must be last
  app.use(Sentry.Handlers.errorHandler());

  console.log('✅ Sentry initialized for error tracking');
  console.log(`   Environment: ${process.env.NODE_ENV || 'production'}`);
  console.log(`   Trace sample rate: ${process.env.NODE_ENV === 'production' ? '10%' : '100%'}`);

  return true;
}

/**
 * Capture exception and send to Sentry
 */
export function captureException(error, context = {}) {
  Sentry.captureException(error, {
    tags: context,
  });
}

/**
 * Capture message and send to Sentry
 */
export function captureMessage(message, level = 'info', context = {}) {
  Sentry.captureMessage(message, {
    level,
    tags: context,
  });
}

export default Sentry;
