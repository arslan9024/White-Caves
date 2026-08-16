/**
 * ToastNotificationSystem — Wave 60 FE-GOAL-047
 * Luxury glassmorphic toast notification stack supporting Success, Error, Warning, and Info alerts
 * White Caves Real Estate LLC — UI/UX Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`from{transform:translateX(100%);opacity:0;}to{transform:translateX(0);opacity:1;}`;

const ToastStack = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 99999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 380px;
  pointer-events: none;
  font-family: 'Inter', sans-serif;
`;

const ToastCard = styled.div<{ $type: 'success' | 'error' | 'info' | 'warning' }>`
  pointer-events: auto;
  padding: 14px 18px;
  border-radius: 12px;
  background: rgba(15, 23, 42, 0.95);
  backdrop-filter: blur(12px);
  border: 1.5px solid ${p => 
    p.$type === 'error' ? '#EF4444' : 
    p.$type === 'success' ? '#10B981' : 
    p.$type === 'warning' ? '#F59E0B' : '#38BDF8'
  };
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  gap: 12px;
  animation: ${slideIn} 0.3s cubic-bezier(0.16, 1, 0.3, 1);
`;

const Icon = styled.span`
  font-size: 1.2rem;
  line-height: 1;
`;

const TBody = styled.div`
  flex: 1;
`;

const TTitle = styled.div`
  font-size: 0.82rem;
  font-weight: 800;
  color: #FFF;
`;

const TDesc = styled.div`
  font-size: 0.72rem;
  color: #94A3B8;
  margin-top: 2px;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: #64748B;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0;
  &:hover { color: #FFF; }
`;

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  description: string;
}

export const ToastNotificationSystem: FC = () => {
  const [toasts, setToasts] = useState<ToastMessage[]>([
    { id: '1', type: 'success', title: 'Form B MOU Signed', description: 'Digital cryptographic seal verified via DLD Gateway.' },
    { id: '2', type: 'info', title: 'New VIP Inbound Inquiry', description: 'Dr. Tariq Al Qasimi submitted an AED 65M inquiry.' },
  ]);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastStack data-testid="toast-notification-system">
      {toasts.map(toast => (
        <ToastCard key={toast.id} $type={toast.type}>
          <Icon>
            {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : toast.type === 'warning' ? '⚠️' : 'ℹ️'}
          </Icon>
          <TBody>
            <TTitle>{toast.title}</TTitle>
            <TDesc>{toast.description}</TDesc>
          </TBody>
          <CloseBtn onClick={() => removeToast(toast.id)}>✕</CloseBtn>
        </ToastCard>
      ))}
    </ToastStack>
  );
};

export default ToastNotificationSystem;
