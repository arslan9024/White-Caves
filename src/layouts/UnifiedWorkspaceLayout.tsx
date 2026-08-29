/**
 * UnifiedWorkspaceLayout.tsx — View Layer (Atomic 3-Folder Pattern)
 *
 * Upgraded Sovereign Layout with Large Sidebar Tiles, Sub-Item Accordion Trees,
 * High-Density Telemetry Viewports, and Full Integration with Zoe AI & Aurora SWE Docs.
 * Palette: var(--primary-red, #EF4444) | var(--white, #FFFFFF) | var(--card-dark, #1E293B)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PanelLeftClose,
  PanelLeft,
  Search,
  ChevronDown,
  ChevronUp,
  Layers,
} from 'lucide-react';
import TopNavbar from '../components/TopNavbar/TopNavbar';
import CavesFloatingSearch from '../components/CavesFloatingSearch/CavesFloatingSearch';
import CavesWhatsAppWidget from '../components/CavesWhatsAppWidget/CavesWhatsAppWidget';
import { useWorkspaceLayoutLogic } from './UnifiedWorkspaceLayout.logic';
import { WORKSPACE_VIEWS, WorkspaceViewItem } from './UnifiedWorkspaceLayout.data';
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
  const [activeSubItemId, setActiveSubItemId] = useState<string | null>(null);

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

  // Match active rich view data if available
  const richViewData: WorkspaceViewItem | undefined = React.useMemo(() => {
    return WORKSPACE_VIEWS.find(
      (v) => v.code === activeViewCode || v.id === activeViewCode || v.id === activeView.id
    );
  }, [activeViewCode, activeView]);

  const alertBadge = hasAlerts ? (
    <span
      style={{
        width: '10px',
        height: '10px',
        backgroundColor: 'var(--primary-red, #EF4444)',
        borderRadius: '50%',
        display: 'inline-block',
        boxShadow: '0 0 8px var(--primary-red, #EF4444)',
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
        backgroundColor: 'var(--white, #FFFFFF)',
        fontFamily: "'Plus Jakarta Sans', 'Inter', sans-serif",
      }}
    >
      {/* ── FIXED TOP NAVBAR ────────────────────────────────────────────────── */}
      <TopNavbar isMDMode={isLevel5} />

      {/* ── MAIN WORKSPACE BODY ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, paddingTop: '68px', height: 'calc(100vh - 68px)', overflow: 'hidden' }}>

        {/* ── UNIFIED RECURSIVE LEFT SIDEBAR (Red / White / Slate Theme with Big Tiles) ───────── */}
        <aside
          style={{
            width: isSidebarCollapsed ? '76px' : '340px',
            backgroundColor: 'var(--bg-dark, #0F172A)',
            color: 'var(--white, #FFFFFF)',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '2px solid var(--primary-red, #EF4444)',
            flexShrink: 0,
            transition: 'width 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
            overflowX: 'hidden',
          }}
        >
          {/* Sidebar Brand Header & Collapse Toggle */}
          <div
            style={{
              padding: isSidebarCollapsed ? '16px 8px' : '16px 18px',
              backgroundColor: 'var(--bg-darker, #0B0F19)',
              borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'space-between',
              gap: '10px',
            }}
          >
            {!isSidebarCollapsed && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'linear-gradient(135deg, var(--primary-red, #EF4444) 0%, var(--primary-red-hover, #DC2626) 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                    fontSize: '15px',
                    color: 'var(--white, #FFFFFF)',
                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.4)',
                    flexShrink: 0,
                  }}
                >
                  WC
                </div>
                <div>
                  <h1 style={{ margin: 0, fontSize: '14px', fontWeight: 800, color: 'var(--white, #FFFFFF)', letterSpacing: '0.5px' }}>
                    WHITE CAVES
                  </h1>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted, #94A3B8)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>
                    Sovereign ERP · L{userProfile.accessLevel}
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
                color: 'var(--primary-red, #EF4444)',
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
                backgroundColor: 'rgba(239, 68, 68, 0.06)',
                borderBottom: '1.5px solid rgba(239, 68, 68, 0.35)',
              }}
            >
              <button
                onClick={() => setIsMdHubOpen((prev) => !prev)}
                style={{
                  width: '100%',
                  padding: '12px 18px',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: 'none',
                  color: 'var(--primary-red, #EF4444)',
                  fontWeight: 800,
                  fontSize: '0.82rem',
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
                <div style={{ padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => {
                      setActiveViewCode('MD-BRIEF');
                      navigate('/crm');
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'var(--card-dark, #1E293B)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: 'var(--bg-light, #F8FAFC)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>📊</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--white, #FFFFFF)', fontWeight: 800 }}>Morning Briefing (08:00 AM)</div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted, #94A3B8)' }}>12-Department Overview</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveViewCode('MD-CRED');
                      navigate('/profile');
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'var(--card-dark, #1E293B)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: 'var(--bg-light, #F8FAFC)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>🏛️</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--white, #FFFFFF)', fontWeight: 800 }}>DET & RERA License Monitor</div>
                      <div style={{ fontSize: '10px', color: 'var(--accent-green, #10B981)' }}>License 1388443 Valid</div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setActiveViewCode('PROG-01');
                      navigate('/crm');
                    }}
                    style={{
                      width: '100%',
                      textAlign: 'left',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      background: 'var(--card-dark, #1E293B)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      color: 'var(--bg-light, #F8FAFC)',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>🌟</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ color: 'var(--white, #FFFFFF)', fontWeight: 800 }}>Project Progress Telemetry</div>
                      <div style={{ fontSize: '10px', color: 'var(--accent-blue, #3B82F6)' }}>Waves 1–68 · 100% Green</div>
                    </div>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Search & Category Filter (Visible when expanded) */}
          {!isSidebarCollapsed && (
            <div style={{ padding: '14px 16px', borderBottom: '1px solid var(--card-dark, #1E293B)' }}>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <input
                  type="text"
                  placeholder="Search views & sub-items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  aria-label="Search workspace views"
                  style={{
                    width: '100%',
                    padding: '9px 12px 9px 34px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color, #334155)',
                    backgroundColor: 'var(--card-dark, #1E293B)',
                    color: 'var(--white, #FFFFFF)',
                    fontSize: '12px',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
                <Search size={14} style={{ position: 'absolute', left: '11px', color: 'var(--text-muted, #94A3B8)' }} />
              </div>
              <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', marginTop: '10px', paddingBottom: '4px' }}>
                {categories.slice(0, 6).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    aria-pressed={activeCategory === cat}
                    style={{
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: 'pointer',
                      backgroundColor: activeCategory === cat ? 'var(--primary-red, #EF4444)' : 'var(--card-dark, #1E293B)',
                      color: 'var(--white, #FFFFFF)',
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      borderWidth: '1px',
                      borderStyle: 'solid',
                      borderColor: activeCategory === cat ? 'var(--primary-red, #EF4444)' : 'var(--border-color, #334155)',
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Large Card-Tile View Navigation */}
          <nav style={{ flex: 1, overflowY: 'auto', padding: isSidebarCollapsed ? '12px 6px' : '14px 12px' }} aria-label="Workspace views navigation">
            {!isSidebarCollapsed && (
              <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted, #94A3B8)', padding: '4px 8px', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', justifyContent: 'space-between' }}>
                <span>Operations Tiles</span>
                <span>{filteredViews.length} Views</span>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredViews.map((view) => {
                const isActive = view.code === activeViewCode || view.id === activeViewCode;
                const viewRich = WORKSPACE_VIEWS.find(v => v.code === view.code || v.id === view.id);

                return (
                  <div
                    key={view.id}
                    style={{
                      backgroundColor: isActive ? 'rgba(239, 68, 68, 0.12)' : 'var(--card-dark, #1E293B)',
                      border: isActive ? '1.5px solid var(--primary-red, #EF4444)' : '1px solid rgba(255, 255, 255, 0.05)',
                      borderRadius: '10px',
                      padding: isSidebarCollapsed ? '10px 4px' : '12px 14px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      boxShadow: isActive ? '0 4px 14px rgba(239, 68, 68, 0.25)' : 'none',
                    }}
                    onClick={() => {
                      setActiveViewCode(view.code);
                      setActiveSubItemId(null);
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: isSidebarCollapsed ? 'center' : 'space-between', gap: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                        <span
                          style={{
                            fontSize: '9px',
                            padding: '3px 6px',
                            borderRadius: '4px',
                            backgroundColor: isActive ? 'var(--primary-red, #EF4444)' : 'var(--border-color, #334155)',
                            color: 'var(--white, #FFFFFF)',
                            fontFamily: 'monospace',
                            fontWeight: 800,
                            letterSpacing: '0.5px',
                          }}
                        >
                          {view.code}
                        </span>

                        {!isSidebarCollapsed && (
                          <div style={{ overflow: 'hidden' }}>
                            <div
                              style={{
                                color: 'var(--white, #FFFFFF)',
                                fontWeight: isActive ? 800 : 700,
                                fontSize: '13px',
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                              }}
                            >
                              {view.title}
                            </div>
                            <div style={{ fontSize: '10px', color: isActive ? 'var(--red-light, #FCA5A5)' : 'var(--text-muted, #94A3B8)', marginTop: '2px' }}>
                              {viewRich?.departmentFloor || view.group}
                            </div>
                          </div>
                        )}
                      </div>

                      {!isSidebarCollapsed && viewRich?.badge && (
                        <span
                          style={{
                            fontSize: '9px',
                            padding: '2px 6px',
                            borderRadius: '9999px',
                            backgroundColor: isActive ? 'rgba(239, 68, 68, 0.25)' : 'rgba(255, 255, 255, 0.06)',
                            color: isActive ? 'var(--primary-red, #EF4444)' : 'var(--text-secondary, #CBD5E1)',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                          }}
                        >
                          {viewRich.badge}
                        </span>
                      )}
                    </div>

                    {/* Sub-Items Tree when Expanded & Active */}
                    {!isSidebarCollapsed && isActive && viewRich?.subItems && viewRich.subItems.length > 0 && (
                      <div
                        style={{
                          marginTop: '10px',
                          paddingTop: '8px',
                          borderTop: '1px solid rgba(239, 68, 68, 0.25)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                        }}
                      >
                        <div style={{ fontSize: '9px', fontWeight: 800, color: 'var(--red-light, #FCA5A5)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                          Nested Sub-Items & Modules
                        </div>
                        {viewRich.subItems.map((sub) => {
                          const isSubActive = activeSubItemId === sub.id;
                          return (
                            <button
                              key={sub.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSubItemId(sub.id);
                              }}
                              style={{
                                width: '100%',
                                textAlign: 'left',
                                padding: '6px 10px',
                                borderRadius: '6px',
                                backgroundColor: isSubActive ? 'var(--primary-red, #EF4444)' : 'rgba(15, 23, 42, 0.6)',
                                border: isSubActive ? '1px solid var(--primary-red, #EF4444)' : '1px solid rgba(255, 255, 255, 0.05)',
                                color: isSubActive ? 'var(--white, #FFFFFF)' : 'var(--border-color, #E2E8F0)',
                                fontSize: '11px',
                                fontWeight: isSubActive ? 700 : 500,
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                transition: 'all 0.15s ease',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <span style={{ opacity: 0.7, fontFamily: 'monospace', fontSize: '9px' }}>{sub.code}</span>
                                <span>{sub.label}</span>
                              </div>
                              <span style={{ fontSize: '10px', color: isSubActive ? 'var(--white, #FFFFFF)' : 'var(--accent-green, #10B981)' }}>●</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </nav>

          {/* User Footer with Role Badge */}
          <div
            style={{
              padding: isSidebarCollapsed ? '12px 6px' : '14px 18px',
              backgroundColor: 'var(--bg-darker, #0B0F19)',
              borderTop: '1px solid var(--card-dark, #1E293B)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isSidebarCollapsed ? 'center' : 'flex-start',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: isLevel5 ? 'var(--primary-red, #EF4444)' : 'var(--border-color, #334155)',
                color: 'var(--white, #FFFFFF)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '14px',
                flexShrink: 0,
                boxShadow: isLevel5 ? '0 0 12px rgba(239, 68, 68, 0.5)' : 'none',
              }}
            >
              {userProfile.name.charAt(0)}
            </div>
            {!isSidebarCollapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '13px', fontWeight: 800, color: 'var(--white, #FFFFFF)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {userProfile.name}
                </div>
                <div style={{ fontSize: '10px', color: isLevel5 ? 'var(--primary-red, #EF4444)' : 'var(--text-muted, #94A3B8)', fontWeight: 700 }}>
                  {isLevel5 ? '👑 Managing Director (L5)' : `L${userProfile.accessLevel} · ${ROLE_LABELS[userProfile.role as keyof typeof ROLE_LABELS] || userProfile.role}`}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* ── MAIN CONTENT CANVAS ───────────────────────────────────────────── */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--white, #FFFFFF)', overflow: 'hidden' }}>
          {/* Content Header Banner */}
          <header
            style={{
              height: '64px',
              borderBottom: '1px solid var(--border-color, #E2E8F0)',
              padding: '0 28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: 'var(--white, #FFFFFF)',
              boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
            }}
          >
            <div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary, #64748B)', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                {richViewData?.departmentFloor || activeView.group} · {activeView.category}
              </div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 800, color: 'var(--bg-dark, #0F172A)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>{activeView.title}</span>
                {richViewData?.assistantCode && (
                  <span style={{ fontSize: '11px', background: 'var(--slate-100, #F1F5F9)', color: 'var(--border-color, #475569)', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                    🤖 {richViewData.assistantCode}
                  </span>
                )}
              </h2>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => navigate('/crm')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color, #E2E8F0)',
                  backgroundColor: 'var(--white, #FFFFFF)',
                  color: 'var(--bg-dark, #0F172A)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>🏛️</span> Zoe Business Hub
              </button>

              <button
                onClick={() => navigate('/owner/governance')}
                style={{
                  padding: '8px 14px',
                  borderRadius: '8px',
                  border: 'none',
                  backgroundColor: 'var(--primary-red, #EF4444)',
                  color: 'var(--white, #FFFFFF)',
                  fontSize: '12px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)',
                }}
              >
                <span>🛡️</span> Sovereign Governance
              </button>
            </div>
          </header>

          {/* Content Body Viewport */}
          <div style={{ flex: 1, padding: '28px', overflowY: 'auto', backgroundColor: 'var(--bg-light, #F8FAFC)' }}>
            {children ? (
              children
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {/* Executive Tile Overview Card */}
                <div
                  style={{
                    backgroundColor: 'var(--white, #FFFFFF)',
                    borderRadius: '16px',
                    border: '1px solid var(--border-color, #E2E8F0)',
                    padding: '24px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '16px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                        <span style={{ backgroundColor: 'var(--primary-red, #EF4444)', color: 'var(--white, #FFFFFF)', padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 800, fontFamily: 'monospace' }}>
                          {activeView.code}
                        </span>
                        <h3 style={{ margin: 0, fontSize: '20px', fontWeight: 800, color: 'var(--bg-dark, #0F172A)' }}>
                          {activeView.title}
                        </h3>
                      </div>
                      <p style={{ margin: 0, color: 'var(--text-secondary, #64748B)', fontSize: '14px', maxWidth: '800px', lineHeight: 1.6 }}>
                        {richViewData?.description || `Active RUP Sovereign module operating under Dubai DET license 1388443 and RERA Brokerage ORN 44483.`}
                      </p>
                    </div>

                    <span
                      style={{
                        padding: '6px 12px',
                        borderRadius: '9999px',
                        backgroundColor: 'var(--green-bg, #ECFDF5)',
                        color: 'var(--accent-green, #10B981)',
                        border: '1px solid var(--green-border, #A7F3D0)',
                        fontSize: '11px',
                        fontWeight: 800,
                        textTransform: 'uppercase',
                      }}
                    >
                      ● Active Module · 100% Operational
                    </span>
                  </div>

                  {/* KPI Stat Cards Grid */}
                  {richViewData?.kpis && richViewData.kpis.length > 0 && (
                    <div
                      style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '16px',
                        marginTop: '20px',
                        paddingTop: '20px',
                        borderTop: '1px solid var(--slate-100, #F1F5F9)',
                      }}
                    >
                      {richViewData.kpis.map((kpi, idx) => (
                        <div
                          key={idx}
                          style={{
                            backgroundColor: 'var(--bg-light, #F8FAFC)',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color, #E2E8F0)',
                            padding: '16px',
                          }}
                        >
                          <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-secondary, #64748B)', textTransform: 'uppercase' }}>
                            {kpi.label}
                          </div>
                          <div style={{ fontSize: '24px', fontWeight: 800, color: 'var(--bg-dark, #0F172A)', marginTop: '4px' }}>
                            {kpi.value}
                          </div>
                          {kpi.trend && (
                            <div style={{ fontSize: '11px', color: 'var(--accent-green, #10B981)', fontWeight: 700, marginTop: '4px' }}>
                              ✓ {kpi.trend}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sub-Items Detailed Breakdown Panel */}
                {richViewData?.subItems && richViewData.subItems.length > 0 && (
                  <div
                    style={{
                      backgroundColor: 'var(--white, #FFFFFF)',
                      borderRadius: '16px',
                      border: '1px solid var(--border-color, #E2E8F0)',
                      padding: '24px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                    }}
                  >
                    <h4 style={{ margin: '0 0 16px', fontSize: '16px', fontWeight: 800, color: 'var(--bg-dark, #0F172A)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Layers size={18} style={{ color: 'var(--primary-red, #EF4444)' }} />
                      <span>Sub-Items & Operational Capabilities ({richViewData.subItems.length})</span>
                    </h4>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                      {richViewData.subItems.map((sub) => {
                        const isSelected = activeSubItemId === sub.id;
                        return (
                          <div
                            key={sub.id}
                            onClick={() => setActiveSubItemId(sub.id)}
                            style={{
                              backgroundColor: isSelected ? 'rgba(239, 68, 68, 0.04)' : 'var(--bg-light, #F8FAFC)',
                              border: isSelected ? '1.5px solid var(--primary-red, #EF4444)' : '1px solid var(--border-color, #E2E8F0)',
                              borderRadius: '12px',
                              padding: '16px',
                              cursor: 'pointer',
                              transition: 'all 0.2s ease',
                            }}
                          >
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary-red, #EF4444)', fontFamily: 'monospace', backgroundColor: 'rgba(239,68,68,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                {sub.code}
                              </span>
                              <span style={{ fontSize: '11px', color: 'var(--accent-green, #10B981)', fontWeight: 700 }}>
                                ✓ Ready
                              </span>
                            </div>
                            <div style={{ fontWeight: 800, fontSize: '14px', color: 'var(--bg-dark, #0F172A)', marginBottom: '4px' }}>
                              {sub.label}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-secondary, #64748B)', lineHeight: 1.4 }}>
                              Integrated sovereign subsystem ready for instant execution.
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Floating Action Controls */}
      <CavesFloatingSearch />
      <CavesWhatsAppWidget />
    </div>
  );
};

export default UnifiedWorkspaceLayout;
