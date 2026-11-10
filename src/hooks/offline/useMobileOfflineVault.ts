/**
 * useMobileOfflineVault Hook
 * Provides React state for offline cached luxury listings, client deals, and biometric vault unlocking
 */

import { useState, useEffect, useCallback } from 'react';
import {
  MobileOfflineVaultService,
  OfflineVaultListing,
  OfflineVaultDeal,
  OfflineVaultState
} from '../../services/offline/mobileOfflineVaultService';

export function useMobileOfflineVault() {
  const vault = MobileOfflineVaultService.getInstance();
  const [stats, setStats] = useState<OfflineVaultState>(vault.getVaultStats());
  const [listings, setListings] = useState<OfflineVaultListing[]>([]);
  const [deals, setDeals] = useState<OfflineVaultDeal[]>([]);

  const refreshVault = useCallback(() => {
    setStats(vault.getVaultStats());
    setListings(vault.getCachedListings());
    setDeals(vault.getCachedDeals());
  }, [vault]);

  useEffect(() => {
    refreshVault();
  }, [refreshVault]);

  const unlockVault = useCallback(async () => {
    const success = await vault.unlockWithBiometrics(true);
    if (success) {
      refreshVault();
    }
    return success;
  }, [vault, refreshVault]);

  const lockVault = useCallback(() => {
    vault.lockVault();
    refreshVault();
  }, [vault, refreshVault]);

  const cacheListings = useCallback((newListings: OfflineVaultListing[]) => {
    vault.cacheListings(newListings);
    refreshVault();
  }, [vault, refreshVault]);

  const cacheDeals = useCallback((newDeals: OfflineVaultDeal[]) => {
    vault.cacheDeals(newDeals);
    refreshVault();
  }, [vault, refreshVault]);

  return {
    isLocked: stats.isLocked,
    stats,
    listings,
    deals,
    unlockVault,
    lockVault,
    cacheListings,
    cacheDeals,
    refreshVault
  };
}
