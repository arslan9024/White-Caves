import React from 'react';
import Card from '../ui/Card';
import * as S from './StatCard.styles';

const StatCard = React.memo(({
  title,
  value,
  change,
  changeType = 'neutral',
  icon,
  suffix,
  prefix,
  trend,
  trendLabel,
  loading = false,
  className = ''
}) => {
  const baseClass = 'wc-stat-card';
  const classes = [baseClass, className].filter(Boolean).join(' ');

  if (loading) {
    return (
      <Card elevated className={classes}>
        <S.StatCardSkeleton>
          <S.SkeletonLine $variant="title" />
          <S.SkeletonLine $variant="value" />
          <S.SkeletonLine $variant="change" />
        </S.StatCardSkeleton>
      </Card>
    );
  }

  return (
    <Card elevated className={classes}>
      <S.StatCardContainer>
        <S.StatCardHeader>
          <S.StatCardTitle>{title}</S.StatCardTitle>
          {icon && <S.StatCardIcon>{icon}</S.StatCardIcon>}
        </S.StatCardHeader>
        
        <S.StatCardValue>
          {prefix && <S.StatCardPrefix>{prefix}</S.StatCardPrefix>}
          <S.StatCardNumber>{value}</S.StatCardNumber>
          {suffix && <S.StatCardSuffix>{suffix}</S.StatCardSuffix>}
        </S.StatCardValue>

        {(change !== undefined || trend) && (
          <S.StatCardFooter>
            {change !== undefined && (
              <S.StatCardChange $type={changeType}>
                {changeType === 'positive' && '↑'}
                {changeType === 'negative' && '↓'}
                {change}
              </S.StatCardChange>
            )}
            {trendLabel && (
              <S.StatCardTrendLabel>{trendLabel}</S.StatCardTrendLabel>
            )}
          </S.StatCardFooter>
        )}
      </S.StatCardContainer>
    </Card>
  );
});

StatCard.displayName = 'StatCard';

export default StatCard;
