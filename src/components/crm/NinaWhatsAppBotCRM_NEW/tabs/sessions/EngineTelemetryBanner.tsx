import React from 'react';
import { Wifi } from 'lucide-react';

export interface EngineTelemetryBannerProps {
  lastSyncTime: string;
  networkPing: number;
  batteryLevel: number;
}

export const EngineTelemetryBanner: React.FC<EngineTelemetryBannerProps> = ({
  lastSyncTime,
  networkPing,
  batteryLevel,
}) => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #0F172A 0%, #164E63 100%)',
        color: '#FFFFFF',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: '0 8px 24px rgba(15, 23, 42, 0.2)',
        border: '1px solid rgba(6, 182, 212, 0.4)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          borderBottom: '1px solid rgba(255,255,255,0.12)',
          paddingBottom: '0.85rem',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span style={{ fontSize: '2.2rem' }}>⚡</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  color: 'var(--color-25d366, #25D366)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                whatsapp-web.js v1.34.4 Core Engine Active
              </span>
              <span
                style={{
                  background: 'rgba(37, 211, 102, 0.2)',
                  color: 'var(--color-25d366, #25D366)',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                LocalAuth Persistent
              </span>
            </div>
            <h3 style={{ margin: '4px 0 0', fontSize: '1.45rem', fontWeight: 800, color: 'var(--white, #FFFFFF)' }}>
              📱 Primary Core Line: +971 50 576 0056 (Arslan Malik)
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span
            style={{
              background: 'var(--color-25d366, #25D366)',
              color: 'var(--white, #FFFFFF)',
              fontWeight: 800,
              fontSize: '0.82rem',
              padding: '6px 14px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 4px 12px rgba(37, 211, 102, 0.3)',
            }}
          >
            <Wifi size={16} /> Device Online & Syncing
          </span>
        </div>
      </div>

      {/* Real-time Telemetry Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          background: 'rgba(255,255,255,0.06)',
          borderRadius: '12px',
          padding: '1rem',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-94a3b8, #94A3B8)', display: 'block' }}>Engine Library</span>
          <strong style={{ fontSize: '0.92rem', color: 'var(--color-38bdf8, #38BDF8)' }}>whatsapp-web.js LocalAuth</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-94a3b8, #94A3B8)', display: 'block' }}>Real-time Status Sync</span>
          <strong style={{ fontSize: '0.92rem', color: 'var(--accent-green, #10B981)' }}>{lastSyncTime} (Live Ping)</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-94a3b8, #94A3B8)', display: 'block' }}>Network Latency</span>
          <strong style={{ fontSize: '0.92rem', color: 'var(--accent-gold, #F59E0B)' }}>{networkPing} ms (Ultra Fast)</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--color-94a3b8, #94A3B8)', display: 'block' }}>Device Battery Status</span>
          <strong style={{ fontSize: '0.92rem', color: 'var(--accent-green, #10B981)' }}>🔋 {batteryLevel}% Charged</strong>
        </div>
      </div>
    </div>
  );
};

