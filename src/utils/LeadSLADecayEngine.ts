export interface LeadSLADecayResult {
  elapsedMinutes: number;
  decayPercentage: number; // 0 to 100%
  remainingValueScore: number; // 0 to 100
  status: 'EXCELLENT' | 'WARNING' | 'CRITICAL' | 'EXPIRED_ESCALATED';
  colorToken: string;
  recommendedAction: string;
}

/**
 * Calculates lead value decay based on elapsed response time since webhook ingestion.
 * Hardcoded to 15-minute SLA gate contract for White Caves CRM.
 */
export function calculateLeadSLADecay(ingestionTimestamp: string | Date, currentTimestamp: string | Date = new Date()): LeadSLADecayResult {
  const start = typeof ingestionTimestamp === 'string' ? new Date(ingestionTimestamp).getTime() : ingestionTimestamp.getTime();
  const end = typeof currentTimestamp === 'string' ? new Date(currentTimestamp).getTime() : currentTimestamp.getTime();

  const elapsedMs = Math.max(0, end - start);
  const elapsedMinutes = Math.floor(elapsedMs / (1000 * 60));

  if (elapsedMinutes <= 15) {
    const decayPercentage = Math.round((elapsedMinutes / 15) * 20); // 0-20% decay
    return {
      elapsedMinutes,
      decayPercentage,
      remainingValueScore: 100 - decayPercentage,
      status: 'EXCELLENT',
      colorToken: 'var(--wc-success, #16A34A)',
      recommendedAction: 'Broker first contact inside optimal 15-min window',
    };
  } else if (elapsedMinutes <= 30) {
    const decayPercentage = 20 + Math.round(((elapsedMinutes - 15) / 15) * 40); // 20-60% decay
    return {
      elapsedMinutes,
      decayPercentage,
      remainingValueScore: 100 - decayPercentage,
      status: 'WARNING',
      colorToken: 'var(--wc-warning, #D97706)',
      recommendedAction: 'Warning: 15-min SLA threshold exceeded. Urgent broker outreach required.',
    };
  } else if (elapsedMinutes <= 60) {
    const decayPercentage = 60 + Math.round(((elapsedMinutes - 30) / 30) * 30); // 60-90% decay
    return {
      elapsedMinutes,
      decayPercentage,
      remainingValueScore: 100 - decayPercentage,
      status: 'CRITICAL',
      colorToken: 'var(--wc-red-primary, #EF4444)',
      recommendedAction: 'Critical SLA failure: Contact conversion probability dropped by 70%.',
    };
  } else {
    return {
      elapsedMinutes,
      decayPercentage: 95,
      remainingValueScore: 5,
      status: 'EXPIRED_ESCALATED',
      colorToken: 'var(--wc-red-primary, #EF4444)',
      recommendedAction: 'SLA Expired: Lead auto-escalated to Department Manager for immediate reassignment.',
    };
  }
}
