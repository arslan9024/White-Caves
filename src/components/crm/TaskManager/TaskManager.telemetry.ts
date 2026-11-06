// FILE: src/components/crm/TaskManager/TaskManager.telemetry.ts
/**
 * White Caves Real Estate LLC - TaskManager Real-Time State Attestations (Tier 9)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export interface TaskTelemetryEvent {
  eventId: string;
  eventType:
    | 'MOUNT'
    | 'STATUS_TRANSITION'
    | 'WORKBENCH_EXECUTE'
    | 'SLA_BREACH'
    | 'MERIT_XP_AWARD'
    | 'ERROR';
  taskId?: string;
  taskCode?: string;
  initialCount?: number;
  actorRole: string;
  timestamp: number;
  meta?: Record<string, any>;
}

class TaskTelemetryService {
  private queue: TaskTelemetryEvent[] = [];

  public track(
    eventType: TaskTelemetryEvent['eventType'],
    details: Partial<TaskTelemetryEvent> = {}
  ) {
    const event: TaskTelemetryEvent = {
      eventId: `tel-tsk-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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

  public getRecentEvents(): TaskTelemetryEvent[] {
    return [...this.queue].slice(-25);
  }

  public clear(): void {
    this.queue = [];
  }
}

export const TaskTelemetry = new TaskTelemetryService();
