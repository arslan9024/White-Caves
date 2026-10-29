/**
 * FounderActionPodium.tsx
 * Quick command action buttons for the Managing Director:
 * theme toggle, live AEGIS audit execution, multi-stage approvals modal launcher,
 * kanban pipeline toggle, and core module shortcuts.
 */

import React, { FC } from 'react';
import { motion } from 'framer-motion';

export interface FounderActionPodiumProps {
  themeMode: 'slate' | 'light';
  onToggleTheme: () => void;
  auditRunning: boolean;
  auditResult: string | null;
  onRunAudit: () => void;
  showKanban: boolean;
  onToggleKanban: () => void;
  onOpenApprovalModal: () => void;
  onNavigateToModule: (moduleId: string) => void;
}

export const FounderActionPodium: FC<FounderActionPodiumProps> = ({
  themeMode,
  onToggleTheme,
  auditRunning,
  auditResult,
  onRunAudit,
  showKanban,
  onToggleKanban,
  onOpenApprovalModal,
  onNavigateToModule,
}) => {
  return (
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
          {/* Day / Night Theme Switcher */}
          <button
            onClick={onToggleTheme}
            style={{
              background: 'rgba(15, 23, 42, 0.08)',
              color: '#0F172A',
              border: '1px solid #CBD5E1',
              borderRadius: '8px',
              padding: '8px 12px',
              fontSize: '0.78rem',
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            {themeMode === 'slate' ? '☀️ Light Luxury' : '🌙 Sovereign Slate'}
          </button>

          <button
            onClick={onRunAudit}
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
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '10px',
        }}
      >
        <button
          onClick={onOpenApprovalModal}
          style={{
            background: '#0F172A',
            color: '#FFFFFF',
            border: '1px solid #334155',
            borderRadius: '10px',
            padding: '12px',
            textAlign: 'left',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(15, 23, 42, 0.2)',
          }}
        >
          <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>✍️</div>
          <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Multi-Stage Approvals</div>
          <div style={{ fontSize: '0.72rem', color: '#94A3B8' }}>Manager → Legal → Founder</div>
        </button>

        <button
          onClick={onToggleKanban}
          style={{
            background: showKanban ? '#EF4444' : '#F8FAFC',
            color: showKanban ? '#FFFFFF' : '#0F172A',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '12px',
            textAlign: 'left',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>📋</div>
          <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>Department Kanban</div>
          <div style={{ fontSize: '0.72rem', color: showKanban ? '#FEE2E2' : '#64748B' }}>
            {showKanban ? 'Hide Task Pipeline' : 'Show 4-Stage Pipeline'}
          </div>
        </button>

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
  );
};

export default FounderActionPodium;
