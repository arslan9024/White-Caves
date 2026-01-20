/**
 * Empty State Component
 * Displays when no data is available
 */

import React from 'react';
import styled from 'styled-components';

const EmptyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 2rem;
  min-height: 300px;
  gap: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
  border: 1px dashed #dee2e6;
  margin: 1rem;
`;

const EmptyIcon = styled.div`
  font-size: 64px;
  color: #adb5bd;
`;

const EmptyTitle = styled.h3`
  color: #495057;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
`;

const EmptyText = styled.p`
  color: #6c757d;
  font-size: 14px;
  margin: 0;
  text-align: center;
  max-width: 400px;
`;

const EmptyAction = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  transition: background-color 0.2s;

  &:hover {
    background-color: #0056b3;
  }

  &:active {
    background-color: #004085;
  }
`;

interface EmptyStateProps {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title = 'No Data Available',
  description = 'No items found. Try adjusting your filters or check back later.',
  actionLabel = 'Refresh',
  onAction,
}) => {
  return (
    <EmptyContainer>
      <EmptyIcon>{icon}</EmptyIcon>
      <EmptyTitle>{title}</EmptyTitle>
      <EmptyText>{description}</EmptyText>
      {onAction && <EmptyAction onClick={onAction}>{actionLabel}</EmptyAction>}
    </EmptyContainer>
  );
};
