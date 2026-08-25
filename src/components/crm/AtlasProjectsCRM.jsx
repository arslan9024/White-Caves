import React, { useState, useEffect } from 'react';
import { 
  Map, Building, Calculator, Grid, Target,
  Calendar, Users, TrendingUp, Clock, CheckCircle,
  ArrowUp, ArrowDown, Filter, Search, Eye, Plus, MapPin,
  AlertTriangle, ShieldCheck, DollarSign, Download, Percent
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import './AssistantDashboard.css';

export const AtlasProjectsCRM = ({ moduleId, role, user }) => {
  const [activeTab, setActiveTab] = useState('tracker');

  useEffect(() => {
    if (!moduleId) return;
    if (moduleId.includes('delay')) setActiveTab('delay');
    else if (moduleId.includes('payment')) setActiveTab('payment-plans');
    else if (moduleId.includes('roi')) setActiveTab('roi');
    else if (moduleId.includes('tracker')) setActiveTab('tracker');
  }, [moduleId]);

  // Feature 1: Developer Project Matrix
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDeveloper, setSelectedDeveloper] = useState('ALL');

  const [projects, setProjects] = useState([
    { id: 1, name: 'Marina Vista Tower', developer: 'Emaar', area: 'Dubai Marina', units: 450, completion: 'Q4 2026', progressPct: 78, escrowBalance: 'AED 380M', status: 'ON_TRACK', expectedYield: '8.5%' },
    { id: 2, name: 'Business Bay Heights', developer: 'DAMAC', area: 'Business Bay', units: 320, completion: 'Q2 2027', progressPct: 45, escrowBalance: 'AED 210M', status: 'ON_TRACK', expectedYield: '9.2%' },
    { id: 3, name: 'Creek Harbour Residences', developer: 'Emaar', area: 'Dubai Creek', units: 680, completion: 'Q1 2028', progressPct: 22, escrowBalance: 'AED 540M', status: 'ON_TRACK', expectedYield: '7.8%' },
    { id: 4, name: 'Palm Gateway Penthouse', developer: 'Nakheel', area: 'Palm Jumeirah', units: 120, completion: 'Q4 2026', progressPct: 88, escrowBalance: 'AED 890M', status: 'AHEAD_OF_SCHEDULE', expectedYield: '11.4%' },
  ]);

  // Feature 2: Delay Estimator
  const [delayProject, setDelayProject] = useState('Business Bay Heights');
  const [scheduledHandover, setScheduledHandover] = useState('2027-06-30');
  const [currentDldProgress, setCurrentDldProgress] = useState(45);
  const [foundationMonths, setFoundationMonths] = useState(8);

  const calculateDelay = () => {
    const requiredProgress = 60;
    const progressGap = Math.max(0, requiredProgress - currentDldProgress);
    const estimatedDelayMonths = Math.round(progressGap * 0.4);
    const revisedDate = new Date(scheduledHandover);
    revisedDate.setMonth(revisedDate.getMonth() + estimatedDelayMonths);
    return {
      gap: progressGap,
      delayMonths: estimatedDelayMonths,
      revisedHandover: revisedDate.toISOString().split('T')[0],
      riskTier: estimatedDelayMonths > 4 ? 'HIGH_VARIANCE' : estimatedDelayMonths > 0 ? 'MODERATE' : 'ON_SCHEDULE',
    };
  };
  const delayResult = calculateDelay();

  // Feature 3: Payment Plan Builder
  const [propertyPrice, setPropertyPrice] = useState(2500000);
  const [downpaymentPct, setDownpaymentPct] = useState(20);
  const [duringConstructionPct, setDuringConstructionPct] = useState(50);
  const [postHandoverPct, setPostHandoverPct] = useState(30);

  const dpAmount = (propertyPrice * (downpaymentPct / 100));
  const duringAmount = (propertyPrice * (duringConstructionPct / 100));
  const postAmount = (propertyPrice * (postHandoverPct / 100));

  // Feature 4: Off-Plan ROI & Capital Gain Simulator
  const [purchasePrice, setPurchasePrice] = useState(2000000);
  const [expectedHandoverPrice, setExpectedHandoverPrice] = useState(2700000);
  const [annualRent, setAnnualRent] = useState(190000);

  const capitalGain = expectedHandoverPrice - purchasePrice;
  const capitalGainPct = ((capitalGain / purchasePrice) * 100).toFixed(1);
  const grossRentalYield = ((annualRent / expectedHandoverPrice) * 100).toFixed(2);

  return (
    <div className="crm-container" style={{ maxWidth: '100%', padding: '0.5rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, var(--color-7c2d12, #7C2D12) 0%, var(--color-451a03, #451A03) 100%)', color: 'var(--white, #FFFFFF)', padding: '1.25rem 1.5rem', borderRadius: '16px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, var(--color-f97316, #F97316) 0%, var(--color-ea580c, #EA580C) 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            🏛️
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>Atlas AI — Off-Plan Projects & Construction</h2>
              <span style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.15)', padding: '2px 8px', borderRadius: '4px', color: 'var(--color-fed7aa, #FED7AA)', fontWeight: 800 }}>
                Escrow & DLD Milestone Radar
              </span>
            </div>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: 'var(--color-ffedd5, #FFEDD5)' }}>
              Real-time developer milestone tracking, construction delay variance algorithms, payment plan generators & ROI models.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: 'var(--white, #FFFFFF)', padding: '8px 12px', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)', marginBottom: '1.25rem' }}>
        <button onClick={() => setActiveTab('tracker')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'tracker' ? '1px solid var(--color-ea580c, #EA580C)' : '1px solid transparent', background: activeTab === 'tracker' ? 'var(--color-ea580c, #EA580C)' : 'var(--color-f8fafc, #F8FAFC)', color: activeTab === 'tracker' ? 'var(--white, #FFF)' : 'var(--color-334155, #334155)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.7.3 Developer Tracker
        </button>
        <button onClick={() => setActiveTab('delay')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'delay' ? '1px solid var(--color-ea580c, #EA580C)' : '1px solid transparent', background: activeTab === 'delay' ? 'var(--color-ea580c, #EA580C)' : 'var(--color-f8fafc, #F8FAFC)', color: activeTab === 'delay' ? 'var(--white, #FFF)' : 'var(--color-334155, #334155)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.7.1 Construction Delay Estimator
        </button>
        <button onClick={() => setActiveTab('payment-plans')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'payment-plans' ? '1px solid var(--color-ea580c, #EA580C)' : '1px solid transparent', background: activeTab === 'payment-plans' ? 'var(--color-ea580c, #EA580C)' : 'var(--color-f8fafc, #F8FAFC)', color: activeTab === 'payment-plans' ? 'var(--white, #FFF)' : 'var(--color-334155, #334155)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.7.2 Payment Plan Builder
        </button>
        <button onClick={() => setActiveTab('roi')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'roi' ? '1px solid var(--color-ea580c, #EA580C)' : '1px solid transparent', background: activeTab === 'roi' ? 'var(--color-ea580c, #EA580C)' : 'var(--color-f8fafc, #F8FAFC)', color: activeTab === 'roi' ? 'var(--white, #FFF)' : 'var(--color-334155, #334155)', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.7.4 Off-Plan ROI Simulator
        </button>
      </div>

      {/* Tab 1: Tracker */}
      {activeTab === 'tracker' && (
        <div style={{ background: 'var(--white, #FFFFFF)', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)', overflow: 'hidden' }}>
          <div style={{ padding: '0.75rem 1rem', background: 'var(--color-f8fafc, #F8FAFC)', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--color-1e293b, #1E293B)' }}>Master Developer Off-Plan Matrix</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748B)', fontWeight: 700 }}>4 Active Key Projects</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: 'var(--color-f8fafc, #F8FAFC)', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', color: 'var(--color-475569, #475569)', fontWeight: 800 }}>
                <th style={{ padding: '10px 14px' }}>Project Name</th>
                <th style={{ padding: '10px 14px' }}>Developer</th>
                <th style={{ padding: '10px 14px' }}>Location</th>
                <th style={{ padding: '10px 14px' }}>DLD Progress</th>
                <th style={{ padding: '10px 14px' }}>DLD Escrow Balance</th>
                <th style={{ padding: '10px 14px' }}>Target Handover</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {projects.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--color-f1f5f9, #F1F5F9)' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>{p.name}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--color-ea580c, #EA580C)' }}>{p.developer}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary, #64748B)' }}>{p.area}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{ width: '80px', height: '6px', background: 'var(--text-secondary, #E2E8F0)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ width: `${p.progressPct}%`, height: '100%', background: 'var(--color-ea580c, #EA580C)' }} />
                      </div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800 }}>{p.progressPct}%</span>
                    </div>
                  </td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: 'var(--accent-green, #10B981)' }}>{p.escrowBalance}</td>
                  <td style={{ padding: '10px 14px', color: 'var(--text-secondary, #64748B)' }}>{p.completion}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, background: 'var(--color-ecfdf5, #ECFDF5)', color: 'var(--color-047857, #047857)' }}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Delay Estimator */}
      {activeTab === 'delay' && (
        <div style={{ background: 'var(--white, #FFFFFF)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
            Construction Delay & Handover Variance Estimator
          </h4>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: 'var(--text-secondary, #64748B)' }}>
            Compares live DLD audit progress against schedule milestones to project handover delays and escrow liquidity risks.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)', display: 'block', marginBottom: '4px' }}>Select Project</label>
              <select value={delayProject} onChange={e => setDelayProject(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.8rem', fontWeight: 700 }}>
                {projects.map(p => <option key={p.id} value={p.name}>{p.name} ({p.developer})</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)', display: 'block', marginBottom: '4px' }}>DLD Verified Progress ({currentDldProgress}%)</label>
              <input type="range" min="5" max="100" value={currentDldProgress} onChange={e => setCurrentDldProgress(Number(e.target.value))} style={{ width: '100%' }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)', display: 'block', marginBottom: '4px' }}>Scheduled Handover</label>
              <input type="date" value={scheduledHandover} onChange={e => setScheduledHandover(e.target.value)} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.8rem' }} />
            </div>
          </div>

          <div style={{ background: 'var(--color-fff7ed, #FFF7ED)', border: '1px solid var(--color-ffedd5, #FFEDD5)', padding: '1.25rem', borderRadius: '8px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-9a3412, #9A3412)', fontWeight: 800 }}>ESTIMATED DELAY</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-c2410c, #C2410C)', marginTop: '4px' }}>{delayResult.delayMonths} Months</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-9a3412, #9A3412)', fontWeight: 800 }}>REVISED HANDOVER DATE</div>
              <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-9a3412, #9A3412)', marginTop: '4px' }}>{delayResult.revisedHandover}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-9a3412, #9A3412)', fontWeight: 800 }}>RISK CLASSIFICATION</div>
              <div style={{ fontSize: '1rem', fontWeight: 800, color: delayResult.riskTier === 'HIGH_VARIANCE' ? 'var(--accent-red, #DC2626)' : 'var(--accent-gold, #D97706)', marginTop: '4px' }}>{delayResult.riskTier}</div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Payment Plan Builder */}
      {activeTab === 'payment-plans' && (
        <div style={{ background: 'var(--white, #FFFFFF)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
            Developer Payment Plan & Milestone Schedule Builder
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>Property Base Price (AED)</label>
                <input type="number" value={propertyPrice} onChange={e => setPropertyPrice(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem', fontWeight: 700 }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>Down Payment: {downpaymentPct}%</label>
                <input type="range" min="10" max="40" step="5" value={downpaymentPct} onChange={e => setDownpaymentPct(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>During Construction: {duringConstructionPct}%</label>
                <input type="range" min="30" max="70" step="5" value={duringConstructionPct} onChange={e => setDuringConstructionPct(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>Post-Handover / On Handover: {postHandoverPct}%</label>
                <input type="range" min="0" max="50" step="5" value={postHandoverPct} onChange={e => setPostHandoverPct(Number(e.target.value))} style={{ width: '100%' }} />
              </div>
            </div>

            <div style={{ background: 'var(--color-f8fafc, #F8FAFC)', padding: '1.25rem', borderRadius: '8px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
              <h5 style={{ margin: '0 0 1rem 0', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>Installment Breakdown</h5>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', fontSize: '0.85rem' }}>
                <span>1. Booking & Down Payment ({downpaymentPct}%):</span>
                <strong>AED {dpAmount.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', fontSize: '0.85rem' }}>
                <span>2. Construction Linked ({duringConstructionPct}%):</span>
                <strong>AED {duringAmount.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', fontSize: '0.85rem' }}>
                <span>3. On Handover ({postHandoverPct}%):</span>
                <strong>AED {postAmount.toLocaleString()}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0 0 0', fontWeight: 800, color: 'var(--color-ea580c, #EA580C)', fontSize: '0.95rem' }}>
                <span>Total Commitment:</span>
                <span>AED {propertyPrice.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: ROI Simulator */}
      {activeTab === 'roi' && (
        <div style={{ background: 'var(--white, #FFFFFF)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
            Off-Plan Capital Appreciation & Rental Yield Simulator
          </h4>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem', marginBottom: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>Off-Plan Launch Price (AED)</label>
              <input type="number" value={purchasePrice} onChange={e => setPurchasePrice(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem', fontWeight: 700 }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>Expected Handover Market Value (AED)</label>
              <input type="number" value={expectedHandoverPrice} onChange={e => setExpectedHandoverPrice(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem', fontWeight: 700 }} />
            </div>
            <div>
              <label style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary, #64748B)' }}>Projected Annual Rent (AED)</label>
              <input type="number" value={annualRent} onChange={e => setAnnualRent(Number(e.target.value))} style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)', fontSize: '0.85rem', fontWeight: 700 }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'var(--color-ecfdf5, #ECFDF5)', border: '1px solid var(--color-a7f3d0, #A7F3D0)', padding: '1.25rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-065f46, #065F46)', fontWeight: 800 }}>CAPITAL APPRECIATION UPON HANDOVER</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-047857, #047857)', marginTop: '4px' }}>
                AED {capitalGain.toLocaleString()} (+{capitalGainPct}%)
              </div>
            </div>
            <div style={{ background: 'var(--color-eff6ff, #EFF6FF)', border: '1px solid var(--color-bfdbfe, #BFDBFE)', padding: '1.25rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-1e40af, #1E40AF)', fontWeight: 800 }}>GROSS RENTAL YIELD AT HANDOVER</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-blue, #1D4ED8)', marginTop: '4px' }}>
                {grossRentalYield}% p.a.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AtlasProjectsCRM;
