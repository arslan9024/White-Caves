import React, { useState, useCallback, useEffect } from 'react';
import type { LeadsTabProps, Lead } from './types';
import './TabStyles.css';

const MOCK_LEADS: Lead[] = [
  {
    id: 1,
    name: 'Khalid Al Maktoum',
    phone: '+971 50 111 2222',
    email: 'khalid@email.com',
    source: 'whatsapp',
    interest: 'Palm Jumeirah Villa',
    priority: 'high',
    status: 'new',
    createdAt: new Date().toISOString(),
    agent: 'Ahmed Ali',
  },
  {
    id: 2,
    name: 'Emily Watson',
    phone: '+44 7700 123456',
    email: 'emily.w@email.com',
    source: 'website',
    interest: 'Downtown Apartment',
    priority: 'medium',
    status: 'contacted',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    agent: 'Sara Khan',
  },
  {
    id: 3,
    name: 'Chen Wei',
    phone: '+86 138 0000 1234',
    email: 'chen.wei@email.com',
    source: 'chatbot',
    interest: 'Investment Properties',
    priority: 'high',
    status: 'qualified',
    createdAt: new Date(Date.now() - 172800000).toISOString(),
    agent: 'Mohammed Hassan',
  },
  {
    id: 4,
    name: 'Rashid Khan',
    phone: '+971 55 333 4444',
    email: 'rashid.k@email.com',
    source: 'referral',
    interest: 'Family Townhouse',
    priority: 'medium',
    status: 'new',
    createdAt: new Date(Date.now() - 259200000).toISOString(),
    agent: '',
  },
  {
    id: 5,
    name: 'Maria Garcia',
    phone: '+34 612 345 678',
    email: 'maria.g@email.com',
    source: 'whatsapp',
    interest: 'Luxury Penthouse',
    priority: 'high',
    status: 'contacted',
    createdAt: new Date(Date.now() - 345600000).toISOString(),
    agent: 'Fatima Ahmed',
  },
  {
    id: 6,
    name: 'James Miller',
    phone: '+1 555 123 4567',
    email: 'james.m@email.com',
    source: 'website',
    interest: 'Commercial Space',
    priority: 'low',
    status: 'lost',
    createdAt: new Date(Date.now() - 604800000).toISOString(),
    agent: 'Omar Rashid',
  },
];

const EMPTY_LEAD: Omit<Lead, 'id' | 'createdAt'> = {
  name: '',
  phone: '',
  email: '',
  source: 'website',
  interest: '',
  priority: 'medium',
  status: 'new',
  agent: '',
};

type ModalMode = 'none' | 'add' | 'edit' | 'delete';

