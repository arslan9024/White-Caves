import React, { FC, useState, useEffect } from 'react';

const RED = '#EF4444';
const WHITE = '#FFFFFF';
const SLATE = '#1E293B';
const BORDER = 'rgba(239, 68, 68, 0.2)';
const CARD_BG = '#F8FAFC';
const TEXT_MUTED = '#64748B';
const GREEN = '#10B981';
const ORANGE = '#F59E0B';
const BLUE = '#3B82F6';
const PURPLE = '#8B5CF6';

interface ApiEndpoint {
  name: string;
  path: string;
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  status: 'UP' | 'DEGRADED' | 'DOWN';
  latencyMs: number;
  lastChecked: string;
  callsPerMin: number;
}

const API_ENDPOINTS: ApiEndpoint[] = [
  { name: 'Auth / Login', path: '/api/auth/login', method: 'POST', status: 'UP', latencyMs: 42, lastChecked: '2s ago', callsPerMin: 18 },
  { name: 'Properties List', path: '/api/properties', method: 'GET', status: 'UP', latencyMs: 87, lastChecked: '2s ago', callsPerMin: 341 },
  { name: 'Lead Pipeline', path: '/api/leads', method: 'GET', status: 'UP', latencyMs: 63, lastChecked: '2s ago', callsPerMin: 112 },
  { name: 'Commission CRUD', path: '/api/commissions', method: 'GET', status: 'UP', latencyMs: 55, lastChecked: '3s ago', callsPerMin: 24 },
  { name: 'Document Generate', path: '/api/documents/generate', method: 'POST', status: 'UP', latencyMs: 920, lastChecked: '5s ago', callsPerMin: 7 },
  { name: 'WhatsApp Webhook', path: '/api/whatsapp/webhook', method: 'POST', status: 'DEGRADED', latencyMs: 1840, lastChecked: '4s ago', callsPerMin: 89 },
  { name: 'DLD Sync', path: '/api/dld/sync', method: 'POST', status: 'UP', latencyMs: 210, lastChecked: '12s ago', callsPerMin: 2 },
  { name: 'Analytics Dashboard', path: '/api/analytics/kpis', method: 'GET', status: 'UP', latencyMs: 145, lastChecked: '2s ago', callsPerMin: 56 },
  { name: 'Push Notifications', path: '/api/notifications/push', method: 'POST', status: 'UP', latencyMs: 320, lastChecked: '8s ago', callsPerMin: 34 },
  { name: 'Audit Trail', path: '/api/audit-trail', method: 'GET', status: 'UP', latencyMs: 78, lastChecked: '2s ago', callsPerMin: 8 },
];

interface BuildInfo {
  component: string;
  version: string;
  buildDate: string;
  status: 'Healthy' | 'Warning' | 'Error';
}

const BUILD_INFO: BuildInfo[] = [
  { component: 'React Client (Vite)', version: '5.3.1', buildDate: '2026-07-27', status: 'Healthy' },
  { component: 'Express Server', version: '4.21.0', buildDate: '2026-07-27', status: 'Healthy' },
  { component: 'Prisma ORM', version: '6.2.1', buildDate: '2026-07-23', status: 'Healthy' },
  { component: 'Socket.io', version: '4.8.1', buildDate: '2026-07-23', status: 'Healthy' },
  { component: 'TypeScript Compiler', version: '5.7.3', buildDate: '2026-07-27', status: 'Healthy' },
  { component: 'Vite Build', version: '6.0.5', buildDate: '2026-07-27', status: 'Healthy' },
  { component: 'WhatsApp SDK', version: '2.4.1', buildDate: '2026-07-20', status: 'Warning' },
  { component: 'PDF-lib Engine', version: '1.17.1', buildDate: '2026-07-23', status: 'Healthy' },
];

const statusColor = {
  UP: GREEN,
  DEGRADED: ORANGE,
  DOWN: RED,
  Healthy: GREEN,
  Warning: ORANGE,
  Error: RED,
};

const methodColor: Record<string, string> = {
  GET: BLUE,
  POST: GREEN,
  PATCH: ORANGE,
  DELETE: RED,
};

