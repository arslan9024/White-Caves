import type { Express, RequestHandler } from 'express';

const unavailable: RequestHandler = (_req, res) => {
  res.status(501).json({
    success: false,
    error: 'SERVICE_BOOKING_NOT_CONFIGURED',
    message: 'Service booking persistence is not configured in this deployment.',
  });
};

export function mountBookings(app: Express): void {
  app.post('/api/services/book', unavailable);
  app.get('/api/services/:bookingId/status', unavailable);
  app.get('/api/customers/:customerId/services', unavailable);
}
