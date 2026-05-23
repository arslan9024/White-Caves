import React, { useState, useEffect, useRef } from 'react';
import { createLogger } from '../../utils/logger';
import { authFetch } from '../../utils/authFetch';
import type { CRMModuleProps } from './types';

const log = createLogger('LeadScoring');

interface ScoredLead {
  id: string;
  name: string;
  score: number;
  budget: string;
  interest: string;
  source: string;
  assignedAgent?: string;
  [key: string]: unknown;
}

interface RoutingRule {
  propertyType: string;
  budget: string;
  agent: string;
  [key: string]: unknown;
}

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

export default function LeadScoringModule({ role, user, data }: CRMModuleProps) {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [leads, setLeads] = useState<ScoredLead[]>([]);
  const [routingRules, setRoutingRules] = useState<RoutingRule[]>([]);
  const [selectedLead, setSelectedLead] = useState<ScoredLead | null>(null);
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    const fetchLeads = async () => {
      try {
        const response = await authFetch('/api/leads/scored');
        if (!isMountedRef.current) return;
        if (response.ok) {
          const data = await response.json();
          setLeads(data.leads || []);
        } else {
          log.warn('Lead scoring API returned', response.status, '— showing empty state');
          setLeads([]);
        }
      } catch (error) {
        if (isMountedRef.current) log.error('Failed to fetch leads:', error);
      }
    };

    const fetchRoutingRules = async () => {
      try {
        const response = await authFetch('/api/leads/routing-rules');
        if (!isMountedRef.current) return;
        if (response.ok) {
          const data = await response.json();
          setRoutingRules(data.rules || []);
        }
      } catch (error) {
        if (isMountedRef.current) log.error('Failed to fetch routing rules:', error);
      }
    };

    fetchLeads();
    fetchRoutingRules();

    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const getScoreColor = (score: number): string => {
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
            <div key={`rule-${rule.propertyType}-${rule.budget}-${rule.agent}`} className="rule-card">
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
