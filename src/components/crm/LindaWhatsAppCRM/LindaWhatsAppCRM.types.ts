export type LindaViewTab = 'all' | 'terminal' | 'sessions' | 'outreach' | 'conversations';

export interface LindaMetricsState {
  uptime: string;
  activeSessions: string;
  rateLimit: string;
  memory: string;
  conversionVelocity: string;
  antiBanSafetyScore: string;
}
