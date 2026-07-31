import { useState, useEffect, useMemo, useCallback } from 'react';
import { evaluateFounderGuard, UserProfile, FOUNDER_EMAIL } from '../guards/FounderGuard';
import { VIEWS_REGISTRY, ViewDefinition } from '../config/viewsRegistry';

export interface CurrencyRates {
  USD: number;
  EUR: number;
  GBP: number;
  AED: number;
}

export interface WorkspaceMetrics {
  totalRevenueAED: number;
  totalLeads: number;
  activeProperties: number;
  systemHealthPercent: number;
}

const DEFAULT_FX_RATES: CurrencyRates = {
  AED: 1.0,
  USD: 0.2723,
  EUR: 0.2514,
  GBP: 0.2145,
};

export function useWorkspaceEngine(userEmail: string = FOUNDER_EMAIL) {
  const [profile, setProfile] = useState<UserProfile>(() => evaluateFounderGuard(userEmail));
  const [activeViewCode, setActiveViewCode] = useState<string>('VIEW-01');
  const [fxRates, setFxRates] = useState<CurrencyRates>(DEFAULT_FX_RATES);
  const [selectedCurrency, setSelectedCurrency] = useState<keyof CurrencyRates>('AED');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isFxLoading, setIsFxLoading] = useState<boolean>(false);

  useEffect(() => {
    setProfile(evaluateFounderGuard(userEmail));
  }, [userEmail]);

  // 4-Hour FX Exchange Cache Simulation
  useEffect(() => {
    const fetchFxRates = async () => {
      try {
        setIsFxLoading(true);
        const cachedRates = localStorage.getItem('wc_fx_rates_cache');
        const cachedTimestamp = localStorage.getItem('wc_fx_timestamp');
        const fourHoursMs = 4 * 60 * 60 * 1000;

        if (cachedRates && cachedTimestamp && Date.now() - parseInt(cachedTimestamp, 10) < fourHoursMs) {
          setFxRates(JSON.parse(cachedRates));
          setIsFxLoading(false);
          return;
        }

        // Updated 4-hour FX rates cache fallback
        const updatedRates: CurrencyRates = {
          AED: 1.0,
          USD: 0.2723,
          EUR: 0.2515,
          GBP: 0.2148,
        };

        localStorage.setItem('wc_fx_rates_cache', JSON.stringify(updatedRates));
        localStorage.setItem('wc_fx_timestamp', Date.now().toString());
        setFxRates(updatedRates);
      } catch (err) {
        console.warn('[useWorkspaceEngine] FX cache read error, fallback to defaults:', err);
      } finally {
        setIsFxLoading(false);
      }
    };

    fetchFxRates();
  }, []);

  const activeView = useMemo(() => {
    return VIEWS_REGISTRY.find(v => v.code === activeViewCode || v.id === activeViewCode) || VIEWS_REGISTRY[0];
  }, [activeViewCode]);

  const convertCurrency = useCallback((amountAED: number, targetCurrency: keyof CurrencyRates = selectedCurrency): number => {
    const rate = fxRates[targetCurrency] || 1.0;
    return Math.round((amountAED * rate) * 100) / 100;
  }, [fxRates, selectedCurrency]);

  const formatCurrency = useCallback((amountAED: number, targetCurrency: keyof CurrencyRates = selectedCurrency): string => {
    const converted = convertCurrency(amountAED, targetCurrency);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: targetCurrency,
      maximumFractionDigits: 2,
    }).format(converted);
  }, [convertCurrency, selectedCurrency]);

  const metrics = useMemo<WorkspaceMetrics>(() => {
    return {
      totalRevenueAED: 21400000,
      totalLeads: 771,
      activeProperties: 9378,
      systemHealthPercent: 99.8,
    };
  }, []);

  return {
    profile,
    activeView,
    activeViewCode,
    setActiveViewCode,
    fxRates,
    selectedCurrency,
    setSelectedCurrency,
    convertCurrency,
    formatCurrency,
    isFxLoading,
    searchTerm,
    setSearchTerm,
    activeCategory,
    setActiveCategory,
    metrics,
  };
}

export default useWorkspaceEngine;
