import React from 'react';
import {
  StatCardGridContainer,
  StatCardWrapper,
  StatIconWrapper,
  StatIcon,
  StatInfo,
  StatValue,
  StatLabel,
  StatChange,
} from './StatCard.styles';

export default function StatCard({ 
  icon, 
  value, 
  label, 
  change, 
  positive = true,
  variant = 'default',
  onClick,
  className = ''
}) {
  return (
    <StatCardWrapper 
      className={className}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      $variant={variant}
      $clickable={!!onClick}
    >
      <StatIconWrapper $variant={variant}>
        <StatIcon>{icon}</StatIcon>
      </StatIconWrapper>
      <StatInfo>
        <StatValue>{value}</StatValue>
        <StatLabel>{label}</StatLabel>
        {change && (
          <StatChange $positive={positive}>
            {change}
          </StatChange>
        )}
      </StatInfo>
    </StatCardWrapper>
  );
}

export function StatCardGrid({ children, columns = 4, className = '' }) {
  return (
    <StatCardGridContainer 
      className={className}
      $columns={columns}
    >
      {children}
    </StatCardGridContainer>
  );
}
