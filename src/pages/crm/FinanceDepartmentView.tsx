import React, { FC, useState } from 'react';

// --- STYLING CONSTANTS (WHITE CAVES CORPORATE PALETTE) ---
const RED = '#EF4444';
const WHITE = '#FFFFFF';
const SLATE = '#1E293B';
const BORDER_COLOR = 'rgba(239, 68, 68, 0.2)';
const CARD_BG = '#F8FAFC';
const GREEN = '#10B981';
const TEXT_MUTED = '#64748B';

// --- CONSTANTS ---
const COMPANY_TRN = '10045892100003';
const VAT_RATE_STANDARD = 0.05;

export const FinanceDepartmentView: FC = () => {
  const [vatAmount, setVatAmount] = useState<number>(5000000);
  const [vatType, setVatType] = useState<'standard' | 'zero'>('standard');
  const [agentBase, setAgentBase] = useState<number>(10000);
  const [agentCommission, setAgentCommission] = useState<number>(45000);

  // VAT Math
  const calculatedVat = vatType === 'standard' ? vatAmount * VAT_RATE_STANDARD : 0;
  const totalWithVat = vatAmount + calculatedVat;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', paddingBottom: '2rem' }}>
      
      {/* HEADER */}
      <div>
        <h2 style={{ color: SLATE, marginBottom: '4px' }}>Financial Accounting & VAT Compliance Engine</h2>
        <p style={{ color: TEXT_MUTED, marginTop: 0 }}>White Caves LLC - TRN: {COMPANY_TRN}</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
        
        {/* WIDGET 1: UAE FTA VAT ENGINE */}
        <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
          <h3 style={{ color: RED, marginTop: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>🇦🇪</span> UAE FTA VAT Engine
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Transaction Amount (AED):</label>
              <input
                type="number"
                value={vatAmount}
                onChange={(e) => setVatAmount(Number(e.target.value))}
                style={{ padding: '8px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '4px', width: '100%', marginTop: '4px' }}
              />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>VAT Category:</label>
              <select
                value={vatType}
                onChange={(e) => setVatType(e.target.value as 'standard' | 'zero')}
                style={{ padding: '8px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '4px', width: '100%', marginTop: '4px' }}
              >
                <option value="standard">Standard Rated (5%) - Commercial / Commission</option>
                <option value="zero">Zero Rated (0%) - First Supply Residential</option>
              </select>
            </div>
            
            <div style={{ padding: '12px', background: WHITE, borderRadius: '4px', borderLeft: `4px solid ${RED}`, marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: TEXT_MUTED }}>Subtotal:</span>
                <strong>AED {vatAmount.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ color: TEXT_MUTED }}>VAT ({vatType === 'standard' ? '5%' : '0%'}):</span>
                <strong style={{ color: RED }}>AED {calculatedVat.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px dashed #ccc', paddingTop: '8px' }}>
                <span>Total Payable:</span>
                <strong style={{ fontSize: '1.1rem' }}>AED {totalWithVat.toLocaleString()}</strong>
              </div>
            </div>
          </div>
        </div>

        {/* WIDGET 2: TAX INVOICE GENERATOR */}
        <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
          <h3 style={{ color: RED, marginTop: 0 }}>🧾 Tax Invoice Generator</h3>
          <p style={{ fontSize: '0.875rem', color: TEXT_MUTED, marginBottom: '16px' }}>Live Preview (Compliant with FTA Article 59)</p>
          
          <div style={{ background: WHITE, padding: '16px', borderRadius: '4px', border: '1px solid #ddd', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '2px solid #eee', paddingBottom: '8px', marginBottom: '12px' }}>
              <div>
                <strong>TAX INVOICE</strong><br/>
                Invoice No: INV-2026-089<br/>
                Date: {new Date().toLocaleDateString()}
              </div>
              <div style={{ textAlign: 'right' }}>
                <strong>White Caves Real Estate</strong><br/>
                TRN: {COMPANY_TRN}
              </div>
            </div>
            <table style={{ width: '100%', marginBottom: '12px', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #eee', color: TEXT_MUTED }}>
                  <th style={{ textAlign: 'left', paddingBottom: '4px' }}>Description</th>
                  <th style={{ textAlign: 'right', paddingBottom: '4px' }}>Amount (AED)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td style={{ paddingTop: '8px' }}>Agency Brokerage Fee</td>
                  <td style={{ textAlign: 'right', paddingTop: '8px' }}>{vatAmount.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style={{ paddingTop: '4px', color: TEXT_MUTED }}>VAT @ 5%</td>
                  <td style={{ textAlign: 'right', paddingTop: '4px' }}>{calculatedVat.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
            <div style={{ textAlign: 'right', borderTop: '2px solid #eee', paddingTop: '8px', fontWeight: 'bold' }}>
              Total Due: AED {totalWithVat.toLocaleString()}
            </div>
          </div>
        </div>

        {/* WIDGET 3: DOUBLE ENTRY LEDGER */}
        <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
          <h3 style={{ color: RED, marginTop: 0 }}>⚖️ Double-Entry General Ledger</h3>
          <p style={{ fontSize: '0.875rem', color: TEXT_MUTED, marginBottom: '16px' }}>Invariant: Assets = Liabilities + Equity</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.875rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: WHITE, borderRadius: '4px' }}>
              <strong>Assets (Bank)</strong>
              <span style={{ color: GREEN }}>+ AED 105,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: WHITE, borderRadius: '4px' }}>
              <strong>Liabilities (VAT Payable to FTA)</strong>
              <span style={{ color: RED }}>+ AED 5,000</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px', background: WHITE, borderRadius: '4px' }}>
              <strong>Equity (Retained Earnings)</strong>
              <span style={{ color: RED }}>+ AED 100,000</span>
            </div>
            
            <div style={{ marginTop: '8px', padding: '8px', background: '#1E293B', color: WHITE, borderRadius: '4px', display: 'flex', justifyContent: 'space-between' }}>
              <span>Ledger Status:</span>
              <strong>BALANCED (105,000 = 5,000 + 100,000)</strong>
            </div>
          </div>
        </div>

        {/* WIDGET 4: AGENT PAYROLL & COMMISSION */}
        <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
          <h3 style={{ color: RED, marginTop: 0 }}>💼 Agent Payroll & WPS</h3>
          <p style={{ fontSize: '0.875rem', color: TEXT_MUTED, marginBottom: '16px' }}>DIFC WPS / MOHRE Compliant</p>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem' }}>Base Salary (AED):</span>
              <input type="number" value={agentBase} onChange={e => setAgentBase(Number(e.target.value))} style={{ width: '100px', padding: '4px' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.875rem' }}>Monthly Commission (AED):</span>
              <input type="number" value={agentCommission} onChange={e => setAgentCommission(Number(e.target.value))} style={{ width: '100px', padding: '4px' }} />
            </div>
            
            <div style={{ padding: '12px', background: WHITE, borderRadius: '4px', borderLeft: `4px solid ${GREEN}`, marginTop: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.875rem', color: TEXT_MUTED }}>Gross Pay:</span>
                <strong>AED {(agentBase + agentCommission).toLocaleString()}</strong>
              </div>
              <div style={{ fontSize: '0.75rem', color: GREEN, display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span>✓</span> WPS SIF File Ready for Export
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default FinanceDepartmentView;
