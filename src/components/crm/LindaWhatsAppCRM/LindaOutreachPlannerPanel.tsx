import React, { useState, memo } from 'react';
import { Send, Calendar } from 'lucide-react';
import type { LindaOutreachOwnerRow } from './LindaWhatsAppCRM.data';

export interface LindaOutreachPlannerPanelProps {
  outreachOwners: LindaOutreachOwnerRow[];
  onQueueOutreachBatch: (cluster: string) => void;
}

/**
 * LindaOutreachPlannerPanel — Area Owner Outreach Planner (F35 · Menu 9.1)
 * Modularized under AEGIS APOCALYPSE-AEG-042 (< 350 lines).
 */
export const LindaOutreachPlannerPanel: React.FC<LindaOutreachPlannerPanelProps> = memo(({
  outreachOwners,
  onQueueOutreachBatch,
}) => {
  const [selectedCluster, setSelectedCluster] = useState<string>('ALL');
  const [searchOwner, setSearchOwner] = useState<string>('');
  const clusters = ['ALL', 'VARDON', 'JANUSIA', 'SYMFONIA', 'AKOYA', 'MARINA', 'RANCHES'];

  const filteredOwners = outreachOwners.filter(o => {
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

  return (
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
  );
});
