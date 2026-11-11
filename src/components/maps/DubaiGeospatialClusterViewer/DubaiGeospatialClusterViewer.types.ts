/**
 * DubaiGeospatialClusterViewer.types.ts
 * Types for Interactive Dubai GIS Map & Luxury Heatmap Cluster Viewer
 * Architecture: AEGIS Single Purpose File Law (< 350 lines)
 * Law: AEG-001–009, Context Triad, Geospatial Dubai Real Estate Analytics
 */

export type HeatmapMetricMode = 'yield' | 'transaction_volume' | 'price_psf' | 'dh2_occupancy';

export interface LuxuryCluster {
  id: string;
  name: string;
  category: 'ultra_luxury' | 'coastal' | 'prime_central' | 'master_community';
  lat: number;
  lng: number;
  avgPricePsfAED: number;
  grossRentalYieldPct: number;
  quarterlyVolumeAEDm: number;
  dldTransactionCount: number;
  activeListingsCount: number;
  occupancyRatePct: number;
  growthTrendPct: number;
  damacHills2Status?: 'active_handover' | 'mature' | 'secondary_peak';
  topDeveloper: string;
}

export interface DubaiGeospatialClusterViewerProps {
  initialClusters?: LuxuryCluster[];
  onSelectCluster?: (cluster: LuxuryCluster) => void;
  onFilterMetricChange?: (metric: HeatmapMetricMode) => void;
}
