// FILE: src/components/crm/TenantManager/TenantManager.telemetry.ts
/**
 * White Caves Real Estate LLC - Tenant Manager Real-Time Telemetry
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export interface TenantTelemetryEvent {
  event: 'lease_signed' | 'payment_viewed' | 'ticket_created' | 'snag_resolved';
  payload: Record<string, unknown>;
  timestamp: string;
}

const tenantAuditLog: TenantTelemetryEvent[] = [];

export function trackTenantEvent(
  event: TenantTelemetryEvent['event'],
  payload: Record<string, unknown> = {}
): void {
  const item: TenantTelemetryEvent = {
    event,
    payload,
    timestamp: new Date().toISOString(),
  };
  tenantAuditLog.push(item);

  if (typeof window !== 'undefined') {
    try {
      window.dispatchEvent(new CustomEvent('aegis:telemetry:tenant', { detail: item }));
    } catch {
      // Non-blocking telemetry
    }
  }
}

export function getTenantAuditLog(): TenantTelemetryEvent[] {
  return [...tenantAuditLog];
}
