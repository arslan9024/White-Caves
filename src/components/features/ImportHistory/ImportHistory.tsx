/**
 * @component ImportHistory
 * @agent @Mira (Lead Full-Stack Developer)
 * @milestone MILESTONE-IMPORT
 *
 * View and manage past property data import sessions.
 * Stub component — full implementation in next phase.
 */

import React from 'react';
import type { FeatureComponentProps } from '../../layout/DashboardWorkspace/FeatureRegistry';

interface ImportSession {
  id: string;
  fileName: string;
  importedAt: string;
  recordCount: number;
  status: 'success' | 'failed' | 'partial';
}

type ImportHistoryProps = FeatureComponentProps & {
  sessions?: ImportSession[];
  onRetry?: (sessionId: string) => void;
  onDelete?: (sessionId: string) => void;
};

export const ImportHistory: React.FC<ImportHistoryProps> = ({
  sessions = [],
  onRetry,
  onDelete,
}) => {
  return (
    <div
      role="region"
      aria-label="Import History"
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1rem',
        padding: '1.5rem',
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(196,30,58,0.2)',
        borderRadius: '12px',
        color: '#FAFAFA',
        minHeight: '400px',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.5rem' }} aria-hidden="true">
          📜
        </span>
        <h2
          style={{
            fontSize: '1.25rem',
            fontFamily: "'Cormorant Garamond', serif",
            color: '#FAFAFA',
            margin: 0,
          }}
        >
          Import History
        </h2>
      </div>

      {sessions.length === 0 ? (
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            color: 'rgba(250,250,250,0.4)',
          }}
        >
          <span style={{ fontSize: '2.5rem' }} aria-hidden="true">
            🗃️
          </span>
          <p style={{ fontFamily: "'Inter', sans-serif", fontSize: '0.875rem', margin: 0 }}>
            No import sessions yet.
          </p>
          <p
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: '0.8rem',
              margin: 0,
              opacity: 0.7,
            }}
          >
            Use the Smart Import wizard to get started.
          </p>
        </div>
      ) : (
        <ul
          role="list"
          aria-label="Past import sessions"
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
          }}
        >
          {sessions.map(session => (
            <li
              key={session.id}
              role="listitem"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem 1rem',
                background: 'rgba(255,255,255,0.04)',
                borderRadius: '8px',
                border: '1px solid rgba(196,30,58,0.15)',
              }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.875rem',
                    color: '#FAFAFA',
                  }}
                >
                  {session.fileName}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: '0.75rem',
                    color: 'rgba(250,250,250,0.5)',
                  }}
                >
                  {session.importedAt} · {session.recordCount} records ·{' '}
                  <span
                    style={{
                      color:
                        session.status === 'success'
                          ? '#4caf50'
                          : session.status === 'failed'
                            ? '#C41E3A'
                            : '#ff9800',
                    }}
                    aria-label={`Status: ${session.status}`}
                  >
                    {session.status}
                  </span>
                </span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {session.status !== 'success' && onRetry && (
                  <button
                    onClick={() => onRetry(session.id)}
                    style={{
                      padding: '0.375rem 0.75rem',
                      background: '#C41E3A',
                      color: '#FAFAFA',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                    aria-label={`Retry import for ${session.fileName}`}
                  >
                    Retry
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(session.id)}
                    style={{
                      padding: '0.375rem 0.75rem',
                      background: 'transparent',
                      color: 'rgba(250,250,250,0.5)',
                      border: '1px solid rgba(250,250,250,0.15)',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      fontSize: '0.75rem',
                    }}
                    aria-label={`Delete import session for ${session.fileName}`}
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ImportHistory;
