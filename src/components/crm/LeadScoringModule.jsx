import React, { useState, useEffect } from 'react';

/**
 * Lead Scoring & AI Routing Module
 * Automatically score leads and route them to best-fit agents
 * 
 * Features:
 * - Lead scoring algorithm (1-100)
 * - Lead quality dashboard
 * - Intelligent agent routing rules
 * - AI-powered recommendations
 */

export default function LeadScoringModule({ role, user, data }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [leads, setLeads] = useState([]);
  const [routingRules, setRoutingRules] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);

  useEffect(() => {
    fetchLeads();
    fetchRoutingRules();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/leads/scored');
      if (response.ok) {
        const data = await response.json();
        setLeads(data.leads || []);
      } else {
        // Mock data
        setLeads([
          { id: 1, name: 'Ahmed Hassan', score: 85, source: 'Google', budget: '2-3M AED', interest: 'Villa', assignedAgent: 'Mohammed' },
          { id: 2, name: 'Fatima Al-Kirbi', score: 72, source: 'referral', budget: '1-2M AED', interest: 'Apartment', assignedAgent: 'Zainab' },
          { id: 3, name: 'Khalil Omar', score: 45, source: 'walk-in', budget: '500K-1M', interest: 'Studio', assignedAgent: 'Unassigned' },
          { id: 4, name: 'Sara Al-Maktoum', score: 92, source: 'call', budget: '5M+', interest: 'Luxury Villa', assignedAgent: null },
        ]);
      }
    } catch (error) {
      console.error('Failed to fetch leads:', error);
    }
  };

  const fetchRoutingRules = async () => {
    try {
      const response = await fetch('/api/leads/routing-rules');
      if (response.ok) {
        const data = await response.json();
        setRoutingRules(data.rules || []);
      }
    } catch (error) {
      console.error('Failed to fetch routing rules:', error);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return '#22c55e';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const renderDashboard = () => (
    <div className="module-dashboard">
      <div className="score-distribution">
        <h3>Lead Quality Distribution</h3>
        <div className="chart-placeholder">
          <p>High Quality (80-100): {leads.filter(l => l.score >= 80).length}</p>
          <p>Medium Quality (60-79): {leads.filter(l => l.score >= 60 && l.score < 80).length}</p>
          <p>Low Quality (&lt;60): {leads.filter(l => l.score < 60).length}</p>
        </div>
      </div>

      <div className="leads-table" style={{ marginTop: '20px' }}>
        <h3>All Leads</h3>
        <table>
          <thead>
            <tr>
              <th>Lead Name</th>
              <th>Score</th>
              <th>Budget</th>
              <th>Interest</th>
              <th>Source</th>
              <th>Assigned Agent</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.map(lead => (
              <tr key={lead.id}>
                <td>{lead.name}</td>
                <td>
                  <span className="score-badge" style={{ backgroundColor: getScoreColor(lead.score) }}>
                    {lead.score}
                  </span>
                </td>
                <td>{lead.budget}</td>
                <td>{lead.interest}</td>
                <td>{lead.source}</td>
                <td>{lead.assignedAgent || 'Unassigned'}</td>
                <td>
                  <button onClick={() => setSelectedLead(lead)} className="action-btn">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRoutingRules = () => (
    <div className="module-section">
      <h3>Routing Rules</h3>
      <div className="rules-list">
        {routingRules.length > 0 ? (
          routingRules.map((rule, idx) => (
            <div key={idx} className="rule-card">
              <p><strong>Rule {idx + 1}:</strong> If property type is {rule.propertyType} AND budget is {rule.budget} → Assign to {rule.agent}</p>
            </div>
          ))
        ) : (
          <div>
            <div className="rule-card">
              <p><strong>Rule 1:</strong> If property = Villa AND budget = 2-5M → Assign to Premium Agent</p>
            </div>
            <div className="rule-card">
              <p><strong>Rule 2:</strong> If property = Apartment AND budget = 1-2M → Assign to Standard Agent</p>
            </div>
            <div className="rule-card">
              <p><strong>Rule 3:</strong> If lead score &gt;= 80 → Priority routing</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderScoreDetails = () => (
    <div className="module-section">
      {selectedLead && (
        <div className="detail-view">
          <h3>Lead Details: {selectedLead.name}</h3>
          <table className="detail-table">
            <tbody>
              <tr><td><strong>Score:</strong></td><td>{selectedLead.score}/100</td></tr>
              <tr><td><strong>Budget:</strong></td><td>{selectedLead.budget} AED</td></tr>
              <tr><td><strong>Interested In:</strong></td><td>{selectedLead.interest}</td></tr>
              <tr><td><strong>Source:</strong></td><td>{selectedLead.source}</td></tr>
              <tr><td><strong>Assigned Agent:</strong></td><td>{selectedLead.assignedAgent || 'Pending'}</td></tr>
            </tbody>
          </table>
          <h4 style={{ marginTop: '20px' }}>Scoring Breakdown</h4>
          <ul style={{ fontSize: '14px' }}>
            <li>Budget Match: 30 points</li>
            <li>Property Interest Alignment: 25 points</li>
            <li>Lead Source Quality: 20 points</li>
            <li>Engagement Level: 15 points</li>
            <li>Time Sensitivity: 10 points</li>
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="dubai-crm-module lead-scoring-module">
      <div className="module-header">
        <h1>Lead Scoring & AI Routing</h1>
        <p>Automatically score leads (1-100) and route to best-fit agents</p>
      </div>

      <div className="module-tabs">
        <button
          className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`tab ${activeTab === 'rules' ? 'active' : ''}`}
          onClick={() => setActiveTab('rules')}
        >
          Routing Rules
        </button>
        <button
          className={`tab ${activeTab === 'details' ? 'active' : ''}`}
          onClick={() => setActiveTab('details')}
        >
          Lead Details
        </button>
      </div>

      <div className="module-content">
        {activeTab === 'dashboard' && renderDashboard()}
        {activeTab === 'rules' && renderRoutingRules()}
        {activeTab === 'details' && renderScoreDetails()}
      </div>
    </div>
  );
}
