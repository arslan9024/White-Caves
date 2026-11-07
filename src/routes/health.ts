import { Router, Request, Response } from 'express';

const router = Router();

// Simple health check – returns status of critical services
router.get('/', async (_req: Request, res: Response) => {
  // In a real implementation you would check DB, cache, external APIs etc.
  const health = {
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    status: 'ok',
  };
  res.json(health);
});

export default router;
