import React from 'react';
import {
  Activity,
  Cpu,
  MessageSquare,
  PhoneCall,
  ShieldCheck,
  Smartphone,
  Workflow,
  TrendingUp,
  Zap,
} from 'lucide-react';
import type { LindaMetricsState } from './LindaWhatsAppCRM.types';

export interface LindaTelemetryGridProps {
  isDark: boolean;
  metrics: LindaMetricsState;
}

export const LindaTelemetryGrid: React.FC<LindaTelemetryGridProps> = ({ isDark, metrics }) => {
  const statCardStyle: React.CSSProperties = {
    background: isDark ? 'rgba(15, 23, 42, 0.85)' : '#FFFFFF',
    border: isDark ? '1px solid rgba(37, 211, 102, 0.32)' : '1px solid rgba(37, 211, 102, 0.45)',
    borderRadius: 12,
    padding: 14,
    minHeight: 92,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxShadow: isDark ? '0 4px 14px rgba(0, 0, 0, 0.25)' : '0 4px 12px rgba(15, 23, 42, 0.06)',
    transition: 'transform 0.2s ease, border-color 0.2s ease',
  };

  const secondaryTextColor = isDark ? '#94A3B8' : '#64748B';

  return (
    <div
      style={{
        display: 'grid',
        gap: 12,
        gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))',
      }}
    >
      <div style={statCardStyle}>
        <Activity size={17} color="#10B981" />
        <p style={{ margin: '6px 0 0 0', color: secondaryTextColor, fontSize: 11 }}>Master Bot Uptime</p>
        <strong style={{ color: isDark ? '#86EFAC' : '#059669', fontSize: 20 }}>{metrics.uptime}</strong>
      </div>
      <div style={statCardStyle}>
        <Smartphone size={17} color="#10B981" />
        <p style={{ margin: '6px 0 0 0', color: secondaryTextColor, fontSize: 11 }}>Linked Bot Sessions</p>
        <strong style={{ color: isDark ? '#86EFAC' : '#059669', fontSize: 20 }}>{metrics.activeSessions}</strong>
      </div>
      <div style={statCardStyle}>
        <Workflow size={17} color="#10B981" />
        <p style={{ margin: '6px 0 0 0', color: secondaryTextColor, fontSize: 11 }}>Anti-Ban Rate Limit</p>
        <strong style={{ color: isDark ? '#86EFAC' : '#059669', fontSize: 20 }}>{metrics.rateLimit}</strong>
      </div>
      <div style={statCardStyle}>
        <Cpu size={17} color="#10B981" />
        <p style={{ margin: '6px 0 0 0', color: secondaryTextColor, fontSize: 11 }}>Memory & Chromium</p>
        <strong style={{ color: isDark ? '#86EFAC' : '#059669', fontSize: 20 }}>{metrics.memory}</strong>
      </div>
      <div style={statCardStyle}>
        <MessageSquare size={17} color="#10B981" />
        <p style={{ margin: '6px 0 0 0', color: secondaryTextColor, fontSize: 11 }}>Active Conversations</p>
        <strong style={{ color: isDark ? '#86EFAC' : '#059669', fontSize: 20 }}>42</strong>
      </div>
      <div style={statCardStyle}>
        <PhoneCall size={17} color="#10B981" />
        <p style={{ margin: '6px 0 0 0', color: secondaryTextColor, fontSize: 11 }}>Handoffs to Sales</p>
        <strong style={{ color: isDark ? '#86EFAC' : '#059669', fontSize: 20 }}>17</strong>
      </div>
      <div style={statCardStyle}>
        <ShieldCheck size={17} color="#10B981" />
        <p style={{ margin: '6px 0 0 0', color: secondaryTextColor, fontSize: 11 }}>12-Point Health Doctor</p>
        <strong style={{ color: isDark ? '#86EFAC' : '#059669', fontSize: 20 }}>12/12 PASS</strong>
      </div>
      <div style={statCardStyle}>
        <TrendingUp size={17} color="#0284C7" />
        <p style={{ margin: '6px 0 0 0', color: secondaryTextColor, fontSize: 11 }}>Conversion Velocity</p>
        <strong style={{ color: isDark ? '#38BDF8' : '#0284C7', fontSize: 20 }}>{metrics.conversionVelocity}</strong>
      </div>
      <div style={statCardStyle}>
        <Zap size={17} color="#D97706" />
        <p style={{ margin: '6px 0 0 0', color: secondaryTextColor, fontSize: 11 }}>Anti-Ban Safety Score</p>
        <strong style={{ color: isDark ? '#FDE047' : '#D97706', fontSize: 20 }}>{metrics.antiBanSafetyScore}</strong>
      </div>
    </div>
  );
};
