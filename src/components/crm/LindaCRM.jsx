import React, { useState } from 'react';
import {
  Smartphone,
  Wifi,
  WifiOff,
  Users,
  MessageSquare,
  RefreshCw,
  QrCode,
  Settings,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import AssistantLifecycleTab from './shared/AssistantLifecycleTab';
import './AssistantDashboard.css';

const AGENT_SESSIONS = [
  {
    id: 1,
    agent: 'Omar Siddiqui',
    phone: '+971 50 111 0001',
    status: 'connected',
    messages: 28,
    qrLinked: '7d ago',
    lastMsg: '5m ago',
  },
  {
    id: 2,
    agent: 'Lena Petrov',
    phone: '+971 50 111 0002',
    status: 'connected',
    messages: 15,
    qrLinked: '3d ago',
    lastMsg: '12m ago',
  },
  {
    id: 3,
    agent: 'Ahmed Al Mansouri',
    phone: '+971 50 111 0003',
    status: 'reconnecting',
    messages: 0,
    qrLinked: '1d ago',
    lastMsg: '2h ago',
  },
  {
    id: 4,
    agent: 'Rina Tanaka',
    phone: '+971 50 111 0004',
    status: 'disconnected',
    messages: 0,
    qrLinked: 'Never',
    lastMsg: 'Never',
  },
  {
    id: 5,
    agent: 'Carlos Rivera',
    phone: '+971 50 111 0005',
    status: 'connected',
    messages: 9,
    qrLinked: '14d ago',
    lastMsg: '1h ago',
  },
];

const COMMANDS = [
  { cmd: '!lead save [name] [budget] [area]', desc: 'Save a new lead directly from WhatsApp' },
  { cmd: '!lead update [id] [field] [value]', desc: 'Update lead details without opening CRM' },
  { cmd: '!prop list [area]', desc: 'Get matching properties for a lead' },
  { cmd: '!book [lead_id] [property_id] [date]', desc: 'Book a viewing from WhatsApp' },
  { cmd: '!score [lead_id]', desc: "Check a lead's Archer score" },
];

const statusConfig = {
  connected: { color: '#22C55E', icon: Wifi, label: 'Connected' },
  reconnecting: { color: '#F59E0B', icon: RefreshCw, label: 'Reconnecting' },
  disconnected: { color: '#E31E24', icon: WifiOff, label: 'Disconnected' },
};

const LindaCRM = () => {
  const [activeTab, setActiveTab] = useState('sessions');

  const connected = AGENT_SESSIONS.filter(s => s.status === 'connected').length;

  const tabs = [
    { id: 'sessions', label: '📱 Agent Sessions' },
    { id: 'commands', label: '⌨️ CRM Commands' },
    { id: 'health', label: '❤️ Gateway Health' },
    { id: 'docs', label: '📚 Docs' },
    { id: 'lifecycle', label: '🔄 Lifecycle' },
  ];

  return (
    <div className="assistant-dashboard linda">
      <div className="assistant-header">
        <div
          className="assistant-avatar"
          style={{ background: 'linear-gradient(135deg, var(--color-25d366, #25D366) 0%, var(--color-128c7e, #128C7E) 100%)' }}
        >
          <Smartphone size={28} />
        </div>
        <div className="assistant-info">
          <h2>Linda — WhatsApp LocalAuth Bot Manager</h2>
          <p>Agent WhatsApp session management via OpenClaw gateway (WhatsApp-web.js)</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          {connected}/{AGENT_SESSIONS.length} Online
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(37,211,102,0.15)', color: 'var(--color-25d366, #25D366)' }}
          >
            <Wifi size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{connected}</span>
            <span className="stat-label">Active Sessions</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(227,30,36,0.15)', color: 'var(--color-e31e24, #E31E24)' }}
          >
            <WifiOff size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {AGENT_SESSIONS.filter(s => s.status === 'disconnected').length}
            </span>
            <span className="stat-label">Disconnected</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(59,130,246,0.15)', color: 'var(--accent-blue, #3B82F6)' }}
          >
            <MessageSquare size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{AGENT_SESSIONS.reduce((s, a) => s + a.messages, 0)}</span>
            <span className="stat-label">Messages Today</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(139,92,246,0.15)', color: 'var(--accent-purple, #8B5CF6)' }}
          >
            <Users size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{AGENT_SESSIONS.length}</span>
            <span className="stat-label">Agent Channels</span>
          </div>
        </div>
      </div>

      <div className="crm-tabs">
        {tabs.map(t => (
          <button
            key={t.id}
            className={`crm-tab ${activeTab === t.id ? 'active' : ''}`}
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {activeTab === 'sessions' && (
        <div className="tab-content">
          {AGENT_SESSIONS.map(s => {
            const cfg = statusConfig[s.status];
            const Icon = cfg.icon;
            return (
              <div
                key={s.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: '14px 16px',
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '50%',
                    background: `${cfg.color}22`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={18} color={cfg.color} />
                </div>
                <div style={{ flex: 1 }}>
                  <strong>{s.agent}</strong>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary, #6b7280)', marginTop: 2 }}>
                    {s.phone} · Linked {s.qrLinked}
                  </div>
                </div>
                <div style={{ textAlign: 'right', fontSize: 12 }}>
                  <div style={{ fontWeight: 600, color: cfg.color }}>{cfg.label}</div>
                  <div style={{ color: 'var(--text-secondary, #9ca3af)' }}>
                    {s.messages} msgs · {s.lastMsg}
                  </div>
                </div>
                <button className="action-btn" style={{ fontSize: 11, padding: '5px 10px' }}>
                  {s.status === 'disconnected' ? (
                    <>
                      <QrCode size={12} /> Link QR
                    </>
                  ) : (
                    <Settings size={12} />
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {activeTab === 'commands' && (
        <div className="tab-content">
          <h3 style={{ marginBottom: 16 }}>Agent WhatsApp CRM Commands</h3>
          <div
            style={{
              background: '#f9fafb',
              border: '1px solid #e5e7eb',
              borderRadius: 12,
              overflow: 'hidden',
            }}
          >
            {COMMANDS.map((c, i) => (
              <div
                key={i}
                style={{
                  padding: '14px 16px',
                  borderBottom: i < COMMANDS.length - 1 ? '1px solid #e5e7eb' : 'none',
                }}
              >
                <code
                  style={{
                    background: '#1e1e2e',
                    color: '#7dd3fc',
                    padding: '4px 10px',
                    borderRadius: 6,
                    fontSize: 13,
                    fontFamily: 'monospace',
                  }}
                >
                  {c.cmd}
                </code>
                <p style={{ margin: '6px 0 0', fontSize: 13, color: 'var(--text-secondary, #6b7280)' }}>{c.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'health' && (
        <div className="tab-content">
          <h3 style={{ marginBottom: 16 }}>OpenClaw Gateway Status</h3>
          {[
            { name: 'OpenClaw Gateway Process', status: 'running', uptime: '3d 4h', pid: '12345' },
            { name: 'WhatsApp-web.js Library', status: 'running', version: 'v1.26.0', pid: null },
            { name: 'MongoDB Session Store', status: 'running', collections: 5, pid: null },
            { name: 'Webhook Relay (→ CRM)', status: 'running', events: 142, pid: null },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 10,
                padding: '12px 16px',
                marginBottom: 10,
              }}
            >
              {s.status === 'running' ? (
                <CheckCircle size={18} color="#22C55E" />
              ) : (
                <AlertCircle size={18} color="#E31E24" />
              )}
              <div style={{ flex: 1 }}>
                <strong>{s.name}</strong>
                <div style={{ fontSize: 12, color: 'var(--text-secondary, #6b7280)', marginTop: 2 }}>
                  {s.uptime ? `Uptime: ${s.uptime}` : ''}
                  {s.version ? `Version: ${s.version}` : ''}
                  {s.collections ? `${s.collections} collections` : ''}
                  {s.events ? `${s.events} events today` : ''}
                </div>
              </div>
              <span className="status-badge" style={{ background: 'var(--color-f0fdf4, #f0fdf4)', color: 'var(--accent-green, #16a34a)' }}>
                {s.status}
              </span>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'docs' && (
        <AssistantDocsTab assistantId="linda" color="#25D366" assistantName="Linda" />
      )}
      {activeTab === 'lifecycle' && (
        <AssistantLifecycleTab assistantId="linda" color="#25D366" assistantName="Linda" />
      )}
    </div>
  );
};

export default LindaCRM;
