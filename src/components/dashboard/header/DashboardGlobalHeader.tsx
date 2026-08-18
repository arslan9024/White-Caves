/**
 * DashboardGlobalHeader.tsx
 *
 * Collapsible executive system header banner for White Caves ERP Command Core.
 */

import React, { FC } from 'react';
import { useNavigate } from 'react-router-dom';
import type { BuildingTier, AIAssistantOption } from '../../../pages/crm/CRMHubPage.logic';

export interface DashboardGlobalHeaderProps {
  isHeaderCollapsed: boolean;
  onToggleCollapse: (collapsed: boolean) => void;
  openTopTile: 'md_office' | 'corporate' | 'ai_command' | null;
  selectedDept: BuildingTier;
  selectedAi: AIAssistantOption;
  activeLocationTag: string;
}

export const DashboardGlobalHeader: FC<DashboardGlobalHeaderProps> = ({
  isHeaderCollapsed,
  onToggleCollapse,
  openTopTile,
  selectedDept,
  selectedAi,
  activeLocationTag,
}) => {
  const navigate = useNavigate();

  if (isHeaderCollapsed) {
    return (
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.5rem' }}>
        <button
          onClick={() => onToggleCollapse(false)}
          title="Expand Top Header Bar"
          style={{
            background: '#0F172A',
            color: '#38BDF8',
            border: '1px solid #06B6D4',
            borderRadius: '8px',
            padding: '4px 12px',
            fontSize: '0.78rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'all 0.2s ease',
          }}
        >
          ▼ Show Header
        </button>
      </div>
    );
  }

  const badgeText =
    openTopTile === 'md_office'
      ? '👑 MD Sovereign Suite'
      : openTopTile === 'corporate'
      ? `🏛️ ${selectedDept.num}: ${selectedDept.name}`
      : `🤖 ${selectedAi.num}: ${selectedAi.name}`;

  return (
    <div
      className="unified-global-system-header"
      style={{
        width: '100%',
        background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
        color: '#FFFFFF',
        padding: '0.85rem 1.25rem',
        borderRadius: '14px',
        marginBottom: '0.85rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 16px rgba(15, 23, 42, 0.15)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.2s ease',
        flexWrap: 'wrap',
        gap: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <img
          src="/company-logo.jpg"
          alt="White Caves"
          style={{ width: '36px', height: '36px', borderRadius: '8px', objectFit: 'cover' }}
        />
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
            <h1 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 900, color: '#FFFFFF', letterSpacing: '-0.01em' }}>
              White Caves Real Estate LLC — ERP Command Core
            </h1>
            <span
              style={{
                background: 'rgba(6, 182, 212, 0.2)',
                color: '#38BDF8',
                border: '1px solid #06B6D4',
                fontSize: '0.78rem',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '6px',
              }}
            >
              {badgeText}
            </span>
          </div>

          <span style={{ fontSize: '0.78rem', color: '#CBD5E1', fontWeight: 600, display: 'block', marginTop: '2px' }}>
            Active Meta-Tag: <strong style={{ color: '#F59E0B' }}>{activeLocationTag}</strong> · MD: Arslan Malik
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <button
          onClick={() => navigate('/profile')}
          style={{
            background: '#FFFFFF',
            border: 'none',
            borderRadius: '8px',
            padding: '6px 12px',
            fontSize: '0.8rem',
            fontWeight: 800,
            color: '#0F172A',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.08)',
          }}
        >
          👤 Executive Profile
        </button>
        <button
          onClick={() => onToggleCollapse(true)}
          title="Collapse Top Header Bar"
          style={{
            background: 'rgba(255, 255, 255, 0.1)',
            color: '#FFFFFF',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '8px',
            padding: '6px 10px',
            fontSize: '0.8rem',
            fontWeight: 800,
            cursor: 'pointer',
          }}
        >
          ▲ Hide Header
        </button>
      </div>
    </div>
  );
};

export default DashboardGlobalHeader;
