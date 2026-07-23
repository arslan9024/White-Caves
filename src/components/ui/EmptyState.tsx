import React from 'react';
import styled from 'styled-components';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
  variant?: 'empty' | 'error';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No data available',
  description,
  icon = '📭',
  actionLabel,
  onAction,
  className,
  variant = 'empty',
}) => {
  return (
    <Container className={className} role="status" aria-live="polite" $variant={variant}>
      <Icon aria-hidden="true">{icon}</Icon>
      <Title>{title}</Title>
      {description ? <Description>{description}</Description> : null}
      {actionLabel && onAction ? (
        <ActionButton type="button" onClick={onAction}>
          {actionLabel}
        </ActionButton>
      ) : null}
    </Container>
  );
};

const Container = styled.div<{ $variant: 'empty' | 'error' }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 2.25rem 1rem;
  text-align: center;
  color: ${({ $variant }) => ($variant === 'error' ? '#b91c1c' : '#6b7280')};
`;

const Icon = styled.span`
  font-size: 1.75rem;
  line-height: 1;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: inherit;
`;

const Description = styled.p`
  margin: 0;
  font-size: 0.88rem;
  color: #6b7280;
  max-width: 480px;
`;

const ActionButton = styled.button`
  margin-top: 0.25rem;
  border: 1px solid #d1d5db;
  background: #fff;
  color: #374151;
  border-radius: 8px;
  min-height: 36px;
  padding: 0 0.9rem;
  font-size: 0.84rem;
  font-weight: 500;
  cursor: pointer;

  &:hover {
    background: #f9fafb;
  }
`;

export default EmptyState;
