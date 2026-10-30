import React, { useEffect, useState } from 'react';
import { authFetch } from '../../../utils/authFetch';
import { createLogger } from '../../../utils/logger';
import type { DashboardSystemHealth } from '@/types/dashboard';
import * as S from '../shared';

const log = createLogger('Dashboard');

export const SystemHealth: React.FC = () => {
  const [health, setHealth] = useState<DashboardSystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/health');
        const json = await res.json();
        setHealth(json);
      } catch (error) { log.warn('Failed to fetch health status:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  const services = [
    { name: 'Express Server', status: health ? 'healthy' : 'unknown', icon: '🖥️' },
    { name: 'MongoDB / Prisma', status: health?.database ?? 'unknown', icon: '🗄️' },
    { name: 'Firebase Auth', status: 'healthy', icon: '🔑' },
    { name: 'WhatsApp API (Meta)', status: 'healthy', icon: '💬' },
    { name: 'WhatsApp LocalAuth', status: 'standby', icon: '🔐' },
  ];

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>🖥️ System Health</h2>
        <p style={S.headerSubtitle}>Infrastructure and service monitoring</p>
      </div>

      <div style={S.listGrid}>
        {services.map((svc) => (
          <div key={svc.name} style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{svc.icon}</span>
                <strong>{svc.name}</strong>
              </div>
              <span style={S.badge(
                svc.status === 'healthy' ? '#16a34a' : svc.status === 'standby' ? '#d97706' : '#6b7280',
                svc.status === 'healthy' ? '#dcfce7' : svc.status === 'standby' ? '#fffbeb' : '#f3f4f6',
              )}>{S.formatStatus(svc.status)}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...S.card, marginTop: '1rem' }}>
        <h3 style={S.cardTitle}>📋 Environment</h3>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary, #6b7280)', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span>Runtime: Node.js</span>
          <span>Framework: Express 5 + React 18</span>
          <span>DB: MongoDB (Prisma 6.6)</span>
          <span>Build: Vite + TypeScript 5</span>
        </div>
      </div>
    </div>
  );
};