const LeadsTab: React.FC<LeadsTabProps> = ({ data, loading, error }) => {
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // CRUD state
  // Use data from props (API/Redux) first; fall back to empty array in production
  // MOCK_LEADS kept below for development reference only
  const [localLeads, setLocalLeads] = useState<Lead[]>(() => data?.leads ?? []);
  const [modalMode, setModalMode] = useState<ModalMode>('none');
  const [editTarget, setEditTarget] = useState<Lead | null>(null);
  const [form, setForm] = useState<Omit<Lead, 'id' | 'createdAt'>>(EMPTY_LEAD);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setCurrentPage(1);
  }, [sourceFilter, statusFilter, priorityFilter]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = useCallback(() => {
    setForm(EMPTY_LEAD);
    setEditTarget(null);
    setModalMode('add');
  }, []);
  const openEdit = useCallback((lead: Lead) => {
    const { id: _id, createdAt: _ca, ...rest } = lead;
    setForm(rest);
    setEditTarget(lead);
    setModalMode('edit');
  }, []);
  const openDelete = useCallback((lead: Lead) => {
    setEditTarget(lead);
    setModalMode('delete');
  }, []);
  const closeModal = () => {
    setModalMode('none');
    setEditTarget(null);
  };

  const handleSave = () => {
    if (!form.name.trim()) return;
    if (modalMode === 'add') {
      const nextId = Math.max(0, ...localLeads.map(l => l.id)) + 1;
      setLocalLeads(prev => [
        ...prev,
        { id: nextId, createdAt: new Date().toISOString(), ...form },
      ]);
      showToast('âœ… Lead added successfully');
    } else if (modalMode === 'edit' && editTarget) {
      setLocalLeads(prev => prev.map(l => (l.id === editTarget.id ? { ...l, ...form } : l)));
      showToast('âœ… Lead updated successfully');
    }
    closeModal();
  };

  const handleDelete = () => {
    if (!editTarget) return;
    setLocalLeads(prev => prev.filter(l => l.id !== editTarget.id));
    showToast('ðŸ—‘ï¸ Lead removed');
    closeModal();
  };

  const handleStatusChange = (id: number, status: string) => {
    setLocalLeads(prev => prev.map(l => (l.id === id ? { ...l, status } : l)));
  };

  if (loading) {
    return (
      <div className="leads-tab">
        <div className="tab-loading-state" role="status" aria-label="Loading leads">
          <div className="loading-spinner" />
          <p>Loading leads...</p>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="leads-tab">
        <div className="tab-error-state" role="alert">
          <span className="error-icon">âš ï¸</span>
          <p>Failed to load leads: {error}</p>
        </div>
      </div>
    );
  }

  const filteredLeads = localLeads.filter(lead => {
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    return matchesSource && matchesStatus && matchesPriority;
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getSourceIcon = (source: string): string =>
    ({ whatsapp: 'ðŸ’¬', website: 'ðŸŒ', chatbot: 'ðŸ¤–', referral: 'ðŸ¤', social: 'ðŸ“±' })[
      source
    ] ?? 'ðŸ“‹';

  const getPriorityBadge = (priority: string) => {
    const cfg: Record<string, { bg: string; color: string }> = {
      high: { bg: '#FEE2E2', color: '#DC2626' },
      medium: { bg: '#FEF3C7', color: '#D97706' },
      low: { bg: '#F3F4F6', color: '#6B7280' },
    };
    const c = cfg[priority] ?? cfg.low;
    return (
      <span className="priority-badge-crm" style={{ backgroundColor: c.bg, color: c.color }}>
        {priority}
      </span>
    );
  };

  const getStatusColor = (status: string) =>
    ({ new: '#3B82F6', contacted: '#06B6D4', qualified: '#22C55E', lost: '#EF4444' })[status] ??
    '#6B7280';

  const leadStats = {
    total: localLeads.length,
    new: localLeads.filter(l => l.status === 'new').length,
    qualified: localLeads.filter(l => l.status === 'qualified').length,
    highPriority: localLeads.filter(l => l.priority === 'high').length,
  };

  return (
    <div className="leads-tab">
      {toast && (
        <div className="crud-toast" role="status">
          {toast}
        </div>
      )}

      <div className="tab-header">
        <h3>Lead Management</h3>
        <div className="header-actions">
          <button className="primary-btn" onClick={openAdd}>
            <span>âž•</span> Add Lead
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="lead-stats-row">
        <div className="lead-stat">
          <span className="stat-number">{leadStats.total}</span>
          <span className="stat-label">Total Leads</span>
        </div>
        <div className="lead-stat new">
          <span className="stat-number">{leadStats.new}</span>
          <span className="stat-label">New</span>
        </div>
        <div className="lead-stat qualified">
          <span className="stat-number">{leadStats.qualified}</span>
          <span className="stat-label">Qualified</span>
        </div>
        <div className="lead-stat high">
          <span className="stat-number">{leadStats.highPriority}</span>
          <span className="stat-label">High Priority</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <select value={sourceFilter} onChange={e => setSourceFilter(e.target.value)}>
          <option value="all">All Sources</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="website">Website</option>
          <option value="chatbot">Chatbot</option>
          <option value="referral">Referral</option>
        </select>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="lost">Lost</option>
        </select>
        <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Empty state */}
      {filteredLeads.length === 0 && (
        <div className="empty-state-text" style={{ padding: '2rem', textAlign: 'center' }}>
          No leads found.{' '}
          <button className="link-btn" onClick={openAdd}>
            Add your first lead â†’
          </button>
        </div>
      )}

      {filteredLeads.length > 0 && (
        <div className="data-table">
          <table aria-label="Leads data">
            <thead>
              <tr>
                <th>Lead</th>
                <th>Contact</th>
                <th>Source</th>
                <th>Interest</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Agent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLeads.map(lead => (
                <tr key={lead.id}>
                  <td>
                    <div className="lead-cell">
                      <strong>{lead.name}</strong>
                      <small>
                        {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'N/A'}
                      </small>
                    </div>
                  </td>
                  <td>
                    <div className="contact-cell">
                      <span>{lead.phone}</span>
                      <small>{lead.email}</small>
                    </div>
                  </td>
                  <td>
                    <span className="source-badge">
                      {getSourceIcon(lead.source)} {lead.source}
                    </span>
                  </td>
                  <td>{lead.interest || 'N/A'}</td>
                  <td>{getPriorityBadge(lead.priority)}</td>
                  <td>
                    <span className={`status-badge status-badge--${lead.status}`}>
                      {lead.status}
                    </span>
                    <select
                      className="status-select"
                      value={lead.status}
                      onChange={e => handleStatusChange(lead.id, e.target.value)}
                      style={{ color: getStatusColor(lead.status) }}
                      aria-label="Change lead status"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="lost">Lost</option>
                    </select>
                  </td>
                  <td>{lead.agent || <span className="unassigned">Unassigned</span>}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="icon-btn"
                        title="Edit"
                        aria-label="Edit lead"
                        onClick={() => openEdit(lead)}
                      >
                        âœï¸
                      </button>
                      <button
                        className="icon-btn danger"
                        title="Delete"
                        aria-label="Delete lead"
                        onClick={() => openDelete(lead)}
                      >
                        ðŸ—‘ï¸
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <nav role="navigation" aria-label="Pagination">
        {totalPages > 1 && (
          <div className="table-footer">
            <span>
              Showing {paginatedLeads.length} of {filteredLeads.length} leads
            </span>
            <div className="pagination">
              <button
                className="page-btn"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              >
                â†
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`page-btn ${p === currentPage ? 'active' : ''}`}
                  onClick={() => setCurrentPage(p)}
                >
                  {p}
                </button>
              ))}
              <button
                className="page-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              >
                â†’
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Add / Edit Modal */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <div
          className="crud-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="lead-modal-title"
        >
          <div className="crud-modal">
            <div className="crud-modal__header">
              <h3 id="lead-modal-title">{modalMode === 'add' ? 'Add New Lead' : 'Edit Lead'}</h3>
              <button className="crud-modal__close" onClick={closeModal} aria-label="Close">
                âœ•
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
                    placeholder="e.g. Khalid Al Maktoum"
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
                  <label>Email</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="form-group">
                  <label>Source</label>
                  <select
                    value={form.source}
                    onChange={e => setForm(f => ({ ...f, source: e.target.value }))}
                  >
                    <option value="website">Website</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="chatbot">Chatbot</option>
                    <option value="referral">Referral</option>
                    <option value="social">Social Media</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Interest / Property Type</label>
                  <input
                    type="text"
                    value={form.interest}
                    onChange={e => setForm(f => ({ ...f, interest: e.target.value }))}
                    placeholder="e.g. 3BR Villa in Palm Jumeirah"
                  />
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select
                    value={form.priority}
                    onChange={e => setForm(f => ({ ...f, priority: e.target.value }))}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  >
                    <option value="new">New</option>
                    <option value="contacted">Contacted</option>
                    <option value="qualified">Qualified</option>
                    <option value="lost">Lost</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Assigned Agent</label>
                  <input
                    type="text"
                    value={form.agent}
                    onChange={e => setForm(f => ({ ...f, agent: e.target.value }))}
                    placeholder="Agent name (optional)"
                  />
                </div>
              </div>
            </div>
            <div className="crud-modal__footer">
              <button className="secondary-btn" onClick={closeModal}>
                Cancel
              </button>
              <button className="primary-btn" onClick={handleSave} disabled={!form.name.trim()}>
                {modalMode === 'add' ? 'Add Lead' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {modalMode === 'delete' && editTarget && (
        <div
          className="crud-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="del-lead-title"
        >
          <div className="crud-modal crud-modal--sm">
            <div className="crud-modal__header">
              <h3 id="del-lead-title">Remove Lead</h3>
              <button className="crud-modal__close" onClick={closeModal} aria-label="Close">
                âœ•
              </button>
            </div>
            <div className="crud-modal__body">
              <p>
                Remove <strong>{editTarget.name}</strong> from your leads?
              </p>
              <p className="crud-warn">This action cannot be undone.</p>
            </div>
            <div className="crud-modal__footer">
              <button className="secondary-btn" onClick={closeModal}>
                Cancel
              </button>
              <button className="danger-btn" onClick={handleDelete}>
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(LeadsTab);
