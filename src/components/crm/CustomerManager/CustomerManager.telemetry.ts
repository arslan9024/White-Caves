// FILE: src/components/crm/CustomerManager/CustomerManager.telemetry.ts
/**
 * White Caves Real Estate LLC - CustomerManager Real-Time State Attestations (Tier 9)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export interface CustomerTelemetryEvent {
  eventId: string;
  eventType:
    | 'MOUNT'
    | 'STAGE_ADVANCE'
    | 'REGISTER'
    | 'INTERACTION_LOGGED'
    | 'KYC_AML_VERIFIED'
    | 'ERROR';
  customerId?: string;
  customerCode?: string;
  initialCount?: number;
  actorRole: string;
  timestamp: number;
  meta?: Record<string, any>;
}

class CustomerTelemetryService {
  private queue: CustomerTelemetryEvent[] = [];

  public track(
    eventType: CustomerTelemetryEvent['eventType'],
    details: Partial<CustomerTelemetryEvent> = {}
  ) {
    const event: CustomerTelemetryEvent = {
      eventId: `tel-cust-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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

  public getRecentEvents(): CustomerTelemetryEvent[] {
    return [...this.queue].slice(-25);
  }

  public clear(): void {
    this.queue = [];
  }
}

export const CustomerTelemetry = new CustomerTelemetryService();
