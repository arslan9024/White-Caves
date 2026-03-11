import React, { FC, ReactNode } from 'react';
import {
  DividerContainer,
  DividerLine,
  DividerText,
  DividerWrapper,
} from './Divider.styles';

interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed' | 'dotted';
  margin?: string | number;
  thickness?: number;
  color?: string;
  children?: ReactNode;
  className?: string;
  style?: React.CSSProperties;
  flexItem?: boolean;
}

export const Divider: FC<DividerProps> = ({
  orientation = 'horizontal',
  variant = 'solid',
  margin = 16,
  thickness = 1,
  color,
  children,
  className = '',
  style,
  flexItem = false,
}) => {
  const isHorizontal = orientation === 'horizontal';
  const marginValue = typeof margin === 'number' ? `${margin}px` : margin;

  if (children) {
    return (
      <DividerWrapper
        $orientation={orientation}
        $margin={marginValue}
        $thickness={thickness}
        className={className}
        style={style}
      >
        <DividerLine $variant={variant} $color={color} />
        <DividerText>{children}</DividerText>
        <DividerLine $variant={variant} $color={color} />
      </DividerWrapper>
    );
  }

  return (
    <DividerContainer
      $orientation={orientation}
      $variant={variant}
      $margin={marginValue}
      $thickness={thickness}
      $color={color}
      $flexItem={flexItem}
      className={className}
      style={style}
      role="separator"
    />
  );
};

interface DividerGroupProps {
  children: ReactNode;
  direction?: 'row' | 'column';
  gap?: number;
  className?: string;
  style?: React.CSSProperties;
}

export const DividerGroup: FC<DividerGroupProps> = ({
  children,
  direction = 'column',
  gap = 16,
  className = '',
  style,
}) => {
  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: direction === 'row' ? 'row' : 'column',
        gap: `${gap}px`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export default Divider;
