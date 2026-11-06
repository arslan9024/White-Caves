// FILE: src/components/crm/DocumentManager/DocumentManager.telemetry.ts
/**
 * White Caves Real Estate LLC - DocumentManager Real-Time State Attestations (Tier 9)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export interface DocumentTelemetryEvent {
  eventId: string;
  eventType: 'MOUNT' | 'UPLOAD' | 'OCR_VERIFIED' | 'DLD_HANDSHAKE' | 'EJARI_REGISTERED' | 'ERROR';
  docId?: string;
  docCode?: string;
  initialCount?: number;
  actorRole: string;
  timestamp: number;
  meta?: Record<string, any>;
}

class DocumentTelemetryService {
  private queue: DocumentTelemetryEvent[] = [];

  public track(
    eventType: DocumentTelemetryEvent['eventType'],
    details: Partial<DocumentTelemetryEvent> = {}
  ) {
    const event: DocumentTelemetryEvent = {
      eventId: `tel-doc-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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

  public getRecentEvents(): DocumentTelemetryEvent[] {
    return [...this.queue].slice(-25);
  }

  public clear(): void {
    this.queue = [];
  }
}

export const DocumentTelemetry = new DocumentTelemetryService();
