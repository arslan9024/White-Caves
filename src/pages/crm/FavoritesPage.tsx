/**
 * CRM Favorites Page
 * Grid of favorited properties with remove functionality.
 * Business logic extracted to useFavorites hook.
 * Shared styles imported from CrmPageStyles.
 * Route: /owner/crm/favorites
 */

import React, { FC } from 'react';
import styled from 'styled-components';
import { Pagination } from '../../components/ui';
import { useDocumentTitle } from '../../hooks/useDocumentTitle';
import {
  PageContainer, PageHeader, PageTitle, BackLink,
  ActionBar, SearchInput,
  DangerButton, SecondaryButton,
  EmptyState,
  PaginationWrapper, LoadingBanner, ErrorBanner,
} from './styles/CrmPageStyles';
import { useFavorites } from './hooks/useFavorites';
import type { FavoriteProperty } from './hooks/useFavorites';

// ─── Favorites-Specific Styled Components ───────────────────────────────

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
`;

const PropertyCard = styled.div`
  background: white;
  border: 1px solid #e8e8e8;
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.2s;

  &:hover {
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    transform: translateY(-2px);
  }
`;

const PropertyImage = styled.div<{ $type?: string }>`
  height: 180px;
  background: ${props => {
    switch (props.$type) {
      case 'villa': return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
      case 'apartment': return 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)';
      case 'penthouse': return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'commercial': return 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
      default: return 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)';
    }
  }};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
`;

const PropertyBody = styled.div`
  padding: 1.25rem;
`;

const PropertyTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a2e;
  margin: 0 0 0.25rem;
`;

const PropertyLocation = styled.div`
  font-size: 0.8rem;
  color: #888;
  margin-bottom: 0.75rem;
`;

const PropertyPrice = styled.div`
  font-size: 1.15rem;
  font-weight: 700;
  color: #10B981;
  margin-bottom: 0.75rem;
`;

const PropertyMeta = styled.div`
  display: flex;
  gap: 1rem;
  font-size: 0.78rem;
  color: #666;
  margin-bottom: 0.75rem;
`;

const PropertyActions = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-top: 0.75rem;
  border-top: 1px solid #f0f0f0;
`;

const FavCount = styled.span`
  font-size: 0.8rem;
  color: '#888';
  margin-left: auto;
`;

// ─── Component ──────────────────────────────────────────────────────────

const FavoritesPage: FC = () => {
  useDocumentTitle('Favorites');
  const {
    filteredFavorites, paginatedFavorites,
    loading, error,
    search, currentPage, ITEMS_PER_PAGE,
    handleRemoveFavorite,
    handleSearchChange,
    setCurrentPage, retryFetch, goBack,
    formatCurrency,
  } = useFavorites();

  return (
    <PageContainer>
      {/* Page Header */}
      <PageHeader>
        <div>
          <BackLink onClick={goBack}>← Back to CRM Hub</BackLink>
          <PageTitle>❤️ Favorites</PageTitle>
        </div>
      </PageHeader>

      {/* Loading & Error States */}
      {loading && <LoadingBanner>⏳ Loading favorites...</LoadingBanner>}
      {error && (
        <ErrorBanner>
          <span>⚠️ {error}</span>
          <SecondaryButton onClick={retryFetch}>Retry</SecondaryButton>
        </ErrorBanner>
      )}

      {/* Search */}
      <ActionBar>
        <SearchInput
          type="text"
          placeholder="Search favorites..."
          value={search}
          onChange={e => handleSearchChange(e.target.value)}
        />
        <FavCount>
          {filteredFavorites.length} favorite{filteredFavorites.length !== 1 ? 's' : ''}
        </FavCount>
      </ActionBar>

      {/* Property Grid */}
      {paginatedFavorites.length > 0 ? (
        <Grid>
          {paginatedFavorites.map((fav: FavoriteProperty) => (
            <PropertyCard key={fav.id}>
              <PropertyImage $type={fav.type}>
                {fav.type === 'villa' ? '🏡' :
                  fav.type === 'apartment' ? '🏢' :
                  fav.type === 'penthouse' ? '🏙️' :
                  fav.type === 'commercial' ? '🏗️' : '🏠'}
              </PropertyImage>
              <PropertyBody>
                <PropertyTitle>{fav.title || 'Untitled Property'}</PropertyTitle>
                <PropertyLocation>📍 {fav.location || 'Location not specified'}</PropertyLocation>
                <PropertyPrice>{formatCurrency(fav.price)}</PropertyPrice>
                <PropertyMeta>
                  {fav.bedrooms != null && fav.bedrooms > 0 && (
                    <span>🛏️ {fav.bedrooms} Bed</span>
                  )}
                  {fav.bathrooms != null && fav.bathrooms > 0 && (
                    <span>🚿 {fav.bathrooms} Bath</span>
                  )}
                  {fav.sqft != null && fav.sqft > 0 && (
                    <span>📐 {fav.sqft.toLocaleString()} sqft</span>
                  )}
                </PropertyMeta>
                <PropertyActions>
                  <DangerButton onClick={() => handleRemoveFavorite(fav.property_id || fav.id)}>
                    ❌ Remove
                  </DangerButton>
                </PropertyActions>
              </PropertyBody>
            </PropertyCard>
          ))}
        </Grid>
      ) : (
        <EmptyState>
          {search
            ? 'No favorites match your search'
            : 'No favorites yet — browse properties and add some!'}
        </EmptyState>
      )}

      {/* Pagination */}
      {filteredFavorites.length > ITEMS_PER_PAGE && (
        <PaginationWrapper>
          <Pagination
            currentPage={currentPage}
            totalItems={filteredFavorites.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </PaginationWrapper>
      )}
    </PageContainer>
  );
};

export default FavoritesPage;
