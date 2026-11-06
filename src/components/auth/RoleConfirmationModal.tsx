// FILE: src/components/auth/RoleConfirmationModal.tsx
/**
 * White Caves Real Estate LLC - Sovereign Role Confirmation & Onboarding Modal
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Single Purpose File Law
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Law T11 (Level 5 RBAC Boundary & Sovereign Privacy Vault)
 */

import React, { FC, useState } from 'react';
import styled from 'styled-components';
import { Shield, Building2, Key, Briefcase, Search, CheckCircle2, X } from 'lucide-react';
import { useUserRole, UserRole, ROLE_LABELS } from '../../context/UserRoleContext';

export interface RoleConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleConfirmed?: (role: UserRole) => void;
}

interface RoleOption {
  role: UserRole;
  title: string;
  badge: string;
  desc: string;
  icon: React.ReactNode;
  recommendedRoute: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'landlord',
    title: 'Property Landlord (Asset Owner)',
    badge: 'Tier 2 • Owner',
    desc: 'Access net rental yield statements, PDC escrow cheques, and approve tenant maintenance requests.',
    icon: <Building2 size={24} color="#EF4444" />,
    recommendedRoute: '/dashboard/landlord',
  },
  {
    role: 'tenant',
    title: 'Leasing Tenant (Resident)',
    badge: 'Tier 2 • Resident',
    desc: 'Review official DLD Ejari contracts, UAE PASS digital signatures, rental receipts, and move-in snags.',
    icon: <Key size={24} color="#10B981" />,
    recommendedRoute: '/dashboard/tenant',
  },
  {
    role: 'agent',
    title: 'Licensed Broker (Agent)',
    badge: 'Tier 1 • Broker',
    desc: 'Manage gross commissions, 5% UAE VAT, 50/50 company splits, RERA broker credentials, and 15-min leads.',
    icon: <Briefcase size={24} color="#3B82F6" />,
    recommendedRoute: '/dashboard/broker',
  },
  {
    role: 'buyer',
    title: 'Property Buyer / Investor',
    badge: 'Tier 2 • Investor',
    desc: 'Explore curated Palm Jumeirah & Downtown luxury villas, schedule private viewings, and sign Form B.',
    icon: <Search size={24} color="#F59E0B" />,
    recommendedRoute: '/properties',
  },
];

export const RoleConfirmationModal: FC<RoleConfirmationModalProps> = ({
  isOpen,
  onClose,
  onRoleConfirmed,
}) => {
  const { user, confirmRole } = useUserRole();
  const [selectedRole, setSelectedRole] = useState<UserRole>('landlord');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setIsSubmitting(true);
    confirmRole(selectedRole, user?.name);
    setTimeout(() => {
      setIsSubmitting(false);
      onRoleConfirmed?.(selectedRole);
      onClose();
    }, 250);
  };

  return (
    <OverlayBackdrop data-testid="role-confirmation-modal">
      <ModalCard>
        <HeaderRow>
          <HeaderTitleWrap>
            <Shield size={20} color="#EF4444" />
            <div>
              <ModalTitle>Confirm Your Sovereign Account Role</ModalTitle>
              <ModalSubtitle>
                Signed in as <UserHighlight>{user?.email || 'Authenticated User'}</UserHighlight>
              </ModalSubtitle>
            </div>
          </HeaderTitleWrap>
          <CloseBtn onClick={onClose} aria-label="Close role modal">
            <X size={18} />
          </CloseBtn>
        </HeaderRow>

        <NoticeBox>
          White Caves requires verified role assignment to protect Dubai Land Department (DLD)
          escrow data, title deeds, and lease records under UAE PDPL regulations.
        </NoticeBox>

        <RolesGrid>
          {ROLE_OPTIONS.map(opt => {
            const isSelected = selectedRole === opt.role;
            return (
              <RoleCard
                key={opt.role}
                $isSelected={isSelected}
                onClick={() => setSelectedRole(opt.role)}
                data-testid={`role-card-${opt.role}`}
              >
                <RoleCardTop>
                  <IconWrapper>{opt.icon}</IconWrapper>
                  <RoleBadge>{opt.badge}</RoleBadge>
                </RoleCardTop>
                <RoleCardTitle>{opt.title}</RoleCardTitle>
                <RoleCardDesc>{opt.desc}</RoleCardDesc>
                {isSelected && (
                  <SelectedIndicator>
                    <CheckCircle2 size={16} color="#EF4444" />
                    <span>Selected Workspace</span>
                  </SelectedIndicator>
                )}
              </RoleCard>
            );
          })}
        </RolesGrid>

        <FooterRow>
          <CancelBtn onClick={onClose}>Cancel</CancelBtn>
          <ConfirmBtn
            onClick={handleConfirm}
            disabled={isSubmitting}
            data-testid="confirm-role-submit-btn"
          >
            {isSubmitting
              ? 'Activating Portal...'
              : `Confirm as ${(ROLE_LABELS[selectedRole] || 'Role').split(' ')[0]}`}
          </ConfirmBtn>
        </FooterRow>
      </ModalCard>
    </OverlayBackdrop>
  );
};

const OverlayBackdrop = styled.div`
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

const ModalCard = styled.div`
  background: #0f172a;
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 14px;
  width: 100%;
  max-width: 680px;
  padding: 24px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7);
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
`;

const HeaderTitleWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const ModalTitle = styled.h2`
  font-size: 1.15rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

const ModalSubtitle = styled.p`
  font-size: 0.82rem;
  color: #94a3b8;
  margin: 2px 0 0;
`;

const UserHighlight = styled.span`
  color: #ef4444;
  font-weight: 600;
`;

const CloseBtn = styled.button`
  background: transparent;
  border: none;
  color: #64748b;
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  &:hover {
    color: #ffffff;
    background: rgba(255, 255, 255, 0.05);
  }
`;

const NoticeBox = styled.div`
  background: rgba(239, 68, 68, 0.08);
  border-left: 3px solid #ef4444;
  padding: 10px 14px;
  border-radius: 4px;
  font-size: 0.78rem;
  color: #cbd5e1;
  line-height: 1.4;
`;

const RolesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

const RoleCard = styled.div<{ $isSelected: boolean }>`
  background: ${props => (props.$isSelected ? 'rgba(239, 68, 68, 0.08)' : 'rgba(30, 41, 59, 0.6)')};
  border: 1px solid ${props => (props.$isSelected ? '#EF4444' : 'rgba(148, 163, 184, 0.15)')};
  border-radius: 10px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
  &:hover {
    border-color: #ef4444;
    background: rgba(239, 68, 68, 0.06);
  }
`;

const RoleCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const IconWrapper = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.04);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RoleBadge = styled.span`
  font-size: 0.68rem;
  font-weight: 700;
  color: #94a3b8;
  background: rgba(255, 255, 255, 0.05);
  padding: 2px 8px;
  border-radius: 12px;
`;

const RoleCardTitle = styled.h3`
  font-size: 0.92rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

const RoleCardDesc = styled.p`
  font-size: 0.75rem;
  color: #94a3b8;
  margin: 0;
  line-height: 1.35;
`;

const SelectedIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.72rem;
  font-weight: 700;
  color: #ef4444;
  margin-top: 4px;
`;

const FooterRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 8px;
`;

const CancelBtn = styled.button`
  background: transparent;
  border: 1px solid rgba(148, 163, 184, 0.2);
  color: #94a3b8;
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  &:hover {
    color: #ffffff;
    border-color: #ffffff;
  }
`;

const ConfirmBtn = styled.button`
  background: #ef4444;
  border: none;
  color: #ffffff;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #dc2626;
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;
