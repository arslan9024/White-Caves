import React from 'react';
import type { LindaViewTab } from './LindaWhatsAppCRM.types';

export interface LindaViewTabsProps {
  isDark: boolean;
  activeViewTab: LindaViewTab;
  setActiveViewTab: (tab: LindaViewTab) => void;
}

const TABS: { id: LindaViewTab; label: string }[] = [
  { id: 'all', label: '🎛️ All Components Unified View (Default)' },
  { id: 'terminal', label: '📟 4-Panel Terminal, F1–F35 & Playbooks' },
  { id: 'sessions', label: '📱 Multi-Account Sessions & QR/Code (2.1/2.2)' },
  { id: 'outreach', label: '📢 Campaigns & Area Owner Outreach (F35)' },
  { id: 'conversations', label: '💬 Convos (F34), Mary Sourcing & 10 Pillars' },
];

export const LindaViewTabs: React.FC<LindaViewTabsProps> = ({
  isDark,
  activeViewTab,
  setActiveViewTab,
}) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 14 }}>
      {TABS.map(tab => {
        const isActive = activeViewTab === tab.id;
        return (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveViewTab(tab.id)}
            style={{
              background: isActive
                ? '#25D366'
                : isDark
                  ? 'rgba(15, 23, 42, 0.78)'
                  : '#F1F5F9',
              color: isActive
                ? '#022C22'
                : isDark
                  ? '#E2E8F0'
                  : '#334155',
              border: isActive
                ? '1px solid #25D366'
                : isDark
                  ? '1px solid rgba(148, 163, 184, 0.28)'
                  : '1px solid #CBD5E1',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 12,
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
