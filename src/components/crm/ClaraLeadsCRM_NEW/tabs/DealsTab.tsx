import React, { useState } from 'react';
import { useLeadsData } from '../hooks/useLeadsData';

export default function DealsTab() {
  const { leads, stats } = useLeadsData();

  // Group leads by stage
  const dealsByStage = {
    initial_contact: leads.filter(l => l.stage === 'initial_contact'),
    discovery: leads.filter(l => l.stage === 'discovery'),
    proposal: leads.filter(l => l.stage === 'proposal'),
    negotiation: leads.filter(l => l.stage === 'negotiation'),
    contract_review: leads.filter(l => l.stage === 'contract_review'),
    closed_won: leads.filter(l => l.stage === 'closed_won'),
    closed_lost: leads.filter(l => l.stage === 'closed_lost')
  };

  const stageLabels: Record<string, string> = {
    initial_contact: 'Initial Contact',
    discovery: 'Discovery',
    proposal: 'Proposal',
    negotiation: 'Negotiation',
    contract_review: 'Contract Review',
    closed_won: 'Closed Won',
    closed_lost: 'Closed Lost'
  };

  const stageTotals = Object.entries(dealsByStage).reduce<Record<string, number>>((acc, [stage, deals]) => {
    acc[stage] = deals.reduce((sum: number, d) => sum + d.value, 0);
    return acc;
  }, {});

  return (
    <div className="deals-section">
      {/* Header */}
      <div className="deals-header">
        <div>
          <h3 style={{ margin: 0, color: 'var(--color-text-primary)' }}>
            Sales Pipeline
          </h3>
          <p style={{
            fontSize: '12px',
            color: 'var(--color-text-secondary)',
            margin: '4px 0 0 0'
          }}>
            {leads.length} deals • ${(stats.totalValue / 1000).toFixed(0)}K total value
          </p>
        </div>
      </div>

      {/* Statistics */}
      <div className="deals-stats">
        <div className="stat-card">
          <div className="stat-label">Total Pipeline</div>
          <p className="stat-value">${(stats.totalValue / 1000).toFixed(0)}K</p>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. Win Size</div>
          <p className="stat-value">
            ${(stats.totalValue / (stats.qualifiedLeads || 1) / 1000).toFixed(0)}K
          </p>
        </div>
        <div className="stat-card">
          <div className="stat-label">Forecast</div>
          <p className="stat-value">${(stats.totalValue * 0.76 / 1000).toFixed(0)}K</p>
        </div>
        <div className="stat-card">
          <div className="stat-label">Avg. Probability</div>
          <p className="stat-value">{stats.avgProbability}%</p>
        </div>
      </div>

      {/* Pipeline Kanban */}
      <div className="deals-pipeline">
        {Object.entries(dealsByStage).map(([stage, deals]) => (
          <div key={stage} className="deal-column">
            <div className="deal-column-title">
              {stageLabels[stage]}
              <div style={{
                fontSize: '12px',
                color: 'var(--color-text-secondary)',
                marginTop: '4px'
              }}>
                {deals.length} deal{deals.length !== 1 ? 's' : ''} • ${(stageTotals[stage] / 1000).toFixed(0)}K
              </div>
            </div>

            {deals.length > 0 ? (
              deals.map(deal => (
                <div key={deal.id} className="deal-item">
                  <div className="deal-item-name">{deal.name}</div>
                  <div className="deal-item-value">${(deal.value / 1000).toFixed(0)}K</div>
                  <div className="deal-item-date">
                    Probability: {deal.probability}%
                  </div>
                </div>
              ))
            ) : (
              <div style={{
                padding: '20px',
                textAlign: 'center',
                color: 'var(--color-text-secondary)',
                fontSize: '12px'
              }}>
                No deals
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Info */}
      <div style={{
        padding: '16px',
        background: 'var(--color-background-secondary)',
        border: '1px solid var(--color-border-default)',
        borderRadius: 'var(--border-radius-md)',
        marginTop: '16px'
      }}>
        <p style={{ margin: 0, fontSize: '13px', color: 'var(--color-text-secondary)' }}>
          💡 Drag deals between columns to update their stage. Click on a deal to view details.
        </p>
      </div>
    </div>
  );
}
