import React from 'react';
import { List } from 'react-window';
import { ChatContact, ContactRowItemData } from './types';
import { ContactRow } from './ContactRow';

export interface ContactsInboxProps {
  totalCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filteredContacts: ChatContact[];
  listData: ContactRowItemData;
}

export const ContactsInbox: React.FC<ContactsInboxProps> = ({
  totalCount,
  searchQuery,
  onSearchChange,
  filteredContacts,
  listData,
}) => {
  return (
    <div
      style={{
        background: 'var(--color-f8fafc, #F8FAFC)',
        border: '1px solid var(--text-secondary, #E2E8F0)',
        borderRadius: '14px',
        padding: '1rem',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <div style={{ marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
          <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
            💬 Synced WhatsApp Chats ({totalCount})
          </h4>
        </div>

        <input
          type="text"
          placeholder="🔍 Search contacts or phone..."
          value={searchQuery}
          onChange={e => onSearchChange(e.target.value)}
          style={{
            width: '100%',
            padding: '8px 10px',
            borderRadius: '8px',
            border: '1px solid #CBD5E1',
            fontSize: '0.8rem',
            outline: 'none',
          }}
        />
      </div>

      {/* Contacts Stream Virtualized */}
      <div style={{ flex: 1, overflowY: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {filteredContacts.length > 0 ? (
          React.createElement(List as any, {
            height: 400,
            itemCount: filteredContacts.length,
            itemSize: 85,
            width: '100%',
            itemData: listData,
            children: ContactRow,
          })
        ) : (
          <div style={{ padding: '2rem 0.5rem', textAlign: 'center', color: 'var(--text-secondary, #64748B)' }}>
            <span style={{ fontSize: '2rem', display: 'block', marginBottom: '0.5rem' }}>📭</span>
            <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 700 }}>
              0 Conversations Synced. Click "+ New Live Chat" or link your device to load your real WhatsApp threads.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

