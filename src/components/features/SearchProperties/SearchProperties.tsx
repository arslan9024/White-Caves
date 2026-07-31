// src/components/features/SearchProperties/SearchProperties.tsx
/**
 * Property Search Feature Component
 * Example of a second feature to demonstrate the pattern
 *
 * This component shows how to:
 * - Use theme colors
 * - Handle user input
 * - Display search results
 * - Work with the sidebar system
 */

import React, { useState } from 'react';
import styled from 'styled-components';
import { authFetch } from '../../../utils/authFetch';

const Container = styled.div`
  padding: 24px;
  background: ${({ theme }) => String((theme as any)?.colors?.backgroundAlt ?? '#f9fafb')};
  color: ${({ theme }) => String((theme as any)?.colors?.textPrimary ?? '#1f2937')};
  overflow-y: auto;
  height: 100%;
`;

const Header = styled.div`
  margin-bottom: 32px;

  h1 {
    margin: 0 0 8px 0;
    font-size: 28px;
    font-weight: 600;
    color: ${({ theme }) => String((theme as any)?.colors?.textPrimary ?? '#1f2937')};
  }

  p {
    margin: 0;
    color: ${({ theme }) => String((theme as any)?.colors?.textSecondary ?? '#6b7280')};
    font-size: 14px;
  }
`;

const SearchForm = styled.form`
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 12px;
  margin-bottom: 24px;
`;

const SearchInput = styled.input`
  padding: 10px 14px;
  border: 1px solid ${({ theme }) => String((theme as any)?.colors?.border ?? '#e5e7eb')};
  border-radius: 6px;
  background: ${({ theme }) => String((theme as any)?.colors?.cardBg ?? '#ffffff')};
  color: ${({ theme }) => String((theme as any)?.colors?.textPrimary ?? '#1f2937')};
  font-family: ${props => (props.theme as any)?.fonts?.family ?? 'inherit'};
  font-size: 14px;

  &:focus {
    outline: none;
    border-color: ${props => (props.theme as any)?.colors?.primary || '#3b82f6'};
    box-shadow: 0 0 0 3px ${props => (props.theme as any)?.colors?.primary || '#3b82f6'}20;
  }

  &::placeholder {
    color: ${props => (props.theme as any)?.colors?.textSecondary || '#6b7280'};
  }
`;

const SearchButton = styled.button`
  padding: 10px 20px;
  background: ${props => (props.theme as any)?.colors?.primary || '#3b82f6'};
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    opacity: 0.8;
  }
`;

const FilterSection = styled.div`
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid ${({ theme }) => String((theme as any)?.colors?.border ?? '#e5e7eb')};

  h3 {
    margin: 0 0 12px 0;
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    color: ${props => (props.theme as any)?.colors?.textSecondary || '#6b7280'};
  }
`;

const FilterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 12px;
`;

const FilterCheckbox = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  color: ${({ theme }) => String((theme as any)?.colors?.textPrimary ?? '#1f2937')};
  font-size: 14px;

  input {
    cursor: pointer;
  }

  &:hover {
    color: ${props => (props.theme as any)?.colors?.primary || '#3b82f6'};
  }
`;

const ResultsSection = styled.div`
  margin-top: 24px;
`;

const ResultsHeader = styled.h2`
  margin: 0 0 16px 0;
  font-size: 16px;
  font-weight: 600;
  color: ${({ theme }) => String((theme as any)?.colors?.textPrimary ?? '#1f2937')};
`;

const ResultsList = styled.div`
  display: grid;
  gap: 12px;
`;

const ResultCard = styled.div`
  background: ${({ theme }) => String((theme as any)?.colors?.cardBg ?? '#ffffff')};
  border: 1px solid ${({ theme }) => String((theme as any)?.colors?.border ?? '#e5e7eb')};
  border-radius: 8px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    border-color: ${props => (props.theme as any)?.colors?.primary || '#3b82f6'};
    box-shadow: 0 2px 8px ${props => (props.theme as any)?.colors?.primary || '#3b82f6'}20;
  }

  .property-name {
    font-weight: 600;
    color: ${({ theme }) => String((theme as any)?.colors?.textPrimary ?? '#1f2937')};
    margin-bottom: 4px;
  }

  .property-location {
    font-size: 13px;
    color: ${({ theme }) => String((theme as any)?.colors?.textSecondary ?? '#6b7280')};
    margin-bottom: 8px;
  }

  .property-details {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;
    padding-top: 12px;
    border-top: 1px solid ${props => (props.theme as any)?.colors?.border || '#e5e7eb'};
  }

  .detail {
    font-size: 13px;

    .label {
      color: ${props => (props.theme as any)?.colors?.textSecondary || '#6b7280'};
      display: block;
      margin-bottom: 2px;
    }

    .value {
      color: ${props => (props.theme as any)?.colors?.primary || '#3b82f6'};
      font-weight: 600;
    }
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 40px 20px;
  color: ${({ theme }) => String((theme as any)?.colors?.textSecondary ?? '#6b7280')};

  .icon {
    font-size: 48px;
    margin-bottom: 12px;
  }

  h3 {
    margin: 0 0 8px 0;
    color: ${({ theme }) => String((theme as any)?.colors?.textPrimary ?? '#1f2937')};
  }

  p {
    margin: 0;
    font-size: 14px;
  }
`;

