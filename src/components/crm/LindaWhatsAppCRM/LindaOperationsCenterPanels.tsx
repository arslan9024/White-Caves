import React, { useState, memo } from 'react';
import { Sparkles, X } from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import type {
  LindaFeatureBadge,
  LindaPlaybookBadge,
} from './LindaWhatsAppCRM.data';
import { LindaPinnedTerminal } from './LindaPinnedTerminal';

export { LindaSessionsPanel } from './LindaSessionsPanel';
export type { SessionsPanelProps } from './LindaSessionsPanel';

export interface QuickActionsAndTerminalProps {
  features: LindaFeatureBadge[];
  playbooks: LindaPlaybookBadge[];
  terminalLines: string[];
  onExecuteCommand: (cmd: string, label?: string) => void;
  onClearTerminal: () => void;
  activeModalOutput: { title: string; output: string } | null;
  onCloseModal: () => void;
  qrCodeDataUrl?: string | null;
  isQrLoading?: boolean;
}

/**
 * LindaQuickActionsAndTerminal — Administrative Quick Actions & Diagnostic Terminal
 * Refactored to delegate to LindaPinnedTerminal under AEGIS APOCALYPSE-AEG-042 (< 350 lines).
 */
export const LindaQuickActionsAndTerminal: React.FC<QuickActionsAndTerminalProps> = memo(({
  features,
  playbooks,
  terminalLines,
  onExecuteCommand,
  onClearTerminal,
  activeModalOutput,
  onCloseModal,
  qrCodeDataUrl,
}) => {
  const { isDark } = useTheme();
  const [commandInput, setCommandInput] = useState('');
  const [terminalFilter, setTerminalFilter] = useState('');
  const [copiedLog, setCopiedLog] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  const quickActions = [
    { cmd: 'doctor', label: '🩺 Health Doctor (12/12)', color: '#10B981' },
    { cmd: 'status', label: '📊 System Posture (300/300)', color: '#3B82F6' },
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
          background: isDark ? 'rgba(15, 23, 42, 0.82)' : '#FFFFFF',
          border: isDark ? '1px solid rgba(37, 211, 102, 0.28)' : '1px solid rgba(37, 211, 102, 0.4)',
          borderRadius: 12,
          padding: 14,
          boxShadow: isDark ? 'none' : '0 2px 8px rgba(15, 23, 42, 0.05)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Sparkles size={16} color="#25D366" />
            <strong style={{ color: isDark ? '#ECFDF5' : '#065F46', fontSize: 13 }}>
              Administrative Quick Actions & Diagnostics (whatsapp-bot-linda v2.0)
            </strong>
          </div>
          <span style={{ fontSize: 11, color: isDark ? '#94A3B8' : '#64748B' }}>
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
                background: isDark ? `${action.color}1F` : `${action.color}14`,
                border: `1px solid ${action.color}66`,
                color: isDark ? '#F8FAFC' : '#0F172A',
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
            background: isDark ? '#090D16' : '#FFFFFF',
            border: isDark ? '1px solid #25D366' : '1px solid #16A34A',
            borderRadius: 12,
            padding: 14,
            boxShadow: isDark ? '0 10px 30px rgba(0,0,0,0.45)' : '0 10px 30px rgba(0,0,0,0.1)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <strong style={{ color: isDark ? '#86EFAC' : '#15803D', fontSize: 13 }}>
              ⚡ Executed: {activeModalOutput.title}
            </strong>
            <button
              type="button"
              onClick={onCloseModal}
              style={{
                background: isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9',
                border: isDark ? 'none' : '1px solid #E2E8F0',
                color: isDark ? '#CBD5E1' : '#475569',
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
          {qrCodeDataUrl && (
            <div
              style={{
                margin: '10px 0',
                padding: 12,
                background: '#FFFFFF',
                borderRadius: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                border: '1px solid #E2E8F0',
              }}
            >
              <img
                src={qrCodeDataUrl}
                alt="WhatsApp Linking QR Code"
                style={{ width: 180, height: 180, borderRadius: 6 }}
              />
              <span style={{ fontSize: 11, color: '#334155', fontWeight: 600 }}>
                Point WhatsApp Camera at this QR code (Linked Devices)
              </span>
            </div>
          )}
          <pre
            style={{
              margin: 0,
              padding: 12,
              background: isDark ? '#020617' : '#F8FAFC',
              border: isDark ? 'none' : '1px solid #E2E8F0',
              borderRadius: 8,
              color: isDark ? '#A7F3D0' : '#065F46',
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

      {/* Pinned 4-Panel Terminal Architecture */}
      <LindaPinnedTerminal
        features={features}
        playbooks={playbooks}
        terminalLines={terminalLines}
        terminalFilter={terminalFilter}
        setTerminalFilter={setTerminalFilter}
        autoScroll={autoScroll}
        setAutoScroll={setAutoScroll}
        copiedLog={copiedLog}
        onCopyLogs={handleCopyLogs}
        onClearTerminal={onClearTerminal}
        commandInput={commandInput}
        setCommandInput={setCommandInput}
        onSubmit={handleSubmit}
        onExecuteCommand={onExecuteCommand}
      />
    </div>
  );
});
