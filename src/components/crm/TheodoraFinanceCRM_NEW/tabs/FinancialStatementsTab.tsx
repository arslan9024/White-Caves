import React, { useState } from 'react';
import { BarChart3, FileSpreadsheet, Download, Shield, ArrowUpRight, ArrowDownRight, Layers, FileCheck } from 'lucide-react';

export const FinancialStatementsTab: React.FC = () => {
  const [statementType, setStatementType] = useState<'pnl' | 'balance-sheet' | 'cash-flow' | 'audit-pack'>('pnl');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Sub-Navigation Bar */}
      <div style={{ display: 'flex', gap: '0.5rem', background: '#F1F5F9', padding: '4px', borderRadius: '10px', width: 'fit-content' }}>
        <button
          onClick={() => setStatementType('pnl')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            background: statementType === 'pnl' ? '#FFFFFF' : 'transparent',
            color: statementType === 'pnl' ? '#8B5CF6' : '#64748B',
            boxShadow: statementType === 'pnl' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          📊 Profit & Loss (P&L)
        </button>
        <button
          onClick={() => setStatementType('balance-sheet')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            background: statementType === 'balance-sheet' ? '#FFFFFF' : 'transparent',
            color: statementType === 'balance-sheet' ? '#8B5CF6' : '#64748B',
            boxShadow: statementType === 'balance-sheet' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          📑 Balance Sheet
        </button>
        <button
          onClick={() => setStatementType('cash-flow')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            background: statementType === 'cash-flow' ? '#FFFFFF' : 'transparent',
            color: statementType === 'cash-flow' ? '#8B5CF6' : '#64748B',
            boxShadow: statementType === 'cash-flow' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          🌊 Cash Flow & Bank Recon
        </button>
        <button
          onClick={() => setStatementType('audit-pack')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontSize: '0.85rem',
            fontWeight: 800,
            cursor: 'pointer',
            background: statementType === 'audit-pack' ? '#FFFFFF' : 'transparent',
            color: statementType === 'audit-pack' ? '#8B5CF6' : '#64748B',
            boxShadow: statementType === 'audit-pack' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
          }}
        >
          🛡️ RERA Regulatory Audit Pack
        </button>
      </div>

      {/* Content based on selected statement */}
      {statementType === 'pnl' && (
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#1E293B' }}>
                Profit & Loss Statement (Fiscal Year 2026)
              </h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#64748B' }}>
                Accrual Basis | White Caves Real Estate LLC | Dubai, UAE
              </p>
            </div>
            <button style={{ background: '#8B5CF6', color: '#FFFFFF', border: 'none', borderRadius: '8px', padding: '6px 14px', fontSize: '0.8rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Download size={14} /> Export P&L Excel / PDF
            </button>
          </div>

          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
            <tbody>
              <tr style={{ background: '#F8FAFC', fontWeight: 800, color: '#1E293B' }}>
                <td style={{ padding: '10px 12px' }} colSpan={2}>1. REVENUE (INCOME)</td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>AED</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '8px 24px' }}>Secondary Sales Commission Fees (2.0%)</td>
                <td style={{ padding: '8px 12px', color: '#64748B' }}>Acct 4010</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>1,280,000.00</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '8px 24px' }}>Off-Plan Developer Commissions (3.0% - 5.0%)</td>
                <td style={{ padding: '8px 12px', color: '#64748B' }}>Acct 4020</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>450,000.00</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '8px 24px' }}>Leasing & Tenancy Commission Fees (5.0%)</td>
                <td style={{ padding: '8px 12px', color: '#64748B' }}>Acct 4030</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>120,000.00</td>
              </tr>
              <tr style={{ background: '#F1F5F9', fontWeight: 800 }}>
                <td style={{ padding: '10px 12px' }} colSpan={2}>TOTAL REVENUE</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: '#10B981' }}>1,850,000.00</td>
              </tr>

              <tr style={{ background: '#F8FAFC', fontWeight: 800, color: '#1E293B' }}>
                <td style={{ padding: '10px 12px', paddingTop: '16px' }} colSpan={2}>2. OPERATING EXPENSES (42 MASTER REGISTER)</td>
                <td style={{ padding: '10px 12px', paddingTop: '16px', textAlign: 'right' }}>AED</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '8px 24px' }}>Marketing & Portal Subscriptions (CAT-01)</td>
                <td style={{ padding: '8px 12px', color: '#64748B' }}>Acct 5010-5080</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>245,000.00</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '8px 24px' }}>Commercial Rent & Office Overheads (CAT-02)</td>
                <td style={{ padding: '8px 12px', color: '#64748B' }}>Acct 6010-6090</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>380,000.00</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '8px 24px' }}>Government, RERA & DET Licensing (CAT-03)</td>
                <td style={{ padding: '8px 12px', color: '#64748B' }}>Acct 7010-7100</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>95,000.00</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '8px 24px' }}>Field Logistics & Transportation (CAT-04)</td>
                <td style={{ padding: '8px 12px', color: '#64748B' }}>Acct 8010-8060</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>42,000.00</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '8px 24px' }}>SaaS, Tech & Professional Services (CAT-05)</td>
                <td style={{ padding: '8px 12px', color: '#64748B' }}>Acct 9010-9060</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>88,000.00</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #F1F5F9' }}>
                <td style={{ padding: '8px 24px' }}>Agent Commission Splits & Payouts</td>
                <td style={{ padding: '8px 12px', color: '#64748B' }}>Acct 5000</td>
                <td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 700 }}>370,000.00</td>
              </tr>
              <tr style={{ background: '#F1F5F9', fontWeight: 800 }}>
                <td style={{ padding: '10px 12px' }} colSpan={2}>TOTAL OPERATING EXPENSES</td>
                <td style={{ padding: '10px 12px', textAlign: 'right', color: '#EF4444' }}>1,220,000.00</td>
              </tr>

              <tr style={{ background: '#ECFDF5', fontWeight: 900, fontSize: '0.95rem', borderTop: '2px solid #10B981' }}>
                <td style={{ padding: '14px 12px', color: '#065F46' }} colSpan={2}>NET OPERATING PROFIT (EBIT)</td>
                <td style={{ padding: '14px 12px', textAlign: 'right', color: '#047857' }}>AED 630,000.00</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}

      {statementType === 'audit-pack' && (
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1E293B', marginBottom: '0.5rem' }}>
            <Shield size={22} color="#8B5CF6" />
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800 }}>
              Official Regulatory Financial Audit Pack (RERA & Statutory)
            </h3>
          </div>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.82rem', color: '#64748B' }}>
            Complete compiled audit binder containing digital receipts, TRN verified invoices, bank reconciliation logs, and Form 201 VAT filings.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <div style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.9rem' }}>📁 RERA Compliance Binder</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>Escrow audit trails, Form 12 records, broker card renewals</div>
              <button style={{ marginTop: '0.75rem', background: '#1E293B', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                Download ZIP
              </button>
            </div>

            <div style={{ padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', background: '#F8FAFC' }}>
              <div style={{ fontWeight: 800, color: '#1E293B', fontSize: '0.9rem' }}>📁 FTA Tax & VAT Ledger</div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>Quarterly Form 201 summaries, input VAT receipts, TRN verification</div>
              <button style={{ marginTop: '0.75rem', background: '#1E293B', color: '#FFFFFF', border: 'none', borderRadius: '6px', padding: '5px 12px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {statementType === 'balance-sheet' && (
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#1E293B' }}>
            Balance Sheet & General Ledger Snapshot
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontWeight: 800, color: '#1E293B' }}>Total Current Assets</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#10B981', marginTop: '0.25rem' }}>AED 1,420,000</div>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Cash at Bank (Wio), AR, Security Deposits (1210)</div>
            </div>
            <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontWeight: 800, color: '#1E293B' }}>Total Current Liabilities</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#EF4444', marginTop: '0.25rem' }}>AED 285,000</div>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>VAT Payable, Unpaid Broker Commissions</div>
            </div>
            <div style={{ padding: '1rem', background: '#F8FAFC', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
              <div style={{ fontWeight: 800, color: '#1E293B' }}>Owner's Equity & Retained Earnings</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#8B5CF6', marginTop: '0.25rem' }}>AED 1,135,000</div>
              <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Includes Director's Loan Account (2110)</div>
            </div>
          </div>
        </div>
      )}

      {statementType === 'cash-flow' && (
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', padding: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', fontWeight: 800, color: '#1E293B' }}>
            Cash Flow & Wio Business Bank Reconciliation
          </h3>
          <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
            Live cash balance: <strong>AED 890,500</strong> across Wio Business Corporate Accounts.
          </p>
        </div>
      )}
    </div>
  );
};

export default FinancialStatementsTab;
