/**
 * VrHeatmapService.ts — GOAL-009
 * Client spatial engagement heatmap telemetry collector.
 * Tracks which rooms / hotspots receive the most attention
 * and exposes aggregated heat-zone data for display.
 */

export interface HeatPoint {
  roomId: string;
  roomName: string;
  x: number; // 0-100 relative %
  y: number; // 0-100 relative %
  intensity: number; // 0-1
  visits: number;
  totalDwellMs: number;
}

export interface HeatmapSession {
  sessionId: string;
  propertyId: string;
  startedAt: number;
  points: HeatPoint[];
}

class VrHeatmapServiceClass {
  private session: HeatmapSession | null = null;
  private activeRoom: string = '';
  private roomEnteredAt: number = 0;
  private points: Map<string, HeatPoint> = new Map();

  // ── Session management ────────────────────────────────────────────────────
  startSession(propertyId: string): string {
    const sessionId = `hm-${propertyId}-${Date.now()}`;
    this.session = {
      sessionId,
      propertyId,
      startedAt: Date.now(),
      points: [],
    };
    this.points.clear();
    return sessionId;
  }

  endSession(): HeatmapSession | null {
    if (!this.session) return null;
    if (this.activeRoom) this._flushActiveRoom();
    this.session.points = Array.from(this.points.values());
    const s = { ...this.session };
    this.session = null;
    return s;
  }

  // ── Room tracking ─────────────────────────────────────────────────────────
  enterRoom(roomId: string, roomName: string): void {
    if (this.activeRoom && this.activeRoom !== roomId) {
      this._flushActiveRoom();
    }
    this.activeRoom = roomId;
    this.roomEnteredAt = Date.now();
    const existing = this.points.get(roomId);
    if (!existing) {
      this.points.set(roomId, {
        roomId, roomName, x: 50, y: 50, intensity: 0, visits: 0, totalDwellMs: 0,
      });
    }
  }

  trackHotspot(roomId: string, x: number, y: number): void {
    const pt = this.points.get(roomId);
    if (!pt) return;
    // Weighted average position
    pt.x = pt.x * 0.7 + x * 0.3;
    pt.y = pt.y * 0.7 + y * 0.3;
    pt.intensity = Math.min(1, pt.intensity + 0.05);
  }

  private _flushActiveRoom(): void {
    const pt = this.points.get(this.activeRoom);
    if (!pt) return;
    const dwellMs = Date.now() - this.roomEnteredAt;
    pt.visits += 1;
    pt.totalDwellMs += dwellMs;
    pt.intensity = Math.min(1, pt.intensity + dwellMs / 60_000);
  }

  // ── Analytics ─────────────────────────────────────────────────────────────
  getHeatmap(): HeatPoint[] {
    return Array.from(this.points.values()).sort((a, b) => b.intensity - a.intensity);
  }

  getMostEngagedRoom(): HeatPoint | null {
    const sorted = this.getHeatmap();
    return sorted[0] ?? null;
  }

  getEngagementSummary(): {
    totalRoomsVisited: number;
    totalSessionDurationMs: number;
    topRoom: string;
    averageDwellMs: number;
  } {
    const points = this.getHeatmap();
    const total = points.reduce((acc, p) => acc + p.totalDwellMs, 0);
    const avgDwell = points.length ? total / points.length : 0;
    return {
      totalRoomsVisited: points.filter(p => p.visits > 0).length,
      totalSessionDurationMs: this.session ? Date.now() - this.session.startedAt : 0,
      topRoom: points[0]?.roomName ?? 'N/A',
      averageDwellMs: Math.round(avgDwell),
    };
  }

  // ── Heat color helper ─────────────────────────────────────────────────────
  intensityToColor(intensity: number): string {
    const r = Math.round(239 * intensity + 30 * (1 - intensity));
    const g = Math.round(68 * (1 - intensity) + 68 * intensity);
    const b = Math.round(68 * (1 - intensity));
    return `rgba(${r},${g},${b},${0.3 + intensity * 0.5})`;
  }
}

export const VrHeatmapService = new VrHeatmapServiceClass();
export default VrHeatmapService;
