// FILE: src/pages/dashboard/GuestDashboardGatewayView.tsx
/**
 * White Caves Real Estate LLC - Guest Dashboard Gateway View
 * Standard: AEGIS Canonical 12-Way Architecture Standard & Single Purpose File Law
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Law T11 (Level 5 RBAC Boundary & Sovereign Privacy Vault)
 */

import React, { FC } from 'react';
import styled from 'styled-components';
import { ShieldCheck, Building2, Key, Briefcase, Lock, UserCheck } from 'lucide-react';
import { useUserRole, UserRole } from '../../context/UserRoleContext';

export interface GuestDashboardGatewayViewProps {
  onOpenRoleModal?: () => void;
  onNavigate?: (route: string) => void;
}

export const GuestDashboardGatewayView: FC<GuestDashboardGatewayViewProps> = ({
  onOpenRoleModal,
  onNavigate,
}) => {
  const { user, confirmRole, loginAsRole } = useUserRole();

  const handleSelectRole = (targetRole: UserRole, targetRoute: string) => {
    confirmRole(targetRole, user?.name);
    if (onNavigate) {
      onNavigate(targetRoute);
    }
  };

  return (
    <GatewayContainer data-testid="guest-dashboard-gateway">
      <HeroCard>
        <ShieldBadge>
          <ShieldCheck size={16} color="#EF4444" />
          <span>Sovereign Identity Gateway • Role Verification</span>
        </ShieldBadge>

        <HeroTitle>Welcome to White Caves Real Estate</HeroTitle>
        <HeroSubtitle>
          You are currently viewing the system as an unconfirmed guest (
          <EmailTag>{user?.email || 'Guest Session'}</EmailTag>). To protect confidential Dubai Land
          Department (DLD) escrow data and client records, please select your confirmed role to
          activate your portal.
        </HeroSubtitle>

        {onOpenRoleModal && (
          <VerifyCtaBtn onClick={onOpenRoleModal} data-testid="gateway-verify-role-btn">
            <UserCheck size={16} />
            <span>Confirm Account Role & Enter Portal</span>
          </VerifyCtaBtn>
        )}
      </HeroCard>

      <ChannelsGrid>
        {/* Channel 1: Landlord */}
        <ChannelCard data-testid="gateway-channel-landlord">
          <ChannelIconWrap $color="#EF4444">
            <Building2 size={24} color="#EF4444" />
          </ChannelIconWrap>
          <ChannelTitle>Property Landlord Asset Hub</ChannelTitle>
          <ChannelDesc>
            Designed exclusively for asset owners. Review net yields, post-dated cheque (PDC) escrow
            statuses, active tenancies, and approve maintenance quotes.
          </ChannelDesc>
          <ChannelBtn
            $color="#EF4444"
            onClick={() => handleSelectRole('landlord', '/dashboard/landlord')}
            data-testid="enter-landlord-btn"
          >
            Enter as Property Landlord →
          </ChannelBtn>
        </ChannelCard>

        {/* Channel 2: Tenant */}
        <ChannelCard data-testid="gateway-channel-tenant">
          <ChannelIconWrap $color="#10B981">
            <Key size={24} color="#10B981" />
          </ChannelIconWrap>
          <ChannelTitle>Tenant Self-Service Portal</ChannelTitle>
          <ChannelDesc>
            Official DLD Ejari lease details, UAE PASS digital contracts, scheduled rental cheque
            receipts, and move-in inspection snag resolution tracker.
          </ChannelDesc>
          <ChannelBtn
            $color="#10B981"
            onClick={() => handleSelectRole('tenant', '/dashboard/tenant')}
            data-testid="enter-tenant-btn"
          >
            Enter as Leasing Tenant →
          </ChannelBtn>
        </ChannelCard>

        {/* Channel 3: Broker */}
        <ChannelCard data-testid="gateway-channel-broker">
          <ChannelIconWrap $color="#3B82F6">
            <Briefcase size={24} color="#3B82F6" />
          </ChannelIconWrap>
          <ChannelTitle>Licensed Broker Hub</ChannelTitle>
          <ChannelDesc>
            Licensed agent workspace with gross commission calculations, 5% UAE VAT breakdowns,
            50/50 company split ledger, and 15-minute SLA client leads.
          </ChannelDesc>
          <ChannelBtn
            $color="#3B82F6"
            onClick={() => handleSelectRole('agent', '/dashboard/broker')}
            data-testid="enter-broker-btn"
          >
            Enter as Licensed Broker →
          </ChannelBtn>
        </ChannelCard>

        {/* Channel 4: Managing Director */}
        <ChannelCard data-testid="gateway-channel-founder">
          <ChannelIconWrap $color="#EAB308">
            <Lock size={24} color="#EAB308" />
          </ChannelIconWrap>
          <ChannelTitle>Directorate Sovereign Access</ChannelTitle>
          <ChannelDesc>
            Level 5 Executive MD Governance across all 12 corporate departments, 108 supervisors,
            financial ledgers, employee rosters, and AI command centers.
          </ChannelDesc>
          <ChannelBtn
            $color="#EAB308"
            onClick={() => loginAsRole('managing_director')}
            data-testid="enter-md-btn"
          >
            Founder Sovereign Access (L5) →
          </ChannelBtn>
        </ChannelCard>
      </ChannelsGrid>
    </GatewayContainer>
  );
};

const GatewayContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px;
  height: 100%;
  overflow-y: auto;
  background-color: #020617;
  color: #ffffff;
`;

const HeroCard = styled.div`
  background: linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 14px;
  padding: 28px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 14px;
  box-shadow: 0 10px 30px -10px rgba(0, 0, 0, 0.5);
`;

const ShieldBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 700;
  color: #ef4444;
  letter-spacing: 0.04em;
  text-transform: uppercase;
`;

const HeroTitle = styled.h1`
  font-size: 1.6rem;
  font-weight: 800;
  color: #ffffff;
  margin: 0;
  letter-spacing: -0.02em;
`;

const HeroSubtitle = styled.p`
  font-size: 0.88rem;
  color: #94a3b8;
  max-width: 780px;
  line-height: 1.5;
  margin: 0;
`;

const EmailTag = styled.span`
  color: #ef4444;
  font-weight: 600;
`;

const VerifyCtaBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background: #ef4444;
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.88rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 4px;
  &:hover {
    background: #dc2626;
    transform: translateY(-1px);
  }
`;

const ChannelsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 18px;
`;

const ChannelCard = styled.div`
  background: rgba(15, 23, 42, 0.7);
  border: 1px solid rgba(148, 163, 184, 0.12);
  border-radius: 12px;
  padding: 22px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all 0.2s ease;
  &:hover {
    border-color: rgba(239, 68, 68, 0.4);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px -10px rgba(0, 0, 0, 0.5);
  }
`;

const ChannelIconWrap = styled.div<{ $color: string }>`
  width: 44px;
  height: 44px;
  border-radius: 10px;
  background: ${props => `${props.$color}18`};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ChannelTitle = styled.h3`
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
`;

const ChannelDesc = styled.p`
  font-size: 0.8rem;
  color: #94a3b8;
  line-height: 1.45;
  margin: 0;
  flex: 1;
`;

const ChannelBtn = styled.button<{ $color: string }>`
  background: transparent;
  border: 1px solid ${props => `${props.$color}50`};
  color: ${props => props.$color};
  padding: 10px 14px;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
  transition: all 0.2s ease;
  margin-top: 8px;
  &:hover {
    background: ${props => `${props.$color}15`};
    border-color: ${props => props.$color};
  }
`;
