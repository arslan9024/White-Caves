import React, { useState } from 'react';
import { Image, Home, Eye, Star, Upload, CheckCircle, Clock, Grid3X3 } from 'lucide-react';
import AssistantDocsTab from './shared/AssistantDocsTab';
import AssistantLifecycleTab from './shared/AssistantLifecycleTab';
import './AssistantDashboard.css';

const STAGING_JOBS = [
  {
    id: 1,
    property: 'Palm Jumeirah Villa G-12',
    type: 'Virtual Staging',
    rooms: 5,
    status: 'completed',
    style: 'Modern',
    time: '1h ago',
  },
  {
    id: 2,
    property: 'Marina Gate 2BR #2204',
    type: '3D Render',
    rooms: 2,
    status: 'processing',
    style: 'Contemporary',
    time: '2h ago',
  },
  {
    id: 3,
    property: 'Downtown Blvd Heights 3BR',
    type: 'Virtual Staging',
    rooms: 3,
    status: 'completed',
    style: 'Minimalist',
    time: '3h ago',
  },
  {
    id: 4,
    property: 'Emirates Hills Estate',
    type: 'Matterport Tour',
    rooms: 8,
    status: 'completed',
    style: 'Classic',
    time: '1d ago',
  },
  {
    id: 5,
    property: 'JVC Studio Bloom',
    type: 'Virtual Staging',
    rooms: 1,
    status: 'pending',
    style: 'Modern',
    time: '2d ago',
  },
];

const STYLES = [
  { name: 'Modern', desc: 'Clean lines, neutral palette, statement pieces', popular: true },
  { name: 'Contemporary', desc: 'Current trends, mixed textures, bold accents' },
  { name: 'Minimalist', desc: 'Less is more — white space, functional beauty' },
  { name: 'Classic', desc: 'Timeless elegance, rich woods, traditional forms' },
  { name: 'Dubai Luxury', desc: 'Gold accents, marble, statement chandeliers' },
  { name: 'Scandinavian', desc: 'Light woods, cosy textures, functional warmth' },
];

const statusColors = { completed: '#22C55E', processing: '#3B82F6', pending: '#F59E0B' };

const IrisCRM = () => {
  const [activeTab, setActiveTab] = useState('jobs');
  const [selectedStyle, setSelectedStyle] = useState('Modern');

  const tabs = [
    { id: 'jobs', label: '🎨 Staging Jobs' },
    { id: 'styles', label: '✨ Style Library' },
    { id: 'tours', label: '🏠 Virtual Tours' },
    { id: 'docs', label: '📚 Docs' },
    { id: 'lifecycle', label: '🔄 Lifecycle' },
  ];

  return (
    <div className="assistant-dashboard iris">
      <div className="assistant-header">
        <div
          className="assistant-avatar"
          style={{ background: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)' }}
        >
          <Image size={28} />
        </div>
        <div className="assistant-info">
          <h2>Iris — Virtual Staging & 3D Visualization AI</h2>
          <p>AI-powered virtual staging, 3D renders, and Matterport tour management</p>
        </div>
        <div className="assistant-status online">
          <span className="status-dot"></span>
          AI Active
        </div>
      </div>

      <div className="quick-stats">
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(236,72,153,0.15)', color: '#EC4899' }}
          >
            <Image size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{STAGING_JOBS.length}</span>
            <span className="stat-label">Total Jobs</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(34,197,94,0.15)', color: '#22C55E' }}
          >
            <CheckCircle size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">
              {STAGING_JOBS.filter(j => j.status === 'completed').length}
            </span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(59,130,246,0.15)', color: '#3B82F6' }}
          >
            <Clock size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">45m</span>
            <span className="stat-label">Avg Render Time</span>
          </div>
        </div>
        <div className="stat-card">
          <div
            className="stat-icon"
            style={{ background: 'rgba(227,30,36,0.15)', color: '#E31E24' }}
          >
            <Star size={20} />
          </div>
          <div className="stat-content">
            <span className="stat-value">+34%</span>
            <span className="stat-label">Viewing Uplift</span>
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

      {activeTab === 'jobs' && (
        <div className="tab-content">
          <div className="tab-toolbar">
            <button className="action-btn primary" style={{ fontSize: 12 }}>
              <Upload size={14} /> New Staging Job
            </button>
          </div>
          <table className="data-table">
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Rooms</th>
                <th>Style</th>
                <th>Time</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {STAGING_JOBS.map(j => (
                <tr key={j.id}>
                  <td>
                    <strong>{j.property}</strong>
                  </td>
                  <td>{j.type}</td>
                  <td>{j.rooms}</td>
                  <td>{j.style}</td>
                  <td style={{ fontSize: 12, color: '#6b7280' }}>{j.time}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{
                        background: `${statusColors[j.status]}22`,
                        color: statusColors[j.status],
                      }}
                    >
                      {j.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'styles' && (
        <div className="tab-content">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
              gap: 14,
            }}
          >
            {STYLES.map(s => (
              <div
                key={s.name}
                onClick={() => setSelectedStyle(s.name)}
                style={{
                  background: selectedStyle === s.name ? '#fff0f6' : '#f9fafb',
                  border: `2px solid ${selectedStyle === s.name ? '#EC4899' : '#e5e7eb'}`,
                  borderRadius: 12,
                  padding: 16,
                  cursor: 'pointer',
                  transition: 'all 0.15s',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <Grid3X3 size={16} color={selectedStyle === s.name ? '#EC4899' : '#6b7280'} />
                  <strong>{s.name}</strong>
                  {s.popular && (
                    <span
                      style={{
                        background: '#fff0f6',
                        color: '#EC4899',
                        borderRadius: 20,
                        padding: '1px 8px',
                        fontSize: 10,
                      }}
                    >
                      Popular
                    </span>
                  )}
                </div>
                <p style={{ fontSize: 12, color: '#6b7280', margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tours' && (
        <div className="tab-content">
          {STAGING_JOBS.filter(j => j.type === 'Matterport Tour' || j.status === 'completed').map(
            j => (
              <div
                key={j.id}
                style={{
                  display: 'flex',
                  gap: 14,
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: 14,
                  marginBottom: 12,
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    width: 64,
                    height: 64,
                    borderRadius: 10,
                    background: 'linear-gradient(135deg, #EC489922, #BE185D22)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Home size={28} color="#EC4899" />
                </div>
                <div style={{ flex: 1 }}>
                  <strong>{j.property}</strong>
                  <div style={{ fontSize: 12, color: '#6b7280', marginTop: 4 }}>
                    {j.rooms} rooms · {j.style} style
                  </div>
                </div>
                <button
                  className="action-btn primary"
                  style={{ fontSize: 12, padding: '6px 14px' }}
                >
                  <Eye size={12} /> View Tour
                </button>
              </div>
            )
          )}
        </div>
      )}

      {activeTab === 'docs' && (
        <AssistantDocsTab assistantId="iris" color="#EC4899" assistantName="Iris" />
      )}
      {activeTab === 'lifecycle' && (
        <AssistantLifecycleTab assistantId="iris" color="#EC4899" assistantName="Iris" />
      )}
    </div>
  );
};

export default IrisCRM;
