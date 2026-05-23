import { logger } from '../../../../utils/logger.js';
import { getLindaClient, LindaStatus, type LindaConfig } from '../../lindaClient.js';
import type { LindaCoreClientContract, LindaCoreMode } from '../contracts/lindaCore.types.js';

const SUPPORTED_MODES = new Set<LindaCoreMode>(['legacy', 'shadow', 'active']);

function resolveMode(rawMode: string | undefined): LindaCoreMode {
  const normalized = (rawMode || 'legacy').toLowerCase() as LindaCoreMode;
  return SUPPORTED_MODES.has(normalized) ? normalized : 'legacy';
}

function applyModeObservability(mode: LindaCoreMode): void {
  if (mode === 'shadow') {
    logger.info('[LindaCoreAdapter] SHADOW mode enabled (legacy transport remains active)');
  }
  if (mode === 'active') {
    logger.info(
      '[LindaCoreAdapter] ACTIVE mode selected (currently mapped to legacy transport adapter)'
    );
  }
}

function shadowTrace(mode: LindaCoreMode, operation: string, meta?: unknown): void {
  if (mode !== 'shadow') return;
  logger.debug(`[LindaCoreAdapter] SHADOW operation: ${operation}`, meta);
}

class LindaModeAwareClient implements LindaCoreClientContract {
  constructor(
    private readonly baseClient: LindaCoreClientContract,
    private readonly mode: LindaCoreMode
  ) {}

  initialize(): Promise<void> {
    shadowTrace(this.mode, 'initialize');
    return this.baseClient.initialize();
  }

  sendMessage(phoneNumber: string, message: string): Promise<string> {
    shadowTrace(this.mode, 'sendMessage', { phoneNumber });
    return this.baseClient.sendMessage(phoneNumber, message);
  }

  broadcastMessage(
    phoneNumbers: string[],
    message: string
  ): Promise<Array<{ phone: string; messageId?: string; error?: string }>> {
    shadowTrace(this.mode, 'broadcastMessage', { recipients: phoneNumbers.length });
    return this.baseClient.broadcastMessage(phoneNumbers, message);
  }

  getMessageQueue() {
    shadowTrace(this.mode, 'getMessageQueue');
    return this.baseClient.getMessageQueue();
  }

  getConversations() {
    shadowTrace(this.mode, 'getConversations');
    return this.baseClient.getConversations();
  }

  getConversationHistory(phoneNumber: string, limit?: number) {
    shadowTrace(this.mode, 'getConversationHistory', { phoneNumber, limit });
    return this.baseClient.getConversationHistory(phoneNumber, limit);
  }

  getQRCode() {
    shadowTrace(this.mode, 'getQRCode');
    return this.baseClient.getQRCode();
  }

  disconnect(): Promise<void> {
    shadowTrace(this.mode, 'disconnect');
    return this.baseClient.disconnect();
  }

  getStatus() {
    return this.baseClient.getStatus();
  }

  isConnected() {
    return this.baseClient.isConnected();
  }

  getStats() {
    return this.baseClient.getStats();
  }
}

export function getLindaCoreMode(): LindaCoreMode {
  return resolveMode(process.env.LINDA_CORE_MODE);
}

export function getLindaClientForMode(config?: LindaConfig): LindaCoreClientContract {
  const mode = getLindaCoreMode();
  applyModeObservability(mode);

  // W5-001 scaffold: all modes currently route to the existing Linda singleton.
  // W5-002/W5-003 will replace this with imported core + compatibility bridges.
  const baseClient = getLindaClient(config) as unknown as LindaCoreClientContract;
  return new LindaModeAwareClient(baseClient, mode);
}

export { LindaStatus };
