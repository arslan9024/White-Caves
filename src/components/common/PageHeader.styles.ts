import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const PageHeaderWrapper = styled.div`
  margin-bottom: 2rem;
`;

export const Breadcrumbs = styled.nav`
  margin-bottom: 0.75rem;
  font-size: 0.85rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0;
`;

export const BreadcrumbLink = styled(Link)`
  color: var(--text-muted);
  text-decoration: none;
  transition: color var(--transition-smooth);

  &:hover {
    color: var(--color-primary);
  }
`;

export const BreadcrumbSeparator = styled.span`
  color: var(--text-muted);
  opacity: 0.5;
  margin: 0 0.5rem;
`;

export const BreadcrumbCurrent = styled.span`
  color: var(--text-primary);
  font-weight: 500;
`;

export const HeaderMain = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

export const HeaderContent = styled.div`
  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: var(--text-primary);
    margin: 0 0 0.25rem 0;
  }
`;

export const HeaderSubtitle = styled.p`
  color: var(--text-muted);
  font-size: 0.95rem;
  margin: 0;
`;

export const HeaderActions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;

  @media (max-width: 600px) {
    width: 100%;
  }
`;

export const ActionButtonBase = styled.button`
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-smooth);

  @media (max-width: 600px) {
    flex: 1;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

export const ActionButtonLink = styled(Link)<{ $variant?: string; $size?: string }>`
  gap: 0.5rem;
  padding: 0.75rem 1.25rem;
  border: none;
  border-radius: 10px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-smooth);

  @media (max-width: 600px) {
    flex: 1;
  }

  ${(props) => {
    switch (props.$variant) {
      case 'secondary':
        return `
          background: var(--bg-hover);
          color: var(--text-primary);
          border: 1px solid var(--border-color);

          &:hover {
            background: var(--bg-tertiary);
            border-color: var(--color-primary);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: var(--color-primary);
          border: 2px solid var(--color-primary);

          &:hover {
            background: rgba(220, 38, 38, 0.1);
          }
        `;
      case 'primary':
      default:
        return `
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: white;

          &:hover {
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
          }
        `;
    }
  }}

  ${(props) => {
    if (props.$size === 'small') {
      return `
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
      `;
    }
  }}
`;

export const StyledActionButton = styled(ActionButtonBase)<{ $variant?: string; $size?: string }>`
  ${(props) => {
    switch (props.$variant) {
      case 'secondary':
        return `
          background: var(--bg-hover);
          color: var(--text-primary);
          border: 1px solid var(--border-color);

          &:hover {
            background: var(--bg-tertiary);
            border-color: var(--color-primary);
          }
        `;
      case 'outline':
        return `
          background: transparent;
          color: var(--color-primary);
          border: 2px solid var(--color-primary);

          &:hover {
            background: rgba(220, 38, 38, 0.1);
          }
        `;
      case 'primary':
      default:
        return `
          background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
          color: white;

          &:hover {
            box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
          }
        `;
    }
  }}

  ${(props) => {
    if (props.$size === 'small') {
      return `
        padding: 0.5rem 1rem;
        font-size: 0.8rem;
      `;
    }
  }}
`;

export const ButtonIcon = styled.span`
  font-size: 1rem;
`;

export const ButtonLabel = styled.span``;
