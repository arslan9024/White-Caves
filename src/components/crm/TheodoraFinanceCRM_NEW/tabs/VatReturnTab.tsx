import React, { useState } from 'react';
import { Building2, Download, FileText, CheckCircle2, Calculator, ShieldCheck, ArrowRight } from 'lucide-react';

export const VatReturnTab: React.FC = () => {
  const [taxPeriod, setTaxPeriod] = useState('2026-Q3');

  // Form 201 Data Mock
  const vatData = {
    standardRatedSales: 1250000, // Box 1
    outputVat: 62500, // 5%
    standardRatedExpenses: 340000, // Box 9
    inputVatRecoverable: 17000, // 5%
    netVatPayable: 45500, // Box 12
    trn: '100592837400003',
    taxAgency: 'White Caves Real Estate LLC',
    submissionDeadline: '2026-10-28',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, var(--bg-dark, #0F172A) 0%, var(--card-dark, #1E293B) 100%)',
          color: 'var(--white, #FFFFFF)',
          padding: '1.5rem',
          borderRadius: '12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Building2 size={24} color="var(--accent-blue, #3B82F6)" />
            <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800 }}>
              UAE Federal Tax Authority (FTA) — Form 201 VAT Return
            </h3>
          </div>
          <p style={{ margin: '0.35rem 0 0 0', fontSize: '0.82rem', color: 'var(--color-c7d2fe, #C7D2FE)' }}>
            Registered TRN: <strong>{vatData.trn}</strong> | In-House Auto Calculated Tax Return
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select
            value={taxPeriod}
            onChange={(e) => setTaxPeriod(e.target.value)}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              color: 'var(--white, #FFFFFF)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '8px',
              padding: '6px 12px',
              fontSize: '0.85rem',
              fontWeight: 700,
            }}
          >
            <option value="2026-Q3" style={{ color: 'var(--black, #000)' }}>2026 Q3 (Jul - Sep)</option>
            <option value="2026-Q2" style={{ color: 'var(--black, #000)' }}>2026 Q2 (Apr - Jun)</option>
            <option value="2026-Q1" style={{ color: 'var(--black, #000)' }}>2026 Q1 (Jan - Mar)</option>
          </select>

          <button
            style={{
              background: 'var(--primary-red, #EF4444)',
              color: 'var(--white, #FFFFFF)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontWeight: 800,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(239, 68, 68, 0.4)',
            }}
          >
            <Download size={16} />
            <span>Export EmaraTax XML / PDF</span>
          </button>
        </div>
      </div>

      {/* Summary KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'var(--white, #FFFFFF)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)', textTransform: 'uppercase' }}>
            Box 1: Output VAT (Sales / Commissions)
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)', marginTop: '0.35rem' }}>
            AED {vatData.outputVat.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748B)', marginTop: '0.25rem' }}>
            5% on AED {vatData.standardRatedSales.toLocaleString()} revenue
          </div>
        </div>

        <div style={{ background: 'var(--white, #FFFFFF)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)', textTransform: 'uppercase' }}>
            Box 9: Input VAT (Expenses & Outlays)
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--accent-green, #10B981)', marginTop: '0.35rem' }}>
            AED {vatData.inputVatRecoverable.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748B)', marginTop: '0.25rem' }}>
            5% recoverable on qualifying 42 expenses
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, var(--color-eef2ff, #EEF2FF) 0%, var(--color-e0e7ff, #E0E7FF) 100%)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--color-c7d2fe, #C7D2FE)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--color-3730a3, #3730A3)', textTransform: 'uppercase' }}>
            Box 12: Net VAT Payable to FTA
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-4338ca, #4338CA)', marginTop: '0.35rem' }}>
            AED {vatData.netVatPayable.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-3730a3, #3730A3)', marginTop: '0.25rem' }}>
            Filing Deadline: {vatData.submissionDeadline}
          </div>
        </div>
      </div>

      {/* Official Box-by-Box Breakdown Table */}
      <div style={{ background: 'var(--white, #FFFFFF)', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)', overflow: 'hidden' }}>
        <div style={{ padding: '1rem 1.25rem', background: 'var(--color-f8fafc, #F8FAFC)', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
            FTA Form 201 — Itemized Declaration Matrix
          </h4>
          <span style={{ fontSize: '0.75rem', background: 'var(--color-ecfdf5, #ECFDF5)', color: 'var(--color-047857, #047857)', padding: '3px 8px', borderRadius: '4px', fontWeight: 800 }}>
            Audit Status: Ready for Submission
          </span>
        </div>

        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'var(--color-f8fafc, #F8FAFC)', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', color: 'var(--color-475569, #475569)' }}>
              <th style={{ padding: '12px 16px' }}>Box #</th>
              <th style={{ padding: '12px 16px' }}>Description</th>
              <th style={{ padding: '12px 16px' }}>Taxable Amount (AED)</th>
              <th style={{ padding: '12px 16px' }}>VAT Rate</th>
              <th style={{ padding: '12px 16px' }}>VAT Amount (AED)</th>
            </tr>
          </thead>
          <tbody>
            <tr style={{ borderBottom: '1px solid var(--color-f1f5f9, #F1F5F9)' }}>
              <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--color-4338ca, #4338CA)' }}>Box 1a</td>
              <td style={{ padding: '12px 16px', fontWeight: 700 }}>Standard-rated supplies in Dubai (Brokerage & Lease Fees)</td>
              <td style={{ padding: '12px 16px' }}>AED {vatData.standardRatedSales.toLocaleString()}</td>
              <td style={{ padding: '12px 16px' }}>5.0%</td>
              <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>AED {vatData.outputVat.toLocaleString()}</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--color-f1f5f9, #F1F5F9)' }}>
              <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--color-4338ca, #4338CA)' }}>Box 3</td>
              <td style={{ padding: '12px 16px' }}>Zero-rated supplies / Export of services</td>
              <td style={{ padding: '12px 16px' }}>AED 0.00</td>
              <td style={{ padding: '12px 16px' }}>0.0%</td>
              <td style={{ padding: '12px 16px' }}>AED 0.00</td>
            </tr>
            <tr style={{ borderBottom: '1px solid var(--color-f1f5f9, #F1F5F9)' }}>
              <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--color-4338ca, #4338CA)' }}>Box 9</td>
              <td style={{ padding: '12px 16px', fontWeight: 700 }}>Standard-rated expenses & overheads (42 Master Items)</td>
              <td style={{ padding: '12px 16px' }}>AED {vatData.standardRatedExpenses.toLocaleString()}</td>
              <td style={{ padding: '12px 16px' }}>5.0%</td>
              <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--accent-green, #10B981)' }}>AED {vatData.inputVatRecoverable.toLocaleString()}</td>
            </tr>
            <tr style={{ background: 'var(--color-f8fafc, #F8FAFC)', fontWeight: 800, borderTop: '2px solid var(--text-secondary, #E2E8F0)' }}>
              <td style={{ padding: '14px 16px', color: 'var(--color-4338ca, #4338CA)' }}>Box 12</td>
              <td style={{ padding: '14px 16px' }}>Total Net VAT Payable / (Refundable) for Period</td>
              <td style={{ padding: '14px 16px' }}>—</td>
              <td style={{ padding: '14px 16px' }}>—</td>
              <td style={{ padding: '14px 16px', color: 'var(--color-4338ca, #4338CA)', fontSize: '1rem' }}>AED {vatData.netVatPayable.toLocaleString()}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default VatReturnTab;
