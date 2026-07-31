import React, { useState } from 'react';
import { PiggyBank, FileText, DollarSign, Percent, CheckCircle } from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import AssistantLifecycleTab from './shared/AssistantLifecycleTab';
import './AssistantDashboard.css';

const APPLICATIONS = [
  {
    id: 1,
    client: 'Ahmad Al Rashidi',
    bank: 'Emirates NBD',
    amount: 'AED 6.8M',
    rate: '4.25%',
    ltv: '80%',
    status: 'approved',
    term: 25,
  },
  {
    id: 2,
    client: 'Priya Nair',
    bank: 'ADCB',
    amount: 'AED 1.4M',
    rate: '4.49%',
    ltv: '75%',
    status: 'processing',
    term: 20,
  },
  {
    id: 3,
    client: 'James Whitmore',
    bank: 'HSBC UAE',
    amount: 'AED 14.4M',
    rate: '3.99%',
    ltv: '80%',
    status: 'under_review',
    term: 15,
  },
  {
    id: 4,
    client: 'Fatima Al Suwaidi',
    bank: 'Dubai Islamic Bank',
    amount: 'AED 1.7M',
    rate: '4.10%',
    ltv: '80%',
    status: 'approved',
    term: 25,
  },
];

const BANKS = [
  {
    name: 'Emirates NBD',
    expats: true,
    maxLTV: '80%',
    minRate: '3.99%',
    processingDays: 7,
    minSalary: 'AED 15K',
  },
  {
    name: 'ADCB',
    expats: true,
    maxLTV: '75%',
    minRate: '4.25%',
    processingDays: 10,
    minSalary: 'AED 12K',
  },
  {
    name: 'Dubai Islamic Bank',
    expats: true,
    maxLTV: '85%',
    minRate: '4.10%',
    processingDays: 8,
    minSalary: 'AED 10K',
    sharia: true,
  },
  {
    name: 'HSBC UAE',
    expats: true,
    maxLTV: '80%',
    minRate: '3.99%',
    processingDays: 14,
    minSalary: 'AED 20K',
  },
  {
    name: 'Mashreq Bank',
    expats: true,
    maxLTV: '75%',
    minRate: '4.35%',
    processingDays: 7,
    minSalary: 'AED 12K',
  },
];

const statusColors = {
  approved: '#22C55E',
  processing: '#3B82F6',
  under_review: '#F59E0B',
  rejected: '#EF4444',
};

