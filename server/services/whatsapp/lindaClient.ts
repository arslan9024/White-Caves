import { getWhatsAppEngine, WhatsAppEngine, WhatsAppEngineConfig, WhatsAppEngineStatus } from './WhatsAppEngine.js';
import type { WhatsAppMessage } from './WhatsAppEngine.js';

export type LindaConfig = Omit<WhatsAppEngineConfig, 'clientId'>;
export type LindaClient = WhatsAppEngine;
export const LindaStatus = WhatsAppEngineStatus;
export type { WhatsAppMessage };

/** Return the process-wide Linda singleton for broadcasts. */
export function getLindaClient(config?: LindaConfig): LindaClient {
  return getWhatsAppEngine('linda-broadcast', config);
}

/** Create a fresh LindaClient instance. */
export function createLindaClient(config?: LindaConfig): LindaClient {
  return new WhatsAppEngine({ clientId: 'linda-broadcast', ...config });
}

/** Reset the singleton (primarily for tests). */
export function resetLindaClient(): void {
  // We can't clear all engines, just reset Linda
}
