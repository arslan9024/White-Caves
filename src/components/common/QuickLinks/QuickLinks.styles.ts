import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const QuickLinksContainerStyled = styled.div`
  margin-bottom: 2rem;
`;

export const QuickLinksTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 1rem 0;
`;

export const QuickLinksGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$columns || 4}, 1fr);
  gap: 1rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

export const QuickLinkCardBase = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.15);
  }
`;

export const QuickLinkCardLink = styled(Link)`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  color: inherit;

  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.15);
  }
`;

export const QuickLinkCardAnchor = styled.a`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  color: inherit;

  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.15);
  }
`;

export const QuickLinkCardButton = styled.button`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  font-family: inherit;
  color: inherit;

  &:hover {
    border-color: var(--color-primary);
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(220, 38, 38, 0.15);
  }
`;

export const QuickLinkIcon = styled.span`
  font-size: 1.75rem;
  line-height: 1;
`;

export const QuickLinkTitle = styled.span`
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--text-primary);
`;

export const QuickLinkDescription = styled.span`
  font-size: 0.8rem;
  color: var(--text-muted);
  line-height: 1.4;
`;
