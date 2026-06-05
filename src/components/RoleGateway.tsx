import React, { useState, useEffect, type ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveRole } from '../store/navigationSlice';
import * as S from './RoleGateway.styles';
import { safeStorage } from '../utils/safeStorage';
import type { AppDispatch } from '../store/store';
import {
  CANONICAL_SUPERUSER_ROLE,
  isCreatorSuperUserEmail,
  normalizeRoleForUserContext,
} from '../utils/superUserAccess';

interface RoleOption {
  id: string;
  label: string;
  icon: string;
  description: string;
}

const ROLES: RoleOption[] = [
  { id: 'buyer', label: 'Buyer', icon: '🏠', description: 'Looking to purchase property in Dubai' },
  {
    id: 'seller',
    label: 'Seller',
    icon: '💰',
    description: 'Selling residential or commercial property',
  },
  {
    id: 'landlord',
    label: 'Landlord',
    icon: '🔑',
    description: 'Renting out properties to tenants',
  },
  {
    id: 'leasing-agent',
    label: 'Leasing Agent',
    icon: '📋',
    description: 'Professional agent handling rental properties',
  },
  {
    id: 'secondary-sales-agent',
    label: 'Secondary Sales Agent',
    icon: '🏗',
    description: 'Professional agent handling property sales',
  },
  {
    id: 'leasing-team-leader',
    label: 'Leasing Team Leader',
    icon: '👔',
    description: 'Managing leasing agents team',
  },
  {
    id: 'sales-team-leader',
    label: 'Sales Team Leader',
    icon: '📈',
    description: 'Managing secondary sales agents team',
  },
  {
    id: 'admin',
    label: 'Administrator',
    icon: '⚙️',
    description: 'Platform administration and management',
  },
];

interface RoleGatewayProps {
  user: { email?: string; role?: string; [key: string]: unknown };
  onRoleSelect?: (role: string) => void;
}

export default function RoleGateway({ user, onRoleSelect }: RoleGatewayProps) {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const isCreatorAccount = isCreatorSuperUserEmail(user?.email);
    const normalizedUserRole = normalizeRoleForUserContext(user?.role, user?.email);
    const shouldAutoRoute = isCreatorAccount || normalizedUserRole === 'admin';

    if (shouldAutoRoute) {
      const privilegedRole = isCreatorAccount
        ? CANONICAL_SUPERUSER_ROLE
        : (normalizedUserRole ?? 'admin');
      const ownerRole = {
        role: privilegedRole,
        selectedAt: new Date().toISOString(),
        locked: true,
        isOwner: isCreatorAccount,
        isSuperUser: isCreatorAccount,
      };
      safeStorage.setJSON('userRole', ownerRole);
      dispatch(setActiveRole(privilegedRole));
      navigate('/profile');
    }
  }, [user, navigate, dispatch]);

  const handleRoleSelect = (roleId: string): void => {
    setSelectedRole(roleId);
  };

  const handleConfirm = (): void => {
    if (!selectedRole) return;

    const userRole = {
      role: selectedRole,
      selectedAt: new Date().toISOString(),
      locked: true,
    };

    safeStorage.setJSON('userRole', userRole);
    dispatch(setActiveRole(selectedRole));

    if (onRoleSelect) {
      onRoleSelect(selectedRole);
    }

    navigate('/profile');
  };

  return (
    <S.Container>
      <S.ContainerContent>
        <S.Header>
          <h1>Select Your Role</h1>
          <p>
            Please select your primary role to continue. This selection determines the content and
            features available to you.
          </p>
          <S.Warning>
            Note: Your role cannot be changed after selection without admin approval.
          </S.Warning>
        </S.Header>

        <S.RolesGrid>
          {ROLES.map(role => (
            <S.RoleCard
              key={role.id}
              $selected={selectedRole === role.id}
              onClick={() => handleRoleSelect(role.id)}
            >
              <S.RoleIcon>{role.icon}</S.RoleIcon>
              <S.RoleTitle>{role.label}</S.RoleTitle>
              <S.RoleDescription>{role.description}</S.RoleDescription>
              {selectedRole === role.id && (
                <S.RoleSelectedMark>✔</S.RoleSelectedMark>
              )}
            </S.RoleCard>
          ))}
        </S.RolesGrid>

        {selectedRole && (
          <S.ActionButtons>
            <S.RoleSelectionSummary>
              You selected: <strong>{ROLES.find(r => r.id === selectedRole)?.label}</strong>
            </S.RoleSelectionSummary>
            <S.Button $variant="primary" onClick={handleConfirm}>
              Confirm Selection & Continue
            </S.Button>
          </S.ActionButtons>
        )}
      </S.ContainerContent>
    </S.Container>
  );
}

interface UserRoleData {
  role: string;
  selectedAt: string;
  locked: boolean;
  [key: string]: unknown;
}

function useUserRole(): UserRoleData | null {
  const [userRole] = useState<UserRoleData | null>(() =>
    safeStorage.getJSON<UserRoleData>('userRole')
  );

  return userRole;
}

interface RoleGuardProps {
  allowedRoles: string[];
  children: ReactNode;
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const navigate = useNavigate();
  const userRole = useUserRole();

  useEffect(() => {
    if (!userRole) {
      navigate('/select-role');
      return;
    }

    if (!allowedRoles.includes(userRole.role)) {
      navigate('/profile');
    }
  }, [userRole, allowedRoles, navigate]);

  if (!userRole || !allowedRoles.includes(userRole.role)) {
    return null;
  }

  return <>{children}</>;
}
