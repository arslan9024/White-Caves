/**
 * CRM Data Memoized Redux Selectors
 * Single Purpose: Query and derive CRM slice state with stable references.
 */

import { createSelector } from '@reduxjs/toolkit';
import type { RootState } from '../../store';
import type { CRMItem } from './crmTypes';

const selectLeadsSlice = (state: RootState) => state.crmData?.leads;
const selectClientsSlice = (state: RootState) => state.crmData?.clients;
const selectAgentsSlice = (state: RootState) => state.crmData?.agents;
const selectPropertiesSlice = (state: RootState) => state.crmData?.properties;
const selectCommissionsSlice = (state: RootState) => state.crmData?.commissions;
const selectInvoicesSlice = (state: RootState) => state.crmData?.invoices;
const selectExpensesSlice = (state: RootState) => state.crmData?.expenses;
const selectTransactionsSlice = (state: RootState) => state.crmData?.transactions;
const selectActivitiesSlice = (state: RootState) => state.crmData?.activities;

// ── Leads ──
export const selectAllLeads = createSelector(selectLeadsSlice, leads => leads?.items || []);
export const selectHotLeads = createSelector(selectAllLeads, items =>
  items.filter((l: CRMItem) => l.status === 'hot')
);
export const selectWarmLeads = createSelector(selectAllLeads, items =>
  items.filter((l: CRMItem) => l.status === 'warm')
);
export const selectColdLeads = createSelector(selectAllLeads, items =>
  items.filter((l: CRMItem) => l.status === 'cold')
);
export const selectSelectedLead = (state: RootState) => state.crmData?.leads?.selected;
export const selectLeadsLoading = (state: RootState) => state.crmData?.leads?.loading;
export const selectLeadsError = (state: RootState) => state.crmData?.leads?.error;

// ── Lead Scoring Tier selectors ──
export const selectHotTierLeads = createSelector(selectAllLeads, items =>
  items.filter(
    (l: CRMItem) => l.scoreTier === 'hot' || (typeof l.score === 'number' && l.score >= 80)
  )
);
export const selectWarmTierLeads = createSelector(selectAllLeads, items =>
  items.filter(
    (l: CRMItem) =>
      l.scoreTier === 'warm' || (typeof l.score === 'number' && l.score >= 60 && l.score < 80)
  )
);
export const selectColdTierLeads = createSelector(selectAllLeads, items =>
  items.filter(
    (l: CRMItem) =>
      l.scoreTier === 'cold' || (typeof l.score === 'number' && l.score >= 30 && l.score < 60)
  )
);
export const selectInactiveTierLeads = createSelector(selectAllLeads, items =>
  items.filter(
    (l: CRMItem) => l.scoreTier === 'inactive' || (typeof l.score === 'number' && l.score < 30)
  )
);
export const selectLeadsByMinScore = (state: RootState, minScore: number) =>
  state.crmData?.leads?.items?.filter(
    (l: CRMItem) => typeof l.score === 'number' && l.score >= minScore
  ) || [];

// ── Clients ──
export const selectAllClients = createSelector(selectClientsSlice, clients => clients?.items || []);
export const selectSelectedClient = (state: RootState) => state.crmData?.clients?.selected;
export const selectClientsLoading = (state: RootState) => state.crmData?.clients?.loading;
export const selectClientsError = (state: RootState) => state.crmData?.clients?.error;

// Client category selectors
export const selectBuyerClients = createSelector(selectAllClients, items =>
  items.filter((c: CRMItem) => c.category === 'buyer')
);
export const selectSellerClients = createSelector(selectAllClients, items =>
  items.filter((c: CRMItem) => c.category === 'seller')
);
export const selectLandlordClients = createSelector(selectAllClients, items =>
  items.filter((c: CRMItem) => c.category === 'landlord')
);
export const selectTenantClients = createSelector(selectAllClients, items =>
  items.filter((c: CRMItem) => c.category === 'tenant')
);
export const selectInvestorClients = createSelector(selectAllClients, items =>
  items.filter((c: CRMItem) => c.category === 'investor')
);
export const selectActiveClients = createSelector(selectAllClients, items =>
  items.filter((c: CRMItem) => c.status === 'active')
);
export const selectClientsByAgent = (state: RootState, agentId: string | number) =>
  state.crmData?.clients?.items?.filter((c: CRMItem) => c.assignedToId === agentId) || [];

