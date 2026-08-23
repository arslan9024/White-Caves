import React, { FC, useState } from 'react';
import styled from 'styled-components';

const ModalContainer = styled.div`
  padding: 1.5rem;
  background: #0F172A;
  border: 2px solid #25D366;
  border-radius: 16px;
  color: #FFFFFF;
`;

export const WhatsAppPairingModal: FC = () => {
  const [pairingCode] = useState('8K29-WF94');

  return (
    <ModalContainer data-testid="whatsapp-pairing-modal">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <h4 style={{ margin: 0, color: 'var(--color-25d366, #25D366)' }}>💬 WhatsApp Web Pairing Code Modal</h4>
        <span style={{ fontSize: '0.75rem', background: 'rgba(37,211,102,0.15)', color: 'var(--color-25d366, #25D366)', padding: '4px 10px', borderRadius: '12px' }}>
          LOCAL AUTH ACTIVE
        </span>
      </div>

      <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--color-1e293b, #1E293B)', borderRadius: '10px' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--color-94a3b8, #94A3B8)' }}>Enter this pairing code on your WhatsApp mobile app:</span>
        <div style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--color-25d366, #25D366)', letterSpacing: '4px', margin: '12px 0' }}>
          {pairingCode}
        </div>
        <span style={{ fontSize: '0.75rem', color: 'var(--color-94a3b8, #94A3B8)' }}>Linking account to Nadia & Nina NLP multi-agent router</span>
      </div>
    </ModalContainer>
  );
};

export default WhatsAppPairingModal;
