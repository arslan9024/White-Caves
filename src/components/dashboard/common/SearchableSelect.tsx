/**
 * SearchableSelect.tsx
 *
 * Generic, accessible, and high-aesthetic searchable dropdown selector
 * used across Dashboard Sidebar tiles (Departments, AI Assistants, etc.).
 */

import React, { FC, useState, useRef, useEffect, useDeferredValue, useMemo, useId } from 'react';
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
  background: #ffffff;
  font-size: 0.82rem;
  font-weight: 800;
  color: #1e293b;
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
  background: #ffffff;
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
    background: #f1f5f9;
    border-radius: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background: #cbd5e1;
    border-radius: 4px;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 7px 10px;
  border-radius: 6px;
  border: 1px solid #cbd5e1;
  font-size: 0.8rem;
  margin-bottom: 6px;
  outline: none;
  background: #f8fafc;
  color: #1e293b;

  &:focus {
    border-color: #3b82f6;
    background: #ffffff;
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

  &:focus-visible {
    outline: 2px solid ${props => props.$accentColor};
    outline-offset: 2px;
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
  const [activeOptionIndex, setActiveOptionIndex] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const optionRefs = useRef<Array<HTMLDivElement | null>>([]);
  const listboxId = useId();

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

  useEffect(() => {
    if (!isOpen) return;
    const selectedIndex = filteredOptions.findIndex(option => option.id === selectedId);
    setActiveOptionIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [filteredOptions, isOpen, selectedId]);

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
    triggerRef.current?.focus();
  };

  const closeAndReturnFocus = () => {
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  const handleSearchKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowDown' && filteredOptions.length > 0) {
      event.preventDefault();
      const index = Math.min(activeOptionIndex, filteredOptions.length - 1);
      optionRefs.current[index]?.focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeAndReturnFocus();
    }
  };

  const handleOptionKeyDown = (event: React.KeyboardEvent<HTMLDivElement>, index: number) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      optionRefs.current[Math.min(index + 1, filteredOptions.length - 1)]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      if (index === 0) {
        searchInputRef.current?.focus();
      } else {
        optionRefs.current[index - 1]?.focus();
      }
    } else if (event.key === 'Home') {
      event.preventDefault();
      optionRefs.current[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      optionRefs.current[filteredOptions.length - 1]?.focus();
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const option = filteredOptions[index];
      if (option) handleSelectOption(option);
    } else if (event.key === 'Escape') {
      event.preventDefault();
      closeAndReturnFocus();
    }
  };

  return (
    <DropdownWrapper ref={wrapperRef}>
      <SelectTrigger
        ref={triggerRef}
        type="button"
        $accentColor={accentColor}
        $borderColor={borderColor}
        onClick={handleToggle}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
      >
        <span
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            maxWidth: '230px',
          }}
        >
          {selectedOption ? (
            <>
              {selectedOption.num && (
                <strong style={{ color: accentColor, marginRight: '6px' }}>
                  {selectedOption.num}
                </strong>
              )}
              {selectedOption.icon && (
                <span style={{ marginRight: '4px' }}>{selectedOption.icon}</span>
              )}
              {selectedOption.name}
            </>
          ) : (
            <span style={{ color: 'var(--color-94a3b8, #94A3B8)' }}>{placeholder}</span>
          )}
        </span>
        <span style={{ fontSize: '0.75rem', color: accentColor, marginLeft: '4px', flexShrink: 0 }}>
          {isOpen ? '▲' : `▼ ${labelPrefix || 'Select'}`}
        </span>
      </SelectTrigger>

      {isOpen && (
        <DropdownMenu $accentColor={accentColor}>
          <SearchInput
            ref={searchInputRef}
            type="text"
            placeholder={searchPlaceholder}
            aria-label="Search options"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            autoFocus
          />

          <div id={listboxId} role="listbox" aria-label="Options">
            {filteredOptions.map((option, index) => (
              <OptionItem
                key={option.id}
                ref={element => {
                  optionRefs.current[index] = element;
                }}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={selectedId === option.id}
                tabIndex={index === activeOptionIndex ? 0 : -1}
                $selected={selectedId === option.id}
                $accentColor={accentColor}
                onClick={() => handleSelectOption(option)}
                onFocus={() => setActiveOptionIndex(index)}
                onKeyDown={event => handleOptionKeyDown(event, index)}
              >
                {option.num && (
                  <span style={{ fontWeight: 800, color: accentColor, minWidth: '42px' }}>
                    {option.num}
                  </span>
                )}
                {option.icon && <span>{option.icon}</span>}
                <span
                  style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
                >
                  {option.name} {option.role ? `— ${option.role}` : ''}
                </span>
              </OptionItem>
            ))}
          </div>
          {filteredOptions.length === 0 && (
            <div
              role="status"
              style={{
                padding: '8px 10px',
                fontSize: '0.78rem',
                color: 'var(--color-94a3b8, #94A3B8)',
                textAlign: 'center',
              }}
            >
              No matches found
            </div>
          )}
        </DropdownMenu>
      )}
    </DropdownWrapper>
  );
};

export default SearchableSelect;
