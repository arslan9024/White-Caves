import React, { FC, forwardRef } from 'react';
import styled, { css } from 'styled-components';

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  align?: string;
  justify?: string;
  wrap?: 'nowrap' | 'wrap' | 'wrap-reverse';
  gap?: string | number;
  bg?: string;
  p?: string | number;
  m?: string | number;
  w?: string | number;
  h?: string | number;
  flex?: string | number;
}

const StyledFlex = styled.div<FlexProps>`
  display: flex;
  ${({ direction }) =>
    direction &&
    css`
      flex-direction: ${direction};
    `}
  ${({ align }) =>
    align &&
    css`
      align-items: ${align};
    `}
  ${({ justify }) =>
    justify &&
    css`
      justify-content: ${justify};
    `}
  ${({ wrap }) =>
    wrap &&
    css`
      flex-wrap: ${wrap};
    `}
  ${({ gap }) =>
    gap &&
    css`
      gap: ${typeof gap === 'number' ? `${gap}px` : gap};
    `}
  ${({ bg }) =>
    bg &&
    css`
      background: ${bg};
    `}
  ${({ p }) =>
    p &&
    css`
      padding: ${typeof p === 'number' ? `${p}px` : p};
    `}
  ${({ m }) =>
    m &&
    css`
      margin: ${typeof m === 'number' ? `${m}px` : m};
    `}
  ${({ w }) =>
    w &&
    css`
      width: ${typeof w === 'number' ? `${w}px` : w};
    `}
  ${({ h }) =>
    h &&
    css`
      height: ${typeof h === 'number' ? `${h}px` : h};
    `}
  ${({ flex }) =>
    flex &&
    css`
      flex: ${flex};
    `}
`;

export const Flex = forwardRef<HTMLDivElement, FlexProps>(({ children, ...props }, ref) => (
  <StyledFlex ref={ref} {...props}>
    {children}
  </StyledFlex>
));
Flex.displayName = 'Flex';

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  templateColumns?: string;
  templateRows?: string;
  gap?: string | number;
  columnGap?: string | number;
  rowGap?: string | number;
  p?: string | number;
  m?: string | number;
  w?: string | number;
}

const StyledGrid = styled.div<GridProps>`
  display: grid;
  ${({ templateColumns }) =>
    templateColumns &&
    css`
      grid-template-columns: ${templateColumns};
    `}
  ${({ templateRows }) =>
    templateRows &&
    css`
      grid-template-rows: ${templateRows};
    `}
  ${({ gap }) =>
    gap &&
    css`
      gap: ${typeof gap === 'number' ? `${gap}px` : gap};
    `}
  ${({ columnGap }) =>
    columnGap &&
    css`
      column-gap: ${typeof columnGap === 'number' ? `${columnGap}px` : columnGap};
    `}
  ${({ rowGap }) =>
    rowGap &&
    css`
      row-gap: ${typeof rowGap === 'number' ? `${rowGap}px` : rowGap};
    `}
  ${({ p }) =>
    p &&
    css`
      padding: ${typeof p === 'number' ? `${p}px` : p};
    `}
  ${({ m }) =>
    m &&
    css`
      margin: ${typeof m === 'number' ? `${m}px` : m};
    `}
  ${({ w }) =>
    w &&
    css`
      width: ${typeof w === 'number' ? `${w}px` : w};
    `}
`;

export const Grid = forwardRef<HTMLDivElement, GridProps>(({ children, ...props }, ref) => (
  <StyledGrid ref={ref} {...props}>
    {children}
  </StyledGrid>
));
Grid.displayName = 'Grid';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'outline' | 'elevated' | 'filled';
  bg?: string;
  borderColor?: string;
  p?: string | number;
  borderRadius?: string;
}

const StyledCard = styled.div<CardProps>`
  position: relative;
  border-radius: ${({ borderRadius }) => borderRadius || '12px'};
  padding: ${({ p }) => (typeof p === 'number' ? `${p}px` : p || '16px')};
  background: ${({ bg }) => bg || 'var(--card-bg, #0F172A)'};
  color: var(--text-primary, #f8fafc);
  border: 1px solid ${({ borderColor }) => borderColor || 'rgba(255, 255, 255, 0.08)'};
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);

  [data-theme='light'] & {
    background: ${({ bg }) => (bg === '#0F172A' ? '#FFFFFF' : bg || '#FFFFFF')};
    color: #0f172a;
    border-color: #e2e8f0;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
  }
`;

export const Card = forwardRef<HTMLDivElement, CardProps>(({ children, ...props }, ref) => (
  <StyledCard ref={ref} {...props}>
    {children}
  </StyledCard>
));
Card.displayName = 'Card';

export const CardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
`;

export const CardBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const CardFooter = styled.div`
  display: flex;
  align-items: center;
  margin-top: 12px;
  padding-top: 12px;
  border-top: 1px solid rgba(255, 255, 255, 0.06);

  [data-theme='light'] & {
    border-top: 1px solid #e2e8f0;
  }
`;

export const Box = styled.div<{
  bg?: string;
  p?: string | number;
  m?: string | number;
  w?: string;
  h?: string;
}>`
  ${({ bg }) =>
    bg &&
    css`
      background: ${bg};
    `}
  ${({ p }) =>
    p &&
    css`
      padding: ${typeof p === 'number' ? `${p}px` : p};
    `}
  ${({ m }) =>
    m &&
    css`
      margin: ${typeof m === 'number' ? `${m}px` : m};
    `}
  ${({ w }) =>
    w &&
    css`
      width: ${w};
    `}
  ${({ h }) =>
    h &&
    css`
      height: ${h};
    `}
`;
