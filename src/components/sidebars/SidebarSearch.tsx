/**
 * Sidebar Search Component
 * Real-time search and filtering for sidebar items
 */

import React, { useState, useCallback, useEffect } from 'react';
import styled from 'styled-components';
import { debounce } from 'lodash-es';

const SearchContainer = styled.div`
  padding: 12px 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
`;

const SearchInputWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 6px;
  padding: 0 8px;
  transition: all 0.2s ease;

  &:focus-within {
    background: rgba(255, 255, 255, 0.1);
    border-color: #3498db;
    box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.1);
  }
`;

const SearchIcon = styled.span`
  color: #999;
  font-size: 14px;
  margin-right: 8px;
`;

const SearchInput = styled.input`
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 13px;
  padding: 8px 0;
  outline: none;

  &::placeholder {
    color: #666;
  }
`;

const ClearButton = styled.button`
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  font-size: 14px;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;

  &:hover {
    color: #fff;
  }

  &:disabled {
    display: none;
  }
`;

const NoResultsMessage = styled.div`
  padding: 12px 16px;
  font-size: 12px;
  color: #999;
  text-align: center;
  font-style: italic;
`;

interface SidebarSearchProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  onClear?: () => void;
  showNoResults?: boolean;
  resultsFound?: number;
}

/**
 * Sidebar Search Component
 * Provides real-time search/filter for sidebar items
 * Features:
 * - Debounced search (300ms)
 * - Clear button
 * - Keyboard shortcuts (Escape to clear)
 * - Visual feedback
 */
export const SidebarSearch: React.FC<SidebarSearchProps> = ({
  placeholder = 'Search departments...',
  onSearch,
  onClear,
  showNoResults = false,
  resultsFound = 0,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  // Debounced search handler
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 300),
    [onSearch]
  );

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle clear button click
  const handleClear = () => {
    setSearchQuery('');
    onClear?.();
    onSearch('');
  };

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape' && searchQuery) {
      handleClear();
    }
  };

  return (
    <>
      <SearchContainer>
        <SearchInputWrapper>
          <SearchIcon>🔍</SearchIcon>
          <SearchInput
            type="text"
            placeholder={placeholder}
            value={searchQuery}
            onChange={handleSearchChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            aria-label="Search sidebar items"
          />
          <ClearButton
            onClick={handleClear}
            disabled={!searchQuery}
            title="Clear search (Esc)"
            aria-label="Clear search"
          >
            ✕
          </ClearButton>
        </SearchInputWrapper>
      </SearchContainer>

      {showNoResults && searchQuery && resultsFound === 0 && (
        <NoResultsMessage>
          No results found for "{searchQuery}"
        </NoResultsMessage>
      )}
    </>
  );
};

export default SidebarSearch;
