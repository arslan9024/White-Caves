import React, { useState, useEffect } from 'react';
import { 
  Key, CheckSquare, Camera, AlertCircle, Wrench, 
  CheckCircle2, Clock, Download, FileText, Send
} from 'lucide-react';
import './AssistantDashboard.css';

export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

interface VestaProps {
  moduleId?: string;
  role?: string;
  user?: AuthUser;
}

export const VestaHandoverCRM: React.FC<VestaProps> = ({ moduleId }) => {
  const [activeTab, setActiveTab] = useState<'snagging' | 'checklist' | 'certificate' | 'contractor'>('snagging');

  useEffect(() => {
    if (!moduleId) return;
    if (moduleId.includes('snagging')) setActiveTab('snagging');
    else if (moduleId.includes('checklist')) setActiveTab('checklist');
    else if (moduleId.includes('certificate') || moduleId.includes('key')) setActiveTab('certificate');
    else if (moduleId.includes('contractor')) setActiveTab('contractor');
  }, [moduleId]);

  // Feature 1: Snagging Items
  const [snags, setSnags] = useState([
    { id: 'SNG-101', room: 'Master Bathroom', item: 'Marble countertop sealant hairline crack', priority: 'MEDIUM', contractor: 'Emaar Facilities', status: 'PENDING_FIX' },
    { id: 'SNG-102', room: 'Kitchen', item: 'Dishwasher electrical socket loose fit', priority: 'HIGH', contractor: 'Al Futtaim MEP', status: 'IN_PROGRESS' },
    { id: 'SNG-103', room: 'Living Area', item: 'Floor-to-ceiling glass sliding door friction', priority: 'LOW', contractor: 'Schüco Tech', status: 'RECTIFIED' },
  ]);

  // Feature 2: Handover Checklist
  const [checklist, setChecklist] = useState({
    dewaTransferred: true,
    empowerChilledWaterRegistered: true,
    accessCardsHandedOver: true,
    parkingRemoteVerified: true,
    snaggingReportSigned: true,
    ejariCertificateDelivered: true,
  });

  const allComplete = Object.values(checklist).every(Boolean);

  return (
    <div className="crm-container" style={{ maxWidth: '100%', padding: '0.5rem' }}>
      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg, #78350F 0%, #451A03 100%)', color: '#FFFFFF', padding: '1.25rem 1.5rem', borderRadius: '16px', marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>
            🔑
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800 }}>Vesta AI — Snagging, Move-In & Handover</h2>
              <span style={{ fontSize: '0.7rem', background: 'rgba(255, 255, 255, 0.15)', padding: '2px 8px', borderRadius: '4px', color: '#FEF3C7', fontWeight: 800 }}>
                Handover Protocol
              </span>
            </div>
            <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.82rem', color: '#FEF3C7' }}>
              Digital defect inspection reports, key handover certificates, DEWA/Empower onboarding, and contractor rectification SLA.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', background: '#FFFFFF', padding: '8px 12px', borderRadius: '12px', border: '1px solid #E2E8F0', marginBottom: '1.25rem' }}>
        <button onClick={() => setActiveTab('snagging')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'snagging' ? '1px solid #D97706' : '1px solid transparent', background: activeTab === 'snagging' ? '#D97706' : '#F8FAFC', color: activeTab === 'snagging' ? '#FFF' : '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.23.1 Digital Snagging Inspector
        </button>
        <button onClick={() => setActiveTab('checklist')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'checklist' ? '1px solid #D97706' : '1px solid transparent', background: activeTab === 'checklist' ? '#D97706' : '#F8FAFC', color: activeTab === 'checklist' ? '#FFF' : '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.23.2 Move-In Handover Checklist
        </button>
        <button onClick={() => setActiveTab('certificate')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'certificate' ? '1px solid #D97706' : '1px solid transparent', background: activeTab === 'certificate' ? '#D97706' : '#F8FAFC', color: activeTab === 'certificate' ? '#FFF' : '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.23.3 Key Handover Certificate
        </button>
        <button onClick={() => setActiveTab('contractor')} style={{ padding: '6px 12px', borderRadius: '6px', border: activeTab === 'contractor' ? '1px solid #D97706' : '1px solid transparent', background: activeTab === 'contractor' ? '#D97706' : '#F8FAFC', color: activeTab === 'contractor' ? '#FFF' : '#334155', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}>
          3.23.4 Contractor Rectification SLA
        </button>
      </div>

      {/* Tab 1: Snagging */}
      {activeTab === 'snagging' && (
        <div style={{ background: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', color: '#475569', fontWeight: 800 }}>
                <th style={{ padding: '10px 14px' }}>Snag ID</th>
                <th style={{ padding: '10px 14px' }}>Location / Room</th>
                <th style={{ padding: '10px 14px' }}>Defect Description</th>
                <th style={{ padding: '10px 14px' }}>Assigned Contractor</th>
                <th style={{ padding: '10px 14px' }}>Severity</th>
                <th style={{ padding: '10px 14px' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {snags.map(s => (
                <tr key={s.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '10px 14px', fontWeight: 800, color: '#D97706' }}>{s.id}</td>
                  <td style={{ padding: '10px 14px', fontWeight: 700, color: '#1E293B' }}>{s.room}</td>
                  <td style={{ padding: '10px 14px', color: '#475569' }}>{s.item}</td>
                  <td style={{ padding: '10px 14px', color: '#64748B' }}>{s.contractor}</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, background: s.priority === 'HIGH' ? '#FEF2F2' : '#FEF3C7', color: s.priority === 'HIGH' ? '#DC2626' : '#B45309' }}>
                      {s.priority}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ padding: '2px 8px', borderRadius: '4px', fontSize: '0.72rem', fontWeight: 800, background: s.status === 'RECTIFIED' ? '#ECFDF5' : '#EFF6FF', color: s.status === 'RECTIFIED' ? '#047857' : '#1E40AF' }}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab 2: Checklist */}
      {activeTab === 'checklist' && (
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <h4 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>
            Move-In & Key Handover Readiness Gate
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.25rem' }}>
            {Object.entries(checklist).map(([k, v]) => (
              <label key={k} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.85rem', fontWeight: 700, background: '#F8FAFC', padding: '10px 14px', borderRadius: '8px', border: '1px solid #E2E8F0', cursor: 'pointer' }}>
                <input type="checkbox" checked={v} onChange={e => setChecklist({ ...checklist, [k]: e.target.checked })} />
                <span>{k.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</span>
              </label>
            ))}
          </div>

          <button onClick={() => { setActiveTab('certificate'); }} style={{ background: allComplete ? '#10B981' : '#D97706', color: '#FFF', border: 'none', borderRadius: '8px', padding: '10px 20px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}>
            {allComplete ? 'Issue Official Key Handover Certificate' : 'Proceed to Certificate (Pending Checklist)'}
          </button>
        </div>
      )}

      {/* Tab 3: Key Certificate */}
      {activeTab === 'certificate' && (
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <div style={{ border: '2px dashed #CBD5E1', padding: '1.5rem', borderRadius: '12px', background: '#F8FAFC', textAlign: 'center' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#1E293B', fontWeight: 900 }}>OFFICIAL KEY HANDOVER CERTIFICATE</h3>
            <p style={{ fontSize: '0.8rem', color: '#64748B', margin: 0 }}>White Caves Real Estate LLC | Dubai Land Department Registered</p>
            <div style={{ margin: '1.5rem 0', fontSize: '0.9rem', color: '#334155' }}>
              This certifies that the keys, access cards, and DEWA utility clearances for <strong>Unit 1402, Downtown Heights</strong> have been inspected and formally handed over to the tenant.
            </div>
            <button onClick={() => alert('Downloaded Official Key Handover Certificate PDF.')} style={{ background: '#D97706', color: '#FFF', border: 'none', borderRadius: '8px', padding: '8px 18px', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
              <Download size={16} /> Download Signed Handover PDF
            </button>
          </div>
        </div>
      )}

      {/* Tab 4: Contractor SLA */}
      {activeTab === 'contractor' && (
        <div style={{ background: '#FFFFFF', padding: '1.5rem', borderRadius: '12px', border: '1px solid #E2E8F0' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', fontWeight: 800, color: '#1E293B' }}>
            Developer DLP (Defect Liability Period) Contractor SLA
          </h4>
          <p style={{ fontSize: '0.82rem', color: '#64748B' }}>
            Standard 1-year developer defect liability warranty monitoring under UAE Civil Code.
          </p>
        </div>
      )}
    </div>
  );
};

export default VestaHandoverCRM;
