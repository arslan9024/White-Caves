import React, { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setActiveRole, setCurrentModule, setCurrentSubModule } from '../../store/navigationSlice';
import { getDefaultModule } from '../../features/featureRegistry';
import type { RootState } from '../../store/store';
import { safeStorage } from '../../utils/safeStorage';
import {
  RoleSwitcherContainer,
  RoleSwitcherToggle,
  CurrentRoleIcon,
  CurrentRoleLabel,
  DropdownArrow,
  RoleSwitcherDropdown,
  DropdownHeader,
  RoleOption,
  RoleIcon,
  RoleInfo,
  RoleLabel,
  RoleDescription,
  RoleCheck,
} from './RoleSwitcher.styles';

interface RoleOptionItem {
  id: string;
  label: string;
  icon: string;
  description: string;
}

const ROLE_OPTIONS: RoleOptionItem[] = [
  { id: 'buyer', label: 'Buyer', icon: '🏠', description: 'Find your dream property' },
  { id: 'seller', label: 'Seller', icon: '🏢', description: 'List and sell properties' },
  { id: 'landlord', label: 'Landlord', icon: '👑', description: 'Manage rental properties' },
  { id: 'tenant', label: 'Tenant', icon: '🔑', description: 'Your rental home' },
  { id: 'leasing-agent', label: 'Leasing Agent', icon: '📝', description: 'Manage rentals' },
  { id: 'secondary-sales-agent', label: 'Sales Agent', icon: '👔', description: 'Close deals' },
  { id: 'owner', label: 'Owner', icon: '⚙️', description: 'System management' }
];

interface RoleSwitcherProps {
  compact?: boolean;
}

const RoleSwitcher: React.FC<RoleSwitcherProps> = ({ compact = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const currentRole = useSelector((state: RootState) => state.navigation.activeRole);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (roleId: string) => {
    dispatch(setActiveRole(roleId));
    
    const defaultModule = getDefaultModule(roleId);
    if (defaultModule) {
      dispatch(setCurrentModule(defaultModule.id));
      dispatch(setCurrentSubModule(defaultModule.defaultSubModule));
    }
    
    safeStorage.setJSON('userRole', { 
      role: roleId, 
      selectedAt: new Date().toISOString() 
    });
    
    navigate(`/${roleId}/dashboard`);
    setIsOpen(false);
  };

  const currentRoleOption = ROLE_OPTIONS.find(opt => opt.id === currentRole);

  return (
    <RoleSwitcherContainer ref={dropdownRef}>
      <RoleSwitcherToggle 
        $compact={compact}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Switch role"
        title="Switch User Role"
      >
        <CurrentRoleIcon>{currentRoleOption?.icon || '👤'}</CurrentRoleIcon>
        <CurrentRoleLabel $compact={compact}>{currentRoleOption?.label || 'Select Role'}</CurrentRoleLabel>
        <DropdownArrow $isOpen={isOpen}>▼</DropdownArrow>
      </RoleSwitcherToggle>
      
      {isOpen && (
        <RoleSwitcherDropdown>
          <DropdownHeader>Switch Role</DropdownHeader>
          {ROLE_OPTIONS.map((option) => (
            <RoleOption
              key={option.id}
              $isActive={currentRole === option.id}
              onClick={() => handleRoleChange(option.id)}
            >
              <RoleIcon $isActive={currentRole === option.id}>{option.icon}</RoleIcon>
              <RoleInfo>
                <RoleLabel>{option.label}</RoleLabel>
                <RoleDescription>{option.description}</RoleDescription>
              </RoleInfo>
              {currentRole === option.id && (
                <RoleCheck>✓</RoleCheck>
              )}
            </RoleOption>
          ))}
        </RoleSwitcherDropdown>
      )}
    </RoleSwitcherContainer>
  );
};

export default RoleSwitcher;
