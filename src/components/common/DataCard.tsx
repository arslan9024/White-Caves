import React, { ReactNode } from 'react';
import {
  DataCardWrapper,
  DataCardHeader,
  HeaderActions,
  ViewAllLink,
  DataCardContent,
  DataListItemContainer,
  ItemAvatar,
  AvatarText,
  AvatarIcon,
  ItemContent,
  ItemTitle,
  ItemSubtitle,
  ItemMeta,
  ItemStatus,
  ItemBadge,
  ItemActions,
  DataList,
} from './DataCard/DataCard.styles';

interface DataCardProps {
  title: string;
  viewAllLink?: string;
  viewAllText?: string;
  children?: ReactNode;
  className?: string;
  headerActions?: ReactNode;
  fullWidth?: boolean;
}

export default function DataCard({
  title,
  viewAllLink,
  viewAllText = 'View All',
  children,
  className = '',
  headerActions,
  fullWidth = false,
}: DataCardProps) {
  return (
    <DataCardWrapper className={`${fullWidth ? 'full-width' : ''} ${className}`}>
      <DataCardHeader>
        <h3>{title}</h3>
        <HeaderActions>
          {headerActions}
          {viewAllLink && (
            <ViewAllLink to={viewAllLink}>
              {viewAllText} →
            </ViewAllLink>
          )}
        </HeaderActions>
      </DataCardHeader>
      <DataCardContent>{children}</DataCardContent>
    </DataCardWrapper>
  );
}

export function DataCardGrid({ children, columns = 2, className = '' }: { children?: ReactNode; columns?: number; className?: string }) {
  return (
    <div
      className={`data-card-grid ${className}`}
      style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: '1.5rem' }}
    >
      {children}
    </div>
  );
}

export function DataListComponent({ children, className = '' }: { children?: ReactNode; className?: string }) {
  return <DataList className={className}>{children}</DataList>;
}

interface DataListItemProps {
  icon?: string | ReactNode;
  avatar?: string;
  avatarText?: string;
  title: string;
  subtitle?: string;
  meta?: ReactNode;
  status?: string;
  statusColor?: string;
  badge?: number | string;
  badgeColor?: string;
  actions?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function DataListItem({
  icon,
  avatar,
  avatarText,
  title,
  subtitle,
  meta,
  status,
  statusColor,
  badge,
  badgeColor,
  actions,
  onClick,
  className = '',
}: DataListItemProps) {
  return (
    <DataListItemContainer
      $clickable={!!onClick}
      onClick={onClick}
      className={className}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {(icon || avatar || avatarText) && (
        <ItemAvatar>
          {avatar ? <img src={avatar} alt={title} /> : avatarText ? <AvatarText>{avatarText}</AvatarText> : <AvatarIcon>{icon}</AvatarIcon>}
        </ItemAvatar>
      )}

      <ItemContent>
        <ItemTitle>{title}</ItemTitle>
        {subtitle && <ItemSubtitle>{subtitle}</ItemSubtitle>}
      </ItemContent>

      {meta && <ItemMeta>{meta}</ItemMeta>}

      {status && <ItemStatus $statusColor={statusColor}>{status}</ItemStatus>}

      {badge !== undefined && <ItemBadge $badgeColor={badgeColor}>{badge}</ItemBadge>}

      {actions && <ItemActions>{actions}</ItemActions>}
    </DataListItemContainer>
  );
}
