/**
 * OverviewDashboard Component
 * Managing Director's main dashboard with KPIs, hot leads, top agents, activities
 */

import React from 'react';
import { useSelector } from 'react-redux';
import {
  selectAllAgents,
  selectHotLeads,
  selectAllActivities,
  selectOverviewMetrics,
  selectOnlineAgents
} from '../../../store/crmDataSlice';
import {
  Users,
  TrendingUp,
  Zap,
  DollarSign,
  Clock,
  Star,
  Activity
} from 'lucide-react';
import './OverviewDashboard.css';

const OverviewDashboard = () => {
  const metrics = useSelector(selectOverviewMetrics);
  const topAgents = useSelector(selectAllAgents)
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);
  const hotLeads = useSelector(selectHotLeads).slice(0, 5);
  const onlineAgents = useSelector(selectOnlineAgents);
  const activities = useSelector(selectAllActivities).slice(0, 8);

  return (
    <div className="overview-dashboard">
      {/* PAGE HEADER */}
      <div className="overview-header">
        <h1>📊 Managing Director Dashboard</h1>
        <p className="header-subtitle">Real-time performance overview</p>
      </div>

      {/* KEY METRICS SECTION */}
      <section className="metrics-section">
        <h2>Key Metrics</h2>
        <div className="metrics-grid">
          {/* Hot Leads */}
          <div className="metric-card hot-leads">
            <div className="metric-icon">
              <Zap size={28} />
            </div>
            <div className="metric-content">
              <p className="metric-label">Hot Leads</p>
              <p className="metric-value">{metrics?.hotLeads || 0}</p>
              <p className="metric-change">↑ Ready for contact</p>
            </div>
          </div>

          {/* Agents Online */}
          <div className="metric-card agents-online">
            <div className="metric-icon">
              <Users size={28} />
            </div>
            <div className="metric-content">
              <p className="metric-label">Agents Online</p>
              <p className="metric-value">{onlineAgents?.length || 0}</p>
              <p className="metric-change">of {metrics?.agentsTotal || 0} total</p>
            </div>
          </div>

          {/* Conversions */}
          <div className="metric-card conversions">
            <div className="metric-icon">
              <TrendingUp size={28} />
            </div>
            <div className="metric-content">
              <p className="metric-label">Conversions (Month)</p>
              <p className="metric-value">{metrics?.conversionsThisMonth || 0}</p>
              <p className="metric-change">↑ New deals closed</p>
            </div>
          </div>

          {/* Revenue */}
          <div className="metric-card revenue">
            <div className="metric-icon">
              <DollarSign size={28} />
            </div>
            <div className="metric-content">
              <p className="metric-label">Revenue (Month)</p>
              <p className="metric-value">
                AED {(metrics?.revenuethisMonth || 0) / 1000000}M
              </p>
              <p className="metric-change">Current month</p>
            </div>
          </div>
        </div>
      </section>

      {/* TWO COLUMN LAYOUT */}
      <div className="dashboard-grid">
        {/* TOP AGENTS */}
        <section className="top-agents-section">
          <h2>🌟 Top Performing Agents</h2>
          <div className="agents-table-wrapper">
            <table className="agents-table">
              <thead>
                <tr>
                  <th>Agent</th>
                  <th>Sales</th>
                  <th>Commission</th>
                  <th>Rating</th>
                </tr>
              </thead>
              <tbody>
                {topAgents.map(agent => (
                  <tr key={agent.id} className="agent-row">
                    <td>
                      <div className="agent-cell">
                        <div
                          className="agent-avatar-small"
                          style={{ backgroundColor: agent.avatar_color }}
                        >
                          {agent.avatar}
                        </div>
                        <div className="agent-details">
                          <p className="agent-name">{agent.name}</p>
                          <p className="agent-status">
                            {agent.status === 'online' ? '🟢' : '⚪'} {agent.status}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="sales-cell">{agent.sales}</td>
                    <td className="commission-cell">
                      AED {(agent.commission / 1000).toFixed(0)}K
                    </td>
                    <td className="rating-cell">
                      <span className="rating-badge">⭐ {agent.rating}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* RECENT ACTIVITIES */}
        <section className="activities-section">
          <h2>📝 Recent Activities</h2>
          <div className="activities-list">
            {activities.map(activity => (
              <div key={activity.id} className="activity-item">
                <div className="activity-icon">{activity.icon}</div>
                <div className="activity-content">
                  <p className="activity-action">
                    <strong>{activity.action}</strong>
                  </p>
                  <p className="activity-description">{activity.description}</p>
                  <p className="activity-meta">
                    {activity.user} • {activity.timestamp}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* HOT LEADS SECTION */}
      <section className="hot-leads-section">
        <h2>🔥 Hot Leads Ready for Contact</h2>
        <div className="leads-grid">
          {hotLeads.length > 0 ? (
            hotLeads.map(lead => (
              <div key={lead.id} className="lead-card">
                <div className="lead-header">
                  <div>
                    <h3>{lead.name}</h3>
                    <p className="lead-property">{lead.property_interest}</p>
                  </div>
                  <span className={`priority-badge ${lead.priority?.toLowerCase()}`}>
                    {lead.priority}
                  </span>
                </div>

                <div className="lead-body">
                  <div className="lead-detail">
                    <span className="label">Email</span>
                    <span className="value">{lead.email}</span>
                  </div>
                  <div className="lead-detail">
                    <span className="label">Phone</span>
                    <span className="value">{lead.phone}</span>
                  </div>
                  <div className="lead-detail">
                    <span className="label">Amount</span>
                    <span className="value highlight">
                      AED {(lead.amount / 1000000).toFixed(1)}M
                    </span>
                  </div>
                  <div className="lead-detail">
                    <span className="label">Agent</span>
                    <span className="value">{lead.agent_name}</span>
                  </div>
                  <div className="lead-detail">
                    <span className="label">Stage</span>
                    <span className={`stage-badge ${lead.stage}`}>
                      {lead.stage.charAt(0).toUpperCase() + lead.stage.slice(1)}
                    </span>
                  </div>
                </div>

                <div className="lead-footer">
                  <div className="lead-action-info">
                    <Clock size={14} />
                    <span>{lead.last_contact}</span>
                  </div>
                  <button className="contact-btn">Contact Now →</button>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state">
              <p>No hot leads at the moment</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default OverviewDashboard;
