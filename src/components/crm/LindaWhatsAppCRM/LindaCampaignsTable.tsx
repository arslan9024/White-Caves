import React, { memo } from 'react';
import { Pause, Play } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import type { LindaCampaignItem } from './LindaWhatsAppCRM.data';

export interface LindaCampaignsTableProps {
  campaigns: LindaCampaignItem[];
  onToggleCampaignStatus: (campaignId: string) => void;
}

/**
 * LindaCampaignsTable — Outreach Campaigns & Drip Broadcasts List
 * Modularized under AEGIS APOCALYPSE-AEG-042 (< 350 lines).
 */
export const LindaCampaignsTable: React.FC<LindaCampaignsTableProps> = memo(({
  campaigns,
  onToggleCampaignStatus,
}) => {
  const { isDark } = useTheme();

  return (
    <div
      style={{
        background: isDark ? 'rgba(15, 23, 42, 0.82)' : '#FFFFFF',
        border: isDark ? '1px solid rgba(245, 158, 11, 0.35)' : '1px solid #FDE68A',
        borderRadius: 12,
        padding: 14,
        boxShadow: isDark ? 'none' : '0 2px 8px rgba(15, 23, 42, 0.05)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h3 style={{ margin: 0, color: isDark ? '#FEF3C7' : '#0F172A', fontSize: 15 }}>
            📢 Outreach Campaigns & Drip Broadcasts ({campaigns.length})
          </h3>
          <p style={{ margin: '4px 0 0 0', color: isDark ? '#94A3B8' : '#64748B', fontSize: 12 }}>
            Cluster-specific drip messaging with jitter delay & daily cap protection
          </p>
        </div>
      </div>

      <div style={{ display: 'grid', gap: 10 }}>
        {campaigns.map(camp => {
          const isActive = camp.status === 'active';
          const pct = Math.round((camp.sent / camp.total) * 100);

          return (
            <div
              key={camp.id}
              style={{
                background: isDark ? '#0F172A' : '#F8FAFC',
                border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0',
                borderRadius: 8,
                padding: 12,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div>
                  <div style={{ fontWeight: 700, color: isDark ? '#F8FAFC' : '#0F172A', fontSize: 13 }}>{camp.name}</div>
                  <div style={{ fontSize: 11, color: isDark ? '#94A3B8' : '#64748B', marginTop: 2 }}>
                    Cluster: <strong style={{ color: isDark ? '#CBD5E1' : '#334155' }}>{camp.cluster}</strong> · {camp.rateLimit} · Next:{' '}
                    {camp.nextBatch}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleCampaignStatus(camp.id)}
                  style={{
                    background: isActive
                      ? isDark
                        ? 'rgba(245, 158, 11, 0.18)'
                        : '#FEF3C7'
                      : isDark
                        ? 'rgba(34, 197, 94, 0.2)'
                        : '#DCFCE7',
                    border: isActive
                      ? '1px solid rgba(245, 158, 11, 0.5)'
                      : '1px solid rgba(34, 197, 94, 0.5)',
                    color: isActive
                      ? isDark
                        ? '#FDE68A'
                        : '#92400E'
                      : isDark
                        ? '#BBF7D0'
                        : '#166534',
                    borderRadius: 6,
                    padding: '5px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  {isActive ? (
                    <>
                      <Pause size={12} /> Pause
                    </>
                  ) : (
                    <>
                      <Play size={12} /> Resume
                    </>
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              <div style={{ marginTop: 8 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: isDark ? '#94A3B8' : '#64748B', marginBottom: 4 }}>
                  <span>
                    Sent: <strong style={{ color: isDark ? '#F8FAFC' : '#0F172A' }}>{camp.sent}</strong> / {camp.total}
                  </span>
                  <span style={{ color: isDark ? '#FBBF24' : '#D97706', fontWeight: 700 }}>{pct}% Complete</span>
                </div>
                <div style={{ background: isDark ? '#020617' : '#E2E8F0', height: 6, borderRadius: 999, overflow: 'hidden' }}>
                  <div
                    style={{
                      background: 'linear-gradient(90deg, #F59E0B, #22C55E)',
                      width: `${pct}%`,
                      height: '100%',
                      borderRadius: 999,
                      transition: 'width 0.4s ease',
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});
