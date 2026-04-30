import React, { useState } from 'react';
import { MessageSquare, Phone, Mail, Clock, User, Search, Calendar, Bell } from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import AssistantLifecycleTab from './shared/AssistantLifecycleTab';
import './AssistantDashboard.css';

const CLIENTS = [
  {
    id: 1,
    name: 'Ahmad Al Rashidi',
    lastContact: '2h ago',
    channel: 'WhatsApp',
    totalInteractions: 34,
    open: true,
  },
  {
    id: 2,
    name: 'Priya Nair',
    lastContact: '1d ago',
    channel: 'Email',
    totalInteractions: 18,
    open: false,
  },
  {
    id: 3,
    name: 'James Whitmore',
    lastContact: '3d ago',
    channel: 'Call',
    totalInteractions: 52,
    open: false,
  },
  {
    id: 4,
    name: 'Fatima Al Suwaidi',
    lastContact: '5h ago',
    channel: 'WhatsApp',
    totalInteractions: 11,
    open: false,
  },
];

const TIMELINE = [
  {
    id: 1,
    client: 'Ahmad Al Rashidi',
    type: 'whatsapp',
    content: 'Enquired about Palm Jumeirah Villa — requesting floor plan',
    time: '2h ago',
    agent: 'Nadia',
  },
  {
    id: 2,
    client: 'Ahmad Al Rashidi',
    type: 'call',
    content: 'Follow-up call — confirmed budget AED 8.5M, preferred move-in Q2',
    time: '1d ago',
    agent: 'Sophia',
  },
  {
    id: 3,
    client: 'Ahmad Al Rashidi',
    type: 'viewing',
    content: 'Property viewing — Frond G Villa, feedback: loved the beach access',
    time: '3d ago',
    agent: 'Clara',
  },
  {
    id: 4,
    client: 'Ahmad Al Rashidi',
    type: 'email',
    content: 'Sent property brochure + payment plan options',
    time: '4d ago',
    agent: 'Olivia',
  },
  {
    id: 5,
    client: 'Ahmad Al Rashidi',
    type: 'offer',
    content: 'Draft offer submitted: AED 8.2M — counter expected',
    time: '5d ago',
    agent: 'Sophia',
  },
  {
    id: 6,
    client: 'Ahmad Al Rashidi',
    type: 'whatsapp',
    content: 'Initial enquiry via website WhatsApp widget',
    time: '2w ago',
    agent: 'Nadia',
  },
];

const typeConfig = {
  whatsapp: { color: '#25D366', icon: MessageSquare, label: 'WhatsApp' },
  call: { color: '#3B82F6', icon: Phone, label: 'Call' },
  email: { color: '#F59E0B', icon: Mail, label: 'Email' },
  viewing: { color: '#8B5CF6', icon: User, label: 'Viewing' },
  offer: { color: '#E31E24', icon: Bell, label: 'Offer' },
};

