export type LindaViewTab = 'all' | 'terminal' | 'sessions' | 'outreach' | 'conversations';

export interface LindaMetricsState {
  uptime: string;
  activeSessions: string;
  rateLimit: string;
  memory: string;
  conversionVelocity: string;
  antiBanSafetyScore: string;
}

export type {
  LindaSessionItem,
  LindaCampaignItem,
  LindaFeatureBadge,
  LindaPlaybookBadge,
  LindaOutreachOwnerRow,
  LindaConversationItem,
  LindaPillarItem,
} from './LindaWhatsAppCRM.data';
