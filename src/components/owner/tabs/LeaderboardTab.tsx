import React from 'react';

interface Agent {
  id: string;
  name: string;
  rank: number;
  deals: number;
  revenue: number;
  satisfaction: number;
  badge?: string;
}

interface LeaderboardTabProps {
  data?: {
    agents?: Agent[];
    period?: string;
  };
}

const MEDAL: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

/**
 * LeaderboardTab — Agent performance leaderboard for the owner dashboard
 */
const LeaderboardTab: React.FC<LeaderboardTabProps> = ({ data }) => {
  const agents = data?.agents ?? [];
  const period = data?.period ?? 'This Month';

  return (
    <div
      style={{
        padding: '1.5rem',
        fontFamily: 'Inter, sans-serif',
        color: '#fff',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '1.5rem',
        }}
      >
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#d4af37' }}>
          🏆 Agent Leaderboard
        </h2>
        <span
          style={{
            background: 'rgba(212,175,55,0.15)',
            color: '#d4af37',
            border: '1px solid rgba(212,175,55,0.3)',
            borderRadius: 20,
            padding: '4px 14px',
            fontSize: '0.85rem',
          }}
        >
          {period}
        </span>
      </div>

      {agents.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '3rem',
            color: 'rgba(255,255,255,0.4)',
            background: 'rgba(255,255,255,0.03)',
            borderRadius: 12,
            border: '1px dashed rgba(255,255,255,0.1)',
          }}
        >
          <p style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>🏆</p>
          <p>No leaderboard data available yet</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {agents
            .sort((a, b) => a.rank - b.rank)
            .map(agent => (
              <div
                key={agent.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  background: agent.rank <= 3 ? 'rgba(212,175,55,0.08)' : 'rgba(255,255,255,0.03)',
                  border:
                    agent.rank <= 3
                      ? '1px solid rgba(212,175,55,0.25)'
                      : '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12,
                  padding: '1rem 1.25rem',
                }}
              >
                <span style={{ fontSize: '1.5rem', minWidth: 36 }}>
                  {MEDAL[agent.rank] ?? `#${agent.rank}`}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, color: '#fff' }}>{agent.name}</div>
                  {agent.badge && (
                    <div style={{ fontSize: '0.75rem', color: '#d4af37', marginTop: 2 }}>
                      {agent.badge}
                    </div>
                  )}
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#d4af37', fontWeight: 700 }}>{agent.deals} Deals</div>
                  <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                    AED {agent.revenue.toLocaleString()}
                  </div>
                </div>
                <div
                  style={{
                    minWidth: 50,
                    textAlign: 'center',
                    background: 'rgba(34,197,94,0.1)',
                    color: '#22c55e',
                    borderRadius: 8,
                    padding: '4px 8px',
                    fontSize: '0.85rem',
                    fontWeight: 600,
                  }}
                >
                  {agent.satisfaction}%
                </div>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

export default LeaderboardTab;
