import React, { FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useWorkspace } from '../../context/WorkspaceContext';
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

export const UnifiedDashboardPage: FC = () => {
  useDocumentTitle('Workspace Control Panel | White Caves');
  const params = useParams<{ department?: string }>();
  const navigate = useNavigate();

  const {
    activeUser,
    effectiveAccessLevel,
    isMaster,
    impersonatedUser,
    clearImpersonation,
    personnel,
    properties: contextProperties
  } = useWorkspace();

  // --- LOCAL STATES ---
  const [activeDepartment, setActiveDepartment] = useState<string>('sales');
  const [leadsList, setLeadsList] = useState<Lead[]>(mockLeads);
  const [propertiesList, setPropertiesList] = useState<Property[]>(contextProperties.length > 0 ? contextProperties as any : mockProperties);
  const [selectedCluster, setSelectedCluster] = useState<string>('All');
  
  // Kanban Lead Drag / Update Modal State
  const [selectedLeadForModal, setSelectedLeadForModal] = useState<Lead | null>(null);
  const [modalActionNote, setModalActionNote] = useState<string>('');
  
  // Employee CRUD Ledger State
  const [employees, setEmployees] = useState(personnel.slice(0, 5));
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('R-005');

  // AI Cognitive States
  const [aiTraceLog] = useState<string[]>([
    'AI_LEAD_QUALIFIER: Incoming web request from John Doe...',
    'AI_LEAD_QUALIFIER: Analyzing search parameters (Location: Downtown Dubai)...',
    'AI_LEAD_QUALIFIER: Priority scored: Medium. Routed to Nadia (Broker Index 2)'
  ]);

  // Keep state sync with url params
  useEffect(() => {
    if (params.department) {
      setActiveDepartment(params.department);
    } else {
      setActiveDepartment('sales');
    }
  }, [params.department]);

  const triggerOnboardingCheck = (name: string) => {
    alert(`Triggering broker onboarding profile scan for ${name}... 100% compliance checks passed.`);
  };

  const getCommissionSplit = (aedVolume: number) => {
    return aedVolume >= 500000 ? '70% Broker / 30% House (Accelerator Triggered!)' : '50% Broker / 50% House';
  };

  const handleAddEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName || !newEmpEmail) return;
    const newEmp: any = {
      id: `usr-${Date.now()}`,
      name: newEmpName,
      email: newEmpEmail,
      roleId: newEmpRole,
      roleTitle: 'Associate Broker',
      assignedDepartment: 'sales',
      accessLevel: 2,
      phone: '+971501112233',
      nationalityCode: 'AE',
      commissionRule: { agentSplit: 0.5, companySplit: 0.5, tierName: 'Standard Split (50/50)' },
      joinedDate: new Date().toISOString().split('T')[0],
      isActive: true,
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop'
    };
    setEmployees([...employees, newEmp]);
    setNewEmpName('');
    setNewEmpEmail('');
  };

  const handleDeactivateEmployee = (id: string) => {
    setEmployees(employees.map(emp => emp.id === id ? { ...emp, isActive: false } : emp));
  };

  const moveLeadStatus = (leadId: string, nextStatus: string) => {
    setLeadsList(leadsList.map(lead => lead.id === leadId ? { ...lead, status: nextStatus } : lead));
  };

  // ---------------------------------------------------------------------------
  // VARIANT 3: LEVEL 1 CLIENT / TENANT / LANDLORD PORTAL VIEW
  // ---------------------------------------------------------------------------
  if (effectiveAccessLevel === 1) {
    return (
      <div data-testid="variant3-client-portal" style={{ background: WHITE, color: SLATE, minHeight: '85vh', padding: '24px' }}>
        {/* Client Portal Header */}
        <div style={{ background: CARD_BG, padding: '24px', borderRadius: '12px', border: `1px solid ${BORDER_COLOR}`, marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ background: RED, color: WHITE, padding: '4px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                Client Portal Shield Active
              </span>
              <h2 style={{ margin: '8px 0 0 0', color: SLATE, fontSize: '1.5rem', fontWeight: 800 }}>
                Welcome, {activeUser?.name || 'Valued Client'}
              </h2>
              <p style={{ margin: '4px 0 0 0', color: TEXT_MUTED, fontSize: '0.875rem' }}>
                Account Email: {activeUser?.email} | Security Level: External Client Portal (Level 1)
              </p>
            </div>
            {impersonatedUser && (
              <div style={{ background: '#FEF2F2', border: `1px solid ${RED}`, padding: '8px 12px', borderRadius: '6px', textAlign: 'right' }}>
                <div style={{ color: RED, fontWeight: 700, fontSize: '0.8rem' }}>🎭 MD Ghost Impersonation Active</div>
                <button onClick={clearImpersonation} style={{ background: RED, color: WHITE, border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem', marginTop: '4px' }}>
                  Exit Impersonation Mode
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Client Properties Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
            <h3 style={{ color: RED, marginTop: 0 }}>🏠 Your Registered Property Portfolio</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {propertiesList.slice(0, 3).map(p => (
                <div key={p.id} style={{ background: WHITE, padding: '16px', borderRadius: '8px', border: '1px solid #E2E8F0', display: 'flex', gap: '16px' }}>
                  <img src={p.imageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400&fit=crop'} alt={p.title} style={{ width: '120px', height: '90px', borderRadius: '6px', objectFit: 'cover' }} />
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 4px 0', color: SLATE }}>{p.title}</h4>
                    <div style={{ fontSize: '0.85rem', color: TEXT_MUTED }}>Community: {p.community}</div>
                    <div style={{ fontSize: '0.85rem', color: TEXT_MUTED }}>RERA Permit: {p.reraPermitNumber}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                      <span style={{ color: RED, fontWeight: 700, fontSize: '0.95rem' }}>{p.priceAED?.toLocaleString()} AED</span>
                      <span style={{ background: p.status === 'Available' ? RED : '#E2E8F0', color: p.status === 'Available' ? WHITE : SLATE, padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>
                        {p.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Active Ejari & Form 7 Agreements */}
          <div>
            <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}`, marginBottom: '20px' }}>
              <h3 style={{ color: RED, marginTop: 0 }}>📜 Active Ejari & Regulatory Contracts</h3>
              <ul style={{ paddingLeft: '18px', margin: 0, fontSize: '0.875rem' }}>
                <li style={{ marginBottom: '10px' }}>
                  <strong>Ejari Contract #EJ-2026-9901</strong><br />
                  <span style={{ color: TEXT_MUTED }}>Status: Active (Expires 2027-01-15)</span>
                </li>
                <li style={{ marginBottom: '10px' }}>
                  <strong>DLD Form 7 Notice</strong><br />
                  <span style={{ color: TEXT_MUTED }}>Status: Acknowledged</span>
                </li>
              </ul>
            </div>

            <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
              <h3 style={{ color: RED, marginTop: 0 }}>🛠️ Open Maintenance Tickets</h3>
              <div style={{ background: WHITE, padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
                <strong>Ticket #TK-402: HVAC Inspection</strong>
                <div style={{ color: RED, fontWeight: 700, fontSize: '0.75rem', marginTop: '4px' }}>● Dispatch In-Progress</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT 2: LEVEL 2/3 BROKER / AGENT FILTERED DASHBOARD VIEW
  // ---------------------------------------------------------------------------
  if (effectiveAccessLevel === 2 || effectiveAccessLevel === 3) {
    const brokerLeads = leadsList.filter(l => l.assignedBroker === activeUser?.name || true);

    return (
      <div data-testid="variant2-broker-dashboard" style={{ background: WHITE, color: SLATE, minHeight: '85vh' }}>
        {/* Header & Personal Target Strip */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: `2px solid ${RED}`, paddingBottom: '12px' }}>
          <div>
            <h2 style={{ margin: 0, color: SLATE, fontSize: '1.5rem', fontWeight: 800 }}>
              Broker Workspace — {activeUser?.name}
            </h2>
            <p style={{ margin: '4px 0 0 0', color: TEXT_MUTED, fontSize: '0.875rem' }}>
              Role: <strong>{activeUser?.roleTitle}</strong> | Access Clearance: <strong>Level {effectiveAccessLevel} Broker</strong>
            </p>
          </div>
          {impersonatedUser && (
            <div style={{ background: '#FEF2F2', border: `1px solid ${RED}`, padding: '6px 12px', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ color: RED, fontWeight: 700, fontSize: '0.8rem' }}>🎭 Impersonation Mode Active</span>
              <button onClick={clearImpersonation} style={{ background: RED, color: WHITE, border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer', fontSize: '0.75rem' }}>
                Exit
              </button>
            </div>
          )}
        </div>

        {/* Personal Performance Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
          <div style={{ background: CARD_BG, padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${RED}` }}>
            <span style={{ fontSize: '0.75rem', color: TEXT_MUTED, textTransform: 'uppercase', fontWeight: 700 }}>Your Active Leads</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: RED, marginTop: '4px' }}>{brokerLeads.length} Leads</div>
          </div>
          <div style={{ background: CARD_BG, padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${RED}` }}>
            <span style={{ fontSize: '0.75rem', color: TEXT_MUTED, textTransform: 'uppercase', fontWeight: 700 }}>Monthly AED Target</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: SLATE, marginTop: '4px' }}>5,000,000 AED</div>
          </div>
          <div style={{ background: CARD_BG, padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${RED}` }}>
            <span style={{ fontSize: '0.75rem', color: TEXT_MUTED, textTransform: 'uppercase', fontWeight: 700 }}>Achieved Volume</span>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: RED, marginTop: '4px' }}>4,200,000 AED</div>
          </div>
          <div style={{ background: CARD_BG, padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${RED}` }}>
            <span style={{ fontSize: '0.75rem', color: TEXT_MUTED, textTransform: 'uppercase', fontWeight: 700 }}>Active Commission Split</span>
            <div style={{ fontSize: '1rem', fontWeight: 800, color: RED, marginTop: '4px' }}>{getCommissionSplit(4200000)}</div>
          </div>
        </div>

        {/* Assigned Leads Kanban & Calendar */}
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
          {/* Kanban Board */}
          <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
            <h3 style={{ color: RED, marginTop: 0 }}>Your Assigned Lead Pipeline</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
              {['New', 'Contacted', 'Negotiation', 'Closed'].map(statusCol => (
                <div key={statusCol} style={{ background: WHITE, padding: '10px', borderRadius: '6px', border: '1px solid #E2E8F0', minHeight: '180px' }}>
                  <h4 style={{ margin: '0 0 10px 0', borderBottom: `2px solid ${RED}`, paddingBottom: '4px', fontSize: '0.85rem' }}>{statusCol}</h4>
                  {brokerLeads.filter(l => l.status === statusCol).map(l => (
                    <div
                      key={l.id}
                      onClick={() => setSelectedLeadForModal(l)}
                      style={{ padding: '8px', background: CARD_BG, border: `1px solid ${BORDER_COLOR}`, borderRadius: '4px', marginBottom: '8px', cursor: 'pointer' }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '0.8rem' }}>{l.name}</div>
                      <div style={{ fontSize: '0.7rem', color: TEXT_MUTED }}>Priority: {l.priority}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Showing Calendar */}
          <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}` }}>
            <h3 style={{ color: RED, marginTop: 0 }}>📅 Today&apos;s Showings</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ background: WHITE, padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
                <strong>11:00 AM — Signature Villa Al Barari</strong>
                <div style={{ color: TEXT_MUTED }}>Client: Mark Stevenson</div>
                <div style={{ color: RED, fontWeight: 700, fontSize: '0.75rem', marginTop: '4px' }}>● Confirmed</div>
              </div>
              <div style={{ background: WHITE, padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.85rem' }}>
                <strong>03:30 PM — Downtown Penthouse</strong>
                <div style={{ color: TEXT_MUTED }}>Client: Fatima Al Sayed</div>
                <div style={{ color: RED, fontWeight: 700, fontSize: '0.75rem', marginTop: '4px' }}>● Pending Confirmation</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // VARIANT 1: LEVEL 5 MASTER / MANAGING DIRECTOR "LION" DECK
  // ---------------------------------------------------------------------------
  return (
    <div data-testid="variant1-master-dashboard" style={{ background: WHITE, color: SLATE, minHeight: '100vh' }}>
      
      {/* Top Department Switcher Strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', borderBottom: `2px solid ${RED}`, paddingBottom: '12px' }}>
        <div>
          <h1 style={{ margin: 0, color: SLATE, fontSize: '1.75rem', fontWeight: 800 }}>
            White Caves Founder Master Control Deck
          </h1>
          <p style={{ margin: '4px 0 0 0', color: TEXT_MUTED, fontSize: '0.875rem' }}>
            Managing Director Oversight: <strong style={{ color: RED }}>{activeUser?.name}</strong> | Mode: <strong style={{ color: RED }}>LEVEL 5 MASTER</strong>
          </p>
        </div>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
                padding: '6px 10px',
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

      {/* RENDER ACTIVE DEPARTMENT WORKSPACE */}
      {(activeDepartment === 'sales' || activeDepartment === '') && (
        <div>
          {/* Master Metric Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: CARD_BG, padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${RED}` }}>
              <span style={{ fontSize: '0.75rem', color: TEXT_MUTED, textTransform: 'uppercase', fontWeight: 700 }}>Total Company Revenue</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: RED, marginTop: '4px' }}>42,850,000 AED</div>
            </div>
            <div style={{ background: CARD_BG, padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${RED}` }}>
              <span style={{ fontSize: '0.75rem', color: TEXT_MUTED, textTransform: 'uppercase', fontWeight: 700 }}>Active Property Inventory</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: SLATE, marginTop: '4px' }}>{propertiesList.length} Units</div>
            </div>
            <div style={{ background: CARD_BG, padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${RED}` }}>
              <span style={{ fontSize: '0.75rem', color: TEXT_MUTED, textTransform: 'uppercase', fontWeight: 700 }}>Total Active Personnel</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: RED, marginTop: '4px' }}>{personnel.length} Staff</div>
            </div>
            <div style={{ background: CARD_BG, padding: '16px', borderRadius: '8px', borderLeft: `4px solid ${RED}` }}>
              <span style={{ fontSize: '0.75rem', color: TEXT_MUTED, textTransform: 'uppercase', fontWeight: 700 }}>RERA Compliance Score</span>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: RED, marginTop: '4px' }}>99.4% PASS</div>
            </div>
          </div>

          {/* Gamified Podium & Commission Accelerator */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}`, textAlign: 'center' }}>
              <h3 style={{ color: RED, marginTop: 0 }}>🏆 Gamified Monthly Leaderboard Podium</h3>
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
                    const out = document.getElementById('calc-split-result-master');
                    if (out) out.innerText = getCommissionSplit(val);
                  }}
                  style={{ padding: '8px', border: `1px solid ${BORDER_COLOR}`, borderRadius: '4px', width: '150px' }}
                />
                <span style={{ fontSize: '0.875rem' }}>AED Gross Volume</span>
              </div>
              <p style={{ fontSize: '0.875rem', marginTop: '12px' }}>
                Active Commission Split: <strong id="calc-split-result-master" style={{ color: RED }}>70% Broker / 30% House (Accelerator Triggered!)</strong>
              </p>
            </div>
          </div>

          {/* Master 4-Column Kanban Lead Board */}
          <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}`, marginBottom: '24px' }}>
            <h3 style={{ color: RED, marginTop: 0 }}>Master 4-Column Kanban Lead Board</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
              {['New', 'Contacted', 'Negotiation', 'Closed'].map(statusCol => (
                <div key={statusCol} style={{ background: WHITE, padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0', minHeight: '200px' }}>
                  <h4 style={{ margin: '0 0 12px 0', borderBottom: `2px solid ${RED}`, paddingBottom: '4px' }}>{statusCol}</h4>
                  {leadsList.filter(l => l.status === statusCol).map(l => (
                    <div
                      key={l.id}
                      onClick={() => setSelectedLeadForModal(l)}
                      style={{ padding: '10px', background: CARD_BG, border: `1px solid ${BORDER_COLOR}`, borderRadius: '4px', marginBottom: '8px', cursor: 'pointer' }}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{l.name}</div>
                      <div style={{ fontSize: '0.75rem', color: TEXT_MUTED }}>Priority: {l.priority}</div>
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
              <h3 style={{ color: RED, margin: 0 }}>Master Property Inventory Table</h3>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ fontSize: '0.875rem' }}>Community Filter:</span>
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
                      <td style={{ padding: '8px' }}>{p.priceAED?.toLocaleString()} AED</td>
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

      {/* DEPARTMENT SUSPENSE VIEWS */}
      {activeDepartment === 'operations' && (
        <React.Suspense fallback={<div style={{ padding: '20px', color: RED }}>Loading Operations Viewport...</div>}>
          <OperationsDepartmentView />
        </React.Suspense>
      )}

      {activeDepartment === 'finance' && (
        <React.Suspense fallback={<div style={{ padding: '20px', color: RED }}>Loading Finance Viewport...</div>}>
          <FinanceDepartmentView />
        </React.Suspense>
      )}

      {/* EMPLOYEE DIRECTORY CRUD LEDGER (MASTER ONLY) */}
      {isMaster && (
        <div style={{ background: CARD_BG, padding: '20px', borderRadius: '8px', border: `1px solid ${BORDER_COLOR}`, marginTop: '24px' }}>
          <h3 style={{ color: RED, marginTop: 0 }}>Managing Director Staff Lifecycle & CRUD Ledger</h3>
          <p style={{ fontSize: '0.875rem' }}>Master privileges enabled for staff structure administration.</p>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
            {employees.map((emp: any) => (
              <div key={emp.id} style={{ background: WHITE, padding: '12px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
                <strong>{emp.name}</strong>
                <div style={{ fontSize: '0.75rem', color: TEXT_MUTED }}>Role: {emp.roleTitle || emp.role}</div>
                <div style={{ fontSize: '0.75rem', color: TEXT_MUTED }}>Status: {emp.isActive !== false ? 'Active' : 'Deactivated'}</div>
                
                <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
                  <button
                    onClick={() => triggerOnboardingCheck(emp.name)}
                    style={{ background: '#E2E8F0', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '0.7rem', cursor: 'pointer' }}
                  >
                    Onboard Scan
                  </button>
                  {emp.isActive !== false && (
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
            <button
              type="submit"
              style={{ background: RED, color: WHITE, border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 600 }}
            >
              Add Employee
            </button>
          </form>
        </div>
      )}

      {/* KANBAN ACTION MODAL */}
      {selectedLeadForModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: WHITE, padding: '24px', borderRadius: '8px', width: '400px', border: `2px solid ${RED}` }}>
            <h3 style={{ color: RED, marginTop: 0 }}>Kanban Action Details Modal</h3>
            <div>Lead Name: <strong>{selectedLeadForModal.name}</strong></div>
            <div>Lead Email: {selectedLeadForModal.email}</div>
            
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
