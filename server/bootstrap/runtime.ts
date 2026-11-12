import { createServer } from 'http';
import { RealtimeService } from '../websocket/realtimeService.js';

export interface ServerRuntime {
  dbInitPromise: Promise<void> | null;
  httpServer: ReturnType<typeof createServer> | null;
  realtimeService: RealtimeService | null;
}
