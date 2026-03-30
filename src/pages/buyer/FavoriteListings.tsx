/**
 * Favorite Listings Page
 * ──────────────────────
 * Displays the user's saved favorite properties with full property cards.
 * Fetches from /api/favorites with pagination support.
 * Heart toggle removes properties from the list in real-time.
 */

import React, { useEffect, useState, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/store';
import {
  selectFavorites,
  selectFavoritesLoading,
  fetchFavoritesThunk,
  removeFavoriteThunk,
  type FavoriteItem,
} from '../../store/dashboardSlice';
import PropertyCard from '../../components/common/PropertyCard';
import '../RolePages.css';

const FavoriteListings: React.FC = () => {
  const dispatch = useAppDispatch();
  const favorites: FavoriteItem[] = useAppSelector(selectFavorites);
  const loading = useAppSelector(selectFavoritesLoading);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<'newest' | 'price-asc' | 'price-desc'>('newest');

  useEffect(() => {
    dispatch(fetchFavoritesThunk({ page, pageSize: 20 }));
  }, [dispatch, page]);

  const handleRemoveFavorite = useCallback(
    (propertyId: string) => {
      dispatch(removeFavoriteThunk(propertyId));
    },
    [dispatch],
  );

  const sortedFavorites = React.useMemo(() => {
    const sorted = [...favorites];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    }
    // 'newest' keeps the original API order (createdAt desc)
    return sorted;
  }, [favorites, sortBy]);

  return (
    <div className="role-page no-sidebar">
      <div className="role-page-content full-width">
        <div className="page-header">
          <h1>❤️ My Favorites</h1>
          <p>Properties you&apos;ve saved for later review</p>
        </div>

        {/* Toolbar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <span style={{ color: 'var(--color-text-secondary, #6b7280)', fontSize: '0.95rem' }}>
            {favorites.length} saved {favorites.length === 1 ? 'property' : 'properties'}
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--color-border, #e5e7eb)',
              background: 'var(--color-surface, #fff)',
              fontSize: '0.9rem',
            }}
            aria-label="Sort favorites"
          >
            <option value="newest">Recently Added</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>

        {/* Loading */}
        {loading && (
          <div
            style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--color-text-secondary, #6b7280)' }}
          >
            Loading your favorites…
          </div>
        )}

        {/* Empty state */}
        {!loading && favorites.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              background: 'var(--color-surface, #f9fafb)',
              borderRadius: '12px',
              border: '2px dashed var(--color-border, #e5e7eb)',
            }}
          >
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🤍</div>
            <h3 style={{ marginBottom: '0.5rem', color: 'var(--color-text, #111827)' }}>
              No favorites yet
            </h3>
            <p style={{ color: 'var(--color-text-secondary, #6b7280)', maxWidth: '400px', margin: '0 auto' }}>
              Browse properties and tap the heart icon to save them here for quick access.
            </p>
          </div>
        )}

        {/* Favorites grid */}
        {!loading && sortedFavorites.length > 0 && (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {sortedFavorites.map((fav) => (
              <div key={fav.id} style={{ position: 'relative' }}>
                <PropertyCard
                  id={fav.id}
                  title={fav.title}
                  location={fav.location}
                  price={fav.price}
                  image={fav.image}
                  showFavorite={true}
                />
                <button
                  onClick={() => handleRemoveFavorite(fav.id)}
                  title="Remove from favorites"
                  style={{
                    position: 'absolute',
                    top: '0.75rem',
                    right: '0.75rem',
                    background: 'rgba(239, 68, 68, 0.9)',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '50%',
                    width: '28px',
                    height: '28px',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 2,
                  }}
                  aria-label={`Remove ${fav.title} from favorites`}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {favorites.length >= 20 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid var(--color-border, #e5e7eb)',
                background: page <= 1 ? '#f3f4f6' : 'var(--color-surface, #fff)',
                cursor: page <= 1 ? 'not-allowed' : 'pointer',
              }}
            >
              ← Previous
            </button>
            <span style={{ padding: '0.5rem 1rem', color: 'var(--color-text-secondary, #6b7280)' }}>
              Page {page}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              style={{
                padding: '0.5rem 1.5rem',
                borderRadius: '8px',
                border: '1px solid var(--color-border, #e5e7eb)',
                background: 'var(--color-surface, #fff)',
                cursor: 'pointer',
              }}
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FavoriteListings;
