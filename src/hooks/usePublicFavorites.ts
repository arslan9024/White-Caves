/**
 * usePublicFavorites Hook
 * =======================
 * Dual-mode favorites: localStorage for guests, Redux + API for authenticated users.
 * Merges guest favorites into account on login.
 */

import { useCallback, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import {
  addToFavorites,
  removeFromFavorites,
  selectFavorites,
  type FavoriteItem,
} from '../store/dashboardSlice';

const LOCAL_STORAGE_KEY = 'white-caves-favorites';

/* ─── localStorage Helpers ──────────────────────────────────────── */

function readLocalFavorites(): FavoriteItem[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeLocalFavorites(items: FavoriteItem[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch {
    // Quota exceeded or blocked — silently fail
  }
}

/* ─── Hook ──────────────────────────────────────────────────────── */

export function usePublicFavorites() {
  const dispatch = useDispatch<AppDispatch>();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth?.session?.isLoggedIn ?? false
  );
  const reduxFavorites = useSelector(selectFavorites) as FavoriteItem[];

  // On mount + auth change, merge localStorage favorites into Redux
  useEffect(() => {
    if (isAuthenticated) {
      const localFavs = readLocalFavorites();
      if (localFavs.length > 0) {
        localFavs.forEach(fav => {
          const alreadyInRedux = reduxFavorites.some(rf => rf.id === fav.id);
          if (!alreadyInRedux) {
            dispatch(addToFavorites(fav));
          }
        });
        // Clear localStorage after merge
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }
    }
    // Only run on auth change, not on every reduxFavorites change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, dispatch]);

  // Combined favorites: Redux (if auth) + localStorage (if guest)
  const favorites = useMemo<FavoriteItem[]>(() => {
    if (isAuthenticated) {
      return reduxFavorites;
    }
    return readLocalFavorites();
  }, [isAuthenticated, reduxFavorites]);

  const isFavorite = useCallback(
    (propertyId: string) => favorites.some(f => f.id === propertyId),
    [favorites]
  );

  const toggleFavorite = useCallback(
    (item: FavoriteItem) => {
      const isFav = favorites.some(f => f.id === item.id);

      if (isAuthenticated) {
        // Redux-managed
        if (isFav) {
          dispatch(removeFromFavorites(item.id));
        } else {
          dispatch(addToFavorites(item));
        }
      } else {
        // localStorage-managed for guests
        const current = readLocalFavorites();
        if (isFav) {
          writeLocalFavorites(current.filter(f => f.id !== item.id));
        } else {
          writeLocalFavorites([...current, item]);
        }
      }
    },
    [favorites, isAuthenticated, dispatch]
  );

  const favoriteCount = favorites.length;

  return {
    favorites,
    isFavorite,
    toggleFavorite,
    favoriteCount,
    isAuthenticated,
  };
}

export default usePublicFavorites;
