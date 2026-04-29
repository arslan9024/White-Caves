import React, { useState } from 'react';
import type { AgentsTabProps } from './types';
import './TabStyles.css';

const AgentsTab: React.FC<AgentsTabProps> = ({ data, loading, onAction }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Show loading state
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

  const agents = data?.agents || [];

  const filteredAgents = agents.filter(agent =>
    agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    agent.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    return (
      <div className="rating-stars">
        {[...Array(5)].map((_, i) => (
          <span key={`star-${i}`} className={i < fullStars ? 'star filled' : (i === fullStars && hasHalf ? 'star half' : 'star')}>
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
                {agent.avatar ? <img src={agent.avatar} alt={agent.name} loading="lazy" width={40} height={40} /> : agent.name.charAt(0)}
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
              <button className="icon-btn" title="View Profile" aria-label="View profile" onClick={() => onAction?.('viewAgent', agent.id)}>👁️</button>
              <button className="icon-btn" title="Message" aria-label="Send message" onClick={() => onAction?.('messageAgent', agent.id)}>💬</button>
              <button className="icon-btn" title="Edit" aria-label="Edit agent" onClick={() => onAction?.('editAgent', agent.id)}>✏️</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default React.memo(AgentsTab);
