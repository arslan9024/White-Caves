/**
 * InteractiveMapDrawer.tsx — View Layer (4-Way Component Architecture)
 * Sits at folder root: Pure presentational shell drawing data variables and logic hooks.
 */

import React, { FC } from 'react';
import { useInteractiveMapDrawerLogic } from './logic/InteractiveMapDrawer.logic';
import { MAP_DRAWER_TEXT } from './data/InteractiveMapDrawer.data';
import {
  MapContainer,
  MapCanvas,
  MapPinMarker,
  SlideDrawer,
  DrawerCtaBtn,
} from './styles/InteractiveMapDrawer.style';

export const InteractiveMapDrawer: FC = () => {
  const { pins, selectedProperty, selectPin, closeDrawer } = useInteractiveMapDrawerLogic();

  return (
    <MapContainer data-testid="interactive-map-drawer">
      <MapCanvas>
        <div style={{ textAlign: 'center', opacity: 0.85 }}>
          <span style={{ fontSize: '3rem' }}>🗺️</span>
          <h4 style={{ margin: '8px 0 4px', color: '#EF4444', fontWeight: 800 }}>
            {MAP_DRAWER_TEXT.mapHeader}
          </h4>
          <span style={{ fontSize: '0.8rem', color: '#94A3B8' }}>
            {MAP_DRAWER_TEXT.mapSubtext}
          </span>
        </div>

        {pins.map(pin => (
          <MapPinMarker
            key={pin.id}
            $top={pin.top}
            $left={pin.left}
            onClick={() => selectPin(pin)}
            data-testid={`map-pin-${pin.id}`}
          >
            <span>📍</span>
            <span>{pin.priceFormatted}</span>
          </MapPinMarker>
        ))}
      </MapCanvas>

      <SlideDrawer $isOpen={!!selectedProperty} data-testid="map-slide-drawer">
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '14px',
              paddingBottom: '10px',
              borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
            }}
          >
            <h4 style={{ margin: 0, color: '#EF4444', fontSize: '1rem', fontWeight: 800 }}>
              {MAP_DRAWER_TEXT.drawerTitle}
            </h4>
            <button
              onClick={closeDrawer}
              style={{
                background: 'none',
                border: 'none',
                color: '#94A3B8',
                fontSize: '1.2rem',
                cursor: 'pointer',
              }}
              aria-label={MAP_DRAWER_TEXT.closeAria}
              data-testid="map-drawer-close-btn"
            >
              ✕
            </button>
          </div>

          {selectedProperty && (
            <div>
              <div
                style={{
                  display: 'inline-block',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: 'rgba(239, 68, 68, 0.15)',
                  color: '#EF4444',
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  marginBottom: '8px',
                }}
              >
                {selectedProperty.community} · {selectedProperty.beds} Beds
              </div>
              <h5 style={{ margin: '0 0 6px', color: '#FFFFFF', fontSize: '1.1rem', fontWeight: 800 }}>
                {selectedProperty.name}
              </h5>
              <div style={{ fontSize: '1.2rem', fontWeight: 900, color: '#EF4444', margin: '4px 0 10px' }}>
                {selectedProperty.priceFormatted}
              </div>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#94A3B8', lineHeight: 1.4 }}>
                {selectedProperty.specs}
              </p>
            </div>
          )}
        </div>

        <div>
          <DrawerCtaBtn onClick={() => alert(`Inquiring about ${selectedProperty?.name}`)}>
            {MAP_DRAWER_TEXT.ctaAction}
          </DrawerCtaBtn>
        </div>
      </SlideDrawer>
    </MapContainer>
  );
};

export default InteractiveMapDrawer;
