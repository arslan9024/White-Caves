import React from 'react';
import * as S from './RoleSelector.styles';

const roles = [
  { id: 'buyer', label: 'Buyer', icon: '🏠', description: 'Looking to purchase property' },
  { id: 'seller', label: 'Seller', icon: '💰', description: 'Selling my property' },
  { id: 'tenant', label: 'Tenant', icon: '🔑', description: 'Renting a property' },
  { id: 'landlord', label: 'Landlord', icon: '🏢', description: 'Property owner renting out' },
  { id: 'agent', label: 'Agent', icon: '👔', description: 'Real estate professional' },
  { id: 'team_leader', label: 'Team Leader', icon: '👥', description: 'Managing a sales team' },
];

export default function RoleSelector({ currentRole, onRoleChange, compact = false }) {
  if (compact) {
    return (
      <S.CompactContainer>
        <S.CompactLabel>Your Role:</S.CompactLabel>
        <S.RoleSelect 
          value={currentRole || 'buyer'} 
          onChange={(e) => onRoleChange(e.target.value)}
        >
          {roles.map(role => (
            <option key={role.id} value={role.id}>
              {role.icon} {role.label}
            </option>
          ))}
        </S.RoleSelect>
      </S.CompactContainer>
    );
  }

  return (
    <S.Container>
      <S.Title>Select Your Role</S.Title>
      <S.Subtitle>Choose how you want to use White Caves</S.Subtitle>
      
      <S.RolesGrid>
        {roles.map(role => (
          <S.RoleCard
            key={role.id}
            active={currentRole === role.id}
            onClick={() => onRoleChange(role.id)}
          >
            <S.RoleIcon>{role.icon}</S.RoleIcon>
            <S.RoleLabel>{role.label}</S.RoleLabel>
            <S.RoleDescription>{role.description}</S.RoleDescription>
          </S.RoleCard>
        ))}
      </S.RolesGrid>
    </div>
  );
}
