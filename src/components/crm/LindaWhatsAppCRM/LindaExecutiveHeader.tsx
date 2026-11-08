import React from 'react';
import {
  Clock,
  Volume2,
  VolumeX,
  RefreshCw,
  Smartphone,
  Sparkles,
  X,
} from 'lucide-react';
import { LindaViewTabs } from './LindaViewTabs';
import type { LindaViewTab } from './LindaWhatsAppCRM.types';

export interface LindaExecutiveHeaderProps {
  isDark: boolean;
  isConnected: boolean;
  lindaStatus: string;
  loadingAction: 'start' | 'stop' | null;
  controlError: string;
  activeViewTab: LindaViewTab;
  setActiveViewTab: (tab: LindaViewTab) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  currentTimeGST: string;
  heartbeatLatency: number;
  confirmEmergencyStop: boolean;
  setConfirmEmergencyStop: (val: boolean) => void;
  toastNotification: string | null;
  setToastNotification: (val: string | null) => void;
  onRefreshStatus: () => void;
  onToggleRuntime: () => void;
}

export const LindaExecutiveHeader: React.FC<LindaExecutiveHeaderProps> = ({
  isDark,
  isConnected,
  lindaStatus,
  loadingAction,
  controlError,
  activeViewTab,
  setActiveViewTab,
  soundEnabled,
  setSoundEnabled,
  currentTimeGST,
  heartbeatLatency,
  confirmEmergencyStop,
  setConfirmEmergencyStop,
  toastNotification,
  setToastNotification,
  onRefreshStatus,
  onToggleRuntime,
}) => {
  const headerBg = isDark
    ? 'linear-gradient(135deg, rgba(37,211,102,0.22), rgba(15,23,42,0.92))'
    : 'linear-gradient(135deg, rgba(220,252,231,0.9), #FFFFFF)';
  const headerBorder = isDark ? '1px solid rgba(37, 211, 102, 0.4)' : '1px solid rgba(34, 197, 94, 0.35)';
  const titleColor = isDark ? '#ECFDF5' : '#064E3B';
  const subtitleColor = isDark ? '#A7F3D0' : '#047857';
  const badgeBg = isDark ? 'rgba(2, 6, 23, 0.75)' : '#F1F5F9';
  const badgeBorder = isDark ? '1px solid rgba(148, 163, 184, 0.25)' : '1px solid #E2E8F0';
  const primaryTextColor = isDark ? '#F8FAFC' : '#0F172A';

  return (
    <header
      style={{
        background: headerBg,
        border: headerBorder,
        borderRadius: 14,
        padding: 18,
        boxShadow: isDark ? '0 8px 24px rgba(0,0,0,0.3)' : '0 4px 18px rgba(34, 197, 94, 0.08)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div
            style={{
              width: 46,
              height: 46,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #25D366, #128C7E)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF',
              boxShadow: '0 6px 18px rgba(37, 211, 102, 0.35)',
            }}
          >
            <Smartphone size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <h2 style={{ margin: 0, color: titleColor, fontSize: 19 }}>
                Linda — WhatsApp Bot Visual Operations Center
              </h2>
              <span
                style={{
                  background: isDark ? 'rgba(34, 197, 94, 0.2)' : 'rgba(34, 197, 94, 0.15)',
                  border: '1px solid rgba(34, 197, 94, 0.5)',
                  color: isDark ? '#86EFAC' : '#15803D',
                  borderRadius: 999,
                  padding: '2px 10px',
                  fontSize: 11,
                  fontWeight: 700,
                }}
              >
                v2.0.0-enterprise · 300/300 Upgrades
              </span>
              <span
                style={{
                  background: 'rgba(239, 68, 68, 0.15)',
                  border: '1px solid rgba(239, 68, 68, 0.5)',
                  color: '#EF4444',
                  borderRadius: 999,
                  padding: '2px 8px',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.04em',
                }}
              >
                TOP #1 PRIORITY ASSISTANT
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', color: subtitleColor, fontSize: 12 }}>
              Synced with <code>arslan9024/whatsapp-bot-linda</code> · Multi-Account LocalAuth · Pinned 4-Panel Terminal · 35 Features (F1–F35) · 10 Playbooks (P1–P10) · Area Owner Outreach Planner (F35)
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          {/* Live Clock & Latency Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              background: badgeBg,
              padding: '6px 12px',
              borderRadius: 8,
              border: badgeBorder,
              fontSize: 11,
              color: isDark ? '#CBD5E1' : '#475569',
            }}
          >
            <Clock size={13} color="#38BDF8" />
            <strong style={{ color: primaryTextColor }}>{currentTimeGST || 'Asia/Dubai'}</strong>
            <span style={{ color: '#64748B' }}>•</span>
            <span style={{ color: '#16A34A', fontWeight: 700 }}>{heartbeatLatency}ms</span>
          </div>

          {/* Sound Toggle */}
          <button
            type="button"
            title={soundEnabled ? 'Mute sound alerts' : 'Enable sound alerts'}
            onClick={() => setSoundEnabled(!soundEnabled)}
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
              border: isDark ? '1px solid rgba(148, 163, 184, 0.25)' : '1px solid #CBD5E1',
              color: soundEnabled ? '#10B981' : '#94A3B8',
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {soundEnabled ? <Volume2 size={14} /> : <VolumeX size={14} />}
          </button>

          {/* Health Refresh */}
          <button
            type="button"
            title="Refresh Health & Diagnostics"
            onClick={onRefreshStatus}
            style={{
              background: isDark ? 'rgba(255, 255, 255, 0.08)' : '#FFFFFF',
              border: isDark ? '1px solid rgba(148, 163, 184, 0.25)' : '1px solid #CBD5E1',
              color: primaryTextColor,
              borderRadius: 8,
              padding: '6px 10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: 5,
              fontSize: 12,
            }}
          >
            <RefreshCw size={13} /> Check Health
          </button>

          <span
            role="status"
            aria-live="polite"
            style={{
              color: isConnected ? (isDark ? '#86EFAC' : '#15803D') : (isDark ? '#FCA5A5' : '#B91C1C'),
              fontSize: 12,
              fontWeight: 700,
              background: badgeBg,
              padding: '6px 12px',
              borderRadius: 8,
              border: badgeBorder,
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: isConnected ? '#22C55E' : '#EF4444',
                boxShadow: isConnected ? '0 0 10px #22C55E' : '0 0 10px #EF4444',
              }}
            />
            Linda Runtime: {isConnected ? 'CONNECTED' : lindaStatus.toUpperCase()}
          </span>

          {/* Emergency Stop Safeguard */}
          {confirmEmergencyStop ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <button
                type="button"
                onClick={() => {
                  onToggleRuntime();
                  setConfirmEmergencyStop(false);
                }}
                style={{
                  background: '#DC2626',
                  border: '1px solid #EF4444',
                  color: '#FFFFFF',
                  borderRadius: 8,
                  padding: '7px 12px',
                  cursor: 'pointer',
                  fontSize: 12,
                  fontWeight: 800,
                }}
              >
                Confirm Stop
              </button>
              <button
                type="button"
                onClick={() => setConfirmEmergencyStop(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#CBD5E1',
                  borderRadius: 8,
                  padding: '7px 10px',
                  cursor: 'pointer',
                  fontSize: 12,
                }}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                if (isConnected) {
                  setConfirmEmergencyStop(true);
                } else {
                  onToggleRuntime();
                }
              }}
              disabled={loadingAction !== null}
              style={{
                background: isConnected ? 'rgba(220,38,38,0.24)' : 'rgba(22,163,74,0.28)',
                border: isConnected
                  ? '1px solid rgba(248,113,113,0.5)'
                  : '1px solid rgba(34,197,94,0.55)',
                color: isConnected ? '#FECACA' : '#DCFCE7',
                borderRadius: 8,
                padding: '7px 14px',
                cursor: loadingAction !== null ? 'not-allowed' : 'pointer',
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              {loadingAction === 'start'
                ? 'Starting Linda…'
                : loadingAction === 'stop'
                  ? 'Stopping Linda…'
                  : isConnected
                    ? 'Stop Linda Runtime'
                    : 'Start Linda Runtime'}
            </button>
          )}
        </div>
      </div>

      {/* Toast Notification Strip */}
      {toastNotification && (
        <div
          role="status"
          style={{
            marginTop: 12,
            background: 'linear-gradient(90deg, rgba(37, 211, 102, 0.18), rgba(15, 23, 42, 0.85))',
            border: '1px solid rgba(37, 211, 102, 0.45)',
            borderRadius: 8,
            padding: '8px 12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            color: '#ECFDF5',
            fontSize: 12,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={14} color="#4ADE80" />
            <span>{toastNotification}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastNotification(null)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94A3B8',
              cursor: 'pointer',
              padding: 2,
            }}
          >
            <X size={14} />
          </button>
        </div>
      )}

      {controlError && (
        <p style={{ margin: '8px 0 0 0', color: '#FCA5A5', fontSize: 12 }}>{controlError}</p>
      )}

      <LindaViewTabs
        isDark={isDark}
        activeViewTab={activeViewTab}
        setActiveViewTab={setActiveViewTab}
      />
    </header>
  );
};
