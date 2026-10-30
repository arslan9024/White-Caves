import React from 'react';
import { motion } from 'framer-motion';
import { ContactRowItemData } from './types';

export const ContactRow = React.memo(({ index, style, data }: { index: number; style: React.CSSProperties; data: ContactRowItemData }) => {
  const { contacts, activeContactId, onSelect } = data;
  const contact = contacts[index];
  const isSelected = activeContactId && contact.id === activeContactId;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(contact.id)}
      style={{
        ...style,
        background: isSelected ? '#FFFFFF' : 'transparent',
        border: isSelected ? '1.5px solid #25D366' : '1px solid transparent',
        borderRadius: '10px',
        padding: '10px',
        cursor: 'pointer',
        transition: 'background 0.15s ease, border 0.15s ease',
        boxShadow: isSelected ? '0 2px 8px rgba(37, 211, 102, 0.12)' : 'none',
        marginBottom: '4px',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
        <span style={{ fontWeight: 800, fontSize: '0.86rem', color: 'var(--color-1e293b, #1E293B)' }}>
          {contact.avatar} {contact.name}
        </span>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #64748B)' }}>{contact.lastMessageTime}</span>
      </div>

      <span style={{ fontSize: '0.75rem', color: 'var(--color-06b6d4, #06B6D4)', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
        {contact.phone}
      </span>

      <p style={{ margin: 0, fontSize: '0.76rem', color: 'var(--color-475569, #475569)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
        {contact.lastMessage}
      </p>
    </motion.div>
  );
});

ContactRow.displayName = 'ContactRow';

