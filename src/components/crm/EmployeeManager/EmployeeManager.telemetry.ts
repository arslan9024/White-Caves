// FILE: src/components/crm/EmployeeManager/EmployeeManager.telemetry.ts
/**
 * White Caves Real Estate LLC - EmployeeManager Real-Time State Attestations (Tier 9)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export interface EmployeeTelemetryEvent {
  eventId: string;
  eventType: 'MOUNT' | 'HIRE' | 'UPDATE' | 'ROLE_ROTATION' | 'MERIT_XP_AWARD' | 'ERROR';
  employeeCode?: string;
  initialCount?: number;
  actorRole: string;
  timestamp: number;
  meta?: Record<string, any>;
}

class EmployeeTelemetryService {
  private queue: EmployeeTelemetryEvent[] = [];

  public track(
    eventType: EmployeeTelemetryEvent['eventType'],
    details: Partial<EmployeeTelemetryEvent> = {}
  ) {
    const event: EmployeeTelemetryEvent = {
      eventId: `tel-emp-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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

  public getRecentEvents(): EmployeeTelemetryEvent[] {
    return [...this.queue].slice(-25);
  }

  public clear(): void {
    this.queue = [];
  }
}

export const EmployeeTelemetry = new EmployeeTelemetryService();
