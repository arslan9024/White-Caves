import {
  getLindaClientForMode,
  getLindaCoreMode,
} from '../../services/whatsapp/linda-core/adapters/LindaCoreAdapter.js';
import { LindaSessionBridge } from '../../services/whatsapp/linda-core/bridge/LindaSessionBridge.js';
import { LindaMessageBridge } from '../../services/whatsapp/linda-core/bridge/LindaMessageBridge.js';
import {
  buildLindaParitySnapshot,
  emitLindaParitySnapshot,
} from '../../services/whatsapp/linda-core/bridge/shadowParityReporter.js';
import { prisma } from '../../database.js';

export const db = prisma as any;

export function applyTemplate(
  messageTemplate: string,
  templateVars?: Record<string, unknown> | null
): string {
  if (!templateVars || typeof templateVars !== 'object') return messageTemplate;
  let rendered = messageTemplate;
  for (const [key, value] of Object.entries(templateVars)) {
    rendered = rendered.split(`{{${key}}}`).join(String(value));
  }
  return rendered;
}

export async function getOrInitLindaRuntime() {
  const mode = getLindaCoreMode();
  const linda = getLindaClientForMode({
    sessionPath: process.env.LINDA_SESSIONS_PATH || './.linda-sessions',
    headless: process.env.LINDA_HEADLESS !== 'false',
    autoRestart: true,
  });

  const sessionBridge = new LindaSessionBridge(linda, mode);
  const messageBridge = new LindaMessageBridge(linda, mode);

  if (mode === 'shadow') {
    const snapshot = buildLindaParitySnapshot('route_get_or_init', linda, mode);
    emitLindaParitySnapshot(snapshot);
  }

  return { linda, mode, sessionBridge, messageBridge };
}

export const VIEWING_KEYS = ['viewing_agreement', 'key_handover'];
export const OFFER_KEYS = ['offer_letter', 'booking_form', 'tenancy_contract', 'gov_employee_booking'];

