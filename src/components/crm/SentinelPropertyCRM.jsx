import React, { useState, useEffect } from 'react';
import { 
  Building2, ShieldCheck, AlertTriangle, CheckCircle2, 
  RefreshCw, Lock, Radio, Activity, Eye, Search, Layers
} from 'lucide-react';
import './AssistantDashboard.css';

interface SentinelProps {
  moduleId?: string;
  role?: string;
  user?: any;
}

export const SentinelPropertyCRM: React.FC<SentinelProps> = ({ moduleId }) => {
  const [activeTab, setActiveTab] = useState<'lifecycle' | 'verification' | 'decommission' | 'telemetry'>('lifecycle');

  useEffect(() => {
    if (!moduleId) return;
    if (moduleId.includes('lifecycle')) setActiveTab('lifecycle');
    else if (moduleId.includes('verification')) setActiveTab('verification');
    else if (moduleId.includes('decommission')) setActiveTab('decommission');
    else if (moduleId.includes('telemetry')) setActiveTab('telemetry');
  }, [moduleId]);

  // Feature 1: Lifecycle State Machine
  const [properties, setProperties] = useState([
    { id: 'PROP-9021', title: 'Palm Jumeirah Signature Villa', currentStage: 'LISTED', reraVerified: true, priceAed: '45,000,000' },
    { id: 'PROP-9022', title: 'Downtown Burj Crown 3BR', currentStage: 'UNDER_OFFER', reraVerified: true, priceAed: '4,200,000' },
    { id: 'PROP-9023', title: 'Dubai Hills Golf Suite', currentStage: 'DRAFT_REVIEW', reraVerified: false, priceAed: '2,850,000' },
    { id: 'PROP-9024', title: 'Creek Horizon 2BR', currentStage: 'COMPLETED_SOLD', reraVerified: true, priceAed: '1,950,000' },
  ]);

  const advanceStage = (id: string) => {
    setProperties(prev => prev.map(p => {
      if (p.id !== id) return p;
      const order = ['DRAFT_REVIEW', 'LISTED', 'UNDER_OFFER', 'COMPLETED_SOLD', 'ARCHIVED'];
      const nextIdx = (order.indexOf(p.currentStage) + 1) % order.length;
      return { ...p, currentStage: order[nextIdx] };
    }));
  };

  // Feature 2: Quality Gate Checklist
  const [checklist, setChecklist] = useState({
    titleDeedVerified: true,
    formASigned: true,
    trakheesiPermitActive: true,
    hdPhotosApproved: true,
    floorplanUploaded: false,
    passportKycComplete: true,
  });

  const passedCount = Object.values(checklist).filter(Boolean).length;
  const isGateApproved = passedCount === 6;

  // Feature 4: IoT Telemetry
  const [sensorStatus, setSensorStatus] = useState('ALL_SENSORS_NORMAL');

  return (
    <div className="crm-container" style={{ maxWidth: '100%', padding: '0.5rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #1E3A8A 0%, #172554 100%)', color: '#FFFFFF', padding: '1.25rem 1.5rem', borderRadius: '16px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            🏢
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>Sentinel AI — Property State Machine & Quality</h2>
              <span style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.15)', padding: '2px 8px', borderRadius: '4px', color: '#BFDBFE', fontWeight: 800 }}>
                Inventory Quality Control
              </span>
            </div>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#DBEAFE' }}>
              Property state transition engine, mandatory RERA listing verification gate, and IoT sensor telemetry monitoring.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: '#FFFFFF', padding: '8px 12px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
        <button onClick={() => setActiveTab('lifecycle')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'lifecycle' ? '1px solid #2563EB' : '1px solid transparent', background: activeTab === 'lifecycle' ? '#2563EB' : '#F8FAFC', color: activeTab === 'lifecycle' ? '#FFF' : '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.20.1 Lifecycle State Machine
        </button>
        <button onClick={() => setActiveTab('verification')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'verification' ? '1px solid #2563EB' : '1px solid transparent', background: activeTab === 'verification' ? '#2563EB' : '#F8FAFC', color: activeTab === 'verification' ? '#FFF' : '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.20.2 Listing Quality Gate
        </button>
        <button onClick={() => setActiveTab('decommission')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'decommission' ? '1px solid #2563EB' : '1px solid transparent', background: activeTab === 'decommission' ? '#2563EB' : '#F8FAFC', color: activeTab === 'decommission' ? '#FFF' : '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.20.3 Decommission Flow
        </button>
        <button onClick={() => setActiveTab('telemetry')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'telemetry' ? '1px solid #2563EB' : '1px solid transparent', background: activeTab === 'telemetry' ? '#2563EB' : '#F8FAFC', color: activeTab === 'telemetry' ? '#FFF' : '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.20.4 IoT Telemetry Hub
        </button>
      </div>

      {/* Tab 1: State Machine */}
      {activeTab === 'lifecycle' && (
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <div style={{ padding: '0.75rem 1rem', background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: 800, fontSize: '0.9rem', color: '#1E293B' }}>Managed Units State Machine</span>
            <span style={{ fontSize: '0.75rem', color: '#2563EB', fontWeight: 800 }}>Click Stage to Transition</span>
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 800 }}>
                <th style={{ padding: '10px 14px' }}>Property Ref</th>
                <th style={{ padding: '10px 14px' }}>Title & Description</th>
                <th style={{ padding: '10px 14px' }}>Price</th>
                <th style={{ padding: '10px 14px' }}>Current Lifecycle State</th>
                <th style={{ padding: '10px 14px' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {properties.map(p => (
                <tr key={p.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 800, color: '#2563EB' }}>{p.id}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1E293B' }}>{p.title}</td>
                  <td style={{ padding: '10px 14px', color: '#64748B' }}>AED {p.priceAed}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 800, background: p.currentStage === 'LISTED' ? '#ECFDF5' : p.currentStage === 'UNDER_OFFER' ? '#FEF3C7' : '#EFF6FF', color: p.currentStage === 'LISTED' ? '#047857' : p.currentStage === 'UNDER_OFFER' ? '#B45309' : '#1E40AF' }}>
                      {p.currentStage}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <button onClick={() => advanceStage(p.id)} style={{ background: '#F1F5F9', border: '1px solid #CBD5E1', borderRadius: '6px', padding: '4px 10px', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <RefreshCw size={12} /> Advance Stage
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Quality Gate */}
      {activeTab === 'verification' && (
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>
            Listing Verification Quality Gate (6-Pillar Compliance Check)
          </h4>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: '#64748B' }}>
            All 6 criteria must be verified before a property is permitted to be broadcast to Bayut, Property Finder, and website portals.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {Object.entries(checklist).map(([key, val]) => (
              <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', cursor: 'pointer', background: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0' }}>
                <input type="checkbox" checked={val} onChange={e => setChecklist({ ...checklist, [key]: e.target.checked })} />
                <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
              </label>
            ))}
          </div>

          <div style={{ background: isGateApproved ? '#ECFDF5' : '#FEF2F2', border: `1px solid ${isGateApproved ? '#A7F3D0' : '#FECACA'}`, padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 800, color: isGateApproved ? '#065F46' : '#991B1B', fontSize: '0.9rem' }}>
                {isGateApproved ? '✓ Gate Approved: Ready for Multi-Portal Syndication' : `⚠️ Incomplete: ${passedCount}/6 Criteria Met`}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '2px' }}>
                {isGateApproved ? 'Trakheesi barcode generated and locked.' : 'Floorplan and KYC documents must be uploaded before launch.'}
              </div>
            </div>
            {isGateApproved && (
              <button style={{ background: '#047857', color: '#FFF', border: 'none', borderRadius: '6px', padding: '6px 14px', fontWeight: 800, fontSize: '0.78rem', cursor: 'pointer' }}>
                Publish Syndication
              </button>
            )}
          </div>
        </div>
      )}

      {/* Tab 3: Decommission */}
      {activeTab === 'decommission' && (
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>
            Asset Decommissioning & Statutory Archive Protocol
          </h4>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: '#64748B' }}>
            Locks completed deals into permanent read-only archive vault complying with UAE PDPL 5-year data retention law.
          </p>
        </div>
      )}

      {/* Tab 4: Telemetry */}
      {activeTab === 'telemetry' && (
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>
            IoT Smart Property Sensors & Access Telemetry
          </h4>
          <p style={{ margin: '0 0 1.25rem 0', fontSize: '0.8rem', color: '#64748B' }}>
            Real-time telemetry from smart lockboxes, DEWA smart meters, and AC temperature sensors in managed luxury properties.
          </p>
          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '1rem', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', color: '#1D4ED8', fontWeight: 800 }}>
            <Activity size={18} />
            <span>Telemetry Pulse: 14 Smart Lockboxes Online | 0 Security Breaches</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default SentinelPropertyCRM;
