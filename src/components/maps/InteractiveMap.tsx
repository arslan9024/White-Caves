/**
 * InteractiveMap — PropertiesPage Map Integration
 * ================================================
 * Split-view component: map + property list side by side.
 * Responsive: collapses to list-only on mobile with toggle to show map.
 * Bridges usePropertyBrowser data → DubaiMap markers.
 *
 * W18.1-P0-003 enhancements:
 *  - Viewport persistence via URL params (?lat=, ?lng=, ?zoom=)
 *  - Dispatches setActivePropertyId to Redux on marker click
 *  - onViewportChange optional callback
 */

import React, { FC, useState, useCallback, useMemo, lazy, Suspense } from 'react';
import { Map, X } from 'lucide-react';
import type { MapProperty } from './DubaiMap';
import { setActivePropertyId } from '../../redux/slices/propertySlice';
import { useAppDispatch } from '../../store/store';
import './InteractiveMap.css';

const DubaiMap = lazy(() => import('./DubaiMap'));

// ── Types ────────────────────────────────────────────────────────────────────

export interface ViewportBoundsLocal {
  north: number;
  south: number;
  east: number;
  west: number;
}

export interface InteractiveMapProps {
  properties: MapProperty[];
  /** Currently selected property (highlights marker) */
  activePropertyId?: string | null;
  /** Called when a marker is clicked */
  onPropertyClick?: (property: MapProperty) => void;
  /** External control: is map visible? */
  mapVisible?: boolean;
  /** W18.1: Called when map viewport changes */
  onViewportChange?: (bounds: ViewportBoundsLocal) => void;
}

// ── URL helpers ──────────────────────────────────────────────────────────────

function parseUrlMapParams(): { lat: number | null; lng: number | null; zoom: number | null } {
  const params = new URLSearchParams(window.location.search);
  const parseMaybe = (key: string): number | null => {
    if (!params.has(key)) return null;
    const v = parseFloat(params.get(key) ?? '');
    return isNaN(v) ? null : v;
  };
  return { lat: parseMaybe('lat'), lng: parseMaybe('lng'), zoom: parseMaybe('zoom') };
}

function persistViewportToUrl(lat: number, lng: number, zoom: number): void {
  try {
    const params = new URLSearchParams(window.location.search);
    params.set('lat',  lat.toFixed(6));
    params.set('lng',  lng.toFixed(6));
    params.set('zoom', zoom.toString());
    window.history.replaceState(null, '', `?${params.toString()}`);
  } catch {
    // silently ignore — e.g. test environments without history API
  }
}

// ── Loading ───────────────────────────────────────────────────────────────────

const MapLoading: FC = () => (
  <div className="map-loading" data-testid="map-loading">
    <div className="map-loading-spinner" />
    <p>Loading map...</p>
  </div>
);

// ── Component ─────────────────────────────────────────────────────────────────

const InteractiveMap: FC<InteractiveMapProps> = ({
  properties,
  activePropertyId,
  onPropertyClick,
  mapVisible: externalMapVisible,
  onViewportChange,
}) => {
  const dispatch = useAppDispatch();
  const [internalMapVisible, setInternalMapVisible] = useState(false);
  const mapVisible = externalMapVisible ?? internalMapVisible;
  const initialViewport = useMemo(() => parseUrlMapParams(), []);

  const toggleMap = useCallback(() => {
    setInternalMapVisible(prev => !prev);
  }, []);

  // W18.1: dispatch Redux + fire external callback
  const handlePropertyClick = useCallback(
    (property: MapProperty) => {
      dispatch(setActivePropertyId(property.id));
      onPropertyClick?.(property);
    },
    [dispatch, onPropertyClick],
  );

  // W18.1: viewport change → persist to URL + fire callback
  const handleViewportChange = useCallback(
    (bounds: ViewportBoundsLocal) => {
      const centerLat = (bounds.north + bounds.south) / 2;
      const centerLng = (bounds.east  + bounds.west)  / 2;
      persistViewportToUrl(centerLat, centerLng, 12);
      onViewportChange?.(bounds);
    },
    [onViewportChange],
  );

  return (
    <div
      className="interactive-map-wrapper"
      data-testid="interactive-map"
      data-has-viewport-cb={typeof handleViewportChange === 'function'}
    >
      {/* Mobile map toggle */}
      <button
        className="map-toggle-btn"
        onClick={toggleMap}
        aria-label={mapVisible ? 'Hide map' : 'Show map'}
      >
        {mapVisible ? (
          <><X size={16} /> Hide Map</>
        ) : (
          <><Map size={16} /> Show Map</>
        )}
      </button>

      {/* Map panel */}
      <div className={`map-panel ${mapVisible ? 'visible' : 'hidden'}`}>
        <Suspense fallback={<MapLoading />}>
          <DubaiMap
            properties={properties}
            activePropertyId={activePropertyId}
            onPropertyClick={handlePropertyClick}
            onViewportChange={handleViewportChange}
            defaultCenter={
              initialViewport.lat !== null && initialViewport.lng !== null
                ? [initialViewport.lat, initialViewport.lng]
                : undefined
            }
            defaultZoom={initialViewport.zoom ?? undefined}
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
