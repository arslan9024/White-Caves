/**
 * UnifiedWorkspaceLayout.tsx — View Layer (Atomic 3-Folder Pattern)
 *
 * Pure render shell — all logic delegated to useWorkspaceLayoutLogic().
 * Palette: #EF4444 (Red) | #FFFFFF (White) | #1E293B (Slate)
 */

import React from 'react';
import TopNavbar from '../components/navigation/TopNavbar';
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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', width: '100vw', backgroundColor: 'var(--bg-canvas, #FFFFFF)', fontFamily: 'Inter, sans-serif' }}>

      {/* ── FIXED TOP NAVBAR ────────────────────────────────────────────────── */}
      <TopNavbar />

      {/* ── MAIN WORKSPACE BODY ─────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flex: 1, paddingTop: '64px', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>

        {/* ── LEFT SIDEBAR ──────────────────────────────────────────────────── */}
        <aside style={{ width: '320px', backgroundColor: 'var(--color-1e293b, #1E293B)', color: 'var(--white, #FFFFFF)', display: 'flex', flexDirection: 'column', borderRight: '1px solid var(--color-334155, #334155)', flexShrink: 0 }}>

          {/* Brand Header */}
          <div style={{ padding: '20px', backgroundColor: 'var(--color-0f172a, #0F172A)', borderBottom: '1px solid var(--color-334155, #334155)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '8px', backgroundColor: 'var(--accent-red, #EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '18px', color: 'var(--white, #FFFFFF)' }}>
              WC
            </div>
            <div>
              <h1 style={{ margin: 0, fontSize: '16px', fontWeight: 'bold', color: 'var(--white, #FFFFFF)', letterSpacing: '0.5px' }}>WHITE CAVES</h1>
              <span style={{ fontSize: '11px', color: 'var(--color-94a3b8, #94A3B8)', textTransform: 'uppercase', letterSpacing: '1px' }}>Real Estate LLC · Dubai</span>
            </div>
          </div>

          {/* Founder Badge */}
          {userProfile.isFounder && (
            <div style={{ padding: '10px 20px', backgroundColor: 'rgba(239, 68, 68, 0.15)', borderBottom: '1px solid rgba(239, 68, 68, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '12px', fontWeight: 'bold', color: 'var(--accent-red, #EF4444)' }}>👑 MASTER UNMASK (LEVEL 5)</span>
              <span style={{ fontSize: '10px', background: 'var(--accent-red, #EF4444)', color: 'var(--white, #FFFFFF)', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>FOUNDER</span>
            </div>
          )}

          {/* Search & Category Filter */}
          <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--color-334155, #334155)' }}>
            <input
              type="text"
              placeholder="Search 100 enterprise views..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search workspace views"
              style={{ width: '100%', padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--color-475569, #475569)', backgroundColor: 'var(--color-0f172a, #0F172A)', color: 'var(--white, #FFFFFF)', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
            />
            <div style={{ display: 'flex', gap: '4px', overflowX: 'auto', marginTop: '8px', paddingBottom: '4px' }}>
              {categories.slice(0, 5).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  aria-pressed={activeCategory === cat}
                  style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', fontSize: '11px', cursor: 'pointer', backgroundColor: activeCategory === cat ? 'var(--accent-red, #EF4444)' : 'var(--color-334155, #334155)', color: 'var(--white, #FFFFFF)', whiteSpace: 'nowrap' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* View Navigation */}
          <nav style={{ flex: 1, overflowY: 'auto', padding: '12px 8px' }} aria-label="Workspace views navigation">
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-secondary, #64748B)', padding: '4px 12px', marginBottom: '8px', textTransform: 'uppercase' }}>
              Unified Operations Navigation ({filteredViews.length} Views)
            </div>
            {filteredViews.map((view) => {
              const isActive = view.code === activeViewCode || view.id === activeViewCode;
              return (
                <button
                  key={view.id}
                  onClick={() => setActiveViewCode(view.code)}
                  aria-current={isActive ? 'page' : undefined}
                  style={{ width: '100%', textAlign: 'left', padding: '10px 12px', marginBottom: '4px', borderRadius: '6px', border: 'none', backgroundColor: isActive ? 'var(--accent-red, #EF4444)' : 'transparent', color: isActive ? 'var(--white, #FFFFFF)' : 'var(--color-cbd5e1, #CBD5E1)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '13px', fontWeight: isActive ? '600' : 'normal', transition: 'all 0.15s ease' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                    <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', backgroundColor: isActive ? 'rgba(255,255,255,0.2)' : 'var(--color-334155, #334155)', color: 'var(--white, #FFFFFF)', fontFamily: 'monospace' }}>
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
          <div style={{ padding: '16px', backgroundColor: 'var(--color-0f172a, #0F172A)', borderTop: '1px solid var(--color-334155, #334155)', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--accent-red, #EF4444)', color: 'var(--white, #FFFFFF)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {userProfile.name.charAt(0)}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '13px', fontWeight: 'bold', color: 'var(--white, #FFFFFF)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{userProfile.name}</div>
              <div style={{ fontSize: '11px', color: 'var(--color-94a3b8, #94A3B8)' }}>{userProfile.role}</div>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ──────────────────────────────────────────────────── */}
        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: 'var(--white, #FFFFFF)', overflow: 'hidden' }}>
          {/* Content Header */}
          <header style={{ height: '64px', borderBottom: '1px solid var(--text-secondary, #E2E8F0)', padding: '0 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'var(--white, #FFFFFF)' }}>
            <div>
              <div style={{ fontSize: '12px', color: 'var(--text-secondary, #64748B)', textTransform: 'uppercase', fontWeight: '600' }}>
                {activeView.group} · {activeView.category}
              </div>
              <h2 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: 'var(--color-1e293b, #1E293B)' }}>
                [{activeView.code}] {activeView.title}
              </h2>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '20px', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--accent-red, #EF4444)', fontWeight: 'bold' }}>
                Entry: {activeView.entryPoint}
              </div>
              <div style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '20px', backgroundColor: 'var(--color-f1f5f9, #F1F5F9)', color: 'var(--color-475569, #475569)', fontWeight: '600' }}>
                Flowchart: {activeView.flowchartRef}
              </div>
            </div>
          </header>

          {/* View Workspace */}
          <section style={{ flex: 1, overflowY: 'auto', padding: '24px', backgroundColor: 'var(--color-f8fafc, #F8FAFC)' }}>
            {children || (
              <div style={{ backgroundColor: 'var(--white, #FFFFFF)', padding: '32px', borderRadius: '12px', border: '1px solid var(--text-secondary, #E2E8F0)', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid var(--text-secondary, #E2E8F0)' }}>
                  <div>
                    <h3 style={{ margin: 0, color: 'var(--color-1e293b, #1E293B)', fontSize: '20px' }}>{activeView.title} Task Workspace</h3>
                    <p style={{ margin: '4px 0 0 0', color: 'var(--text-secondary, #64748B)', fontSize: '14px' }}>
                      Complete end-to-end task cycle workflow for {activeView.code}
                    </p>
                  </div>
                  <button style={{ padding: '10px 20px', borderRadius: '8px', backgroundColor: 'var(--accent-red, #EF4444)', color: 'var(--white, #FFFFFF)', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}>
                    Execute Task Action
                  </button>
                </div>

                {/* Task Execution Steps */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
                  {[
                    { step: 'STEP 1: ENTRY', value: activeView.entryPoint, accent: true },
                    { step: 'STEP 2: INPUT', value: 'Data Validation & Context', accent: false },
                    { step: 'STEP 3: PROCESSING', value: 'Business Logic Execution', accent: false },
                    { step: 'STEP 4: CONFIRMATION', value: 'Task Completion State', accent: false },
                  ].map(({ step, value, accent }) => (
                    <div key={step} style={{ padding: '16px', backgroundColor: accent ? 'var(--color-fff5f5, #FFF5F5)' : 'var(--color-f8fafc, #F8FAFC)', border: `1px solid ${accent ? 'var(--color-fecaca, #FECACA)' : 'var(--text-secondary, #E2E8F0)'}`, borderRadius: '8px' }}>
                      <div style={{ fontSize: '11px', color: accent ? 'var(--accent-red, #EF4444)' : 'var(--text-secondary, #64748B)', fontWeight: 'bold' }}>{step}</div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--color-1e293b, #1E293B)', marginTop: '4px' }}>{value}</div>
                    </div>
                  ))}
                </div>

                {/* Live Workspace Placeholder */}
                <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--color-f8fafc, #F8FAFC)', borderRadius: '8px', border: '2px dashed var(--color-cbd5e1, #CBD5E1)' }}>
                  <div style={{ fontSize: '32px', marginBottom: '12px' }}>⚙️</div>
                  <div style={{ fontSize: '16px', fontWeight: 'bold', color: 'var(--color-1e293b, #1E293B)' }}>View [{activeView.code}] Ready for Task Execution</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary, #64748B)', marginTop: '4px' }}>
                    Fully integrated into Unified Workspace Layout with brand palette enforcement (#EF4444).
                  </div>
                </div>
              </div>
            )}
          </section>
        </main>
      </div>
    </div>
  );
};

export default UnifiedWorkspaceLayout;
