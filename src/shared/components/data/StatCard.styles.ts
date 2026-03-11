import styled, { keyframes } from 'styled-components';

const skeletonLoading = keyframes`
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
`;

export const StatCardContainer = styled.div`
  padding: 1.25rem;
`;

export const StatCardHeader = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

export const StatCardTitle = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted, #6b7280);

  [data-theme="dark"] & {
    color: var(--text-muted-dark, #64748b);
  }
`;

export const StatCardIcon = styled.span`
  font-size: 1.5rem;
  opacity: 0.8;
`;

export const StatCardValue = styled.div`
  display: flex;
  align-items: baseline;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
`;

export const StatCardPrefix = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary, #1f2937);

  [data-theme="dark"] & {
    color: var(--text-primary-dark, #f9fafb);
  }
`;

export const StatCardNumber = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary, #1f2937);
  font-family: 'Montserrat', 'Segoe UI', sans-serif;

  [data-theme="dark"] & {
    color: var(--text-primary-dark, #f9fafb);
  }
`;

export const StatCardSuffix = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted, #6b7280);

  [data-theme="dark"] & {
    color: var(--text-muted-dark, #64748b);
  }
`;

export const StatCardFooter = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const StatCardChange = styled.span<{ $type?: 'positive' | 'negative' | 'neutral' }>`
  font-size: 0.8125rem;
  font-weight: 600;
  color: ${props => {
    switch (props.$type) {
      case 'positive': return '#10b981';
      case 'negative': return '#ef4444';
      default: return 'var(--text-secondary, #6b7280)';
    }
  }};
`;

export const StatCardTrendLabel = styled.span`
  font-size: 0.75rem;
  color: var(--text-muted, #6b7280);

  [data-theme="dark"] & {
    color: var(--text-muted-dark, #64748b);
  }
`;

export const StatCardSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SkeletonLine = styled.div<{ $variant?: 'title' | 'value' | 'change' }>`
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: ${skeletonLoading} 1.5s infinite;
  border-radius: 4px;
  width: ${props => {
    switch (props.$variant) {
      case 'title': return '60%';
      case 'value': return '80%';
      case 'change': return '40%';
      default: return '100%';
    }
  }};
  height: ${props => {
    switch (props.$variant) {
      case 'title': return '0.875rem';
      case 'value': return '1.75rem';
      case 'change': return '0.75rem';
      default: return '1rem';
    }
  }};

  [data-theme="dark"] & {
    background: linear-gradient(90deg, #374151 25%, #4b5563 50%, #374151 75%);
    background-size: 200% 100%;
  }
`;
