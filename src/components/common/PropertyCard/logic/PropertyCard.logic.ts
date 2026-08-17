/**
 * PropertyCard.logic.ts — Hook & Logic Layer
 */

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useReducedMotion } from 'framer-motion';
import {
  addFavoriteThunk,
  removeFavoriteThunk,
  selectFavorites,
  selectFavoriteIds,
  type FavoriteItem,
} from '../../../../store/dashboardSlice';
import type { AppDispatch } from '../../../../store/store';

export interface UsePropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: string;
  image?: string;
  beds?: number;
  baths?: number;
  area?: string;
  type?: 'sale' | 'rent';
  onClick?: () => void;
}

export function usePropertyCardLogic(props: UsePropertyCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const favorites: FavoriteItem[] = useSelector(selectFavorites) || [];
  const favoriteIds: string[] = useSelector(selectFavoriteIds) || [];
  const isFavorite =
    favoriteIds.length > 0
      ? favoriteIds.includes(props.id)
      : favorites.some(f => f?.id === props.id);

  const prefersReducedMotion = useReducedMotion();

  const handleFavoriteClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();

      if (isFavorite) {
        dispatch(removeFavoriteThunk(props.id));
      } else {
        dispatch(
          addFavoriteThunk({
            id: props.id,
            title: props.title,
            location: props.location,
            price: props.price,
            image: props.image || '',
          })
        );
      }
    },
    [dispatch, isFavorite, props]
  );

  return {
    isFavorite,
    prefersReducedMotion,
    handleFavoriteClick,
  };
}
