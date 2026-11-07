import React, { useState } from 'react';
import {
  Pause,
  Play,
  Send,
  Calendar,
  ShieldCheck,
  MessageSquare,
  Radio,
  Layers,
} from 'lucide-react';
import type {
  LindaCampaignItem,
  LindaOutreachOwnerRow,
  LindaConversationItem,
  LindaPillarItem,
} from './LindaWhatsAppCRM.data';

interface CampaignsAndOutreachProps {
  campaigns: LindaCampaignItem[];
  onToggleCampaignStatus: (campaignId: string) => void;
  outreachOwners: LindaOutreachOwnerRow[];
  onQueueOutreachBatch: (cluster: string) => void;
}

export const LindaCampaignsAndOutreachPanel: React.FC<CampaignsAndOutreachProps> = ({
  campaigns,
  onToggleCampaignStatus,
  outreachOwners,
  onQueueOutreachBatch,
}) => {
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');
  const [searchOwner, setSearchOwner] = useState<string>('');
  const [selectedOwners, setSelectedOwners] = useState<number[]>([]);
  const clusters = ['ALL', 'VARDON', 'JANUSIA', 'SYMFONIA', 'AKOYA', 'MARINA', 'RANCHES'];

  const filteredOwners = outreachOwners
    .filter(o => {
      if (selectedCluster !== 'ALL' && !o.project.toUpperCase().includes(selectedCluster)) {
        return false;
      }
      if (searchOwner.trim()) {
        const q = searchOwner.toLowerCase();
        return (
          o.name.toLowerCase().includes(q) ||
          o.phone.toLowerCase().includes(q) ||
          o.unitNumber.toLowerCase().includes(q)
        );
      }
      return true;
    });

  const toggleSelectAll = () => {
    if (selectedOwners.length === filteredOwners.length) {
      setSelectedOwners([]);
    } else {
      setSelectedOwners(filteredOwners.map(o => o.rowNumber));
    }
  };

  const toggleOwner = (row: number) => {
    setSelectedOwners(prev =>
      prev.includes(row) ? prev.filter(r => r !== row) : [...prev, row]
    );
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: 16 }}>
      {/* Outreach Campaigns Table (CampaignTable.jsx) */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.82)',
          border: '1px solid rgba(37, 211, 102, 0.28)',
          borderRadius: 12,
          padding: 14,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div>
            <h3 style={{ margin: 0, color: '#ECFDF5', fontSize: 15 }}>
              📢 Outreach Campaigns & Drip Broadcasts (Menu 5.1)
            </h3>
            <p style={{ margin: '4px 0 0 0', color: '#94A3B8', fontSize: 12 }}>
              Spintax v3 + Gaussian Typing Jitter · Pause or Resume live campaigns
            </p>
          </div>
          <span style={{ fontSize: 11, color: '#4ADE80', fontWeight: 700 }}>
            {campaigns.filter(c => c.status === 'active').length} Active
          </span>
        </div>

        <div style={{ display: 'grid', gap: 10 }}>
          {campaigns.map(camp => {
            const pct = camp.total > 0 ? Math.round((camp.sent / camp.total) * 100) : 0;
            const isActive = camp.status === 'active';
            return (
              <div
                key={camp.id}
                style={{
                  background: 'rgba(2, 6, 23, 0.65)',
                  border: '1px solid rgba(148, 163, 184, 0.2)',
                  borderRadius: 10,
                  padding: 12,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                  <div>
                    <div style={{ fontWeight: 700, color: '#F8FAFC', fontSize: 13 }}>{camp.name}</div>
                    <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                      Cluster: <strong style={{ color: '#CBD5E1' }}>{camp.cluster}</strong> · {camp.rateLimit} · Next:{' '}
                      {camp.nextBatch}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => onToggleCampaignStatus(camp.id)}
                    style={{
                      background: isActive ? 'rgba(245, 158, 11, 0.18)' : 'rgba(34, 197, 94, 0.2)',
                      border: isActive
                        ? '1px solid rgba(245, 158, 11, 0.5)'
                        : '1px solid rgba(34, 197, 94, 0.5)',
                      color: isActive ? '#FDE68A' : '#BBF7D0',
                      borderRadius: 6,
                      padding: '5px 10px',
                      fontSize: 11,
                      fontWeight: 700,
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 4,
                    }}
                  >
                    {isActive ? (
                      <>
                        <Pause size={12} /> Pause
                      </>
                    ) : (
                      <>
                        <Play size={12} /> Resume
                      </>
                    )}
                  </button>
                </div>

                {/* Progress Bar */}
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#CBD5E1', marginBottom: 4 }}>
                    <span>
                      Status:{' '}
                      <strong style={{ color: isActive ? '#4ADE80' : '#FBBF24' }}>
                        {camp.status.toUpperCase()}
                      </strong>
                    </span>
                    <span>
                      {camp.sent} / {camp.total} delivered ({pct}%)
                    </span>
                  </div>
                  <div
                    style={{
                      width: '100%',
                      height: 6,
                      background: 'rgba(148, 163, 184, 0.2)',
                      borderRadius: 999,
                      overflow: 'hidden',
                    }}
                  >
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: isActive ? '#25D366' : '#F59E0B',
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Area Owner Outreach Planner (Feature F35 / Menu 9.1) */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.82)',
          border: '1px solid rgba(236, 72, 153, 0.35)',
          borderRadius: 12,
          padding: 14,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h3 style={{ margin: 0, color: '#FDF2F8', fontSize: 15 }}>
              📅 Area Owner Outreach Planner (Feature F35 · Menu 9.1)
            </h3>
            <p style={{ margin: '4px 0 0 0', color: '#F9A8D4', fontSize: 12 }}>
              NewConversationBudget Guard (Asia/Dubai) · Existing Chats Free · Safe Daily Cap
            </p>
          </div>
          <button
            type="button"
            onClick={() => onQueueOutreachBatch(selectedCluster)}
            style={{
              background: 'rgba(236, 72, 153, 0.22)',
              border: '1px solid rgba(236, 72, 153, 0.55)',
              color: '#FCE7F3',
              borderRadius: 8,
              padding: '6px 12px',
              fontSize: 11,
              fontWeight: 700,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Send size={12} /> Dispatch Safe Batch ({selectedCluster})
          </button>
        </div>

        {/* Budget Meter Bar */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 8,
            marginBottom: 10,
            background: 'rgba(2, 6, 23, 0.65)',
            padding: 10,
            borderRadius: 8,
            fontSize: 11,
          }}
        >
          <div>
            <span style={{ color: '#94A3B8' }}>Daily Budget (GST):</span>
            <div style={{ color: '#4ADE80', fontWeight: 700, fontSize: 13 }}>8 / 15 New Chats</div>
          </div>
          <div>
            <span style={{ color: '#94A3B8' }}>Monthly Budget:</span>
            <div style={{ color: '#38BDF8', fontWeight: 700, fontSize: 13 }}>64 / 250 Chats</div>
          </div>
          <div>
            <span style={{ color: '#94A3B8' }}>Existing Threads:</span>
            <div style={{ color: '#FDE047', fontWeight: 700, fontSize: 13 }}>Unlimited (0 Cost)</div>
          </div>
        </div>

        {/* Cluster Filter Pills & Search */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {clusters.map(cluster => (
              <button
                key={cluster}
                type="button"
                onClick={() => setSelectedCluster(cluster)}
                style={{
                  background:
                    selectedCluster === cluster ? 'rgba(236, 72, 153, 0.3)' : 'rgba(15, 23, 42, 0.9)',
                  border:
                    selectedCluster === cluster
                      ? '1px solid #EC4899'
                      : '1px solid rgba(148, 163, 184, 0.25)',
                  color: selectedCluster === cluster ? '#FCE7F3' : '#CBD5E1',
                  borderRadius: 6,
                  padding: '4px 9px',
                  fontSize: 11,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {cluster}
              </button>
            ))}
          </div>

          <input
            type="text"
            placeholder="Search owners / unit…"
            value={searchOwner}
            onChange={e => setSearchOwner(e.target.value)}
            style={{
              background: 'rgba(2, 6, 23, 0.75)',
              border: '1px solid rgba(236, 72, 153, 0.35)',
              borderRadius: 6,
              padding: '4px 8px',
              fontSize: 11,
              color: '#F8FAFC',
              width: 150,
            }}
          />
        </div>

        {/* Owners Schedule Table */}
        <div style={{ maxHeight: 220, overflowY: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 11, color: '#E2E8F0' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(148,163,184,0.2)', textAlign: 'left', color: '#94A3B8' }}>
                <th style={{ padding: '6px' }}>Owner</th>
                <th style={{ padding: '6px' }}>Cluster / Unit</th>
                <th style={{ padding: '6px' }}>Schedule</th>
                <th style={{ padding: '6px' }}>Archer</th>
              </tr>
            </thead>
            <tbody>
              {filteredOwners.map(owner => (
                <tr key={owner.rowNumber} style={{ borderBottom: '1px solid rgba(148,163,184,0.1)' }}>
                  <td style={{ padding: '6px' }}>
                    <div style={{ fontWeight: 600 }}>{owner.name}</div>
                    <div style={{ color: '#94A3B8', fontFamily: 'monospace', fontSize: 10 }}>
                      {owner.phone} {owner.gorahaVerified ? '· ✅ Goraha' : ''}
                    </div>
                  </td>
                  <td style={{ padding: '6px' }}>
                    <div>{owner.project}</div>
                    <div style={{ color: '#94A3B8', fontSize: 10 }}>
                      {owner.unitNumber} ({owner.bedrooms})
                    </div>
                  </td>
                  <td style={{ padding: '6px' }}>
                    <span
                      style={{
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontSize: 10,
                        fontWeight: 700,
                        background:
                          owner.status === 'Existing Chat'
                            ? 'rgba(56, 189, 248, 0.18)'
                            : owner.status === 'Send Today'
                              ? 'rgba(34, 197, 94, 0.2)'
                              : 'rgba(234, 179, 8, 0.18)',
                        color:
                          owner.status === 'Existing Chat'
                            ? '#7DD3FC'
                            : owner.status === 'Send Today'
                              ? '#86EFAC'
                              : '#FDE047',
                      }}
                    >
                      {owner.status}
                    </span>
                    <div style={{ fontSize: 10, color: '#94A3B8', marginTop: 2 }}>
                      <Calendar size={9} style={{ display: 'inline', marginRight: 3 }} />
                      {owner.scheduledDate}
                    </div>
                  </td>
                  <td style={{ padding: '6px' }}>
                    <span
                      style={{
                        color: owner.archerTier === 'HOT' ? '#F87171' : '#FBBF24',
                        fontWeight: 700,
                      }}
                    >
                      🔥 {owner.archerTier}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

interface ConversationsAndPillarsProps {
  conversations: LindaConversationItem[];
  pillars: LindaPillarItem[];
  liveLogs: string[];
  onSendQuickReply: (conv: LindaConversationItem) => void;
}

export const LindaConversationsAndPillarsPanel: React.FC<ConversationsAndPillarsProps> = ({
  conversations,
  pillars,
  liveLogs,
  onSendQuickReply,
}) => {
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* Conversation Analyzer (F34 / 8.11) & Mary Inventory Match */}
      <div
        style={{
          background: 'rgba(15, 23, 42, 0.82)',
          border: '1px solid rgba(139, 92, 246, 0.35)',
          borderRadius: 12,
          padding: 14,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h3 style={{ margin: 0, color: '#F5F3FF', fontSize: 15 }}>
              💬 WhatsApp Conversation Analyzer (F34 · Menu 8.11) & Mary Inventory Match
            </h3>
            <p style={{ margin: '4px 0 0 0', color: '#C4B5FD', fontSize: 12 }}>
              CONSUMES ← Nina Intents & Mary Inventory Snapshots · FEEDS → Clara Lead Qualification & Henry Audit
            </p>
          </div>
          <span style={{ fontSize: 11, color: '#A78BFA', fontWeight: 700 }}>
            Confidence Gate: ≥ 70% Auto-Assisted
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 12 }}>
          {conversations.map(conv => (
            <div
              key={conv.id}
              style={{
                background: 'rgba(2, 6, 23, 0.7)',
                border: '1px solid rgba(139, 92, 246, 0.28)',
                borderRadius: 10,
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 8,
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <strong style={{ color: '#F8FAFC', fontSize: 13 }}>{conv.contactName}</strong>
                    <span
                      style={{
                        fontSize: 9,
                        padding: '1px 5px',
                        borderRadius: 4,
                        fontWeight: 800,
                        background:
                          conv.sentiment === 'URGENT'
                            ? 'rgba(239, 68, 68, 0.2)'
                            : 'rgba(34, 197, 94, 0.2)',
                        color: conv.sentiment === 'URGENT' ? '#FCA5A5' : '#86EFAC',
                      }}
                    >
                      {conv.sentiment}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: 10,
                      padding: '2px 6px',
                      borderRadius: 4,
                      background: 'rgba(34, 197, 94, 0.18)',
                      color: '#86EFAC',
                      fontWeight: 700,
                    }}
                  >
                    {conv.confidence}% AI Confidence
                  </span>
                </div>
                <div style={{ fontSize: 11, color: '#94A3B8', marginTop: 2 }}>
                  {conv.phone} · {conv.cluster} ({conv.unit})
                </div>
                <div
                  style={{
                    marginTop: 8,
                    padding: '6px 8px',
                    background: 'rgba(15, 23, 42, 0.9)',
                    borderRadius: 6,
                    fontSize: 12,
                    color: '#E2E8F0',
                    fontStyle: 'italic',
                  }}
                >
                  “{conv.lastMessage}”
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: '#67E8F9' }}>
                  <strong>Intent:</strong> {conv.intent}
                </div>
                <div style={{ marginTop: 4, fontSize: 11, color: '#FDE047' }}>
                  <strong>🏠 Mary Match:</strong> {conv.maryMatch}
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 6 }}>
                <span style={{ fontSize: 10, color: '#94A3B8' }}>
                  {conv.gorahaSaved ? '✅ Saved in Goraha' : '⚠️ Unsaved'} · {conv.timestamp}
                </span>
                <button
                  type="button"
                  onClick={() => onSendQuickReply(conv)}
                  style={{
                    background: 'rgba(37, 211, 102, 0.2)',
                    border: '1px solid rgba(37, 211, 102, 0.5)',
                    color: '#DCFCE7',
                    borderRadius: 6,
                    padding: '4px 10px',
                    fontSize: 11,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <MessageSquare size={11} /> Dispatch AI Reply
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10 Architectural Pillars (200/200 Upgrades) + Live Event Stream (LogViewer.jsx) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
        <div
          style={{
            background: 'rgba(15, 23, 42, 0.82)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            borderRadius: 12,
            padding: 14,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <Layers size={16} color="#38BDF8" />
            <h3 style={{ margin: 0, color: '#F0F9FF', fontSize: 14 }}>
              🏛️ Linda Master System Registry — 10 Pillars (200/200 Upgrades Active)
            </h3>
          </div>
          <div style={{ display: 'grid', gap: 6, maxHeight: 230, overflowY: 'auto' }}>
            {pillars.map(p => (
              <div
                key={p.id}
                style={{
                  background: 'rgba(2, 6, 23, 0.65)',
                  border: '1px solid rgba(148, 163, 184, 0.16)',
                  borderRadius: 8,
                  padding: '6px 10px',
                  fontSize: 11,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#E2E8F0', fontWeight: 700 }}>
                  <span>
                    <strong style={{ color: '#38BDF8' }}>{p.id}:</strong> {p.name}
                  </span>
                  <span style={{ color: '#4ADE80' }}>
                    <ShieldCheck size={11} style={{ display: 'inline', marginRight: 3 }} />
                    {p.upgrades} {p.status}
                  </span>
                </div>
                <div style={{ color: '#94A3B8', fontSize: 10, marginTop: 2 }}>{p.highlight}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Event Stream (LogViewer.jsx) */}
        <div
          style={{
            background: '#090D16',
            border: '1px solid rgba(34, 197, 94, 0.35)',
            borderRadius: 12,
            padding: 14,
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Radio size={15} color="#4ADE80" />
              <h3 style={{ margin: 0, color: '#ECFDF5', fontSize: 14 }}>
                📡 Real-Time Bot Event Stream & Audit Log
              </h3>
            </div>
            <span style={{ fontSize: 10, color: '#4ADE80', fontFamily: 'monospace' }}>● STREAMING LIVE</span>
          </div>
          <div
            style={{
              background: '#020617',
              borderRadius: 8,
              padding: 10,
              fontFamily: 'monospace',
              fontSize: 11,
              color: '#A7F3D0',
              maxHeight: 230,
              overflowY: 'auto',
              lineHeight: 1.55,
            }}
          >
            {liveLogs.map((entry, idx) => (
              <div key={idx} style={{ marginBottom: 4 }}>
                {entry}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
