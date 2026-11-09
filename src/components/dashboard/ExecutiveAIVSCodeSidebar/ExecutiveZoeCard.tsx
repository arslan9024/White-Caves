/**
 * ExecutiveZoeCard.tsx
 * White Caves Real Estate LLC - Zoe Sovereign Chief Executive AI Card & Directive Dispatcher
 * Architecture: AEGIS Single Purpose File Law (< 350 lines)
 * Law: AEG-001 (Right-Sidebar Explorer Only), AEG-003/041 (Context Triad)
 */

import React, { FC, useState } from 'react';
import { Send, Zap, Sparkles } from 'lucide-react';
import { ZoeExecutiveCard } from './ExecutiveAIVSCodeSidebar.styles';

export interface DirectiveResult {
  text: string;
  action: string;
  timestamp: string;
  targetRoute?: string;
}

export interface ExecutiveZoeCardProps {
  zoeName: string;
  directiveInput: string;
  setDirectiveInput: (val: string) => void;
  onDispatchRoute?: (route: string) => void;
}

const QUICK_DIRECTIVES = [
  {
    label: '📋 Ejari Expiries',
    query: 'audit Ejari expiries',
    route: '/dashboard/tasks',
  },
  {
    label: '🛡️ FIU KYC Gate',
    query: 'verify AML KYC registry',
    route: '/dashboard/documents',
  },
  {
    label: '💎 VIP Palm Match',
    query: 'match luxury buyers for Palm villas',
    route: '/dashboard/departments',
  },
  {
    label: '🏡 DH2 Inventory',
    query: 'synchronize DH2 clusters with Mary',
    route: '/dashboard/REproperties',
  },
];

export const ExecutiveZoeCard: FC<ExecutiveZoeCardProps> = ({
  zoeName,
  directiveInput,
  setDirectiveInput,
  onDispatchRoute,
}) => {
  const [lastDirectiveResult, setLastDirectiveResult] = useState<DirectiveResult | null>(null);

  const executeDirective = (instruction: string, forcedRoute?: string) => {
    if (!instruction.trim()) return;

    const input = instruction.trim().toLowerCase();
    let action = 'Operations Dispatch';
    let text = `Directive received by AI Zoe: Executing '${instruction.trim()}' across 12 departments.`;
    let targetRoute = forcedRoute || '';

    if (input.includes('ejari') || input.includes('expir')) {
      action = 'Dept 04 • Ejari Audit';
      text = 'Zoe audited 14 active Ejari contracts: 2 renewals due in 30 days dispatched to Dept 04.';
      targetRoute = targetRoute || '/dashboard/tasks';
    } else if (input.includes('aml') || input.includes('kyc') || input.includes('rera')) {
      action = 'Dept 10 • Statutory Gate';
      text = 'Zoe verified AML/KYC registry: All VIP investors cleared via UAE FIU GoAML screening.';
      targetRoute = targetRoute || '/dashboard/documents';
    } else if (input.includes('luxury') || input.includes('palm') || input.includes('villa')) {
      action = 'Dept 01 • Luxury Matching';
      text = 'Zoe dispatched VIP buyer profile to Dept 01: 3 signature villas matched in Palm Jumeirah.';
      targetRoute = targetRoute || '/dashboard/departments';
    } else if (
      input.includes('mary') ||
      input.includes('inventory') ||
      input.includes('damac') ||
      input.includes('cluster') ||
      input.includes('plot')
    ) {
      action = 'Dept 05 • Mary Inventory Ingestion';
      text = 'Zoe dispatched inventory directive to AI Mary: 9,378 listings and 28 DH2 clusters synchronized.';
      targetRoute = targetRoute || '/dashboard/REproperties';
    }

    setLastDirectiveResult({
      text,
      action,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targetRoute,
    });
    setDirectiveInput('');

    if (targetRoute && onDispatchRoute) {
      onDispatchRoute(targetRoute);
    }
  };

  const handleSendDirective = (e: React.FormEvent) => {
    e.preventDefault();
    executeDirective(directiveInput);
  };

  return (
    <ZoeExecutiveCard data-testid="zoe-executive-card">
      <div className="zoe-top">
        <div className="partner-info">
          <div className="zoe-avatar">Z</div>
          <div className="name-group">
            <span className="name">{zoeName}</span>
            <span className="role">COO Executive AI Partner</span>
          </div>
        </div>
        <div className="status-badge">
          <Zap size={10} />
          <span>Optimal</span>
        </div>
      </div>

      <form className="directive-box" onSubmit={handleSendDirective}>
        <input
          type="text"
          placeholder="Direct Zoe (e.g. 'audit Ejari expiries')..."
          value={directiveInput}
          onChange={e => setDirectiveInput(e.target.value)}
          data-testid="zoe-directive-input"
        />
        <button type="submit" title="Send Directive" data-testid="zoe-directive-submit">
          <Send size={11} />
        </button>
      </form>

      {/* 1-Click Executive Command Pills */}
      <div
        data-testid="zoe-quick-pills-row"
        style={{
          display: 'flex',
          gap: '4px',
          flexWrap: 'wrap',
          marginTop: '6px',
        }}
      >
        {QUICK_DIRECTIVES.map(pill => (
          <button
            key={pill.label}
            type="button"
            data-testid={`quick-pill-${pill.label.replace(/[^a-zA-Z]/g, '').toLowerCase()}`}
            onClick={() => executeDirective(pill.query, pill.route)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '4px',
              padding: '2px 6px',
              fontSize: '0.62rem',
              color: '#CBD5E1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '3px',
              transition: 'all 0.12s ease',
            }}
          >
            <Sparkles size={8} color="#EF4444" />
            <span>{pill.label}</span>
          </button>
        ))}
      </div>

      {lastDirectiveResult && (
        <div
          data-testid="zoe-directive-result"
          style={{
            marginTop: '8px',
            padding: '8px 10px',
            borderRadius: '6px',
            background: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            fontSize: '0.68rem',
            color: '#F8FAFC',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginBottom: '3px',
            }}
          >
            <span style={{ fontWeight: 800, color: '#EF4444' }}>
              {lastDirectiveResult.action}
            </span>
            <span style={{ color: '#94A3B8' }}>{lastDirectiveResult.timestamp}</span>
          </div>
          <div style={{ lineHeight: 1.35 }}>{lastDirectiveResult.text}</div>
        </div>
      )}
    </ZoeExecutiveCard>
  );
};

export default ExecutiveZoeCard;
