import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockProperties, type Property } from '../../mocks/dubaiRealEstateMocks';

const RED = '#EF4444';
const SLATE = '#1E293B';

export const MapContainer: FC_Map = () => {
  const navigate = useNavigate();
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(mockProperties[0]);
  const [filterType, setFilterType] = useState<string>('all');

  const filteredProperties = filterType === 'all'
    ? mockProperties.slice(0, 12)
    : mockProperties.filter(p => p.propertyType.toLowerCase() === filterType.toLowerCase()).slice(0, 12);

  // Map coordinates relative positions
  const getMapCoordinates = (index: number) => {
    const coords = [
      { x: 380, y: 220 }, // Downtown
      { x: 200, y: 170 }, // Palm Jumeirah
      { x: 140, y: 310 }, // Dubai Marina
      { x: 420, y: 280 }, // Business Bay
      { x: 480, y: 380 }, // DAMAC Hills 2
      { x: 320, y: 340 }, // JVC
      { x: 260, y: 240 }, // Jumeirah
      { x: 520, y: 220 }, // Creek Harbour
      { x: 450, y: 320 }, // Dubai Hills
      { x: 180, y: 280 }, // JBR
      { x: 600, y: 390 }, // Emaar South
      { x: 340, y: 260 }, // Al Wasl
    ];
    return coords[index % coords.length];
  };

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
          Interactive Dubai Real Estate Vector Map
        </h2>
        <p style={{ color: '#64748B', maxWidth: '640px', margin: '0 auto', fontSize: '1rem' }}>
          Explore 100+ verified listings across Dubai's top master developments with live pricing benchmarks.
        </p>

        {/* Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginTop: '20px' }}>
          {['all', 'Villa', 'Apartment', 'Penthouse', 'Townhouse'].map(type => (
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
              }}
            >
              {type === 'all' ? '🌟 All Inventory' : type}
            </button>
          ))}
        </div>
      </div>

      <div style={{ position: 'relative', height: '520px', background: '#0F172A', borderRadius: '24px', overflow: 'hidden', border: '2px solid rgba(239, 68, 68, 0.3)', boxShadow: '0 20px 50px rgba(15, 23, 42, 0.2)' }}>
        {/* Customized Dark Map Canvas Graphic */}
        <svg viewBox="0 0 800 500" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="mapGulf" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0B1329" />
              <stop offset="100%" stopColor="#1E293B" />
            </linearGradient>
            <linearGradient id="mapLand" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
          </defs>

          <rect width="800" height="500" fill="url(#mapGulf)" />
          <path d="M 0 140 Q 220 200 420 280 T 800 420 L 800 500 L 0 500 Z" fill="url(#mapLand)" stroke="rgba(239, 68, 68, 0.25)" strokeWidth="2" />
          <path d="M 40 165 Q 240 225 440 295 T 780 435" fill="none" stroke="rgba(250, 204, 21, 0.35)" strokeWidth="3" strokeDasharray="6 4" />

          {/* Palm Jumeirah SVG Art */}
          <g transform="translate(160, 130)">
            <path d="M 40 40 L 40 0" stroke="#C9A84C" strokeWidth="4" />
            <circle cx="40" cy="0" r="28" fill="none" stroke="#C9A84C" strokeWidth="2" opacity="0.5" />
            <circle cx="40" cy="0" r="18" fill="none" stroke="#C9A84C" strokeWidth="2" opacity="0.5" />
            <text x="40" y="-35" textAnchor="middle" fill="#FACC15" fontSize="10" fontWeight="bold">Palm Jumeirah</text>
          </g>

          {/* Map Red Markers (#EF4444) */}
          {filteredProperties.map((prop, idx) => {
            const pos = getMapCoordinates(idx);
            const isSelected = selectedProperty?.id === prop.id;

            return (
              <g
                key={prop.id}
                onClick={() => setSelectedProperty(prop)}
                style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}
              >
                {/* Marker Pulse Ring */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 22 : 14}
                  fill={RED}
                  opacity={isSelected ? 0.45 : 0.2}
                />
                {/* Custom Red Marker Pin */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 10 : 7}
                  fill={RED}
                  stroke="#FFFFFF"
                  strokeWidth="2.5"
                />
                {/* Price Label */}
                <rect
                  x={pos.x - 36}
                  y={pos.y - 28}
                  width="72"
                  height="18"
                  rx="9"
                  fill={isSelected ? RED : '#FFFFFF'}
                  stroke={RED}
                  strokeWidth="1.5"
                />
                <text
                  x={pos.x}
                  y={pos.y - 15}
                  textAnchor="middle"
                  fill={isSelected ? '#FFFFFF' : SLATE}
                  fontSize="9"
                  fontWeight="800"
                >
                  {(prop.priceAED / 1000000).toFixed(1)}M AED
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Property Popover Info Card */}
        {selectedProperty && (
          <div
            style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              background: '#FFFFFF',
              borderRadius: '20px',
              padding: '20px',
              width: '340px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              border: '2px solid rgba(239, 68, 68, 0.3)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ background: 'rgba(239, 68, 68, 0.1)', color: RED, padding: '4px 10px', borderRadius: '9999px', fontSize: '0.7rem', fontWeight: 800 }}>
                {selectedProperty.propertyType} · {selectedProperty.status}
              </span>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748B' }}>
                ID: {selectedProperty.id}
              </span>
            </div>

            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: SLATE, margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {selectedProperty.title}
            </h3>

            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: '0 0 12px' }}>
              📍 {selectedProperty.community} · Developer: {selectedProperty.developer}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '10px 14px', borderRadius: '12px', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '0.7rem', color: '#64748B', display: 'block' }}>Price (AED)</span>
                <strong style={{ fontSize: '1.1rem', color: RED, fontWeight: 800 }}>
                  AED {selectedProperty.priceAED.toLocaleString()}
                </strong>
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: SLATE }}>
                <div>🛏️ {selectedProperty.beds} Beds | 🚿 {selectedProperty.baths} Baths</div>
                <div style={{ color: '#64748B' }}>📐 {selectedProperty.sqft.toLocaleString()} sqft</div>
              </div>
            </div>

            <button
              onClick={() => navigate(`/properties`)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '10px',
                background: RED,
                color: '#FFFFFF',
                border: 'none',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
              }}
            >
              View Full Property File →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

type FC_Map = React.FC;
