import React from 'react';
import { useLeadsData } from '../hooks/useLeadsData';
import { useLeadsInsights } from '../hooks/useLeadsInsights';

export default function InsightsTab() {
  const { leads, stats } = useLeadsData();
  const { qualifiedPercentage, avgDealSize, leadsByType, leadsBySize } = useLeadsInsights(leads, stats);

  // Calculate insights
  const winRate = 68; // Demo value
  const forecastAccuracy = 92; // Demo value

  return (
    <div className="insights-section">
      {/* Header */}
      <div style={{ marginBottom: '20px' }}>
        <h3 style={{ margin: 0, color: 'var(--color-text-primary)', marginBottom: '8px' }}>
          Analytics & Insights
        </h3>
        <p style={{
          fontSize: '12px',
          color: 'var(--color-text-secondary)',
          margin: 0
        }}>
          Key metrics and performance indicators
        </p>
      </div>

      {/* Main KPIs */}
      <div className="insights-grid">
        <div className="insight-card">
          <div className="insight-title">Total Pipeline Value</div>
          <div className="insight-value">${(stats.totalValue / 1000).toFixed(0)}K</div>
          <div className="insight-change positive">
            ↑ 12% from last month
          </div>
          <div className="insight-detail">
            {leads.length} active opportunities
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-title">Qualified Leads</div>
          <div className="insight-value">{stats.qualifiedLeads}</div>
          <div className="insight-change positive">
            {qualifiedPercentage}% of total
          </div>
          <div className="insight-detail">
            {leads.length - stats.qualifiedLeads} in progress
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-title">Average Deal Size</div>
          <div className="insight-value">${(avgDealSize / 1000).toFixed(0)}K</div>
          <div className="insight-change positive">
            ↑ 8% from baseline
          </div>
          <div className="insight-detail">
            Across {stats.qualifiedLeads} deals
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-title">Win Rate</div>
          <div className="insight-value">{winRate}%</div>
          <div className="insight-change positive">
            ↑ 5% trend
          </div>
          <div className="insight-detail">
            Industry average: 42%
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-title">Sales Cycle</div>
          <div className="insight-value">34 days</div>
          <div className="insight-change positive">
            ↓ 12% faster
          </div>
          <div className="insight-detail">
            vs. previous year
          </div>
        </div>

        <div className="insight-card">
          <div className="insight-title">Forecast Accuracy</div>
          <div className="insight-value">{forecastAccuracy}%</div>
          <div className="insight-change positive">
            ↑ 3% improvement
          </div>
          <div className="insight-detail">
            Last 12 months
          </div>
        </div>
      </div>

      {/* Breakdown by Type */}
      <div style={{ marginTop: '20px' }}>
        <h4 style={{ color: 'var(--color-text-primary)', marginBottom: '12px' }}>
          Leads by Company Type
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px'
        }}>
          {Object.entries(leadsByType).map(([type, count]) => (
            <div key={type} style={{
              padding: '12px',
              background: 'var(--color-background-secondary)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--border-radius-md)'
            }}>
              <div style={{
                fontSize: '12px',
                color: 'var(--color-text-secondary)',
                marginBottom: '8px',
                textTransform: 'capitalize'
              }}>
                {type}
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--color-primary)',
                marginBottom: '6px'
              }}>
                {count}
              </div>
              <div style={{
                width: '100%',
                height: '4px',
                background: 'var(--color-background-tertiary)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(count / leads.length) * 100}%`,
                  height: '100%',
                  background: 'var(--color-primary)',
                  transition: 'width 300ms ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Breakdown by Size */}
      <div style={{ marginTop: '20px' }}>
        <h4 style={{ color: 'var(--color-text-primary)', marginBottom: '12px' }}>
          Leads by Company Size
        </h4>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px'
        }}>
          {Object.entries(leadsBySize).map(([size, count]) => (
            <div key={size} style={{
              padding: '12px',
              background: 'var(--color-background-secondary)',
              border: '1px solid var(--color-border-default)',
              borderRadius: 'var(--border-radius-md)'
            }}>
              <div style={{
                fontSize: '12px',
                color: 'var(--color-text-secondary)',
                marginBottom: '8px',
                textTransform: 'capitalize'
              }}>
                {size}
              </div>
              <div style={{
                fontSize: '20px',
                fontWeight: '700',
                color: 'var(--color-info)',
                marginBottom: '6px'
              }}>
                {count}
              </div>
              <div style={{
                width: '100%',
                height: '4px',
                background: 'var(--color-background-tertiary)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${(count / leads.length) * 100}%`,
                  height: '100%',
                  background: 'var(--color-info)',
                  transition: 'width 300ms ease'
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pipeline Distribution */}
      <div style={{ marginTop: '20px' }}>
        <h4 style={{ color: 'var(--color-text-primary)', marginBottom: '12px' }}>
          Pipeline by Stage
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(stats.stageCounts).map(([stage, count]) => {
            const stageValue = leads
              .filter(l => l.stage === stage)
              .reduce((sum, l) => sum + l.value, 0);
            
            return (
              <div key={stage} style={{
                padding: '12px',
                background: 'var(--color-background-secondary)',
                border: '1px solid var(--color-border-default)',
                borderRadius: 'var(--border-radius-md)'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  marginBottom: '8px'
                }}>
                  <div style={{
                    fontSize: '13px',
                    fontWeight: '500',
                    color: 'var(--color-text-primary)',
                    textTransform: 'capitalize'
                  }}>
                    {stage.replace(/_/g, ' ')}
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--color-primary)' }}>
                    {count} • ${(stageValue / 1000).toFixed(0)}K
                  </div>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'var(--color-background-tertiary)',
                  borderRadius: '3px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${(stageValue / stats.totalValue) * 100}%`,
                    height: '100%',
                    background: 'var(--color-primary)',
                    transition: 'width 300ms ease'
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Recommendations */}
      <div style={{
        padding: '16px',
        background: 'var(--color-success-light)',
        color: 'var(--color-success)',
        borderRadius: 'var(--border-radius-md)',
        marginTop: '20px'
      }}>
        <p style={{ margin: '0 0 8px 0', fontSize: '13px', fontWeight: '600' }}>
          ✨ Recommendations
        </p>
        <p style={{ margin: 0, fontSize: '13px' }}>
          Your pipeline is performing {winRate}% above industry average. Focus on nurturing early-stage deals to improve conversion velocity.
        </p>
      </div>
    </div>
  );
}
