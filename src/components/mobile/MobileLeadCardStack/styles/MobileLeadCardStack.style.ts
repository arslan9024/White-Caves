/**
 * MobileLeadCardStack.style.ts — Style Layer
 */

import styled from 'styled-components';

export const StackWrapper = styled.div`
  position: relative;
  height: 280px;
  width: 100%;
  max-width: 380px;
  margin: 0 auto;
`;

export const Card = styled.div<{ $offset: number; $active: boolean }>`
  position: absolute;
  inset: 0;
  background: #fff;
  border-radius: 20px;
  box-shadow: 0 ${({ $offset }) => 4 + $offset * 2}px ${({ $offset }) => 16 + $offset * 4}px
    rgba(0, 0, 0, ${({ $offset }) => 0.12 - $offset * 0.03});
  transform: scale(${({ $offset }) => 1 - $offset * 0.04})
    translateY(${({ $offset }) => $offset * 10}px);
  z-index: ${({ $offset }) => 10 - $offset};
  padding: 20px;
  transition: all 0.25s ease;
  pointer-events: ${({ $active }) => ($active ? 'auto' : 'none')};
  border: 1px solid #f1f5f9;
`;

export const StageBadge = styled.span<{ $color: string }>`
  display: inline-block;
  padding: 3px 10px;
  border-radius: 999px;
  background: ${({ $color }) => $color}22;
  color: ${({ $color }) => $color};
  font-size: 12px;
  font-weight: 700;
  font-family: 'Inter', sans-serif;
`;

export const LeadName = styled.h3`
  font-size: 18px;
  font-weight: 700;
  color: #1e293b;
  margin: 10px 0 4px;
`;

export const Meta = styled.p`
  font-size: 13px;
  color: #64748b;
  margin: 0 0 4px;
`;

export const ActionRow = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 16px;
`;

export const ActionBtn = styled.button<{ $variant: 'dismiss' | 'contact' }>`
  flex: 1;
  padding: 10px;
  border-radius: 12px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
  background: ${({ $variant }) => ($variant === 'dismiss' ? '#f1f5f9' : '#ef4444')};
  color: ${({ $variant }) => ($variant === 'dismiss' ? '#64748b' : '#fff')};
  &:active {
    opacity: 0.8;
  }
`;
