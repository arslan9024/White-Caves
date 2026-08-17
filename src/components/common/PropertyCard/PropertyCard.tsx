/**
 * PropertyCard.tsx — View Layer (4-Way Component Architecture)
 * Sits at folder root: Pure presentational shell drawing data variables and logic hooks.
 */

import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { usePropertyCardLogic } from './logic/PropertyCard.logic';
import { PROPERTY_CARD_TEXT } from './data/PropertyCard.data';
import {
  PropertyCardContainer,
  PropertyCardDiv,
  PropertyCardImage,
  PropertyPlaceholder,
  PropertyStatusBadgeStyled,
  FavoriteButton,
  PropertyCardContent,
  PropertyTitle,
  PropertyLocation,
  PropertyPrice,
  PriceSuffix,
  PropertySpecs,
} from './PropertyCard.styles';
import { SkeletonCard } from '../../ui/Skeleton';

export function PropertyStatusBadge({ status }: { status?: string }) {
  if (!status) return null;
  return (
    <PropertyStatusBadgeStyled $statusType={status} data-testid="property-status-badge">
      {status}
    </PropertyStatusBadgeStyled>
  );
}

export interface PropertyCardProps {
  id: string;
  image?: string;
  title: string;
  location: string;
  price: string;
  beds?: number;
  baths?: number;
  area?: string;
  status?: string;
  type?: 'sale' | 'rent';
  showFavorite?: boolean;
  onClick?: () => void;
  to?: string;
  className?: string;
  loading?: boolean;
}

export const PropertyCard: FC<PropertyCardProps> = ({
  id,
  image,
  title,
  location,
  price,
  beds,
  baths,
  area,
  status,
  type = 'sale',
  showFavorite = true,
  onClick,
  to,
  className = '',
  loading = false,
}) => {
  const { isFavorite, prefersReducedMotion, handleFavoriteClick } = usePropertyCardLogic({
    id,
    title,
    location,
    price,
    image,
    beds,
    baths,
    area,
    type,
    onClick,
  });

  if (loading) {
    return <SkeletonCard />;
  }

  const hasBeds = beds !== undefined && beds > 0;
  const hasBaths = baths !== undefined && baths > 0;
  const hasArea = Boolean(area);
  const hasSpecs = hasBeds || hasBaths || hasArea;

  const cardContent = (
    <>
      <PropertyCardImage className="card-image-wrap" data-testid="property-card-image">
        {image ? (
          <img src={image} alt={title} loading="lazy" />
        ) : (
          <PropertyPlaceholder data-testid="property-placeholder">
            <div className="placeholder-content">
              <span>{PROPERTY_CARD_TEXT.defaultPlaceholder}</span>
            </div>
          </PropertyPlaceholder>
        )}

        {status && <PropertyStatusBadge status={status} />}

        {showFavorite && (
          <FavoriteButton
            className={`favorite-btn ${isFavorite ? 'active' : ''}`}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? PROPERTY_CARD_TEXT.favoriteAriaRemove : PROPERTY_CARD_TEXT.favoriteAriaAdd}
            data-testid="favorite-button"
          >
            <span role="img" aria-hidden="true">
              {isFavorite ? '❤️' : '🤍'}
            </span>
          </FavoriteButton>
        )}
      </PropertyCardImage>

      <PropertyCardContent data-testid="property-card-content">
        <PropertyLocation data-testid="property-location">
          <span>📍 {location}</span>
        </PropertyLocation>

        <PropertyTitle data-testid="property-title">{title}</PropertyTitle>

        <PropertyPrice data-testid="property-price">
          {price}
          {type === 'rent' && <PriceSuffix>{PROPERTY_CARD_TEXT.perYear}</PriceSuffix>}
        </PropertyPrice>

        {hasSpecs && (
          <PropertySpecs data-testid="property-specs">
            {hasBeds && (
              <span className="spec-item">
                🛏️ {beds} {PROPERTY_CARD_TEXT.bedsLabel}
              </span>
            )}
            {hasBaths && (
              <span className="spec-item">
                🚿 {baths} {PROPERTY_CARD_TEXT.bathsLabel}
              </span>
            )}
            {hasArea && (
              <span className="spec-item">
                📐 {area} {PROPERTY_CARD_TEXT.sqftLabel}
              </span>
            )}
          </PropertySpecs>
        )}
      </PropertyCardContent>
    </>
  );

  if (to) {
    return (
      <PropertyCardContainer
        as={Link}
        to={to}
        className={className}
        onClick={onClick}
        data-testid="property-card-container"
      >
        {cardContent}
      </PropertyCardContainer>
    );
  }

  return (
    <PropertyCardDiv
      className={className}
      onClick={onClick}
      data-testid="property-card-div"
    >
      {cardContent}
    </PropertyCardDiv>
  );
};

export default PropertyCard;
