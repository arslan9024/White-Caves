/** LeadScoreBadge.logic.ts — Logic Layer */
export type ScoreLevel = 'S' | 'A' | 'B' | 'C' | 'D';

export function getScoreLevel(score: number): ScoreLevel {
  if (score >= 90) return 'S';
  if (score >= 75) return 'A';
  if (score >= 55) return 'B';
  if (score >= 35) return 'C';
  return 'D';
}

export function getScoreColor(level: ScoreLevel): string {
  return { S: '#ef4444', A: '#f97316', B: '#eab308', C: '#3b82f6', D: '#94a3b8' }[level];
}

export function getScoreLabel(level: ScoreLevel): string {
  return { S: 'Super Hot', A: 'High Intent', B: 'Warm', C: 'Lukewarm', D: 'Cold' }[level];
}
