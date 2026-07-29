import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer as LeafletMap, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { mockProperties, type Property } from '../../mocks/dubaiRealEstateMocks';
import 'leaflet/dist/leaflet.css';

const RED = '#EF4444';
const SLATE = '#1E293B';

/** Approximate lat/lng for Dubai communities */
const COMMUNITY_COORDS: Record<string, [number, number]> = {
  'Downtown Dubai': [25.1972, 55.2744],
  'Palm Jumeirah': [25.1124, 55.1390],
  'Dubai Marina': [25.0805, 55.1403],
  'Business Bay': [25.1865, 55.2647],
  'DAMAC Hills 2': [25.0105, 55.2631],
  'Jumeirah Village Circle': [25.0625, 55.2097],
  'Jumeirah': [25.2100, 55.2530],
  'Dubai Creek Harbour': [25.1960, 55.3386],
  'Dubai Hills Estate': [25.1170, 55.2440],
  'JBR': [25.0781, 55.1326],
  'Emaar South': [24.9800, 55.1500],
  'Al Wasl': [25.2180, 55.2590],
  'Arabian Ranches': [25.0635, 55.2714],
  'Meydan': [25.1564, 55.3043],
  'Al Barsha': [25.1058, 55.2010],
  'MBR City': [25.1580, 55.3170],
};

/** Get coords for a property based on its community, with jitter for visual spread */
const getPropertyCoords = (prop: Property, idx: number): [number, number] => {
  const base = COMMUNITY_COORDS[prop.community] ?? [25.2048 + (idx % 5) * 0.012, 55.2708 + (idx % 4) * 0.015];
  // Add slight jitter so pins don't stack
  const jitterLat = (Math.sin(idx * 7.3) * 0.008);
  const jitterLng = (Math.cos(idx * 5.1) * 0.010);
  return [base[0] + jitterLat, base[1] + jitterLng];
};

export const MapContainer: React.FC = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState<string>('all');

  const filteredProperties = filterType === 'all'
    ? mockProperties.slice(0, 20)
    : mockProperties.filter(p => p.propertyType.toLowerCase() === filterType.toLowerCase()).slice(0, 20);

  return (
    <div id="map-section" style={{ maxWidth: '1400px', margin: '40px auto', padding: '0 24px' }}>
      <div style={{ textAlign: 'center', marginBottom: '28px' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(239, 68, 68, 0.1)',
            color: RED,
            fontWeight: 800,
            fontSize: '0.8rem',
            marginBottom: '12px',
          }}
        >
          <span>📍 LIVE GEOSPATIAL MAP ENGINE</span>
        </div>
        <h2 style={{ fontSize: '2.25rem', fontWeight: 800, color: SLATE, margin: '0 0 10px' }}>
          Interactive Dubai Real Estate Map
        </h2>
        <p style={{ color: '#64748B', maxWidth: '640px', margin: '0 auto', fontSize: '1rem' }}>
          Explore 100+ verified listings across Dubai&apos;s top master developments with live pricing benchmarks.
        </p>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
          {['all', 'Villa', 'Apartment', 'Penthouse', 'Townhouse', 'Off-Plan'].map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: filterType === type ? `2px solid ${RED}` : '1px solid #E2E8F0',
                background: filterType === type ? 'rgba(239, 68, 68, 0.1)' : '#FFFFFF',
                color: filterType === type ? RED : SLATE,
                fontWeight: 700,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {type === 'all' ? '🌟 All Inventory' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Leaflet Map */}
      <div
        style={{
          borderRadius: '24px',
          overflow: 'hidden',
          border: '2px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)',
          height: '520px',
        }}
      >
        <LeafletMap
          center={[25.15, 55.22]}
          zoom={11}
          style={{ width: '100%', height: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />

          {filteredProperties.map((prop, idx) => {
            const [lat, lng] = getPropertyCoords(prop, idx);

            return (
              <CircleMarker
                key={prop.id}
                center={[lat, lng]}
                radius={10}
                pathOptions={{
                  fillColor: RED,
                  color: '#FFFFFF',
                  weight: 2.5,
                  fillOpacity: 0.85,
                }}
              >
                <Popup>
                  <div style={{ minWidth: '220px', fontFamily: 'Inter, system-ui, sans-serif' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                      <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: RED, padding: '2px 8px', borderRadius: '9999px', fontSize: '0.65rem', fontWeight: 800 }}>
                        {prop.propertyType} · {prop.status}
                      </span>
                    </div>
                    <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: SLATE, margin: '0 0 4px', lineHeight: 1.3 }}>
                      {prop.title}
                    </h4>
                    <p style={{ fontSize: '0.75rem', color: '#64748B', margin: '0 0 8px' }}>
                      📍 {prop.community} · {prop.developer}
                    </p>
                    <div style={{ background: '#F8FAFC', padding: '8px 10px', borderRadius: '8px', marginBottom: '10px' }}>
                      <div style={{ fontWeight: 900, color: RED, fontSize: '0.95rem' }}>
                        AED {prop.priceAED.toLocaleString()}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748B', marginTop: '2px' }}>
                        🛏️ {prop.beds} Beds | 🚿 {prop.baths} Baths | 📐 {prop.sqft.toLocaleString()} sqft
                      </div>
                    </div>
                    <button
                      onClick={() => navigate('/properties')}
                      style={{
                        width: '100%',
                        padding: '8px',
                        borderRadius: '8px',
                        background: RED,
                        color: '#FFFFFF',
                        border: 'none',
                        fontWeight: 800,
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                      }}
                    >
                      View Property →
                    </button>
                  </div>
                </Popup>
              </CircleMarker>
            );
          })}
        </LeafletMap>
      </div>
    </div>
  );
};

export default MapContainer;
