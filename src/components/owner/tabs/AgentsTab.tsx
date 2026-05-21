import React, { useState, useCallback } from 'react';
import type { AgentsTabProps, Agent } from './types';
import './TabStyles.css';

const MOCK_AGENTS: Agent[] = [
  {
    id: 1,
    name: 'Ahmed Ali',
    email: 'ahmed.ali@whitecaves.ae',
    phone: '+971 50 111 0001',
    role: 'Senior Sales Agent',
    properties: 12,
    leads: 28,
    dealsClosed: 8,
    revenue: 4500000,
    rating: 4.8,
    online: true,
    avatar: null,
  },
  {
    id: 2,
    name: 'Sara Khan',
    email: 'sara.khan@whitecaves.ae',
    phone: '+971 50 111 0002',
    role: 'Sales Agent',
    properties: 8,
    leads: 19,
    dealsClosed: 5,
    revenue: 2800000,
    rating: 4.5,
    online: true,
    avatar: null,
  },
  {
    id: 3,
    name: 'Mohammed Hassan',
    email: 'moh.hassan@whitecaves.ae',
    phone: '+971 50 111 0003',
    role: 'Investment Advisor',
    properties: 15,
    leads: 32,
    dealsClosed: 10,
    revenue: 6200000,
    rating: 4.9,
    online: false,
    avatar: null,
  },
  {
    id: 4,
    name: 'Fatima Ahmed',
    email: 'fatima.ahmed@whitecaves.ae',
    phone: '+971 50 111 0004',
    role: 'Leasing Specialist',
    properties: 6,
    leads: 14,
    dealsClosed: 4,
    revenue: 1200000,
    rating: 4.3,
    online: true,
    avatar: null,
  },
  {
    id: 5,
    name: 'Omar Rashid',
    email: 'omar.rashid@whitecaves.ae',
    phone: '+971 50 111 0005',
    role: 'Sales Agent',
    properties: 4,
    leads: 9,
    dealsClosed: 2,
    revenue: 900000,
    rating: 4.0,
    online: false,
    avatar: null,
  },
];

const EMPTY_FORM = { name: '', email: '', phone: '', role: 'Sales Agent' };
type ModalMode = 'none' | 'add' | 'edit';

