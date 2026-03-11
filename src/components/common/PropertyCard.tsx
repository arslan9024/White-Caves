import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addToFavorites, removeFromFavorites, selectFavorites } from '../../store/dashboardSlice';
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

export default function PropertyCard({
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
  const dispatch = useDispatch();
  // @ts-ignore - dashboardSlice is JS, not TS
  const favorites: any[] = useSelector(selectFavorites) || [];
  const isFavorite = favorites.some((f: any) => f?.id === id);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isFavorite) {
      dispatch(removeFromFavorites(id));
    } else {
      dispatch(addToFavorites({ id, title, location, price, image }));
    }
  };

  const content = (
    <>
      <PropertyCardImage>
        {image ? (
          <img src={image} alt={title} />
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
        {(beds || baths || area) && (
          <PropertySpecs>
            {beds && <span>🛏️ {beds}</span>}
            {baths && <span>🚿 {baths}</span>}
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
