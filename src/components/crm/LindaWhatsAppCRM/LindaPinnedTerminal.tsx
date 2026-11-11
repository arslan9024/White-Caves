import React, { memo } from 'react';
import { Terminal, Play } from 'lucide-react';
import type { LindaFeatureBadge, LindaPlaybookBadge } from './LindaWhatsAppCRM.data';

export interface LindaPinnedTerminalProps {
  features: LindaFeatureBadge[];
  playbooks: LindaPlaybookBadge[];
  terminalLines: string[];
  terminalFilter: string;
  setTerminalFilter: (filter: string) => void;
  autoScroll: boolean;
  setAutoScroll: (auto: boolean) => void;
  copiedLog: boolean;
  onCopyLogs: () => void;
  onClearTerminal: () => void;
  commandInput: string;
  setCommandInput: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onExecuteCommand: (cmd: string, label?: string) => void;
}

/**
 * LindaPinnedTerminal — Pinned 4-Panel Terminal Architecture
 * Modular sub-component under AEGIS APOCALYPSE-AEG-042 (< 350 lines).
 */
export const LindaPinnedTerminal: React.FC<LindaPinnedTerminalProps> = memo(({
  features,
  playbooks,
  terminalLines,
  terminalFilter,
  setTerminalFilter,
  autoScroll,
  setAutoScroll,
  copiedLog,
  onCopyLogs,
  onClearTerminal,
  commandInput,
  setCommandInput,
  onSubmit,
  onExecuteCommand,
}) => {
  const filteredTerminalLines = terminalFilter
    ? terminalLines.filter(l => l.toLowerCase().includes(terminalFilter.toLowerCase()))
    : terminalLines;

  return (
    <div
      style={{
        background: '#090D16',
        border: '1px solid rgba(148, 163, 184, 0.28)',
        borderRadius: 12,
        padding: 14,
        display: 'grid',
        gap: 10,
        boxShadow: '0 2px 10px rgba(0,0,0,0.04)',
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
                border: '1px solid rgba(6, 182, 212, 0.4)',
                borderRadius: 4,
                padding: '3px 8px',
                fontSize: 11,
                color: '#E2E8F0',
                outline: 'none',
              }}
            />
            <button
              type="button"
              onClick={() => setAutoScroll(!autoScroll)}
              style={{
                background: autoScroll ? 'rgba(34, 197, 94, 0.2)' : 'rgba(148, 163, 184, 0.2)',
                border: autoScroll ? '1px solid #22C55E' : '1px solid #64748B',
                color: autoScroll ? '#86EFAC' : '#94A3B8',
                borderRadius: 4,
                padding: '3px 8px',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              Auto-Scroll: {autoScroll ? 'ON' : 'OFF'}
            </button>
            <button
              type="button"
              onClick={onCopyLogs}
              style={{
                background: 'rgba(59, 130, 246, 0.2)',
                border: '1px solid rgba(59, 130, 246, 0.5)',
                color: '#93C5FD',
                borderRadius: 4,
                padding: '3px 8px',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              {copiedLog ? '✓ Copied' : 'Copy'}
            </button>
            <button
              type="button"
              onClick={onClearTerminal}
              style={{
                background: 'rgba(239, 68, 68, 0.2)',
                border: '1px solid rgba(239, 68, 68, 0.5)',
                color: '#FCA5A5',
                borderRadius: 4,
                padding: '3px 8px',
                fontSize: 11,
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          </div>
        </div>

        <div
          data-testid="linda-terminal-box"
          style={{
            background: '#030712',
            border: '1px solid rgba(15, 23, 42, 0.8)',
            borderRadius: 6,
            minHeight: 180,
            maxHeight: 280,
            overflowY: 'auto',
            fontFamily: 'monospace',
            fontSize: 11,
            color: '#38BDF8',
            padding: '6px 4px',
          }}
        >
          {filteredTerminalLines.map((line, idx) => (
            <div key={idx} style={{ whiteSpace: 'pre-wrap', marginBottom: 4 }}>
              {line}
            </div>
          ))}
        </div>

        <form onSubmit={onSubmit} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
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
  );
});
