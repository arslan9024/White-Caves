import { useState, useMemo, useCallback } from 'react';
import { LuxuryCluster, HeatmapMetricMode } from './DubaiGeospatialClusterViewer.types';

export const DUBAI_LUXURY_CLUSTERS: LuxuryCluster[] = [
  {
    id: 'palm-jumeirah',
    name: 'Palm Jumeirah & Fronds',
    category: 'ultra_luxury',
    lat: 25.1124,
    lng: 55.139,
    avgPricePsfAED: 4850,
    grossRentalYieldPct: 6.8,
    quarterlyVolumeAEDm: 5420,
    dldTransactionCount: 842,
    activeListingsCount: 312,
    occupancyRatePct: 94,
    growthTrendPct: 18.4,
    topDeveloper: 'Nakheel & Private Mansions',
  },
  {
    id: 'downtown-dubai',
    name: 'Downtown Dubai & Burj District',
    category: 'prime_central',
    lat: 25.1972,
    lng: 55.2744,
    avgPricePsfAED: 3650,
    grossRentalYieldPct: 7.2,
    quarterlyVolumeAEDm: 6890,
    dldTransactionCount: 1450,
    activeListingsCount: 890,
    occupancyRatePct: 91,
    growthTrendPct: 14.1,
    topDeveloper: 'Emaar Properties',
  },
  {
    id: 'dubai-marina',
    name: 'Dubai Marina & JBR Waterfront',
    category: 'coastal',
    lat: 25.0805,
    lng: 55.1403,
    avgPricePsfAED: 2450,
    grossRentalYieldPct: 8.1,
    quarterlyVolumeAEDm: 4120,
    dldTransactionCount: 1680,
    activeListingsCount: 1120,
    occupancyRatePct: 93,
    growthTrendPct: 11.8,
    topDeveloper: 'Select Group / Emaar',
  },
  {
    id: 'damac-hills-2',
    name: 'DAMAC Hills 2 (DH2 Cluster Hub)',
    category: 'master_community',
    lat: 24.9782,
    lng: 55.3587,
    avgPricePsfAED: 1180,
    grossRentalYieldPct: 9.4,
    quarterlyVolumeAEDm: 2950,
    dldTransactionCount: 2340,
    activeListingsCount: 9378,
    occupancyRatePct: 88,
    growthTrendPct: 22.6,
    damacHills2Status: 'active_handover',
    topDeveloper: 'DAMAC Properties',
  },
  {
    id: 'dubai-hills-estate',
    name: 'Dubai Hills Estate (Golf Mansions)',
    category: 'ultra_luxury',
    lat: 25.1189,
    lng: 55.2492,
    avgPricePsfAED: 2890,
    grossRentalYieldPct: 7.5,
    quarterlyVolumeAEDm: 4890,
    dldTransactionCount: 1210,
    activeListingsCount: 640,
    occupancyRatePct: 92,
    growthTrendPct: 16.2,
    topDeveloper: 'Emaar & Meraas',
  },
];

export function useDubaiGeospatialLogic(
  initialClusters?: LuxuryCluster[],
  onSelectCluster?: (cluster: LuxuryCluster) => void,
  onFilterMetricChange?: (metric: HeatmapMetricMode) => void
) {
  const [clusters] = useState<LuxuryCluster[]>(initialClusters || DUBAI_LUXURY_CLUSTERS);
  const [activeMetric, setActiveMetric] = useState<HeatmapMetricMode>('yield');
  const [selectedClusterId, setSelectedClusterId] = useState<string>('palm-jumeirah');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const selectedCluster = useMemo(
    () => clusters.find(c => c.id === selectedClusterId) || clusters[0],
    [clusters, selectedClusterId]
  );

  const filteredClusters = useMemo(() => {
    return clusters.filter(c => categoryFilter === 'all' || c.category === categoryFilter);
  }, [clusters, categoryFilter]);

  const handleSelectMetric = useCallback(
    (metric: HeatmapMetricMode) => {
      setActiveMetric(metric);
      if (onFilterMetricChange) onFilterMetricChange(metric);
    },
    [onFilterMetricChange]
  );

  const handleSelectCluster = useCallback(
    (cluster: LuxuryCluster) => {
      setSelectedClusterId(cluster.id);
      if (onSelectCluster) onSelectCluster(cluster);
    },
    [onSelectCluster]
  );

  const macroStats = useMemo(() => {
    const totalVolumeAEDm = clusters.reduce((sum, c) => sum + c.quarterlyVolumeAEDm, 0);
    const totalTransactions = clusters.reduce((sum, c) => sum + c.dldTransactionCount, 0);
    const avgYield = (clusters.reduce((sum, c) => sum + c.grossRentalYieldPct, 0) / clusters.length).toFixed(1);

    return { totalVolumeAEDm, totalTransactions, avgYield };
  }, [clusters]);

  return {
    clusters,
    filteredClusters,
    selectedCluster,
    activeMetric,
    categoryFilter,
    macroStats,
    setCategoryFilter,
    handleSelectMetric,
    handleSelectCluster,
  };
}
