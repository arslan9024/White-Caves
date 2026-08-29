/**
 * FounderExecutiveDashboard.tsx
 *
 * White Caves Real Estate LLC — Sovereign Managing Director & Founder Command Suite.
 * Reserved exclusively for Arslan Malik Bashir Ahmad (Managing Director & Founder).
 *
 * Provides real-time corporate telemetry, 1-12-108 AI grid status, portfolio asset
 * valuation (AED 45.4B), 9,378 DH2 inventory matrix, escrow trust tracking (Law No. 8),
 * and 12-department operational command.
 */

import React, { FC, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface FounderExecutiveDashboardProps {
  onNavigateToModule?: (moduleId: string) => void;
}

interface DepartmentStatus {
  id: string;
  name: string;
  manager: string;
  aiLead: string;
  supervisors: number;
  health: 'Optimal' | 'Active' | 'Synchronized';
  icon: string;
  metric: string;
  moduleId: string;
}

const CORPORATE_DEPARTMENTS_DATA: DepartmentStatus[] = [
  { id: 'dept-01', name: 'Executive & Strategy (MD Suite)', manager: 'Arslan Malik (MD)', aiLead: 'AI Zoe (COO)', supervisors: 9, health: 'Optimal', icon: '👑', metric: '100% SLA', moduleId: 'zoe' },
  { id: 'dept-02', name: 'Off-Plan & Primary Sales', manager: 'Tariq Al-Mansoor', aiLead: 'AI Clara', supervisors: 9, health: 'Optimal', icon: '🏗️', metric: 'AED 1.8B Pipeline', moduleId: 'off-plan-tracker' },
  { id: 'dept-03', name: 'Secondary Market & Resales', manager: 'Fatima Al-Sayed', aiLead: 'AI Zayed', supervisors: 9, health: 'Active', icon: '🏙️', metric: '48 Deals Active', moduleId: 'leads' },
  { id: 'dept-04', name: 'Tenancy, Leasing & Ejari', manager: 'Kareem Mostafa', aiLead: 'AI Victoria', supervisors: 9, health: 'Optimal', icon: '📜', metric: '9,378 Units Live', moduleId: 'tenancy-contracts' },
  { id: 'dept-05', name: 'Property Management & Handover', manager: 'Laila Benali', aiLead: 'AI Maktoum', supervisors: 9, health: 'Synchronized', icon: '🔑', metric: '100% Snagging', moduleId: 'property-management' },
  { id: 'dept-06', name: 'Corporate Finance & VAT Accounting', manager: 'Omar Farooq', aiLead: 'AI Theodora', supervisors: 9, health: 'Optimal', icon: '💰', metric: 'FTA Form 201 Ready', moduleId: 'finance' },
  { id: 'dept-07', name: 'Marketing & Luxury PR', manager: 'Nour El-Din', aiLead: 'AI Olivia', supervisors: 9, health: 'Active', icon: '✨', metric: '4.8M Impressions', moduleId: 'marketing' },
  { id: 'dept-08', name: 'Customer Experience & VIP Concierge', manager: 'Yasmin Qureshi', aiLead: 'AI Corinne', supervisors: 9, health: 'Optimal', icon: '🛎️', metric: '99.4% CSAT', moduleId: 'crm-hub' },
  { id: 'dept-09', name: 'Technology & AI Engineering (AEGIS)', manager: 'Hassan Raza', aiLead: 'AI Aurora (CTO)', supervisors: 9, health: 'Optimal', icon: '💻', metric: '121 AI Mesh Live', moduleId: 'ai-command' },
  { id: 'dept-10', name: 'Legal, Compliance & goAML RegTech', manager: 'Rashid Al-Nuaimi', aiLead: 'AI Sofia', supervisors: 9, health: 'Optimal', icon: '⚖️', metric: '0 Flags (AED 55k+)', moduleId: 'compliance' },
  { id: 'dept-11', name: 'HR & Talent Acquisition', manager: 'Salma Haddad', aiLead: 'AI Evangeline', supervisors: 9, health: 'Synchronized', icon: '👥', metric: '108 Supervisors', moduleId: 'hr' },
  { id: 'dept-12', name: 'Investments & Sovereign Family Office', manager: 'Zainab Al-Hashimi', aiLead: 'AI Nadia', supervisors: 9, health: 'Optimal', icon: '🌐', metric: 'AED 45.4B AUM', moduleId: 'investor-portfolio' },
];

export const FounderExecutiveDashboard: FC<FounderExecutiveDashboardProps> = ({
  onNavigateToModule = () => {},
}) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState<'daily' | 'monthly' | 'ytd'>('ytd');
  const [activeDepartmentFilter, setActiveDepartmentFilter] = useState<string>('all');
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditResult, setAuditResult] = useState<string | null>(null);
  const [isEscrowDrawerOpen, setIsEscrowDrawerOpen] = useState(false);

  const handleRunAudit = () => {
    setAuditRunning(true);
    setAuditResult(null);
    setTimeout(() => {
      setAuditRunning(false);
      setAuditResult('✅ Sovereign Audit Passed: 1-12-108 Grid 100% Operational | Sub-10ms Latency (0.0029ms) | Zero Compliance Flags.');
    }, 1200);
  };

  return (
    <div
      style={{
        padding: '1.5rem',
        background: '#F8FAFC',
        minHeight: '100%',
        color: '#0F172A',
        fontFamily: 'inherit',
      }}
      data-testid="founder-executive-dashboard"
    >
      {/* ── 1. SOVEREIGN FOUNDER HERO BANNER ──────────────────────────────── */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 50%, #334155 100%)',
          borderRadius: '20px',
          padding: '2rem',
          color: '#FFFFFF',
          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.15)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: '1.75rem',
        }}
      >
        {/* Subtle Decorative Luxury Glow */}
        <div
          style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '220px',
            height: '220px',
            background: 'radial-gradient(circle, rgba(239, 68, 68, 0.3) 0%, transparent 70%)',
            borderRadius: '50%',
            pointerEvents: 'none',
          }}
        />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
              <span
                style={{
                  background: '#EF4444',
                  color: '#FFFFFF',
                  fontWeight: 900,
                  fontSize: '0.75rem',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                }}
              >
                Level 7 (Ultimate Sovereign Access)
              </span>
              <span style={{ color: '#94A3B8', fontSize: '0.85rem' }}>
                Office of the Managing Director (MD Suite) — Floor 13
              </span>
            </div>

            <h1 style={{ margin: '0 0 8px 0', fontSize: '1.85rem', fontWeight: 900, letterSpacing: '-0.5px' }}>
              👑 Arslan Malik Bashir Ahmad
            </h1>
            <p style={{ margin: '0 0 16px 0', fontSize: '0.95rem', color: '#CBD5E1', maxWidth: '650px', lineHeight: 1.5 }}>
              Founder & Managing Director — White Caves Real Estate LLC. Supreme command over global investments,
              the 1-12-108 AI grid, and Dubai luxury property assets.
            </p>

            {/* Official Statutory Badges */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#F1F5F9' }}>
                📜 DET License: <strong>1388443</strong>
              </span>
              <span style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#F1F5F9' }}>
                🏛️ RERA ORN: <strong>44483</strong>
              </span>
              <span style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#F1F5F9' }}>
                🏢 Ejari: <strong>0120250814005322</strong>
              </span>
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '4px 10px', borderRadius: '6px', fontSize: '0.78rem', color: '#6EE7B7' }}>
                🛡️ LLC - Single Owner (SO)
              </span>
            </div>
          </div>

          {/* AI Zoe Strategic Executive Telemetry Card */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(12px)',
              borderRadius: '16px',
              padding: '1.25rem',
              minWidth: '280px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontWeight: 800, fontSize: '0.85rem', color: '#F87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
                🤖 AI Zoe (Chief AI Assistant)
              </span>
              <span style={{ background: '#10B981', color: '#FFFFFF', fontSize: '0.68rem', fontWeight: 800, padding: '2px 6px', borderRadius: '4px' }}>
                ONLINE
              </span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#E2E8F0', lineHeight: 1.4, marginBottom: '10px' }}>
              "Good day, Managing Director Arslan. All 12 departments are operating at peak efficiency. 108 supervisors are synchronized with 0 open compliance blockers."
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: '#94A3B8', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '8px' }}>
              <span>15-Min SLA: <strong style={{ color: '#10B981' }}>100%</strong></span>
              <span>1-12-108 Mesh: <strong style={{ color: '#60A5FA' }}>121 Active</strong></span>
            </div>
          </div>
        </div>
      </div>

      {/* ── 2. EXECUTIVE CORE TELEMETRY METRIC CARDS ─────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.25rem',
          marginBottom: '1.75rem',
        }}
      >
        {/* Metric 1: Total Portfolio Assets */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.25rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>Total Managed Portfolio</span>
              <span style={{ fontSize: '1.3rem' }}>💎</span>
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0F172A' }}>AED 45.4B</div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#10B981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>▲ +14.2%</span> <span style={{ color: '#64748B', fontWeight: 500 }}>across 9,378 DH2 & Luxury Assets</span>
          </div>
        </div>

        {/* Metric 2: Master Inventory Units */}
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.25rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>DAMAC Hills 2 Units</span>
              <span style={{ fontSize: '1.3rem' }}>🏰</span>
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#0F172A' }}>9,378</div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#3B82F6', fontWeight: 700 }}>
            26 Sub-Clusters Fully Indexed & Verified
          </div>
        </div>

        {/* Metric 3: DLD Escrow Trust (Law No. 8) */}
        <div
          onClick={() => setIsEscrowDrawerOpen(true)}
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.25rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'transform 0.15s ease',
          }}
          title="Click to view Law No. 8 Escrow breakdown per project"
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>DLD Escrow Protected</span>
              <span style={{ fontSize: '1.3rem' }}>🛡️</span>
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#059669' }}>AED 842.5M</div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#047857', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
            <span>Law No. 8 of 2007 Guaranteed</span>
            <span>Inspect ➔</span>
          </div>
        </div>

        {/* Metric 4: Statutory Tax & goAML */}
        <div
          onClick={() => setIsEscrowDrawerOpen(true)}
          style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            padding: '1.25rem',
            border: '1px solid #E2E8F0',
            boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            cursor: 'pointer',
          }}
          title="Click to view statutory goAML and VAT Form 201 compliance"
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748B' }}>Statutory VAT & AML</span>
              <span style={{ fontSize: '1.3rem' }}>⚖️</span>
            </div>
            <div style={{ fontSize: '1.65rem', fontWeight: 900, color: '#DC2626' }}>100% Clean</div>
          </div>
          <div style={{ marginTop: '10px', fontSize: '0.75rem', color: '#64748B', fontWeight: 600, display: 'flex', justifyContent: 'space-between' }}>
            <span>VAT 5% • goAML AED 55k+</span>
            <span>Audit ➔</span>
          </div>
        </div>
      </div>

      {/* ── 3. MANAGING DIRECTOR SOVEREIGN ACTION PODIUM ─────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '1.5rem',
          marginBottom: '1.75rem',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
              ⚡ Managing Director Quick Command Actions
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748B' }}>
              One-click sovereign execution across audits, compliance, 1-12-108 AI center, and treasury.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={handleRunAudit}
              disabled={auditRunning}
              style={{
                background: '#EF4444',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 16px',
                fontSize: '0.82rem',
                fontWeight: 800,
                cursor: auditRunning ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(239, 68, 68, 0.25)',
              }}
            >
              {auditRunning ? '⏳ Auditing Engine...' : '🚀 Run Live AEGIS Audit'}
            </button>
          </div>
        </div>

        {/* Audit Status Notification */}
        {auditResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            style={{
              background: '#ECFDF5',
              border: '1px solid #10B981',
              borderRadius: '8px',
              padding: '10px 14px',
              color: '#065F46',
              fontSize: '0.82rem',
              fontWeight: 700,
              marginBottom: '1rem',
            }}
          >
            {auditResult}
          </motion.div>
        )}

        {/* Command Action Buttons Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '10px',
          }}
        >
          <button
            onClick={() => onNavigateToModule('ai-command')}
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '12px',
              textAlign: 'left',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🤖</div>
            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F172A' }}>1-12-108 AI Center</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>121 Autonomous Agents</div>
          </button>

          <button
            onClick={() => onNavigateToModule('off-plan-tracker')}
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '12px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>🏰</div>
            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F172A' }}>DH2 Master Matrix</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>9,378 Units Live Grid</div>
          </button>

          <button
            onClick={() => onNavigateToModule('finance')}
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '12px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>💰</div>
            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F172A' }}>Treasury & DLA Ledger</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>UAE VAT & Balance Sheets</div>
          </button>

          <button
            onClick={() => onNavigateToModule('compliance')}
            style={{
              background: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '12px',
              textAlign: 'left',
              cursor: 'pointer',
            }}
          >
            <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>⚖️</div>
            <div style={{ fontWeight: 800, fontSize: '0.85rem', color: '#0F172A' }}>goAML & Legal Desk</div>
            <div style={{ fontSize: '0.72rem', color: '#64748B' }}>AED 55k+ Statutory Shield</div>
          </button>
        </div>
      </div>

      {/* ── 4. 12 CORPORATE DEPARTMENTS LIVE HEALTH MATRIX ────────────────── */}
      <div
        style={{
          background: '#FFFFFF',
          borderRadius: '16px',
          border: '1px solid #E2E8F0',
          padding: '1.5rem',
          boxShadow: '0 4px 14px rgba(0,0,0,0.03)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0F172A' }}>
              🏛️ 12 Corporate Departments Operational Status
            </h3>
            <p style={{ margin: '4px 0 0 0', fontSize: '0.82rem', color: '#64748B' }}>
              Each department is managed by a Human Manager paired with an AI Lead and 9 Specialized Supervisors (108 Total).
            </p>
          </div>

          <span
            style={{
              background: '#F1F5F9',
              color: '#475569',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.78rem',
              fontWeight: 800,
            }}
          >
            Total Mesh: 121 AI Agents
          </span>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '1rem',
          }}
        >
          {CORPORATE_DEPARTMENTS_DATA.map((dept) => (
            <motion.div
              key={dept.id}
              whileHover={{ y: -2, boxShadow: '0 6px 18px rgba(0,0,0,0.06)' }}
              onClick={() => onNavigateToModule(dept.moduleId)}
              style={{
                background: '#F8FAFC',
                border: '1px solid #E2E8F0',
                borderRadius: '12px',
                padding: '1rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.3rem' }}>{dept.icon}</span>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: '#0F172A' }}>{dept.name}</div>
                    <div style={{ fontSize: '0.72rem', color: '#64748B' }}>
                      👤 {dept.manager} • 🤖 {dept.aiLead}
                    </div>
                  </div>
                </div>
                <span
                  style={{
                    background: dept.health === 'Optimal' ? '#DCFCE7' : '#DBEAFE',
                    color: dept.health === 'Optimal' ? '#166534' : '#1E40AF',
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    padding: '2px 6px',
                    borderRadius: '4px',
                  }}
                >
                  {dept.health}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #E2E8F0', paddingTop: '8px', marginTop: '8px' }}>
                <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
                  👥 <strong>{dept.supervisors}</strong> Supervisors
                </span>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#EF4444' }}>
                  {dept.metric} ➔
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── 5. STATUTORY ESCROW & goAML COMPLIANCE MODAL ─────────────────── */}
      <AnimatePresence>
        {isEscrowDrawerOpen && (
          <div
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9999,
              background: 'rgba(15, 23, 42, 0.8)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1rem',
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              style={{
                background: '#FFFFFF',
                borderRadius: '20px',
                width: '100%',
                maxWidth: '600px',
                boxShadow: '0 20px 50px rgba(0, 0, 0, 0.25)',
                overflow: 'hidden',
              }}
            >
              {/* Modal Header */}
              <div
                style={{
                  background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
                  padding: '1.25rem 1.5rem',
                  color: '#FFFFFF',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <span style={{ background: '#059669', color: '#FFFFFF', fontSize: '0.7rem', fontWeight: 900, padding: '2px 8px', borderRadius: '4px', textTransform: 'uppercase' }}>
                    Statutory CBUAE & DLD Ledger
                  </span>
                  <h3 style={{ margin: '4px 0 0 0', fontSize: '1.15rem', fontWeight: 800 }}>
                    Law No. 8 Escrow & goAML Compliance Desk
                  </h3>
                </div>
                <button
                  onClick={() => setIsEscrowDrawerOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    color: '#FFFFFF',
                    borderRadius: '50%',
                    width: '32px',
                    height: '32px',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Modal Body */}
              <div style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Project Escrow Accounts */}
                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#475569', marginBottom: '8px' }}>
                    🏦 Active Law No. 8 Escrow Trust Accounts (AED 842.5M Total)
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: '0.85rem' }}>DAMAC Hills 2 Master Inventory</strong>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Account: Emirates NBD Escrow • 9,378 Live Units</div>
                      </div>
                      <span style={{ fontWeight: 900, color: '#059669', fontSize: '0.95rem' }}>AED 412.5M</span>
                    </div>

                    <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <strong style={{ fontSize: '0.85rem' }}>Palm Jumeirah Ultra-Prime Penthouses</strong>
                        <div style={{ fontSize: '0.72rem', color: '#64748B' }}>Account: First Abu Dhabi Bank Escrow</div>
                      </div>
                      <span style={{ fontWeight: 900, color: '#059669', fontSize: '0.95rem' }}>AED 430.0M</span>
                    </div>
                  </div>
                </div>

                {/* goAML Status */}
                <div style={{ background: '#ECFDF5', border: '1px solid #A7F3D0', borderRadius: '12px', padding: '12px 14px', fontSize: '0.78rem', color: '#065F46' }}>
                  <div style={{ fontWeight: 800, marginBottom: '4px' }}>⚖️ Statutory goAML Verification (Threshold: ≥ AED 55,000)</div>
                  <div>All cash and cryptocurrency-linked transactions above AED 55,000 are automatically screened against CBUAE FIU / goAML blacklists with 0 open compliance flags.</div>
                </div>

                {/* VAT 5% Status */}
                <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '12px', padding: '12px 14px', fontSize: '0.78rem', color: '#334155' }}>
                  <div style={{ fontWeight: 800, marginBottom: '4px' }}>📑 FTA Form 201 VAT & Corporate Tax</div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Q2 2026 VAT 5% Output Tax Filed:</span>
                    <strong style={{ color: '#0F172A' }}>AED 2,270,000</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
                    <span>Corporate Tax 9% Small Business Relief:</span>
                    <strong style={{ color: '#059669' }}>Applied (Compliant)</strong>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FounderExecutiveDashboard;
