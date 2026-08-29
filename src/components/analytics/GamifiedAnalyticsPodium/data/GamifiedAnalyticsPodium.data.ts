/**
 * GamifiedAnalyticsPodium.data.ts — Leaderboard, Sparkline & SLA Data
 */

export interface BrokerPodiumEntry {
  rank: 1 | 2 | 3;
  name: string;
  department: string;
  grossVolumeAED: string;
  dealsClosed: number;
  avatarUrl?: string;
}

export const TOP_BROKERS_PODIUM: BrokerPodiumEntry[] = [
  {
    rank: 1,
    name: 'Sophia Al-Mansoor',
    department: 'Luxury Sales',
    grossVolumeAED: 'AED 84.5M',
    dealsClosed: 14,
  },
  {
    rank: 2,
    name: 'Elena Rostova',
    department: 'Off-Plan Strategic',
    grossVolumeAED: 'AED 62.1M',
    dealsClosed: 11,
  },
  {
    rank: 3,
    name: 'Tariq Ben-Zayed',
    department: 'Commercial & Land',
    grossVolumeAED: 'AED 49.8M',
    dealsClosed: 8,
  },
];

export const MANAGER_SPARKLINES = [
  { dept: 'Sales', manager: 'Clara Vance', trend: [65, 72, 68, 85, 91, 88, 96], targetAchieved: '112%' },
  { dept: 'Off-Plan', manager: 'Marcus Sterling', trend: [45, 52, 60, 58, 70, 78, 84], targetAchieved: '104%' },
  { dept: 'Leasing', manager: 'Fatima Al-Nuaimi', trend: [88, 86, 92, 90, 94, 98, 102], targetAchieved: '128%' },
  { dept: 'Commercial', manager: 'Alexander Wright', trend: [30, 42, 55, 60, 62, 75, 89], targetAchieved: '98%' },
];
