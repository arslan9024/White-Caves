import React, { FC } from 'react';
import {
  Compass,
  Layers,
  TrendingUp,
  Building2,
  DollarSign,
  Percent,
  Activity,
  Flame,
} from 'lucide-react';
import { DubaiGeospatialClusterViewerProps, LuxuryCluster } from './DubaiGeospatialClusterViewer.types';
import { useDubaiGeospatialLogic } from './DubaiGeospatialClusterViewer.logic';
import {
  GeospatialViewerContainer,
  ViewerHeader,
  MetricModeBtn,
  GeospatialCanvasArea,
  InteractiveMapCanvas,
  ClusterHeatPin,
  ClusterDetailsSidebar,
} from './DubaiGeospatialClusterViewer.styles';

const PIN_COORDINATE_MAP: Record<string, { top: string; left: string }> = {
  'palm-jumeirah': { top: '38%', left: '32%' },
  'downtown-dubai': { top: '48%', left: '58%' },
  'dubai-marina': { top: '55%', left: '26%' },
  'damac-hills-2': { top: '78%', left: '76%' },
  'dubai-hills-estate': { top: '62%', left: '52%' },
};

export const DubaiGeospatialClusterViewer: FC<DubaiGeospatialClusterViewerProps> = ({
  initialClusters,
  onSelectCluster,
  onFilterMetricChange,
}) => {
  const {
    filteredClusters,
    selectedCluster,
    activeMetric,
    macroStats,
    handleSelectMetric,
    handleSelectCluster,
  } = useDubaiGeospatialLogic(initialClusters, onSelectCluster, onFilterMetricChange);

  const getMetricDisplayValue = (cluster: LuxuryCluster) => {
    switch (activeMetric) {
      case 'yield':
        return `${cluster.grossRentalYieldPct}% Yield`;
      case 'transaction_volume':
        return `AED ${cluster.quarterlyVolumeAEDm}M`;
      case 'price_psf':
        return `AED ${cluster.avgPricePsfAED.toLocaleString()}/sqft`;
      case 'dh2_occupancy':
        return `${cluster.occupancyRatePct}% Occupancy`;
    }
  };

  const getPinIntensity = (cluster: LuxuryCluster) => {
    switch (activeMetric) {
      case 'yield':
        return cluster.grossRentalYieldPct;
      case 'transaction_volume':
        return cluster.quarterlyVolumeAEDm / 600;
      case 'price_psf':
        return cluster.avgPricePsfAED / 450;
      case 'dh2_occupancy':
        return cluster.occupancyRatePct / 10;
    }
  };

  return (
    <GeospatialViewerContainer data-testid="dubai-geospatial-cluster-viewer">
      {/* 1. Header with Macro Stats & Metric Switcher */}
      <ViewerHeader>
        <div className="title-area">
          <h3>
            <Compass size={18} color="#EF4444" />
            <span>Interactive Dubai GIS Map & Luxury Heatmap Cluster Viewer</span>
          </h3>
          <div className="subtitle">
            DLD Q1 2026 Live Cadastral Data • Total Q1 Volume: <strong>AED {macroStats.totalVolumeAEDm.toLocaleString()}M</strong> • Avg Yield: <strong>{macroStats.avgYield}%</strong>
          </div>
        </div>

        <div className="metric-mode-selector" data-testid="metric-mode-selector">
          <MetricModeBtn
            type="button"
            $isActive={activeMetric === 'yield'}
            onClick={() => handleSelectMetric('yield')}
            data-testid="metric-btn-yield"
          >
            <Percent size={11} style={{ marginRight: 4 }} />
            Gross Yield %
          </MetricModeBtn>

          <MetricModeBtn
            type="button"
            $isActive={activeMetric === 'transaction_volume'}
            onClick={() => handleSelectMetric('transaction_volume')}
            data-testid="metric-btn-volume"
          >
            <DollarSign size={11} style={{ marginRight: 4 }} />
            DLD Volume (AED)
          </MetricModeBtn>

          <MetricModeBtn
            type="button"
            $isActive={activeMetric === 'price_psf'}
            onClick={() => handleSelectMetric('price_psf')}
            data-testid="metric-btn-psf"
          >
            <TrendingUp size={11} style={{ marginRight: 4 }} />
            Price / SqFt
          </MetricModeBtn>

          <MetricModeBtn
            type="button"
            $isActive={activeMetric === 'dh2_occupancy'}
            onClick={() => handleSelectMetric('dh2_occupancy')}
            data-testid="metric-btn-dh2"
          >
            <Activity size={11} style={{ marginRight: 4 }} />
            Occupancy Rate
          </MetricModeBtn>
        </div>
      </ViewerHeader>

      {/* 2. Interactive GIS Canvas Area & Cluster Details Panel */}
      <GeospatialCanvasArea>
        {/* Visual Map Canvas */}
        <InteractiveMapCanvas data-testid="interactive-map-canvas">
          <div className="coastline-watermark">
            🌊 Arabian Gulf Coastline • Dubai Cadastral Grid 2026
          </div>

          {filteredClusters.map(cluster => {
            const coords = PIN_COORDINATE_MAP[cluster.id] || { top: '50%', left: '50%' };
            const isSelected = cluster.id === selectedCluster.id;
            return (
              <ClusterHeatPin
                key={cluster.id}
                $top={coords.top}
                $left={coords.left}
                $intensity={getPinIntensity(cluster)}
                $isSelected={isSelected}
                onClick={() => handleSelectCluster(cluster)}
                data-testid={`cluster-pin-${cluster.id}`}
                title={`${cluster.name} - ${getMetricDisplayValue(cluster)}`}
              >
                <div className="pin-glow-ring">
                  <Flame size={14} color="#FFFFFF" />
                </div>
                <div className="pin-badge">
                  <span>{cluster.name.split('(')[0].trim()}</span>
                  <span style={{ color: '#EF4444', marginLeft: 4 }}>
                    {getMetricDisplayValue(cluster)}
                  </span>
                </div>
              </ClusterHeatPin>
            );
          })}
        </InteractiveMapCanvas>

        {/* Selected Cluster Dossier */}
        <ClusterDetailsSidebar data-testid="cluster-details-sidebar">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#EF4444', textTransform: 'uppercase' }}>
              Selected Sub-Market
            </span>
            <span style={{ fontSize: '0.68rem', background: 'rgba(239,68,68,0.15)', padding: '2px 6px', borderRadius: '4px', color: '#FCA5A5' }}>
              +{selectedCluster.growthTrendPct}% YoY
            </span>
          </div>

          <div className="cluster-title">{selectedCluster.name}</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div className="stat-row">
              <span className="key">Gross Rental Yield:</span>
              <span className="val" style={{ color: '#10B981' }}>{selectedCluster.grossRentalYieldPct}% p.a.</span>
            </div>
            <div className="stat-row">
              <span className="key">Avg Price / Sq.Ft:</span>
              <span className="val">AED {selectedCluster.avgPricePsfAED.toLocaleString()}</span>
            </div>
            <div className="stat-row">
              <span className="key">Quarterly DLD Volume:</span>
              <span className="val">AED {selectedCluster.quarterlyVolumeAEDm.toLocaleString()} Million</span>
            </div>
            <div className="stat-row">
              <span className="key">DLD Registered Deals:</span>
              <span className="val">{selectedCluster.dldTransactionCount.toLocaleString()} Transactions</span>
            </div>
            <div className="stat-row">
              <span className="key">Active Market Listings:</span>
              <span className="val">{selectedCluster.activeListingsCount.toLocaleString()} Units</span>
            </div>
            <div className="stat-row">
              <span className="key">Occupancy Rate:</span>
              <span className="val">{selectedCluster.occupancyRatePct}%</span>
            </div>
            <div className="stat-row">
              <span className="key">Master Developer:</span>
              <span className="val" style={{ color: '#3B82F6' }}>{selectedCluster.topDeveloper}</span>
            </div>
          </div>

          {selectedCluster.damacHills2Status && (
            <div
              style={{
                marginTop: '6px',
                padding: '8px 10px',
                borderRadius: '6px',
                background: 'rgba(245, 158, 11, 0.1)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                fontSize: '0.72rem',
                color: '#FDE68A',
              }}
            >
              🏡 <strong>DH2 Master Hub:</strong> Synchronized with AI Mary Inventory Grid (9,378 units mapped).
            </div>
          )}
        </ClusterDetailsSidebar>
      </GeospatialCanvasArea>
    </GeospatialViewerContainer>
  );
};

export default DubaiGeospatialClusterViewer;
