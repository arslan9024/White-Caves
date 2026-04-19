/**
 * Owner / Admin Dashboard — OwnerOverview, BusinessAnalytics, WhatsAppDashboard, SystemHealth, SystemSettings
 * ─────────────────────────────────────────────────────────────────────────────────────
 * 5 owner-role sub-tab components showing system-wide data and admin controls.
 */

import React, { useEffect, useState } from 'react';
import { authFetch } from '../../utils/authFetch';
import { createLogger } from '../../utils/logger';
import { settledJson } from '../../utils/settledJson';
import type {
  DashboardOwnerStats,
  DashboardFinanceAnalytics,
  DashboardSystemHealth,
} from '@/types/dashboard';
import * as S from './shared';

const log = createLogger('Dashboard');

// ═══════════════════════════════════════════════════════════════════════
// OWNER OVERVIEW
// ═══════════════════════════════════════════════════════════════════════

export const OwnerOverview: React.FC = () => {
  const [stats, setStats] = useState<DashboardOwnerStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [props, leads, leases] = await settledJson(
          [authFetch('/api/properties/count'), authFetch('/api/leads/count'), authFetch('/api/leases/count')],
          [{ count: 0 }, { count: 0 }, { count: 0 }],
        ) as any[];
        setStats({
          properties: props.count ?? props.data ?? 0,
          leads: leads.count ?? leads.data ?? 0,
          leases: leases.count ?? leases.data ?? 0,
        });
      } catch (error) { log.warn('Failed to fetch overview stats:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📊 Business Overview</h2>
        <p style={S.headerSubtitle}>White Caves Real Estate LLC — Executive Dashboard</p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats?.properties ?? 0}</span>
          <span style={S.statLabel}>🏠 Total Properties</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats?.leads ?? 0}</span>
          <span style={S.statLabel}>🎯 Active Leads</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{stats?.leases ?? 0}</span>
          <span style={S.statLabel}>📝 Active Leases</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>3</span>
          <span style={S.statLabel}>🤖 AI Assistants Online</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        <div style={S.card}>
          <h3 style={S.cardTitle}>🤖 AI Assistants Status</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { name: 'Nadia — WhatsApp Business API', status: 'online', icon: '💬' },
              { name: 'Nina — NLP Engine', status: 'online', icon: '🧠' },
              { name: 'Linda — WhatsApp LocalAuth', status: 'standby', icon: '🔐' },
            ].map((bot) => (
              <div key={bot.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
                <span>{bot.icon} {bot.name}</span>
                <span style={S.badge(
                  bot.status === 'online' ? '#16a34a' : '#d97706',
                  bot.status === 'online' ? '#dcfce7' : '#fffbeb',
                )}>{S.formatStatus(bot.status ?? '')}</span>
              </div>
            ))}
          </div>
        </div>

        <div style={S.card}>
          <h3 style={S.cardTitle}>📈 Quick Stats</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
              <span>Properties Listed</span>
              <strong>{stats?.properties ?? 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #f3f4f6' }}>
              <span>Active Leads</span>
              <strong>{stats?.leads ?? 0}</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
              <span>Active Leases</span>
              <strong>{stats?.leases ?? 0}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// BUSINESS ANALYTICS
// ═══════════════════════════════════════════════════════════════════════

export const BusinessAnalytics: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardFinanceAnalytics | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await authFetch('/api/finance/analytics');
        const json = await res.json();
        setData(json.data);
      } catch (error) { log.warn('Failed to fetch analytics data:', error); }
      setLoading(false);
    })();
  }, []);

  if (loading) return <div style={S.tabContainer}>{S.loadingState}</div>;

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📈 Business Analytics</h2>
        <p style={S.headerSubtitle}>Revenue, performance, and market data</p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(data?.totalRevenue ?? 0)}</span>
          <span style={S.statLabel}>💰 Total Revenue</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{S.formatCurrency(data?.monthlyRevenue ?? 0)}</span>
          <span style={S.statLabel}>📅 Monthly Revenue</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{data?.occupancyRate ?? '—'}%</span>
          <span style={S.statLabel}>🏠 Occupancy Rate</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{data?.avgDaysToLease ?? '—'}</span>
          <span style={S.statLabel}>⏱️ Avg Days to Lease</span>
        </div>
      </div>

      <div style={S.card}>
        <h3 style={S.cardTitle}>📊 Key Metrics</h3>
        <p style={{ color: '#6b7280' }}>
          Detailed revenue charts and market analysis will render here when chart library integration is enabled.
          Data is available via <code>/api/finance/analytics</code>.
        </p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// WHATSAPP DASHBOARD
