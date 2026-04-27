/**
 * useLeadsInsights Hook
 * =====================
 * Memoized derived analytics from leads data.
 * Extracted from InsightsTab.tsx for reusability across CRM tabs.
 */

import { useMemo } from 'react';
import type { Lead } from './useLeadsData';

export interface LeadsInsights {
  /** % of total leads that are qualified (0–100) */
  qualifiedPercentage: number;
  /** Average deal size among qualified leads */
  avgDealSize: number;
  /** Count of leads grouped by company type */
  leadsByType: Record<string, number>;
  /** Count of leads grouped by company size */
  leadsBySize: Record<string, number>;
}

interface LeadsStats {
  qualifiedLeads: number;
  totalValue: number;
}

/**
 * Computes memoized insights derived from leads + stats.
 * Previously computed inline on every render in InsightsTab.
 */
export function useLeadsInsights(
  leads: Lead[],
  stats: LeadsStats,
): LeadsInsights {
  return useMemo(() => {
    const qualifiedPercentage =
      leads.length > 0
        ? Math.round((stats.qualifiedLeads / leads.length) * 100)
        : 0;

    const avgDealSize =
      stats.qualifiedLeads > 0
        ? Math.round(stats.totalValue / stats.qualifiedLeads)
        : 0;

    const leadsByType = leads.reduce<Record<string, number>>((acc, lead) => {
      acc[lead.type] = (acc[lead.type] || 0) + 1;
      return acc;
    }, {});

    const leadsBySize = leads.reduce<Record<string, number>>((acc, lead) => {
      acc[lead.size] = (acc[lead.size] || 0) + 1;
      return acc;
    }, {});

    return { qualifiedPercentage, avgDealSize, leadsByType, leadsBySize };
  }, [leads, stats]);
}
