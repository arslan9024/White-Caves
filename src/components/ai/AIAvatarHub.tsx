import React from 'react';
import { Bot, Activity, CheckCircle, Radio } from 'lucide-react';

export interface AIAvatarNode {
  id: string;
  name: string;
  role: string;
  status: 'ONLINE' | 'PROCESSING' | 'STANDBY';
  tasksProcessed: number;
  lastActiveTime: string;
  brandColor: string;
}

const DEFAULT_AVATARS: AIAvatarNode[] = [
  { id: 'node-01', name: 'Zoe', role: 'Chief Operations Coordinator', status: 'ONLINE', tasksProcessed: 1420, lastActiveTime: 'Just now', brandColor: '#EF4444' },
  { id: 'node-02', name: 'Nadia', role: 'WhatsApp 15-Min Lead SLA Engine', status: 'PROCESSING', tasksProcessed: 3890, lastActiveTime: '2s ago', brandColor: '#EF4444' },
  { id: 'node-03', name: 'Sentinel', role: 'RERA Compliance & AML Auditor', status: 'ONLINE', tasksProcessed: 890, lastActiveTime: '12s ago', brandColor: '#1E293B' },
  { id: 'node-04', name: 'Clara', role: 'Ejari & PDC Vault Specialist', status: 'STANDBY', tasksProcessed: 540, lastActiveTime: '1m ago', brandColor: '#64748B' },
  { id: 'node-05', name: 'Sophia', role: 'AVM Market Valuation Neural Net', status: 'ONLINE', tasksProcessed: 2150, lastActiveTime: '4s ago', brandColor: '#EF4444' },
];

export const AIAvatarHub: React.FC<{ avatars?: AIAvatarNode[] }> = ({ avatars = DEFAULT_AVATARS }) => {
  return (
    <div style={{ backgroundColor: 'var(--wc-surface-canvas, #FFFFFF)', border: '1px solid var(--wc-border-light, #E2E8F0)', borderRadius: '12px', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid var(--wc-border-light, #E2E8F0)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Bot size={22} color="var(--wc-red-primary, #EF4444)" />
          <div>
            <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 'bold', color: 'var(--wc-text-primary, #1E293B)' }}>AI Avatar Intelligence Hub</h3>
            <div style={{ fontSize: '12px', color: 'var(--wc-text-secondary, #64748B)' }}>5 Neural Nodes Operational</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: 'var(--wc-red-primary, #EF4444)', fontWeight: 'bold' }}>
          <Radio size={14} className="wc-pulse" /> Live Telemetry
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '12px' }}>
        {avatars.map((node) => (
          <div
            key={node.id}
            style={{
              padding: '16px',
              backgroundColor: 'var(--wc-surface-card, #F8FAFC)',
              border: '1px solid var(--wc-border-light, #E2E8F0)',
              borderRadius: '10px',
              textAlign: 'center',
            }}
          >
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--wc-red-primary, #EF4444)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px auto', fontSize: '18px', fontWeight: 'bold' }}>
              {node.name.substring(0, 1)}
            </div>
            <div style={{ fontSize: '14px', fontWeight: 'bold', color: 'var(--wc-text-primary, #1E293B)' }}>{node.name}</div>
            <div style={{ fontSize: '11px', color: 'var(--wc-text-secondary, #64748B)', height: '28px', margin: '4px 0 10px 0', lineHeight: '1.3' }}>{node.role}</div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '3px 8px', borderRadius: '12px', backgroundColor: node.status === 'ONLINE' || node.status === 'PROCESSING' ? 'rgba(239, 68, 68, 0.1)' : 'var(--wc-border-light, #E2E8F0)', color: node.status === 'ONLINE' || node.status === 'PROCESSING' ? 'var(--wc-red-primary, #EF4444)' : 'var(--wc-text-secondary, #64748B)', fontSize: '10px', fontWeight: 'bold' }}>
              <Activity size={10} /> {node.status}
            </div>
            <div style={{ fontSize: '10px', color: 'var(--wc-text-muted, #94A3B8)', marginTop: '8px' }}>{node.tasksProcessed.toLocaleString()} Ops</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIAvatarHub;
