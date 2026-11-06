// FILE: src/components/crm/BrokerManager/BrokerManager.telemetry.ts
/**
 * White Caves Real Estate LLC - Broker Manager Real-Time Telemetry
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export interface BrokerTelemetryEvent {
  event: 'commission_viewed' | 'lead_contacted' | 'rera_verified' | 'payout_requested';
  payload: Record<string, unknown>;
  timestamp: string;
}

const brokerAuditLedger: BrokerTelemetryEvent[] = [];

export function trackBrokerEvent(
  event: BrokerTelemetryEvent['event'],
  payload: Record<string, unknown> = {}
): void {
  const item: BrokerTelemetryEvent = {
    event,
    payload,
    timestamp: new Date().toISOString(),
  };
  brokerAuditLedger.push(item);

  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('aegis:telemetry:broker', { detail: item }));
    } catch {
      // Non-blocking telemetry
    }
  }
}

export function getBrokerAuditLedger(): BrokerTelemetryEvent[] {
  return [...brokerAuditLedger];
}
