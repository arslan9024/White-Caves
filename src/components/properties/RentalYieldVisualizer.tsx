/**
 * RentalYieldVisualizer.tsx
 *
 * White Caves Real Estate LLC — Luxury Property Rental Yield & ROI Visualizer.
 * Analyzes gross vs net rental yield (factoring in DLD service charges, property management,
 * and short-term holiday home vs long-term tenancy returns) for DAMAC Hills 2 and Dubai prime assets.
 */

import React, { FC, useState } from 'react';
import { motion } from 'framer-motion';

export interface RentalYieldVisualizerProps {
  propertyPrice?: number;
  expectedAnnualRent?: number;
  serviceChargePerSqft?: number;
  sqft?: number;
  community?: string;
}

export const RentalYieldVisualizer: FC<RentalYieldVisualizerProps> = ({
  propertyPrice = 3200000,
  expectedAnnualRent = 240000,
  serviceChargePerSqft = 12,
  sqft = 4200,
  community = 'DAMAC Hills 2',
}) => {
  const [strategy, setStrategy] = useState<'long_term' | 'short_term'>('long_term');

  // Calculations
  const grossYield = propertyPrice > 0 ? (expectedAnnualRent / propertyPrice) * 100 : 0;
  const annualServiceCharge = serviceChargePerSqft * sqft;
  const managementFee = strategy === 'short_term' ? expectedAnnualRent * 0.15 : expectedAnnualRent * 0.05;
  const netIncome = expectedAnnualRent - annualServiceCharge - managementFee;
  const netYield = propertyPrice > 0 ? (netIncome / propertyPrice) * 100 : 0;

  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
        color: '#0F172A',
        fontFamily: 'inherit',
      }}
      data-testid="rental-yield-visualizer"
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800 }}>
            📊 Investment Yield & ROI Calculator ({community})
          </h3>
          <span style={{ fontSize: '0.78rem', color: '#64748B' }}>
            Gross vs net return modeling with statutory service charges
          </span>
        </div>

        {/* Strategy Switch */}
        <div style={{ display: 'flex', background: '#F1F5F9', borderRadius: '8px', padding: '2px' }}>
          <button
            onClick={() => setStrategy('long_term')}
            style={{
              background: strategy === 'long_term' ? '#EF4444' : 'transparent',
              color: strategy === 'long_term' ? '#FFFFFF' : '#475569',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Long-Term Lease (Ejari)
          </button>
          <button
            onClick={() => setStrategy('short_term')}
            style={{
              background: strategy === 'short_term' ? '#EF4444' : 'transparent',
              color: strategy === 'short_term' ? '#FFFFFF' : '#475569',
              border: 'none',
              borderRadius: '6px',
              padding: '6px 12px',
              fontSize: '0.76rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Holiday Homes (DET)
          </button>
        </div>
      </div>

      {/* Yield Metrics Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '1.25rem',
        }}
      >
        <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Gross Rental Yield</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#3B82F6', marginTop: '4px' }}>
            {grossYield.toFixed(2)}%
          </div>
          <span style={{ fontSize: '0.68rem', color: '#64748B' }}>Before operating expenses</span>
        </div>

        <div style={{ background: '#ECFDF5', padding: '1rem', borderRadius: '10px', border: '1px solid #A7F3D0' }}>
          <span style={{ fontSize: '0.72rem', color: '#065F46', fontWeight: 600 }}>Net Estimated Yield</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#059669', marginTop: '4px' }}>
            {netYield.toFixed(2)}%
          </div>
          <span style={{ fontSize: '0.68rem', color: '#047857' }}>After service charges & mgmt</span>
        </div>

        <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '10px', border: '1px solid #E2E8F0' }}>
          <span style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 600 }}>Annual Net Cashflow</span>
          <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0F172A', marginTop: '4px' }}>
            AED {Math.round(netIncome).toLocaleString()}
          </div>
          <span style={{ fontSize: '0.68rem', color: '#64748B' }}>Per annum in investor pocket</span>
        </div>
      </div>

      {/* Expense Deductions Bar */}
      <div style={{ background: '#F8FAFC', borderRadius: '10px', padding: '12px', fontSize: '0.78rem', color: '#475569' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>Estimated Annual Service Charge:</span>
          <strong>AED {annualServiceCharge.toLocaleString()} (AED {serviceChargePerSqft}/sqft)</strong>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <span>Property Management Fee ({strategy === 'short_term' ? '15%' : '5%'}):</span>
          <strong>AED {Math.round(managementFee).toLocaleString()}</strong>
        </div>
      </div>
    </div>
  );
};

export default RentalYieldVisualizer;
