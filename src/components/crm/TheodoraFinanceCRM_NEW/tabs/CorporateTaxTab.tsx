import React, { useState } from 'react';
import { Scale, CheckCircle2, AlertTriangle, Download, Info, TrendingUp, Percent } from 'lucide-react';

export const CorporateTaxTab: React.FC = () => {
  const [taxYear, setTaxYear] = useState('2026');

  // Corporate Tax Model Calculations
  const ctData = {
    grossRevenue: 1850000,
    deductibleExpenses: 1220000, // CT Deductible (e.g. portals, marketing, wages, rent)
    disallowedExpenses: 25000, // Non-deductible (e.g. security deposits, 50% entertainment)
    netTaxableProfit: 630000, // 1,850,000 - 1,220,000
    smallBusinessThreshold: 375000, // UAE Statutory threshold
    taxableAboveThreshold: 255000, // 630,000 - 375,000
    statutoryTaxRate: 0.09, // 9%
    corporateTaxDue: 22950, // 255,000 * 0.09
    effectiveTaxRate: '3.64%',
  };

  const progressPercent = Math.min(100, Math.round((ctData.netTaxableProfit / ctData.smallBusinessThreshold) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Card */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          color: '#FFFFFF',
          padding: '1.5rem',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Scale size={24} color="#F59E0B" />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
              UAE Corporate Tax (CT) — Federal Decree-Law No. 47 of 2022
            </h3>
          </div>
          <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.82rem', color: '#94A3B8' }}>
            Tax Year: <strong>{taxYear}</strong> | Statutory Standard Rate: <strong>9.0%</strong> above AED 375,000 threshold
          </p>
        </div>

        <button
          style={{
            background: '#F59E0B',
            color: '#1E293B',
            border: 'none',
            borderRadius: '8px',
            padding: '8px 16px',
            fontWeight: 800,
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            cursor: 'pointer',
          }}
        >
          <Download size={16} />
          <span>Download CT Computation Binder</span>
        </button>
      </div>

      {/* Threshold Meter Card */}
      <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>
              Small Business Relief / 0% Tax Threshold Status
            </h4>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
              First AED 375,000 of Net Taxable Profit is taxed at exactly <strong>0%</strong>
            </p>
          </div>
          <span style={{ fontSize: '0.9rem', fontWeight: 800, color: ctData.netTaxableProfit > ctData.smallBusinessThreshold ? '#D97706' : '#10B981' }}>
            {ctData.netTaxableProfit > ctData.smallBusinessThreshold ? 'Exceeds 0% Band (Standard 9% Applies to Excess)' : '100% Tax Exempt'}
          </span>
        </div>

        {/* Progress bar */}
        <div style={{ width: '100%', height: '14px', background: '#E2E8F0', borderRadius: '7px', overflow: 'hidden', position: 'relative' }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: progressPercent >= 100 ? 'linear-gradient(90deg, #10B981 60%, #F59E0B 100%)' : '#10B981',
              transition: 'width 0.5s ease',
            }}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#64748B', marginTop: '0.5rem' }}>
          <span>AED 0.00 (0% Rate)</span>
          <span style={{ fontWeight: 800, color: '#1E293B' }}>AED 375,000 Threshold</span>
          <span>AED {ctData.netTaxableProfit.toLocaleString()} Current Taxable Profit</span>
        </div>
      </div>

      {/* Key Numbers Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
            Gross Annual Revenue
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#1E293B', marginTop: '0.35rem' }}>
            AED {ctData.grossRevenue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>Commissions & management fees</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
            CT-Deductible Outlays
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#10B981', marginTop: '0.35rem' }}>
            AED {ctData.deductibleExpenses.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>Portals, Ejari, DEWA, Salaries</div>
        </div>

        <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', textTransform: 'uppercase' }}>
            Taxable Base (Above 375k)
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#D97706', marginTop: '0.35rem' }}>
            AED {ctData.taxableAboveThreshold.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>Subject to 9.0% rate</div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, #FDE68A 100%)', padding: '1.25rem', borderRadius: '12px', border: '1px solid #FCD34D' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#92400E', textTransform: 'uppercase' }}>
            Estimated Corporate Tax Due
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#B45309', marginTop: '0.35rem' }}>
            AED {ctData.corporateTaxDue.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#92400E', marginTop: '0.25rem' }}>Effective Tax Rate: {ctData.effectiveTaxRate}</div>
        </div>
      </div>
    </div>
  );
};

export default CorporateTaxTab;
