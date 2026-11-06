// FILE: src/components/crm/DealManager/DealManager.telemetry.ts
/**
 * White Caves Real Estate LLC - DealManager Real-Time State Attestations (Tier 9)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export interface DealTelemetryEvent {
  eventId: string;
  eventType: 'MOUNT' | 'STAGE_ADVANCE' | 'CREATE' | 'ESCROW_AUDIT' | 'VAT_INVOICE' | 'ERROR';
  dealId?: string;
  dealNumber?: string;
  actorRole: string;
  valueAED?: number;
  timestamp: number;
  meta?: Record<string, any>;
}

class DealTelemetryService {
  private queue: DealTelemetryEvent[] = [];

  public track(
    eventType: DealTelemetryEvent['eventType'],
    details: Partial<DealTelemetryEvent> = {}
  ) {
    const event: DealTelemetryEvent = {
      eventId: `tel-deal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      eventType,
      actorRole: details.actorRole || 'MANAGING_DIRECTOR',
      timestamp: Date.now(),
      ...details,
    };

    this.queue.push(event);

    // Non-blocking off-thread event emission for Right Sidebar AEGIS Stream
    if (typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('whitecaves:telemetry', {
          detail: event,
        })
      );
    }
  }

  public getRecentEvents(): DealTelemetryEvent[] {
    return [...this.queue].slice(-25);
  }

  public clear(): void {
    this.queue = [];
  }
}

export const DealTelemetry = new DealTelemetryService();
export default DealTelemetry;
