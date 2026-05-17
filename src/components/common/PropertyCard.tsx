import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addToFavorites,
  removeFromFavorites,
  addFavoriteThunk,
  removeFavoriteThunk,
  selectFavorites,
  selectFavoriteIds,
  type FavoriteItem,
} from '../../store/dashboardSlice';
import type { AppDispatch } from '../../store/store';
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
} from './PropertyCard/PropertyCard.styles';

export function PropertyStatusBadge({ status }: { status?: string }) {
  return <PropertyStatusBadgeStyled $statusType={status}>{status}</PropertyStatusBadgeStyled>;
}

interface PropertyCardProps {
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
}

function PropertyCard({
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
}: PropertyCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const favorites: FavoriteItem[] = useSelector(selectFavorites) || [];
  const favoriteIds: string[] = useSelector(selectFavoriteIds) || [];
  // Use favoriteIds for lightweight check; fall back to full favorites array
  const isFavorite = favoriteIds.length > 0
    ? favoriteIds.includes(id)
    : favorites.some((f) => f?.id === id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      // Optimistic local update, then API call
      dispatch(removeFromFavorites(id));
      dispatch(removeFavoriteThunk(id));
    } else {
      const item: FavoriteItem = { id, title, location, price, image };
      dispatch(addToFavorites(item));
      dispatch(addFavoriteThunk(item));
    }
  };

  const content = (
    <>
      <PropertyCardImage>
        {image ? (
          <img src={image} alt={title} loading="lazy" width={400} height={260} />
        ) : (
          <PropertyPlaceholder>🏠</PropertyPlaceholder>
        )}
        {status && <PropertyStatusBadge status={status} />}
        {showFavorite && (
          <FavoriteButton
            $isActive={isFavorite}
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            type="button"
          >
            {isFavorite ? '❤️' : '🤍'}
          </FavoriteButton>
        )}
      </PropertyCardImage>
      <PropertyCardContent>
        <PropertyTitle>{title}</PropertyTitle>
        <PropertyLocation>📍 {location}</PropertyLocation>
        <PropertyPrice>
          {price}
          {type === 'rent' && <PriceSuffix>/year</PriceSuffix>}
        </PropertyPrice>

        <div
          aria-label="Property card highlights"
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.7rem' }}
        >
          <span
            style={{
              fontSize: '0.68rem',
              fontWeight: 700,
              color: '#8a6a00',
              background: 'rgba(212,175,55,0.16)',
              padding: '0.2rem 0.45rem',
              borderRadius: '999px',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            Luxury
          </span>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Curated by White Caves
          </span>
        </div>
        {(beds != null && beds > 0 || baths != null && baths > 0 || area) && (
          <PropertySpecs>
            {beds != null && beds > 0 && <span>🛏️ {beds}</span>}
            {baths != null && baths > 0 && <span>🚿 {baths}</span>}
            {area && <span>📐 {area}</span>}
          </PropertySpecs>
        )}
      </PropertyCardContent>
    </>
  );

  if (to) {
    return (
      <PropertyCardContainer to={to} className={className}>
        {content}
      </PropertyCardContainer>
    );
  }

  return (
    <PropertyCardDiv $clickable={!!onClick} onClick={onClick} className={className}>
      {content}
    </PropertyCardDiv>
  );
}

export default React.memo(PropertyCard);
