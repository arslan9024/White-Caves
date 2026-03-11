import React from 'react';
import * as S from './SkeletonLoader.styles';

export const SkeletonText = ({ width = '100%', height = '16px', className = '' }) => (
  <S.SkeletonText style={{ width, height }} className={className} />
);

export const SkeletonCircle = ({ size = '40px', className = '' }) => (
  <S.SkeletonCircle style={{ width: size, height: size }} className={className} />
);

export const SkeletonCard = ({ className = '' }) => (
  <S.SkeletonCard className={className}>
    <S.SkeletonCardHeader>
      <SkeletonCircle size="48px" />
      <S.SkeletonCardTitle>
        <SkeletonText width="120px" height="18px" />
        <SkeletonText width="80px" height="14px" />
      </S.SkeletonCardTitle>
    </S.SkeletonCardHeader>
    <S.SkeletonCardBody>
      <SkeletonText width="100%" height="24px" />
      <SkeletonText width="60%" height="14px" />
    </S.SkeletonCardBody>
  </S.SkeletonCard>
);

export const SkeletonStatCard = ({ className = '' }) => (
  <S.SkeletonStatCard className={className}>
    <SkeletonCircle size="40px" />
    <S.SkeletonStatContent>
      <SkeletonText width="80px" height="12px" />
      <SkeletonText width="60px" height="24px" />
    </S.SkeletonStatContent>
  </S.SkeletonStatCard>
);

export const SkeletonTable = ({ rows = 5, columns = 4, className = '' }) => (
  <S.SkeletonTable className={className}>
    <S.SkeletonTableHeader>
      {Array.from({ length: columns }).map((_, i) => (
        <SkeletonText key={i} width="80px" height="14px" />
      ))}
    </S.SkeletonTableHeader>
    <S.SkeletonTableBody>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <S.SkeletonTableRow key={rowIdx}>
          {Array.from({ length: columns }).map((_, colIdx) => (
            <SkeletonText 
              key={colIdx} 
              width={colIdx === 0 ? '120px' : '80px'} 
              height="14px" 
            />
          ))}
        </S.SkeletonTableRow>
      ))}
    </S.SkeletonTableBody>
  </S.SkeletonTable>
);

export const SkeletonDashboard = () => (
  <S.SkeletonDashboardContainer>
    <S.SkeletonStatsRow>
      <SkeletonStatCard />
      <SkeletonStatCard />
      <SkeletonStatCard />
      <SkeletonStatCard />
    </S.SkeletonStatsRow>
    <S.SkeletonContentRow>
      <S.SkeletonMainContent>
        <SkeletonCard />
        <SkeletonTable rows={5} columns={4} />
      </S.SkeletonMainContent>
      <S.SkeletonSidebarContent>
        <SkeletonCard />
        <SkeletonCard />
      </S.SkeletonSidebarContent>
    </S.SkeletonContentRow>
  </S.SkeletonDashboardContainer>
);

export const EmptyState = ({ 
  icon: Icon,
  title = 'No data available',
  description = 'There is nothing to display at the moment.',
  action,
  actionLabel = 'Get Started'
}) => (
  <S.EmptyStateContainer>
    <S.EmptyStateIcon>
      {Icon && <Icon size={48} />}
    </S.EmptyStateIcon>
    <S.EmptyStateTitle>{title}</S.EmptyStateTitle>
    <S.EmptyStateDescription>{description}</S.EmptyStateDescription>
    {action && (
      <S.EmptyStateAction onClick={action}>
        {actionLabel}
      </S.EmptyStateAction>
    )}
  </S.EmptyStateContainer>
);

export default {
  SkeletonText,
  SkeletonCircle,
  SkeletonCard,
  SkeletonStatCard,
  SkeletonTable,
  SkeletonDashboard,
  EmptyState
};
