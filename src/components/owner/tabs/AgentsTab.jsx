import React, { useState } from 'react';
import './TabStyles.css';

const AgentsTab = ({ data, loading, onAction }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const agents = data?.agents || [
    { id: 1, name: 'Ahmed Ali', email: 'ahmed.ali@whitecaves.ae', phone: '+971 50 123 4567', role: 'Senior Sales Agent', properties: 24, leads: 45, dealsClosed: 12, revenue: 3200000, rating: 4.8, online: true, avatar: null },
    { id: 2, name: 'Sara Khan', email: 'sara.khan@whitecaves.ae', phone: '+971 55 987 6543', role: 'Leasing Agent', properties: 18, leads: 38, dealsClosed: 22, revenue: 1800000, rating: 4.6, online: true, avatar: null },
    { id: 3, name: 'Mohammed Hassan', email: 'mohammed.h@whitecaves.ae', phone: '+971 52 456 7890', role: 'Sales Agent', properties: 15, leads: 32, dealsClosed: 8, revenue: 2100000, rating: 4.5, online: false, avatar: null },
    { id: 4, name: 'Fatima Ahmed', email: 'fatima.a@whitecaves.ae', phone: '+971 54 321 0987', role: 'Leasing Agent', properties: 20, leads: 41, dealsClosed: 28, revenue: 1500000, rating: 4.9, online: true, avatar: null },
    { id: 5, name: 'Omar Rashid', email: 'omar.r@whitecaves.ae', phone: '+971 56 789 0123', role: 'Junior Sales Agent', properties: 8, leads: 15, dealsClosed: 3, revenue: 850000, rating: 4.2, online: false, avatar: null },
  ];

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRatingStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <div className="rating-stars">
        {[...Array(5)].map((_, i) => (
          <span key={i} className={i < fullStars ? 'star filled' : (i === fullStars && hasHalf ? 'star half' : 'star')}>
            ★
          </span>
        ))}
        <span className="rating-value">{rating}</span>
      </div>
    );
  };

  return (
    <div className="agents-tab">
      <div className="tab-header">
        <h3>Agent Management</h3>
        <button className="primary-btn" onClick={() => onAction?.('addAgent')}>
          <span>➕</span> Add Agent
        </button>
      </div>

      <div className="agent-stats-row">
        <div className="agent-stat">
          <span className="stat-number">{agents.length}</span>
          <span className="stat-label">Total Agents</span>
        </div>
        <div className="agent-stat">
          <span className="stat-number">{agents.filter(a => a.online).length}</span>
          <span className="stat-label">Online Now</span>
        </div>
        <div className="agent-stat">
          <span className="stat-number">{agents.reduce((sum, a) => sum + a.dealsClosed, 0)}</span>
          <span className="stat-label">Total Deals</span>
        </div>
        <div className="agent-stat">
          <span className="stat-number">AED {(agents.reduce((sum, a) => sum + a.revenue, 0) / 1000000).toFixed(1)}M</span>
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
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="agents-grid">
        {filteredAgents.map((agent) => (
          <div key={agent.id} className="agent-card">
            <div className="agent-header">
              <div className="agent-avatar">
                {agent.avatar ? <img src={agent.avatar} alt={agent.name} /> : agent.name.charAt(0)}
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
              <button className="icon-btn" title="View Profile" onClick={() => onAction?.('viewAgent', agent.id)}>👁️</button>
              <button className="icon-btn" title="Message" onClick={() => onAction?.('messageAgent', agent.id)}>💬</button>
              <button className="icon-btn" title="Edit" onClick={() => onAction?.('editAgent', agent.id)}>✏️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgentsTab;
