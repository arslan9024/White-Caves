import styled from 'styled-components';

export const StatCardGridContainer = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$columns || 4}, 1fr);
  gap: 1.5rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const StatCardWrapper = styled.div<{ $variant?: string; $clickable?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1.5rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  transition: all 0.15s ease-out;
  cursor: ${(props) => (props.$clickable ? 'pointer' : 'default')};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

export const StatIconWrapper = styled.div<{ $variant?: string }>`
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${(props) => {
    switch (props.$variant) {
      case 'buyer':
        return `
          background: rgba(59, 130, 246, 0.1);
          [data-theme="dark"] & {
            background: rgba(59, 130, 246, 0.2);
          }
        `;
      case 'seller':
        return `
          background: rgba(16, 185, 129, 0.1);
          [data-theme="dark"] & {
            background: rgba(16, 185, 129, 0.2);
          }
        `;
      case 'landlord':
        return `
          background: rgba(139, 92, 246, 0.1);
          [data-theme="dark"] & {
            background: rgba(139, 92, 246, 0.2);
          }
        `;
      case 'agent':
        return `
          background: rgba(245, 158, 11, 0.1);
          [data-theme="dark"] & {
            background: rgba(245, 158, 11, 0.2);
          }
        `;
      case 'sales':
        return `
          background: rgba(239, 68, 68, 0.1);
          [data-theme="dark"] & {
            background: rgba(239, 68, 68, 0.2);
          }
        `;
      case 'owner':
        return `
          background: rgba(255, 215, 0, 0.1);
          [data-theme="dark"] & {
            background: rgba(255, 215, 0, 0.2);
          }
        `;
      case 'default':
      default:
        return `background: rgba(220, 38, 38, 0.1);`;
    }
  }}
`;

export const StatIcon = styled.span`
  font-size: 1.5rem;
`;

export const StatInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  flex: 1;
  min-width: 0;
`;

export const StatValue = styled.span`
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.2;
`;

export const StatLabel = styled.span`
  font-size: 0.875rem;
  color: var(--text-muted);
  font-weight: 500;
`;

export const StatChange = styled.span<{ $positive?: boolean }>`
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 0.25rem;
  color: ${(props) => (props.$positive ? '#10b981' : '#ef4444')};
`;
