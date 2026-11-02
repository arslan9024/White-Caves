import type { Notification } from '../../types';

export const getNotificationsPart1 = (now: number): Record<string, Notification[]> => ({
  nadia: [
    {
      id: 'n1',
      type: 'lead',
      message: 'New lead from WhatsApp',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 120000).toISOString(),
    },
    {
      id: 'n2',
      type: 'task',
      message: 'Agent quota exceeded',
      severity: 'warning',
      isRead: false,
      timestamp: new Date(now - 300000).toISOString(),
    },
  ],
  nina: [
    {
      id: 'n3',
      type: 'bot',
      message: 'Bot session expired',
      severity: 'warning',
      isRead: false,
      timestamp: new Date(now - 360000).toISOString(),
    },
    {
      id: 'n4',
      type: 'flow',
      message: 'New NLP intent detected — update flow',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 720000).toISOString(),
    },
  ],
  linda: [
    {
      id: 'n5',
      type: 'session',
      message: 'OpenClaw gateway reconnected on agent_07',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 480000).toISOString(),
    },
    {
      id: 'n6',
      type: 'session',
      message: 'QR code scan required for agent_03',
      severity: 'warning',
      isRead: false,
      timestamp: new Date(now - 900000).toISOString(),
    },
  ],
  mary: [
    {
      id: 'n7',
      type: 'inventory',
      message: 'Excel import completed — 23 new units added',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 540000).toISOString(),
    },
  ],
  nancy: [
    {
      id: 'n8',
      type: 'hr',
      message: 'Performance review due for 3 agents',
      severity: 'warning',
      isRead: false,
      timestamp: new Date(now - 600000).toISOString(),
    },
  ],
  daisy: [
    {
      id: 'n9',
      type: 'lease',
      message: '5 leases expiring within 30 days',
      severity: 'warning',
      isRead: false,
      timestamp: new Date(now - 660000).toISOString(),
    },
  ],
  sentinel: [
    {
      id: 'n10',
      type: 'maintenance',
      message: 'HVAC fault detected — Unit 302',
      severity: 'critical',
      isRead: false,
      timestamp: new Date(now - 420000).toISOString(),
    },
  ],
  vesta: [
    {
      id: 'n11',
      type: 'construction',
      message: 'Snagging report submitted for Phase 3',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 780000).toISOString(),
    },
  ],
  juno: [
    {
      id: 'n12',
      type: 'facilities',
      message: 'Energy usage 12% above baseline — Building 7',
      severity: 'warning',
      isRead: false,
      timestamp: new Date(now - 840000).toISOString(),
    },
  ],
  clara: [
    {
      id: 'n13',
      type: 'lead',
      message: 'Lead requires follow-up',
      severity: 'warning',
      isRead: false,
      timestamp: new Date(now - 180000).toISOString(),
    },
    {
      id: 'n14',
      type: 'lead',
      message: '3 leads stagnant for 7+ days',
      severity: 'critical',
      isRead: false,
      timestamp: new Date(now - 960000).toISOString(),
    },
  ],
  sophia: [
    {
      id: 'n15',
      type: 'deal',
      message: 'Deal awaiting approval',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 420000).toISOString(),
    },
    {
      id: 'n16',
      type: 'pipeline',
      message: 'Monthly target at 72% — 8 days remaining',
      severity: 'warning',
      isRead: false,
      timestamp: new Date(now - 1080000).toISOString(),
    },
  ],
  hunter: [
    {
      id: 'n17',
      type: 'prospects',
      message: '18 new high-value prospects identified',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 1140000).toISOString(),
    },
  ],
  archer: [
    {
      id: 'n18',
      type: 'scoring',
      message: '5 leads scored above 90 — review now',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 1200000).toISOString(),
    },
  ],
  prism: [
    {
      id: 'n19',
      type: 'matching',
      message: 'New high-match properties available for 4 clients',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 1260000).toISOString(),
    },
  ],
  kairos: [
    {
      id: 'n20',
      type: 'vip',
      message: 'VIP client Sheikh Mansoor enquiry received',
      severity: 'critical',
      isRead: false,
      timestamp: new Date(now - 1320000).toISOString(),
    },
  ],
  theodora: [
    {
      id: 'n21',
      type: 'payment',
      message: 'Invoice overdue',
      severity: 'critical',
      isRead: false,
      timestamp: new Date(now - 240000).toISOString(),
    },
    {
      id: 'n22',
      type: 'finance',
      message: 'Monthly reconciliation due in 2 days',
      severity: 'warning',
      isRead: false,
      timestamp: new Date(now - 1380000).toISOString(),
    },
  ],
  maven: [
    {
      id: 'n23',
      type: 'portfolio',
      message: 'Portfolio yield dropped 0.3% — review assets',
      severity: 'warning',
      isRead: false,
      timestamp: new Date(now - 1440000).toISOString(),
    },
  ],
  sage: [
    {
      id: 'n24',
      type: 'finance',
      message: 'EIBOR rate updated — recalculate 3 pending mortgages',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 1500000).toISOString(),
    },
  ],
  olivia: [
    {
      id: 'n25',
      type: 'campaign',
      message: 'Summer campaign click-through rate up 18%',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 1560000).toISOString(),
    },
  ],
  apex: [
    {
      id: 'n26',
      type: 'performance',
      message: '2 agents below KPI threshold this week',
      severity: 'warning',
      isRead: false,
      timestamp: new Date(now - 1620000).toISOString(),
    },
  ],
});
