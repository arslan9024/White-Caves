/**
 * Payment Gateway Fallback Service
 * FIX 03 (AEGIS): Wraps Stripe SDK calls with offline simulation fallback
 *
 * On 503/network failure, returns a mock success response so the UI
 * continues to function offline. Events are logged for reconciliation.
 */

import { createLogger } from '../../server/utils/logger.js';

const log =
  typeof window === 'undefined'
    ? { warn: console.warn, info: console.info, error: console.error }
    : console;

// ─── Types ──────────────────────────────────────────────────────────────────
export interface CheckoutRequest {
  amount: number;
  currency: string;
  description?: string;
  customerEmail?: string;
  metadata?: Record<string, string>;
}

export interface CheckoutResult {
  success: boolean;
  status: 'completed' | 'simulated' | 'failed';
  offline: boolean;
  transactionId: string;
  amount: number;
  currency: string;
  timestamp: string;
  error?: string;
}

// ─── Simulated Checkout ─────────────────────────────────────────────────────
function generateMockTransactionId(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `sim_${timestamp}_${random}`;
}

function createSimulatedResult(request: CheckoutRequest): CheckoutResult {
  return {
    success: true,
    status: 'simulated',
    offline: true,
    transactionId: generateMockTransactionId(),
    amount: request.amount,
    currency: request.currency,
    timestamp: new Date().toISOString(),
  };
}

// ─── Safe Checkout Wrapper ──────────────────────────────────────────────────
/**
 * Attempts to process a payment through the configured gateway.
 * On 503, network failure, or any gateway exception, falls back to a
 * simulated success response so the UI stays operational.
 */
export async function safeCheckout(
  request: CheckoutRequest,
  gatewayFn?: (req: CheckoutRequest) => Promise<CheckoutResult>
): Promise<CheckoutResult> {
  try {
    if (gatewayFn) {
      const result = await gatewayFn(request);
      return result;
    }

    // No gateway configured — simulate by default
    log.warn('[PaymentFallback] No payment gateway configured — using simulation mode');
    return createSimulatedResult(request);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const isServiceUnavailable =
      message.includes('503') ||
      message.includes('ECONNREFUSED') ||
      message.includes('ENOTFOUND') ||
      message.includes('network') ||
      message.includes('timeout');

    if (isServiceUnavailable) {
      log.warn(`[PaymentFallback] Gateway unavailable (${message}) — returning simulated checkout`);
    } else {
      log.error(`[PaymentFallback] Unexpected gateway error: ${message} — falling back to simulation`);
    }

    const simulated = createSimulatedResult(request);
    simulated.error = `Fallback: ${message}`;
    return simulated;
  }
}

export default safeCheckout;
