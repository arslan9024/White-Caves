/**
 * @file useClientsData.ts
 * @description Data hook for client/owner management — Phase 1C
 * Provides: CRUD operations, category filtering, property linking, communication logs
 * Pattern: Mirrors useLeadsData.ts and useFinanceData.ts
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchClientsFromAPI,
  createClientAPI,
  updateClientAPI,
  deleteClientAPI,
  linkClientPropertyAPI,
  unlinkClientPropertyAPI,
  fetchClientCommunicationsAPI,
  createClientCommunicationAPI,
  convertLeadToClientAPI,
  selectAllClients,
  selectClientsLoading,
  selectClientsError,
  selectBuyerClients,
  selectSellerClients,
  selectLandlordClients,
  selectTenantClients,
  selectInvestorClients,
  selectActiveClients,
} from '../../store/crmDataSlice';
import type { AppDispatch } from '../../store/store';

export interface UseClientsDataOptions {
  autoFetch?: boolean;
  category?: string;
  status?: string;
}

export const useClientsData = (options: UseClientsDataOptions = {}) => {
  const { autoFetch = true, category, status } = options;
  const dispatch = useDispatch<AppDispatch>();

  // ── Redux selectors ──
  const allClients = useSelector(selectAllClients);
  const loading = useSelector(selectClientsLoading);
  const error = useSelector(selectClientsError);
  const buyers = useSelector(selectBuyerClients);
  const sellers = useSelector(selectSellerClients);
  const landlords = useSelector(selectLandlordClients);
  const tenants = useSelector(selectTenantClients);
  const investors = useSelector(selectInvestorClients);
  const activeClients = useSelector(selectActiveClients);

  // ── Auto-fetch on mount ──
  useEffect(() => {
    if (autoFetch) {
      const params: Record<string, string> = {};
      if (category) params.category = category;
      if (status) params.status = status;
      dispatch(fetchClientsFromAPI(params));
    }
  }, [dispatch, autoFetch, category, status]);

  // ── Computed stats ──
  const clientStats = useMemo(() => {
    const totalValue = allClients.reduce(
      (sum, c) => sum + (Number(c.totalValue ?? c.total_value ?? 0) || 0),
      0
    );
    const totalDeals = allClients.reduce(
      (sum, c) => sum + (Number(c.dealsCount ?? c.deals_count ?? 0) || 0),
      0
    );

    return {
      totalClients: allClients.length,
      activeCount: activeClients.length,
      buyerCount: buyers.length,
      sellerCount: sellers.length,
      landlordCount: landlords.length,
      tenantCount: tenants.length,
      investorCount: investors.length,
      totalValue,
      totalDeals,
    };
  }, [allClients, activeClients, buyers, sellers, landlords, tenants, investors]);

  // ── CRUD operations ──
  const handleCreateClient = useCallback(
    (data: Record<string, unknown>) => dispatch(createClientAPI(data)),
    [dispatch]
  );

  const handleUpdateClient = useCallback(
    (data: { id: string; [key: string]: unknown }) => dispatch(updateClientAPI(data)),
    [dispatch]
  );

  const handleDeleteClient = useCallback(
    (id: string) => dispatch(deleteClientAPI(id)),
    [dispatch]
  );

  // ── Property linking ──
  const handleLinkProperty = useCallback(
    (params: { clientId: string; propertyId: string; relationship?: string; notes?: string }) =>
      dispatch(linkClientPropertyAPI(params)),
    [dispatch]
  );

  const handleUnlinkProperty = useCallback(
    (params: { clientId: string; propertyId: string }) =>
      dispatch(unlinkClientPropertyAPI(params)),
    [dispatch]
  );

  // ── Communication logs ──
  const handleFetchCommunications = useCallback(
    (params: { clientId: string; type?: string; page?: number; pageSize?: number }) =>
      dispatch(fetchClientCommunicationsAPI(params)),
    [dispatch]
  );

  const handleLogCommunication = useCallback(
    (params: { clientId: string; type?: string; direction?: string; subject?: string; body?: string; duration?: number; outcome?: string }) =>
      dispatch(createClientCommunicationAPI(params)),
    [dispatch]
  );

  // ── Lead conversion ──
  const handleConvertLead = useCallback(
    (params: { leadId: string; category?: string; type?: string }) =>
      dispatch(convertLeadToClientAPI(params)),
    [dispatch]
  );

  // ── Refresh ──
  const handleRefresh = useCallback(() => {
    const params: Record<string, string> = {};
    if (category) params.category = category;
    if (status) params.status = status;
    dispatch(fetchClientsFromAPI(params));
  }, [dispatch, category, status]);

  return {
    // Data
    clients: allClients,
    buyers,
    sellers,
    landlords,
    tenants,
    investors,
    activeClients,
    clientStats,
    loading,
    error,
    // CRUD
    handleCreateClient,
    handleUpdateClient,
    handleDeleteClient,
    // Property linking
    handleLinkProperty,
    handleUnlinkProperty,
    // Communications
    handleFetchCommunications,
    handleLogCommunication,
    // Lead conversion
    handleConvertLead,
    // Refresh
    handleRefresh,
  };
};
