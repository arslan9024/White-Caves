/**
 * InteractiveMap — PropertiesPage Map Integration
 * ================================================
 * Split-view component: map + property list side by side.
 * Responsive: collapses to list-only on mobile with toggle to show map.
 * Bridges usePropertyBrowser data → DubaiMap markers.
 */

import React, { FC, useState, useCallback, lazy, Suspense } from 'react';
import { Map, List, X } from 'lucide-react';
import type { MapProperty } from './DubaiMap';
import './InteractiveMap.css';

const DubaiMap = lazy(() => import('./DubaiMap'));

interface InteractiveMapProps {
  properties: MapProperty[];
  /** Currently selected property (highlights marker) */
  activePropertyId?: string | null;
  /** Called when a marker is clicked */
  onPropertyClick?: (property: MapProperty) => void;
  /** External control: is map visible? (desktop always, mobile toggleable) */
  mapVisible?: boolean;
}

/* ─── Loading Spinner ───────────────────────────────────────────── */

const MapLoading: FC = () => (
  <div className="map-loading" data-testid="map-loading">
    <div className="map-loading-spinner" />
    <p>Loading map...</p>
  </div>
);

/* ─── Main Component ────────────────────────────────────────────── */

const InteractiveMap: FC<InteractiveMapProps> = ({
  properties,
  activePropertyId,
  onPropertyClick,
  mapVisible: externalMapVisible,
}) => {
  const [internalMapVisible, setInternalMapVisible] = useState(false);
  const mapVisible = externalMapVisible ?? internalMapVisible;

  const toggleMap = useCallback(() => {
    setInternalMapVisible((prev) => !prev);
  }, []);

  return (
    <div className="interactive-map-wrapper" data-testid="interactive-map">
      {/* Mobile map toggle */}
      <button
        className="map-toggle-btn"
        onClick={toggleMap}
        aria-label={mapVisible ? 'Hide map' : 'Show map'}
      >
        {mapVisible ? (
          <>
            <X size={16} /> Hide Map
          </>
        ) : (
          <>
            <Map size={16} /> Show Map
          </>
        )}
      </button>

      {/* Map (desktop always visible, mobile toggleable) */}
      <div className={`map-panel ${mapVisible ? 'visible' : 'hidden'}`}>
        <Suspense fallback={<MapLoading />}>
          <DubaiMap
            properties={properties}
            activePropertyId={activePropertyId}
            onPropertyClick={onPropertyClick}
            showCommunities={true}
            height="100%"
            className="interactive-map-instance"
          />
        </Suspense>
      </div>
    </div>
  );
};

export default React.memo(InteractiveMap);
