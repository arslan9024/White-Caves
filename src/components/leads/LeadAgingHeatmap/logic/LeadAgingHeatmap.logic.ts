/** LeadAgingHeatmap.logic.ts */
export interface AgingLead { id: string; name: string; stage: string; daysSince: number; agent: string; }

export function getAgingColor(days: number): string {
  if (days <= 3) return '#22c55e';
  if (days <= 7) return '#eab308';
  if (days <= 14) return '#f97316';
  return '#ef4444';
}

export function getAgingLabel(days: number): string {
  if (days <= 3) return 'Fresh';
  if (days <= 7) return 'Warm';
  if (days <= 14) return 'Cooling';
  return 'Cold';
}

export const AGING_LEADS: AgingLead[] = [
  { id: 'l1', name: 'Ahmed Al Mansouri', stage: 'Viewing', daysSince: 1, agent: 'SJ' },
  { id: 'l2', name: 'Sarah Williams', stage: 'Contacted', daysSince: 5, agent: 'MK' },
  { id: 'l3', name: 'Rajiv Sharma', stage: 'New', daysSince: 9, agent: 'SJ' },
  { id: 'l4', name: 'Emma Johnson', stage: 'Offer', daysSince: 2, agent: 'NA' },
  { id: 'l5', name: 'Wang Wei', stage: 'Contacted', daysSince: 18, agent: 'MK' },
  { id: 'l6', name: 'Fatima Al Zahra', stage: 'New', daysSince: 12, agent: 'SJ' },
  { id: 'l7', name: 'Ivan Petrov', stage: 'Viewing', daysSince: 0, agent: 'NA' },
  { id: 'l8', name: 'Mei Ling', stage: 'New', daysSince: 22, agent: 'MK' },
];
