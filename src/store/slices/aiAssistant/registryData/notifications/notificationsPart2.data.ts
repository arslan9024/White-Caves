import type { Notification } from '../types';

export const getNotificationsPart2 = (now: number): Record<string, Notification[]> => ({
  zoe: [
    {
      id: 'n27',
      type: 'meeting',
      message: 'Meeting in 30 minutes',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 60000).toISOString(),
    },
    {
      id: 'n28',
      type: 'suggestion',
      message: '3 new executive suggestions pending review',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 1680000).toISOString(),
    },
  ],
  laila: [
    {
      id: 'n29',
      type: 'kyc',
      message: '4 KYC profiles pending review',
      severity: 'warning',
      isRead: false,
      timestamp: new Date(now - 1740000).toISOString(),
    },
  ],
  rex: [
    {
      id: 'n30',
      type: 'document',
      message: 'Title deed verification failed — Plot 44B',
      severity: 'critical',
      isRead: false,
      timestamp: new Date(now - 1800000).toISOString(),
    },
  ],
  evangeline: [
    {
      id: 'n31',
      type: 'legal',
      message: 'Contract clause flagged for review',
      severity: 'warning',
      isRead: false,
      timestamp: new Date(now - 1860000).toISOString(),
    },
  ],
  aurora: [
    {
      id: 'n32',
      type: 'system',
      message: 'API response time spike detected',
      severity: 'warning',
      isRead: false,
      timestamp: new Date(now - 1920000).toISOString(),
    },
  ],
  hazel: [
    {
      id: 'n33',
      type: 'ui',
      message: 'Accessibility audit complete — 2 issues found',
      severity: 'warning',
      isRead: false,
      timestamp: new Date(now - 1980000).toISOString(),
    },
  ],
  willow: [
    {
      id: 'n34',
      type: 'backend',
      message: 'Database query optimisation needed on /api/leads',
      severity: 'warning',
      isRead: false,
      timestamp: new Date(now - 2040000).toISOString(),
    },
  ],
  henry: [
    {
      id: 'n35',
      type: 'audit',
      message: 'SLA breach detected — lead response > 4 hours',
      severity: 'critical',
      isRead: false,
      timestamp: new Date(now - 2100000).toISOString(),
    },
  ],
  iris: [
    {
      id: 'n36',
      type: 'staging',
      message: 'Virtual staging complete — Unit 15C ready for listing',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 2160000).toISOString(),
    },
  ],
  cipher: [
    {
      id: 'n37',
      type: 'market',
      message: 'Price correction detected in Jumeirah Village Circle',
      severity: 'warning',
      isRead: false,
      timestamp: new Date(now - 2220000).toISOString(),
    },
  ],
  atlas: [
    {
      id: 'n38',
      type: 'intelligence',
      message: 'New off-plan project launch: Emaar Creek Views III',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 2280000).toISOString(),
    },
  ],
  echo: [
    {
      id: 'n39',
      type: 'communication',
      message: 'Client Ali Hassan — no contact in 14 days',
      severity: 'warning',
      isRead: false,
      timestamp: new Date(now - 2340000).toISOString(),
    },
  ],
  mira: [
    {
      id: 'n40',
      type: 'translation',
      message: 'Arabic SPA translation ready for review',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 2400000).toISOString(),
    },
  ],
  halo: [
    {
      id: 'n41',
      type: 'nps',
      message: 'NPS score dropped to 68 — below target of 70',
      severity: 'critical',
      isRead: false,
      timestamp: new Date(now - 2460000).toISOString(),
    },
  ],
  oracle: [
    {
      id: 'n42',
      type: 'market',
      message: 'Weekly market report published and ready',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 2520000).toISOString(),
    },
  ],
  flux: [
    {
      id: 'n43',
      type: 'data',
      message: 'DLD feed delay — last update 45 min ago',
      severity: 'warning',
      isRead: false,
      timestamp: new Date(now - 2580000).toISOString(),
    },
  ],
  nova: [
    {
      id: 'n44',
      type: 'offplan',
      message: 'New payment plan released: DAMAC Lagoons',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 2640000).toISOString(),
    },
  ],
  quill: [
    {
      id: 'n45',
      type: 'document',
      message: 'Bulk SPA generation queued — 8 documents',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 2700000).toISOString(),
    },
  ],
  lumen: [
    {
      id: 'n46',
      type: 'report',
      message: 'Q2 dashboard exported successfully',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 2760000).toISOString(),
    },
  ],
  crest: [
    {
      id: 'n47',
      type: 'valuation',
      message: 'Bulk valuation complete — 34 properties updated',
      severity: 'info',
      isRead: false,
      timestamp: new Date(now - 2820000).toISOString(),
    },
  ],
});
