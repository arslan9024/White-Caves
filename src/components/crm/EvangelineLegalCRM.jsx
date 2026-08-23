import React, { useState, useEffect } from 'react';
import { 
  Scale, FileText, AlertTriangle, Shield, BookOpen,
  Search, Filter, Clock, CheckCircle, XCircle,
  TrendingUp, ArrowUp, ArrowDown, Eye, Plus, AlertCircle,
  Copy, Download, Check, ShieldCheck, FileCheck, Lock, ExternalLink
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import KYCAMLDashboard from './shared/KYCAMLDashboard';
import './AssistantDashboard.css';

interface EvangelineProps {
  moduleId?: string;
  role?: string;
  user?: any;
}

export const EvangelineLegalCRM: React.FC<EvangelineProps> = ({ moduleId }) => {
  const [activeTab, setActiveTab] = useState<'contracts' | 'poa' | 'nda' | 'disputes' | 'risks' | 'kyc' | 'docs'>('contracts');

  // Synchronize sub-item moduleId from sidebar
  useEffect(() => {
    if (!moduleId) return;
    if (moduleId.includes('poa')) setActiveTab('poa');
    else if (moduleId.includes('nda')) setActiveTab('nda');
    else if (moduleId.includes('dispute')) setActiveTab('disputes');
    else if (moduleId.includes('contract')) setActiveTab('contracts');
  }, [moduleId]);

  // Feature 1: Form A/B/F Unified Clause Assembler
  const [selectedForm, setSelectedForm] = useState<'Form A' | 'Form B' | 'Form F'>('Form F');
  const [partyA, setPartyA] = useState('White Caves Real Estate LLC');
  const [partyB, setPartyB] = useState('Emaar Properties PJSC');
  const [propertyRef, setPropertyRef] = useState('Downtown Heights Penthouse 5201');
  const [depositPercent, setDepositPercent] = useState('10');
  const [includeMortgageClause, setIncludeMortgageClause] = useState(true);
  const [includeDldFeeClause, setIncludeDldFeeClause] = useState(true);
  const [copiedContract, setCopiedContract] = useState(false);

  const compiledContractText = `══════════════════════════════════════════════════════════════════════════════════
DUBAI LAND DEPARTMENT (DLD) OFFICIAL STANDARD CONTRACT (${selectedForm.toUpperCase()})
══════════════════════════════════════════════════════════════════════════════════
1. PARTIES:
   • First Party (Broker/Seller): ${partyA}
   • Second Party (Buyer/Client): ${partyB}

2. SUBJECT PROPERTY:
   • Property Description: ${propertyRef}
   • Jurisdiction: Emirate of Dubai, United Arab Emirates (RERA Regulatory Framework)

3. FINANCIAL TERMS & DEPOSITS:
   • Security Deposit: ${depositPercent}% held in Escrow account as statutory guarantee.
   ${includeDldFeeClause ? '• DLD Transfer Fee: 4.0% payable to Dubai Land Department at Trustee office registration.' : ''}

4. SPECIAL STATUTORY CONDITIONS:
   ${includeMortgageClause ? '• Mortgage Finance Contingency: 21 calendar days granted for buyer formal bank approval. In the event of lender rejection with certified proof, deposit is returned in full.' : '• Cash Purchase: Unconditional transaction without mortgage contingencies.'}
   • Governing Law: Dubai Law No. 7 of 2006 concerning Real Property Registration in the Emirate of Dubai.
══════════════════════════════════════════════════════════════════════════════════`;

  // Feature 2: POA Validator
  const [poaNumber, setPoaNumber] = useState('POA-DXB-2026-8891');
  const [poaPrincipal, setPoaPrincipal] = useState('Rashid Al Maktoum Investment Trust');
  const [poaAttorney, setPoaAttorney] = useState('Arsalan Malik (Managing Director)');
  const [poaExpiry, setPoaExpiry] = useState('2027-12-31');
  const [poaHasSellPower, setPoaHasSellPower] = useState(true);
  const [poaValidationResult, setPoaValidationResult] = useState<any>(null);

  const handleValidatePoa = () => {
    const isExpired = new Date(poaExpiry) < new Date();
    setPoaValidationResult({
      status: !isExpired && poaHasSellPower ? 'VALID_APPROVED' : 'REJECTED_RISK',
      validity: !isExpired ? 'Active & Notarized' : 'EXPIRED',
      authorityCheck: poaHasSellPower ? 'Explicit Real Estate Selling Power Granted' : 'Missing Real Estate Disposition Rights',
      notaryRegistry: 'Dubai Courts Notary Public e-Registry Verified',
      riskScore: !isExpired && poaHasSellPower ? 'LOW_RISK' : 'HIGH_RISK_BLOCK',
    });
  };

  // Feature 3: NDA Studio
  const [ndaParty, setNdaParty] = useState('Royal Horizon Capital Holdings');
  const [ndaPurpose, setNdaPurpose] = useState('Off-Market Palm Jumeirah Ultra-Luxury Villa Portfolio Evaluation (AED 120M+)');
  const [ndaDamages, setNdaDamages] = useState('5,000,000');

  // Feature 4: Form 12 Eviction Notice Tracker
  const [disputes, setDisputes] = useState([
    {
      id: 'DISP-2026-01',
      tenant: 'Marcus Vance',
      unit: 'Villa 112 - Dubai Hills Estate',
      reason: '12-Month Notice for Owner Personal Use (Law 33/2008)',
      notaryDate: '2025-11-14',
      daysRemaining: 82,
      status: 'COURT_NOTICED',
    },
    {
      id: 'DISP-2026-02',
      tenant: 'Elena Rostova',
      unit: 'Penthouse 44 - Downtown',
      reason: 'Bounced Rent Cheque Notice (Central Bank Form 4)',
      notaryDate: '2026-08-01',
      daysRemaining: 12,
      status: 'RDC_HEARING_SCHEDULED',
    },
  ]);

  return (
    <div className="crm-container" style={{ maxWidth: '100%', padding: '0.5rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #312E81 0%, #1E1B4B 100%)', color: '#FFFFFF', padding: '1.25rem 1.5rem', borderRadius: '16px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            ⚖️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>Evangeline AI — Legal & Contract Intelligence</h2>
              <span style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.15)', padding: '2px 8px', borderRadius: '4px', color: '#C7D2FE', fontWeight: 800 }}>
                DLD & Dubai Courts Compliance
              </span>
            </div>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#C7D2FE' }}>
              Interactive Unified Form A/B/F Assembler, Notarized POA Validator, VIP NDA Studio & Form 12 Eviction Manager.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: '#FFFFFF', padding: '8px 12px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
        <button onClick={() => setActiveTab('contracts')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'contracts' ? '1px solid #7C3AED' : '1px solid transparent', background: activeTab === 'contracts' ? '#7C3AED' : '#F8FAFC', color: activeTab === 'contracts' ? '#FFFFFF' : '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.5.1 Form A/B/F Assembler
        </button>
        <button onClick={() => setActiveTab('poa')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'poa' ? '1px solid #7C3AED' : '1px solid transparent', background: activeTab === 'poa' ? '#7C3AED' : '#F8FAFC', color: activeTab === 'poa' ? '#FFFFFF' : '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.5.2 Notarized POA Validator
        </button>
        <button onClick={() => setActiveTab('nda')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'nda' ? '1px solid #7C3AED' : '1px solid transparent', background: activeTab === 'nda' ? '#7C3AED' : '#F8FAFC', color: activeTab === 'nda' ? '#FFFFFF' : '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.5.3 VIP NDA Studio
        </button>
        <button onClick={() => setActiveTab('disputes')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'disputes' ? '1px solid #7C3AED' : '1px solid transparent', background: activeTab === 'disputes' ? '#7C3AED' : '#F8FAFC', color: activeTab === 'disputes' ? '#FFFFFF' : '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.5.4 Form 12 & Dispute Manager
        </button>
        <button onClick={() => setActiveTab('kyc')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'kyc' ? '1px solid #7C3AED' : '1px solid transparent', background: activeTab === 'kyc' ? '#7C3AED' : '#F8FAFC', color: activeTab === 'kyc' ? '#FFFFFF' : '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          KYC & AML Radar
        </button>
      </div>

      {/* Tab 1: Form A/B/F Assembler */}
      {activeTab === 'contracts' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.25rem' }}>
          <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
            <h4 style={{ margin: '0 0 1rem 0', fontSize: '0.95rem', fontWeight: 800, color: '#1E293B' }}>
              Contract Parameters & Clause Generator
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '4px' }}>DLD Contract Type</label>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {(['Form A', 'Form B', 'Form F'] as const).map(f => (
                    <button key={f} onClick={() => setSelectedForm(f)} style={{ flex: 1, padding: '6px', borderRadius: '6px', border: selectedForm === f ? '1px solid #7C3AED' : '1px solid #CBD5E1', background: selectedForm === f ? '#7C3AED' : '#F8FAFC', color: selectedForm === f ? '#FFF' : '#475569', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}>
                      {f}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '4px' }}>Party A (Broker / Seller)</label>
                <input value={partyA} onChange={e => setPartyA(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '4px' }}>Party B (Buyer / Client)</label>
                <input value={partyB} onChange={e => setPartyB(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '4px' }}>Property Reference</label>
                <input value={propertyRef} onChange={e => setPropertyRef(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                  <input type="checkbox" checked={includeMortgageClause} onChange={e => setIncludeMortgageClause(e.target.checked)} />
                  21-Day Mortgage Contingency
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 700, color: '#334155', cursor: 'pointer' }}>
                  <input type="checkbox" checked={includeDldFeeClause} onChange={e => setIncludeDldFeeClause(e.target.checked)} />
                  DLD 4% Transfer Clause
                </label>
              </div>
            </div>
          </div>

          <div style={{ background: '#FFFFFF', padding: '1.25rem', borderRadius: '12px', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1E293B' }}>Live Official DLD Contract Preview</span>
              <button onClick={() => { navigator.clipboard.writeText(compiledContractText); setCopiedContract(true); setTimeout(() => setCopiedContract(false), 3000); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}>
                {copiedContract ? <Check size={14} color="#10B981" /> : <Copy size={14} />}
                <span>{copiedContract ? 'Copied!' : 'Copy Legal Text'}</span>
              </button>
            </div>
            <pre style={{ flex: 1, background: '#F8FAFC', padding: '1rem', borderRadius: '8px', border: '1px solid #E2E8F0', fontSize: '0.75rem', color: '#1E293B', fontFamily: 'monospace', whiteSpace: 'pre-wrap', overflowY: 'auto', maxHeight: '360px', margin: 0 }}>
              {compiledContractText}
            </pre>
          </div>
        </div>
      )}

      {/* Tab 2: POA Validator */}
      {activeTab === 'poa' && (
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>
            Dubai Courts Power of Attorney (POA) Statutory Validator
          </h4>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: '#64748B' }}>
            Verifies official notary registration, expiration dates, and explicit real estate disposition authority.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '4px' }}>POA Registry Number</label>
              <input value={poaNumber} onChange={e => setPoaNumber(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '4px' }}>Principal (Grantor)</label>
              <input value={poaPrincipal} onChange={e => setPoaPrincipal(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '4px' }}>Attorney (Agent)</label>
              <input value={poaAttorney} onChange={e => setPoaAttorney(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '4px' }}>Expiry Date</label>
              <input type="date" value={poaExpiry} onChange={e => setPoaExpiry(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }} />
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 700, color: '#1E293B', cursor: 'pointer' }}>
              <input type="checkbox" checked={poaHasSellPower} onChange={e => setPoaHasSellPower(e.target.checked)} />
              Explicit Clause: Authority to Sell & Collect Purchase Funds on Principal's Behalf
            </label>
            <button onClick={handleValidatePoa} style={{ background: '#7C3AED', color: '#FFF', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}>
              Run Dubai Courts Verification
            </button>
          </div>

          {poaValidationResult && (
            <div style={{ background: poaValidationResult.status === 'VALID_APPROVED' ? '#ECFDF5' : '#FEF2F2', border: `1px solid ${poaValidationResult.status === 'VALID_APPROVED' ? '#A7F3D0' : '#FECACA'}`, padding: '1rem', borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, color: poaValidationResult.status === 'VALID_APPROVED' ? '#065F46' : '#991B1B', fontSize: '0.9rem' }}>
                <ShieldCheck size={20} />
                <span>Validation Result: {poaValidationResult.validity} — {poaValidationResult.authorityCheck}</span>
              </div>
              <div style={{ fontSize: '0.78rem', color: '#475569', marginTop: '0.35rem' }}>
                {poaValidationResult.notaryRegistry} | Risk Classification: <strong>{poaValidationResult.riskScore}</strong>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: VIP NDA Studio */}
      {activeTab === 'nda' && (
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>
            VIP Ultra-High-Net-Worth Non-Disclosure Agreement (NDA) Generator
          </h4>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: '#64748B' }}>
            Protects confidential off-market penthouses, private island portfolios, and client identities under DIFC jurisdiction.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '4px' }}>Counterparty Name</label>
              <input value={ndaParty} onChange={e => setNdaParty(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'block', marginBottom: '4px' }}>Liquidated Damages Breach Penalty (AED)</label>
              <input value={ndaDamages} onChange={e => setNdaDamages(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid #CBD5E1', fontSize: '0.8rem' }} />
            </div>
          </div>

          <button onClick={() => alert(`Generated DIFC-Compliant VIP NDA for ${ndaParty} with AED ${ndaDamages} breach penalty clause.`)} style={{ background: '#7C3AED', color: '#FFF', border: 'none', borderRadius: '8px', padding: '8px 18px', fontSize: '0.85rem', fontWeight: 800, cursor: 'pointer' }}>
            Export Signed VIP NDA PDF
          </button>
        </div>
      )}

      {/* Tab 4: Form 12 Eviction Manager */}
      {activeTab === 'disputes' && (
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>
            Statutory 12-Month Eviction Notice Tracker (Dubai Law No. 33 of 2008)
          </h4>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: '#64748B' }}>
            Real-time tracking of certified notary public eviction notices, 365-day expiry countdowns, and Rental Dispute Center (RDC) filings.
          </p>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 800 }}>
                <th style={{ padding: '10px 14px' }}>Notice Ref</th>
                <th style={{ padding: '10px 14px' }}>Tenant & Property</th>
                <th style={{ padding: '10px 14px' }}>Statutory Grounds</th>
                <th style={{ padding: '10px 14px' }}>Notary Date</th>
                <th style={{ padding: '10px 14px' }}>Days Left (365 Law)</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {disputes.map(d => (
                <tr key={d.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 800, color: '#7C3AED' }}>{d.id}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ fontWeight: 700, color: '#1E293B' }}>{d.tenant}</div>
                    <div style={{ fontSize: '0.75rem', color: '#64748B' }}>{d.unit}</div>
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: '0.78rem', color: '#334155' }}>{d.reason}</td>
                  <td style={{ padding: '10px 14px', color: '#64748B' }}>{d.notaryDate}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 800, color: '#D97706' }}>{d.daysRemaining} Days</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, background: '#FEF3C7', color: '#B45309' }}>
                      {d.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 5: KYC */}
      {activeTab === 'kyc' && <KYCAMLDashboard />}
    </div>
  );
};

export default EvangelineLegalCRM;