const AgentsTab: React.FC<AgentsTabProps> = ({ data, loading, onAction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [localAgents, setLocalAgents] = useState<Agent[]>(() => data?.agents ?? []);
  const [modalMode, setModalMode] = useState<ModalMode>('none');
  const [editTarget, setEditTarget] = useState<Agent | null>(null);
  const [form, setForm] = useState<typeof EMPTY_FORM>(EMPTY_FORM);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = useCallback(() => {
    onAction?.('addAgent');
    setForm(EMPTY_FORM);
    setEditTarget(null);
    setModalMode('add');
  }, [onAction]);
  const openEdit = useCallback((agent: Agent) => {
    setForm({ name: agent.name, email: agent.email, phone: agent.phone, role: agent.role });
    setEditTarget(agent);
    setModalMode('edit');
  }, []);
  const closeModal = () => {
    setModalMode('none');
    setEditTarget(null);
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    if (modalMode === 'add') {
      const nextId = Math.max(0, ...localAgents.map(a => a.id)) + 1;
      setLocalAgents(prev => [
        ...prev,
        {
          id: nextId,
          ...form,
          properties: 0,
          leads: 0,
          dealsClosed: 0,
          revenue: 0,
          rating: 4.0,
          online: false,
          avatar: null,
        },
      ]);
      showToast('✅ Agent added successfully');
    } else if (modalMode === 'edit' && editTarget) {
      setLocalAgents(prev => prev.map(a => (a.id === editTarget.id ? { ...a, ...form } : a)));
      showToast('✅ Agent updated');
    }
    closeModal();
  };

  const toggleActive = (agent: Agent) => {
    setLocalAgents(prev => prev.map(a => (a.id === agent.id ? { ...a, online: !a.online } : a)));
    showToast(agent.online ? '⏸️ Agent deactivated' : '▶️ Agent activated');
  };

  if (loading) {
    return (
      <div className="agents-tab">
        <div className="tab-loading-state" role="status" aria-label="Loading agents">
          <div className="loading-spinner" />
          <p>Loading agents...</p>
        </div>
      </div>
    );
  }

  const filteredAgents = localAgents.filter(
    agent =>
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      agent.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRatingStars = (rating: number) => (
    <div className="rating-stars">
      {[...Array(5)].map((_, i) => (
        <span key={i} className={i < Math.floor(rating) ? 'star filled' : 'star'}>
          ★
        </span>
      ))}
      <span className="rating-value">{rating}</span>
    </div>
  );

  return (
    <div className="agents-tab">
      {toast && (
        <div className="crud-toast" role="status">
          {toast}
        </div>
      )}

      <div className="tab-header">
        <h3>Agent Management</h3>
        <button className="primary-btn" onClick={openAdd}>
          <span>➕</span> Add Agent
        </button>
      </div>

      <div className="agent-stats-row">
        <div className="agent-stat">
          <span className="stat-number">{localAgents.length}</span>
          <span className="stat-label">Total Agents</span>
        </div>
        <div className="agent-stat">
          <span className="stat-number">{localAgents.filter(a => a.online).length}</span>
          <span className="stat-label">Online Now</span>
        </div>
        <div className="agent-stat">
          <span className="stat-number">{localAgents.reduce((s, a) => s + a.dealsClosed, 0)}</span>
          <span className="stat-label">Total Deals</span>
        </div>
        <div className="agent-stat">
          <span className="stat-number">
            AED {(localAgents.reduce((s, a) => s + a.revenue, 0) / 1000000).toFixed(1)}M
          </span>
          <span className="stat-label">Total Revenue</span>
        </div>
      </div>

      <div className="filters-bar">
        <div className="search-input">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {filteredAgents.length === 0 && (
        <div className="empty-state-text" style={{ padding: '2rem', textAlign: 'center' }}>
          No agents found.{' '}
          <button className="link-btn" onClick={openAdd}>
            Add your first agent
          </button>
        </div>
      )}

      <div className="agents-grid">
        {filteredAgents.map(agent => (
          <div key={agent.id} className="agent-card">
            <div className="agent-header">
              <div className="agent-avatar">
                {agent.avatar ? (
                  <img src={agent.avatar} alt={agent.name} loading="lazy" width={40} height={40} />
                ) : (
                  agent.name.charAt(0)
                )}
              </div>
              <span className={`online-status ${agent.online ? 'online' : 'offline'}`}>
                {agent.online ? 'Online' : 'Offline'}
              </span>
            </div>
            <div className="agent-details">
              <h4>{agent.name}</h4>
              <p className="agent-role">{agent.role}</p>
              <p className="agent-contact">{agent.email}</p>
              <p className="agent-contact">{agent.phone}</p>
            </div>
            <div className="agent-metrics">
              <div className="metric">
                <span className="metric-value">{agent.properties}</span>
                <span className="metric-label">Properties</span>
              </div>
              <div className="metric">
                <span className="metric-value">{agent.leads}</span>
                <span className="metric-label">Leads</span>
              </div>
              <div className="metric">
                <span className="metric-value">{agent.dealsClosed}</span>
                <span className="metric-label">Deals</span>
              </div>
            </div>
            <div className="agent-revenue">
              <span>Revenue: </span>
              <strong>AED {agent.revenue.toLocaleString()}</strong>
            </div>
            {getRatingStars(agent.rating)}
            <div className="agent-actions">
              <button
                className="icon-btn"
                title="View Profile"
                aria-label="View agent profile"
                onClick={() => onAction?.('viewAgent', agent.id)}
              >
                👤
              </button>
              <button
                className="icon-btn"
                title="Message"
                aria-label="Message agent"
                onClick={() => onAction?.('messageAgent', agent.id)}
              >
                💬
              </button>
              <button
                className="icon-btn"
                title="Edit"
                aria-label="Edit agent"
                onClick={() => {
                  onAction?.('editAgent', agent.id);
                  openEdit(agent);
                }}
              >
                ✏️
              </button>
              <button
                className={`icon-btn${agent.online ? ' danger' : ''}`}
                title={agent.online ? 'Deactivate' : 'Activate'}
                aria-label={agent.online ? 'Deactivate agent' : 'Activate agent'}
                onClick={() => toggleActive(agent)}
              >
                {agent.online ? '⏸️' : '▶️'}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <div
          className="crud-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="agent-modal-title"
        >
          <div className="crud-modal crud-modal--sm">
            <div className="crud-modal__header">
              <h3 id="agent-modal-title">{modalMode === 'add' ? 'Add New Agent' : 'Edit Agent'}</h3>
              <button className="crud-modal__close" onClick={closeModal} aria-label="Close">
                ✕
              </button>
            </div>
            <div className="crud-modal__body">
              <div className="crud-form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                    placeholder="Agent full name"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="agent@whitecaves.ae"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                    placeholder="+971 50 000 0000"
                  />
                </div>
                <div className="form-group">
                  <label>Role</label>
                  <select
                    value={form.role}
                    onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
                  >
                    <option>Sales Agent</option>
                    <option>Senior Sales Agent</option>
                    <option>Investment Advisor</option>
                    <option>Leasing Specialist</option>
                    <option>Property Manager</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="crud-modal__footer">
              <button className="secondary-btn" onClick={closeModal}>
                Cancel
              </button>
              <button
                className="primary-btn"
                onClick={handleSave}
                disabled={!form.name.trim() || !form.email.trim()}
              >
                {modalMode === 'add' ? 'Add Agent' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(AgentsTab);
