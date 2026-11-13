import type { useBotData } from '../../hooks/useBotData';

export interface Bot {
  id: string;
  name: string;
  number: string;
  status: string;
  lastActive: string;
  qrCode: string | null;
  pairingCode: string;
  messagesProcessed: number;
  responseRate: number;
  avgResponseTime: string;
  uptime: string;
  features: string[];
}

export type SessionsData = ReturnType<typeof useBotData>;

export interface SessionsTabProps {
  data: SessionsData;
}
