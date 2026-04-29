import React from 'react';
import styled from 'styled-components';

/**
 * DataCard.tsx
 * Reusable card component for displaying data in dashboard views
 * Supports loading skeleton, animations, and flexible content
 */

const CardContainer = styled.div`
  background-color: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  &:hover:not([data-loading='true']) {
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    border-color: #d1d5db;
    transform: translateY(-2px);
  }

  ${(props) => props.hoverable === false && 'cursor: default;'}
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f3f4f6;
`;

const CardTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1f2937;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;

  svg {
    width: 20px;
    height: 20px;
    color: #6366f1;
  }
`;

const CardSubtitle = styled.p`
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0.25rem 0 0 0;
`;

const CardActions = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const CardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid #f3f4f6;
  font-size: 0.875rem;
  color: #6b7280;
`;

const SkeletonBase = styled.div`
  background: linear-gradient(
    90deg,
    #f3f4f6 0%,
    #e5e7eb 50%,
    #f3f4f6 100%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;

  @keyframes shimmer {
    0% {
      background-position: 200% 0;
    }
    100% {
      background-position: -200% 0;
    }
  }
`;

const SkeletonTitle = styled(SkeletonBase)`
  height: 1.25rem;
  width: 40%;
  border-radius: 4px;
  margin-bottom: 0.5rem;
`;

const SkeletonLine = styled(SkeletonBase)`
  height: 0.875rem;
  width: 100%;
  border-radius: 4px;
  margin-bottom: 0.5rem;

  &:last-child {
    margin-bottom: 0;
  }
`;

const SkeletonGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 0.75rem;
`;

const SkeletonCell = styled(SkeletonBase)`
  height: 2rem;
  border-radius: 4px;
`;

// Skeleton variants
const TitleSkeleton = () => <SkeletonTitle />;

const ContentSkeleton = () => (
  <>
    <SkeletonLine style={{ width: '100%' }} />
    <SkeletonLine style={{ width: '95%' }} />
    <SkeletonLine style={{ width: '85%' }} />
  </>
);

const GridSkeleton = ({ columns = 3 }) => (
  <SkeletonGrid style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
    {Array.from({ length: columns }).map((_, i) => (
      <SkeletonCell key={i} />
    ))}
  </SkeletonGrid>
);

const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    {Array.from({ length: rows }).map((_, i) => (
      <SkeletonGrid key={i} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
        {Array.from({ length: columns }).map((_, j) => (
          <SkeletonCell key={j} />
        ))}
      </SkeletonGrid>
    ))}
  </div>
);

/**
 * Main DataCard Component
 */
const DataCard = ({
  title,
  subtitle,
  icon,
  children,
  footer,
  actions,
  loading = false,
  skeleton = 'content',
  hoverable = true,
  onClick,
  className,
}) => {
  const handleClick = () => {
    if (!loading && hoverable && onClick) {
      onClick();
    }
  };

  return (
    <CardContainer
      data-loading={loading}
      hoverable={hoverable}
      onClick={handleClick}
      className={className}
      style={{ position: 'relative', cursor: hoverable && !loading ? 'pointer' : 'default' }}
    >
      {(title || subtitle || actions) && (
        <CardHeader>
          <div>
            {title && (
              <CardTitle>
                {icon}
                {loading ? <TitleSkeleton /> : title}
              </CardTitle>
            )}
            {subtitle && !loading && <CardSubtitle>{subtitle}</CardSubtitle>}
          </div>
          {actions && !loading && <CardActions>{actions}</CardActions>}
        </CardHeader>
      )}

      <CardBody>
        {loading ? (
          <>
            {skeleton === 'content' && <ContentSkeleton />}
            {skeleton === 'grid' && <GridSkeleton />}
            {skeleton === 'grid-4' && <GridSkeleton columns={4} />}
            {skeleton === 'table' && <TableSkeleton rows={5} columns={4} />}
            {skeleton === 'table-3' && <TableSkeleton rows={5} columns={3} />}
            {skeleton === 'custom' && children}
          </>
        ) : (
          children
        )}
      </CardBody>

      {footer && !loading && <CardFooter>{footer}</CardFooter>}
    </CardContainer>
  );
};

export default DataCard;

// Export skeleton components for use outside of DataCard
export { TitleSkeleton, ContentSkeleton, GridSkeleton, TableSkeleton };
