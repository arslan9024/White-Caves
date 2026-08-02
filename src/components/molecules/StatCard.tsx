import React, { FC, ReactNode } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'highlight' | 'compact';
}

const Card = styled(motion.div)<{ $variant: string }>`
  background: ${({ $variant }) =>
    $variant === 'highlight'
      ? 'linear-gradient(135deg, var(--wc-red-primary, #EF4444) 0%, #EF4444 100%)'
      : 'var(--wc-white, #FFFFFF)'
  };
  border: 1px solid ${({ $variant }) =>
    $variant === 'highlight' ? 'transparent' : '#F1F5F9'
  };
  border-radius: 14px;
  padding: ${({ $variant }) => $variant === 'compact' ? '16px' : '24px'};
  display: flex;
  flex-direction: column;
  gap: 8px;
  transition: box-shadow 0.3s ease, transform 0.25s ease;
  box-shadow: 0 2px 10px rgba(30, 41, 59, 0.05);

  &:hover {
    box-shadow: 0 8px 30px rgba(30, 41, 59, 0.1);
    transform: translateY(-2px);
  }
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const IconWrapper = styled.div<{ $highlight: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
  background: ${({ $highlight }) =>
    $highlight ? 'rgba(255,255,255,0.2)' : 'rgba(239, 68, 68, 0.1)'
  };
  color: ${({ $highlight }) =>
    $highlight ? '#FFFFFF' : 'var(--wc-red-primary, #EF4444)'
  };
`;

const TrendBadge = styled.span<{ $trend: string; $highlight: boolean }>`
  font-size: 0.75rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
  background: ${({ $trend, $highlight }) => {
    if ($highlight) return 'rgba(255,255,255,0.2)';
    return $trend === 'up' ? '#DCFCE7' : $trend === 'down' ? '#FEE2E2' : '#F1F5F9';
  }};
  color: ${({ $trend, $highlight }) => {
    if ($highlight) return '#FFFFFF';
    return $trend === 'up' ? '#16A34A' : $trend === 'down' ? '#EF4444' : '#64748B';
  }};
`;

const Value = styled.div<{ $highlight: boolean }>`
  font-size: 1.75rem;
  font-weight: 700;
  color: ${({ $highlight }) => $highlight ? '#FFFFFF' : 'var(--wc-slate, #1E293B)'};
  font-family: 'Inter', sans-serif;
  line-height: 1.2;
`;

const Label = styled.div<{ $highlight: boolean }>`
  font-size: 0.85rem;
  color: ${({ $highlight }) => $highlight ? 'rgba(255,255,255,0.8)' : '#64748B'};
  font-weight: 500;
`;

export const StatCard: FC<StatCardProps> = ({
  label,
  value,
  icon,
  trend = 'neutral',
  trendValue,
  variant = 'default',
}) => {
  const isHighlight = variant === 'highlight';

  return (
    <Card
      $variant={variant}
      whileHover={{ y: -2 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      role="region"
      aria-label={`${label}: ${value}`}
    >
      <TopRow>
        {icon && <IconWrapper $highlight={isHighlight}>{icon}</IconWrapper>}
        {trendValue && (
          <TrendBadge $trend={trend} $highlight={isHighlight}>
            {trend === 'up' ? '↑' : trend === 'down' ? '↓' : '—'} {trendValue}
          </TrendBadge>
        )}
      </TopRow>
      <Value $highlight={isHighlight}>{value}</Value>
      <Label $highlight={isHighlight}>{label}</Label>
    </Card>
  );
};
