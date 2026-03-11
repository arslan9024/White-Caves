import React, { memo } from 'react';
import * as S from './SummaryCard.styles';

interface SummaryCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  icon?: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  meta?: string;
  badge?: { text: string; color: string };
  onAction?: () => void;
  actionLabel?: string;
}

/**
 * SummaryCard - Summary Statistics Card Component
 * 
 * Displays summary statistics with variants for different states (primary, success, warning, danger).
 * Includes optional meta information, badges, and action buttons.
 * 
 * @example
 * <SummaryCard
 *   label="Total Orders"
 *   value="2,340"
 *   icon="📦"
 *   variant="success"
 *   meta="Updated 2 hours ago"
 *   badge={{ text: 'ACTIVE', color: '#10b981' }}
 *   actionLabel="View Details"
 *   onAction={handleView}
 * />
 */
const SummaryCard = memo(({
  label,
  value,
  subtext,
  icon = '📊',
  variant = 'primary',
  meta,
  badge,
  onAction,
  actionLabel = 'View'
}: SummaryCardProps) => {
  return (
    <S.SummaryCardContainer variant={variant}>
      <S.CardInner>
        <S.SummaryHeader>
          <S.SummaryLabel>{label}</S.SummaryLabel>
          {icon && <S.SummaryIcon>{icon}</S.SummaryIcon>}
        </S.SummaryHeader>

        <S.SummaryContent>
          <S.SummaryValue>{value}</S.SummaryValue>
          {subtext && <S.SummarySubtext>{subtext}</S.SummarySubtext>}
        </S.SummaryContent>

        <S.SummaryFooter>
          <S.SummaryMeta>{meta || 'Latest'}</S.SummaryMeta>
          {badge && (
            <S.SummaryBadge color={badge.color}>
              {badge.text}
            </S.SummaryBadge>
          )}
        </S.SummaryFooter>

        {onAction && (
          <S.SummaryAction onClick={onAction} style={{ marginTop: '12px', width: '100%' }}>
            {actionLabel}
          </S.SummaryAction>
        )}
      </S.CardInner>
    </S.SummaryCardContainer>
  );
});

SummaryCard.displayName = 'SummaryCard';

export default SummaryCard;
