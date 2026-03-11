import React, { FC } from 'react';
import {
  SpinnerContainer,
  SpinnerWrapper,
  SpinnerRing,
  SpinnerText,
  SpinnerDots,
  SpinnerDot,
} from './Spinner.styles';

export type SpinnerSize = 'small' | 'medium' | 'large';
export type SpinnerVariant = 'ring' | 'dots' | 'bars' | 'pulse';

interface SpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  color?: string;
}

export const Spinner: FC<SpinnerProps> = ({
  size = 'medium',
  variant = 'ring',
  label,
  className = '',
  style,
  color = '#3b82f6',
}) => {
  const getSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <SpinnerDots $size={size}>
            <SpinnerDot $color={color} $delay="0s" />
            <SpinnerDot $color={color} $delay="0.2s" />
            <SpinnerDot $color={color} $delay="0.4s" />
          </SpinnerDots>
        );
      case 'bars':
        return (
          <SpinnerRing $size={size} $variant="bars">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{ '--bar-index': i } as React.CSSProperties} />
            ))}
          </SpinnerRing>
        );
      case 'pulse':
        return <SpinnerWrapper $size={size} $variant="pulse" $color={color} />;
      case 'ring':
      default:
        return <SpinnerRing $size={size} $variant="ring" $color={color} />;
    }
  };

  return (
    <SpinnerContainer className={className} style={style}>
      {getSpinner()}
      {label && <SpinnerText>{label}</SpinnerText>}
    </SpinnerContainer>
  );
};

interface LoadingOverlayProps {
  isLoading: boolean;
  children?: React.ReactNode;
  spinnerSize?: SpinnerSize;
  spinnerVariant?: SpinnerVariant;
  label?: string;
  transparent?: boolean;
}

export const LoadingOverlay: FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  spinnerSize = 'medium',
  spinnerVariant = 'ring',
  label = 'Loading...',
  transparent = false,
}) => {
  if (!isLoading) {
    return <>{children}</>;
  }

  return (
    <SpinnerWrapper
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: transparent ? 'rgba(0, 0, 0, 0.3)' : 'rgba(0, 0, 0, 0.5)',
        zIndex: 9999,
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <Spinner size={spinnerSize} variant={spinnerVariant} label={label} />
      </div>
    </SpinnerWrapper>
  );
};

export default Spinner;
