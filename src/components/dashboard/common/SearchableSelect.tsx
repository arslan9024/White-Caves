/**
 * SearchableSelect.tsx
 *
 * Generic, accessible, and high-aesthetic searchable dropdown selector
 * used across Dashboard Sidebar tiles (Departments, AI Assistants, etc.).
 */

import React, { FC, useState, useRef, useEffect, useDeferredValue, useMemo } from 'react';
import styled from 'styled-components';

export interface SearchableOption {
  id: string;
  num?: string;
  name: string;
  role?: string;
  icon?: string;
  badge?: string;
  badgeColor?: string;
}

export interface SearchableSelectProps {
  options: SearchableOption[];
  selectedId: string;
  onSelect: (option: SearchableOption) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  accentColor?: string;
  borderColor?: string;
  labelPrefix?: string;
}

const DropdownWrapper = styled.div`
  position: relative;
  width: 100%;
`;

const SelectTrigger = styled.button<{ $accentColor: string; $borderColor?: string }>`
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1.5px solid ${props => props.$borderColor || props.$accentColor};
  background: #FFFFFF;
  font-size: 0.82rem;
  font-weight: 800;
  color: #1E293B;
  text-align: left;
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;

  &:hover {
    border-color: ${props => props.$accentColor};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  }
`;

const DropdownMenu = styled.div<{ $accentColor: string }>`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: #FFFFFF;
  border: 1px solid ${props => `${props.$accentColor}40`};
  border-radius: 10px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  z-index: 120;
  padding: 8px;
  max-height: 270px;
  overflow-y: auto;

  /* Custom scrollbar */
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-track {
    background: #F1F5F9;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #CBD5E1;
    border-radius: 4px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 7px 10px;
  border-radius: 6px;
  border: 1px solid #CBD5E1;
  font-size: 0.8rem;
  margin-bottom: 6px;
  outline: none;
  background: #F8FAFC;
  color: #1E293B;

  &:focus {
    border-color: #3B82F6;
    background: #FFFFFF;
  }
`;

const OptionItem = styled.div<{ $selected: boolean; $accentColor: string }>`
  padding: 8px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: ${props => (props.$selected ? 800 : 600)};
  background: ${props => (props.$selected ? `${props.$accentColor}18` : 'transparent')};
  color: ${props => (props.$selected ? props.$accentColor : '#334155')};
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 2px;
  transition: all 0.15s ease;

  &:hover {
    background: ${props => (props.$selected ? `${props.$accentColor}25` : '#F1F5F9')};
    color: ${props => props.$accentColor};
  }
`;

export const SearchableSelect: FC<SearchableSelectProps> = ({
  options,
  selectedId,
  onSelect,
  placeholder = 'Select option...',
  searchPlaceholder = '🔍 Search...',
  accentColor = '#EF4444',
  borderColor,
  labelPrefix,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  const selectedOption = useMemo(() => {
    return options.find(opt => opt.id === selectedId) || options[0];
  }, [options, selectedId]);

  const deferredQuery = useDeferredValue(searchQuery);

  const filteredOptions = useMemo(() => {
    if (!deferredQuery.trim()) return options;
    const q = deferredQuery.toLowerCase();
    return options.filter(opt => {
      const matchText = `${opt.num || ''} ${opt.name} ${opt.role || ''} ${opt.id}`.toLowerCase();
      return matchText.includes(q);
    });
  }, [options, deferredQuery]);

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setSearchQuery('');
    }
  };

  const handleSelectOption = (option: SearchableOption) => {
    onSelect(option);
    setIsOpen(false);
  };

  return (
    <DropdownWrapper ref={wrapperRef}>
      <SelectTrigger
        type="button"
        $accentColor={accentColor}
        $borderColor={borderColor}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '230px' }}>
          {selectedOption ? (
            <>
              {selectedOption.num && (
                <strong style={{ color: accentColor, marginRight: '6px' }}>{selectedOption.num}</strong>
              )}
              {selectedOption.icon && <span style={{ marginRight: '4px' }}>{selectedOption.icon}</span>}
              {selectedOption.name}
            </>
          ) : (
            <span style={{ color: '#94A3B8' }}>{placeholder}</span>
          )}
        </span>
        <span style={{ fontSize: '0.75rem', color: accentColor, marginLeft: '4px', flexShrink: 0 }}>
          {isOpen ? '▲' : `▼ ${labelPrefix || 'Select'}`}
        </span>
      </SelectTrigger>

      {isOpen && (
        <DropdownMenu $accentColor={accentColor} role="listbox">
          <SearchInput
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            autoFocus
          />

          {filteredOptions.length === 0 ? (
            <div style={{ padding: '8px 10px', fontSize: '0.78rem', color: '#94A3B8', textAlign: 'center' }}>
              No matches found
            </div>
          ) : (
            filteredOptions.map(option => (
              <OptionItem
                key={option.id}
                role="option"
                aria-selected={selectedId === option.id}
                $selected={selectedId === option.id}
                $accentColor={accentColor}
                onClick={() => handleSelectOption(option)}
              >
                {option.num && (
                  <span style={{ fontWeight: 800, color: accentColor, minWidth: '42px' }}>{option.num}</span>
                )}
                {option.icon && <span>{option.icon}</span>}
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {option.name} {option.role ? `— ${option.role}` : ''}
                </span>
              </OptionItem>
            ))
          )}
        </DropdownMenu>
      )}
    </DropdownWrapper>
  );
};

export default SearchableSelect;
