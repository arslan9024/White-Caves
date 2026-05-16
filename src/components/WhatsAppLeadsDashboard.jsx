import React, { useState, useEffect } from 'react';
import { Bell, MessageSquare, TrendingUp, Users, Eye, CheckCircle } from 'lucide-react';
import { authFetch } from '../utils/authFetch';
import './WhatsAppLeadsDashboard.css';

const WhatsAppLeadsDashboard = () => {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState('new');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({});
  const [selectedLead, setSelectedLead] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchLeads();
    fetchStats();
    const interval = setInterval(() => {
      fetchLeads();
      fetchStats();
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await authFetch(`/api/whatsapp/leads?status=${filter}&limit=50`);
      const data = await response.json();
      setLeads(data.leads || []);
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await authFetch('/api/whatsapp/leads?limit=1000');
      const data = await response.json();
      const allLeads = data.leads || [];

      setStats({
        total: allLeads.length,
        new: allLeads.filter(lead => lead.status === 'new').length,
        hot: allLeads.filter(lead => lead.leadScore >= 80).length,
        converted: allLeads.filter(lead => lead.status === 'converted').length,
        avgScore:
          allLeads.length > 0
            ? Math.round(
                allLeads.reduce((sum, lead) => sum + (lead.leadScore || 0), 0) / allLeads.length
              )
            : 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLeadClick = lead => {
    setSelectedLead(lead);
    setShowModal(true);
  };

  return (
    <div className="leads-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="header-content">
          <h1>
            <MessageSquare size={28} /> WhatsApp Leads
          </h1>
          <p>Real-time lead capture and engagement tracking</p>
        </div>
        <button className="btn-new-campaign">
          <Bell size={18} /> Enable Notifications
        </button>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <StatCard icon={<Users />} label="Total Leads" value={stats.total || 0} color="#3498db" />
        <StatCard icon={<Eye />} label="New Leads" value={stats.new || 0} color="#e74c3c" />
        <StatCard icon={<TrendingUp />} label="Hot Leads" value={stats.hot || 0} color="#f39c12" />
        <StatCard
          icon={<CheckCircle />}
          label="Conversions"
          value={stats.converted || 0}
          color="#4caf50"
        />
        <StatCard
          icon={<MessageSquare />}
          label="Avg Lead Score"
          value={`${stats.avgScore || 0}/100`}
          color="#9b59b6"
        />
      </div>

      {/* Filter Tabs */}
      <div className="filter-tabs">
        {['new', 'contacted', 'qualified', 'converted', 'lost'].map(status => (
          <button
            key={status}
            className={`tab ${filter === status ? 'active' : ''}`}
            onClick={() => setFilter(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Leads Table */}
      <div className="leads-table-container">
        {loading ? (
          <div className="loading">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="no-data">No leads found</div>
        ) : (
          <table className="leads-table">
            <thead>
              <tr>
                <th>Contact</th>
                <th>Intent</th>
                <th>Score</th>
                <th>Level</th>
                <th>Messages</th>
                <th>Last Interaction</th>
                <th>Agent</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead._id} className="lead-row">
                  <td className="contact-cell">
                    <div className="contact-info">
                      <span className="contact-name">{lead.displayName}</span>
                      <span className="contact-phone">{lead.phoneNumber}</span>
                    </div>
                  </td>
                  <td>
                    <span className="intent-badge">{lead.leadType}</span>
                  </td>
                  <td>
                    <div className="score-bar">
                      <div
                        className="score-fill"
                        style={{
                          width: `${lead.leadScore}%`,
                          backgroundColor: getScoreColor(lead.leadScore),
                        }}
                      />
                    </div>
                    <span className="score-text">{lead.leadScore}</span>
                  </td>
                  <td>
                    <span className={`level-badge level-${lead.engagementLevel}`}>
                      {lead.engagementLevel}
                    </span>
                  </td>
                  <td className="center">{lead.messageCount}</td>
                  <td className="muted">
                    {lead.lastInteractionDate
                      ? formatTime(new Date(lead.lastInteractionDate))
                      : 'N/A'}
                  </td>
                  <td>
                    {lead.assignedAgentId ? (
                      <span className="assigned-badge">Assigned</span>
                    ) : (
                      <span className="unassigned-badge">Unassigned</span>
                    )}
                  </td>
                  <td>
                    <button className="btn-view" onClick={() => handleLeadClick(lead)}>
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Lead Details Modal */}
      {showModal && selectedLead && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedLead.displayName}</h2>
              <button className="close-btn" onClick={() => setShowModal(false)}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Lead Summary */}
              <div className="lead-summary">
                <div className="summary-item">
                  <label>Phone</label>
                  <p>{selectedLead.phoneNumber}</p>
                </div>
                <div className="summary-item">
                  <label>Lead Type</label>
                  <p>{selectedLead.leadType}</p>
                </div>
                <div className="summary-item">
                  <label>Status</label>
                  <p>{selectedLead.status}</p>
                </div>
                <div className="summary-item">
                  <label>Score</label>
                  <p className="score-highlight">{selectedLead.leadScore}/100</p>
                </div>
              </div>

              {/* Property Interests */}
              {selectedLead.preferredAreas && selectedLead.preferredAreas.length > 0 && (
                <div className="interests-section">
                  <h4>Property Interests</h4>
                  <div className="interests-tags">
                    {selectedLead.preferredAreas.map((area, idx) => (
                      <span key={idx} className="tag">
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Budget */}
              {(selectedLead.budgetMin || selectedLead.budgetMax) && (
                <div className="budget-section">
                  <h4>Budget</h4>
                  <p>
                    AED {selectedLead.budgetMin?.toLocaleString()} - AED{' '}
                    {selectedLead.budgetMax?.toLocaleString()}
                  </p>
                </div>
              )}

              {/* Conversation */}
              <div className="conversation-section">
                <h4>Conversation History</h4>
                <div className="conversation">
                  {selectedLead.conversationHistory?.slice(-5).map((msg, idx) => (
                    <div key={idx} className={`message ${msg.sender}`}>
                      <p>{msg.message}</p>
                      <span className="timestamp">{formatTime(new Date(msg.timestamp))}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* NLP Analysis */}
              {selectedLead.nlpAnalysis && (
                <div className="nlp-section">
                  <h4>AI Analysis</h4>
                  <div className="nlp-items">
                    <div className="nlp-item">
                      <label>Intent</label>
                      <p>{selectedLead.nlpAnalysis.intent}</p>
                    </div>
                    <div className="nlp-item">
                      <label>Sentiment</label>
                      <p>{selectedLead.nlpAnalysis.sentiment}</p>
                    </div>
                    {selectedLead.nlpAnalysis.keywords && (
                      <div className="nlp-item">
                        <label>Keywords</label>
                        <p>{selectedLead.nlpAnalysis.keywords.slice(0, 3).join(', ')}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="modal-actions">
                {!selectedLead.assignedAgentId && (
                  <button className="btn-primary">Assign Agent</button>
                )}
                <button className="btn-secondary">Send Message</button>
                <button className="btn-secondary">Schedule Viewing</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Helper Component
const StatCard = ({ icon, label, value, color }) => (
  <div className="stat-card">
    <div className="stat-icon" style={{ color }}>
      {icon}
    </div>
    <div className="stat-content">
      <p className="stat-label">{label}</p>
      <h3 className="stat-value">{value}</h3>
    </div>
  </div>
);

// Utility Functions
const getScoreColor = score => {
  if (score >= 70) return '#4caf50'; // Green for hot
  if (score >= 40) return '#ff9800'; // Orange for warm
  return '#ccc'; // Gray for cold
};

const formatTime = date => {
  const now = new Date();
  const diff = now - date;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);

  if (hours === 0 && minutes === 0) return 'Just now';
  if (hours === 0) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return date.toLocaleDateString();
};

export default WhatsAppLeadsDashboard;
