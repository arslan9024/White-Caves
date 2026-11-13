import React from 'react';
import type { Bot } from './types';

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
      <h4 style={{ margin: '0 0 0.85rem 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
        🤖 Registered Multi-Device WhatsApp Sessions ({bots.length})
      </h4>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
        {bots.map((bot: Bot) => (
          <button
            key={bot.id}
            type="button"
            aria-pressed={selectedBotId === bot.id}
            onClick={() => onSelectBot(bot.id)}
            style={{
              background: selectedBotId === bot.id ? 'var(--bg-secondary)' : 'var(--bg-primary)',
              border: selectedBotId === bot.id ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
              borderRadius: '14px',
              padding: '1.25rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: selectedBotId === bot.id ? 'var(--shadow-md)' : 'none',
              color: 'var(--text-primary)',
              font: 'inherit',
              textAlign: 'left',
              width: '100%',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{bot.name}</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '6px',
                  background: bot.status === 'connected' ? 'var(--color-primary-light)' : 'var(--bg-secondary)',
                  color: bot.status === 'connected' ? 'var(--primary-color)' : 'var(--text-secondary)',
                }}
              >
                {bot.status.toUpperCase()}
              </span>
            </div>

            <span style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--primary-color)', display: 'block', marginBottom: '0.5rem' }}>
              {bot.number}
            </span>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
              <span>Messages: <strong>{bot.messagesProcessed.toLocaleString()}</strong></span>
              <span>Response Rate: <strong>{bot.responseRate}%</strong></span>
              <span>Avg Speed: <strong>{bot.avgResponseTime}</strong></span>
              <span>Uptime: <strong>{bot.uptime}</strong></span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
