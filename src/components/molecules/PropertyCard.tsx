import React, { FC } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';

export interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  imageUrl?: string;
  tag?: string;
  onView?: (id: string) => void;
  onFavorite?: (id: string) => void;
}

const Card = styled(motion.div)`
  background: var(--wc-white, #FFFFFF);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(30, 41, 59, 0.08);
  transition: box-shadow 0.3s ease, transform 0.3s ease;
  cursor: pointer;

  &:hover {
    box-shadow: 0 12px 40px rgba(239, 68, 68, 0.15);
    transform: translateY(-4px);
  }
`;

const ImageContainer = styled.div`
  position: relative;
  width: 100%;
  height: 220px;
  overflow: hidden;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;

  ${Card}:hover & {
    transform: scale(1.05);
  }
`;

const Tag = styled.span`
  position: absolute;
  top: 12px;
  left: 12px;
  background: var(--wc-red-primary, #EF4444);
  color: var(--wc-white, #FFFFFF);
  font-size: 0.75rem;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const FavoriteButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background 0.2s ease;
  backdrop-filter: blur(4px);

  &:hover {
    background: var(--wc-red-primary, #EF4444);
    color: var(--wc-white, #FFFFFF);
  }
`;

const Content = styled.div`
  padding: 20px;
`;

const Price = styled.div`
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--wc-red-primary, #EF4444);
  margin-bottom: 6px;
  font-family: 'Inter', sans-serif;
`;

const Title = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--wc-slate, #1E293B);
  margin: 0 0 4px 0;
  line-height: 1.4;
`;

const Location = styled.p`
  font-size: 0.85rem;
  color: #64748B;
  margin: 0 0 16px 0;
`;

const MetaRow = styled.div`
  display: flex;
  gap: 16px;
  border-top: 1px solid #F1F5F9;
  padding-top: 14px;
`;

const MetaItem = styled.span`
  font-size: 0.8rem;
  color: #64748B;
  display: flex;
  align-items: center;
  gap: 5px;

  strong {
    color: var(--wc-slate, #1E293B);
    font-weight: 600;
  }
`;

export const PropertyCard: FC<PropertyCardProps> = ({
  id,
  title,
  location,
  price,
  bedrooms,
  bathrooms,
  area,
  imageUrl,
  tag,
  onView,
  onFavorite,
}) => {
  return (
    <Card
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      onClick={() => onView?.(id)}
      role="article"
      aria-label={`Property: ${title}`}
    >
      <ImageContainer>
        <Image
          src={imageUrl || '/placeholder-property.jpg'}
          alt={title}
          loading="lazy"
        />
        {tag && <Tag>{tag}</Tag>}
        <FavoriteButton
          onClick={(e) => { e.stopPropagation(); onFavorite?.(id); }}
          aria-label="Add to favorites"
        >
          ♡
        </FavoriteButton>
      </ImageContainer>
      <Content>
        <Price>{price}</Price>
        <Title>{title}</Title>
        <Location>📍 {location}</Location>
        <MetaRow>
          <MetaItem><strong>{bedrooms}</strong> Beds</MetaItem>
          <MetaItem><strong>{bathrooms}</strong> Baths</MetaItem>
          <MetaItem><strong>{area}</strong></MetaItem>
        </MetaRow>
      </Content>
    </Card>
  );
};
