import { logger } from '../../../../utils/logger.js';
import type { LindaCoreClientContract, LindaCoreMode } from '../contracts/lindaCore.types.js';

export interface LindaSessionSnapshot {
  status: ReturnType<LindaCoreClientContract['getStatus']>;
  isConnected: boolean;
  stats: ReturnType<LindaCoreClientContract['getStats']>;
  qrCodeAvailable: boolean;
  mode: LindaCoreMode;
}

export class LindaSessionBridge {
  constructor(
    private readonly client: LindaCoreClientContract,
    private readonly mode: LindaCoreMode
  ) {}

  async ensureInitialized(): Promise<void> {
    await this.client.initialize();
  }

  async disconnect(): Promise<void> {
    await this.client.disconnect();
  }

  getSnapshot(): LindaSessionSnapshot {
    const stats = this.client.getStats();
    return {
      status: this.client.getStatus(),
      isConnected: this.client.isConnected(),
      stats,
      qrCodeAvailable: Boolean(this.client.getQRCode()),
      mode: this.mode,
    };
  }

  traceSnapshot(label = 'session_snapshot'): LindaSessionSnapshot {
    const snapshot = this.getSnapshot();
    if (this.mode === 'shadow') {
      logger.debug(`[LindaSessionBridge] ${label}`, snapshot);
    }
    return snapshot;
  }
}