export const TechnologyDepartmentView: FC = () => {
  const [endpoints, setEndpoints] = useState<ApiEndpoint[]>(API_ENDPOINTS);
  const [activeTab, setActiveTab] = useState<'health' | 'api' | 'build'>('health');
  const [wsStatus, setWsStatus] = useState<'Connected' | 'Reconnecting'>('Connected');
  const [uptimeSeconds, setUptimeSeconds] = useState(345600); // ~4 days

  // Simulate live latency fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setEndpoints(prev => prev.map(ep => ({
        ...ep,
        latencyMs: Math.max(10, ep.latencyMs + Math.floor((Math.random() - 0.5) * 30)),
        callsPerMin: Math.max(1, ep.callsPerMin + Math.floor((Math.random() - 0.5) * 8)),
        lastChecked: '1s ago',
      })));
      setUptimeSeconds(s => s + 5);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const formatUptime = (s: number) => {
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    return `${d}d ${h}h ${m}m`;
  };

  const upCount = endpoints.filter(e => e.status === 'UP').length;
  const degradedCount = endpoints.filter(e => e.status === 'DEGRADED').length;
  const downCount = endpoints.filter(e => e.status === 'DOWN').length;
  const avgLatency = Math.round(endpoints.reduce((a, e) => a + e.latencyMs, 0) / endpoints.length);

  return (
    <div style={{ padding: '24px', background: WHITE, minHeight: '80vh' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: SLATE }}>⚙️ Technology & System Health</h2>
          <p style={{ margin: '6px 0 0 0', color: TEXT_MUTED, fontSize: '0.875rem' }}>
            Live API monitor · WebSocket status · Build versions · System uptime
          </p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <div style={{ background: '#DEF7EC', border: `1px solid ${GREEN}`, padding: '8px 14px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: '#065F46', fontWeight: 700 }}>SYSTEM UPTIME</div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: GREEN }}>{formatUptime(uptimeSeconds)}</div>
          </div>
          <div style={{ background: wsStatus === 'Connected' ? '#DEF7EC' : '#FFFBEB', border: `1px solid ${wsStatus === 'Connected' ? GREEN : ORANGE}`, padding: '8px 14px', borderRadius: '8px', textAlign: 'center' }}>
            <div style={{ fontSize: '0.7rem', color: wsStatus === 'Connected' ? '#065F46' : '#92400E', fontWeight: 700 }}>WEBSOCKET</div>
            <div style={{ fontSize: '1rem', fontWeight: 900, color: wsStatus === 'Connected' ? GREEN : ORANGE }}>
              {wsStatus === 'Connected' ? '● Live' : '⟳ Reconnecting'}
            </div>
          </div>
        </div>
      </div>

      {/* Status Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Endpoints UP', value: `${upCount}/${endpoints.length}`, color: GREEN },
          { label: 'Degraded', value: degradedCount, color: ORANGE },
          { label: 'Down', value: downCount, color: RED },
          { label: 'Avg API Latency', value: `${avgLatency}ms`, color: avgLatency < 200 ? GREEN : avgLatency < 500 ? ORANGE : RED },
        ].map(s => (
          <div key={s.label} style={{ background: CARD_BG, padding: '14px', borderRadius: '8px', borderLeft: `4px solid ${s.color}` }}>
            <div style={{ fontSize: '0.72rem', color: TEXT_MUTED, textTransform: 'uppercase', fontWeight: 700 }}>{s.label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 900, color: s.color, marginTop: '4px' }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0', borderBottom: `2px solid ${BORDER}`, marginBottom: '20px' }}>
        {(['health', 'api', 'build'] as const).map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            style={{ background: 'none', border: 'none', borderBottom: activeTab === tab ? `3px solid ${RED}` : '3px solid transparent', padding: '10px 20px', cursor: 'pointer', fontWeight: activeTab === tab ? 700 : 500, color: activeTab === tab ? RED : TEXT_MUTED, fontSize: '0.9rem', marginBottom: '-2px' }}>
            {tab === 'health' ? '🟢 System Health' : tab === 'api' ? '🔌 API Monitor' : '🔧 Build Info'}
          </button>
        ))}
      </div>

      {/* HEALTH TAB */}
      {activeTab === 'health' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div style={{ background: CARD_BG, padding: '20px', borderRadius: '10px', border: `1px solid ${BORDER}` }}>
            <h4 style={{ margin: '0 0 14px 0', color: SLATE }}>Infrastructure Services</h4>
            {[
              { service: 'MongoDB Atlas (Primary)', status: 'UP', latency: '12ms', region: 'UAE East' },
              { service: 'Redis Cache', status: 'UP', latency: '4ms', region: 'UAE East' },
              { service: 'Firebase Auth', status: 'UP', latency: '28ms', region: 'Global CDN' },
              { service: 'Cloudinary CDN', status: 'UP', latency: '68ms', region: 'Global CDN' },
              { service: 'SendGrid Email', status: 'UP', latency: '180ms', region: 'US West' },
              { service: 'Meta WhatsApp API', status: 'DEGRADED', latency: '840ms', region: 'EU West' },
              { service: 'Vercel Deployment', status: 'UP', latency: '32ms', region: 'Global Edge' },
            ].map(svc => (
              <div key={svc.service} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #E2E8F0', fontSize: '0.83rem' }}>
                <div>
                  <span style={{ fontWeight: 600, color: SLATE }}>{svc.service}</span>
                  <span style={{ color: TEXT_MUTED, marginLeft: '8px', fontSize: '0.72rem' }}>{svc.region}</span>
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{ color: TEXT_MUTED, fontSize: '0.75rem' }}>{svc.latency}</span>
                  <span style={{ background: `${statusColor[svc.status as keyof typeof statusColor]}20`, color: statusColor[svc.status as keyof typeof statusColor], padding: '2px 8px', borderRadius: '10px', fontWeight: 700, fontSize: '0.7rem' }}>
                    {svc.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div>
            <div style={{ background: CARD_BG, padding: '20px', borderRadius: '10px', border: `1px solid ${BORDER}`, marginBottom: '16px' }}>
              <h4 style={{ margin: '0 0 14px 0', color: SLATE }}>WebSocket Room Activity</h4>
              {[
                { room: 'room:level5', label: 'MD Master Room', clients: 1, events: 24 },
                { room: 'room:brokers', label: 'Broker Team Room', clients: 7, events: 134 },
                { room: 'room:clients', label: 'Client Portal Room', clients: 12, events: 48 },
              ].map(room => (
                <div key={room.room} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #E2E8F0', fontSize: '0.83rem' }}>
                  <div>
                    <div style={{ fontWeight: 600 }}>{room.label}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: TEXT_MUTED }}>{room.room}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: GREEN, fontWeight: 700 }}>{room.clients} clients</div>
                    <div style={{ color: TEXT_MUTED, fontSize: '0.72rem' }}>{room.events} events/hr</div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ background: '#0F172A', padding: '16px', borderRadius: '10px' }}>
              <div style={{ fontSize: '0.72rem', color: '#64748B', fontWeight: 700, marginBottom: '8px', fontFamily: 'monospace' }}>LIVE SERVER LOG</div>
              {[
                { ts: '04:27:11', msg: 'GET /api/properties 200 87ms', color: GREEN },
                { ts: '04:27:09', msg: 'POST /api/auth/refresh 200 42ms', color: GREEN },
                { ts: '04:27:08', msg: 'WS room:brokers emit lead_updated', color: BLUE },
                { ts: '04:27:06', msg: 'POST /api/whatsapp/webhook 200 840ms', color: ORANGE },
                { ts: '04:27:04', msg: 'CRON ViewingReminder dispatched 3 msgs', color: PURPLE },
              ].map((log, i) => (
                <div key={i} style={{ fontFamily: 'monospace', fontSize: '0.72rem', marginBottom: '4px', color: log.color }}>
                  <span style={{ color: '#475569' }}>[{log.ts}]</span> {log.msg}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* API MONITOR TAB */}
      {activeTab === 'api' && (
        <div style={{ background: WHITE, borderRadius: '10px', border: `1px solid ${BORDER}`, overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
            <thead>
              <tr style={{ background: SLATE, color: WHITE }}>
                <th style={{ padding: '10px 14px', textAlign: 'left' }}>ENDPOINT</th>
                <th style={{ padding: '10px 14px', textAlign: 'left' }}>METHOD</th>
                <th style={{ padding: '10px 14px', textAlign: 'left' }}>STATUS</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>LATENCY</th>
                <th style={{ padding: '10px 14px', textAlign: 'right' }}>CALLS/MIN</th>
                <th style={{ padding: '10px 14px', textAlign: 'left' }}>LAST CHECKED</th>
              </tr>
            </thead>
            <tbody>
              {endpoints.map((ep, idx) => (
                <tr key={ep.name} style={{ borderBottom: '1px solid #E2E8F0', background: idx % 2 === 0 ? WHITE : CARD_BG }}>
                  <td style={{ padding: '10px 14px' }}>
                    <div style={{ fontWeight: 600 }}>{ep.name}</div>
                    <div style={{ fontFamily: 'monospace', fontSize: '0.7rem', color: TEXT_MUTED }}>{ep.path}</div>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ background: `${methodColor[ep.method]}20`, color: methodColor[ep.method], padding: '2px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '0.72rem', fontFamily: 'monospace' }}>
                      {ep.method}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ color: statusColor[ep.status], fontWeight: 700, fontSize: '0.78rem' }}>
                      ● {ep.status}
                    </span>
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 700, fontFamily: 'monospace', color: ep.latencyMs < 200 ? GREEN : ep.latencyMs < 800 ? ORANGE : RED }}>
                    {ep.latencyMs}ms
                  </td>
                  <td style={{ padding: '10px 14px', textAlign: 'right', fontWeight: 600, color: SLATE }}>
                    {ep.callsPerMin}
                  </td>
                  <td style={{ padding: '10px 14px', color: TEXT_MUTED, fontSize: '0.78rem' }}>
                    {ep.lastChecked}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* BUILD INFO TAB */}
      {activeTab === 'build' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px' }}>
            {BUILD_INFO.map(b => {
              const sc = statusColor[b.status];
              return (
                <div key={b.component} style={{ background: CARD_BG, padding: '16px', borderRadius: '10px', border: `1px solid ${BORDER}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 700, color: SLATE }}>{b.component}</div>
                    <div style={{ fontSize: '0.78rem', color: TEXT_MUTED, marginTop: '2px' }}>
                      v{b.version} · Built {b.buildDate}
                    </div>
                  </div>
                  <span style={{ background: `${sc}20`, color: sc, padding: '4px 10px', borderRadius: '20px', fontWeight: 700, fontSize: '0.75rem' }}>
                    {b.status}
                  </span>
                </div>
              );
            })}
          </div>
          <div style={{ background: CARD_BG, padding: '20px', borderRadius: '10px', border: `1px solid ${BORDER}`, marginTop: '16px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: RED }}>Environment Variables Status</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {[
                { key: 'DATABASE_URL', status: 'Set ✅' },
                { key: 'JWT_SECRET', status: 'Set ✅' },
                { key: 'FIREBASE_PROJECT_ID', status: 'Set ✅' },
                { key: 'WHATSAPP_TOKEN', status: 'Set ✅' },
                { key: 'CLOUDINARY_URL', status: 'Set ✅' },
                { key: 'SENDGRID_API_KEY', status: 'Set ✅' },
                { key: 'DLD_API_KEY', status: 'Set ✅' },
                { key: 'REDIS_URL', status: 'Set ✅' },
                { key: 'SENTRY_DSN', status: 'Optional ⚠️' },
              ].map(env => (
                <div key={env.key} style={{ background: WHITE, padding: '8px 12px', borderRadius: '6px', border: '1px solid #E2E8F0', fontSize: '0.78rem' }}>
                  <div style={{ fontFamily: 'monospace', fontWeight: 600, color: SLATE }}>{env.key}</div>
                  <div style={{ color: env.status.includes('✅') ? GREEN : ORANGE, fontWeight: 700, fontSize: '0.72rem', marginTop: '2px' }}>{env.status}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TechnologyDepartmentView;
