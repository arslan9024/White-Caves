import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuthContext } from './contexts/AuthContext';

/**
 * DashboardView.jsx — High-Density Unified Command Center
 *
 * Row 1: Target Progress Meter + Onboarding Runway Tracker
 * Row 2: Active Leads Feed + Live Company Standings
 * Row 3: AI Command Center Quick-Action (modal trigger)
 */

// ─── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_LEADS = [
  { id: 'L001', name: 'Mohammed Al-Habtoor', source: 'Bayut.com', sla_mins: 3, stage: 'Contacted', phone: '+971-50-XXX-1234' },
  { id: 'L002', name: 'Sarah Chen', source: 'Website', sla_mins: 8, stage: 'Qualified', phone: '+971-55-XXX-5678' },
  { id: 'L003', name: 'James Whitmore', source: 'Referral', sla_mins: 14, stage: 'New', phone: '+44-7XX-XXX-9012' },
  { id: 'L004', name: 'Priya Nair', source: 'Property Finder', sla_mins: 1, stage: 'Viewing Set', phone: '+971-52-XXX-3456' },
  { id: 'L005', name: 'Dmitry Volkov', source: 'Instagram', sla_mins: 22, stage: 'Follow-up', phone: '+7-9XX-XXX-7890' },
];

const MOCK_LEADERBOARD_SALES = [
  { rank: 1, name: 'Arslan Malik', dept: 'Admin', initials: 'AM', points: 4820, change: 'up' },
  { rank: 2, name: 'Yusuf Al-Fahim', dept: 'Sales', initials: 'YA', points: 4215, change: 'up' },
  { rank: 3, name: 'Nadia Hassan', dept: 'Sales', initials: 'NH', points: 3890, change: 'down' },
  { rank: 4, name: 'Fatima Al-Rashid', dept: 'Sales', initials: 'FR', points: 3120, change: 'up' },
  { rank: 5, name: 'Omar Khalid', dept: 'Sales', initials: 'OK', points: 2870, change: 'down' },
];

const MOCK_LEADERBOARD_LEASING = [
  { rank: 1, name: 'Layla Saeed', dept: 'Leasing', initials: 'LS', points: 3950, change: 'up' },
  { rank: 2, name: 'Ahmed Bin Rashid', dept: 'Leasing', initials: 'AB', points: 3610, change: 'down' },
  { rank: 3, name: 'Reem Al-Maktoum', dept: 'Leasing', initials: 'RM', points: 3200, change: 'up' },
  { rank: 4, name: 'Daniel Torres', dept: 'Leasing', initials: 'DT', points: 2980, change: 'up' },
  { rank: 5, name: 'Hana Yamamoto', dept: 'Leasing', initials: 'HY', points: 2540, change: 'down' },
];

// ─── Helper: Tier Badge ─────────────────────────────────────────────────────
function getTierInfo(tier) {
  switch (tier) {
    case 'Platinum': return { className: 'ws-badge-platinum', label: '💎 Platinum' };
    case 'Gold':     return { className: 'ws-badge-gold', label: '🥇 Gold' };
    case 'Silver':   return { className: 'ws-badge-silver', label: '🥈 Silver' };
    default:         return { className: 'ws-badge-executive', label: '🟢 Executive' };
  }
}

// ─── Helper: SLA Badge ──────────────────────────────────────────────────────
function getSLAInfo(mins) {
  if (mins <= 5)  return { className: 'ws-sla-critical', label: `${mins}m ⚠️` };
  if (mins <= 12) return { className: 'ws-sla-warning', label: `${mins}m` };
  return { className: 'ws-sla-ok', label: `${mins}m ✓` };
}

