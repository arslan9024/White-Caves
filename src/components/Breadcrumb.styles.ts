import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { typography } from '../styles/theme/typography';

export const BreadcrumbNav = styled.nav`
  padding: 0.75rem 1.5rem;
  background: var(--bg-secondary, #f5f5f5);
  border-bottom: 1px solid var(--border-color, #e0e0e0);

  @media (max-width: 768px) {
    padding: 0.5rem 1rem;
  }
`;

export const BreadcrumbList = styled.ol`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.25rem;
  list-style: none;
  margin: 0;
  padding: 0;
  max-width: 1400px;
  margin: 0 auto;
  font-size: 0.875rem;

  @media (max-width: 768px) {
    font-size: 0.8125rem;
  }
`;

export const BreadcrumbItem = styled.li`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

export const BreadcrumbLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 0.375rem;
  color: var(--text-secondary, #666);
  text-decoration: none;
  transition: color 0.2s ease;

  &:hover {
    color: var(--primary-color, #e31e24);
  }

  svg {
    flex-shrink: 0;
  }

  span {
    @media (max-width: 768px) {
      max-width: 100px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
`;

export const BreadcrumbSeparator = styled.span`
  color: var(--text-muted, #999);
  margin: 0 0.25rem;
  user-select: none;
`;

export const BreadcrumbCurrent = styled.span`
  color: var(--text-primary, #212121);
  font-weight: ${typography.weights.medium};
`;
