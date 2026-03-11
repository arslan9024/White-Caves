import React, { FC } from 'react';
import {
  SkeletonContainer,
  SkeletonLine,
  SkeletonCircle,
  SkeletonBlock,
  SkeletonLoadingGrid,
  SkeletonLoadingText,
  SkeletonLoadingImage,
  SkeletonLoadingCard,
} from './SkeletonLoader.styles';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  className?: string;
  style?: React.CSSProperties;
}

export const Skeleton: FC<SkeletonProps> = ({
  variant = 'text',
  width = '100%',
  height = '20px',
  className = '',
  style,
}) => {
  const getComponent = () => {
    switch (variant) {
      case 'circular':
        return (
          <SkeletonCircle
            style={{
              width: width,
              height: height || width,
              ...style,
            }}
            className={className}
          />
        );
      case 'rectangular':
        return (
          <SkeletonBlock
            style={{ width, height, ...style }}
            className={className}
          />
        );
      case 'rounded':
        return (
          <SkeletonBlock
            $rounded
            style={{ width, height, ...style }}
            className={className}
          />
        );
      case 'text':
      default:
        return (
          <SkeletonLine
            style={{ width, height, ...style }}
            className={className}
          />
        );
    }
  };

  return getComponent();
};

interface SkeletonLoaderProps {
  variant?: 'card' | 'image' | 'text' | 'grid' | 'custom';
  count?: number;
  className?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}

export const SkeletonLoader: FC<SkeletonLoaderProps> = ({
  variant = 'text',
  count = 3,
  className = '',
  style,
  children,
}) => {
  switch (variant) {
    case 'card':
      return (
        <SkeletonLoadingCard className={className} style={style}>
          <Skeleton variant="rounded" width="100%" height="200px" />
          <div style={{ padding: '16px' }}>
            <Skeleton variant="text" width="80%" height="20px" />
            <Skeleton variant="text" width="100%" height="16px" style={{ marginTop: '8px' }} />
            <Skeleton variant="text" width="60%" height="16px" style={{ marginTop: '8px' }} />
          </div>
        </SkeletonLoadingCard>
      );

    case 'image':
      return (
        <SkeletonLoadingImage className={className} style={style}>
          <Skeleton variant="rectangular" width="100%" height="300px" />
        </SkeletonLoadingImage>
      );

    case 'grid':
      return (
        <SkeletonLoadingGrid className={className} style={style}>
          {Array.from({ length: count }).map((_, i) => (
            <SkeletonLoadingCard key={i}>
              <Skeleton variant="rounded" width="100%" height="150px" />
              <div style={{ padding: '12px' }}>
                <Skeleton variant="text" width="70%" height="16px" />
                <Skeleton variant="text" width="100%" height="14px" style={{ marginTop: '6px' }} />
              </div>
            </SkeletonLoadingCard>
          ))}
        </SkeletonLoadingGrid>
      );

    case 'text':
      return (
        <SkeletonLoadingText className={className} style={style}>
          {Array.from({ length: count }).map((_, i) => (
            <Skeleton
              key={i}
              variant="text"
              width={i === count - 1 ? '80%' : '100%'}
              height="16px"
              style={{ marginBottom: i < count - 1 ? '8px' : 0 }}
            />
          ))}
        </SkeletonLoadingText>
      );

    case 'custom':
      return (
        <SkeletonContainer className={className} style={style}>
          {children}
        </SkeletonContainer>
      );

    default:
      return null;
  }
};

export default SkeletonLoader;
