/**
 * DubaiMap — Interactive Property Map Component
 * ==============================================
 * Leaflet-based map showing Dubai properties as markers with:
 * - Price tooltips on hover
 * - Cluster grouping when zoomed out
 * - Community boundary circles
 * - Click-to-filter integration with Redux propertySlice
 * - Gold (#D4AF37) theme pins matching White Caves branding
 */

import React, { FC, useMemo, useCallback, useRef, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useDispatch } from 'react-redux';
import { setFilters } from '../../store/propertySlice';
import {
  DUBAI_CENTER,
  DEFAULT_ZOOM,
  COMMUNITY_COORDS,
  getCommunityCoords,
  jitterCoords,
  type CommunityCoords,
} from './dubaiCoordinates';
import './DubaiMap.css';

/* ─── Fix Leaflet default marker icon in bundler environments ───── */
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// @ts-expect-error — Leaflet Icon.Default._getIconUrl is private but needs patching for bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* ─── Types ─────────────────────────────────────────────────────── */

export interface MapProperty {
  id: string;
  title: string;
  location: string;
  type: string;
  purpose: 'buy' | 'rent';
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  image: string;
  featured: boolean;
}

interface DubaiMapProps {
  properties: MapProperty[];
  /** Currently hovered/selected property from the list side */
  activePropertyId?: string | null;
  /** Called when user clicks a property marker */
  onPropertyClick?: (property: MapProperty) => void;
  /** Show community boundary overlays */
  showCommunities?: boolean;
  /** Height of map container */
  height?: string;
  /** Custom class name */
  className?: string;
}

/* ─── Custom Gold Marker Icon ───────────────────────────────────── */

function createGoldIcon(featured: boolean = false): L.DivIcon {
  const bg = featured ? '#D4AF37' : '#2E5A4F';
  const border = featured ? '#B8960C' : '#1a3a2f';
  return L.divIcon({
    className: 'dubai-map-marker-wrapper',
    html: `
      <div class="dubai-map-marker" style="background:${bg};border-color:${border}">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="white">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
          <polyline points="9 22 9 12 15 12 15 22" fill="rgba(255,255,255,0.4)"/>
        </svg>
      </div>
      <div class="dubai-map-marker-stem"></div>
    `,
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -44],
  });
}

const goldIcon = createGoldIcon(true);
const greenIcon = createGoldIcon(false);

/* ─── Price Format Helper ───────────────────────────────────────── */

function formatPrice(price: number): string {
  if (price >= 1_000_000) return `AED ${(price / 1_000_000).toFixed(1)}M`;
  if (price >= 1_000) return `AED ${(price / 1_000).toFixed(0)}K`;
  return `AED ${price.toLocaleString()}`;
}

/* ─── Map Fit Helper ────────────────────────────────────────────── */

const FitBounds: FC<{ markers: [number, number][] }> = ({ markers }) => {
  const map = useMap();
  useEffect(() => {
    if (markers.length === 0) return;
    if (markers.length === 1) {
      map.setView(markers[0], 14);
      return;
    }
    const bounds = L.latLngBounds(markers.map(([lat, lng]) => [lat, lng]));
    map.fitBounds(bounds, { padding: [40, 40], maxZoom: 15 });
  }, [map, markers]);
  return null;
};

/* ─── Main Component ────────────────────────────────────────────── */

