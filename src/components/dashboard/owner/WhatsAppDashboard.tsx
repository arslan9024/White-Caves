import React from 'react';
import * as S from '../shared';

export const WhatsAppDashboard: React.FC = () => {
  const bots = [
    {
      name: 'Nadia',
      role: 'WhatsApp Business API — Lead Capture & CRM',
      status: 'online',
      messages24h: 142,
      leadsGenerated: 12,
      icon: '💬',
    },
    {
      name: 'Nina',
      role: 'NLP/Intent Engine — Smart Routing',
      status: 'online',
      messages24h: 89,
      leadsGenerated: 0,
      icon: '🧠',
    },
    {
      name: 'Linda',
      role: 'WhatsApp LocalAuth — Account Recovery',
      status: 'standby',
      messages24h: 5,
      leadsGenerated: 0,
      icon: '🔐',
    },
  ];

  return (
    <div style={S.tabContainer}>
      <div style={S.pageHeader}>
        <h2 style={S.headerTitle}>💬 WhatsApp Integration</h2>
        <p style={S.headerSubtitle}>AI assistant status and messaging metrics</p>
      </div>

      <div style={S.statsGrid}>
        <div style={S.statCard}>
          <span style={S.statValue}>{bots.filter((b) => b.status === 'online').length}</span>
          <span style={S.statLabel}>🟢 Online</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{bots.reduce((s, b) => s + b.messages24h, 0)}</span>
          <span style={S.statLabel}>💬 Messages (24h)</span>
        </div>
        <div style={S.statCard}>
          <span style={S.statValue}>{bots.reduce((s, b) => s + b.leadsGenerated, 0)}</span>
          <span style={S.statLabel}>🎯 Leads Generated</span>
        </div>
      </div>

      <div style={S.listGrid}>
        {bots.map((bot) => (
          <div key={bot.name} style={S.card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <div>
                <h3 style={{ margin: 0 }}>{bot.icon} {bot.name}</h3>
                <p style={{ ...S.headerSubtitle, margin: '0.15rem 0 0 0' }}>{bot.role}</p>
              </div>
              <span style={S.badge(
                bot.status === 'online' ? '#16a34a' : '#d97706',
                bot.status === 'online' ? '#dcfce7' : '#fffbeb',
              )}>{S.formatStatus(bot.status)}</span>
            </div>
            <div style={{ display: 'flex', gap: '1rem', fontSize: '0.85rem', color: 'var(--text-secondary, #6b7280)' }}>
              <span>💬 {bot.messages24h} messages</span>
              <span>🎯 {bot.leadsGenerated} leads</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

