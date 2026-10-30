import React from 'react';
import { Bot } from './types';

export interface RegisteredBotsListProps {
  bots: Bot[];
  selectedBotId: string;
  onSelectBot: (id: string) => void;
}

export const RegisteredBotsList: React.FC<RegisteredBotsListProps> = ({
  bots,
  selectedBotId,
  onSelectBot,
}) => {
  return (
    <div>
      <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
        🤖 Registered Multi-Device WhatsApp Sessions ({bots.length})
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {bots.map((bot: Bot) => (
          <div
            key={bot.id}
            onClick={() => onSelectBot(bot.id)}
            style={{
              background: selectedBotId === bot.id ? 'rgba(6, 182, 212, 0.08)' : '#FFFFFF',
              border: selectedBotId === bot.id ? '2px solid #06B6D4' : '1px solid #E2E8F0',
              borderRadius: '14px',
              padding: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: selectedBotId === bot.id ? '0 4px 16px rgba(6, 182, 212, 0.15)' : 'none',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--color-1e293b, #1E293B)' }}>{bot.name}</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '6px',
                  background: bot.status === 'connected' ? 'rgba(16, 185, 129, 0.12)' : 'rgba(245, 158, 11, 0.12)',
                  color: bot.status === 'connected' ? '#10B981' : '#F59E0B',
                }}
              >
                {bot.status.toUpperCase()}
              </span>
            </div>

            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--color-06b6d4, #06B6D4)', display: 'block', marginBottom: '0.5rem' }}>
              {bot.number}
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary, #64748B)' }}>
              <span>Messages: <strong>{bot.messagesProcessed.toLocaleString()}</strong></span>
              <span>Response Rate: <strong>{bot.responseRate}%</strong></span>
              <span>Avg Speed: <strong>{bot.avgResponseTime}</strong></span>
              <span>Uptime: <strong>{bot.uptime}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

