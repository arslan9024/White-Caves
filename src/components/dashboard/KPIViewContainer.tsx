// src/components/dashboard/KPIViewContainer.tsx

import React, { useMemo } from 'react';
import { useAppSelector } from '../../store/store';
import { KPICard } from './DashboardComponents';
import { GridLayout } from './DashboardComponents';
import type { Property, Lead, RegulatoryContract } from '../../mocks/dubaiRealEstateMocks';

/**
 * KPIViewContainer renders a set of key performance indicator cards for the dashboard.
 * It reads mock data from the Redux store and calculates four core metrics:
 *   1. Total Revenue (AED) – sum of priceAED for properties with status "Leased".
 *   2. Active Pipeline – count of leads whose status is not "Closed".
 *   3. Critical Alerts – count of regulatory contracts (Form 6, 7, 12) – all are considered active.
 *   4. Available Listings – number of properties with status "Available" in the "DAMAC Hills 2" community.
 */
export const KPIViewContainer: React.FC = () => {
  const properties = useAppSelector(state => state.dashboard.properties as Property[]);
  const leads = useAppSelector(state => state.dashboard.leads as Lead[]);
  const contracts = useAppSelector(state => state.dashboard.contracts as RegulatoryContract[]);

  const totalRevenue = useMemo(() => {
    const sum = properties
      .filter(p => p.status === 'Leased')
      .reduce((acc, cur) => acc + cur.priceAED, 0);
    return `AED ${sum.toLocaleString()}`;
  }, [properties]);

  const activePipelineCount = useMemo(
    () => leads.filter(l => l.status !== 'Closed').length,
    [leads]
  );

  const criticalAlertsCount = useMemo(() => contracts.length, [contracts]);

  const availableListingsCount = useMemo(
    () =>
      properties.filter(p => p.status === 'Available' && p.community === 'DAMAC Hills 2').length,
    [properties]
  );

  return (
    <GridLayout columns={4} gap="md">
      <KPICard
        id="kpi-revenue"
        icon="💰"
        label="Total Revenue"
        value={totalRevenue}
        trend="↑"
        positive
      />
      <KPICard
        id="kpi-pipeline"
        icon="🚀"
        label="Active Pipeline"
        value={activePipelineCount}
        subtext="Leads not closed"
        trend="+"
        positive
      />
      <KPICard
        id="kpi-alerts"
        icon="⚠️"
        label="Critical Alerts"
        value={criticalAlertsCount}
        subtext="Regulatory contracts"
        trend="!"
        positive={false}
      />
      <KPICard
        id="kpi-available"
        icon="🏡"
        label="Available Listings"
        value={availableListingsCount}
        subtext="DAMAC Hills 2"
        trend="+"
        positive
      />
    </GridLayout>
  );
};

export default KPIViewContainer;
