import React, { type ReactNode } from 'react';
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

interface StatCardProps {
  icon?: ReactNode;
  value: string | number;
  label: string;
  change?: string;
  positive?: boolean;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | string;
  onClick?: () => void;
  className?: string;
}

export default function StatCard({ 
  icon, 
  value, 
  label, 
  change, 
  positive = true,
  variant = 'default',
  onClick,
  className = ''
}: StatCardProps) {
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

interface StatCardGridProps {
  children: ReactNode;
  columns?: number;
  className?: string;
}

export function StatCardGrid({ children, columns = 4, className = '' }: StatCardGridProps) {
  return (
    <StatCardGridContainer 
      className={className}
      $columns={columns}
    >
      {children}
    </StatCardGridContainer>
  );
}
