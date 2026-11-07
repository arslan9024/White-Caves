import { Router, Request, Response } from 'express';
import client from 'prom-client';

const router = Router();

// Register default metrics collection (process, CPU, memory, etc.)
client.collectDefaultMetrics();

router.get('/', async (_req: Request, res: Response) => {
  try {
    const metrics = await client.register.metrics();
    res.set('Content-Type', client.register.contentType);
    res.send(metrics);
  } catch (err) {
    res.status(500).send('Could not collect metrics');
  }
});

export default router;
