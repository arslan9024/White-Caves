import styled from 'styled-components';
import { Link } from 'react-router-dom';

export const PropertyCardGrid = styled.div<{ $columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${(props) => props.$columns || 3}, 1fr);
  gap: 1.5rem;

  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const PropertyCardContainer = styled(Link)`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  display: block;
  transition: all 0.2s ease;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    border-color: var(--color-primary);
  }
`;

export const PropertyCardDiv = styled.div<{ $clickable?: boolean }>`
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  overflow: hidden;
  display: block;
  transition: all 0.2s ease;
  cursor: ${(props) => (props.$clickable ? 'pointer' : 'default')};

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
    border-color: var(--color-primary);
  }
`;

export const PropertyCardImage = styled.div`
  position: relative;
  height: 180px;
  background: var(--bg-tertiary);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const PropertyPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  background: linear-gradient(135deg, var(--bg-tertiary) 0%, var(--bg-secondary) 100%);
`;

export const PropertyStatusBadgeStyled = styled.span<{ $statusType?: string }>`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: capitalize;
  z-index: 2;

  ${(props) => {
    const status = props.$statusType?.toLowerCase().replace(/\s+/g, '-') || 'available';
    switch (status) {
      case 'available':
        return `background: rgba(16, 185, 129, 0.9); color: white;`;
      case 'new':
        return `background: rgba(59, 130, 246, 0.9); color: white;`;
      case 'hot-deal':
      case 'hot':
        return `background: rgba(239, 68, 68, 0.9); color: white;`;
      case 'price-drop':
        return `background: rgba(245, 158, 11, 0.9); color: white;`;
      case 'sold':
        return `background: rgba(107, 114, 128, 0.9); color: white;`;
      case 'rented':
        return `background: rgba(139, 92, 246, 0.9); color: white;`;
      default:
        return `background: rgba(16, 185, 129, 0.9); color: white;`;
    }
  }}
`;

export const FavoriteButton = styled.button<{ $isActive?: boolean }>`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 36px;
  height: 36px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  z-index: 3;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
  }

  ${(props) =>
    props.$isActive &&
    `
    background: rgba(239, 68, 68, 0.1);
  `}
`;

export const PropertyCardContent = styled.div`
  padding: 1.25rem;
`;

export const PropertyTitle = styled.h4`
  font-size: 1rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 0.5rem 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

export const PropertyLocation = styled.p`
  font-size: 0.85rem;
  color: var(--text-muted);
  margin: 0 0 0.5rem 0;
`;

export const PropertyPrice = styled.p`
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-primary);
  margin: 0 0 0.75rem 0;
`;

export const PriceSuffix = styled.span`
  font-size: 0.8rem;
  font-weight: 400;
  color: var(--text-muted);
`;

export const PropertySpecs = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.85rem;
  color: var(--text-muted);

  span {
    display: flex;
    align-items: center;
    gap: 0.3rem;
  }
`;
