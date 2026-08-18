/** LeadSourceAttributionChart.logic.ts */
export interface SourceData { label: string; count: number; color: string; }
export const SOURCE_DATA: SourceData[] = [
  { label: 'PropertyFinder', count: 142, color: '#ef4444' },
  { label: 'Bayut', count: 98, color: '#f97316' },
  { label: 'WhatsApp', count: 76, color: '#22c55e' },
  { label: 'Referral', count: 54, color: '#3b82f6' },
  { label: 'Walk-in', count: 32, color: '#8b5cf6' },
  { label: 'Cold Call', count: 18, color: '#94a3b8' },
];
export function calcPercent(count: number, total: number): number {
  return Math.round((count / total) * 100);
}
