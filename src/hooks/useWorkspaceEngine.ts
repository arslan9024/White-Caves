import { useState, useEffect, useMemo, useCallback } from 'react';
import { evaluateFounderGuard, UserProfile, FOUNDER_EMAIL } from '../guards/FounderGuard';
import { VIEWS_REGISTRY, ViewDefinition } from '../config/viewsRegistry';

export interface CurrencyRates {
  USD: number;
  EUR: number;
  GBP: number;
  AED: number;
}

export type DepartmentID = 
  | 'dept-12' | 'dept-11' | 'dept-10' | 'dept-09' | 'dept-08' | 'dept-07'
  | 'dept-06' | 'dept-05' | 'dept-04' | 'dept-03' | 'dept-02' | 'dept-01' 
  | 'dept-ground' | 'dept-md';

export interface CashFlowMetrics {
  grossRevenue: number;
  vatLiability: number; // UAE VAT 5% FTA Compliance
  escrowBalance: number;
  brokerCommissions: number;
  netCorporateIncome: number;
}

export interface WorkspaceState {
  activeDepartment: DepartmentID;
  impersonationMode: string;
  isDashboardLocked: boolean;
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

const INITIAL_CASH_FLOW: CashFlowMetrics = {
  grossRevenue: 1480000000, // 1.48 Billion AED Default Volume
  vatLiability: 74000000,   // 5% of Gross
  escrowBalance: 320000000,
  brokerCommissions: 29600000, // Approx 2% avg
  netCorporateIncome: 1056400000,
};

export function useWorkspaceEngine(userEmail: string = FOUNDER_EMAIL, initialDept: DepartmentID = 'dept-07') {
  const [profile, setProfile] = useState<UserProfile>(() => evaluateFounderGuard(userEmail));
  const [activeViewCode, setActiveViewCode] = useState<string>('VIEW-01');
  const [fxRates, setFxRates] = useState<CurrencyRates>(DEFAULT_FX_RATES);
  const [selectedCurrency, setSelectedCurrency] = useState<keyof CurrencyRates>('AED');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [isFxLoading, setIsFxLoading] = useState<boolean>(false);

  // 1-12-108 Ecosystem State
  const [workspaceState, setWorkspaceState] = useState<WorkspaceState>({
    activeDepartment: initialDept,
    impersonationMode: 'MD',
    isDashboardLocked: false,
  });

  const [cashFlow, setCashFlow] = useState<CashFlowMetrics>(INITIAL_CASH_FLOW);

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
      totalRevenueAED: cashFlow.grossRevenue, // Linked to active cash flow
      totalLeads: 771,
      activeProperties: 9378,
      systemHealthPercent: 99.8,
    };
  }, [cashFlow.grossRevenue]);

  // ─── 1-12-108 DEPARTMENT CALCULATIONS ──────────────────────────────────────────
  
  const updateGrossRevenue = useCallback((newRevenue: number) => {
    setCashFlow(prev => {
      const vat = newRevenue * 0.05;
      const net = newRevenue - vat - prev.brokerCommissions;
      return {
        ...prev,
        grossRevenue: newRevenue,
        vatLiability: vat,
        netCorporateIncome: net,
      };
    });
  }, []);

  const setImpersonation = useCallback((role: string) => {
    if (workspaceState.isDashboardLocked) {
      console.warn("Workspace is locked. Cannot change impersonation mode.");
      return;
    }
    setWorkspaceState(prev => ({ ...prev, impersonationMode: role }));
  }, [workspaceState.isDashboardLocked]);

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
    // New 1-12-108 Ecosystem additions:
    workspaceState,
    setWorkspaceState,
    cashFlow,
    updateGrossRevenue,
    setImpersonation
  };
}

export default useWorkspaceEngine;
