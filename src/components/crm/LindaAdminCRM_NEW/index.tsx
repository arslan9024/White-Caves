/**
 * Linda Admin CRM — WhatsApp LocalAuth Bot Manager
 *
 * Admin panel for managing Linda's WhatsApp automation channel.
 * Provides QR authentication, session monitoring, broadcast campaigns,
 * and conversation overview for the Linda bot.
 *
 * Wires to: /api/linda/* endpoints
 */

import React, { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Wifi, WifiOff, RefreshCw, Send, Users, Activity, Radio } from 'lucide-react';
import { authFetch } from '../../../utils/authFetch';
import type { CRMModuleProps } from '../../crm/types';

// ─── Types ─────────────────────────────────────────────────────────────────

interface LindaStats {
  status: string;
  isConnected: boolean;
  queuedMessages: number;
  reconnectAttempts: number;
  messagesSent: number;
  messagesReceived: number;
  enabled: boolean;
}

interface LindaSession {
  botId: string;
  role: string;
  status: string;
  isConnected: boolean;
  messagesSent: number;
  messagesReceived: number;
  reconnectAttempts: number;
}

interface BroadcastState {
  phones: string;
  message: string;
  isSending: boolean;
  lastResult: string | null;
}

interface SendMessageState {
  phone: string;
  message: string;
  isSending: boolean;
  lastResult: string | null;
}

// ─── Status badge ───────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: string; isConnected: boolean }> = ({ status, isConnected }) => {
  const colors: Record<string, string> = {
    READY: '#22c55e',
    AUTHENTICATING: '#f59e0b',
    RECONNECTING: '#f59e0b',
    DISCONNECTED: '#6b7280',
    ERROR: '#E31E24',
  };
  const color = isConnected ? '#22c55e' : (colors[status] ?? '#6b7280');
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px',
      borderRadius: 20, background: `${color}20`, border: `1px solid ${color}40`, color, fontSize: 12, fontWeight: 600,
    }}>
      <span style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
      {status}
    </span>
  );
};

// ─── KPI Tile ───────────────────────────────────────────────────────────────

const KpiTile: React.FC<{ label: string; value: string | number; icon: React.ReactNode; color?: string }> = ({ label, value, icon, color = '#C9A84C' }) => (
  <div style={{
    background: '#1a1a1a', borderRadius: 10, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
    border: '1px solid #2a2a2a',
  }}>
    <div style={{ background: `${color}20`, borderRadius: 8, padding: 10, color }}>
      {icon}
    </div>
    <div>
      <div style={{ color: '#fff', fontSize: 22, fontWeight: 700 }}>{value}</div>
      <div style={{ color: '#888', fontSize: 12 }}>{label}</div>
    </div>
  </div>
);

// ─── Linda Admin CRM ────────────────────────────────────────────────────────

