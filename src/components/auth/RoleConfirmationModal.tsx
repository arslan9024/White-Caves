// FILE: src/components/auth/RoleConfirmationModal.tsx
/**
 * White Caves Real Estate LLC - Sovereign Role Confirmation & Onboarding Modal
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Single Purpose File Law
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Law T11 & T20 (Server-Enforced Role Confirmation)
 */

import React, { FC, useState } from 'react';
import { Shield, Building2, Key, Briefcase, Search, CheckCircle2, X, Clock } from 'lucide-react';
import { useUserRole, UserRole, ROLE_LABELS } from '../../context/UserRoleContext';
import { completeSocialRegistration } from '../../services/authService';
import { safeStorage } from '../../utils/safeStorage';
import {
  OverlayBackdrop,
  ModalCard,
  HeaderRow,
  HeaderTitleWrap,
  ModalTitle,
  ModalSubtitle,
  UserHighlight,
  CloseBtn,
  NoticeBox,
  StatusBanner,
  RolesGrid,
  RoleCard,
  RoleCardTop,
  IconWrapper,
  RoleBadge,
  RoleCardTitle,
  RoleCardDesc,
  SelectedIndicator,
  FooterRow,
  CancelBtn,
  ConfirmBtn,
} from './RoleConfirmationModal.styles';

export interface RoleConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoleConfirmed?: (role: UserRole) => void;
}

interface RoleOption {
  role: UserRole;
  category: 'client' | 'staff';
  title: string;
  badge: string;
  desc: string;
  icon: React.ReactNode;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'landlord',
    category: 'client',
    title: 'Property Landlord (Asset Owner)',
    badge: 'Tier 2 • Owner',
    desc: 'Access net rental yield statements, PDC escrow cheques, and approve tenant maintenance requests.',
    icon: <Building2 size={24} color="#EF4444" />,
  },
  {
    role: 'tenant',
    category: 'client',
    title: 'Leasing Tenant (Resident)',
    badge: 'Tier 2 • Resident',
    desc: 'Review official DLD Ejari contracts, UAE PASS digital signatures, rental receipts, and move-in snags.',
    icon: <Key size={24} color="#10B981" />,
  },
  {
    role: 'agent',
    category: 'staff',
    title: 'Licensed Broker (Requires Approval)',
    badge: 'Tier 1 • Admin Approval',
    desc: 'Request broker access for gross commissions, 5% UAE VAT, RERA BRN verification, and 15-min leads.',
    icon: <Briefcase size={24} color="#3B82F6" />,
  },
  {
    role: 'buyer',
    category: 'client',
    title: 'Property Buyer / Investor',
    badge: 'Tier 2 • Investor',
    desc: 'Explore curated Palm Jumeirah & Downtown luxury villas, schedule private viewings, and sign Form B.',
    icon: <Search size={24} color="#F59E0B" />,
  },
];

const BROKER_PENDING_MESSAGE =
  'Broker access pending admin approval — your request has been submitted for Managing Director & RERA BRN verification.';

export const RoleConfirmationModal: FC<RoleConfirmationModalProps> = ({
  isOpen,
  onClose,
  onRoleConfirmed,
}) => {
  const { user, confirmRole } = useUserRole();
  const [selectedRole, setSelectedRole] = useState<UserRole>('landlord');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [pendingNotice, setPendingNotice] = useState<string | null>(null);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsSubmitting(true);
    setErrorNotice(null);
    setPendingNotice(null);

    const category = selectedRole === 'agent' ? 'staff' : 'client';
    const hasServerToken = Boolean(safeStorage.get('token'));

    try {
      const response = await completeSocialRegistration(category, selectedRole);
      const serverRole = (response?.data?.user?.role ||
        (category === 'staff' ? 'guest' : selectedRole)) as UserRole;
      const isPending = Boolean(response?.data?.pendingApproval) || category === 'staff';

      if (response?.data?.token) {
        safeStorage.set('token', response.data.token);
        safeStorage.set('whitecaves_token', response.data.token);
      }
      if (response?.data?.user) {
        safeStorage.setJSON('user', response.data.user);
      }

      if (isPending) {
        setPendingNotice(BROKER_PENDING_MESSAGE);
        setIsSubmitting(false);
        return;
      }

      confirmRole(serverRole, response?.data?.user?.name || user?.name);
      setIsSubmitting(false);
      onRoleConfirmed?.(serverRole);
      onClose();
    } catch (err: unknown) {
      if (hasServerToken) {
        const msg =
          err instanceof Error && err.message
            ? err.message
            : 'Unable to confirm role on the server. Please try again.';
        setErrorNotice(msg);
        setIsSubmitting(false);
        return;
      }

      if (category === 'staff') {
        setPendingNotice(BROKER_PENDING_MESSAGE);
        setIsSubmitting(false);
        return;
      }

      confirmRole(selectedRole, user?.name);
      setIsSubmitting(false);
      onRoleConfirmed?.(selectedRole);
      onClose();
    }
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
          White Caves requires server-verified role assignment to protect Dubai Land Department
          (DLD) escrow data, title deeds, and lease records under UAE PDPL regulations.
        </NoticeBox>

        {pendingNotice && (
          <StatusBanner $tone="pending" data-testid="broker-pending-approval-banner">
            <Clock size={16} />
            <span>{pendingNotice}</span>
          </StatusBanner>
        )}

        {errorNotice && (
          <StatusBanner $tone="error" data-testid="role-confirmation-error-banner">
            <span>{errorNotice}</span>
          </StatusBanner>
        )}

        <RolesGrid>
          {ROLE_OPTIONS.map(opt => {
            const isSelected = selectedRole === opt.role;
            return (
              <RoleCard
                key={opt.role}
                $isSelected={isSelected}
                onClick={() => {
                  setSelectedRole(opt.role);
                  setPendingNotice(null);
                  setErrorNotice(null);
                }}
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
              ? 'Verifying Role...'
              : selectedRole === 'agent'
                ? 'Request Broker Approval'
                : `Confirm as ${(ROLE_LABELS[selectedRole] || 'Role').split(' ')[0]}`}
          </ConfirmBtn>
        </FooterRow>
      </ModalCard>
    </OverlayBackdrop>
  );
};
