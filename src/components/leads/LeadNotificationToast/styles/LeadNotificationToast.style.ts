/** LeadNotificationToast.style.ts */
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`from { transform: translateX(120%); opacity: 0; } to { transform: translateX(0); opacity: 1; }`;

export const Container = styled.div`
  position: fixed; bottom: 1.25rem; right: 1.25rem; z-index: 9999;
  display: flex; flex-direction: column; gap: 0.5rem; max-width: 320px;
`;

export const Toast = styled.div<{ $type: string }>`
  background: #1e293b; color: #fff; border-radius: 10px; padding: 0.85rem 1rem;
  border-left: 4px solid ${({ $type }) =>
    $type === 'new_lead' ? '#ef4444' : $type === 'commission' ? '#22c55e' : $type === 'viewing' ? '#3b82f6' : '#f59e0b'};
  display: flex; align-items: flex-start; gap: 0.65rem;
  box-shadow: 0 8px 24px rgba(0,0,0,0.25);
  animation: ${slideIn} 0.3s ease;
`;

export const ToastIcon = styled.span`font-size: 1.125rem; flex-shrink: 0;`;
export const ToastBody = styled.div`flex: 1;`;
export const ToastTitle = styled.div`font-size: 0.8125rem; font-weight: 700;`;
export const ToastText = styled.div`font-size: 0.75rem; color: #94a3b8; margin-top: 0.15rem;`;
export const ToastTime = styled.div`font-size: 0.6875rem; color: #64748b; margin-top: 0.25rem;`;
export const CloseBtn = styled.button`
  background: none; border: none; color: #64748b; cursor: pointer; padding: 0.1rem; align-self: flex-start;
  &:hover { color: #ef4444; }
`;
export const SoundToggle = styled.button<{ $on: boolean }>`
  display: flex; align-items: center; gap: 0.35rem; background: none; border: 1px solid #334155;
  color: ${({ $on }) => ($on ? '#22c55e' : '#64748b')}; border-radius: 6px;
  padding: 0.25rem 0.6rem; font-size: 0.75rem; cursor: pointer; margin-left: auto;
`;
