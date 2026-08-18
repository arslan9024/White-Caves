/** PipelineVelocityGauge.logic.ts */
export interface StageVelocity { stage: string; avgDays: number; target: number; color: string; }

export const STAGE_VELOCITIES: StageVelocity[] = [
  { stage: 'New → Contacted', avgDays: 1.2, target: 1, color: '#ef4444' },
  { stage: 'Contacted → Viewing', avgDays: 4.8, target: 5, color: '#f97316' },
  { stage: 'Viewing → Offer', avgDays: 7.3, target: 7, color: '#eab308' },
  { stage: 'Offer → Closed', avgDays: 18.5, target: 14, color: '#3b82f6' },
];

export function calcVelocityPct(avgDays: number, target: number): number {
  return Math.min(100, Math.round((target / avgDays) * 100));
}

export function isOnTarget(avgDays: number, target: number): boolean {
  return avgDays <= target * 1.2;
}
