import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { safeStorage } from '../utils/safeStorage';
import {
  StyledOnboardingGateway,
  StyledGatewayContainer,
  StyledGatewayHeader,
  StyledGatewayTitle,
  StyledGatewaySubtitle,
  StyledGatewayDivider,
  StyledRoleTilesGrid,
  StyledOnboardingRoleTile,
  StyledTileAccentBar,
  StyledTileIconWrapper,
  StyledTileTextContent,
  StyledTileTitle,
  StyledTileSubtitle,
  StyledTileDescription,
  StyledTileArrow,
  StyledGatewayFooter,
  StyledFooterText,
  StyledFooterLink,
} from './OnboardingGateway.styles';

interface RoleOption {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  role: string;
  color: string;
}

interface UserRole {
  role: string;
  selectedAt: string;
  locked: boolean;
  fromGateway: boolean;
}

const OnboardingGateway: React.FC = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const roles: RoleOption[] = [
    {
      id: 'seller',
      title: 'Sell or List Property',
      subtitle: 'List your property with us',
      description: 'Get property valuations, manage listings, and receive offers from qualified buyers.',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 3L4 9v12h16V9l-8-6zm0 2.5L18 10v9H6v-9l6-4.5z"/>
          <path d="M10 14h4v5h-4v-5z"/>
        </svg>
      ),
      path: '/seller/dashboard',
      role: 'seller',
      color: '#D32F2F'
    },
    {
      id: 'buyer',
      title: 'Buy a Property',
      subtitle: "Find your dream home",
      description: 'Browse listings, compare properties, and use our mortgage calculator.',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
          <path d="M12 10h-2v2H8v-2H6V8h2V6h2v2h2v2z"/>
        </svg>
      ),
      path: '/buyer/dashboard',
      role: 'buyer',
      color: '#212121'
    },
    {
      id: 'tenant',
      title: 'Rent or Lease',
      subtitle: 'Find your next home',
      description: 'Browse rental properties, manage leases, and submit maintenance requests.',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.5 12c-2.48 0-4.5 2.02-4.5 4.5s2.02 4.5 4.5 4.5 4.5-2.02 4.5-4.5-2.02-4.5-4.5-4.5zm1.5 5h-2.5v-2.5h1V15h1.5v2z"/>
          <path d="M10 3L2 9v12h8.07c-.04-.32-.07-.66-.07-1 0-3.03 2.47-5.5 5.5-5.5.95 0 1.84.24 2.62.66V9l-8-6z"/>
        </svg>
      ),
      path: '/landlord/dashboard',
      role: 'landlord',
      color: '#00ACC1'
    },
    {
      id: 'employee',
      title: "I'm an Agent",
      subtitle: 'Staff & Team Portal',
      description: 'Access performance dashboards, manage leads, and internal team tools.',
      icon: (
        <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
          <path d="M20 9V7h-2v2h-2v2h2v2h2v-2h2V9h-2z"/>
        </svg>
      ),
      path: '/signin',
      role: 'agent',
      color: '#FFB300'
    }
  ];

  const handleRoleClick = (role: RoleOption): void => {
    setSelectedRole(role.id);
    setIsAnimating(true);

    const userRole: UserRole = {
      role: role.role,
      selectedAt: new Date().toISOString(),
      locked: false,
      fromGateway: true
    };
    safeStorage.setJSON('preferredRole', userRole);

    setTimeout(() => {
      navigate(role.path);
    }, 400);
  };

  return (
    <StyledOnboardingGateway>
      <StyledGatewayContainer>
        <StyledGatewayHeader>
          <StyledGatewayTitle>How can we assist you today?</StyledGatewayTitle>
          <StyledGatewaySubtitle>
            Select your role to access personalized features and services
          </StyledGatewaySubtitle>
          <StyledGatewayDivider></StyledGatewayDivider>
        </StyledGatewayHeader>

        <StyledRoleTilesGrid>
          {roles.map((role, index) => (
            <StyledOnboardingRoleTile
              key={role.id}
              $roleColor={role.color}
              $isSelected={selectedRole === role.id}
              $isFadingOut={isAnimating && selectedRole !== role.id}
              $animationDelay={`${index * 100}ms`}
              onClick={() => handleRoleClick(role)}
            >
              <StyledTileAccentBar $roleColor={role.color} />
              <StyledTileIconWrapper $backgroundColor={role.color}>
                {role.icon}
              </StyledTileIconWrapper>
              <StyledTileTextContent>
                <StyledTileTitle>{role.title}</StyledTileTitle>
                <StyledTileSubtitle $roleColor={role.color}>{role.subtitle}</StyledTileSubtitle>
                <StyledTileDescription>{role.description}</StyledTileDescription>
              </StyledTileTextContent>
              <StyledTileArrow $roleColor={role.color}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z"/>
                </svg>
              </StyledTileArrow>
            </StyledOnboardingRoleTile>
          ))}
        </StyledRoleTilesGrid>

        <StyledGatewayFooter>
          <StyledFooterText>Not sure where to start? <StyledFooterLink href="/contact">Contact our team</StyledFooterLink> for guidance.</StyledFooterText>
        </StyledGatewayFooter>
      </StyledGatewayContainer>
    </StyledOnboardingGateway>
  );
};

export default OnboardingGateway;