// ── Agents ──
export const selectAllAgents = createSelector(selectAgentsSlice, agents => agents?.items || []);
export const selectSelectedAgent = (state: RootState) => state.crmData?.agents?.selected;
export const selectAgentsLoading = (state: RootState) => state.crmData?.agents?.loading;
export const selectAgentsError = (state: RootState) => state.crmData?.agents?.error;

export const selectOnlineAgents = createSelector(selectAllAgents, items =>
  items.filter((a: CRMItem) => a.status === 'online')
);

export const selectAgentById = (state: RootState, agentId: string | number) =>
  state.crmData?.agents?.items?.find((a: CRMItem) => a.id === agentId);

// ── Properties ──
export const selectAllProperties = createSelector(
  selectPropertiesSlice,
  properties => properties?.items || []
);
export const selectSelectedProperty = (state: RootState) => state.crmData?.properties?.selected;
export const selectPropertiesLoading = (state: RootState) => state.crmData?.properties?.loading;
export const selectPropertiesError = (state: RootState) => state.crmData?.properties?.error;

export const selectAvailableProperties = createSelector(selectAllProperties, items =>
  items.filter((p: CRMItem) => p.status === 'available')
);

export const selectPropertyById = (state: RootState, propertyId: string | number) =>
  state.crmData?.properties?.items?.find((p: CRMItem) => p.id === propertyId);

// ── Commissions ──
export const selectAllCommissions = createSelector(
  selectCommissionsSlice,
  commissions => commissions?.items || []
);
export const selectPendingCommissions = createSelector(selectAllCommissions, items =>
  items.filter((c: CRMItem) => c.status === 'pending')
);
export const selectApprovedCommissions = createSelector(selectAllCommissions, items =>
  items.filter((c: CRMItem) => c.status === 'approved')
);
export const selectPaidCommissions = createSelector(selectAllCommissions, items =>
  items.filter((c: CRMItem) => c.status === 'paid')
);
export const selectCommissionsLoading = (state: RootState) => state.crmData?.commissions?.loading;
export const selectCommissionsError = (state: RootState) => state.crmData?.commissions?.error;

export const selectCommissionsByAgent = (state: RootState, agentId: string | number) =>
  state.crmData?.commissions?.items?.filter(
    (c: CRMItem) => c.agentId === agentId || c.agent_id === agentId
  ) || [];

// ── Invoices ──
export const selectAllInvoices = createSelector(
  selectInvoicesSlice,
  invoices => invoices?.items || []
);
export const selectPendingInvoices = createSelector(selectAllInvoices, items =>
  items.filter((i: CRMItem) => i.status === 'pending')
);
export const selectPaidInvoices = createSelector(selectAllInvoices, items =>
  items.filter((i: CRMItem) => i.status === 'paid')
);
export const selectOverdueInvoices = createSelector(selectAllInvoices, items =>
  items.filter((i: CRMItem) => i.status === 'overdue')
);
export const selectDraftInvoices = createSelector(selectAllInvoices, items =>
  items.filter((i: CRMItem) => i.status === 'draft')
);
export const selectInvoicesLoading = (state: RootState) => state.crmData?.invoices?.loading;
export const selectInvoicesError = (state: RootState) => state.crmData?.invoices?.error;

// ── Expenses ──
export const selectAllExpenses = createSelector(
  selectExpensesSlice,
  expenses => expenses?.items || []
);
export const selectPendingExpenses = createSelector(selectAllExpenses, items =>
  items.filter((e: CRMItem) => e.status === 'pending')
);
export const selectApprovedExpenses = createSelector(selectAllExpenses, items =>
  items.filter((e: CRMItem) => e.status === 'approved')
);
export const selectRejectedExpenses = createSelector(selectAllExpenses, items =>
  items.filter((e: CRMItem) => e.status === 'rejected')
);
export const selectExpensesLoading = (state: RootState) => state.crmData?.expenses?.loading;
export const selectExpensesError = (state: RootState) => state.crmData?.expenses?.error;

