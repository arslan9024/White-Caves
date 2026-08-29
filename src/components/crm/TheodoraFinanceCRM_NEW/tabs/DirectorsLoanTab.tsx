import React, { useState, useEffect } from 'react';
import { CreditCard, ArrowUpRight, CheckCircle2, AlertCircle, RefreshCw, DollarSign, Wallet } from 'lucide-react';

export const DirectorsLoanTab: React.FC = () => {
  const [stats, setStats] = useState({
    currency: 'AED',
    totalAdvances: 48500,
    reimbursed: 22000,
    outstanding: 26500,
    transactionCount: 8,
  });
  const [loading, setLoading] = useState(false);
  const [reimbursing, setReimbursing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const [advances, setAdvances] = useState([
    {
      id: 'ADV-2026-001',
      date: '2026-08-20',
      description: 'Property Finder Portal August Subscription (EXP-101)',
      amount: 14500,
      status: 'OUTSTANDING',
      cardUsed: 'Director Personal Visa Platinum (Ending 4092)',
      expenseCode: '5010',
    },
    {
      id: 'ADV-2026-002',
      date: '2026-08-18',
      description: 'Commercial Office Ejari State Registration (EXP-203)',
      amount: 1200,
      status: 'OUTSTANDING',
      cardUsed: 'Director Personal Visa Platinum (Ending 4092)',
      expenseCode: '6020',
    },
    {
      id: 'ADV-2026-003',
      date: '2026-08-15',
      description: 'DEWA Office Utilities Connection Deposit & Initial Bill (EXP-204)',
      amount: 10800,
      status: 'OUTSTANDING',
      cardUsed: 'Director Personal Mastercard (Ending 1184)',
      expenseCode: '6030',
    },
    {
      id: 'ADV-2026-004',
      date: '2026-08-10',
      description: 'DET Trade License Annual Renewal State Fee (EXP-301)',
      amount: 15000,
      status: 'REIMBURSED',
      cardUsed: 'Director Personal Visa Platinum (Ending 4092)',
      expenseCode: '7010',
      reimbursementRef: 'WIO-TX-984210',
    },
    {
      id: 'ADV-2026-005',
      date: '2026-08-05',
      description: 'RERA Broker Card Issuance for 2 Senior Agents (EXP-303)',
      amount: 7000,
      status: 'REIMBURSED',
      cardUsed: 'Director Personal Mastercard (Ending 1184)',
      expenseCode: '7030',
      reimbursementRef: 'WIO-TX-984180',
    },
  ]);

  const handleReimburseAll = () => {
    setReimbursing(true);
    setTimeout(() => {
      setAdvances(prev =>
        prev.map(a =>
          a.status === 'OUTSTANDING'
            ? { ...a, status: 'REIMBURSED', reimbursementRef: `WIO-TX-${Math.floor(100000 + Math.random() * 900000)}` }
            : a
        )
      );
      setStats(prev => ({
        ...prev,
        reimbursed: prev.totalAdvances,
        outstanding: 0,
      }));
      setReimbursing(false);
      setSuccessMsg('Successfully created Wio Business reimbursement batch settlement for AED 26,500.');
      setTimeout(() => setSuccessMsg(''), 5000);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <div style={{ background: 'var(--white, #FFFFFF)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary, #64748B)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <span>Total Advances (Owner Equity)</span>
            <Wallet size={18} color="#8B5CF6" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)', marginTop: '0.5rem' }}>
            AED {stats.totalAdvances.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748B)', marginTop: '0.25rem' }}>
            {advances.length} Out-of-pocket transactions recorded
          </div>
        </div>

        <div style={{ background: 'var(--white, #FFFFFF)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--text-secondary, #64748B)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <span>Settled & Reimbursed</span>
            <CheckCircle2 size={18} color="#10B981" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-green, #10B981)', marginTop: '0.5rem' }}>
            AED {stats.reimbursed.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748B)', marginTop: '0.25rem' }}>
            Reimbursed via corporate Wio account
          </div>
        </div>

        <div style={{ background: 'linear-gradient(135deg, var(--color-fffbeb, #FFFBEB) 0%, var(--color-fef3c7, #FEF3C7) 100%)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--color-fcd34d, #FCD34D)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', color: 'var(--color-92400e, #92400E)', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase' }}>
            <span>Outstanding Director Advance</span>
            <AlertCircle size={18} color="#D97706" />
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-b45309, #B45309)', marginTop: '0.5rem' }}>
            AED {stats.outstanding.toLocaleString()}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--color-92400e, #92400E)', marginTop: '0.25rem' }}>
            Tax-free corporate reimbursement available
          </div>
        </div>
      </div>

      {successMsg && (
        <div style={{ background: 'var(--color-ecfdf5, #ECFDF5)', border: '1px solid var(--color-a7f3d0, #A7F3D0)', padding: '0.85rem 1rem', borderRadius: '8px', color: 'var(--color-065f46, #065F46)', fontSize: '0.85rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle2 size={18} color="#10B981" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
            Director's Loan Account (Owner's Equity Advance Ledger)
          </h3>
          <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: 'var(--text-secondary, #64748B)' }}>
            Tracking personal credit card outlays during corporate account setup. 100% compliant with UAE Corporate Tax rules.
          </p>
        </div>

        {stats.outstanding > 0 && (
          <button
            onClick={handleReimburseAll}
            disabled={reimbursing}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'var(--accent-amber, #D97706)',
              color: 'var(--white, #FFFFFF)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px 16px',
              fontWeight: 800,
              fontSize: '0.85rem',
              cursor: reimbursing ? 'not-allowed' : 'pointer',
              boxShadow: '0 2px 4px rgba(217, 119, 6, 0.2)',
            }}
          >
            <RefreshCw size={16} className={reimbursing ? 'animate-spin' : ''} />
            <span>{reimbursing ? 'Processing Wio Settlement...' : '1-Click Settle Outstandings via Wio'}</span>
          </button>
        )}
      </div>

      {/* Advance Transactions Table */}
      <div style={{ background: 'var(--white, #FFFFFF)', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ background: 'var(--color-f8fafc, #F8FAFC)', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', color: 'var(--color-475569, #475569)', fontWeight: 800 }}>
              <th style={{ padding: '12px 16px' }}>Advance ID</th>
              <th style={{ padding: '12px 16px' }}>Date</th>
              <th style={{ padding: '12px 16px' }}>Description & Expense Code</th>
              <th style={{ padding: '12px 16px' }}>Funding Card</th>
              <th style={{ padding: '12px 16px' }}>Amount</th>
              <th style={{ padding: '12px 16px' }}>Status</th>
              <th style={{ padding: '12px 16px' }}>Settlement Ref</th>
            </tr>
          </thead>
          <tbody>
            {advances.map(item => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--color-f1f5f9, #F1F5F9)' }}>
                <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>{item.id}</td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary, #64748B)' }}>{item.date}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ fontWeight: 700, color: 'var(--color-1e293b, #1E293B)' }}>{item.description}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent-purple, #8B5CF6)', fontWeight: 800 }}>Ledger Code: {item.expenseCode}</div>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary, #64748B)', fontSize: '0.78rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <CreditCard size={14} color="#64748B" />
                    <span>{item.cardUsed}</span>
                  </div>
                </td>
                <td style={{ padding: '12px 16px', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
                  AED {item.amount.toLocaleString()}
                </td>
                <td style={{ padding: '12px 16px' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      padding: '3px 8px',
                      borderRadius: '4px',
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      background: item.status === 'REIMBURSED' ? '#ECFDF5' : '#FEF3C7',
                      color: item.status === 'REIMBURSED' ? '#047857' : '#B45309',
                    }}
                  >
                    {item.status}
                  </span>
                </td>
                <td style={{ padding: '12px 16px', color: 'var(--text-secondary, #64748B)', fontSize: '0.78rem', fontFamily: 'monospace' }}>
                  {item.reimbursementRef || '—'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DirectorsLoanTab;
