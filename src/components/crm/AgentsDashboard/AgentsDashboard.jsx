/**
 * AgentsDashboard Component - Simplified version
 */

import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectAllAgents, updateAgent } from '../../../store/crmDataSlice';
import {
  selectSearchQuery,
  selectViewType,
  setSearchQuery,
  setView
} from '../../../store/managingDirectorDashboardSlice';
import { Search, Grid3x3, List, Download } from 'lucide-react';
import './AgentsDashboard.css';

const AgentsDashboard = () => {
  const dispatch = useDispatch();
  const agents = useSelector(selectAllAgents);
  const searchQuery = useSelector(selectSearchQuery);
  const viewType = useSelector(selectViewType);

  const filteredAgents = useMemo(
    () =>
      agents.filter(
        a =>
          a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.email.toLowerCase().includes(searchQuery.toLowerCase())
      ),
    [agents, searchQuery]
  );

  return (
    <div className="agents-dashboard">
      <div className="dashboard-header">
        <div>
          <h1>👨‍💼 Sales Team Performance</h1>
          <p className="header-subtitle">{agents.length} agents total</p>
        </div>
        <button className="action-btn export-btn">
          <Download size={18} /> Export
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search agents..."
            value={searchQuery}
            onChange={e => dispatch(setSearchQuery(e.target.value))}
          />
        </div>
        <div className="view-toggle">
          <button
            className={`view-btn ${viewType === 'grid' ? 'active' : ''}`}
            onClick={() => dispatch(setView('grid'))}
          >
            <Grid3x3 size={18} />
          </button>
          <button
            className={`view-btn ${viewType === 'list' ? 'active' : ''}`}
            onClick={() => dispatch(setView('list'))}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {viewType === 'grid' ? (
        <div className="agents-grid">
          {filteredAgents.map(agent => (
            <div key={agent.id} className="agent-card">
              <div
                className="agent-avatar"
                style={{ backgroundColor: agent.avatar_color }}
              >
                {agent.avatar}
              </div>
              <h3>{agent.name}</h3>
              <p className="agent-department">{agent.department}</p>
              <div className="agent-stats">
                <div className="stat">
                  <span className="stat-value">{agent.sales}</span>
                  <span className="stat-label">Sales</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{agent.rating}</span>
                  <span className="stat-label">Rating</span>
                </div>
              </div>
              <p className="agent-commission">
                AED {(agent.commission / 1000).toFixed(0)}K
              </p>
              <span className={`agent-status ${agent.status}`}>
                {agent.status === 'online' ? '🟢' : '⚪'} {agent.status.toUpperCase()}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="agents-table-wrapper">
          <table className="agents-table">
            <thead>
              <tr>
                <th>Agent</th>
                <th>Department</th>
                <th>Sales</th>
                <th>Commission</th>
                <th>Rating</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredAgents.map(agent => (
                <tr key={agent.id}>
                  <td>{agent.name}</td>
                  <td>{agent.department}</td>
                  <td>{agent.sales}</td>
                  <td>AED {(agent.commission / 1000).toFixed(0)}K</td>
                  <td>⭐ {agent.rating}</td>
                  <td>
                    <span className={`agent-status-badge ${agent.status}`}>
                      {agent.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AgentsDashboard;
