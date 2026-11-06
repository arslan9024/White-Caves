// FILE: src/components/auth/RoleConfirmationModal.styles.ts
/**
 * White Caves Real Estate LLC - RoleConfirmationModal Styled Primitives
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Single Purpose File Law
 * Single Purpose File Law: < 350 lines
 */

import styled from 'styled-components';

export const OverlayBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(2, 6, 23, 0.85);
  backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`;

export const ModalCard = styled.div`
  background: #0f172a;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 14px;
  width: 100%;
  max-width: 680px;
  padding: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

export const HeaderTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const ModalTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

export const ModalSubtitle = styled.p`
  font-size: 0.82rem;
  color: #94a3b8;
  margin: 2px 0 0;
`;

export const UserHighlight = styled.span`
  color: #ef4444;
  font-weight: 600;
`;

export const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const NoticeBox = styled.div`
  background: rgba(239, 68, 68, 0.08);
  border-left: 3px solid #ef4444;
  padding: 10px 14px;
  border-radius: 4px;
  font-size: 0.78rem;
  color: #cbd5e1;
  line-height: 1.4;
`;

export const StatusBanner = styled.div<{ $tone: 'pending' | 'error' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  background: ${p =>
    p.$tone === 'pending' ? 'rgba(59, 130, 246, 0.12)' : 'rgba(239, 68, 68, 0.14)'};
  border: 1px solid ${p => (p.$tone === 'pending' ? '#3B82F6' : '#EF4444')};
  color: ${p => (p.$tone === 'pending' ? '#93C5FD' : '#FCA5A5')};
`;

export const RolesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const RoleCard = styled.div<{ $isSelected: boolean }>`
  background: ${p => (p.$isSelected ? 'rgba(239, 68, 68, 0.08)' : 'rgba(30, 41, 59, 0.6)')};
  border: 1px solid ${p => (p.$isSelected ? '#EF4444' : 'rgba(148, 163, 184, 0.15)')};
  border-radius: 10px;
  padding: 14px;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const RoleCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const IconWrapper = styled.div`
  width: 34px;
  height: 34px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RoleBadge = styled.span`
  font-size: 0.68rem;
  font-weight: 700;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 12px;
`;

export const RoleCardTitle = styled.h3`
  font-size: 0.9rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

export const RoleCardDesc = styled.p`
  font-size: 0.74rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.35;
`;

export const SelectedIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #ef4444;
  margin-top: 2px;
`;

export const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
`;

export const CancelBtn = styled.button`
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: #94a3b8;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
`;

export const ConfirmBtn = styled.button`
  background: #ef4444;
  border: none;
  color: #ffffff;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
