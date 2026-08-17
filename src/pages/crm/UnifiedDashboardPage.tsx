import React, { FC, useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import { useWorkspace } from '../../context/WorkspaceContext';
import {
  mockProperties,
  mockLeads,
  mockRegulatoryContracts,
  mockLeasingTransactions,
  mockEmployees,
  Property,
  Lead,
  LeasingTransaction
} from '../../mocks/dubaiRealEstateMocks';
import { LeasingJourneyWizard } from '../../components/crm/LeasingJourneyWizard';
import { LeasingIntakeModal } from '../../components/LeasingIntakeModal';
import { EntityComments } from '../../components/EntityComments';
import { EmployeeLeaderboardPanel } from '../../components/crm/EmployeeLeaderboardPanel';
import { useUserRole, ROLE_LABELS } from '../../context/UserRoleContext';

const OperationsDepartmentView = React.lazy(() => import('./OperationsDepartmentView'));
const FinanceDepartmentView = React.lazy(() => import('./FinanceDepartmentView'));
const DocumentGenerationPanel = React.lazy(() => import('../../components/crm/DocumentGenerationPanel'));
const AuditTrailPanel = React.lazy(() => import('../../components/crm/AuditTrailPanel'));
const ComplianceDepartmentView = React.lazy(() => import('./ComplianceDepartmentView'));
const MarketingDepartmentView = React.lazy(() => import('./MarketingDepartmentView'));
const AIAssistantHub = React.lazy(() => import('../../components/crm/AIAssistantHub'));
const ExecutiveDepartmentView = React.lazy(() => import('./ExecutiveDepartmentView'));
const TechnologyDepartmentView = React.lazy(() => import('./TechnologyDepartmentView'));
const LegalDepartmentView = React.lazy(() => import('./LegalDepartmentView'));
const PropertySearchPanel = React.lazy(() => import('../../components/crm/PropertySearchPanel'));
const ViewingSchedulerPanel = React.lazy(() => import('../../components/crm/ViewingSchedulerPanel'));
const CommissionManagementPanel = React.lazy(() => import('../../components/crm/CommissionManagementPanel'));
const AnalyticsDashboardPanel = React.lazy(() => import('../../components/crm/AnalyticsDashboardPanel'));

const RED = '#EF4444';
const WHITE = '#FFFFFF';
const SLATE = '#1E293B';
const BORDER_COLOR = 'rgba(239, 68, 68, 0.2)';
const CARD_BG = '#F8FAFC';

const ORDERED_TABS = [
  { id: 'sales', num: '01', name: 'Sales Kanban', icon: '💰' },
  { id: 'properties', num: '02', name: 'Property Inventory', icon: '🏠' },
  { id: 'operations', num: '03', name: 'Viewing Scheduler', icon: '📅' },
  { id: 'documents', num: '04', name: 'Document Centre', icon: '📄' },
  { id: 'finance', num: '05', name: 'Commission Ledger', icon: '💵' },
  { id: 'marketing', num: '06', name: 'Marketing & Sync', icon: '📣' },
  { id: 'executive', num: '07', name: 'Executive Deck', icon: '📈' },
  { id: 'compliance', num: '08', name: 'Regulatory Audit', icon: '⚖️' },
  { id: 'technology', num: '09', name: 'Technology Monitor', icon: '⚙️' },
  { id: 'legal', num: '10', name: 'Legal & Disputes', icon: '📜' },
  { id: 'intelligence', num: '11', name: 'AI Intelligence', icon: '🤖' },
  { id: 'ai-command', num: '12', name: 'AI Command Centre', icon: '🎮' },
  { id: 'audit', num: '13', name: 'Master Audit Log', icon: '🔐' },
  { id: 'directory', num: '14', name: 'Employee Directory', icon: '👥' },
  { id: 'leaderboard', num: '🏆', name: 'Dual Leaderboards', icon: '⭐' },
];

export const UnifiedDashboardPage: FC = () => {
  useDocumentTitle('Workspace Control Panel | White Caves');
  const params = useParams<{ department?: string }>();
  const navigate = useNavigate();

  const { activeUser, effectiveAccessLevel, isMaster, personnel } = useWorkspace();
  const {
    role,
    accessLevel,
    isFounder,
    isManagingDirector,
    user: contextUser,
  } = useUserRole();

  const [activeDepartment, setActiveDepartment] = useState<string>('sales');
  const [leadsList, setLeadsList] = useState<Lead[]>(mockLeads);
  const [propertiesList] = useState<Property[]>(mockProperties);
  const [employees, setEmployees] = useState(mockEmployees);
  const [selectedLeadForModal, setSelectedLeadForModal] = useState<Lead | null>(null);

  useEffect(() => {
    if (params.department) {
      setActiveDepartment(params.department);
    }
  }, [params.department]);

  const availableTabs = React.useMemo(() => {
    return ORDERED_TABS.filter(tab => {
      if (isFounder || isManagingDirector || accessLevel >= 5) return true;
      if (accessLevel === 4) {
        return !['ai-command', 'audit'].includes(tab.id);
      }
      if (accessLevel === 3) {
        return ['sales', 'properties', 'operations', 'documents', 'marketing', 'directory', 'leaderboard'].includes(tab.id);
      }
      if (accessLevel === 2) {
        return ['sales', 'properties', 'operations', 'documents', 'leaderboard'].includes(tab.id);
      }
      // Level 1: Client / Intern
      return ['properties', 'operations', 'documents'].includes(tab.id);
    });
  }, [accessLevel, isFounder, isManagingDirector]);

  const handleTabClick = (tabId: string) => {
    setActiveDepartment(tabId);
    navigate(`/crm/${tabId}`);
  };

  const displayName = contextUser?.name || activeUser?.name || 'Arslan Malik';
  const isMasterUser = isFounder || isManagingDirector || isMaster || accessLevel >= 5;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', width: '100%', maxWidth: '1600px', margin: '0 auto' }}>
      {/* Managing Director Executive Greeting Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
          borderRadius: '16px',
          padding: '24px 32px',
          color: WHITE,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.15)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, margin: 0, fontFamily: 'Outfit, sans-serif' }}>
              Welcome Back, {displayName}
            </h1>
            <span style={{ background: isMasterUser ? RED : '#0ea5e9', color: WHITE, padding: '4px 10px', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: 800 }}>
              {isMasterUser ? 'LEVEL 5 MASTER MD' : `LEVEL ${accessLevel} · ${ROLE_LABELS[role] || role}`}
            </span>
          </div>
          <p style={{ margin: 0, color: 'var(--color-94a3b8, #94A3B8)', fontSize: '0.9rem' }}>
            White Caves Real Estate LLC — 14-Step Operational CRM Deck & Enterprise Dashboard
          </p>
        </div>

        <div style={{ display: 'flex', gap: '20px', textAlign: 'right' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-94a3b8, #94A3B8)' }}>Active Inventory</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-38bdf8, #38BDF8)' }}>{propertiesList.length} Units</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-94a3b8, #94A3B8)' }}>Total Workforce</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-4ade80, #4ADE80)' }}>{employees.length} Staff</div>
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--color-94a3b8, #94A3B8)' }}>Pipeline Value</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-facc15, #FACC15)' }}>AED 148.5M</div>
          </div>
        </div>
      </div>

      {/* High-Density 14-Step Numbered Operations Tab Bar */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '8px', borderBottom: '1px solid var(--text-secondary, #E2E8F0)' }}>
        {availableTabs.map(tab => {
          const isActive = activeDepartment === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 16px',
                borderRadius: '12px',
                border: isActive ? `2px solid ${RED}` : '1px solid #E2E8F0',
                background: isActive ? 'rgba(239, 68, 68, 0.08)' : WHITE,
                color: isActive ? RED : SLATE,
                fontWeight: isActive ? 700 : 600,
                fontSize: '0.85rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 200ms ease',
              }}
            >
              <span style={{ fontSize: '0.7rem', fontWeight: 800, opacity: 0.6 }}>{tab.num}</span>
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Department Viewport Area */}
      <React.Suspense fallback={<div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary, #64748B)' }}>Loading Department Viewport...</div>}>
        {activeDepartment === 'sales' && (
          <div style={{ background: WHITE, borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>01. Sales Kanban Pipeline (100 Active Leads)</h2>
              <button onClick={() => navigate('/crm')} style={{ background: CARD_BG, border: '1px solid var(--text-secondary, #E2E8F0)', padding: '6px 12px', borderRadius: '8px', fontSize: '0.8rem', cursor: 'pointer' }}>
                ← Return to Dashboard
              </button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px' }}>
              {['New', 'Contacted', 'ViewingScheduled', 'Negotiating', 'Closed'].map(stage => {
                const stageLeads = leadsList.filter(l => l.status === stage);
                return (
                  <div key={stage} style={{ background: CARD_BG, borderRadius: '12px', padding: '16px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 700, color: SLATE }}>
                        {stage} ({stageLeads.length})
                      </div>
                      {stage === 'New' && (
                        <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', color: RED, padding: '2px 8px', borderRadius: '12px', fontSize: '0.7rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px', animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite' }}>
                          <span style={{ display: 'inline-block', width: '6px', height: '6px', background: RED, borderRadius: '50%' }}></span>
                          SLA: 12m 45s
                        </div>
                      )}
                    </div>
                    {stageLeads.slice(0, 4).map(lead => (
                      <div
                        key={lead.id}
                        onClick={() => setSelectedLeadForModal(lead)}
                        style={{
                          background: WHITE,
                          padding: '12px',
                          borderRadius: '8px',
                          marginBottom: '8px',
                          border: '1px solid #E2E8F0',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{lead.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748B)' }}>Budget: AED {lead.budgetAED?.toLocaleString()}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--accent-green, #059669)', marginTop: '4px' }}>Nadia Score: {lead.aiConfidenceScore}/100</div>
                      </div>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeDepartment === 'properties' && <PropertySearchPanel />}
        {activeDepartment === 'operations' && <ViewingSchedulerPanel />}
        {activeDepartment === 'documents' && <DocumentGenerationPanel />}
        {activeDepartment === 'finance' && <CommissionManagementPanel />}
        {activeDepartment === 'marketing' && <MarketingDepartmentView />}
        {activeDepartment === 'executive' && <ExecutiveDepartmentView />}
        {activeDepartment === 'compliance' && <ComplianceDepartmentView />}
        {activeDepartment === 'technology' && <TechnologyDepartmentView />}
        {activeDepartment === 'legal' && <LegalDepartmentView />}
        {activeDepartment === 'intelligence' && <AIAssistantHub />}
        {activeDepartment === 'ai-command' && <AIAssistantHub />}
        {activeDepartment === 'audit' && <AuditTrailPanel />}
        {activeDepartment === 'directory' && (
          <div style={{ background: WHITE, borderRadius: '16px', padding: '24px', border: '1px solid #E2E8F0' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '16px' }}>14. Employee Directory (100 Staff Members)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
              {employees.slice(0, 15).map(emp => (
                <div key={emp.id} style={{ background: CARD_BG, padding: '12px', borderRadius: '8px', border: '1px solid var(--text-secondary, #E2E8F0)' }}>
                  <div style={{ fontWeight: 700 }}>{emp.name}</div>
                  <div style={{ fontSize: '0.8rem', color: RED }}>{emp.roleTitle} ({emp.department})</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #64748B)', fontFamily: 'monospace' }}>IBAN: {emp.iban.slice(0, 12)}...</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeDepartment === 'leaderboard' && <EmployeeLeaderboardPanel />}
      </React.Suspense>

      {/* Lead Details Modal with EntityComments */}
      {selectedLeadForModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
          <div style={{ background: WHITE, borderRadius: '16px', padding: '24px', width: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0 }}>Lead Inspection: {selectedLeadForModal.name}</h3>
              <button onClick={() => setSelectedLeadForModal(null)} style={{ background: 'none', border: 'none', fontSize: '1.2rem', cursor: 'pointer' }}>✕</button>
            </div>
            <p><strong>Email:</strong> {selectedLeadForModal.email}</p>
            <p><strong>Phone:</strong> {selectedLeadForModal.phone}</p>
            <p><strong>Budget:</strong> AED {selectedLeadForModal.budgetAED?.toLocaleString()}</p>
            <EntityComments
              entityType="lead"
              entityId={selectedLeadForModal.id}
              currentUserId={activeUser?.id || 'md-001'}
              currentUserName={activeUser?.name || 'Arslan Malik'}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default UnifiedDashboardPage;

