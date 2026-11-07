// turingServer.ts
// Minimal HTTP server exposing health and metrics endpoints.
// No external dependencies – uses Node's built‑in http module.

import http from 'http';
import { getMetrics } from './turingMetrics';
import { logger } from './turingLogger';

const PORT = process.env.TURING_ORCHESTRATOR_PORT ?? '3000';

const requestListener = (req: http.IncomingMessage, res: http.ServerResponse) => {
  const url = req.url ?? '/';
  if (url === '/metrics') {
    const metrics = getMetrics();
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end(metrics);
    logger.info('Served /metrics');
  } else if (url === '/health') {
    const health = JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() });
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(health);
    logger.info('Served /health');
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  }
};

const server = http.createServer(requestListener);

server.listen(parseInt(PORT, 10), () => {
  logger.info(`Turing Orchestrator HTTP server listening on port ${PORT}`);
});

export { server };