// ─── Helper: Runway Calculation ─────────────────────────────────────────────
function calculateRunway(onboardingDate) {
  if (!onboardingDate) return null;
  const start = new Date(onboardingDate);
  const now = new Date();
  const elapsed = Math.floor((now - start) / (1000 * 60 * 60 * 24));
  const total = 180;
  const remaining = Math.max(0, total - elapsed);
  const percentage = ((total - remaining) / total) * 100;

  let urgency = 'ws-safe';
  if (remaining <= 30) urgency = 'ws-urgent';
  else if (remaining <= 60) urgency = 'ws-warning';

  let barColor = 'var(--ws-emerald)';
  if (remaining <= 30) barColor = 'var(--ws-danger)';
  else if (remaining <= 60) barColor = 'var(--ws-warning)';

  return { remaining, total, elapsed, percentage, urgency, barColor, startDate: onboardingDate };
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD COMPONENT
// ═══════════════════════════════════════════════════════════════════════════
export default function DashboardView() {
  const { user } = useAuthContext();
  const [lbTab, setLbTab] = useState('sales');
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');

  const perf = user?.performance;
  const tierInfo = getTierInfo(perf?.tier);
  const runway = calculateRunway(user?.onboarding_date);

  // GWC circular progress
  const gwcPercent = perf ? Math.min(100, (perf.current_gwc / perf.target_gwc) * 100) : 0;
  const circumference = 2 * Math.PI * 46; // r=46
  const strokeDashoffset = circumference - (gwcPercent / 100) * circumference;

  // Leaderboard data
  const leaderboardData = lbTab === 'sales' ? MOCK_LEADERBOARD_SALES : MOCK_LEADERBOARD_LEASING;

  // Live SLA countdown simulation
  const [leads, setLeads] = useState(MOCK_LEADS);

  useEffect(() => {
    const timer = setInterval(() => {
      setLeads((prev) =>
        prev.map((lead) => ({
          ...lead,
          sla_mins: Math.max(0, lead.sla_mins - 1),
        }))
      );
    }, 60000); // tick every 60s
    return () => clearInterval(timer);
  }, []);

  const handleAiExecute = useCallback(() => {
    if (aiPrompt.trim()) {
      // In production this would dispatch to an AI ingestion pipeline
      
      setAiPrompt('');
      setAiModalOpen(false);
    }
  }, [aiPrompt]);

  // Close modal on Escape
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape' && aiModalOpen) {
        setAiModalOpen(false);
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [aiModalOpen]);

  return (
    <div className="ws-dashboard">
      {/* Dashboard Title */}
      <div>
        <div className="ws-dashboard-title">
          Welcome back, {user?.name?.split(' ')[0]} 👋
        </div>
        <div className="ws-dashboard-subtitle">
          {new Date().toLocaleDateString('en-AE', {
            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
          })}
          {' · '}
          {user?.department_label}
        </div>
      </div>

      {/* ═══ ROW 1: Performance Cards ═══ */}
      <div className="ws-row-1">
        {/* Card A: Target Progress Meter */}
        <div className="ws-card">
          <div className="ws-card-header">
            <span className="ws-card-title">Monthly GWC Target</span>
            <span className={`ws-card-badge ${tierInfo.className}`}>
              {tierInfo.label}
            </span>
          </div>

          <div className="ws-progress-ring-container">
            <div className="ws-progress-ring">
              <svg viewBox="0 0 110 110">
                <circle
                  className="ws-progress-ring-bg"
                  cx="55" cy="55" r="46"
                />
                <circle
                  className="ws-progress-ring-fill"
                  cx="55" cy="55" r="46"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                />
              </svg>
              <div className="ws-progress-ring-label">
                <span className="ws-progress-ring-value">
                  {Math.round(gwcPercent)}%
                </span>
                <span className="ws-progress-ring-unit">of target</span>
              </div>
            </div>

            <div className="ws-progress-stats">
              <div className="ws-progress-stat">
                <span className="ws-progress-stat-label">Current GWC</span>
                <span className="ws-progress-stat-value">
                  AED {perf?.current_gwc?.toLocaleString()}
                </span>
              </div>
              <div className="ws-progress-stat">
                <span className="ws-progress-stat-label">Target GWC</span>
                <span className="ws-progress-stat-value">
                  AED {perf?.target_gwc?.toLocaleString()}
                </span>
              </div>
              <div className="ws-progress-stat">
                <span className="ws-progress-stat-label">Deals Closed</span>
                <span className="ws-progress-stat-value">{perf?.deals_closed}</span>
              </div>
              <div className="ws-progress-stat">
                <span className="ws-progress-stat-label">Pipeline</span>
                <span className="ws-progress-stat-value">{perf?.deals_pipeline} active</span>
              </div>
              <div className="ws-progress-stat">
                <span className="ws-progress-stat-label">Conversion</span>
                <span className="ws-progress-stat-value">{perf?.conversion_rate}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card B: Onboarding Runway Tracker */}
        <div className="ws-card">
          <div className="ws-card-header">
            <span className="ws-card-title">Onboarding Runway</span>
            <span className="ws-card-badge ws-badge-gold">
              {user?.promo_split ? `${user.promo_split}% Split` : 'Standard'}
            </span>
          </div>

          {runway ? (
            <div className="ws-runway">
              <div className="ws-runway-counter">
                <span className={`ws-runway-days ${runway.urgency}`}>
                  {runway.remaining}
                </span>
                <span className="ws-runway-label-text">days remaining</span>
              </div>

              <div className="ws-runway-bar-container">
                <div
                  className="ws-runway-bar-fill"
                  style={{
                    width: `${runway.percentage}%`,
                    background: runway.barColor,
                  }}
                />
              </div>

              <div className="ws-runway-meta">
                <span>Started: {new Date(runway.startDate).toLocaleDateString('en-AE', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                <span>Day {runway.elapsed} of {runway.total}</span>
              </div>

              <div className="ws-runway-promo">
                <span className="ws-runway-promo-icon">💰</span>
                <span className="ws-runway-promo-text">
                  High-tier {user?.promo_split || 50}% commission split active during onboarding window
                </span>
              </div>
            </div>
          ) : (
            <div className="ws-runway">
              <div className="ws-runway-counter">
                <span className="ws-runway-days ws-safe">∞</span>
                <span className="ws-runway-label-text">No onboarding window — Standard split active</span>
              </div>
              <div className="ws-runway-promo">
                <span className="ws-runway-promo-icon">⭐</span>
                <span className="ws-runway-promo-text">
                  You have graduated from the onboarding program. Standard commission tiers apply.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ═══ ROW 2: Data Pipelines ═══ */}
      <div className="ws-row-2">
        {/* Left: Active Leads Feed */}
        <div className="ws-card">
          <div className="ws-card-header">
            <span className="ws-card-title">Active Leads Feed</span>
            <span className="ws-card-badge ws-badge-executive">
              {leads.length} Active
            </span>
          </div>

          <table className="ws-leads-table">
            <thead>
              <tr>
                <th>Lead</th>
                <th>SLA</th>
                <th>Stage</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead) => {
                const sla = getSLAInfo(lead.sla_mins);
                return (
                  <tr key={lead.id}>
                    <td>
                      <div className="ws-lead-name">{lead.name}</div>
                      <div className="ws-lead-source">{lead.source}</div>
                    </td>
                    <td>
                      <span className={`ws-sla-badge ${sla.className}`}>
                        {sla.label}
                      </span>
                    </td>
                    <td>
                      <span className="ws-pipeline-badge">{lead.stage}</span>
                    </td>
                    <td>
                      <button className="ws-contact-btn">Call</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Right: Live Company Standings */}
        <div className="ws-card">
          <div className="ws-card-header">
            <span className="ws-card-title">Company Standings</span>
          </div>

          <div className="ws-lb-tabs">
            <button
              className={`ws-lb-tab ${lbTab === 'sales' ? 'active' : ''}`}
              onClick={() => setLbTab('sales')}
            >
              Sales
            </button>
            <button
              className={`ws-lb-tab ${lbTab === 'leasing' ? 'active' : ''}`}
              onClick={() => setLbTab('leasing')}
            >
              Leasing
            </button>
          </div>

          <div className="ws-leaderboard-list">
            {leaderboardData.map((entry) => (
              <div key={entry.rank} className="ws-leaderboard-entry">
                <span className="ws-lb-rank">{entry.rank}</span>
                <div className="ws-lb-avatar">{entry.initials}</div>
                <div className="ws-lb-info">
                  <div className="ws-lb-name">{entry.name}</div>
                  <div className="ws-lb-dept">{entry.dept}</div>
                </div>
                <span className="ws-lb-score">{entry.points.toLocaleString()}</span>
                <span className={`ws-lb-change ${entry.change}`}>
                  {entry.change === 'up' ? '▲' : '▼'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══ ROW 3: AI Quick-Action ═══ */}
      <div className="ws-row-3">
        <div
          className="ws-ai-trigger"
          onClick={() => setAiModalOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && setAiModalOpen(true)}
        >
          <div className="ws-ai-trigger-left">
            <div className="ws-ai-trigger-icon">🧠</div>
            <div className="ws-ai-trigger-text">
              <h3>AI Command Center</h3>
              <p>Run queries through the intelligence ingestion pipeline</p>
            </div>
          </div>
          <div className="ws-ai-trigger-shortcut">⌘ + K</div>
        </div>
      </div>

      {/* ═══ AI Command Center Modal ═══ */}
      {aiModalOpen && (
        <div
          className="ws-modal-overlay"
          onClick={(e) => {
            if (e.target === e.currentTarget) setAiModalOpen(false);
          }}
        >
          <div className="ws-modal" role="dialog" aria-label="AI Command Center">
            <div className="ws-modal-header">
              <h2>
                <span>🧠</span>
                AI Command Center
              </h2>
              <button
                className="ws-modal-close"
                onClick={() => setAiModalOpen(false)}
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="ws-modal-body">
              <textarea
                className="ws-ai-textarea"
                placeholder="Enter your query or paste unformatted text for AI ingestion processing…"
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                autoFocus
              />
            </div>

            <div className="ws-modal-footer">
              <span className="ws-modal-footer-hint">
                Press Ctrl+Enter to execute · Esc to close
              </span>
              <button
                className="ws-ai-execute-btn"
                onClick={handleAiExecute}
                disabled={!aiPrompt.trim()}
              >
                <span>⚡</span>
                Execute
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
