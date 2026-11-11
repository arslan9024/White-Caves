// FILE: src/components/crm/Leaderboard/Leaderboard.telemetry.ts
/**
 * White Caves Real Estate LLC - Leaderboard Real-Time State Attestations (Tier 9)
 * Standard: AEGIS Canonical 12-Way Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

export interface LeaderboardTelemetryEvent {
  eventId: string;
  eventType: 'MOUNT' | 'XP_AWARDED' | 'TIER_PROMOTION' | 'ENDORSEMENT' | 'ERROR';
  memberId?: string;
  initialCount?: number;
  actorRole: string;
  awardedXp?: number;
  timestamp: number;
  meta?: Record<string, any>;
}

class LeaderboardTelemetryService {
  private queue: LeaderboardTelemetryEvent[] = [];

  public track(
    eventType: LeaderboardTelemetryEvent['eventType'],
    details: Partial<LeaderboardTelemetryEvent> = {}
  ) {
    const event: LeaderboardTelemetryEvent = {
      eventId: `tel-ldr-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
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

  public getRecentEvents(): LeaderboardTelemetryEvent[] {
    return [...this.queue].slice(-25);
  }

  public clear(): void {
    this.queue = [];
  }
}

export const LeaderboardTelemetry = new LeaderboardTelemetryService();
