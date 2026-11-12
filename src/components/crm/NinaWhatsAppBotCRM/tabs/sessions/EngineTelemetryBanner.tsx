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
        background: 'var(--bg-primary)',
        color: 'var(--text-primary)',
        borderRadius: '16px',
        padding: '1.5rem',
        boxShadow: 'var(--shadow-md)',
        border: '1px solid var(--primary-color)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1rem',
          borderBottom: '1px solid var(--border-color)',
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
                  color: 'var(--primary-color)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                }}
              >
                whatsapp-web.js v1.34.4 Core Engine Active
              </span>
              <span
                style={{
                  background: 'var(--color-primary-light)',
                  color: 'var(--primary-color)',
                  fontSize: '0.7rem',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '4px',
                }}
              >
                LocalAuth Persistent
              </span>
            </div>
            <h3 style={{ margin: '4px 0 0', fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              📱 Primary Core Line: +971 50 576 0056 (Arslan Malik)
            </h3>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span
            style={{
              background: 'var(--primary-color)',
              color: 'var(--color-white)',
              fontWeight: 800,
              fontSize: '0.82rem',
              padding: '6px 14px',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: 'var(--shadow-red)',
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
          background: 'var(--bg-secondary)',
          borderRadius: '12px',
          padding: '1rem',
          border: '1px solid var(--border-color)',
        }}
      >
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block' }}>Engine Library</span>
          <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>whatsapp-web.js LocalAuth</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block' }}>Real-time Status Sync</span>
          <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>{lastSyncTime} (Live Ping)</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block' }}>Network Latency</span>
          <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>{networkPing} ms (Ultra Fast)</strong>
        </div>
        <div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', display: 'block' }}>Device Battery Status</span>
          <strong style={{ fontSize: '0.92rem', color: 'var(--text-primary)' }}>🔋 {batteryLevel}% Charged</strong>
        </div>
      </div>
    </div>
  );
};
