/**
 * Enhanced Department Item Component
 * Displays department with icon, name, and active state
 */

import React from 'react';
import styled from 'styled-components';
import { getDepartmentMetadata } from '../../../config/departmentMetadata';

const DepartmentItemContainer = styled.div<{ $isActive: boolean; $color: string }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  margin: 4px 8px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
  border-left: 3px solid transparent;
  position: relative;

  background-color: ${props => (props.$isActive ? `rgba(52, 152, 219, 0.1)` : 'transparent')};
  border-left-color: ${props => (props.$isActive ? props.$color : 'transparent')};

  &:hover {
    background-color: rgba(255, 255, 255, 0.05);
    transform: translateX(4px);
  }

  &:active {
    transform: translateX(2px);
  }
`;

const DepartmentIcon = styled.span`
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`;

const DepartmentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
`;

const DepartmentName = styled.div`
  font-size: 13px;
  font-weight: 500;
  color: #fff;
`;

const DepartmentCount = styled.div<{ $isActive: boolean }>`
  font-size: 11px;
  color: ${props => (props.$isActive ? '#3498db' : '#999')};
  font-weight: 400;
`;

const ActiveIndicator = styled.div<{ $isActive: boolean }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #27ae60;
  opacity: ${props => (props.$isActive ? 1 : 0)};
  transition: opacity 0.2s ease;
  flex-shrink: 0;
`;

interface DepartmentItemProps {
  code: string;
  itemCount?: number;
  isActive: boolean;
  onClick: () => void;
  showIndicator?: boolean;
}

/**
 * Enhanced Department Item Component
 * Shows department icon, name, count, and active state
 */
export const EnhancedDepartmentItem: React.FC<DepartmentItemProps> = ({
  code,
  itemCount = 0,
  isActive,
  onClick,
  showIndicator = true,
}) => {
  const metadata = getDepartmentMetadata(code);

  if (!metadata) {
    return null;
  }

  return (
    <DepartmentItemContainer
      $isActive={isActive}
      $color={metadata.color}
      onClick={onClick}
      title={metadata.description}
      aria-selected={isActive}
      role="button"
      tabIndex={0}
      onKeyPress={e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
    >
      <DepartmentIcon>{metadata.emoji}</DepartmentIcon>
      <DepartmentInfo>
        <DepartmentName>{metadata.name}</DepartmentName>
        {itemCount > 0 && (
          <DepartmentCount $isActive={isActive}>
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </DepartmentCount>
        )}
      </DepartmentInfo>
      {showIndicator && <ActiveIndicator $isActive={isActive} />}
    </DepartmentItemContainer>
  );
};

export default EnhancedDepartmentItem;