const SageCRM = () => {
  const [activeTab, setActiveTab] = useState('applications');
  const [calcPrice, setCalcPrice] = useState(2000000);
  const [calcDown, setCalcDown] = useState(20);
  const [calcRate, setCalcRate] = useState(4.25);
  const [calcYears, setCalcYears] = useState(25);

  const loanAmt = calcPrice * (1 - calcDown / 100);
  const monthlyRate = calcRate / 100 / 12;
  const n = calcYears * 12;
  const monthly =
    monthlyRate === 0
      ? loanAmt / n
      : (loanAmt * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
  const totalCost = monthly * n;

  const tabs = [
    { id: 'applications', label: '📋 Applications' },
    { id: 'calculator', label: '🧮 Calculator' },
    { id: 'banks', label: '🏦 Banks' },
    { id: 'docs', label: '📚 Docs' },
    { id: 'lifecycle', label: '🔄 Lifecycle' },
  ];

  return (
    <div className="assistant-dashboard sage">
      <div className="assistant-header">
        <div
          className="assistant-avatar"
          style={{ background: 'linear-gradient(135deg, var(--color-0ea5e9, #0EA5E9) 0%, var(--color-0369a1, #0369A1) 100%)' }}
        >
          <PiggyBank size={28} />
        </div>
        <div className="assistant-info">
          <h2>Sage — Mortgage & Financing Advisor</h2>
          <p>UAE mortgage calculations, bank comparisons and application tracking</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(14,165,233,0.15)', color: 'var(--color-0ea5e9, #0EA5E9)' }}
          >
            <FileText size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{APPLICATIONS.length}</span>
            <span className="stat-label">Applications</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--accent-green, #22C55E)' }}
          >
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {APPLICATIONS.filter(a => a.status === 'approved').length}
            </span>
            <span className="stat-label">Approved</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(227,30,36,0.15)', color: 'var(--color-e31e24, #E31E24)' }}
          >
            <DollarSign size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">AED 24.3M</span>
            <span className="stat-label">Total Financed</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(245,158,11,0.15)', color: 'var(--accent-gold, #F59E0B)' }}
          >
            <Percent size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">4.21%</span>
            <span className="stat-label">Avg Rate</span>
          </div>
        </div>
      </div>

      <div className="crm-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`crm-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'applications' && (
        <div className="tab-content">
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Bank</th>
                <th>Amount</th>
                <th>Rate</th>
                <th>LTV</th>
                <th>Term</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {APPLICATIONS.map(a => (
                <tr key={a.id}>
                  <td>
                    <strong>{a.client}</strong>
                  </td>
                  <td>{a.bank}</td>
                  <td>{a.amount}</td>
                  <td>{a.rate}</td>
                  <td>{a.ltv}</td>
                  <td>{a.term}yr</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        background: `${statusColors[a.status]}22`,
                        color: statusColors[a.status],
                      }}
                    >
                      {a.status.replace('_', ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'calculator' && (
        <div className="tab-content">
          <h3 style={{ marginBottom: 16 }}>UAE Mortgage Calculator</h3>
          <div
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 24 }}
          >
            {[
              {
                label: 'Property Price (AED)',
                key: 'calcPrice',
                val: calcPrice,
                setter: setCalcPrice,
                min: 100000,
                max: 50000000,
                step: 50000,
              },
              {
                label: 'Down Payment (%)',
                key: 'calcDown',
                val: calcDown,
                setter: setCalcDown,
                min: 20,
                max: 50,
                step: 1,
              },
              {
                label: 'Interest Rate (%)',
                key: 'calcRate',
                val: calcRate,
                setter: setCalcRate,
                min: 1,
                max: 10,
                step: 0.01,
              },
              {
                label: 'Term (Years)',
                key: 'calcYears',
                val: calcYears,
                setter: setCalcYears,
                min: 5,
                max: 25,
                step: 1,
              },
            ].map(f => (
              <div key={f.key}>
                <label
                  style={{ fontSize: 13, color: 'var(--text-secondary, #6b7280)', marginBottom: 4, display: 'block' }}
                >
                  {f.label}
                </label>
                <input
                  type="number"
                  value={f.val}
                  min={f.min}
                  max={f.max}
                  step={f.step}
                  onChange={e => f.setter(Number(e.target.value))}
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #e5e7eb',
                    fontSize: 14,
                  }}
                />
              </div>
            ))}
          </div>
          <div
            style={{
              background: '#f0f9ff',
              border: '1px solid #bae6fd',
              borderRadius: 12,
              padding: 20,
            }}
          >
            <h4 style={{ marginBottom: 16, color: 'var(--color-0369a1, #0369A1)' }}>Results</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
              {[
                { label: 'Loan Amount', value: `AED ${Math.round(loanAmt).toLocaleString()}` },
                { label: 'Monthly Payment', value: `AED ${Math.round(monthly).toLocaleString()}` },
                { label: 'Total Cost', value: `AED ${Math.round(totalCost).toLocaleString()}` },
              ].map(r => (
                <div
                  key={r.label}
                  style={{
                    textAlign: 'center',
                    background: '#fff',
                    borderRadius: 8,
                    padding: 14,
                    border: '1px solid #e0f2fe',
                  }}
                >
                  <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color-0ea5e9, #0EA5E9)' }}>{r.value}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary, #6b7280)', marginTop: 4 }}>{r.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'banks' && (
        <div className="tab-content">
          {BANKS.map(b => (
            <div
              key={b.name}
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 16,
                marginBottom: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
                <div>
                  <strong style={{ fontSize: 15 }}>{b.name}</strong>
                  {b.sharia && (
                    <span
                      style={{
                        marginLeft: 8,
                        background: '#F0FDF4',
                        color: '#166534',
                        borderRadius: 20,
                        padding: '2px 8px',
                        fontSize: 11,
                      }}
                    >
                      Sharia
                    </span>
                  )}
                </div>
                <span style={{ color: 'var(--color-e31e24, #E31E24)', fontWeight: 700 }}>From {b.minRate}</span>
              </div>
              <div
                style={{
                  display: 'flex',
                  gap: 16,
                  fontSize: 13,
                  color: '#374151',
                  flexWrap: 'wrap',
                }}
              >
                <span>Max LTV: {b.maxLTV}</span>
                <span>Processing: {b.processingDays} days</span>
                <span>Min Salary: {b.minSalary}</span>
                <span>Expats: {b.expats ? '✅' : '❌'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'docs' && (
        <AssistantDocsTab assistantId="sage" color="#0EA5E9" assistantName="Sage" />
      )}
      {activeTab === 'lifecycle' && (
        <AssistantLifecycleTab assistantId="sage" color="#0EA5E9" assistantName="Sage" />
      )}
    </div>
  );
};

export default SageCRM;
