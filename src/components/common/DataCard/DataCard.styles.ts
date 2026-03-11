import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const DataCardGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$columns || 2}, 1fr);
  gap: 1.5rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const DataCardWrapper = styled.div`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 16px;
  overflow: hidden;

  &.full-width {
    grid-column: 1 / -1;
  }
`;

export const DataCardHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;

  h3 {
    font-size: 1.1rem;
    font-weight: 600;
    color: var(--text-primary);
    margin: 0;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
`;

export const ViewAllLink = styled(Link)`
  font-size: 0.85rem;
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;

  &:hover {
    text-decoration: underline;
  }
`;

export const DataCardContent = styled.div`
  padding: 1rem 1.5rem;
`;

export const DataList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const DataListItemContainer = styled.div<{ $clickable?: boolean }>`
  padding: 0.875rem;
  background: var(--bg-hover);
  border-radius: 12px;
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
      transform: translateX(4px);
    `}
  }

  @media (max-width: 600px) {
    flex-wrap: wrap;
  }
`;

export const ItemAvatar = styled.div`
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

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const AvatarText = styled.span`
  color: white;
  font-weight: 600;
  font-size: 1rem;
`;

export const AvatarIcon = styled.span`
  font-size: 1.25rem;
`;

export const ItemContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

export const ItemTitle = styled.span`
  font-weight: 600;
  color: var(--text-primary);
  font-size: 0.95rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ItemSubtitle = styled.span`
  font-size: 0.8rem;
  color: var(--text-muted);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const ItemMeta = styled.div`
  font-size: 0.85rem;
  color: var(--text-muted);
  text-align: right;

  @media (max-width: 600px) {
    margin-left: auto;
  }
`;

export const ItemStatus = styled.span<{ $statusColor?: string }>`
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  background: ${(props) => {
    if (!props.$statusColor) return 'rgba(16, 185, 129, 0.15)';
    // Try to use the color variable if it's a CSS variable
    return `rgba(${props.$statusColor}, 0.15)`;
  }};
  color: ${(props) => {
    if (!props.$statusColor) return 'rgb(16, 185, 129)';
    return `rgb(${props.$statusColor})`;
  }};

  @media (max-width: 600px) {
    margin-left: auto;
  }
`;

export const ItemBadge = styled.span<{ $badgeColor?: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 36px;
  height: 36px;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.85rem;
  background: ${(props) => {
    if (!props.$badgeColor) return 'rgba(16, 185, 129, 0.15)';
    return `rgba(${props.$badgeColor}, 0.15)`;
  }};
  color: ${(props) => {
    if (!props.$badgeColor) return 'rgb(16, 185, 129)';
    return `rgb(${props.$badgeColor})`;
  }};

  @media (max-width: 600px) {
    margin-left: auto;
  }
`;

export const ItemActions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;

  @media (max-width: 600px) {
    margin-left: auto;
  }
`;