const EchoCRM = () => {
  const [activeTab, setActiveTab] = useState('timeline');
  const [selectedClient, setSelectedClient] = useState(CLIENTS[0]);
  const [search, setSearch] = useState('');

  const tabs = [
    { id: 'timeline', label: '📅 Timeline' },
    { id: 'clients', label: '👥 Clients' },
    { id: 'channels', label: '📡 Channels' },
    { id: 'docs', label: '📚 Docs' },
    { id: 'lifecycle', label: '🔄 Lifecycle' },
  ];

  const channelStats = [
    { label: 'WhatsApp', count: 22, color: '#25D366' },
    { label: 'Phone', count: 15, color: '#3B82F6' },
    { label: 'Email', count: 18, color: '#F59E0B' },
    { label: 'In-Person', count: 8, color: '#8B5CF6' },
  ];

  return (
    <div className="assistant-dashboard echo">
      <div className="assistant-header">
        <div
          className="assistant-avatar"
          style={{ background: 'linear-gradient(135deg, #06B6D4 0%, #0891B2 100%)' }}
        >
          <MessageSquare size={28} />
        </div>
        <div className="assistant-info">
          <h2>Echo — Client Communication History & Timeline</h2>
          <p>Complete interaction history across all channels for every client</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          Recording
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(6,182,212,0.15)', color: '#06B6D4' }}
          >
            <MessageSquare size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">63</span>
            <span className="stat-label">Interactions Today</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(227,30,36,0.15)', color: '#E31E24' }}
          >
            <User size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{CLIENTS.length}</span>
            <span className="stat-label">Active Clients</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E' }}
          >
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">1.8h</span>
            <span className="stat-label">Avg Response Time</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(139,92,246,0.15)', color: '#8B5CF6' }}
          >
            <Calendar size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">8</span>
            <span className="stat-label">Viewings Logged</span>
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

      {activeTab === 'timeline' && (
        <div className="tab-content">
          <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            {CLIENTS.map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedClient(c)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: `2px solid ${selectedClient.id === c.id ? '#06B6D4' : '#e5e7eb'}`,
                  background: selectedClient.id === c.id ? '#e0f7fa' : '#fff',
                  fontSize: 13,
                  fontWeight: selectedClient.id === c.id ? 600 : 400,
                  cursor: 'pointer',
                }}
              >
                {c.name}
              </button>
            ))}
          </div>
          <div style={{ position: 'relative', paddingLeft: 24 }}>
            <div
              style={{
                position: 'absolute',
                left: 8,
                top: 0,
                bottom: 0,
                width: 2,
                background: '#e5e7eb',
              }}
            />
            {TIMELINE.filter(e => e.client === selectedClient.name).map(e => {
              const cfg = typeConfig[e.type];
              const Icon = cfg.icon;
              return (
                <div key={e.id} style={{ marginBottom: 20, position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: -24,
                      top: 0,
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      background: cfg.color,
                      border: '2px solid #fff',
                      boxShadow: '0 0 0 2px ' + cfg.color + '44',
                    }}
                  />
                  <div
                    style={{
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: 10,
                      padding: '12px 14px',
                    }}
                  >
                    <div
                      style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}
                    >
                      <span
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 6,
                          fontSize: 12,
                          fontWeight: 600,
                          color: cfg.color,
                        }}
                      >
                        <Icon size={12} /> {cfg.label}
                      </span>
                      <span style={{ fontSize: 11, color: '#9ca3af' }}>{e.time}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: 13 }}>{e.content}</p>
                    <div style={{ fontSize: 11, color: '#6b7280', marginTop: 6 }}>
                      via {e.agent}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === 'clients' && (
        <div className="tab-content">
          <div className="tab-toolbar">
            <div className="search-box">
              <Search size={16} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search clients…"
              />
            </div>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Client</th>
                <th>Last Contact</th>
                <th>Channel</th>
                <th>Interactions</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {CLIENTS.filter(c => c.name.toLowerCase().includes(search.toLowerCase())).map(c => (
                <tr
                  key={c.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    setSelectedClient(c);
                    setActiveTab('timeline');
                  }}
                >
                  <td>
                    <strong>{c.name}</strong>
                  </td>
                  <td>{c.lastContact}</td>
                  <td>
                    <span className="status-badge">{c.channel}</span>
                  </td>
                  <td>{c.totalInteractions}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        background: c.open ? '#f0fdf4' : '#f9fafb',
                        color: c.open ? '#16a34a' : '#6b7280',
                      }}
                    >
                      {c.open ? 'Open' : 'Dormant'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'channels' && (
        <div className="tab-content">
          <h3 style={{ marginBottom: 16 }}>Channel Breakdown</h3>
          {channelStats.map(ch => (
            <div
              key={ch.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                marginBottom: 14,
                background: '#f9fafb',
                borderRadius: 10,
                padding: '12px 16px',
                border: '1px solid #e5e7eb',
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: ch.color + '22',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <MessageSquare size={16} color={ch.color} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>{ch.label}</div>
                <div
                  style={{ height: 6, background: '#e5e7eb', borderRadius: 4, overflow: 'hidden' }}
                >
                  <div
                    style={{
                      width: `${(ch.count / 63) * 100}%`,
                      height: '100%',
                      background: ch.color,
                      borderRadius: 4,
                    }}
                  />
                </div>
              </div>
              <div style={{ fontWeight: 700, fontSize: 18, color: ch.color }}>{ch.count}</div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'docs' && (
        <AssistantDocsTab assistantId="echo" color="#06B6D4" assistantName="Echo" />
      )}
      {activeTab === 'lifecycle' && (
        <AssistantLifecycleTab assistantId="echo" color="#06B6D4" assistantName="Echo" />
      )}
    </div>
  );
};

export default EchoCRM;
