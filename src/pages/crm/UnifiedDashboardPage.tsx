import React, { FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { selectCurrentUser } from '../../store/userSlice';
import {
  mockProperties,
  mockLeads,
  mockRegulatoryContracts,
  Property,
  Lead
} from '../../mocks/dubaiRealEstateMocks';

const OperationsDepartmentView = React.lazy(() => import('./OperationsDepartmentView'));
const FinanceDepartmentView = React.lazy(() => import('./FinanceDepartmentView'));

// --- STYLING CONSTANTS (WHITE CAVES CORPORATE PALETTE) ---
const RED = '#EF4444';
const WHITE = '#FFFFFF';
const SLATE = '#1E293B';
const BORDER_COLOR = 'rgba(239, 68, 68, 0.2)';
const CARD_BG = '#F8FAFC';
const TEXT_MUTED = '#64748B';

// --- MOCK DATABASE TIER 5 DATA ---
const WHITE_CAVES_ROLES = [
  { role: 'managing_director', tier: 'Level 5 Master', permissions: ['All Override', 'Read-Write-CRUD', 'Audit Platform'] },
  { role: 'admin', tier: 'Level 4 Admin', permissions: ['Read-Write-CRUD', 'Audit Compliance'] },
  { role: 'leasing-agent', tier: 'Level 2 Agent', permissions: ['Write Leads', 'Read Properties'] },
  { role: 'secondary-sales-agent', tier: 'Level 2 Agent', permissions: ['Write Leads', 'Read Properties'] },
  { role: 'landlord', tier: 'External Portal', permissions: ['Read Owned Units'] },
  { role: 'tenant', tier: 'External Portal', permissions: ['Read Leased Unit'] }
];

export const UnifiedDashboardPage: FC = () => {
  useDocumentTitle('Founder Control Panel | White Caves');
  const params = useParams<{ department?: string }>();
  const navigate = useNavigate();
  const currentUser = useSelector((state: RootState) => selectCurrentUser(state));
  const isMaster = currentUser?.accessLevel === 5 || currentUser?.email === 'arslanmalikgoraha@gmail.com';

  // --- LOCAL STATES ---
  const [activeDepartment, setActiveDepartment] = useState<string>('sales');
  const [leadsList, setLeadsList] = useState<Lead[]>(mockLeads);
  const [propertiesList, setPropertiesList] = useState<Property[]>(mockProperties);
  const [selectedCluster, setSelectedCluster] = useState<string>('All');
  
  // Kanban Lead Drag / Update Modal State
  const [selectedLeadForModal, setSelectedLeadForModal] = useState<Lead | null>(null);
  const [modalActionNote, setModalActionNote] = useState<string>('');
  
  // Employee CRUD Ledger State
  const [employees, setEmployees] = useState([
    { id: 'emp-001', name: 'Nadia Yasmin', role: 'leasing-agent', email: 'nadia@whitecaves.ae', reraCardDays: 14, status: 'Active' },
    { id: 'emp-002', name: 'Clara Oswald', role: 'secondary-sales-agent', email: 'clara@whitecaves.ae', reraCardDays: 120, status: 'Active' },
    { id: 'emp-003', name: 'Sophia Loren', role: 'admin', email: 'sophia@whitecaves.ae', reraCardDays: 8, status: 'Active' }
  ]);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('leasing-agent');

  // AI Cognitive States
  const [aiTraceLog, setAiTraceLog] = useState<string[]>([
    'AI_LEAD_QUALIFIER: Incoming web request from John Doe...',
    'AI_LEAD_QUALIFIER: Analyzing search parameters (Location: Downtown Dubai)...',
    'AI_LEAD_QUALIFIER: Priority scored: Medium. Routed to Nadia (Broker Index 2)'
  ]);
  const [aiAuditResults, setAiAuditResults] = useState({
    contractId: 'Form 7-002',
    violations: [
      'Missing broker RERA license stamp on Line 42',
      'Escrow bank details mismatched with authorized DLD list'
    ]
  });

  // Keep state sync with url params
  useEffect(() => {
    if (params.department) {
      setActiveDepartment(params.department);
    } else {
      setActiveDepartment('sales');
    }
  }, [params.department]);

  // Onboarding click
  const triggerOnboardingCheck = (name: string) => {
    alert(`Triggering broker onboarding profile scan for ${name}... 100% checks passed.`);
  };

  // Target split progress
  const getCommissionSplit = (aedVolume: number) => {
    return aedVolume >= 500000 ? '70% Broker / 30% House (Accelerator Triggered!)' : '50% Broker / 50% House';
  };

  // Add Employee Handler
  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName || !newEmpEmail) return;
    const newEmp = {
      id: `emp-${Date.now()}`,
      name: newEmpName,
      email: newEmpEmail,
      role: newEmpRole,
      reraCardDays: 365,
      status: 'Active'
    };
    setEmployees([...employees, newEmp]);
    setNewEmpName('');
    setNewEmpEmail('');
  };

  // Delete/Deactivate Employee Handler
  const handleDeactivateEmployee = (id: string) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, status: 'Deactivated' } : emp));
  };

  // Kanban status change handler
  const moveLeadStatus = (leadId: string, nextStatus: string) => {
    setLeadsList(leadsList.map(lead => lead.id === leadId ? { ...lead, status: nextStatus } : lead));
  };

  return (
    <div data-testid="dashboard-page" style={{ background: WHITE, color: SLATE, minHeight: '100vh', fontFamily: 'sans-serif' }}>
      
      {/* Dynamic Sub-View Router Contents */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: `2px solid ${RED}`, paddingBottom: '12px' }}>
        <div>
          <h1 style={{ margin: 0, color: SLATE, fontSize: '1.75rem', fontWeight: 800 }}>
            White Caves CRM Workspace Panel
          </h1>
          <p style={{ margin: '4px 0 0 0', color: TEXT_MUTED, fontSize: '0.875rem' }}>
            Active Workspace Path: <strong style={{ color: RED }}>/crm/{activeDepartment}</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {['sales', 'operations', 'communications', 'finance', 'marketing', 'executive', 'compliance', 'technology', 'legal', 'intelligence', 'ai-command'].map(dept => (
            <button
              key={dept}
              onClick={() => {
                setActiveDepartment(dept);
                navigate(`/crm/${dept}`);
              }}
              style={{
                background: activeDepartment === dept ? RED : WHITE,
                color: activeDepartment === dept ? WHITE : SLATE,
                border: `1px solid ${activeDepartment === dept ? RED : BORDER_COLOR}`,
                padding: '6px 12px',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: 600,
                fontSize: '0.75rem',
                textTransform: 'uppercase',
                transition: 'all 0.2s ease'
              }}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* --- RENDER SPECIFIC WORKSPACES --- */}

      {/* 1. SALES DEPARTMENT WORKSPACE */}
      {(activeDepartment === 'sales' || activeDepartment === '') && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
              <h3 style={{ color: RED, marginTop: 0 }}>Sales Conversion Grid — Clara (Leads)</h3>
              <p style={{ fontSize: '0.875rem' }}>Active leads conversion rate: <strong>24.5%</strong></p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER_COLOR}` }}>
                    <th style={{ textAlign: 'left', padding: '6px' }}>Lead</th>
                    <th style={{ textAlign: 'left', padding: '6px' }}>Source</th>
                    <th style={{ textAlign: 'left', padding: '6px' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {leadsList.map(l => (
                    <tr key={l.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '6px' }}>{l.name}</td>
                      <td style={{ padding: '6px' }}>{l.source}</td>
                      <td style={{ padding: '6px' }}>
                        <span style={{ color: WHITE, background: RED, padding: '2px 6px', borderRadius: '4px', fontSize: '0.75rem' }}>
                          {l.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
              <h3 style={{ color: RED, marginTop: 0 }}>Sales Conversion Grid — Sophia (Pipeline)</h3>
              <p style={{ fontSize: '0.875rem' }}>Target Gross AED volume this month: <strong>15M AED</strong></p>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${BORDER_COLOR}` }}>
                    <th style={{ textAlign: 'left', padding: '6px' }}>Broker</th>
                    <th style={{ textAlign: 'left', padding: '6px' }}>Target AED</th>
                    <th style={{ textAlign: 'left', padding: '6px' }}>Achieved</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td style={{ padding: '6px' }}>Clara Oswald</td>
                    <td style={{ padding: '6px' }}>5,000,000 AED</td>
                    <td style={{ padding: '6px' }}>4,200,000 AED</td>
                  </tr>
                  <tr>
                    <td style={{ padding: '6px' }}>Sophia Loren</td>
                    <td style={{ padding: '6px' }}>5,000,000 AED</td>
                    <td style={{ padding: '6px' }}>5,800,000 AED</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Leaderboard Podium & employee splits */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}`, textAlign: 'center' }}>
              <h3 style={{ color: RED, marginTop: 0 }}>🏆 Gamified Monthly Podium</h3>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '16px', margin: '20px 0' }}>
                <div style={{ width: '80px', background: '#E2E8F0', padding: '10px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
                  <div style={{ fontWeight: 'bold' }}>2nd</div>
                  <div style={{ fontSize: '0.75rem' }}>Clara O.</div>
                  <div style={{ color: RED, fontWeight: 700 }}>4.2M</div>
                </div>
                <div style={{ width: '80px', background: RED, color: WHITE, padding: '20px 10px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px', transform: 'scale(1.1)' }}>
                  <div style={{ fontWeight: 'bold' }}>1st</div>
                  <div style={{ fontSize: '0.75rem' }}>Sophia L.</div>
                  <div style={{ fontWeight: 700 }}>5.8M</div>
                </div>
                <div style={{ width: '80px', background: '#E2E8F0', padding: '8px', borderTopLeftRadius: '8px', borderTopRightRadius: '8px' }}>
                  <div style={{ fontWeight: 'bold' }}>3rd</div>
                  <div style={{ fontSize: '0.75rem' }}>Nadia Y.</div>
                  <div style={{ color: RED, fontWeight: 700 }}>3.1M</div>
                </div>
              </div>
            </div>

            <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
              <h3 style={{ color: RED, marginTop: 0 }}>Commission Split Accelerator Calculator</h3>
              <p style={{ fontSize: '0.875rem' }}>Commission levels adjust automatically on broker gross sales volume tiering.</p>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="number"
                  defaultValue="600000"
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const out = document.getElementById('calc-split-result');
                    if (out) out.innerText = getCommissionSplit(val);
                  }}
                  style={{ padding: '8px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '4px', width: '150px' }}
                />
                <span style={{ fontSize: '0.875rem' }}>AED Gross Volume</span>
              </div>
              <p style={{ fontSize: '0.875rem', marginTop: '12px' }}>
                Active Commission Split: <strong id="calc-split-result" style={{ color: RED }}>70% Broker / 30% House (Accelerator Triggered!)</strong>
              </p>
            </div>
          </div>

          {/* Interactive Kanban Board */}
          <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}`, marginBottom: '24px' }}>
            <h3 style={{ color: RED, marginTop: 0 }}>Interactive 4-Column Kanban Lead Board</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {['New', 'Contacted', 'Negotiation', 'Closed'].map(statusCol => (
                <div key={statusCol} style={{ background: WHITE, padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0', minHeight: '200px' }}>
                  <h4 style={{ margin: '0 0 12px 0', borderBottom: `2px solid ${RED}`, paddingBottom: '4px' }}>{statusCol}</h4>
                  {leadsList.filter(l => l.status === statusCol).map(l => (
                    <div
                      key={l.id}
                      onClick={() => setSelectedLeadForModal(l)}
                      style={{
                        padding: '10px',
                        background: CARD_BG,
                        border: `1px solid ${BORDER_COLOR}`,
                        borderRadius: '4px',
                        marginBottom: '8px',
                        cursor: 'pointer',
                        position: 'relative'
                      }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{l.name}</div>
                      <div style={{ fontSize: '0.75rem', color: TEXT_MUTED }}>Priority: {l.priority}</div>
                      
                      {/* SLA Portal Ingestion Countdown */}
                      {statusCol === 'New' && (
                        <div style={{ color: RED, fontSize: '0.7rem', fontWeight: 'bold', marginTop: '4px' }}>
                          ⏱️ Ingestion SLA: 12m 45s remaining
                        </div>
                      )}

                      <div style={{ display: 'flex', gap: '4px', marginTop: '8px' }}>
                        {statusCol !== 'New' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); moveLeadStatus(l.id, 'New'); }}
                            style={{ background: '#E2E8F0', border: 'none', padding: '2px 4px', fontSize: '0.65rem', cursor: 'pointer' }}
                          >
                            ◀
                          </button>
                        )}
                        {statusCol !== 'Closed' && (
                          <button
                            onClick={(e) => { e.stopPropagation(); moveLeadStatus(l.id, statusCol === 'New' ? 'Contacted' : statusCol === 'Contacted' ? 'Negotiation' : 'Closed'); }}
                            style={{ background: RED, color: WHITE, border: 'none', padding: '2px 4px', fontSize: '0.65rem', cursor: 'pointer', marginLeft: 'auto' }}
                          >
                            ▶
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Properties Inventory Component */}
          <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ color: RED, margin: 0 }}>High-Density Property Inventory Table</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem' }}>Neighborhood Filter:</span>
                {['All', 'DAMAC Hills 2', 'Downtown Dubai'].map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedCluster(c)}
                    style={{
                      background: selectedCluster === c ? RED : WHITE,
                      color: selectedCluster === c ? WHITE : SLATE,
                      border: `1px solid ${selectedCluster === c ? RED : BORDER_COLOR}`,
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
              <thead>
                <tr style={{ background: '#E2E8F0', borderBottom: `2px solid ${RED}` }}>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Property Title</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Community</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Price (AED)</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>Status</th>
                  <th style={{ textAlign: 'left', padding: '8px' }}>RERA Permit</th>
                </tr>
              </thead>
              <tbody>
                {propertiesList
                  .filter(p => selectedCluster === 'All' || p.community === selectedCluster)
                  .map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                      <td style={{ padding: '8px', fontWeight: 'bold' }}>{p.title}</td>
                      <td style={{ padding: '8px' }}>{p.community}</td>
                      <td style={{ padding: '8px' }}>{p.priceAED.toLocaleString()} AED</td>
                      <td style={{ padding: '8px' }}>
                        <span
                          style={{
                            background: p.status === 'Available' ? RED : '#E2E8F0',
                            color: p.status === 'Available' ? WHITE : SLATE,
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontSize: '0.75rem',
                            fontWeight: 'bold'
                          }}
                        >
                          {p.status}
                        </span>
                      </td>
                      <td style={{ padding: '8px' }}>{p.reraPermitNumber}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. OPERATIONS DEPARTMENT WORKSPACE */}
      {activeDepartment === 'operations' && (
        <React.Suspense fallback={<div style={{ padding: '20px', color: RED }}>Loading Operations Viewport...</div>}>
          <OperationsDepartmentView />
        </React.Suspense>
      )}

      {/* 3. COMMUNICATIONS DEPARTMENT WORKSPACE */}
      {activeDepartment === 'communications' && (
        <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
          <h3 style={{ color: RED, marginTop: 0 }}>Nadia WhatsApp CRM Stream Ticker</h3>
          <p>Uptime Monitor: <strong>Nadia stream operating on 23+ Active Virtual Numbers</strong></p>
          <div style={{ border: `1px solid ${BORDER_COLOR}`, background: WHITE, padding: '16px', borderRadius: '6px', maxHeight: '250px', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', padding: '8px 0', fontSize: '0.875rem' }}>
              <span>💬 +971 50 123 4567 (Client: Mark)</span>
              <span style={{ color: RED, fontWeight: 'bold' }}>SLA alert: 2m left to reply</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', padding: '8px 0', fontSize: '0.875rem' }}>
              <span>💬 +971 50 987 6543 (Client: Fatima)</span>
              <span>SLA status: Reply sent within 1m</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #E2E8F0', padding: '8px 0', fontSize: '0.875rem' }}>
              <span>💬 +971 50 445 1290 (Client: David)</span>
              <span>SLA status: Processed (Closed)</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. FINANCE DEPARTMENT WORKSPACE */}
      {activeDepartment === 'finance' && (
        <React.Suspense fallback={<div style={{ padding: '20px', color: RED }}>Loading Finance Viewport...</div>}>
          <FinanceDepartmentView />
        </React.Suspense>
      )}

      {/* 5. MARKETING DEPARTMENT WORKSPACE */}
      {activeDepartment === 'marketing' && (
        <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
          <h3 style={{ color: RED, marginTop: 0 }}>Campaign ROI and Cost-Per-Lead (CPL)</h3>
          <p>Telemetry metrics provided by AI Assistant Olivia:</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            <div style={{ background: WHITE, padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <strong>Google PPC:</strong>
              <br />
              ROI: <span style={{ color: RED, fontWeight: 'bold' }}>340%</span>
              <br />
              CPL: <strong>48 AED</strong>
            </div>
            <div style={{ background: WHITE, padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <strong>Social Lead Gen:</strong>
              <br />
              ROI: <span style={{ color: RED, fontWeight: 'bold' }}>210%</span>
              <br />
              CPL: <strong>32 AED</strong>
            </div>
            <div style={{ background: WHITE, padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <strong>Property Portals:</strong>
              <br />
              ROI: <span style={{ color: RED, fontWeight: 'bold' }}>180%</span>
              <br />
              CPL: <strong>75 AED</strong>
            </div>
          </div>
        </div>
      )}

      {/* 6. EXECUTIVE DEPARTMENT WORKSPACE */}
      {activeDepartment === 'executive' && (
        <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
          <h3 style={{ color: RED, marginTop: 0 }}>MD Executive Flight Deck (Level 5 Master)</h3>
          {isMaster ? (
            <div>
              <p>Welcome Managing Director Malik Goraha. Exposing master oversight deck metrics:</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div style={{ background: WHITE, padding: '16px', borderRadius: '6px', borderLeft: `4px solid ${RED}` }}>
                  <strong>Gross Corporate Revenue</strong>
                  <br />
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: RED }}>42,850,000 AED</span>
                </div>
                <div style={{ background: WHITE, padding: '16px', borderRadius: '6px', borderLeft: `4px solid ${RED}` }}>
                  <strong>Average Lead-to-Close Cycle</strong>
                  <br />
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: RED }}>14.2 Days</span>
                </div>
                <div style={{ background: WHITE, padding: '16px', borderRadius: '6px', borderLeft: `4px solid ${RED}` }}>
                  <strong>Platform Active Integrations</strong>
                  <br />
                  <span style={{ fontSize: '1.25rem', fontWeight: 800, color: RED }}>9/10 Connected</span>
                </div>
              </div>
              <p style={{ fontSize: '0.875rem' }}>* Under the Master Bypass Policy, lower access tiers are blocked from viewing this Executive block.</p>
            </div>
          ) : (
            <div style={{ color: RED, fontWeight: 'bold' }}>
              ACCESS DENIED: LEVEL 5 MASTER (MANAGING DIRECTOR) ACCESS PERMISSION REQUIRED.
            </div>
          )}
        </div>
      )}

      {/* 7. COMPLIANCE DEPARTMENT WORKSPACE */}
      {activeDepartment === 'compliance' && (
        <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
          <h3 style={{ color: RED, marginTop: 0 }}>RERA/DLD Compliance Status Timeline</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ paddingLeft: '24px', borderLeft: `2px solid ${RED}`, position: 'relative' }}>
              <div style={{ width: '12px', height: '12px', background: RED, borderRadius: '50%', position: 'absolute', left: '-7px', top: '4px' }}></div>
              <strong>RERA Broker Card Verification:</strong> Sophia Loren passed checks (2026-07-27)
            </div>
            <div style={{ paddingLeft: '24px', borderLeft: `2px solid ${RED}`, position: 'relative' }}>
              <div style={{ width: '12px', height: '12px', background: RED, borderRadius: '50%', position: 'absolute', left: '-7px', top: '4px' }}></div>
              <strong>DLD Contract Ingestion:</strong> Form 6 registration auto-submitted successfully
            </div>
            <div style={{ paddingLeft: '24px', borderLeft: `2px solid ${RED}`, position: 'relative' }}>
              <div style={{ width: '12px', height: '12px', background: RED, borderRadius: '50%', position: 'absolute', left: '-7px', top: '4px' }}></div>
              <strong>Audit Trail Entry:</strong> Master user 'arslanmalikgoraha@gmail.com' performed compliance audit override.
            </div>
          </div>
        </div>
      )}

      {/* 8. TECHNOLOGY DEPARTMENT WORKSPACE */}
      {activeDepartment === 'technology' && (
        <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
          <h3 style={{ color: RED, marginTop: 0 }}>Server Telemetry & Development Config</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
            <div>
              <p>Platform status monitor:</p>
              <ul>
                <li>Server Uptime: <strong>99.98%</strong></li>
                <li>Production Environment: <strong>develop/main sync</strong></li>
                <li>Active Socket Rooms: <strong>8 Rooms</strong></li>
              </ul>
            </div>
            <div>
              <p>Cache configuration telemetry:</p>
              <ul>
                <li>Local Cache File: <strong>plans/AEGIS_CACHE.json</strong></li>
                <li>Cache status: <strong style={{ color: RED }}>Synchronized</strong></li>
                <li>Stored rate matrix: <strong>AED to USD/EUR/GBP</strong></li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* 9. LEGAL DEPARTMENT WORKSPACE */}
      {activeDepartment === 'legal' && (
        <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
          <h3 style={{ color: RED, marginTop: 0 }}>Evangeline AI Active Legal Instruments</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
            {mockRegulatoryContracts.map(c => (
              <div key={c.id} style={{ background: WHITE, padding: '16px', borderRadius: '6px', border: `1px solid ${BORDER_COLOR}` }}>
                <h4 style={{ color: RED, margin: '0 0 8px 0' }}>{c.type}</h4>
                <div>Document: <strong>{c.contractNumber}</strong></div>
                <div>Status: <strong style={{ color: RED }}>{c.status}</strong></div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 10. INTELLIGENCE DEPARTMENT WORKSPACE */}
      {activeDepartment === 'intelligence' && (
        <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
          <h3 style={{ color: RED, marginTop: 0 }}>Sentinel IoT Property Alerts Heatmap</h3>
          <div style={{ height: '200px', background: WHITE, borderRadius: '6px', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem' }}>🗺️</div>
              <strong>Downtown Dubai Block A Zone 1:</strong> IoT sensors status - <span style={{ color: RED }}>Nominal</span>
            </div>
          </div>
        </div>
      )}

      {/* 11. AI COMMAND CENTER WORKSPACE */}
      {activeDepartment === 'ai-command' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
              <h3 style={{ color: RED, marginTop: 0 }}>AI Assistant Avatar Grid Hub</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                <div style={{ background: WHITE, padding: '12px', borderRadius: '6px', borderLeft: `4px solid ${RED}`, textAlign: 'center' }}>
                  <strong>Zoe</strong>
                  <div style={{ fontSize: '0.75rem', color: RED, fontWeight: 'bold' }}>● ACTIVE</div>
                </div>
                <div style={{ background: WHITE, padding: '12px', borderRadius: '6px', borderLeft: `4px solid ${RED}`, textAlign: 'center' }}>
                  <strong>Nadia</strong>
                  <div style={{ fontSize: '0.75rem', color: RED, fontWeight: 'bold' }}>● ACTIVE</div>
                </div>
                <div style={{ background: WHITE, padding: '12px', borderRadius: '6px', borderLeft: `4px solid ${RED}`, textAlign: 'center' }}>
                  <strong>Sentinel</strong>
                  <div style={{ fontSize: '0.75rem', color: TEXT_MUTED }}>● IDLE</div>
                </div>
              </div>
            </div>

            <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
              <h3 style={{ color: RED, marginTop: 0 }}>AI Lead Qualifier Trace Log</h3>
              <div style={{ background: '#1E293B', color: '#F8FAFC', padding: '12px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '0.75rem', maxHeight: '120px', overflowY: 'auto' }}>
                {aiTraceLog.map((logLine, idx) => (
                  <div key={idx}>{logLine}</div>
                ))}
              </div>
            </div>
          </div>

          <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
            <h3 style={{ color: RED, marginTop: 0 }}>AI Compliance Contract Auditor Feedback</h3>
            <div style={{ background: WHITE, padding: '16px', borderRadius: '6px', border: `1px solid ${BORDER_COLOR}` }}>
              <strong>Inspecting Document:</strong> {aiAuditResults.contractId}
              <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', color: RED, fontSize: '0.875rem' }}>
                {aiAuditResults.violations.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* --- EMPLOYEE DIRECTORY CRUD LEDGER --- */}
      <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}`, marginTop: '24px' }}>
        <h3 style={{ color: RED, marginTop: 0 }}>Active Employee Lifecycle & CRUD Ledger</h3>
        <p style={{ fontSize: '0.875rem' }}>Managing Directors have full privilege to manage the corporate staff structure.</p>
        
        {/* Onboarding and renewal alerts */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
          {employees.map(emp => (
            <div key={emp.id} style={{ background: WHITE, padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0', position: 'relative' }}>
              <strong>{emp.name}</strong>
              <div style={{ fontSize: '0.75rem', color: TEXT_MUTED }}>Role: {emp.role}</div>
              <div style={{ fontSize: '0.75rem', color: TEXT_MUTED }}>Status: {emp.status}</div>
              
              {/* RERA Card countdown */}
              <div style={{ fontSize: '0.75rem', color: RED, fontWeight: 'bold', marginTop: '6px' }}>
                RERA Card: {emp.reraCardDays} days remaining
              </div>

              <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                <button
                  onClick={() => triggerOnboardingCheck(emp.name)}
                  style={{ background: '#E2E8F0', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                >
                  Onboard Scan
                </button>
                {emp.status === 'Active' && (
                  <button
                    onClick={() => handleDeactivateEmployee(emp.id)}
                    style={{ background: RED, color: WHITE, border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer', marginLeft: 'auto' }}
                  >
                    Deactivate
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Add Employee Form */}
        <form onSubmit={handleAddEmployee} style={{ display: 'flex', gap: '12px', borderTop: '1px solid #E2E8F0', paddingTop: '16px', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Employee Name"
            value={newEmpName}
            onChange={(e) => setNewEmpName(e.target.value)}
            style={{ padding: '8px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '4px', flex: 1 }}
          />
          <input
            type="email"
            placeholder="Employee Email"
            value={newEmpEmail}
            onChange={(e) => setNewEmpEmail(e.target.value)}
            style={{ padding: '8px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '4px', flex: 1 }}
          />
          <select
            value={newEmpRole}
            onChange={(e) => setNewEmpRole(e.target.value)}
            style={{ padding: '8px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '4px' }}
          >
            <option value="leasing-agent">Leasing Agent</option>
            <option value="secondary-sales-agent">Secondary Sales Agent</option>
            <option value="admin">Admin</option>
          </select>
          <button
            type="submit"
            style={{ background: RED, color: WHITE, border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
          >
            Add Employee
          </button>
        </form>
      </div>

      {/* --- ROLE MAPPING METRIC --- */}
      <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}`, marginTop: '24px' }}>
        <h3 style={{ color: RED, marginTop: 0 }}>WHITE_CAVES_ROLES Permissions Mapping Matrix</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {WHITE_CAVES_ROLES.map(role => (
            <div key={role.role} style={{ background: WHITE, padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <strong>{role.role.replace('-', ' ').toUpperCase()}</strong>
              <div style={{ fontSize: '0.75rem', color: RED, fontWeight: 700 }}>{role.tier}</div>
              <div style={{ fontSize: '0.75rem', marginTop: '6px' }}>
                Permissions: {role.permissions.join(', ')}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* --- KANBAN ACTION DETAIL MODAL --- */}
      {selectedLeadForModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: WHITE, padding: '24px', borderRadius: '8px', width: '400px', border: `2px solid ${RED}` }}>
            <h3 style={{ color: RED, marginTop: 0 }}>Kanban Action Details Modal</h3>
            <div>Lead Name: <strong>{selectedLeadForModal.name}</strong></div>
            <div>Lead Email: {selectedLeadForModal.email}</div>
            <div>Lead Phone: {selectedLeadForModal.phone}</div>
            
            <div style={{ marginTop: '12px' }}>
              <label style={{ fontSize: '0.875rem', fontWeight: 600 }}>Action Notes:</label>
              <textarea
                value={modalActionNote}
                onChange={(e) => setModalActionNote(e.target.value)}
                placeholder="Log notes or manual router overrides..."
                style={{ width: '100%', height: '80px', marginTop: '6px', padding: '8px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '4px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => {
                  alert(`Action Logged: ${modalActionNote || 'No notes logged.'}`);
                  setSelectedLeadForModal(null);
                  setModalActionNote('');
                }}
                style={{ background: RED, color: WHITE, border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
              >
                Submit Action
              </button>
              <button
                onClick={() => { setSelectedLeadForModal(null); setModalActionNote(''); }}
                style={{ background: '#E2E8F0', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer' }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default UnifiedDashboardPage;
