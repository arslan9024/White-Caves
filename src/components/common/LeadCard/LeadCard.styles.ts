import styled from 'styled-components';

export const LeadScoreBadgeStyled = styled.span<{ $level?: 'high' | 'medium' | 'low'; $size?: 'default' | 'small' }>`
  width: ${(props) => (props.$size === 'small' ? '32px' : '40px')};
  height: ${(props) => (props.$size === 'small' ? '32px' : '40px')};
  font-weight: 700;
  font-size: ${(props) => (props.$size === 'small' ? '0.75rem' : '0.9rem')};
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  ${(props) => {
    switch (props.$level) {
      case 'high':
        return `
          background: rgba(16, 185, 129, 0.15);
          color: #10b981;
        `;
      case 'medium':
        return `
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
        `;
      case 'low':
      default:
        return `
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        `;
    }
  }}
`;

export const LeadStatusBadgeStyled = styled.span<{ $statusType?: string }>`
  display: inline-flex;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: capitalize;

  ${(props) => {
    const status = props.$statusType?.toLowerCase() || 'new';
    switch (status) {
      case 'hot':
        return `
          background: rgba(239, 68, 68, 0.15);
          color: #ef4444;
        `;
      case 'warm':
        return `
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
        `;
      case 'new':
        return `
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
        `;
      case 'cold':
        return `
          background: rgba(107, 114, 128, 0.15);
          color: #6b7280;
        `;
      default:
        return `
          background: rgba(59, 130, 246, 0.15);
          color: #3b82f6;
        `;
    }
  }}
`;

export const LeadCardContainer = styled.div`
  background: var(--bg-hover);
  border-radius: 12px;
  padding: 1.25rem;
`;

export const LeadCardHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 1rem;
`;

export const LeadAvatar = styled.div`
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  font-weight: 600;
  overflow: hidden;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1rem;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const LeadHeaderInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const LeadName = styled.span`
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
`;

export const LeadCardBody = styled.div``;

export const LeadDetail = styled.p`
  margin: 0 0 0.4rem 0;
  font-size: 0.85rem;
  color: var(--text-muted);

  &:last-child {
    margin-bottom: 0;
  }
`;

export const LeadCardActions = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
`;

export const LeadListItemContainer = styled.div<{ $clickable?: boolean }>`
  padding: 0.875rem;
  background: var(--bg-hover);
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
  cursor: ${(props) => (props.$clickable ? 'pointer' : 'default')};

  &:hover {
    ${(props) =>
      props.$clickable &&
      `
      background: var(--bg-tertiary);
    `}
  }
`;

export const LeadScoreWrapper = styled.div`
  flex-shrink: 0;
`;

export const LeadInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

export const LeadListName = styled.span`
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
`;

export const LeadDetails = styled.span`
  font-size: 0.8rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
