/**
 * FounderTelemetryDeck.tsx
 * Metric cards displaying Sovereign Portfolio Valuation, DAMAC Hills 2 verified units,
 * Law No. 8 DLD Escrow Trust, and goAML / VAT compliance clean status.
 */

import React, { FC } from 'react';

export interface FounderTelemetryDeckProps {
  onOpenEscrowDrawer: () => void;
}

export const FounderTelemetryDeck: FC<FounderTelemetryDeckProps> = ({ onOpenEscrowDrawer }) => {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '1.75rem',
      }}
    >
      {/* Metric 1: Total Portfolio Assets */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>Total Managed Portfolio</span>
            <span style={{ fontSize: '1.3rem' }}>💎</span>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0F172A' }}>AED 45.4B</div>
        </div>
        <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span>▲ +14.2%</span> <span style={{ color: '#64748B', fontWeight: 500 }}>across 9,378 DH2 & Luxury Assets</span>
        </div>
      </div>

      {/* Metric 2: Master Inventory Units */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>DAMAC Hills 2 Units</span>
            <span style={{ fontSize: '1.3rem' }}>🏰</span>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0F172A' }}>9,378</div>
        </div>
        <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#3B82F6', fontWeight: 700 }}>
          26 Sub-Clusters Fully Indexed & Verified
        </div>
      </div>

      {/* Metric 3: DLD Escrow Trust (Law No. 8) */}
      <div
        onClick={onOpenEscrowDrawer}
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'transform 0.15s ease',
        }}
        title="Click to view Law No. 8 Escrow breakdown per project"
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>DLD Escrow Protected</span>
            <span style={{ fontSize: '1.3rem' }}>🛡️</span>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#059669' }}>AED 842.5M</div>
        </div>
        <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#047857', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
          <span>Law No. 8 of 2007 Guaranteed</span>
          <span>Inspect ➔</span>
        </div>
      </div>

      {/* Metric 4: Statutory Tax & goAML */}
      <div
        onClick={onOpenEscrowDrawer}
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          padding: '1.25rem',
          border: '1px solid #E2E8F0',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          cursor: 'pointer',
        }}
        title="Click to view statutory goAML and VAT Form 201 compliance"
      >
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>Statutory VAT & AML</span>
            <span style={{ fontSize: '1.3rem' }}>⚖️</span>
          </div>
          <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#DC2626' }}>100% Clean</div>
        </div>
        <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#64748B', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
          <span>VAT 5% • goAML AED 55k+</span>
          <span>Audit ➔</span>
        </div>
      </div>
    </div>
  );
};

export default FounderTelemetryDeck;

