import React, { memo } from 'react';
import {
  ShieldCheck,
  MessageSquare,
  Radio,
  Layers,
} from 'lucide-react';
import { useTheme } from '../../../context/ThemeContext';
import type {
  LindaConversationItem,
  LindaPillarItem,
} from './LindaWhatsAppCRM.data';

export interface ConversationsAndPillarsProps {
  conversations: LindaConversationItem[];
  pillars: LindaPillarItem[];
  liveLogs: string[];
  onSendQuickReply: (conv: LindaConversationItem) => void;
}

/**
 * LindaConversationsAndPillarsPanel — WhatsApp Convo Analyzer, 10 Enterprise Pillars, and Event Stream
 * Modularized under AEGIS APOCALYPSE-AEG-042 (< 350 lines).
 */
export const LindaConversationsAndPillarsPanel: React.FC<ConversationsAndPillarsProps> = memo(({
  conversations,
  pillars,
  liveLogs,
  onSendQuickReply,
}) => {
  const { isDark } = useTheme();
  return (
    <div style={{ display: 'grid', gap: 16 }}>
      {/* Conversation Analyzer (F34 / 8.11) & Mary Inventory Match */}
      <div
        style={{
          background: isDark ? 'rgba(15, 23, 42, 0.82)' : '#FFFFFF',
          border: isDark ? '1px solid rgba(139, 92, 246, 0.35)' : '1px solid #E2E8F0',
          borderRadius: 12,
          padding: 14,
          boxShadow: isDark ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.04)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <h3 style={{ margin: 0, color: isDark ? '#F5F3FF' : '#0F172A', fontSize: 15, fontWeight: 700 }}>
              💬 WhatsApp Conversation Analyzer (F34 · Menu 8.11) & Mary Inventory Match
            </h3>
            <p style={{ margin: '4px 0 0 0', color: isDark ? '#C4B5FD' : '#64748B', fontSize: 12 }}>
              CONSUMES ← Nina Intents & Mary Inventory Snapshots · FEEDS → Clara Lead Qualification & Henry Audit
            </p>
          </div>
          <span style={{ fontSize: 11, color: isDark ? '#A78BFA' : '#7C3AED', fontWeight: 700 }}>
            Confidence Gate: ≥ 70% Auto-Assisted
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: 10 }}>
          {conversations.map(conv => (
            <div
              key={conv.id}
              style={{
                background: isDark ? '#0F172A' : '#F8FAFC',
                border: isDark ? '1px solid rgba(139, 92, 246, 0.25)' : '1px solid #E2E8F0',
                borderRadius: 8,
                padding: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontWeight: 700, color: isDark ? '#F1F5F9' : '#0F172A', fontSize: 13 }}>
                    {conv.contactName}
                  </div>
                  <div style={{ fontSize: 11, color: isDark ? '#94A3B8' : '#64748B', fontFamily: 'monospace' }}>
                    {conv.phone} · {conv.cluster}
                  </div>
                </div>
                <span
                  style={{
                    background: conv.confidence >= 80 ? 'rgba(34, 197, 94, 0.18)' : 'rgba(234, 179, 8, 0.18)',
                    color: conv.confidence >= 80 ? (isDark ? '#86EFAC' : '#15803D') : isDark ? '#FDE047' : '#854D0E',
                    fontSize: 10,
                    fontWeight: 700,
                    padding: '2px 6px',
                    borderRadius: 4,
                  }}
                >
                  {conv.intent} ({conv.confidence}%)
                </span>
              </div>

              <div
                style={{
                  background: isDark ? '#020617' : '#FFFFFF',
                  padding: 8,
                  borderRadius: 6,
                  fontSize: 11,
                  color: isDark ? '#E2E8F0' : '#334155',
                  fontStyle: 'italic',
                  border: isDark ? 'none' : '1px solid #E2E8F0',
                }}
              >
                "{conv.lastMessage}"
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 11 }}>
                <span style={{ color: isDark ? '#38BDF8' : '#0284C7', fontWeight: 600 }}>
                  🏠 Match: {conv.maryMatch || conv.unit}
                </span>
                <span style={{ color: isDark ? '#94A3B8' : '#64748B' }}>{conv.timestamp}</span>
              </div>

              <div
                style={{
                  background: isDark ? 'rgba(37, 211, 102, 0.12)' : '#DCFCE7',
                  border: isDark ? '1px solid rgba(37, 211, 102, 0.35)' : '1px solid #86EFAC',
                  padding: '6px 8px',
                  borderRadius: 6,
                  fontSize: 11,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ color: isDark ? '#BBF7D0' : '#14532D', fontWeight: 600 }}>
                  🤖 Suggested: {conv.intent === 'BUYER_INQUIRY' ? 'Send Brochure & Pricing' : 'Acknowledge Query'}
                </span>
                <button
                  type="button"
                  onClick={() => onSendQuickReply(conv)}
                  style={{
                    background: '#25D366',
                    color: '#FFFFFF',
                    border: 'none',
                    borderRadius: 4,
                    padding: '3px 8px',
                    fontSize: 10,
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 3,
                  }}
                >
                  <MessageSquare size={10} /> Send
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 10 Architectural Pillars & Live Event Stream Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: 16 }}>
        {/* 10 Enterprise Pillars */}
        <div
          style={{
            background: isDark ? 'rgba(15, 23, 42, 0.82)' : '#FFFFFF',
            border: isDark ? '1px solid rgba(56, 189, 248, 0.35)' : '1px solid #BAE6FD',
            borderRadius: 12,
            padding: 14,
            boxShadow: isDark ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Layers size={15} color={isDark ? '#38BDF8' : '#0284C7'} />
              <h3 style={{ margin: 0, color: isDark ? '#F0F9FF' : '#0F172A', fontSize: 14, fontWeight: 700 }}>
                🏛️ Linda Master System Registry — 10 Pillars
              </h3>
            </div>
            <span style={{ fontSize: 11, color: isDark ? '#38BDF8' : '#0284C7', fontWeight: 700 }}>10/10 Online</span>
          </div>

          <div style={{ display: 'grid', gap: 6 }}>
            {pillars.map(p => (
              <div
                key={p.id}
                style={{
                  background: isDark ? '#0F172A' : '#F8FAFC',
                  border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid #E2E8F0',
                  borderRadius: 6,
                  padding: '7px 10px',
                  fontSize: 11,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', color: isDark ? '#E2E8F0' : '#1E293B', fontWeight: 700 }}>
                  <span>
                    <strong style={{ color: isDark ? '#38BDF8' : '#0284C7' }}>{p.id}:</strong> {p.name}
                  </span>
                  <span style={{ color: isDark ? '#4ADE80' : '#16A34A' }}>
                    <ShieldCheck size={11} style={{ display: 'inline', marginRight: 3 }} />
                    {p.upgrades} {p.status}
                  </span>
                </div>
                <div style={{ color: isDark ? '#94A3B8' : '#64748B', fontSize: 10, marginTop: 2 }}>{p.highlight}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Event Stream (LogViewer.jsx) */}
        <div
          style={{
            background: isDark ? '#090D16' : '#FFFFFF',
            border: isDark ? '1px solid rgba(34, 197, 94, 0.35)' : '1px solid #CBD5E1',
            borderRadius: 12,
            padding: 14,
            boxShadow: isDark ? 'none' : '0 2px 8px rgba(0, 0, 0, 0.04)',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <Radio size={15} color={isDark ? '#4ADE80' : '#16A34A'} />
              <h3 style={{ margin: 0, color: isDark ? '#ECFDF5' : '#0F172A', fontSize: 14, fontWeight: 700 }}>
                📡 Real-Time Bot Event Stream & Audit Log
              </h3>
            </div>
            <span style={{ fontSize: 10, color: isDark ? '#4ADE80' : '#16A34A', fontFamily: 'monospace', fontWeight: 700 }}>● STREAMING LIVE</span>
          </div>
          <div
            style={{
              background: isDark ? '#020617' : '#F1F5F9',
              border: isDark ? 'none' : '1px solid #E2E8F0',
              borderRadius: 8,
              padding: 10,
              fontFamily: 'monospace',
              fontSize: 11,
              color: isDark ? '#A7F3D0' : '#0F766E',
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
});
