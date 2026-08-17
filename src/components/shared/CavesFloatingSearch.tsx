import React, { FC } from 'react';
import { Search, X, Building, Filter, RotateCcw, Bed, Bath, Maximize2 } from 'lucide-react';
import { useCavesFloatingSearch } from './CavesFloatingSearch.logic';
import {
  FloatingPillWrapper,
  FloatingPillButton,
  ModalBackdrop,
  ModalCard,
  ModalHeader,
  SearchBarSection,
  InputGroup,
  FilterRow,
  SelectControl,
  ResultsSection,
  ResultsGrid,
  PropertyCard,
  EmptyState,
} from './CavesFloatingSearch.style';

export interface CavesFloatingSearchProps {
  buttonText?: string;
  subtitleText?: string;
}

export const CavesFloatingSearch: FC<CavesFloatingSearchProps> = ({
  buttonText = 'Search Properties',
  subtitleText = '100 Dubai Units',
}) => {
  const {
    isOpen,
    openModal,
    closeModal,
    filters,
    updateFilter,
    resetFilters,
    filteredProperties,
    communitiesList,
    totalSeededCount,
    availableCount,
  } = useCavesFloatingSearch();

  return (
    <>
      <FloatingPillWrapper data-testid="caves-floating-search">
        <FloatingPillButton
          onClick={openModal}
          aria-label="Open Property Search Modal"
          title="Search White Caves Properties"
        >
          <div className="pill-icon">
            <Search size={18} />
          </div>
          <div className="pill-text">
            <span className="pill-title">{buttonText}</span>
            <span className="pill-subtitle">{subtitleText}</span>
          </div>
        </FloatingPillButton>
      </FloatingPillWrapper>

      {isOpen && (
        <ModalBackdrop onClick={closeModal}>
          <ModalCard onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h3>
                <Building size={20} color="#EF4444" />
                White Caves Property Search
                <span className="badge">{filteredProperties.length} Matches</span>
              </h3>
              <button
                className="close-btn"
                onClick={closeModal}
                aria-label="Close Modal"
                title="Close"
              >
                <X size={20} />
              </button>
            </ModalHeader>

            <SearchBarSection>
              <InputGroup>
                <Search size={18} className="search-icon" />
                <input
                  type="text"
                  placeholder="Search by community, title, ID (e.g. wc_dh2_001), or feature..."
                  value={filters.searchTerm}
                  onChange={(e) => updateFilter('searchTerm', e.target.value)}
                  autoFocus
                />
              </InputGroup>

              <FilterRow>
                <SelectControl>
                  <label>Community</label>
                  <select
                    value={filters.community}
                    onChange={(e) => updateFilter('community', e.target.value)}
                  >
                    {communitiesList.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </SelectControl>

                <SelectControl>
                  <label>Bedrooms</label>
                  <select
                    value={filters.beds}
                    onChange={(e) =>
                      updateFilter(
                        'beds',
                        e.target.value === 'All' ? 'All' : Number(e.target.value)
                      )
                    }
                  >
                    <option value="All">All Beds</option>
                    <option value="1">1 Bed</option>
                    <option value="2">2 Beds</option>
                    <option value="3">3 Beds</option>
                    <option value="4">4 Beds</option>
                    <option value="5">5+ Beds</option>
                  </select>
                </SelectControl>

                <SelectControl>
                  <label>Type</label>
                  <select
                    value={filters.propertyType}
                    onChange={(e) => updateFilter('propertyType', e.target.value)}
                  >
                    <option value="All">All Types</option>
                    <option value="Villa">Villa</option>
                    <option value="Townhouse">Townhouse</option>
                    <option value="Apartment">Apartment</option>
                    <option value="Penthouse">Penthouse</option>
                  </select>
                </SelectControl>

                <SelectControl>
                  <label>Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => updateFilter('status', e.target.value)}
                  >
                    <option value="All">All Statuses</option>
                    <option value="Available">Available ({availableCount})</option>
                    <option value="Leased">Leased</option>
                    <option value="UnderMaintenance">Maintenance</option>
                    <option value="Sold">Sold</option>
                    <option value="Pending">Pending</option>
                  </select>
                </SelectControl>

                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button
                    onClick={resetFilters}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '8px',
                      border: '1px solid #cbd5e1',
                      background: '#ffffff',
                      color: '#475569',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      height: '36px',
                    }}
                  >
                    <RotateCcw size={14} /> Reset
                  </button>
                </div>
              </FilterRow>
            </SearchBarSection>

            <ResultsSection>
              {filteredProperties.length > 0 ? (
                <ResultsGrid>
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id}>
                      <div className="img-container">
                        <img src={property.stockImageCdnUrl} alt={property.title} loading="lazy" />
                        <span className={`status-badge ${property.status}`}>
                          {property.status}
                        </span>
                      </div>
                      <div className="card-body">
                        <div className="price">AED {(property.priceAED || 0).toLocaleString()}</div>
                        <h4 className="title">{property.title}</h4>
                        <div className="community">📍 {property.community}</div>
                        <div className="meta">
                          <span>🛏️ {property.beds} Beds</span>
                          <span>🚿 {property.baths} Baths</span>
                          <span>📐 {property.sqft.toLocaleString()} sqft</span>
                        </div>
                      </div>
                    </PropertyCard>
                  ))}
                </ResultsGrid>
              ) : (
                <EmptyState>
                  <div className="icon">🔍</div>
                  <h4>No matching properties found</h4>
                  <p>Try clearing your filters or searching for another Dubai community.</p>
                </EmptyState>
              )}
            </ResultsSection>
          </ModalCard>
        </ModalBackdrop>
      )}
    </>
  );
};

export default CavesFloatingSearch;