const LindaAdminCRM: React.FC<CRMModuleProps> = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'qr' | 'broadcast' | 'send' | 'commands'>('overview');
  const [stats, setStats] = useState<LindaStats | null>(null);
  const [sessions, setSessions] = useState<LindaSession[]>([]);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [broadcast, setBroadcast] = useState<BroadcastState>({ phones: '', message: '', isSending: false, lastResult: null });
  const [sendMsg, setSendMsg] = useState<SendMessageState>({ phone: '', message: '', isSending: false, lastResult: null });

  const loadStats = useCallback(async () => {
    try {
      const [statsRes, sessionsRes] = await Promise.all([
        authFetch('/api/linda/stats'),
        authFetch('/api/linda/sessions'),
      ]);
      const statsJson = await statsRes.json() as { success: boolean; data: LindaStats };
      const sessionsJson = await sessionsRes.json() as { success: boolean; data: { sessions: LindaSession[] } };
      if (statsJson.success) setStats(statsJson.data);
      if (sessionsJson.success) setSessions(sessionsJson.data.sessions);
    } catch (err) {
      console.error('[Linda Admin] Failed to load stats:', err);
    }
  }, []);

  const loadQR = useCallback(async () => {
    try {
      const res = await authFetch('/api/linda/qr');
      const json = await res.json() as { success: boolean; data: { qr: string | null } };
      if (json.success) setQrCode(json.data.qr);
    } catch (err) {
      console.error('[Linda Admin] Failed to load QR:', err);
    }
  }, []);

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 10_000); // Refresh every 10s
    return () => clearInterval(interval);
  }, [loadStats]);

  useEffect(() => {
    if (activeTab === 'qr') loadQR();
  }, [activeTab, loadQR]);

  const handleConnect = async () => {
    setIsConnecting(true);
    setError(null);
    try {
      const res = await authFetch('/api/linda/connect', { method: 'POST' });
      const json = await res.json() as { success: boolean; message?: string; error?: string };
      if (json.success) {
        setActiveTab('qr');
        setTimeout(loadQR, 2000); // Give time for QR to generate
      } else {
        setError(json.error ?? 'Connection failed');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Connection failed');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await authFetch('/api/linda/disconnect', { method: 'POST' });
      const json = await res.json() as { success: boolean; error?: string };
      if (!json.success) setError(json.error ?? 'Disconnect failed');
      else await loadStats();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Disconnect failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBroadcast = async () => {
    if (!broadcast.phones.trim() || !broadcast.message.trim()) return;
    setBroadcast(prev => ({ ...prev, isSending: true, lastResult: null }));
    try {
      const phones = broadcast.phones.split('\n').map(p => p.trim()).filter(Boolean);
      const res = await authFetch('/api/linda/broadcast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumbers: phones, message: broadcast.message }),
      });
      const json = await res.json() as { success: boolean; data?: { recipients: number }; error?: string };
      setBroadcast(prev => ({
        ...prev,
        lastResult: json.success
          ? `✅ Broadcast accepted for ${json.data?.recipients ?? phones.length} recipients`
          : `❌ ${json.error ?? 'Broadcast failed'}`,
      }));
    } catch (err) {
      setBroadcast(prev => ({ ...prev, lastResult: `❌ ${err instanceof Error ? err.message : 'Error'}` }));
    } finally {
      setBroadcast(prev => ({ ...prev, isSending: false }));
    }
  };

  const handleSendMessage = async () => {
    if (!sendMsg.phone.trim() || !sendMsg.message.trim()) return;
    setSendMsg(prev => ({ ...prev, isSending: true, lastResult: null }));
    try {
      const conversationId = `LINDA_${sendMsg.phone.replace(/\D/g, '')}`;
      const res = await authFetch(`/api/linda/send/${conversationId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phoneNumber: sendMsg.phone, message: sendMsg.message }),
      });
      const json = await res.json() as { success: boolean; data?: { messageId: string }; error?: string };
      setSendMsg(prev => ({
        ...prev,
        lastResult: json.success ? `✅ Sent (ID: ${json.data?.messageId})` : `❌ ${json.error ?? 'Send failed'}`,
      }));
    } catch (err) {
      setSendMsg(prev => ({ ...prev, lastResult: `❌ ${err instanceof Error ? err.message : 'Error'}` }));
    } finally {
      setSendMsg(prev => ({ ...prev, isSending: false }));
    }
  };

  const tabs = [
    { id: 'overview', label: '📊 Overview', icon: Activity },
    { id: 'qr', label: '📲 QR / Auth', icon: Wifi },
    { id: 'broadcast', label: '📢 Broadcast', icon: Radio },
    { id: 'send', label: '💬 Send', icon: Send },
    { id: 'commands', label: '📖 Commands', icon: MessageSquare },
  ] as const;

  const inputStyle: React.CSSProperties = {
    width: '100%', background: '#1a1a1a', border: '1px solid #333', borderRadius: 6,
    color: '#fff', padding: '10px 12px', fontSize: 14, boxSizing: 'border-box',
  };

  const btnPrimary: React.CSSProperties = {
    padding: '10px 20px', background: '#C9A84C', border: 'none', borderRadius: 6,
    color: '#000', cursor: 'pointer', fontSize: 14, fontWeight: 600,
  };

  return (
    <div style={{ background: '#0f0f0f', minHeight: '100%', fontFamily: 'system-ui, sans-serif' }}>
      {/* Header */}
      <div style={{ padding: '20px 24px 0', borderBottom: '1px solid #1a1a1a' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ background: '#C9A84C20', borderRadius: 10, padding: 10, color: '#C9A84C' }}>
              <MessageSquare size={22} />
            </div>
            <div>
              <h2 style={{ color: '#fff', margin: 0, fontSize: 20, fontWeight: 700 }}>Linda — WhatsApp Bot Manager</h2>
              <div style={{ color: '#888', fontSize: 13, marginTop: 2 }}>LocalAuth WhatsApp automation channel</div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {stats && <StatusBadge status={stats.status} isConnected={stats.isConnected} />}
            <button onClick={loadStats} style={{ background: '#1a1a1a', border: '1px solid #333', borderRadius: 6, padding: '8px 12px', color: '#aaa', cursor: 'pointer' }}>
              <RefreshCw size={14} />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div style={{ display: 'flex', gap: 2 }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              style={{
                padding: '8px 16px', border: 'none', borderBottom: `2px solid ${activeTab === t.id ? '#C9A84C' : 'transparent'}`,
                background: 'transparent', color: activeTab === t.id ? '#C9A84C' : '#888',
                cursor: 'pointer', fontSize: 13, fontWeight: activeTab === t.id ? 600 : 400,
              }}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: 24 }}>
        {error && (
          <div style={{ background: '#3a1a1a', border: '1px solid #E31E24', borderRadius: 6, padding: '10px 14px', marginBottom: 16, color: '#f88', fontSize: 13 }}>
            ❌ {error} <button onClick={() => setError(null)} style={{ float: 'right', background: 'none', border: 'none', color: '#f88', cursor: 'pointer' }}>✕</button>
          </div>
        )}

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            {stats ? (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                  <KpiTile label="Messages Sent" value={stats.messagesSent} icon={<Send size={20} />} color="#22c55e" />
                  <KpiTile label="Messages Received" value={stats.messagesReceived} icon={<MessageSquare size={20} />} color="#3b82f6" />
                  <KpiTile label="Queued" value={stats.queuedMessages} icon={<Activity size={20} />} color="#f59e0b" />
                  <KpiTile label="Reconnects" value={stats.reconnectAttempts} icon={<RefreshCw size={20} />} color="#888" />
                </div>

                {/* Sessions Table */}
                <h3 style={{ color: '#fff', marginBottom: 12 }}>Bot Sessions</h3>
                <div style={{ background: '#1a1a1a', borderRadius: 8, border: '1px solid #2a2a2a', overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead style={{ background: '#111' }}>
                      <tr>
                        {['Bot ID', 'Role', 'Status', 'Connected', 'Sent', 'Received'].map(h => (
                          <th key={h} style={{ color: '#888', fontWeight: 600, padding: '10px 14px', textAlign: 'left' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sessions.map(s => (
                        <tr key={s.botId} style={{ borderTop: '1px solid #222' }}>
                          <td style={{ color: '#C9A84C', padding: '10px 14px', fontWeight: 600 }}>{s.botId}</td>
                          <td style={{ color: '#aaa', padding: '10px 14px' }}>{s.role}</td>
                          <td style={{ padding: '10px 14px' }}><StatusBadge status={s.status} isConnected={s.isConnected} /></td>
                          <td style={{ padding: '10px 14px', color: s.isConnected ? '#22c55e' : '#E31E24' }}>{s.isConnected ? '✓ Yes' : '✗ No'}</td>
                          <td style={{ color: '#aaa', padding: '10px 14px' }}>{s.messagesSent}</td>
                          <td style={{ color: '#aaa', padding: '10px 14px' }}>{s.messagesReceived}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Connect / Disconnect buttons */}
                <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
                  {!stats.isConnected ? (
                    <button onClick={handleConnect} disabled={isConnecting} style={{ ...btnPrimary, opacity: isConnecting ? 0.6 : 1 }}>
                      {isConnecting ? '⏳ Connecting...' : <><Wifi size={14} style={{ marginRight: 6 }} />Initialize Linda</>}
                    </button>
                  ) : (
                    <button onClick={handleDisconnect} disabled={isLoading} style={{ padding: '10px 20px', background: '#3a1a1a', border: '1px solid #E31E24', borderRadius: 6, color: '#f88', cursor: 'pointer', fontSize: 14, opacity: isLoading ? 0.6 : 1 }}>
                      {isLoading ? '⏳ Disconnecting...' : <><WifiOff size={14} style={{ marginRight: 6 }} />Disconnect</>}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div style={{ color: '#888', padding: 40, textAlign: 'center' }}>Loading Linda status...</div>
            )}
          </div>
        )}

        {/* QR / Auth Tab */}
        {activeTab === 'qr' && (
          <div style={{ maxWidth: 480 }}>
            <h3 style={{ color: '#fff', marginBottom: 8 }}>📲 WhatsApp QR Authentication</h3>
            <p style={{ color: '#888', fontSize: 13, marginBottom: 20 }}>
              Scan this QR code with WhatsApp to authenticate the Linda bot.
              The QR refreshes automatically. Once scanned, Linda will be operational.
            </p>
            {qrCode ? (
              <div>
                <div style={{ background: '#fff', padding: 20, borderRadius: 12, display: 'inline-block', marginBottom: 12 }}>
                  {/* Render QR as text — client can integrate a QR library if needed */}
                  <pre style={{ margin: 0, fontSize: 8, lineHeight: 1, color: '#000', fontFamily: 'monospace' }}>
                    {qrCode.substring(0, 200)}...
                  </pre>
                </div>
                <div style={{ color: '#888', fontSize: 12, marginTop: 8 }}>
                  ℹ️ Install a QR code library (e.g. qrcode.react) to render this as a scannable image.
                  Raw QR data: <code style={{ color: '#C9A84C', wordBreak: 'break-all', fontSize: 10 }}>{qrCode.substring(0, 50)}...</code>
                </div>
                <button onClick={loadQR} style={{ marginTop: 12, padding: '8px 16px', background: '#222', border: '1px solid #444', borderRadius: 6, color: '#aaa', cursor: 'pointer', fontSize: 13 }}>
                  🔄 Refresh QR
                </button>
              </div>
            ) : stats?.isConnected ? (
              <div style={{ background: '#1a3a1a', border: '1px solid #2e7d32', borderRadius: 8, padding: 20, color: '#8f8' }}>
                ✅ Linda is already authenticated and connected — no QR needed.
              </div>
            ) : (
              <div>
                <div style={{ background: '#1a1a2e', border: '1px solid #2a2a4a', borderRadius: 8, padding: 20, color: '#888', marginBottom: 16 }}>
                  QR not yet generated. Click "Initialize Linda" to start the authentication process.
                </div>
                <button onClick={handleConnect} disabled={isConnecting} style={{ ...btnPrimary, opacity: isConnecting ? 0.6 : 1 }}>
                  {isConnecting ? '⏳ Starting...' : '⚡ Initialize Linda'}
                </button>
              </div>
            )}
          </div>
        )}

        {/* Broadcast Tab */}
        {activeTab === 'broadcast' && (
          <div style={{ maxWidth: 600 }}>
            <h3 style={{ color: '#fff', marginBottom: 8 }}>📢 Broadcast Campaign</h3>
            <p style={{ color: '#888', fontSize: 13, marginBottom: 20 }}>
              Send a message to multiple WhatsApp numbers. Anti-spam delays (2–8s between messages) are applied automatically.
            </p>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: 13, marginBottom: 6 }}>Phone Numbers (one per line)</label>
              <textarea
                value={broadcast.phones}
                onChange={e => setBroadcast(p => ({ ...p, phones: e.target.value }))}
                rows={6}
                placeholder={'971501234567\n971502345678\n971503456789'}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: 13, marginBottom: 6 }}>Message</label>
              <textarea
                value={broadcast.message}
                onChange={e => setBroadcast(p => ({ ...p, message: e.target.value }))}
                rows={4}
                placeholder="Hello {{name}}, we have a new listing in DAMAC Hills 2..."
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
            {broadcast.lastResult && (
              <div style={{ padding: '10px 14px', borderRadius: 6, marginBottom: 16, background: broadcast.lastResult.startsWith('✅') ? '#1a3a1a' : '#3a1a1a', color: broadcast.lastResult.startsWith('✅') ? '#8f8' : '#f88', fontSize: 13 }}>
                {broadcast.lastResult}
              </div>
            )}
            <button onClick={handleBroadcast} disabled={broadcast.isSending || !broadcast.phones.trim() || !broadcast.message.trim()} style={{ ...btnPrimary, opacity: (broadcast.isSending || !broadcast.phones.trim() || !broadcast.message.trim()) ? 0.5 : 1 }}>
              {broadcast.isSending ? '⏳ Sending...' : `📢 Broadcast to ${broadcast.phones.split('\n').filter(p => p.trim()).length} recipients`}
            </button>
          </div>
        )}

        {/* Send Tab */}
        {activeTab === 'send' && (
          <div style={{ maxWidth: 480 }}>
            <h3 style={{ color: '#fff', marginBottom: 8 }}>💬 Send Single Message</h3>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: 13, marginBottom: 6 }}>Phone Number (E.164 without +)</label>
              <input type="text" value={sendMsg.phone} onChange={e => setSendMsg(p => ({ ...p, phone: e.target.value }))} placeholder="971501234567" style={inputStyle} />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: 'block', color: '#aaa', fontSize: 13, marginBottom: 6 }}>Message</label>
              <textarea value={sendMsg.message} onChange={e => setSendMsg(p => ({ ...p, message: e.target.value }))} rows={4} style={{ ...inputStyle, resize: 'vertical' }} />
            </div>
            {sendMsg.lastResult && (
              <div style={{ padding: '10px 14px', borderRadius: 6, marginBottom: 16, background: sendMsg.lastResult.startsWith('✅') ? '#1a3a1a' : '#3a1a1a', color: sendMsg.lastResult.startsWith('✅') ? '#8f8' : '#f88', fontSize: 13 }}>
                {sendMsg.lastResult}
              </div>
            )}
            <button onClick={handleSendMessage} disabled={sendMsg.isSending || !sendMsg.phone.trim() || !sendMsg.message.trim()} style={{ ...btnPrimary, opacity: (sendMsg.isSending || !sendMsg.phone.trim() || !sendMsg.message.trim()) ? 0.5 : 1 }}>
              {sendMsg.isSending ? '⏳ Sending...' : <><Send size={14} style={{ marginRight: 6 }} />Send Message</>}
            </button>
          </div>
        )}

        {/* Commands Reference Tab */}
        {activeTab === 'commands' && (
          <div>
            <h3 style={{ color: '#fff', marginBottom: 16 }}>📖 Linda Bot Command Reference</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 12 }}>
              {BOT_COMMANDS.map(group => (
                <div key={group.category} style={{ background: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 8, padding: 16 }}>
                  <div style={{ color: '#C9A84C', fontWeight: 700, fontSize: 13, marginBottom: 10 }}>{group.category}</div>
                  {group.commands.map(cmd => (
                    <div key={cmd.cmd} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', borderTop: '1px solid #111' }}>
                      <code style={{ color: '#9b8ff5', fontSize: 12 }}>{cmd.cmd}</code>
                      <span style={{ color: '#888', fontSize: 11, textAlign: 'right', maxWidth: '60%' }}>{cmd.desc}</span>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Bot Command Reference Data ─────────────────────────────────────────────

const BOT_COMMANDS = [
  {
    category: '📊 Analytics',
    commands: [
      { cmd: '!analytics', desc: 'Show campaign analytics' },
      { cmd: '!stats', desc: 'Show bot statistics' },
      { cmd: '!report', desc: 'Generate performance report' },
      { cmd: '!leads', desc: 'Show lead statistics' },
    ],
  },
  {
    category: '📢 Campaigns',
    commands: [
      { cmd: '!campaign list', desc: 'List all campaigns' },
      { cmd: '!campaign start <id>', desc: 'Start a campaign' },
      { cmd: '!campaign stop <id>', desc: 'Stop a campaign' },
      { cmd: '!campaign status', desc: 'Show campaign status' },
    ],
  },
  {
    category: '💰 Commissions',
    commands: [
      { cmd: '!commission', desc: 'Show commission summary' },
      { cmd: '!commission add', desc: 'Add commission record' },
      { cmd: '!commission list', desc: 'List commission records' },
    ],
  },
  {
    category: '🧾 Invoices',
    commands: [
      { cmd: '!invoice list', desc: 'List pending invoices' },
      { cmd: '!invoice generate', desc: 'Generate invoice' },
      { cmd: '!invoice send <id>', desc: 'Send invoice to client' },
    ],
  },
  {
    category: '🔔 Notifications',
    commands: [
      { cmd: '!notify all', desc: 'Send notification to all contacts' },
      { cmd: '!notify tenant', desc: 'Notify all tenants' },
      { cmd: '!notify agent', desc: 'Notify all agents' },
    ],
  },
  {
    category: '🏠 Properties',
    commands: [
      { cmd: '!list', desc: 'List available properties' },
      { cmd: '!search <area>', desc: 'Search properties by area' },
      { cmd: '!price <unit>', desc: 'Get unit price' },
    ],
  },
  {
    category: '👤 Leads & Contacts',
    commands: [
      { cmd: '!lead add', desc: 'Add new lead' },
      { cmd: '!lead list', desc: 'List recent leads' },
      { cmd: '!contacts', desc: 'Show contact count' },
    ],
  },
  {
    category: '🤖 Bot Control',
    commands: [
      { cmd: '!status', desc: 'Show bot connection status' },
      { cmd: '!restart', desc: 'Restart bot session (owner)' },
      { cmd: '!help', desc: 'Show available commands' },
      { cmd: '!ping', desc: 'Ping — check if bot is alive' },
    ],
  },
];

export default LindaAdminCRM;
