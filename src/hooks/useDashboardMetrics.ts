import React from 'react';
import { useMemo } from 'react';
import type { KpiCardData } from '../components/dashboard/DashboardKpiStrip';

/**
 * useKPIMetrics
 * Calculates and formats KPI card data from dashboard metrics
 */
export function useKPIMetrics(data: {
  propertiesCount: number;
  leadsCount: number;
  hotLeadsCount: number;
  monthlyRevenue: number;
  agentsCount: number;
  contractsCount: number;
}): KpiCardData[] {
  return useMemo(() => {
    const formatCompactNumber = (value: number): string =>
      new Intl.NumberFormat('en', { notation: value >= 1000 ? 'compact' : 'standard' }).format(
        value
      );

    const formatCurrency = (value: number): string =>
      new Intl.NumberFormat('en-AE', {
        style: 'currency',
        currency: 'AED',
        maximumFractionDigits: 0,
      }).format(value);

    return [
      {
        id: 'properties',
        icon: '🏙️',
        label: 'Properties',
        value: formatCompactNumber(data.propertiesCount),
        subtext: 'Live portfolio',
        trend: `${Math.max(data.propertiesCount - data.hotLeadsCount, 0)} ready`,
        positive: true,
      },
      {
        id: 'leads',
        icon: '📱',
        label: 'Leads',
        value: formatCompactNumber(data.leadsCount),
        subtext: 'Pipeline volume',
        trend: `${data.hotLeadsCount} hot`,
        positive: data.hotLeadsCount > 0,
      },
      {
        id: 'revenue',
        icon: '💼',
        label: 'Revenue',
        value: formatCurrency(data.monthlyRevenue),
        subtext: 'This month',
        trend: data.monthlyRevenue > 0 ? 'On track' : 'No revenue yet',
        positive: data.monthlyRevenue > 0,
      },
      {
        id: 'agents',
        icon: '👥',
        label: 'Agents',
        value: formatCompactNumber(data.agentsCount),
        subtext: 'Active operators',
        trend: data.agentsCount > 0 ? 'Team online' : 'Awaiting assignments',
        positive: data.agentsCount > 0,
      },
      {
        id: 'contracts',
        icon: '📋',
        label: 'Contracts',
        value: formatCompactNumber(data.contractsCount),
        subtext: 'Tracked documents',
        trend: data.contractsCount > 0 ? 'Execution moving' : 'No active contracts',
        positive: data.contractsCount > 0,
      },
    ];
  }, [
    data.propertiesCount,
    data.leadsCount,
    data.hotLeadsCount,
    data.monthlyRevenue,
    data.agentsCount,
    data.contractsCount,
  ]);
}

/**
 * useProfileCompletion
 * Calculates profile completion percentage and items
 */
export interface ProfileCompletionItem {
  id: string;
  label: string;
  complete: boolean;
}

export interface ProfileCompletionData {
  items: ProfileCompletionItem[];
  percent: number;
  isComplete: boolean;
}

export function useProfileCompletion(userProfile: {
  name?: string;
  phone?: string;
  photoURL?: string;
}): ProfileCompletionData {
  return useMemo(() => {
    const items: ProfileCompletionItem[] = [
      { id: 'name', label: 'Full name', complete: Boolean(userProfile.name?.trim()) },
      { id: 'phone', label: 'Phone number', complete: Boolean(userProfile.phone?.trim()) },
      { id: 'photo', label: 'Profile photo', complete: Boolean(userProfile.photoURL?.trim()) },
    ];

    const completed = items.filter(item => item.complete).length;
    const percent = Math.round((completed / items.length) * 100);

    return {
      items,
      percent,
      isComplete: percent === 100,
    };
  }, [userProfile.name, userProfile.phone, userProfile.photoURL]);
}

/**
 * useGreeting
 * Generates time-based greeting and date label
 */
export interface GreetingData {
  greeting: string;
  dateLabel: string;
  fullLine: string;
}

export function useGreeting(
  userName: string,
  hotLeadsCount: number = 0
): GreetingData {
  return useMemo(() => {
    const now = new Date();
    const hour = now.getHours();
    const greeting =
      hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

    const dateLabel = new Intl.DateTimeFormat('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    }).format(now);

    const greetingName = userName?.trim() || 'team';
    const fullLine = `${greeting}, ${greetingName} · ${dateLabel} · ${hotLeadsCount} active leads need follow-up`;

    return { greeting, dateLabel, fullLine };
  }, [userName, hotLeadsCount]);
}

/**
 * useSearchItems
 * Builds searchable items from modules and workspaces
 */
export interface SearchItem {
  id: string;
  icon: string;
  label: string;
  meta: string;
  type: 'tab' | 'module' | 'record';
  target: string;
}

export function useSearchItems(modules: any[], workspaces: any[]): SearchItem[] {
  return useMemo(() => {
    const items: SearchItem[] = [];

    // Add workspace tabs as searchable items
    workspaces.forEach(workspace => {
      items.push({
        id: `workspace-${workspace.id}`,
        icon: '◎',
        label: workspace.label,
        meta: workspace.meta || 'Workspace',
        type: 'tab',
        target: workspace.id,
      });
    });

    // Add CRM modules as searchable items
    modules.forEach(module => {
      items.push({
        id: `module-${module.id}`,
        icon: module.icon || '⬡',
        label: module.label,
        meta: module.zone || 'CRM Module',
        type: 'module',
        target: module.id,
      });
    });

    return items;
  }, [modules, workspaces]);
}

/**
 * useSearchFilter
 * Filters search items by query
 */
export function useSearchFilter(items: SearchItem[], query: string): SearchItem[] {
  return useMemo(() => {
    if (!query.trim()) return items;

    const q = query.toLowerCase();
    return items.filter(
      item =>
        item.label.toLowerCase().includes(q) ||
        item.meta.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
    );
  }, [items, query]);
}

/**
 * useDashboardTabs
 * Manages active tab state and tab navigation
 */
export interface DashboardTab {
  id: string;
  label: string;
  icon?: string;
  count?: number;
}

export function useDashboardTabs(tabs: DashboardTab[], initialTab: string) {
  const [activeTab, setActiveTab] = React.useState<string>(initialTab || tabs[0]?.id || '');

  const currentTab = React.useMemo(() => tabs.find(t => t.id === activeTab), [activeTab, tabs]);

  return { activeTab, setActiveTab, currentTab, tabs };
}

