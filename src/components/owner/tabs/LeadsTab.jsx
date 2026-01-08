import React, { useState } from 'react';
import './TabStyles.css';

const LeadsTab = ({ data, loading, onAction }) => {
  const [sourceFilter, setSourceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const leads = data?.leads || [
    { id: 1, name: 'Khalid Al Maktoum', phone: '+971 50 111 2222', email: 'khalid@email.com', source: 'whatsapp', propertyInterest: 'Palm Jumeirah Villa', priority: 'high', status: 'new', createdAt: new Date().toISOString(), agent: 'Ahmed Ali' },
    { id: 2, name: 'Emily Watson', phone: '+44 7700 123456', email: 'emily.w@email.com', source: 'website', propertyInterest: 'Downtown Apartment', priority: 'medium', status: 'contacted', createdAt: new Date(Date.now() - 86400000).toISOString(), agent: 'Sara Khan' },
    { id: 3, name: 'Chen Wei', phone: '+86 138 0000 1234', email: 'chen.wei@email.com', source: 'chatbot', propertyInterest: 'Investment Properties', priority: 'high', status: 'qualified', createdAt: new Date(Date.now() - 172800000).toISOString(), agent: 'Mohammed Hassan' },
    { id: 4, name: 'Rashid Khan', phone: '+971 55 333 4444', email: 'rashid.k@email.com', source: 'referral', propertyInterest: 'Family Townhouse', priority: 'medium', status: 'new', createdAt: new Date(Date.now() - 259200000).toISOString(), agent: null },
    { id: 5, name: 'Maria Garcia', phone: '+34 612 345 678', email: 'maria.g@email.com', source: 'whatsapp', propertyInterest: 'Luxury Penthouse', priority: 'high', status: 'contacted', createdAt: new Date(Date.now() - 345600000).toISOString(), agent: 'Fatima Ahmed' },
    { id: 6, name: 'James Miller', phone: '+1 555 123 4567', email: 'james.m@email.com', source: 'website', propertyInterest: 'Commercial Space', priority: 'low', status: 'lost', createdAt: new Date(Date.now() - 604800000).toISOString(), agent: 'Omar Rashid' },
  ];

  const filteredLeads = leads.filter(lead => {
    const matchesSource = sourceFilter === 'all' || lead.source === sourceFilter;
    const matchesStatus = statusFilter === 'all' || lead.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || lead.priority === priorityFilter;
    return matchesSource && matchesStatus && matchesPriority;
  });

  const getSourceIcon = (source) => {
    const icons = { whatsapp: '💬', website: '🌐', chatbot: '🤖', referral: '👥' };
    return icons[source] || '📌';
  };

  const getPriorityBadge = (priority) => {
    const config = {
      high: { color: '#EF4444', bg: '#FEE2E2' },
      medium: { color: '#F59E0B', bg: '#FEF3C7' },
      low: { color: '#3B82F6', bg: '#DBEAFE' }
    };
    const c = config[priority] || config.low;
    return <span className="priority-badge" style={{ color: c.color, backgroundColor: c.bg }}>{priority}</span>;
  };

  const getStatusBadge = (status) => {
    const config = {
      new: { color: '#3B82F6', text: 'New' },
      contacted: { color: '#06B6D4', text: 'Contacted' },
      qualified: { color: '#22C55E', text: 'Qualified' },
      lost: { color: '#EF4444', text: 'Lost' }
    };
    const c = config[status] || { color: '#6B7280', text: status };
    return <span className="status-badge" style={{ backgroundColor: `${c.color}20`, color: c.color }}>{c.text}</span>;
  };

  const leadStats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    qualified: leads.filter(l => l.status === 'qualified').length,
    highPriority: leads.filter(l => l.priority === 'high').length
  };

  return (
    <div className="leads-tab">
      <div className="tab-header">
        <h3>Lead Management</h3>
        <div className="header-actions">
          <button className="secondary-btn" onClick={() => onAction?.('exportLeads')}>
            <span>📥</span> Export
          </button>
          <button className="primary-btn" onClick={() => onAction?.('addLead')}>
            <span>➕</span> Add Lead
          </button>
        </div>
      </div>

      <div className="lead-stats-row">
        <div className="lead-stat">
          <span className="stat-number">{leadStats.total}</span>
          <span className="stat-label">Total Leads</span>
        </div>
        <div className="lead-stat new">
          <span className="stat-number">{leadStats.new}</span>
          <span className="stat-label">New Leads</span>
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

      <div className="filters-bar">
        <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}>
          <option value="all">All Sources</option>
          <option value="whatsapp">WhatsApp</option>
          <option value="website">Website</option>
          <option value="chatbot">Chatbot</option>
          <option value="referral">Referral</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="lost">Lost</option>
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
          <option value="all">All Priority</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      <div className="data-table">
        <table>
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
            {filteredLeads.map((lead) => (
              <tr key={lead.id}>
                <td>
                  <div className="lead-cell">
                    <strong>{lead.name}</strong>
                    <small>{new Date(lead.createdAt).toLocaleDateString()}</small>
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
                <td>{lead.propertyInterest}</td>
                <td>{getPriorityBadge(lead.priority)}</td>
                <td>{getStatusBadge(lead.status)}</td>
                <td>{lead.agent || <span className="unassigned">Unassigned</span>}</td>
                <td>
                  <div className="action-buttons">
                    <button className="icon-btn" title="View" onClick={() => onAction?.('viewLead', lead.id)}>👁️</button>
                    <button className="icon-btn" title="Call" onClick={() => onAction?.('callLead', lead.id)}>📞</button>
                    <button className="icon-btn" title="WhatsApp" onClick={() => onAction?.('whatsappLead', lead.id)}>💬</button>
                    <button className="icon-btn" title="Assign" onClick={() => onAction?.('assignLead', lead.id)}>👤</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LeadsTab;
