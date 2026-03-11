import React, { memo } from 'react';
import * as S from './KPICard.styles';

interface KPICardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  change?: number;
  period?: string;
  comparison?: string;
  color?: string;
  onClick?: () => void;
}

/**
 * KPICard - Key Performance Indicator Card
 * 
 * A visually appealing card component for displaying KPIs with trend indicators,
 * icons, and period comparisons. Supports dark theme and responsive design.
 * 
 * @example
 * <KPICard
 *   label="Total Revenue"
 *   value="$45,200"
 *   icon="📈"
 *   change={12.5}
 *   period="This Month"
 *   comparison="vs. Last Month"
 *   color="#3b82f6"
 * />
 */
const KPICard = memo(({
  label,
  value,
  icon = '📊',
  change,
  period = 'Last 30 days',
  comparison = 'vs. previous period',
  color = '#3b82f6',
  onClick
}: KPICardProps) => {
  const isPositive = change && change > 0;
  const [isHovered, setIsHovered] = React.useState(false);

  return (
    <S.KPICardContainer
      isHovered={isHovered}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`${label}: ${value}`}
    >
      <S.KPIHeader>
        <S.KPILabel>{label}</S.KPILabel>
        {icon && <S.KPIIcon color={color}>{icon}</S.KPIIcon>}
      </S.KPIHeader>

      <S.KPIValue>{value}</S.KPIValue>

      {change !== undefined && (
        <S.KPIChange positive={isPositive}>
          <S.KPITrend>
            {isPositive ? '↑' : '↓'}
          </S.KPITrend>
          <span>{Math.abs(change)}%</span>
        </S.KPIChange>
      )}

      <S.KPIFooter>
        <S.KPIPeriod>{period}</S.KPIPeriod>
        <S.KPIComparison>{comparison}</S.KPIComparison>
      </S.KPIFooter>
    </S.KPICardContainer>
  );
});

KPICard.displayName = 'KPICard';

export default KPICard;
