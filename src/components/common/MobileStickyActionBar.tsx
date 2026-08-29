/**
 * MobileStickyActionBar.tsx
 *
 * White Caves Real Estate LLC — Mobile Sticky Bottom Action Bar.
 * Enforces minimum 44px touch targets on 375px+ mobile viewports for instant
 * WhatsApp concierge, one-click phone inquiries, and viewing reservations.
 */

import React, { FC } from 'react';

export interface MobileStickyActionBarProps {
  onWhatsAppClick?: () => void;
  onCallClick?: () => void;
  onBookViewingClick?: () => void;
  propertyPrice?: string;
}

export const MobileStickyActionBar: FC<MobileStickyActionBarProps> = ({
  onWhatsAppClick = () => window.open('https://wa.me/971501234567', '_blank'),
  onCallClick = () => window.open('tel:+97141234567', '_self'),
  onBookViewingClick = () => {},
  propertyPrice = 'AED 3,200,000',
}) => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        background: '#FFFFFF',
        borderTop: '1px solid #E2E8F0',
        padding: '8px 12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 -4px 16px rgba(0,0,0,0.06)',
        zIndex: 1000,
        gap: '8px',
      }}
      data-testid="mobile-sticky-action-bar"
    >
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={{ fontSize: '0.68rem', color: '#64748B', fontWeight: 600 }}>Starting Price</span>
        <span style={{ fontSize: '0.95rem', fontWeight: 900, color: '#0F172A' }}>{propertyPrice}</span>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        {/* WhatsApp Button (Min 44px Touch Target) */}
        <button
          onClick={onWhatsAppClick}
          aria-label="Contact via WhatsApp"
          style={{
            minWidth: '44px',
            minHeight: '44px',
            background: '#25D366',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.2rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(37, 211, 102, 0.3)',
          }}
        >
          💬
        </button>

        {/* Call Button (Min 44px Touch Target) */}
        <button
          onClick={onCallClick}
          aria-label="Call White Caves Concierge"
          style={{
            minWidth: '44px',
            minHeight: '44px',
            background: '#0F172A',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1.1rem',
            cursor: 'pointer',
          }}
        >
          📞
        </button>

        {/* Book Viewing Button (Min 44px Touch Target) */}
        <button
          onClick={onBookViewingClick}
          style={{
            minHeight: '44px',
            padding: '0 14px',
            background: '#EF4444',
            color: '#FFFFFF',
            border: 'none',
            borderRadius: '10px',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <span>📅</span> Book Viewing
        </button>
      </div>
    </div>
  );
};

export default MobileStickyActionBar;
