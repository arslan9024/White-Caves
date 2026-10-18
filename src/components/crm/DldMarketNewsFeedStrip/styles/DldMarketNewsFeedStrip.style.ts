import styled from 'styled-components';
import { lightTheme } from '../../../../styles/theme';

export const NewsFeedSection = styled.section`
  width: 100%;
  margin-block-end: var(--spacing-md);
  padding: var(--spacing-md);
  color: var(--text-primary);
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-inline-start: 4px solid var(--color-primary);
  border-radius: var(--border-radius-lg);
  box-shadow: var(--shadow-card);
  font-family: var(--font-body);
`;

export const NewsFeedHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-block-end: var(--spacing-xs);

  @media (max-width: ${lightTheme.breakpoints.mobile}) {
    align-items: flex-start;
    flex-direction: column;
  }
`;

export const NewsFeedTitle = styled.h2`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  margin: 0;
  color: var(--text-primary);
  font-family: var(--font-heading);
  font-size: 1.125rem;
  font-weight: 700;
`;

export const ScopeBadge = styled.span`
  flex: 0 0 auto;
  padding: var(--spacing-xs) var(--spacing-sm);
  color: var(--text-primary);
  background: var(--color-primary-light);
  border: 1px solid var(--color-primary);
  border-radius: var(--border-radius-full);
  font-size: 0.75rem;
  font-weight: 700;
`;

export const NewsFeedDescription = styled.p`
  margin: 0 0 var(--spacing-md);
  color: var(--text-secondary);
  font-size: 0.875rem;
`;

export const NewsFeedList = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--spacing-sm);
  margin: 0;
  padding: 0;
  list-style: none;

  @media (max-width: ${lightTheme.breakpoints.tablet}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: ${lightTheme.breakpoints.mobile}) {
    grid-template-columns: minmax(0, 1fr);
  }
`;

export const NewsFeedItem = styled.li`
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-xs);
  padding: var(--spacing-md);
  background: var(--bg-secondary);
  border: 1px solid var(--border-color);
  border-radius: var(--border-radius-md);
`;

export const NewsCategory = styled.span`
  color: var(--color-primary-dark);
  font-size: 0.75rem;
  font-weight: 700;
`;

export const NewsHeadline = styled.h3`
  margin: 0;
  color: var(--text-primary);
  font-size: 0.9375rem;
  font-weight: 700;
`;

export const NewsSummary = styled.p`
  flex: 1;
  margin: 0;
  color: var(--text-secondary);
  font-size: 0.8125rem;
  line-height: 1.5;
`;

export const NewsFeedFooter = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: var(--spacing-sm);
  margin-block-start: var(--spacing-xs);
`;

export const NewsSource = styled.span`
  color: var(--text-muted);
  font-size: 0.75rem;
`;

export const SourceLink = styled.a`
  display: inline-flex;
  align-items: center;
  gap: var(--spacing-xs);
  color: var(--color-primary-dark);
  font-size: 0.8125rem;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 0.15em;

  &:focus-visible {
    outline: 2px solid var(--color-primary-dark);
    outline-offset: 2px;
    border-radius: var(--border-radius-sm);
  }
`;

export const NewsFeedStatus = styled.p`
  margin: 0;
  padding: var(--spacing-md);
  color: var(--text-secondary);
  background: var(--bg-secondary);
  border-radius: var(--border-radius-md);
  font-size: 0.875rem;
`;
