import React from 'react';
import * as S from '../shared';

export const MarketInsights: React.FC = () => {
  const insights = [
    { label: 'Avg. Price/sqft (Dubai)', value: 'AED 1,850', trend: '+5.2%', icon: '📈' },
    { label: 'Market Demand Index', value: '82/100', trend: '+3.1%', icon: '🔥' },
    { label: 'Avg Days on Market', value: '28 days', trend: '-4 days', icon: '⏱️' },
    { label: 'Transaction Volume (Q1)', value: '12,450', trend: '+18%', icon: '📊' },
  ];

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>📈 Market Insights</h2>
        <p style={S.headerSubtitle}>Dubai real estate market trends and data</p>
      </div>

      <div style={S.statsGrid}>
        {insights.map((i) => (
          <div key={i.label} style={S.statCard}>
            <span style={{ fontSize: '1.5rem' }}>{i.icon}</span>
            <span style={S.statValue}>{i.value}</span>
            <span style={S.statLabel}>{i.label}</span>
            <span style={S.badge('#16a34a', '#dcfce7')}>{i.trend}</span>
          </div>
        ))}
      </div>

      <div style={S.card}>
        <h3 style={S.cardTitle}>🏙️ Top Performing Areas</h3>
        <div style={S.tableWrapper}>
          <table style={S.table}>
            <thead>
              <tr>
                <th style={S.th}>Area</th>
                <th style={S.th}>Avg Price</th>
                <th style={S.th}>Demand</th>
                <th style={S.th}>YoY Change</th>
              </tr>
            </thead>
            <tbody>
              {[
                { area: 'Downtown Dubai', price: 'AED 2,800/sqft', demand: 'Very High', change: '+8.5%' },
                { area: 'Dubai Marina', price: 'AED 2,100/sqft', demand: 'High', change: '+6.2%' },
                { area: 'JBR', price: 'AED 2,450/sqft', demand: 'High', change: '+7.1%' },
                { area: 'Palm Jumeirah', price: 'AED 3,200/sqft', demand: 'Very High', change: '+12.3%' },
                { area: 'Business Bay', price: 'AED 1,650/sqft', demand: 'Medium', change: '+4.8%' },
              ].map((a) => (
                <tr key={a.area}>
                  <td style={{ ...S.td, fontWeight: 600 }}>{a.area}</td>
                  <td style={S.td}>{a.price}</td>
                  <td style={S.td}>
                    <span style={S.badge(
                      a.demand === 'Very High' ? '#EF4444' : '#d97706',
                      a.demand === 'Very High' ? '#fef2f2' : '#fffbeb',
                    )}>
                      {a.demand}
                    </span>
                  </td>
                  <td style={{ ...S.td, color: 'var(--accent-green, #16a34a)', fontWeight: 600 }}>{a.change}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