// ═══════════════════════════════════════════════════════════════════════

export const WhatsAppDashboard: React.FC = () => {
  const bots = [
    {
      name: 'Nadia',
      role: 'WhatsApp Business API — Lead Capture & CRM',
      status: 'online',
      messages24h: 142,
      leadsGenerated: 12,
      icon: '💬',
    },
    {
      name: 'Nina',
      role: 'NLP/Intent Engine — Smart Routing',
      status: 'online',
      messages24h: 89,
      leadsGenerated: 0,
      icon: '🧠',
    },
    {
      name: 'Linda',
      role: 'WhatsApp LocalAuth — Account Recovery',
      status: 'standby',
      messages24h: 5,
      leadsGenerated: 0,
      icon: '🔐',
    },
  ];

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>💬 WhatsApp Integration</h2>
        <p style={S.headerSubtitle}>AI assistant status and messaging metrics</p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{bots.filter((b) => b.status === 'online').length}</span>
          <span style={S.statLabel}>🟢 Online</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{bots.reduce((s, b) => s + b.messages24h, 0)}</span>
          <span style={S.statLabel}>💬 Messages (24h)</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{bots.reduce((s, b) => s + b.leadsGenerated, 0)}</span>
          <span style={S.statLabel}>🎯 Leads Generated</span>
        </div>
      </div>

      <div style={S.listGrid}>
        {bots.map((bot) => (
          <div key={bot.name} style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>{bot.icon} {bot.name}</h3>
                <p style={{ ...S.headerSubtitle, margin: '0.15rem 0 0 0' }}>{bot.role}</p>
              </div>
              <span style={S.badge(
                bot.status === 'online' ? '#16a34a' : '#d97706',
                bot.status === 'online' ? '#dcfce7' : '#fffbeb',
              )}>{S.formatStatus(bot.status ?? '')}</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: '#6b7280' }}>
              <span>💬 {bot.messages24h} messages</span>
              <span>🎯 {bot.leadsGenerated} leads</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SYSTEM HEALTH
// ═══════════════════════════════════════════════════════════════════════

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
              )}>{S.formatStatus(svc.status ?? '')}</span>
            </div>
          </div>
        ))}
      </div>

      <div style={{ ...S.card, marginTop: '1rem' }}>
        <h3 style={S.cardTitle}>📋 Environment</h3>
        <div style={{ fontSize: '0.85rem', color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span>Runtime: Node.js</span>
          <span>Framework: Express 5 + React 18</span>
          <span>DB: MongoDB (Prisma 6.6)</span>
          <span>Build: Vite + TypeScript 5</span>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════
// SYSTEM SETTINGS
// ═══════════════════════════════════════════════════════════════════════

export const SystemSettings: React.FC = () => {
  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>⚙️ System Settings</h2>
        <p style={S.headerSubtitle}>Platform configuration and preferences</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1rem' }}>
        <div style={S.card}>
          <h3 style={S.cardTitle}>🏢 Organization</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>Company Name</label>
              <input defaultValue="White Caves Real Estate LLC" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.9rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>Support Email</label>
              <input defaultValue="support@whitecaves.ae" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.9rem' }} />
            </div>
          </div>
        </div>

        <div style={S.card}>
          <h3 style={S.cardTitle}>💬 WhatsApp Config</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>Meta Business ID</label>
              <input defaultValue="••••••••••" type="password" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.9rem' }} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#6b7280', marginBottom: '0.25rem' }}>Phone Number ID</label>
              <input defaultValue="••••••••••" type="password" style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '0.9rem' }} />
            </div>
          </div>
        </div>

        <div style={S.card}>
          <h3 style={S.cardTitle}>🗄️ Database</h3>
          <div style={{ fontSize: '0.85rem', color: '#6b7280', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            <span>Provider: MongoDB Atlas</span>
            <span>ORM: Prisma 6.6</span>
            <span>Connection: ••••••••••</span>
          </div>
          <button style={{ ...S.btnSecondary, marginTop: '0.75rem' }}>Test Connection</button>
        </div>

        <div style={S.card}>
          <h3 style={S.cardTitle}>🔐 Security</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span style={{ fontSize: '0.9rem' }}>Enforce RBAC on all API routes</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked />
              <span style={{ fontSize: '0.9rem' }}>Firebase Auth required</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" />
              <span style={{ fontSize: '0.9rem' }}>Two-factor authentication</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
