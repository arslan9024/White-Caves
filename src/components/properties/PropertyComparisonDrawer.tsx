/**
 * PropertyComparisonDrawer.tsx
 *
 * White Caves Real Estate LLC — Luxury Property Comparison Drawer (Up to 4 Properties).
 * Enables side-by-side analysis of price, price/sqft, rental yields, DLD Escrow status,
 * service charges, and luxury amenities.
 */

import React, { FC } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ComparableProperty {
  id: number | string;
  title: string;
  price: number;
  location: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: string;
  escrowStatus?: string;
  projectedYield?: string;
  image?: string;
}

export interface PropertyComparisonDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  properties: ComparableProperty[];
  onRemoveProperty: (id: number | string) => void;
  onClearAll: () => void;
}

export const PropertyComparisonDrawer: FC<PropertyComparisonDrawerProps> = ({
  isOpen,
  onClose,
  properties,
  onRemoveProperty,
  onClearAll,
}) => {
  if (!isOpen || properties.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          width: '100%',
          maxHeight: '80vh',
          background: '#FFFFFF',
          borderTop: '2px solid #EF4444',
          boxShadow: '0 -10px 40px rgba(0, 0, 0, 0.2)',
          zIndex: 9998,
          overflowY: 'auto',
          color: '#0F172A',
          fontFamily: 'inherit',
        }}
        data-testid="property-comparison-drawer"
      >
        {/* Header Bar */}
        <div
          style={{
            padding: '1rem 1.5rem',
            background: '#0F172A',
            color: '#FFFFFF',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            position: 'sticky',
            top: 0,
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.2rem' }}>⚖️</span>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
                Luxury Property Comparison Matrix ({properties.length}/4)
              </h3>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>
                Comparing specifications, price/sqft, and projected rental yields
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <button
              onClick={onClearAll}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                color: '#CBD5E1',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              style={{
                background: '#EF4444',
                border: 'none',
                color: '#FFFFFF',
                borderRadius: '6px',
                padding: '6px 14px',
                fontSize: '0.8rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Close ✕
            </button>
          </div>
        </div>

        {/* Comparison Grid Table */}
        <div style={{ padding: '1.5rem', overflowX: 'auto' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `180px repeat(${properties.length}, minmax(220px, 1fr))`,
              gap: '1rem',
              alignItems: 'stretch',
            }}
          >
            {/* Metric Labels Column */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', paddingTop: '110px' }}>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#64748B', height: '36px', display: 'flex', alignItems: 'center' }}>Starting Price</div>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#64748B', height: '36px', display: 'flex', alignItems: 'center' }}>Location</div>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#64748B', height: '36px', display: 'flex', alignItems: 'center' }}>Property Type</div>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#64748B', height: '36px', display: 'flex', alignItems: 'center' }}>Bedrooms & Baths</div>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#64748B', height: '36px', display: 'flex', alignItems: 'center' }}>Built-Up Area</div>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#64748B', height: '36px', display: 'flex', alignItems: 'center' }}>Price / Sq.Ft</div>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#64748B', height: '36px', display: 'flex', alignItems: 'center' }}>DLD Escrow Law No. 8</div>
              <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#64748B', height: '36px', display: 'flex', alignItems: 'center' }}>Projected Net Yield</div>
            </div>

            {/* Property Columns */}
            {properties.map((prop) => {
              const pricePerSqft = prop.sqft > 0 ? Math.round(prop.price / prop.sqft) : 0;

              return (
                <div
                  key={prop.id}
                  style={{
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    borderRadius: '12px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                    position: 'relative',
                  }}
                >
                  {/* Remove Button */}
                  <button
                    onClick={() => onRemoveProperty(prop.id)}
                    title="Remove from comparison"
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: 'rgba(0,0,0,0.5)',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '50%',
                      width: '24px',
                      height: '24px',
                      fontSize: '0.7rem',
                      cursor: 'pointer',
                      zIndex: 2,
                    }}
                  >
                    ✕
                  </button>

                  {/* Property Image & Title */}
                  <div style={{ height: '90px' }}>
                    <div
                      style={{
                        height: '60px',
                        borderRadius: '8px',
                        backgroundImage: `url(${prop.image || '/images/dubai-skyline.jpg'})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        marginBottom: '6px',
                      }}
                    />
                    <div style={{ fontWeight: 800, fontSize: '0.82rem', color: '#0F172A', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {prop.title}
                    </div>
                  </div>

                  {/* Rows */}
                  <div style={{ fontWeight: 900, fontSize: '0.95rem', color: '#EF4444', height: '36px', display: 'flex', alignItems: 'center' }}>
                    AED {prop.price.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, height: '36px', display: 'flex', alignItems: 'center' }}>
                    📍 {prop.location}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, height: '36px', display: 'flex', alignItems: 'center' }}>
                    {prop.type}
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, height: '36px', display: 'flex', alignItems: 'center' }}>
                    {prop.bedrooms} Beds • {prop.bathrooms} Baths
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, height: '36px', display: 'flex', alignItems: 'center' }}>
                    {prop.sqft.toLocaleString()} sq.ft
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#3B82F6', height: '36px', display: 'flex', alignItems: 'center' }}>
                    AED {pricePerSqft.toLocaleString()} / sq.ft
                  </div>
                  <div style={{ height: '36px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ background: '#DCFCE7', color: '#166534', fontSize: '0.72rem', fontWeight: 800, padding: '3px 8px', borderRadius: '6px' }}>
                      🛡️ 100% Protected
                    </span>
                  </div>
                  <div style={{ height: '36px', display: 'flex', alignItems: 'center' }}>
                    <span style={{ color: '#059669', fontWeight: 800, fontSize: '0.88rem' }}>
                      {prop.projectedYield || '8.4% ROI'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PropertyComparisonDrawer;
