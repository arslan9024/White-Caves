import React, { FC, useState } from 'react';
import styled from 'styled-components';

const MapContainer = styled.div`
  position: relative;
  width: 100%;
  height: 440px;
  background: #0F172A;
  border: 2px solid #EF4444;
  border-radius: 16px;
  overflow: hidden;
  color: #FFFFFF;
`;

const MapCanvas = styled.div`
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, #1E293B 0%, #0F172A 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
`;

const MapPinMarker = styled.button<{ $top: string; $left: string }>`
  position: absolute;
  top: ${({ $top }) => $top};
  left: ${({ $left }) => $left};
  padding: 6px 12px;
  border-radius: 20px;
  background: #EF4444;
  border: 2px solid #FFFFFF;
  color: #FFFFFF;
  font-size: 0.75rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 0 15px rgba(239, 68, 68, 0.8);
  transform: translate(-50%, -50%);
  transition: transform 0.2s ease;

  &:hover {
    transform: translate(-50%, -50%) scale(1.15);
  }
`;

const SlideDrawer = styled.div<{ $isOpen: boolean }>`
  position: absolute;
  top: 0;
  right: 0;
  width: 320px;
  height: 100%;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  border-left: 2px solid #EF4444;
  padding: 1.25rem;
  transform: translateX(${({ $isOpen }) => ($isOpen ? '0' : '100%')});
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: -10px 0 30px rgba(0, 0, 0, 0.5);
  z-index: 10;
`;

export const InteractiveMapDrawer: FC = () => {
  const [selectedProperty, setSelectedProperty] = useState<string | null>('Palm Jumeirah Signature Villa');

  return (
    <MapContainer data-testid="interactive-map-drawer">
      <MapCanvas>
        <div style={{ textAlign: 'center', opacity: 0.8 }}>
          <span style={{ fontSize: '3rem' }}>🗺️</span>
          <h4 style={{ margin: '8px 0 4px', color: '#EF4444' }}>Monochrome Leaflet Map — Dubai Luxury Ledger</h4>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>Click red markers to view property specs</span>
        </div>

        <MapPinMarker $top="35%" $left="40%" onClick={() => setSelectedProperty('Palm Jumeirah Signature Villa')}>
          📍 AED 120M
        </MapPinMarker>
        <MapPinMarker $top="65%" $left="65%" onClick={() => setSelectedProperty('Downtown Penthouse')}>
          📍 AED 45M
        </MapPinMarker>
      </MapCanvas>

      <SlideDrawer $isOpen={!!selectedProperty}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h4 style={{ margin: 0, color: '#EF4444', fontSize: '1rem' }}>Property Quick View</h4>
          <button
            onClick={() => setSelectedProperty(null)}
            style={{ background: 'none', border: 'none', color: '#94A3B8', fontSize: '1.2rem', cursor: 'pointer' }}
          >
            ✕
          </button>
        </div>
        {selectedProperty && (
          <div>
            <h5 style={{ margin: '0 0 4px', color: '#FFF' }}>{selectedProperty}</h5>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8' }}>Live DLD Verified Listing · Direct Landlord Lease</p>
            <button
              style={{
                width: '100%',
                marginTop: '1rem',
                padding: '10px',
                background: '#EF4444',
                color: '#FFF',
                border: 'none',
                borderRadius: '8px',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              View Full Details →
            </button>
          </div>
        )}
      </SlideDrawer>
    </MapContainer>
  );
};

export default InteractiveMapDrawer;
