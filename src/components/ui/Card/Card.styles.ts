import styled from 'styled-components';

// Main Card Component
export const CardContainer = styled.div<{
  variant?: string;
  padding?: string;
  hoverable?: boolean;
  bordered?: boolean;
  shadow?: string;
}>`
  background: var(--color-background, #FFFFFF);
  overflow: hidden;
  border-radius: var(--radius-md, 8px);
  transition: all 0.2s ease;

  ${props => {
    switch (props.shadow) {
      case 'none':
        return 'box-shadow: none;';
      case 'sm':
        return 'box-shadow: var(--shadow-sm, 0 1px 2px 0 rgba(0, 0, 0, 0.05));';
      case 'md':
        return 'box-shadow: var(--shadow-md, 0 4px 6px -1px rgba(0, 0, 0, 0.1));';
      case 'lg':
        return 'box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));';
      default:
        return 'box-shadow: var(--shadow-default, 0 1px 3px 0 rgba(0, 0, 0, 0.1));';
    }
  }}

  ${props => props.bordered && `
    border: 1px solid var(--color-border, #E5E7EB);
  `}

  ${props => {
    switch (props.padding) {
      case 'compact':
        return 'padding: 12px;';
      case 'relaxed':
        return 'padding: 24px;';
      default:
        return 'padding: 16px;';
    }
  }}

  ${props => props.hoverable && `
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: var(--shadow-lg, 0 10px 15px -3px rgba(0, 0, 0, 0.1));
    }
  `}

  ${props => props.variant === 'stat' && `
    padding: 20px;
  `}

  ${props => props.variant === 'property' && `
    padding: 0;
  `}
`;

export const CardHeader = styled.div`
  padding-bottom: 12px;
  border-bottom: 1px solid var(--color-border-light, #F3F4F6);
  margin-bottom: 12px;
`;

export const CardBody = styled.div``;

export const CardFooter = styled.div`
  padding-top: 12px;
  border-top: 1px solid var(--color-border-light, #F3F4F6);
  margin-top: 12px;
`;

// Stat Card Components
export const StatCardContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;
`;

export const StatCardInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  flex: 1;
`;

export const StatCardTitle = styled.span`
  font-size: 13px;
  font-weight: 500;
  color: var(--color-text-secondary, #6B7280);
  text-transform: capitalize;
`;

export const StatCardValue = styled.span`
  font-size: 28px;
  font-weight: 700;
  color: var(--color-text-primary, #111827);
  line-height: 1.2;
`;

export const StatCardChange = styled.span<{ type?: string }>`
  font-size: 12px;
  font-weight: 600;
  color: ${props => {
    switch (props.type) {
      case 'positive':
        return '#10B981';
      case 'negative':
        return '#EF4444';
      default:
        return 'var(--color-text-muted, #9CA3AF)';
    }
  }};
  margin-top: 4px;
`;

export const StatCardIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--radius-md, 8px);
  background: var(--color-primary-light, rgba(220, 38, 38, 0.1));
  color: var(--color-primary, #DC2626);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 24px;
    height: 24px;
  }
`;

// Property Card Components
export const PropertyCardImage = styled.div`
  position: relative;
  height: 180px;
  background: var(--color-surface, #F9FAFB);
  overflow: hidden;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const PropertyCardStatus = styled.span<{ status?: string }>`
  position: absolute;
  top: 12px;
  left: 12px;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  color: white;
  background: ${props => {
    switch (props.status) {
      case 'forSale':
        return '#10B981';
      case 'forRent':
        return '#3B82F6';
      case 'sold':
        return '#6B7280';
      case 'reserved':
        return '#F59E0B';
      default:
        return '#6B7280';
    }
  }};
`;

export const PropertyCardFavorite = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #9CA3AF;
  transition: all 0.2s ease;

  &:hover {
    color: #dc2626;
    transform: scale(1.1);
  }

  &:active {
    transform: scale(0.95);
  }
`;

export const PropertyCardContent = styled.div`
  padding: 16px;
`;

export const PropertyCardTitle = styled.h3`
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--color-text-primary, #111827);
`;

export const PropertyCardPrice = styled.div`
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 8px;
`;

export const PropertyCardPriceValue = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary, #DC2626);
`;

export const PropertyCardPriceLabel = styled.span`
  font-size: 12px;
  color: var(--color-text-secondary, #6B7280);
`;

export const PropertyCardLocation = styled.div`
  font-size: 13px;
  color: var(--color-text-secondary, #6B7280);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const PropertyCardFeatures = styled.div`
  display: flex;
  gap: 16px;
  padding-top: 12px;
  border-top: 1px solid var(--color-border-light, #F3F4F6);

  @media (max-width: 480px) {
    gap: 8px;
  }
`;

export const PropertyCardFeature = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: var(--color-text-secondary, #6B7280);

  svg {
    width: 16px;
    height: 16px;
    color: var(--color-primary, #DC2626);
  }
`;

// Responsive styles
export const ResponsiveCard = styled(CardContainer)`
  @media (max-width: 768px) {
    padding: 12px;
  }

  @media (max-width: 480px) {
    padding: 8px;
  }
`;
