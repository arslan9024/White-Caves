/**
 * UnifiedWorkspaceLayout.tsx — View Layer (Atomic 3-Folder Pattern)
 *
 * Single Recursive Red/White/Slate Left Column Sidebar.
 * Houses the [Managing Director Hub] section group locked strictly to Level 5 sessions.
 * Palette: #EF4444 (Red) | #FFFFFF (White) | #1E293B (Slate)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PanelLeftClose, PanelLeft, Search, ShieldCheck, ChevronDown, ChevronUp, Bell } from 'lucide-react';
import TopNavbar from '../components/TopNavbar/TopNavbar';
import CavesFloatingSearch from '../components/CavesFloatingSearch/CavesFloatingSearch';
import CavesWhatsAppWidget from '../components/CavesWhatsAppWidget/CavesWhatsAppWidget';
import { useWorkspaceLayoutLogic } from './UnifiedWorkspaceLayout.logic';
import { getLicenseStatuses, hasExpiringLicenses } from '../utils/licenseMonitors';
import { ROLE_LABELS } from '../context/UserRoleContext';

// ─── Props ────────────────────────────────────────────────────────────────────

interface UnifiedWorkspaceLayoutProps {
  currentUserEmail?: string;
  initialViewId?: string;
  children?: React.ReactNode;
}

// ─── Component ────────────────────────────────────────────────────────────────

export const UnifiedWorkspaceLayout: React.FC<UnifiedWorkspaceLayoutProps> = ({
  currentUserEmail = 'arslanmalikgoraha@gmail.com',
  initialViewId = 'VIEW-01',
  children,
}) => {
  const navigate = useNavigate();
  const [isMdHubOpen, setIsMdHubOpen] = useState(true);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const {
    userProfile,
    activeViewCode,
    searchTerm,
    activeCategory,
    activeView,
    categories,
    filteredViews,
    setActiveViewCode,
    setSearchTerm,
    setActiveCategory,
  } = useWorkspaceLayoutLogic(currentUserEmail, initialViewId);

  const isLevel5 = userProfile.isFounder || userProfile.accessLevel >= 5;

  const statuses = React.useMemo(() => getLicenseStatuses(), []);
  const hasAlerts = hasExpiringLicenses(statuses);

  const alertBadge = hasAlerts ? (
    <span
      style={{
        width: '10px',
        height: '10px',
        backgroundColor: '#EF4444',
        borderRadius: '50%',
        display: 'inline-block',
        boxShadow: '0 0 8px #EF4444',
        animation: 'pulse 2s infinite',
      }}
    />
  ) : null;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#FFFFFF',
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* ── FIXED TOP NAVBAR ────────────────────────────────────────────────── */}
      <TopNavbar isMDMode={isLevel5} />

      {/* ── MAIN WORKSPACE BODY ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, paddingTop: '68px', height: 'calc(100vh - 68px)', overflow: 'hidden' }}>

        {/* ── UNIFIED RECURSIVE LEFT SIDEBAR (Red / White / Slate Theme) ───────── */}
        <aside
          style={{
            width: isSidebarCollapsed ? '72px' : '310px',
            backgroundColor: '#1E293B',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '2px solid #EF4444',
            flexShrink: 0,
            transition: 'width 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
            overflowX: 'hidden',
          }}
        >
          {/* Sidebar Brand Header & Collapse Toggle */}
          <div
            style={{
              padding: isSidebarCollapsed ? '16px 8px' : '16px 18px',
              backgroundColor: '#0F172A',
              borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
              gap: '10px',
            }}
          >
            {!isSidebarCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #EF4444 0%, #B91C1C 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '14px',
                    color: '#FFFFFF',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
                    flexShrink: 0,
                  }}
                >
                  WC
                </div>
                <div>
                  <h1 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: '#FFFFFF', letterSpacing: '0.5px' }}>
                    WHITE CAVES
                  </h1>
                  <span style={{ fontSize: '9px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                    Sovereign OS · L{userProfile.accessLevel}
                  </span>
                </div>
              </div>
            )}

            <button
              onClick={() => setIsSidebarCollapsed(prev => !prev)}
              title={isSidebarCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
              style={{
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#EF4444',
                borderRadius: '8px',
                padding: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              {isSidebarCollapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
            </button>
          </div>

          {/* 👑 MANAGING DIRECTOR HUB (LEVEL 5 EXCLUSIVE SIDEBAR GROUP) ───────── */}
          {isLevel5 && !isSidebarCollapsed && (
            <div
              style={{
                backgroundColor: 'rgba(239, 68, 68, 0.08)',
                borderBottom: '1.5px solid rgba(239, 68, 68, 0.4)',
              }}
            >
              <button
                onClick={() => setIsMdHubOpen((prev) => !prev)}
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  backgroundColor: 'rgba(239, 68, 68, 0.15)',
                  border: 'none',
                  color: '#EF4444',
                  fontWeight: 800,
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>👑 [Managing Director Hub]</span>
                  {alertBadge}
                </div>
                <span>{isMdHubOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}</span>
              </button>

              {isMdHubOpen && (
                <div style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <button
                    onClick={() => navigate('/crm')}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: '#0F172A',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#F8FAFC',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>📊</span> 12-Department Pipeline Overview
                  </button>

                  <button
                    onClick={() => navigate('/owner/governance')}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: '#0F172A',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#F8FAFC',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>🏛️</span> Governing Expiry Monitors (DET/RERA)
                  </button>

                  <button
                    onClick={() => navigate('/owner/whatsapp')}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '8px 10px',
                      borderRadius: '6px',
                      background: '#0F172A',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#F8FAFC',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span>🤖</span> Nadia & Nina AI Dispatch Array
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Search & Category Filter (Visible when expanded) */}
          {!isSidebarCollapsed && (
            <div style={{ padding: '12px 14px', borderBottom: '1px solid #334155' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Search 100 enterprise views..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search workspace views"
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 32px',
                    borderRadius: '6px',
                    border: '1px solid #475569',
                    backgroundColor: '#0F172A',
                    color: '#FFFFFF',
                    fontSize: '12px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <Search size={14} style={{ position: 'absolute', left: '10px', color: '#94A3B8' }} />
              </div>
              <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', marginTop: '8px', paddingBottom: '4px' }}>
                {categories.slice(0, 5).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    aria-pressed={activeCategory === cat}
                    style={{
                      padding: '3px 8px',
                      borderRadius: '4px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      backgroundColor: activeCategory === cat ? '#EF4444' : '#334155',
                      color: '#FFFFFF',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Unified View Navigation */}
          <nav style={{ flex: 1, overflowY: 'auto', padding: isSidebarCollapsed ? '12px 6px' : '12px 8px' }} aria-label="Workspace views navigation">
            {!isSidebarCollapsed && (
              <div style={{ fontSize: '10px', fontWeight: 800, color: '#94A3B8', padding: '4px 10px', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Operations Registry ({filteredViews.length} Views)
              </div>
            )}
            {filteredViews.map((view) => {
              const isActive = view.code === activeViewCode || view.id === activeViewCode;
              return (
                <button
                  key={view.id}
                  onClick={() => setActiveViewCode(view.code)}
                  aria-current={isActive ? 'page' : undefined}
                  title={`${view.code} - ${view.title}`}
                  style={{
                    width: '100%',
                    textAlign: isSidebarCollapsed ? 'center' : 'left',
                    padding: isSidebarCollapsed ? '8px 4px' : '8px 10px',
                    marginBottom: '4px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: isActive ? '#EF4444' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#CBD5E1',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
                    fontSize: '12px',
                    fontWeight: isActive ? '700' : 'normal',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                    <span
                      style={{
                        fontSize: '9px',
                        padding: '2px 4px',
                        borderRadius: '4px',
                        backgroundColor: isActive ? 'rgba(255,255,255,0.25)' : '#334155',
                        color: '#FFFFFF',
                        fontFamily: 'monospace',
                        fontWeight: 700,
                      }}
                    >
                      {view.code}
                    </span>
                    {!isSidebarCollapsed && (
                      <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{view.title}</span>
                    )}
                  </div>
                  {!isSidebarCollapsed && (
                    <span style={{ fontSize: '9px', opacity: 0.7, textTransform: 'uppercase' }}>{view.category}</span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* User Footer with Role Badge */}
          <div
            style={{
              padding: isSidebarCollapsed ? '12px 6px' : '14px 16px',
              backgroundColor: '#0F172A',
              borderTop: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              gap: '10px',
            }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '50%',
                backgroundColor: isLevel5 ? '#EF4444' : '#334155',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 800,
                fontSize: '13px',
                flexShrink: 0,
                boxShadow: isLevel5 ? '0 0 10px rgba(239, 68, 68, 0.4)' : 'none',
              }}
            >
              {userProfile.name.charAt(0)}
            </div>
            {!isSidebarCollapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '12px', fontWeight: 800, color: '#FFFFFF', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {userProfile.name}
                </div>
                <div style={{ fontSize: '10px', color: isLevel5 ? '#EF4444' : '#94A3B8', fontWeight: 700 }}>
                  {isLevel5 ? '👑 Managing Director (L5)' : `L${userProfile.accessLevel} · ${ROLE_LABELS[userProfile.role as keyof typeof ROLE_LABELS] || userProfile.role}`}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ── MAIN CONTENT CANVAS ───────────────────────────────────────────── */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: '#FFFFFF', overflow: 'hidden' }}>
          {/* Content Header */}
          <header
            style={{
              height: '56px',
              borderBottom: '1px solid #E2E8F0',
              padding: '0 24px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#FFFFFF',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: '700' }}>
                {activeView.group} · {activeView.category}
              </div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 800, color: '#1E293B' }}>{activeView.title}</h2>
            </div>
          </header>

          {/* Content Body */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', backgroundColor: '#F8FAFC' }}>
            {children || (
              <div style={{ padding: '20px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                <h3 style={{ margin: '0 0 12px', color: '#1E293B', fontWeight: 800 }}>
                  {activeView.code}: {activeView.title}
                </h3>
                <p style={{ color: '#64748B', fontSize: '14px', lineHeight: 1.6 }}>
                  Active RUP Module rendering view for <strong>{userProfile.name}</strong> ({userProfile.role}). All operational parameters mapped to corporate Red (#EF4444), Crisp White (#FFFFFF), and Slate Dark (#1E293B).
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Widgets */}
      <CavesFloatingSearch />
      <CavesWhatsAppWidget />
    </div>
  );
};

export default UnifiedWorkspaceLayout;
