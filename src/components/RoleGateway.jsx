import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setActiveRole } from '../store/navigationSlice';
import * as S from './RoleGateway.styles';

const OWNER_EMAIL = 'arslanmalikgoraha@gmail.com';

const ROLES = [
  { id: 'buyer', label: 'Buyer', icon: '🏠', description: 'Looking to purchase property in Dubai' },
  { id: 'seller', label: 'Seller', icon: '💰', description: 'Selling residential or commercial property' },
  { id: 'landlord', label: 'Landlord', icon: '🔑', description: 'Renting out properties to tenants' },
  { id: 'leasing-agent', label: 'Leasing Agent', icon: '📋', description: 'Professional agent handling rental properties' },
  { id: 'secondary-sales-agent', label: 'Secondary Sales Agent', icon: '🏢', description: 'Professional agent handling property sales' },
  { id: 'leasing-team-leader', label: 'Leasing Team Leader', icon: '👥', description: 'Managing leasing agents team' },
  { id: 'sales-team-leader', label: 'Sales Team Leader', icon: '📊', description: 'Managing secondary sales agents team' },
  { id: 'admin', label: 'Administrator', icon: '⚙️', description: 'Platform administration and management' },
];

export default function RoleGateway({ user, onRoleSelect }) {
  const [selectedRole, setSelectedRole] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user?.email === OWNER_EMAIL) {
      // SUPER USER: Lion role (arslanmalikgoraha@gmail.com)
      const lionRole = {
        role: 'lion',  // Changed from 'owner' to 'lion' (super user status)
        selectedAt: new Date().toISOString(),
        locked: true,
        isOwner: true,
        isSuperUser: true
      };
      localStorage.setItem('userRole', JSON.stringify(lionRole));
      dispatch(setActiveRole('lion'));
      navigate('/lion/dashboard');  // Navigate to /lion/dashboard instead of /owner/dashboard
    }
  }, [user, navigate, dispatch]);

  const handleRoleSelect = (roleId) => {
    setSelectedRole(roleId);
  };

  const handleConfirm = () => {
    if (!selectedRole) return;
    
    const userRole = {
      role: selectedRole,
      selectedAt: new Date().toISOString(),
      locked: true
    };
    
    localStorage.setItem('userRole', JSON.stringify(userRole));
    dispatch(setActiveRole(selectedRole));
    
    if (onRoleSelect) {
      onRoleSelect(selectedRole);
    }
    
    // Navigate to unified /dashboard route (all normal users)
    navigate('/dashboard');
  };

  return (
    <S.Container>
      <S.ContainerContent>
        <S.Header>
          <h1>Select Your Role</h1>
          <p>Please select your primary role to continue. This selection determines the content and features available to you.</p>
          <S.Warning>Note: Your role cannot be changed after selection without admin approval.</S.Warning>
        </S.Header>

        <S.RolesGrid>
          {ROLES.map((role) => (
            <S.RoleCard
              key={role.id}
              selected={selectedRole === role.id}
              onClick={() => handleRoleSelect(role.id)}
            >
              <S.RoleIcon>{role.icon}</S.RoleIcon>
              <S.RoleTitle>{role.label}</S.RoleTitle>
              <S.RoleDescription>{role.description}</S.RoleDescription>
              {selectedRole === role.id && (
                <span style={{ fontSize: '1.5rem', marginTop: '1rem' }}>✓</span>
              )}
            </S.RoleCard>
          ))}
        </S.RolesGrid>

        {selectedRole && (
          <S.ActionButtons>
            <p style={{ gridColumn: '1 / -1', textAlign: 'center', marginBottom: '1rem' }}>
              You selected: <strong>{ROLES.find(r => r.id === selectedRole)?.label}</strong>
            </p>
            <S.Button variant="primary" onClick={handleConfirm}>
              Confirm Selection & Continue
            </S.Button>
          </S.ActionButtons>
        )}
      </S.ContainerContent>
    </S.Container>
  );
}

export function useUserRole() {
  const [userRole, setUserRole] = useState(null);
  
  useEffect(() => {
    const stored = localStorage.getItem('userRole');
    if (stored) {
      try {
        setUserRole(JSON.parse(stored));
      } catch (e) {
        setUserRole(null);
      }
    }
  }, []);
  
  return userRole;
}

export function RoleGuard({ allowedRoles, children }) {
  const navigate = useNavigate();
  const userRole = useUserRole();
  
  useEffect(() => {
    if (!userRole) {
      navigate('/select-role');
      return;
    }
    
    if (!allowedRoles.includes(userRole.role)) {
      navigate(`/${userRole.role}/dashboard`);
    }
  }, [userRole, allowedRoles, navigate]);
  
  if (!userRole || !allowedRoles.includes(userRole.role)) {
    return null;
  }
  
  return children;
}

export { ROLES };