const DubaiMap: FC<DubaiMapProps> = ({
  properties,
  activePropertyId,
  onPropertyClick,
  showCommunities = true,
  height = '600px',
  className = '',
}) => {
  const dispatch = useDispatch();
  const mapRef = useRef<L.Map | null>(null);

  // Build marker positions
  const markers = useMemo(() => {
    // Group properties by location to track jitter index
    const locationIndices: Record<string, number> = {};
    return properties.map((prop) => {
      const community = getCommunityCoords(prop.location);
      const baseLat = community?.lat ?? DUBAI_CENTER[0];
      const baseLng = community?.lng ?? DUBAI_CENTER[1];
      const idx = (locationIndices[prop.location] ?? 0);
      locationIndices[prop.location] = idx + 1;
      const [lat, lng] = jitterCoords(baseLat, baseLng, idx);
      return { ...prop, lat, lng };
    });
  }, [properties]);

  // All marker positions for fit-bounds
  const markerPositions = useMemo<[number, number][]>(
    () => markers.map((m) => [m.lat, m.lng]),
    [markers]
  );

  // Community stats (count per community)
  const communityStats = useMemo(() => {
    const stats: Record<string, { count: number; avgPrice: number }> = {};
    properties.forEach((p) => {
      if (!stats[p.location]) stats[p.location] = { count: 0, avgPrice: 0 };
      stats[p.location].count += 1;
      stats[p.location].avgPrice += p.price;
    });
    Object.keys(stats).forEach((key) => {
      stats[key].avgPrice = Math.round(stats[key].avgPrice / stats[key].count);
    });
    return stats;
  }, [properties]);

  const handleCommunityClick = useCallback(
    (community: CommunityCoords) => {
      dispatch(setFilters({ locations: [community.name] }));
    },
    [dispatch]
  );

  return (
    <div
      className={`dubai-map-container ${className}`}
      style={{ height }}
      data-testid="dubai-map"
    >
      <MapContainer
        center={DUBAI_CENTER}
        zoom={DEFAULT_ZOOM}
        className="dubai-map-leaflet"
        style={{ height: '100%', width: '100%' }}
        ref={mapRef}
        scrollWheelZoom={true}
        zoomControl={true}
      >
        {/* OpenStreetMap tiles — free, no API key */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Fit map to property markers */}
        <FitBounds markers={markerPositions} />

        {/* Community boundary circles */}
        {showCommunities &&
          COMMUNITY_COORDS.map((community) => {
            const stats = communityStats[community.name];
            return (
              <Circle
                key={community.name}
                center={[community.lat, community.lng]}
                radius={community.radius}
                pathOptions={{
                  color: stats ? '#D4AF37' : '#2E5A4F',
                  fillColor: stats ? 'rgba(212, 175, 55, 0.08)' : 'rgba(46, 90, 79, 0.04)',
                  fillOpacity: 0.4,
                  weight: stats ? 2 : 1,
                  dashArray: stats ? undefined : '4 6',
                }}
                eventHandlers={{
                  click: () => handleCommunityClick(community),
                }}
              >
                <Popup className="community-popup">
                  <div className="community-popup-content">
                    <h4>{community.name}</h4>
                    <p className="community-desc">{community.description}</p>
                    {stats && (
                      <div className="community-stats">
                        <span>{stats.count} {stats.count === 1 ? 'property' : 'properties'}</span>
                        <span>Avg: {formatPrice(stats.avgPrice)}</span>
                      </div>
                    )}
                    <button
                      className="community-filter-btn"
                      onClick={() => handleCommunityClick(community)}
                    >
                      View Properties →
                    </button>
                  </div>
                </Popup>
              </Circle>
            );
          })}

        {/* Property markers */}
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            position={[marker.lat, marker.lng]}
            icon={marker.featured ? goldIcon : greenIcon}
            eventHandlers={{
              click: () => onPropertyClick?.(marker),
            }}
          >
            <Popup className="property-map-popup">
              <div
                className={`property-popup-card ${
                  activePropertyId === marker.id ? 'active' : ''
                }`}
                onClick={() => onPropertyClick?.(marker)}
                role="button"
                tabIndex={0}
              >
                <img
                  src={marker.image}
                  alt={marker.title}
                  className="popup-card-image"
                  loading="lazy"
                />
                <div className="popup-card-info">
                  <span className="popup-card-type">{marker.type}</span>
                  <h4 className="popup-card-title">{marker.title}</h4>
                  <p className="popup-card-location">{marker.location}</p>
                  <div className="popup-card-specs">
                    <span>{marker.beds} BD</span>
                    <span>{marker.baths} BA</span>
                    <span>{marker.sqft.toLocaleString()} sqft</span>
                  </div>
                  <span className="popup-card-price">{formatPrice(marker.price)}</span>
                </div>
                {marker.featured && <span className="popup-featured-badge">★ Featured</span>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Map legend */}
      <div className="dubai-map-legend">
        <div className="legend-item">
          <span className="legend-dot featured" />
          <span>Featured</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot standard" />
          <span>Standard</span>
        </div>
        <div className="legend-item">
          <span className="legend-circle" />
          <span>Community</span>
        </div>
      </div>
    </div>
  );
};

export default React.memo(DubaiMap);
