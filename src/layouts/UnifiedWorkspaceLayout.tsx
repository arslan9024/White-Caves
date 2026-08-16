/**
 * UnifiedWorkspaceLayout.tsx — View Layer (Atomic 3-Folder Pattern)
 *
 * Single Recursive Red/White/Slate Left Column Sidebar.
 * Houses the [Managing Director Hub] section group locked strictly to Level 5 sessions.
 * Palette: #EF4444 (Red) | #FFFFFF (White) | #1E293B (Slate)
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TopNavbar from '../components/TopNavbar/TopNavbar';
import CavesFloatingSearch from '../components/CavesFloatingSearch/CavesFloatingSearch';
import CavesWhatsAppWidget from '../components/CavesWhatsAppWidget/CavesWhatsAppWidget';
import { useWorkspaceLayoutLogic } from './UnifiedWorkspaceLayout.logic';

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

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: '#FFFFFF',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* ── FIXED TOP NAVBAR ────────────────────────────────────────────────── */}
      <TopNavbar />

      {/* ── MAIN WORKSPACE BODY ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, paddingTop: '64px', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>

        {/* ── UNIFIED RECURSIVE LEFT SIDEBAR (Red / White / Slate Theme) ───────── */}
        <aside
          style={{
            width: '300px',
            backgroundColor: '#1E293B',
            color: '#FFFFFF',
            display: 'flex',
            flexDirection: 'column',
            borderRight: '2px solid #EF4444',
            flexShrink: 0,
          }}
        >
          {/* Sidebar Brand Header */}
          <div
            style={{
              padding: '16px 20px',
              backgroundColor: '#0F172A',
              borderBottom: '1px solid rgba(239, 68, 68, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
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
                fontSize: '15px',
                color: '#FFFFFF',
                boxShadow: '0 4px 12px rgba(239, 68, 68, 0.4)',
              }}
            >
              WC
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '15px', fontWeight: 'bold', color: '#FFFFFF', letterSpacing: '0.5px' }}>
                WHITE CAVES
              </h1>
              <span style={{ fontSize: '10px', color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Real Estate LLC · Sovereign OS
              </span>
            </div>
          </div>

          {/* 👑 MANAGING DIRECTOR HUB (LEVEL 5 EXCLUSIVE SIDEBAR GROUP) ───────── */}
          {isLevel5 && (
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
                <span>👑 [Managing Director Hub]</span>
                <span>{isMdHubOpen ? '▲' : '▼'}</span>
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
                    onClick={() => navigate('/profile')}
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

          {/* Search & Category Filter */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid #334155' }}>
            <input
              type="text"
              placeholder="Search 100 enterprise views..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search workspace views"
              style={{
                width: '100%',
                padding: '8px 12px',
                borderRadius: '6px',
                border: '1px solid #475569',
                backgroundColor: '#0F172A',
                color: '#FFFFFF',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
              }}
            />
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', marginTop: '8px', paddingBottom: '4px' }}>
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  style={{
                    padding: '4px 8px',
                    borderRadius: '4px',
                    border: 'none',
                    fontSize: '11px',
                    cursor: 'pointer',
                    backgroundColor: activeCategory === cat ? '#EF4444' : '#334155',
                    color: '#FFFFFF',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Unified View Navigation */}
          <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }} aria-label="Workspace views navigation">
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: '#94A3B8', padding: '4px 12px', marginBottom: '8px', textTransform: 'uppercase' }}>
              Operations Registry ({filteredViews.length} Views)
            </div>
            {filteredViews.map((view) => {
              const isActive = view.code === activeViewCode || view.id === activeViewCode;
              return (
                <button
                  key={view.id}
                  onClick={() => setActiveViewCode(view.code)}
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '9px 12px',
                    marginBottom: '4px',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor: isActive ? '#EF4444' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#CBD5E1',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '13px',
                    fontWeight: isActive ? '700' : 'normal',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <span
                      style={{
                        fontSize: '10px',
                        padding: '2px 5px',
                        borderRadius: '4px',
                        backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : '#334155',
                        color: '#FFFFFF',
                        fontFamily: 'monospace',
                      }}
                    >
                      {view.code}
                    </span>
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{view.title}</span>
                  </div>
                  <span style={{ fontSize: '10px', opacity: 0.7, textTransform: 'uppercase' }}>{view.category}</span>
                </button>
              );
            })}
          </nav>

          {/* User Footer */}
          <div
            style={{
              padding: '16px',
              backgroundColor: '#0F172A',
              borderTop: '1px solid #334155',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#EF4444',
                color: '#FFFFFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 'bold',
              }}
            >
              {userProfile.name.charAt(0)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#FFFFFF', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                {userProfile.name}
              </div>
              <div style={{ fontSize: '11px', color: '#94A3B8' }}>{userProfile.role}</div>
            </div>
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
              <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: '600' }}>
                {activeView.group} · {activeView.category}
              </div>
              <h2 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: '#1E293B' }}>{activeView.title}</h2>
            </div>
          </header>

          {/* Content Body */}
          <div style={{ flex: 1, padding: '24px', overflowY: 'auto', backgroundColor: '#F8FAFC' }}>
            {children || (
              <div style={{ padding: '20px', backgroundColor: '#FFFFFF', borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 16px rgba(0,0,0,0.04)' }}>
                <h3 style={{ margin: '0 0 12px', color: '#1E293B' }}>
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
