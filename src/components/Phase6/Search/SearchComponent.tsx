import React, { useState, useCallback, useMemo } from 'react';
import styled from 'styled-components';
import type { SearchResult, SearchFilters } from '../../../types/phase6.types';

interface SearchComponentProps {
  onSearch: (query: string, filters: SearchFilters) => Promise<SearchResult[]>;
  onSelectResult?: (result: SearchResult) => void;
  placeholder?: string;
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SearchBarContainer = styled.div`
  position: relative;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 12px 16px 12px 40px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4caf50;
    box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
  }
`;

const SearchIcon = styled.svg`
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #999;
`;

const ClearButton = styled.button`
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #333;
  }

  svg {
    width: 18px;
    height: 18px;
  }
`;

const FilterContainer = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
`;

const FilterChip = styled.button<{ isActive: boolean }>`
  padding: 8px 16px;
  border: 1px solid ${(props) => (props.isActive ? '#4caf50' : '#ddd')};
  background-color: ${(props) => (props.isActive ? '#e8f5e9' : '#fff')};
  color: ${(props) => (props.isActive ? '#2e7d32' : '#666')};
  border-radius: 20px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    border-color: #4caf50;
  }
`;

const ResultsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-height: 500px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
  }

  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }
`;

const ResultItem = styled.div<{ isHovered: boolean }>`
  padding: 12px;
  background-color: ${(props) => (props.isHovered ? '#f5f5f5' : '#fff')};
  border: 1px solid #e0e0e0;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background-color: #f5f5f5;
    border-color: #4caf50;
  }
`;

const ResultTitle = styled.div`
  font-weight: 600;
  color: #333;
  font-size: 14px;
  margin-bottom: 4px;
`;

const ResultPreview = styled.div`
  color: #666;
  font-size: 12px;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const ResultMeta = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 11px;
  color: #999;
`;

const Badge = styled.span<{ type: string }>`
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 11px;
  background-color: ${(props) => {
    switch (props.type) {
      case 'message':
        return '#e3f2fd';
      case 'contact':
        return '#f3e5f5';
      case 'file':
        return '#fff3e0';
      default:
        return '#f5f5f5';
    }
  }};
  color: ${(props) => {
    switch (props.type) {
      case 'message':
        return '#1976d2';
      case 'contact':
        return '#7b1fa2';
      case 'file':
        return '#f57c00';
      default:
        return '#666';
    }
  }};
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 32px;
  color: #999;
  gap: 12px;

  svg {
    width: 48px;
    height: 48px;
    opacity: 0.5;
  }
`;

const LoadingState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 32px;
  color: #999;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }

  svg {
    width: 24px;
    height: 24px;
    animation: spin 1s linear infinite;
  }
`;

const StatisticsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 12px;
  padding: 12px 0;
  border-top: 1px solid #e0e0e0;
  border-bottom: 1px solid #e0e0e0;
`;

const StatisticItem = styled.div`
  text-align: center;
  padding: 8px;

  .stat-number {
    font-size: 18px;
    font-weight: 700;
    color: #4caf50;
  }

  .stat-label {
    font-size: 12px;
    color: #999;
    margin-top: 4px;
  }
`;

export const SearchComponent: React.FC<SearchComponentProps> = ({
  onSearch,
  onSelectResult,
  placeholder = 'Search conversations, contacts, files...',
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [filters, setFilters] = useState<SearchFilters>({
    type: 'all',
  });

  const resultStats = useMemo(() => {
    return {
      total: results.length,
      messages: results.filter((r) => r.type === 'message').length,
      contacts: results.filter((r) => r.type === 'contact').length,
      files: results.filter((r) => r.type === 'file').length,
    };
  }, [results]);

  const handleSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([]);
        setHasSearched(false);
        return;
      }

      setIsLoading(true);
      setHasSearched(true);

      try {
        const searchResults = await onSearch(searchQuery, filters);
        setResults(searchResults);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [onSearch, filters]
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);

    // Debounced search
    const timeout = setTimeout(() => {
      handleSearch(newQuery);
    }, 300);

    return () => clearTimeout(timeout);
  };

  const handleClear = () => {
    setQuery('');
    setResults([]);
    setHasSearched(false);
  };

  const handleFilterChange = (filterType: string) => {
    const newType = filters.type === filterType ? 'all' : filterType;
    const newFilters = { ...filters, type: newType as any };
    setFilters(newFilters);
    handleSearch(query);
  };

  const handleResultClick = (result: SearchResult) => {
    onSelectResult?.(result);
  };

  return (
    <Container>
      <SearchBarContainer>
        <SearchIcon viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </SearchIcon>
        <SearchInput
          type="text"
          value={query}
          onChange={handleQueryChange}
          placeholder={placeholder}
        />
        {query && (
          <ClearButton onClick={handleClear}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </ClearButton>
        )}
      </SearchBarContainer>

      <FilterContainer>
        <FilterChip
          isActive={filters.type === 'all'}
          onClick={() => handleFilterChange('all')}
        >
          All
        </FilterChip>
        <FilterChip
          isActive={filters.type === 'message'}
          onClick={() => handleFilterChange('message')}
        >
          Messages
        </FilterChip>
        <FilterChip
          isActive={filters.type === 'contact'}
          onClick={() => handleFilterChange('contact')}
        >
          Contacts
        </FilterChip>
        <FilterChip
          isActive={filters.type === 'file'}
          onClick={() => handleFilterChange('file')}
        >
          Files
        </FilterChip>
      </FilterContainer>

      {hasSearched && results.length > 0 && (
        <StatisticsContainer>
          <StatisticItem>
            <div className="stat-number">{resultStats.total}</div>
            <div className="stat-label">Total Results</div>
          </StatisticItem>
          {resultStats.messages > 0 && (
            <StatisticItem>
              <div className="stat-number">{resultStats.messages}</div>
              <div className="stat-label">Messages</div>
            </StatisticItem>
          )}
          {resultStats.contacts > 0 && (
            <StatisticItem>
              <div className="stat-number">{resultStats.contacts}</div>
              <div className="stat-label">Contacts</div>
            </StatisticItem>
          )}
          {resultStats.files > 0 && (
            <StatisticItem>
              <div className="stat-number">{resultStats.files}</div>
              <div className="stat-label">Files</div>
            </StatisticItem>
          )}
        </StatisticsContainer>
      )}

      {isLoading && (
        <LoadingState>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span>Searching...</span>
        </LoadingState>
      )}

      {!isLoading && hasSearched && results.length === 0 && (
        <EmptyState>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <p>No results found for "{query}"</p>
        </EmptyState>
      )}

      {!isLoading && hasSearched && results.length > 0 && (
        <ResultsContainer>
          {results.map((result, index) => (
            <ResultItem
              key={result.id}
              isHovered={hoveredIndex === index}
              onClick={() => handleResultClick(result)}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'start',
                  gap: '8px',
                }}
              >
                <div style={{ flex: 1 }}>
                  <ResultTitle>{result.title}</ResultTitle>
                  <ResultPreview>{result.preview}</ResultPreview>
                </div>
                <Badge type={result.type}>{result.type}</Badge>
              </div>
              <ResultMeta>
                <span>{new Date(result.timestamp).toLocaleDateString()}</span>
              </ResultMeta>
            </ResultItem>
          ))}
        </ResultsContainer>
      )}
    </Container>
  );
};

export default SearchComponent;
