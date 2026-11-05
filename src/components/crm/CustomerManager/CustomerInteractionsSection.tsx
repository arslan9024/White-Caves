/**
 * White Caves Real Estate LLC - Customer Interactions Section Component
 * Standard: AEGIS Canonical 7-Category Architecture Standard
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState } from 'react';
import { MessageSquare } from 'lucide-react';
import { CustomerInteraction } from './CustomerManager.types';

interface CustomerInteractionsSectionProps {
  customerId: string;
  interactions: CustomerInteraction[];
  agentName: string;
  onAddInteraction: (
    customerId: string,
    interaction: {
      date: string;
      channel: 'WHATSAPP' | 'CALL' | 'EMAIL' | 'MEETING';
      notes: string;
      agentName: string;
    }
  ) => void;
}

export const CustomerInteractionsSection: FC<CustomerInteractionsSectionProps> = ({
  customerId,
  interactions,
  agentName,
  onAddInteraction,
}) => {
  const [newNote, setNewNote] = useState('');
  const [channel, setChannel] = useState<'WHATSAPP' | 'CALL' | 'EMAIL' | 'MEETING'>('WHATSAPP');

  const handleInteractionSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddInteraction(customerId, {
      date: new Date().toISOString().split('T')[0],
      channel,
      notes: newNote,
      agentName: agentName || 'Arslan Malik',
    });
    setNewNote('');
  };

  return (
    <div>
      <h4
        style={{
          fontSize: '0.85rem',
          fontWeight: 800,
          color: '#38BDF8',
          margin: '0 0 10px 0',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <MessageSquare size={14} />
        Customer Touchpoints & Interaction History ({interactions.length})
      </h4>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '14px' }}>
        {interactions.map(item => (
          <div
            key={item.id}
            style={{
              padding: '10px 14px',
              background: 'rgba(0,0,0,0.25)',
              borderRadius: '6px',
              border: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '4px',
              }}
            >
              <span style={{ fontSize: '0.68rem', fontWeight: 800, color: '#34D399' }}>
                {item.channel} · {item.date}
              </span>
              <span style={{ fontSize: '0.7rem', color: '#94A3B8' }}>By: {item.agentName}</span>
            </div>
            <div style={{ fontSize: '0.8rem', color: '#F1F5F9' }}>{item.notes}</div>
          </div>
        ))}
      </div>

      {/* Quick Log Input */}
      <form onSubmit={handleInteractionSubmit} style={{ display: 'flex', gap: '8px' }}>
        <select
          value={channel}
          onChange={e => setChannel(e.target.value as any)}
          style={{
            background: '#0F172A',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '6px',
            color: '#FFFFFF',
            fontSize: '0.8rem',
            padding: '6px 10px',
          }}
        >
          <option value="WHATSAPP">WhatsApp</option>
          <option value="CALL">Phone Call</option>
          <option value="EMAIL">Email</option>
          <option value="MEETING">Meeting</option>
        </select>

        <input
          type="text"
          placeholder="Log a client interaction or note..."
          value={newNote}
          onChange={e => setNewNote(e.target.value)}
          data-testid="interaction-note-input"
          style={{
            flex: 1,
            background: '#0F172A',
            border: '1px solid rgba(255,255,255,0.15)',
            borderRadius: '6px',
            color: '#FFFFFF',
            fontSize: '0.8rem',
            padding: '6px 12px',
          }}
        />

        <button
          type="submit"
          data-testid="add-interaction-btn"
          style={{
            padding: '6px 14px',
            borderRadius: '6px',
            background: '#38BDF8',
            border: 'none',
            color: '#070D18',
            fontWeight: 700,
            fontSize: '0.8rem',
            cursor: 'pointer',
          }}
        >
          Log Touchpoint
        </button>
      </form>
    </div>
  );
};
