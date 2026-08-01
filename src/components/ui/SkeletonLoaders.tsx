import React from 'react';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const SkeletonText: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '16px',
  borderRadius = '4px',
  style,
}) => (
  <div
    className="wc-skeleton"
    style={{
      width,
      height,
      borderRadius,
      backgroundColor: '#E2E8F0',
      marginBottom: '8px',
      ...style,
    }}
  />
);

export const SkeletonCard: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
  <div
    className="wc-card"
    style={{
      padding: '20px',
      backgroundColor: '#FFFFFF',
      border: '1px solid #E2E8F0',
      borderRadius: '8px',
    }}
  >
    <SkeletonText width="40%" height="20px" style={{ marginBottom: '16px' }} />
    {Array.from({ length: rows }).map((_, idx) => (
      <SkeletonText
        key={idx}
        width={idx === rows - 1 ? '60%' : '100%'}
        height="14px"
      />
    ))}
  </div>
);

export const SkeletonTable: React.FC<{ columns?: number; rows?: number }> = ({
  columns = 5,
  rows = 4,
}) => (
  <div
    style={{
      width: '100%',
      backgroundColor: '#FFFFFF',
      borderRadius: '8px',
      border: '1px solid #E2E8F0',
      overflow: 'hidden',
    }}
  >
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gap: '12px',
        padding: '16px',
        backgroundColor: '#F8FAFC',
        borderBottom: '1px solid #E2E8F0',
      }}
    >
      {Array.from({ length: columns }).map((_, cIdx) => (
        <SkeletonText key={cIdx} height="16px" width="80%" />
      ))}
    </div>
    {Array.from({ length: rows }).map((_, rIdx) => (
      <div
        key={rIdx}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gap: '12px',
          padding: '16px',
          borderBottom: rIdx < rows - 1 ? '1px solid #F1F5F9' : 'none',
        }}
      >
        {Array.from({ length: columns }).map((_, cIdx) => (
          <SkeletonText key={cIdx} height="14px" width="70%" />
        ))}
      </div>
    ))}
  </div>
);

export default SkeletonCard;
