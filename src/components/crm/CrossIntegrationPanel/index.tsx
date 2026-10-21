/**
 * CrossIntegrationPanel
 *
 * Live status panel for assistants registered with the AssistantOrchestrator event bus.
 *
 * Registration indicates an event handler exists, not that an assistant autonomously runs tasks.
 * Polling: /api/orchestrator/status every 30 seconds.
 * Events: Last 5 from /api/orchestrator/events (newest first).
 * No external packages — inline styles only.
 */

import React, { useState, useEffect, useCallback } from 'react';
import type { FC } from 'react';
import { authFetch } from '../../../utils/authFetch';

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

const BRAND_RED   = '#EF4444';
const PANEL_BG    = '#FFFFFF';
const CARD_BG     = '#FFFFFF';
const CARD_BORDER = '#E2E8F0';
const DARK_ROW    = '#F8FAFC';
const TEXT_MAIN   = '#1E293B';
const TEXT_MUTED  = '#64748B';

const ASSISTANTS: AssistantConfig[] = [
  { id: 'zoe',   name: 'Zoe',    role: 'Executive oversight observer', metric: 'Integration event monitoring', emoji: '👩‍💼', color: BRAND_RED },
  { id: 'linda', name: 'Linda',  role: 'WhatsApp Device',   metric: 'WA Broadcast',          emoji: '💬', color: '#1E293B' },
  { id: 'nadia', name: 'Nadia',  role: 'Meta Cloud API',    metric: 'Official WABA',          emoji: '📡', color: '#1E293B' },
  { id: 'nina',  name: 'Nina',   role: 'NLP Engine',        metric: 'Intent Classification',  emoji: '🧠', color: '#1E293B' },
  { id: 'mary',  name: 'Mary',   role: 'Inventory CRM',     metric: 'Inventory integration',  emoji: '🏠', color: '#1E293B' },
  { id: 'henry', name: 'Henry',  role: 'Document Hub',      metric: 'Compliance integration', emoji: '📄', color: '#1E293B' },
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
        authFetch('/api/orchestrator/status'),
        authFetch('/api/orchestrator/events?limit=5'),
      ]);

      if (!statusRes.ok || !eventsRes.ok) {
        throw new Error('Unable to load Zoe oversight status.');
      }

      const statusBody = (await statusRes.json()) as {
        success: boolean;
        data: OrchestratorStatus;
      };
      const eventsBody = (await eventsRes.json()) as {
        success: boolean;
        data: { events: OrchestratorLogEntry[]; count: number };
      };
      if (!statusBody.success || !eventsBody.success) {
        throw new Error('Unable to load Zoe oversight status.');
      }

      const sorted = [...eventsBody.data.events].sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      setStatus(statusBody.data);
      setEvents(sorted.slice(0, 5));
      setLastUpdated(new Date());
      setFetchError(null);
    } catch {
      setFetchError('Live oversight status is unavailable. Check your access or try again later.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchData();
    const interval = setInterval(() => void fetchData(), 30_000);
    return () => clearInterval(interval);
  }, [fetchData]);

  /** Registration means an event handler exists, not that an AI model is running. */
  const getState = (id: string): 'registered' | 'not registered' | 'unknown' => {
    if (!status) return 'unknown';
    return status.registeredAssistants.includes(id) ? 'registered' : 'not registered';
  };

  const STATE_COLOR: Record<'registered' | 'not registered' | 'unknown', string> = {
    registered: '#EF4444',
    'not registered': '#64748B',
    unknown: '#64748B',
  };

  const eventColor = (eventName: string): string => {
    return eventName.startsWith('zoe') ? BRAND_RED : '#1E293B';
  };

  const assistantConfigs = new Map(ASSISTANTS.map(assistant => [assistant.id, assistant]));
  const assistantIds = Array.from(
    new Set([...ASSISTANTS.map(assistant => assistant.id), ...(status?.registeredAssistants ?? [])])
  );
  const displayedAssistants = assistantIds.map(
    id =>
      assistantConfigs.get(id) ?? {
        id,
        name: id,
        role: 'Runtime-registered integration',
        metric: 'Integration event handler',
        emoji: '🤖',
        color: BRAND_RED,
      }
  );

  return (
    <section
      className={className}
      aria-label="Zoe AI Oversight Panel"
      style={{
        background:   PANEL_BG,
        border:       `1px solid ${CARD_BORDER}`,
        borderRadius: '14px',
        padding:      '28px',
        fontFamily:   "'Inter', 'Segoe UI', system-ui, sans-serif",
        color:        TEXT_MAIN,
        boxShadow:    '0 4px 24px rgba(15, 23, 42, 0.08)',
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
            style={{ margin: 0, fontSize: '20px', fontWeight: 700, color: BRAND_RED, letterSpacing: '0.3px' }}
          >
            Zoe’s AI Oversight
          </h2>
          <p style={{ margin: '6px 0 0', fontSize: '13px', color: TEXT_MUTED }}>
            Registered event integrations and recent activity. Registration does not mean an assistant autonomously runs tasks.
          </p>
        </div>

        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          {loading && (
            <span style={{ fontSize: '12px', color: TEXT_MUTED, fontStyle: 'italic' }}>
              Connecting…
            </span>
          )}
          {!loading && fetchError && (
            <span role="alert" style={{ fontSize: '12px', color: BRAND_RED }}>
              ⚠ {fetchError}
            </span>
          )}
          {!loading && !fetchError && lastUpdated && (
            <>
              <div style={{ fontSize: '12px', color: TEXT_MUTED }}>
                Updated {lastUpdated.toLocaleTimeString()}
              </div>
              {status && (
                <div style={{ fontSize: '12px', color: BRAND_RED, marginTop: '3px' }}>
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
        {displayedAssistants.map(a => {
          const state    = getState(a.id);
          const dotColor = STATE_COLOR[state];
          const isRegistered = state === 'registered';

          return (
            <article
              key={a.id}
              role="listitem"
              aria-label={`${a.name} — ${state}`}
              style={{
                background:   CARD_BG,
                border:       `1px solid ${isRegistered ? BRAND_RED : CARD_BORDER}`,
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
                  boxShadow:    isRegistered ? `0 0 8px ${dotColor}33` : 'none',
                }}
              />

              <div style={{ fontSize: '26px', marginBottom: '10px', lineHeight: 1 }} aria-hidden="true">
                {a.emoji}
              </div>
              <div style={{ fontWeight: 700, fontSize: '16px', color: TEXT_MAIN, marginBottom: '2px' }}>
                {a.name}
              </div>
              <div style={{ fontSize: '11px', color: BRAND_RED, marginBottom: '4px', fontWeight: 500 }}>
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
          style={{ fontSize: '11px', color: BRAND_RED, fontWeight: 700, marginBottom: '12px', letterSpacing: '0.8px' }}
        >
          CURRENT EVENT INTEGRATIONS
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
                background:   '#FFFFFF',
                borderRadius: '6px',
                border:       `1px solid ${CARD_BORDER}`,
                fontSize:     '11px',
              }}
            >
              <span style={{ color: TEXT_MAIN, fontWeight: 600 }}>{link.from}</span>
              <span style={{ color: BRAND_RED }} aria-hidden="true">→</span>
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
              <span style={{ color: BRAND_RED }}>{status.registeredAssistants.length}</span> integration handlers registered
            </span>
            <span>
              Event buffer: <span style={{ color: BRAND_RED }}>{status.ringBufferSize}</span>/50 (in memory)
            </span>
            <span>
              Total: <span style={{ color: BRAND_RED }}>{status.totalEventsEmitted.toLocaleString()}</span> events
            </span>
          </div>
        )}
      </div>

      {/* ── Recent Cross-Events ──────────────────────────────────────────────── */}
      <div>
        <h3
          style={{ margin: '0 0 14px', fontSize: '14px', fontWeight: 700, color: BRAND_RED, letterSpacing: '0.4px' }}
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
            No integration events have been recorded in this server session.
          </p>
        )}

        {events.length > 0 && (
          <ul
            aria-label="Recent orchestrator events"
            style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}
          >
            {events.map(ev => {
              const accentColor    = eventColor(ev.event);
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
                      color:        TEXT_MUTED,
                      flex:         1,
                      minWidth:     0,
                      overflow:     'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace:   'nowrap',
                    }}
                  >
                    Event recorded
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
