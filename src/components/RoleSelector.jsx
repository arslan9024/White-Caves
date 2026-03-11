
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setActiveRole } from '../store/navigationSlice';
import { getRoleInfo } from '../config/ROLE_TAB_MAPPING';
import * as S from './RoleSelector.styles';

const AVAILABLE_ROLES = [
  { id: 'lion', label: 'Super User', canAccess: true },
  { id: 'buyer', label: 'Buyer', canAccess: true },
  { id: 'seller', label: 'Seller', canAccess: true },
  { id: 'landlord', label: 'Landlord', canAccess: true },
  { id: 'leasing-agent', label: 'Leasing Agent', canAccess: true },
  { id: 'secondary-sales-agent', label: 'Sales Agent', canAccess: true },
  { id: 'tenant', label: 'Tenant', canAccess: true },
];

export default function RoleSelector() {
  const dispatch = useDispatch();
  const currentRole = useSelector(state => state.navigation?.activeRole || 'buyer');
  const user = useSelector(state => state.user.currentUser);
  
  const [isOpen, setIsOpen] = useState(false);
  const [availableRoles, setAvailableRoles] = useState([]);
  
  // Load available roles on mount
  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      try {
        const roleData = JSON.parse(storedRole);
        // For now, make all roles available if user is logged in
        // In production, fetch from /api/user/available-roles
        setAvailableRoles(AVAILABLE_ROLES.filter(r => r.canAccess));
      } catch (e) {
        console.error('Failed to parse stored role:', e);
      }
    }
  }, [user]);
  
  const handleRoleChange = (newRole) => {
    // Update localStorage
    localStorage.setItem('userRole', JSON.stringify({
      role: newRole,
      selectedAt: new Date().toISOString(),
      locked: false
    }));
    
    // Update Redux
    dispatch(setActiveRole(newRole));
    
    // Close dropdown
    setIsOpen(false);
    
    // Log role switch for audit trail
    console.log(`User switched role from ${currentRole} to ${newRole}`);
  };
  
  const currentRoleInfo = getRoleInfo(currentRole);
  
  return (
    <S.Container>
      <S.Button
        onClick={() => setIsOpen(!isOpen)}
        title={`Current role: ${currentRoleInfo.label}`}
      >
        <S.Label>{currentRoleInfo.label}</S.Label>
        <S.DropdownIcon isOpen={isOpen}>▼</S.DropdownIcon>
      </S.Button>
      
      {isOpen && (
        <S.Dropdown>
          <S.DropdownHeader>
            <h3>Switch Role</h3>
            <p>Select a different role to access other features</p>
          </S.DropdownHeader>
          
          <S.DropdownList>
            {availableRoles.map(role => (
              <S.DropdownOption
                key={role.id}
                isActive={currentRole === role.id}
                onClick={() => handleRoleChange(role.id)}
                disabled={!role.canAccess}
              >
                <S.OptionLabel>{role.label}</S.OptionLabel>
                {currentRole === role.id && <S.OptionCheckmark>✓</S.OptionCheckmark>}
              </S.DropdownOption>
            ))}
          </S.DropdownList>
          
          <S.DropdownFooter>
            <S.RoleInfo>{currentRoleInfo.description}</S.RoleInfo>
          </S.DropdownFooter>
        </S.Dropdown>
      )}
    </S.Container>
  );
}
