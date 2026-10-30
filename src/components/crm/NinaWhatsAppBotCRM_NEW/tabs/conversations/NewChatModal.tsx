import React from 'react';

export interface NewChatModalProps {
  show: boolean;
  newChatName: string;
  newChatPhone: string;
  onNameChange: (val: string) => void;
  onPhoneChange: (val: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  show,
  newChatName,
  newChatPhone,
  onNameChange,
  onPhoneChange,
  onSubmit,
  onClose,
}) => {
  if (!show) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ background: 'var(--white, #FFFFFF)', borderRadius: '16px', padding: '1.5rem', width: '90%', maxWidth: '420px' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.15rem', fontWeight: 800, color: 'var(--color-06b6d4, #06B6D4)' }}>
          ➕ Start Live WhatsApp Chat
        </h3>
        <form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
          <label>
            Client Name:
            <input
              type="text"
              value={newChatName}
              onChange={e => onNameChange(e.target.value)}
              required
              placeholder="e.g. Ahmed Al Mansoori"
              style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)' }}
            />
          </label>
          <label>
            WhatsApp Mobile Number:
            <input
              type="text"
              value={newChatPhone}
              onChange={e => onPhoneChange(e.target.value)}
              required
              placeholder="+971 50 123 4567"
              style={{ width: '100%', padding: '6px', borderRadius: '6px', border: '1px solid var(--text-secondary, #CBD5E1)' }}
            />
          </label>
          <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid var(--text-secondary, #CBD5E1)',
                background: 'var(--white, #FFFFFF)',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--color-06b6d4, #06B6D4)',
                color: 'var(--white, #FFFFFF)',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Start Chat
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

