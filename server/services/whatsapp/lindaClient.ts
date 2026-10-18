import { getWhatsAppEngine, WhatsAppEngine, WhatsAppEngineConfig, WhatsAppEngineStatus } from './WhatsAppEngine.js';
import type { WhatsAppMessage } from './WhatsAppEngine.js';

export type LindaConfig = Omit<WhatsAppEngineConfig, 'clientId'>;
export { WhatsAppEngine as LindaClient, WhatsAppEngineStatus as LindaStatus };
export type { WhatsAppMessage };

/** Return the process-wide Linda singleton for broadcasts. */
export function getLindaClient(config?: LindaConfig): WhatsAppEngine {
  return getWhatsAppEngine('linda-broadcast', config);
}

/** Create a fresh LindaClient instance. */
export function createLindaClient(config?: LindaConfig): WhatsAppEngine {
  return new WhatsAppEngine({ clientId: 'linda-broadcast', ...config });
}

/** Reset the singleton (primarily for tests). */
export function resetLindaClient(): void {
  // We can't clear all engines, just reset Linda
}
