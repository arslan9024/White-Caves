/**
 * CrossIntegrationPanel
 *
 * Live status panel for all 5 AI assistants (Linda, Nadia, Nina, Mary, Henry)
 * and their cross-integration connections via the AssistantOrchestrator event bus.
 *
 * Design: Gold (#C9A84C) / Black / White luxury theme.
 * Polling: /api/orchestrator/status every 30 seconds.
 * Events: Last 5 from /api/orchestrator/events (newest first).
 * No external packages — inline styles only.
 */

import React, { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CrossIntegrationPanelProps {
  /** Optional extra className for the root section element */
  className?: string;
}

interface OrchestratorStatus {
  handlerCount: Record<string, number>;
  registeredAssistants: string[];
  totalEventsEmitted: number;
  ringBufferSize: number;
  uptime: number;
}

interface OrchestratorLogEntry {
  id: string;
  event: string;
  payload: Record<string, unknown>;
  timestamp: string;
}

interface AssistantConfig {
  id: string;
  name: string;
  role: string;
  metric: string;
  emoji: string;
  color: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const GOLD        = '#C9A84C';
const PANEL_BG    = '#111111';
const CARD_BG     = '#1a1a1a';
const CARD_BORDER = '#2c2c2c';
const DARK_ROW    = '#0d0d0d';
const TEXT_MAIN   = '#f0ece0';
const TEXT_MUTED  = '#888888';

const ASSISTANTS: AssistantConfig[] = [
  { id: 'linda', name: 'Linda',  role: 'WhatsApp Device',  metric: 'WA Broadcast',          emoji: '💬', color: '#22c55e' },
  { id: 'nadia', name: 'Nadia',  role: 'Meta Cloud API',   metric: 'Official WABA',          emoji: '📡', color: '#38bdf8' },
  { id: 'nina',  name: 'Nina',   role: 'NLP Engine',       metric: 'Intent Classification',  emoji: '🧠', color: '#a78bfa' },
  { id: 'mary',  name: 'Mary',   role: 'Inventory CRM',    metric: '9,378+ Units',           emoji: '🏠', color: '#fb923c' },
  { id: 'henry', name: 'Henry',  role: 'Document Hub',     metric: 'Compliance Engine',      emoji: '📄', color: '#f472b6' },
];

const TOPOLOGY: Array<{ from: string; to: string; label: string }> = [
  { from: 'Linda', to: 'Nina',  label: 'NLP route'          },
  { from: 'Nina',  to: 'Nadia', label: 'intent → response'  },
  { from: 'Nina',  to: 'Mary',  label: 'inventory search'   },
  { from: 'Mary',  to: 'Linda', label: 'status broadcast'   },
  { from: 'Nadia', to: 'Henry', label: 'compliance alert'   },
  { from: 'Henry', to: 'Nadia', label: 'document generated' },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const CrossIntegrationPanel: FC<CrossIntegrationPanelProps> = ({ className }) => {
  const [status,      setStatus]      = useState<OrchestratorStatus | null>(null);
  const [events,      setEvents]      = useState<OrchestratorLogEntry[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [fetchError,  setFetchError]  = useState<string | null>(null);

  const fetchData = useCallback(async (): Promise<void> => {
    try {
      const [statusRes, eventsRes] = await Promise.all([
        fetch('/api/orchestrator/status'),
        fetch('/api/orchestrator/events?limit=5'),
      ]);

      if (statusRes.ok) {
        const body = (await statusRes.json()) as { success: boolean; data: OrchestratorStatus };
        if (body.success) setStatus(body.data);
      }

      if (eventsRes.ok) {
        const body = (await eventsRes.json()) as {
          success: boolean;
          data: { events: OrchestratorLogEntry[]; count: number };
        };
        if (body.success) {
          const sorted = [...body.data.events].sort(
            (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
          );
          setEvents(sorted.slice(0, 5));
        }
      }

      setLastUpdated(new Date());
      setFetchError(null);
    } catch (err) {
      setFetchError(err instanceof Error ? err.message : 'Network error');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
    const interval = setInterval(() => void fetchData(), 30_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  /** Returns 'active' | 'idle' | 'unknown' for a given assistant ID */
  const getState = (id: string): 'active' | 'idle' | 'unknown' => {
    if (!status) return 'unknown';
    return status.registeredAssistants.includes(id) ? 'active' : 'idle';
  };

  const STATE_COLOR: Record<'active' | 'idle' | 'unknown', string> = {
    active:  '#22c55e',
    idle:    '#eab308',
    unknown: '#6b7280',
  };

  /** Get the accent colour for an event name based on its namespace prefix */
  const eventColor = (eventName: string): string => {
    if (eventName.startsWith('linda')) return '#22c55e';
    if (eventName.startsWith('nadia')) return '#38bdf8';
    if (eventName.startsWith('nina'))  return '#a78bfa';
    if (eventName.startsWith('mary'))  return '#fb923c';
    if (eventName.startsWith('henry')) return '#f472b6';
    return GOLD;
  };

  return (
    <section
      className={className}
      aria-label="AI Assistant Cross-Integration Panel"
      style={{
        background:   PANEL_BG,
        border:       `1px solid ${CARD_BORDER}`,
        borderRadius: '14px',
        padding:      '28px',
        fontFamily:   "'Inter', 'Segoe UI', system-ui, sans-serif",
        color:        TEXT_MAIN,
        boxShadow:    '0 4px 24px rgba(0,0,0,0.45)',
      }}
    >

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <header
        style={{
          display:        'flex',
          alignItems:     'flex-start',
          justifyContent: 'space-between',
          marginBottom:   '28px',
          gap:            '16px',
          flexWrap:       'wrap',
        }}
      >
        <div>
          <h2
            id="xip-heading"
            style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: GOLD, letterSpacing: '0.3px' }}
          >
            ⚡ AI Orchestrator — Cross-Integration
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: TEXT_MUTED }}>
            Live status of all 5 AI assistants · event bus health · recent cross-events
          </p>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {loading && (
            <span style={{ fontSize: '12px', color: TEXT_MUTED, fontStyle: 'italic' }}>
              Connecting…
            </span>
          )}
          {!loading && fetchError && (
            <span role="alert" style={{ fontSize: '12px', color: '#f87171' }}>
              ⚠ {fetchError}
            </span>
          )}
          {!loading && !fetchError && lastUpdated && (
            <>
              <div style={{ fontSize: '12px', color: TEXT_MUTED }}>
                Updated {lastUpdated.toLocaleTimeString()}
              </div>
              {status && (
                <div style={{ fontSize: '12px', color: GOLD, marginTop: '3px' }}>
                  {status.totalEventsEmitted.toLocaleString()} events · {status.uptime}s uptime
                </div>
              )}
            </>
          )}
        </div>
      </header>

      {/* ── Assistant Nodes ─────────────────────────────────────────────────── */}
      <div
        role="list"
        aria-labelledby="xip-heading"
        style={{
          display:             'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(155px, 1fr))',
          gap:                 '12px',
          marginBottom:        '22px',
        }}
      >
        {ASSISTANTS.map(a => {
          const state    = getState(a.id);
          const dotColor = STATE_COLOR[state];
          const isActive = state === 'active';

          return (
            <article
              key={a.id}
              role="listitem"
              aria-label={`${a.name} — ${state}`}
              style={{
                background:   CARD_BG,
                border:       `1px solid ${isActive ? `${GOLD}44` : CARD_BORDER}`,
                borderRadius: '12px',
                padding:      '18px 16px',
                position:     'relative',
                transition:   'border-color 0.3s',
              }}
            >
              {/* Status dot */}
              <div
                aria-hidden="true"
                title={`Status: ${state}`}
                style={{
                  position:     'absolute',
                  top:          '12px',
                  right:        '12px',
                  width:        '10px',
                  height:       '10px',
                  borderRadius: '50%',
                  background:   dotColor,
                  boxShadow:    isActive ? `0 0 8px ${dotColor}88` : 'none',
                }}
              />

              <div style={{ fontSize: '26px', marginBottom: '10px', lineHeight: 1 }} aria-hidden="true">
                {a.emoji}
              </div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: '#fff', marginBottom: '2px' }}>
                {a.name}
              </div>
              <div style={{ fontSize: '11px', color: GOLD, marginBottom: '4px', fontWeight: 500 }}>
                {a.role}
              </div>
              <div style={{ fontSize: '11px', color: TEXT_MUTED, marginBottom: '10px' }}>
                {a.metric}
              </div>

              <div
                style={{
                  display:      'inline-flex',
                  alignItems:   'center',
                  gap:          '5px',
                  padding:      '3px 8px',
                  borderRadius: '999px',
                  background:   `${dotColor}22`,
                  border:       `1px solid ${dotColor}44`,
                }}
              >
                <div
                  aria-hidden="true"
                  style={{ width: '6px', height: '6px', borderRadius: '50%', background: dotColor }}
                />
                <span
                  style={{
                    fontSize:      '10px',
                    color:         dotColor,
                    fontWeight:    600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.6px',
                  }}
                >
                  {state}
                </span>
              </div>
            </article>
          );
        })}
      </div>

      {/* ── Topology Map ────────────────────────────────────────────────────── */}
      <div
        aria-label="Event topology map"
        style={{
          background:   DARK_ROW,
          border:       `1px solid ${CARD_BORDER}`,
          borderRadius: '10px',
          padding:      '16px 20px',
          marginBottom: '22px',
        }}
      >
        <div
          style={{ fontSize: '11px', color: GOLD, fontWeight: 700, marginBottom: '12px', letterSpacing: '0.8px' }}
        >
          EVENT TOPOLOGY
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {TOPOLOGY.map(link => (
            <div
              key={`${link.from}-${link.to}`}
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          '5px',
                padding:      '4px 10px',
                background:   '#1e1e1e',
                borderRadius: '6px',
                border:       `1px solid ${CARD_BORDER}`,
                fontSize:     '11px',
              }}
            >
              <span style={{ color: TEXT_MAIN, fontWeight: 600 }}>{link.from}</span>
              <span style={{ color: GOLD }} aria-hidden="true">→</span>
              <span style={{ color: TEXT_MAIN, fontWeight: 600 }}>{link.to}</span>
              <span style={{ color: TEXT_MUTED, fontSize: '10px' }}>({link.label})</span>
            </div>
          ))}
        </div>

        {status && (
          <div
            style={{ marginTop: '12px', fontSize: '11px', color: TEXT_MUTED, display: 'flex', gap: '18px', flexWrap: 'wrap' }}
          >
            <span>
              <span style={{ color: GOLD }}>{status.registeredAssistants.length}</span>/5 handlers active
            </span>
            <span>
              Buffer: <span style={{ color: GOLD }}>{status.ringBufferSize}</span>/50
            </span>
            <span>
              Total: <span style={{ color: GOLD }}>{status.totalEventsEmitted.toLocaleString()}</span> events
            </span>
          </div>
        )}
      </div>

      {/* ── Recent Cross-Events ──────────────────────────────────────────────── */}
      <div>
        <h3
          style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700, color: GOLD, letterSpacing: '0.4px' }}
        >
          Recent Cross-Events
        </h3>

        {loading && (
          <p style={{ margin: 0, fontSize: '12px', color: TEXT_MUTED, fontStyle: 'italic' }}>
            Loading events…
          </p>
        )}

        {!loading && events.length === 0 && (
          <p style={{ margin: 0, fontSize: '12px', color: TEXT_MUTED }}>
            No events recorded yet. Use{' '}
            <code
              style={{ fontSize: '11px', background: '#1e1e1e', padding: '1px 5px', borderRadius: '3px', color: GOLD }}
            >
              POST /api/orchestrator/emit
            </code>{' '}
            to emit a test event.
          </p>
        )}

        {events.length > 0 && (
          <ul
            aria-label="Recent orchestrator events"
            style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {events.map(ev => {
              const accentColor    = eventColor(ev.event);
              const payloadPreview = JSON.stringify(ev.payload)
                .replace(/["{}]/g, '')
                .slice(0, 90);

              return (
                <li
                  key={ev.id}
                  style={{
                    background:   DARK_ROW,
                    borderLeft:   `3px solid ${accentColor}`,
                    borderRadius: '0 8px 8px 0',
                    padding:      '10px 16px',
                    display:      'flex',
                    alignItems:   'center',
                    gap:          '14px',
                    flexWrap:     'wrap',
                  }}
                >
                  <code
                    style={{
                      fontFamily: 'ui-monospace, "Cascadia Code", monospace',
                      fontSize:   '11px',
                      color:      accentColor,
                      fontWeight: 700,
                      whiteSpace: 'nowrap',
                      flexShrink: 0,
                    }}
                  >
                    {ev.event}
                  </code>

                  <span
                    style={{
                      fontSize:     '11px',
                      color:        '#ccc',
                      flex:         1,
                      minWidth:     0,
                      overflow:     'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace:   'nowrap',
                    }}
                  >
                    {payloadPreview}
                  </span>

                  <time
                    dateTime={ev.timestamp}
                    style={{ fontSize: '10px', color: TEXT_MUTED, whiteSpace: 'nowrap', flexShrink: 0 }}
                  >
                    {new Date(ev.timestamp).toLocaleTimeString()}
                  </time>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
};

export default CrossIntegrationPanel;
