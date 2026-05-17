import { logger } from '../../../../utils/logger.js';
import type { LindaCoreMode, LindaCoreClientContract } from '../contracts/lindaCore.types.js';

export interface LindaParitySnapshot {
  label: string;
  mode: LindaCoreMode;
  status: string;
  isConnected: boolean;
  queuedMessages: number;
  messagesSent: number;
  messagesReceived: number;
  reconnectAttempts: number;
  qrCodeAvailable: boolean;
}

export function buildLindaParitySnapshot(
  label: string,
  client: LindaCoreClientContract,
  mode: LindaCoreMode
): LindaParitySnapshot {
  const stats = client.getStats();
  return {
    label,
    mode,
    status: String(client.getStatus()),
    isConnected: client.isConnected(),
    queuedMessages: stats.queuedMessages,
    messagesSent: stats.messagesSent,
    messagesReceived: stats.messagesReceived,
    reconnectAttempts: stats.reconnectAttempts,
    qrCodeAvailable: Boolean(client.getQRCode()),
  };
}

export function emitLindaParitySnapshot(snapshot: LindaParitySnapshot): void {
  logger.info('[LindaShadowParity] snapshot', snapshot);
}

export function emitLindaParityDelta(
  label: string,
  baseline: LindaParitySnapshot,
  comparison: LindaParitySnapshot
): void {
  logger.info('[LindaShadowParity] delta', {
    label,
    baselineMode: baseline.mode,
    comparisonMode: comparison.mode,
    changed: {
      status: baseline.status !== comparison.status,
      isConnected: baseline.isConnected !== comparison.isConnected,
      queuedMessages: baseline.queuedMessages !== comparison.queuedMessages,
      messagesSent: baseline.messagesSent !== comparison.messagesSent,
      messagesReceived: baseline.messagesReceived !== comparison.messagesReceived,
      reconnectAttempts: baseline.reconnectAttempts !== comparison.reconnectAttempts,
      qrCodeAvailable: baseline.qrCodeAvailable !== comparison.qrCodeAvailable,
    },
    baseline,
    comparison,
  });
}
