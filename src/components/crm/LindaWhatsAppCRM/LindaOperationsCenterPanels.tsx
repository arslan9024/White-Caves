import React, { useState } from 'react';
import {
  Terminal,
  Play,
  RefreshCw,
  QrCode,
  KeyRound,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  X,
} from 'lucide-react';
import type {
  LindaSessionItem,
  LindaFeatureBadge,
  LindaPlaybookBadge,
} from './LindaWhatsAppCRM.data';

interface QuickActionsAndTerminalProps {
  features: LindaFeatureBadge[];
  playbooks: LindaPlaybookBadge[];
  terminalLines: string[];
  onExecuteCommand: (cmd: string, label?: string) => void;
  onClearTerminal: () => void;
  activeModalOutput: { title: string; output: string } | null;
  onCloseModal: () => void;
}

export const LindaQuickActionsAndTerminal: React.FC<QuickActionsAndTerminalProps> = ({
  features,
  playbooks,
  terminalLines,
  onExecuteCommand,
  onClearTerminal,
  activeModalOutput,
  onCloseModal,
}) => {
  const [commandInput, setCommandInput] = useState('');
  const [terminalFilter, setTerminalFilter] = useState('');
  const [copiedLog, setCopiedLog] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const quickActions = [
    { cmd: 'doctor', label: '🩺 Health Doctor (12/12)', color: '#10B981' },
    { cmd: 'status', label: '📊 System Posture (200/200)', color: '#3B82F6' },
    { cmd: 'list-sessions', label: '📱 List Sessions (1.1)', color: '#25D366' },
    { cmd: 'restore', label: '♻️ Restore Master (1.19)', color: '#F59E0B' },
    { cmd: 'convos', label: '💬 Analyze Convos (8.11)', color: '#8B5CF6' },
    { cmd: 'outreach', label: '📅 Outreach Plan (9.1)', color: '#EC4899' },
    { cmd: 'backup-verify', label: '🛡️ Verify Auth Backup', color: '#06B6D4' },
    { cmd: 'clean-sessions', label: '🧹 Clean Locks (1.16)', color: '#64748B' },
  ];

  const handleCopyLogs = () => {
    navigator.clipboard.writeText(terminalLines.join('\n'));
    setCopiedLog(true);
    setTimeout(() => setCopiedLog(false), 2000);
  };

  const filteredTerminalLines = terminalFilter
    ? terminalLines.filter(l => l.toLowerCase().includes(terminalFilter.toLowerCase()))
    : terminalLines;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = commandInput.trim();
    if (!trimmed) return;
    if (trimmed.toLowerCase() === 'clear') {
      onClearTerminal();
    } else {
      onExecuteCommand(trimmed);
    }
    setCommandInput('');
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* Quick Actions Bar */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.82)',
          border: '1px solid rgba(37, 211, 102, 0.28)',
          borderRadius: 12,
          padding: 14,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} color="#25D366" />
            <strong style={{ color: '#ECFDF5', fontSize: 13 }}>
              Administrative Quick Actions & Diagnostics (whatsapp-bot-linda v2.0)
            </strong>
          </div>
          <span style={{ fontSize: 11, color: '#94A3B8' }}>
            Click any action to execute live script & inspect output
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {quickActions.map(action => (
            <button
              key={action.cmd}
              type="button"
              onClick={() => onExecuteCommand(action.cmd, action.label)}
              style={{
                background: `${action.color}1F`,
                border: `1px solid ${action.color}66`,
                color: '#F8FAFC',
                borderRadius: 8,
                padding: '7px 12px',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              {action.label}
            </button>
          ))}
        </div>
      </div>

      {/* Script Output Modal / Inspector Banner */}
      {activeModalOutput && (
        <div
          role="dialog"
          aria-label="Linda Script Output Modal"
          style={{
            background: '#090D16',
            border: '1px solid #25D366',
            borderRadius: 12,
            padding: 14,
            boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <strong style={{ color: '#86EFAC', fontSize: 13 }}>
              ⚡ Executed: {activeModalOutput.title}
            </strong>
            <button
              type="button"
              onClick={onCloseModal}
              style={{
                background: 'rgba(255,255,255,0.08)',
                border: 'none',
                color: '#CBD5E1',
                borderRadius: 6,
                padding: '4px 8px',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontSize: 11,
              }}
            >
              <X size={13} /> Close
            </button>
          </div>
          <pre
            style={{
              margin: 0,
              padding: 12,
              background: '#020617',
              borderRadius: 8,
              color: '#A7F3D0',
              fontSize: 12,
              fontFamily: 'monospace',
              whiteSpace: 'pre-wrap',
              maxHeight: 220,
              overflowY: 'auto',
            }}
          >
            {activeModalOutput.output}
          </pre>
        </div>
      )}

      {/* Pinned 4-Panel Terminal Architecture from whatsapp-bot-linda */}
      <div
        style={{
          background: '#090D16',
          border: '1px solid rgba(148, 163, 184, 0.28)',
          borderRadius: 12,
          padding: 14,
          display: 'grid',
          gap: 10,
        }}
      >
        {/* PANEL 1: Pinned Header (Magenta Border) */}
        <div
          style={{
            border: '1px solid rgba(217, 70, 239, 0.55)',
            background: 'rgba(217, 70, 239, 0.08)',
            borderRadius: 8,
            padding: '8px 12px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 8,
            fontFamily: 'monospace',
            fontSize: 12,
          }}
        >
          <span style={{ color: '#F0ABFC', fontWeight: 700 }}>
            [PANEL 1 · HEADER] LINDA VISUAL TERMINAL v2.0.0-enterprise
          </span>
          <span style={{ color: '#E2E8F0' }}>
            MASTER: <strong style={{ color: '#4ADE80' }}>+971505760056 (LINKED)</strong> · GORAHA:{' '}
            <strong style={{ color: '#38BDF8' }}>SYNCED</strong> · ANTI-BAN:{' '}
            <strong style={{ color: '#FBBF24' }}>42 WPM GAUSSIAN</strong>
          </span>
        </div>

        {/* PANEL 2: Features Bar F1-F35 (Green Border) */}
        <div
          style={{
            border: '1px solid rgba(34, 197, 94, 0.55)',
            background: 'rgba(34, 197, 94, 0.06)',
            borderRadius: 8,
            padding: '8px 12px',
          }}
        >
          <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#86EFAC', fontWeight: 700, marginBottom: 6 }}>
            [PANEL 2 · FEATURE CATALOG F1–F35] Click any feature badge to run & increment usage counter:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {features.map(f => (
              <button
                key={f.id}
                type="button"
                onClick={() => onExecuteCommand(f.id.toLowerCase(), `${f.id} (${f.code}) ${f.title}`)}
                title={f.summary}
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(34, 197, 94, 0.45)',
                  borderRadius: 6,
                  padding: '4px 8px',
                  color: '#DCFCE7',
                  fontSize: 11,
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                }}
              >
                <strong style={{ color: '#4ADE80' }}>{f.id}</strong> ({f.code}) {f.title}{' '}
                <span style={{ color: '#FBBF24' }}>×{f.uses}</span>
              </button>
            ))}
          </div>
        </div>

        {/* PANEL 3: Playbooks & Dotted Number Menu (Yellow Border) */}
        <div
          style={{
            border: '1px solid rgba(234, 179, 8, 0.55)',
            background: 'rgba(234, 179, 8, 0.06)',
            borderRadius: 8,
            padding: '8px 12px',
          }}
        >
          <div style={{ fontSize: 11, fontFamily: 'monospace', color: '#FDE047', fontWeight: 700, marginBottom: 6 }}>
            [PANEL 3 · MULTI-STEP PLAYBOOKS P1–P10 & DOTTED MENU] Automated workflow chains:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 6 }}>
            {playbooks.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => onExecuteCommand(p.id.toLowerCase(), `${p.id}: ${p.title}`)}
                style={{
                  textAlign: 'left',
                  background: 'rgba(15, 23, 42, 0.88)',
                  border: '1px solid rgba(234, 179, 8, 0.4)',
                  borderRadius: 6,
                  padding: '6px 10px',
                  color: '#FEF9C3',
                  fontSize: 11,
                  fontFamily: 'monospace',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span>
                  <strong style={{ color: '#FACC15' }}>{p.id}</strong> {p.title}{' '}
                  <span style={{ color: '#94A3B8' }}>[{p.steps.join('→')}]</span>
                </span>
                <span style={{ color: '#4ADE80', fontWeight: 700 }}>×{p.uses}</span>
              </button>
            ))}
          </div>
        </div>

        {/* PANEL 4: Output & Command Prompt (Cyan Border) */}
        <div
          style={{
            border: '1px solid rgba(6, 182, 212, 0.55)',
            background: '#020617',
            borderRadius: 8,
            padding: 10,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 8 }}>
            <span style={{ fontSize: 11, fontFamily: 'monospace', color: '#67E8F9', fontWeight: 700 }}>
              [PANEL 4 · LIVE TERMINAL OUTPUT & MESSAGE ANALYZER]
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <input
                type="text"
                placeholder="Search terminal logs..."
                value={terminalFilter}
                onChange={e => setTerminalFilter(e.target.value)}
                style={{
                  background: 'rgba(15, 23, 42, 0.85)',
                  border: '1px solid rgba(6, 182, 212, 0.35)',
                  borderRadius: 4,
                  padding: '2px 8px',
                  color: '#ECFDF5',
                  fontSize: 10,
                  width: 140,
                }}
              />
              <button
                type="button"
                onClick={handleCopyLogs}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(148,163,184,0.3)',
                  color: copiedLog ? '#4ADE80' : '#94A3B8',
                  borderRadius: 4,
                  padding: '2px 8px',
                  fontSize: 10,
                  cursor: 'pointer',
                }}
              >
                {copiedLog ? '✓ Copied' : 'Copy'}
              </button>
              <button
                type="button"
                onClick={onClearTerminal}
                style={{
                  background: 'transparent',
                  border: '1px solid rgba(148,163,184,0.3)',
                  color: '#94A3B8',
                  borderRadius: 4,
                  padding: '2px 8px',
                  fontSize: 10,
                  cursor: 'pointer',
                }}
              >
                Clear Output
              </button>
            </div>
          </div>

          <div
            style={{
              maxHeight: 190,
              overflowY: 'auto',
              fontFamily: 'monospace',
              fontSize: 12,
              lineHeight: 1.5,
              color: '#A7F3D0',
              padding: '6px 4px',
            }}
          >
            {filteredTerminalLines.map((line, idx) => (
              <div key={idx} style={{ whiteSpace: 'pre-wrap', marginBottom: 4 }}>
                {line}
              </div>
            ))}
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            <div
              style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                background: '#0F172A',
                border: '1px solid rgba(6, 182, 212, 0.4)',
                borderRadius: 6,
                padding: '6px 10px',
              }}
            >
              <Terminal size={14} color="#22D3EE" />
              <input
                type="text"
                aria-label="Linda terminal command input"
                value={commandInput}
                onChange={e => setCommandInput(e.target.value)}
                placeholder="Type command: doctor | status | convos | outreach | f1..f35 | p1..p6 | restore | clear"
                style={{
                  flex: 1,
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: '#F8FAFC',
                  fontFamily: 'monospace',
                  fontSize: 12,
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                background: '#0891B2',
                border: 'none',
                borderRadius: 6,
                color: '#FFFFFF',
                padding: '6px 14px',
                fontSize: 12,
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Play size={13} /> Run
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

interface SessionsPanelProps {
  sessions: LindaSessionItem[];
  onPingSession: (sessionId: string) => void;
  onPairDeviceCode: (session: LindaSessionItem) => void;
  onScanDeviceQr: (session: LindaSessionItem) => void;
}

export const LindaSessionsPanel: React.FC<SessionsPanelProps> = ({
  sessions,
  onPingSession,
  onPairDeviceCode,
  onScanDeviceQr,
}) => {
  const [maskPhone, setMaskPhone] = useState(false);
  const [pingStatusMap, setPingStatusMap] = useState<Record<string, string>>({});

  const handlePing = (id: string) => {
    setPingStatusMap(prev => ({ ...prev, [id]: 'Pinging…' }));
    setTimeout(() => {
      setPingStatusMap(prev => ({ ...prev, [id]: '24ms OK' }));
      setTimeout(() => {
        setPingStatusMap(prev => {
          const next = { ...prev };
          delete next[id];
          return next;
        });
      }, 2500);
    }, 400);
    onPingSession(id);
  };

  const formatPhone = (phone: string) => {
    if (!maskPhone) return phone;
    const parts = phone.split(' ');
    if (parts.length >= 3) {
      return `${parts[0]} ${parts[1]} *** ${parts[parts.length - 1]}`;
    }
    return phone.slice(0, 7) + '***' + phone.slice(-4);
  };
  return (
    <div
      style={{
        background: 'rgba(15, 23, 42, 0.82)',
        border: '1px solid rgba(37, 211, 102, 0.28)',
        borderRadius: 12,
        padding: 14,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <div>
          <h3 style={{ margin: 0, color: '#ECFDF5', fontSize: 15 }}>
            📱 Multi-Account WhatsApp Sessions & Device Linking Desk (Menu 1.1 / 2.1 / 2.2)
          </h3>
          <p style={{ margin: '4px 0 0 0', color: '#94A3B8', fontSize: 12 }}>
            Separate Link State vs Connection State · LocalAuth Profile Preservation · Headless 8-Digit Pairing & QR Scan
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <button
            type="button"
            onClick={() => setMaskPhone(!maskPhone)}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(148, 163, 184, 0.25)',
              color: '#CBD5E1',
              borderRadius: 6,
              padding: '4px 10px',
              fontSize: 11,
              cursor: 'pointer',
            }}
          >
            {maskPhone ? '👁️ Reveal Numbers' : '🔒 Mask Numbers'}
          </button>
          <span
            style={{
              background: 'rgba(34, 197, 94, 0.16)',
              border: '1px solid rgba(34, 197, 94, 0.4)',
              color: '#86EFAC',
              borderRadius: 999,
              padding: '4px 10px',
              fontSize: 11,
              fontWeight: 700,
            }}
          >
            {sessions.filter(s => s.status === 'connected').length}/{sessions.length} Connected
          </span>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12, color: '#E2E8F0' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.2)', textAlign: 'left', color: '#94A3B8' }}>
              <th style={{ padding: '8px 10px' }}>Account / Role</th>
              <th style={{ padding: '8px 10px' }}>Phone Number</th>
              <th style={{ padding: '8px 10px' }}>Link State</th>
              <th style={{ padding: '8px 10px' }}>Conn State</th>
              <th style={{ padding: '8px 10px' }}>Saved Profile</th>
              <th style={{ padding: '8px 10px' }}>Traffic (S/R)</th>
              <th style={{ padding: '8px 10px' }}>Uptime / Last Seen</th>
              <th style={{ padding: '8px 10px' }}>Device Actions</th>
            </tr>
          </thead>
          <tbody>
            {sessions.map(session => {
              const isConn = session.connState === 'CONNECTED';
              return (
                <tr key={session.id} style={{ borderBottom: '1px solid rgba(148, 163, 184, 0.12)' }}>
                  <td style={{ padding: '10px' }}>
                    <div style={{ fontWeight: 700, color: '#F8FAFC' }}>{session.name}</div>
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: 2,
                        fontSize: 10,
                        padding: '1px 6px',
                        borderRadius: 4,
                        background: session.role === 'MASTER' ? 'rgba(234,179,8,0.2)' : 'rgba(59,130,246,0.2)',
                        color: session.role === 'MASTER' ? '#FDE047' : '#93C5FD',
                        fontWeight: 700,
                      }}
                    >
                      {session.role}
                    </span>
                  </td>
                  <td style={{ padding: '10px', fontFamily: 'monospace' }}>
                    {formatPhone(session.phone)}
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ color: '#4ADE80', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      <CheckCircle2 size={13} /> {session.linkState}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span
                      style={{
                        color: isConn ? '#4ADE80' : '#FBBF24',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      {isConn ? <CheckCircle2 size={13} /> : <AlertTriangle size={13} />} {session.connState}
                    </span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <span style={{ color: session.savedProfile ? '#67E8F9' : '#94A3B8', fontSize: 11 }}>
                      {session.savedProfile ? '✅ LocalAuth Saved' : 'None'}
                    </span>
                  </td>
                  <td style={{ padding: '10px', fontFamily: 'monospace' }}>
                    ↑{session.messagesSent} / ↓{session.messagesReceived}
                  </td>
                  <td style={{ padding: '10px', color: '#CBD5E1' }}>
                    {session.uptime} · <span style={{ color: '#94A3B8' }}>{session.lastActivity}</span>
                  </td>
                  <td style={{ padding: '10px' }}>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      <button
                        type="button"
                        onClick={() => handlePing(session.id)}
                        style={{
                          background: 'rgba(34, 197, 94, 0.18)',
                          border: '1px solid rgba(34, 197, 94, 0.45)',
                          color: '#DCFCE7',
                          borderRadius: 6,
                          padding: '4px 8px',
                          fontSize: 11,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <RefreshCw size={11} /> {pingStatusMap[session.id] || 'Ping'}
                      </button>
                      <button
                        type="button"
                        onClick={() => onPairDeviceCode(session)}
                        style={{
                          background: 'rgba(234, 179, 8, 0.18)',
                          border: '1px solid rgba(234, 179, 8, 0.45)',
                          color: '#FEF08A',
                          borderRadius: 6,
                          padding: '4px 8px',
                          fontSize: 11,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <KeyRound size={11} /> Code (2.1)
                      </button>
                      <button
                        type="button"
                        onClick={() => onScanDeviceQr(session)}
                        style={{
                          background: 'rgba(59, 130, 246, 0.18)',
                          border: '1px solid rgba(59, 130, 246, 0.45)',
                          color: '#BFDBFE',
                          borderRadius: 6,
                          padding: '4px 8px',
                          fontSize: 11,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4,
                        }}
                      >
                        <QrCode size={11} /> QR (2.2)
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
