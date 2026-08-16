/**
 * FavoriteHeartButton — Wave 57 FE-GOAL-018
 * Interactive favorite/wishlist red heart button with pulse micro-animation
 * White Caves Real Estate LLC — UI/UX Suite
 */
import React, { FC, useState } from 'react';
import styled, { keyframes } from 'styled-components';

const pulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
`;

const HeartBtn = styled.button<{ $favorited: boolean }>`
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.85);
  backdrop-filter: blur(8px);
  border: 1.5px solid ${p => p.$favorited ? '#EF4444' : 'rgba(100, 116, 139, 0.3)'};
  color: ${p => p.$favorited ? '#EF4444' : '#94A3B8'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  animation: ${p => p.$favorited ? pulse : 'none'} 0.3s ease;
  &:hover {
    border-color: #EF4444;
    color: #EF4444;
    transform: scale(1.08);
  }
`;

export const FavoriteHeartButton: FC<{ initialFavorited?: boolean; onToggle?: (fav: boolean) => void }> = ({
  initialFavorited = false,
  onToggle,
}) => {
  const [favorited, setFavorited] = useState(initialFavorited);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = !favorited;
    setFavorited(next);
    onToggle?.(next);
  };

  return (
    <HeartBtn
      $favorited={favorited}
      onClick={handleClick}
      data-testid="favorite-heart-button"
      aria-label={favorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      {favorited ? '❤️' : '🤍'}
    </HeartBtn>
  );
};

export default FavoriteHeartButton;