// ── Transactions ──
export const selectAllTransactions = createSelector(
  selectTransactionsSlice,
  transactions => transactions?.items || []
);
export const selectDraftTransactions = createSelector(selectAllTransactions, items =>
  items.filter((t: CRMItem) => t.status === 'draft')
);
export const selectPendingTransactions = createSelector(selectAllTransactions, items =>
  items.filter((t: CRMItem) => t.status === 'pending')
);
export const selectActiveTransactions = createSelector(selectAllTransactions, items =>
  items.filter((t: CRMItem) => t.status === 'active')
);
export const selectCompletedTransactions = createSelector(selectAllTransactions, items =>
  items.filter((t: CRMItem) => t.status === 'completed')
);
export const selectCancelledTransactions = createSelector(selectAllTransactions, items =>
  items.filter((t: CRMItem) => t.status === 'cancelled')
);
export const selectSaleTransactions = createSelector(selectAllTransactions, items =>
  items.filter((t: CRMItem) => t.type === 'sale')
);
export const selectLeaseTransactions = createSelector(selectAllTransactions, items =>
  items.filter((t: CRMItem) => t.type === 'lease')
);
export const selectRentalTransactions = createSelector(selectAllTransactions, items =>
  items.filter((t: CRMItem) => t.type === 'rental')
);
export const selectTransactionsLoading = (state: RootState) => state.crmData?.transactions?.loading;
export const selectTransactionsError = (state: RootState) => state.crmData?.transactions?.error;

export const selectTransactionsByAgent = (state: RootState, agentId: string | number) =>
  state.crmData?.transactions?.items?.filter((t: CRMItem) => t.agentId === agentId) || [];

// ── Activities ──
export const selectAllActivities = createSelector(
  selectActivitiesSlice,
  activities => activities?.items || []
);
export const selectRecentActivities = createSelector(
  (state: RootState) => state.crmData?.activities?.items,
  (_state: RootState, count: number = 10) => count,
  (items, count) => (items ? items.slice(0, count) : [])
);
export const selectLeadActivities = createSelector(selectAllActivities, items =>
  items.filter((a: CRMItem) => a.type === 'lead')
);
export const selectDealActivities = createSelector(selectAllActivities, items =>
  items.filter((a: CRMItem) => a.type === 'deal')
);
export const selectPropertyActivities = createSelector(selectAllActivities, items =>
  items.filter((a: CRMItem) => a.type === 'property')
);
export const selectSystemActivities = createSelector(selectAllActivities, items =>
  items.filter((a: CRMItem) => a.type === 'system')
);
export const selectActivitiesLoading = (state: RootState) => state.crmData?.activities?.loading;
export const selectActivitiesError = (state: RootState) => state.crmData?.activities?.error;

export const selectActivitiesByUser = (state: RootState, userId: string) =>
  state.crmData?.activities?.items?.filter((a: CRMItem) => a.userId === userId) || [];

// ---------------------------------------------------------------------------
// Legacy compatibility aliases for older CRM hooks/pages
// ---------------------------------------------------------------------------
export const selectAllFavorites = selectAllActivities;
export const selectFavoritesLoading = selectActivitiesLoading;
export const selectFavoritesError = selectActivitiesError;
export const selectAllNotifications = selectAllActivities;
export const selectUnreadCount = createSelector(
  selectAllActivities,
  activities => activities.filter((a: CRMItem) => !a.read).length
);
export const selectNotificationsLoading = selectActivitiesLoading;
export const selectNotificationsError = selectActivitiesError;

// ── Overview ──
const EMPTY_OVERVIEW: Record<string, unknown> = Object.freeze({});
const EMPTY_METRICS: Record<string, unknown> = Object.freeze({});
export const selectOverviewData = (state: RootState) => state.crmData?.overview ?? EMPTY_OVERVIEW;
export const selectOverviewMetrics = (state: RootState) =>
  state.crmData?.overview?.metrics ?? EMPTY_METRICS;

// ── Summary stats (memoized — uses spread copy to avoid mutating state) ──
export const selectTopAgents = createSelector(
  selectAllAgents,
  (_state: RootState, count: number = 5) => count,
  (items, count) =>
    [...items]
      .sort((a: CRMItem, b: CRMItem) => {
        const bSales = typeof b.sales === 'number' ? b.sales : 0;
        const aSales = typeof a.sales === 'number' ? a.sales : 0;
        return bSales - aSales;
      })
      .slice(0, count)
);

export const makeSelectLeadsByAgent = (agentId: string | number) =>
  createSelector(
    (state: RootState) => state.crmData?.leads?.items,
    items => items?.filter((l: CRMItem) => l.agent_id === agentId) ?? []
  );

export const makeSelectClientsByAgent = (agentId: string | number) =>
  createSelector(
    (state: RootState) => state.crmData?.clients?.items,
    items => items?.filter((c: CRMItem) => c.agent_id === agentId) ?? []
  );

// Last updated
export const selectLastUpdated = (state: RootState) => state.crmData?.lastUpdated;