interface SearchFilters {
  status: string[];
  priceRange: string;
  bedrooms: string;
}

interface PropertyResult {
  id: string;
  name: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  area: string;
  status: string;
}

/**
 * Property Search Component
 * Demonstrates a realistic feature with search and filters
 */
export const SearchProperties: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<SearchFilters>({
    status: [],
    priceRange: 'all',
    bedrooms: 'all',
  });
  const [results, setResults] = useState<PropertyResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm.trim()) params.set('search', searchTerm.trim());
      if (filters.status.length === 1) params.set('status', filters.status[0]);
      if (filters.bedrooms !== 'all' && filters.bedrooms !== '4+') {
        params.set('minBeds', filters.bedrooms);
      } else if (filters.bedrooms === '4+') {
        params.set('minBeds', '4');
      }
      params.set('pageSize', '20');

      const resp = await authFetch(`/api/properties?${params.toString()}`);
      const data = (await resp.json()) as { data: Record<string, unknown>[] };
      const mapped: PropertyResult[] = (data.data || []).map(prop => ({
        id: String(prop.id ?? ''),
        name: String(prop.title || 'Unnamed Property'),
        location: String(prop.location || prop.area || 'Dubai, UAE'),
        price: prop.price ? `AED ${Number(prop.price).toLocaleString()}` : 'Price on Request',
        bedrooms: Number(prop.bedrooms ?? 0),
        bathrooms: Number(prop.bathrooms ?? 0),
        area: prop.sqft ? `${String(prop.sqft)} sqft` : String(prop.area || 'N/A'),
        status:
          prop.status === 'available'
            ? 'Available'
            : prop.status === 'sold'
              ? 'Sold'
              : prop.status === 'rented'
                ? 'Rented'
                : 'Pending',
      }));
      setResults(mapped);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (filterType: keyof SearchFilters, value: string | string[]) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value,
    }));
  };

  return (
    <Container>
      <Header>
        <h1>🔍 Property Search</h1>
        <p>Find the perfect property in Dubai</p>
      </Header>

      {/* Search Form */}
      <SearchForm onSubmit={handleSearch}>
        <SearchInput
          type="text"
          placeholder="Search by property name or location..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
        <SearchButton type="submit">Search</SearchButton>
      </SearchForm>

      {/* Filters */}
      <FilterSection>
        <h3>Status</h3>
        <FilterGrid>
          <FilterCheckbox>
            <input
              type="checkbox"
              checked={filters.status.includes('available')}
              onChange={e =>
                handleFilterChange(
                  'status',
                  e.target.checked
                    ? [...filters.status, 'available']
                    : filters.status.filter(s => s !== 'available')
                )
              }
            />
            Available
          </FilterCheckbox>
          <FilterCheckbox>
            <input
              type="checkbox"
              checked={filters.status.includes('pending')}
              onChange={e =>
                handleFilterChange(
                  'status',
                  e.target.checked
                    ? [...filters.status, 'pending']
                    : filters.status.filter(s => s !== 'pending')
                )
              }
            />
            Pending
          </FilterCheckbox>
        </FilterGrid>
      </FilterSection>

      {/* Results */}
      <ResultsSection>
        {loading ? (
          <EmptyState>
            <div className="icon">⏳</div>
            <h3>Searching…</h3>
            <p>Loading properties from the database</p>
          </EmptyState>
        ) : hasSearched && results.length === 0 ? (
          <EmptyState>
            <div className="icon">🏘️</div>
            <h3>No Properties Found</h3>
            <p>Try adjusting your search criteria</p>
          </EmptyState>
        ) : results.length > 0 ? (
          <>
            <ResultsHeader>
              Found {results.length} {results.length === 1 ? 'property' : 'properties'}
            </ResultsHeader>
            <ResultsList>
              {results.map(property => (
                <ResultCard key={property.id}>
                  <div className="property-name">{property.name}</div>
                  <div className="property-location">{property.location}</div>
                  <div className="property-details">
                    <div className="detail">
                      <span className="label">Price</span>
                      <span className="value">{property.price}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Beds</span>
                      <span className="value">{property.bedrooms}</span>
                    </div>
                    <div className="detail">
                      <span className="label">Area</span>
                      <span className="value">{property.area}</span>
                    </div>
                  </div>
                </ResultCard>
              ))}
            </ResultsList>
          </>
        ) : (
          <EmptyState>
            <div className="icon">🔎</div>
            <h3>Search for Properties</h3>
            <p>Enter a property name or location to begin your search</p>
          </EmptyState>
        )}
      </ResultsSection>
    </Container>
  );
};

export default SearchProperties;
