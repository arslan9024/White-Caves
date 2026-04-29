import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { ChevronDown, Search, Check, X } from 'lucide-react';
import './SearchableDropdown.css';

const SearchableDropdown = ({
  options = [],
  value,
  onChange,
  placeholder = 'Select...',
  searchPlaceholder = 'Search...',
  groupBy = null,
  groupLabels = {},
  groupColors = {},
  renderOption = null,
  renderSelected = null,
  disabled = false,
  className = '',
  showSearch = true,
  emptyMessage = 'No results found'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef(null);
  const searchInputRef = useRef(null);
  const listRef = useRef(null);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return options;
    const query = searchQuery.toLowerCase();
    return options.filter(option => {
      const searchableText = [
        option.label,
        option.name,
        option.title,
        option.description,
        option.id
      ].filter(Boolean).join(' ').toLowerCase();
      return searchableText.includes(query);
    });
  }, [options, searchQuery]);

  const groupedOptions = useMemo(() => {
    if (!groupBy) return { ungrouped: filteredOptions };
    
    const groups = {};
    filteredOptions.forEach(option => {
      const groupKey = option[groupBy] || 'other';
      if (!groups[groupKey]) groups[groupKey] = [];
      groups[groupKey].push(option);
    });
    return groups;
  }, [filteredOptions, groupBy]);

  const flatOptions = useMemo(() => {
    if (!groupBy) return filteredOptions;
    return Object.values(groupedOptions).flat();
  }, [groupBy, filteredOptions, groupedOptions]);

  const selectedOption = useMemo(() => {
    return options.find(opt => opt.id === value || opt.value === value);
  }, [options, value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isOpen && searchInputRef.current && showSearch) {
      searchInputRef.current.focus();
    }
  }, [isOpen, showSearch]);

  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const highlightedItem = listRef.current.querySelector(`[data-index="${highlightedIndex}"]`);
      if (highlightedItem) {
        highlightedItem.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < flatOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : flatOptions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && flatOptions[highlightedIndex]) {
          handleSelect(flatOptions[highlightedIndex]);
        }
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
        break;
      default:
        break;
    }
  }, [isOpen, highlightedIndex, flatOptions]);

  const handleSelect = useCallback((option) => {
    onChange(option.id || option.value, option);
    setIsOpen(false);
    setSearchQuery('');
    setHighlightedIndex(-1);
  }, [onChange]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setSearchQuery('');
        setHighlightedIndex(-1);
      }
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    searchInputRef.current?.focus();
  };

  const renderDefaultOption = (option, isSelected, isHighlighted) => (
    <div className="dropdown-option-content">
      {option.icon && (
        <span className="option-icon" style={{ '--option-color': option.color }}>
          {typeof option.icon === 'function' 
            ? React.createElement(option.icon, { size: 16 })
            : option.icon}
        </span>
      )}
      <div className="option-text">
        <span className="option-label">{option.label || option.name}</span>
        {option.description && (
          <span className="option-description">{option.description}</span>
        )}
      </div>
      {isSelected && <Check size={16} className="check-icon" />}
    </div>
  );

  const renderDefaultSelected = (option) => (
    <div className="selected-content">
      {option.icon && (
        <span className="selected-icon" style={{ '--option-color': option.color }}>
          {typeof option.icon === 'function' 
            ? React.createElement(option.icon, { size: 18 })
            : option.icon}
        </span>
      )}
      <span className="selected-label">{option.label || option.name}</span>
    </div>
  );

  let optionIndex = -1;

  return (
    <div 
      ref={containerRef}
      className={`searchable-dropdown ${className} ${isOpen ? 'open' : ''} ${disabled ? 'disabled' : ''}`}
      onKeyDown={handleKeyDown}
    >
      <button
        type="button"
        className="dropdown-trigger"
        onClick={handleToggle}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {selectedOption ? (
          renderSelected 
            ? renderSelected(selectedOption)
            : renderDefaultSelected(selectedOption)
        ) : (
          <span className="placeholder">{placeholder}</span>
        )}
        <ChevronDown 
          size={18} 
          className={`chevron ${isOpen ? 'rotated' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="dropdown-panel">
          {showSearch && (
            <div className="search-container">
              <Search size={16} className="search-icon" />
              <input
                ref={searchInputRef}
                type="text"
                className="search-input"
                placeholder={searchPlaceholder}
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setHighlightedIndex(0);
                }}
              />
              {searchQuery && (
                <button className="clear-search" onClick={clearSearch}>
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          <div className="options-list" ref={listRef} role="listbox">
            {filteredOptions.length === 0 ? (
              <div className="empty-message">{emptyMessage}</div>
            ) : groupBy ? (
              Object.entries(groupedOptions).map(([groupKey, groupOptions]) => {
                if (groupOptions.length === 0) return null;
                
                return (
                  <div key={groupKey} className="option-group">
                    <div 
                      className="group-header"
                      style={{ '--group-color': groupColors[groupKey] || '#64748b' }}
                    >
                      <span>{groupLabels[groupKey] || groupKey}</span>
                      <span className="group-count">{groupOptions.length}</span>
                    </div>
                    {groupOptions.map((option) => {
                      optionIndex++;
                      const currentIndex = optionIndex;
                      const isSelected = value === (option.id || option.value);
                      const isHighlighted = highlightedIndex === currentIndex;
                      
                      return (
                        <button
                          key={option.id || option.value}
                          type="button"
                          className={`dropdown-option ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                          onClick={() => handleSelect(option)}
                          onMouseEnter={() => setHighlightedIndex(currentIndex)}
                          data-index={currentIndex}
                          role="option"
                          aria-selected={isSelected}
                        >
                          {renderOption 
                            ? renderOption(option, isSelected, isHighlighted)
                            : renderDefaultOption(option, isSelected, isHighlighted)}
                        </button>
                      );
                    })}
                  </div>
                );
              })
            ) : (
              filteredOptions.map((option, index) => {
                const isSelected = value === (option.id || option.value);
                const isHighlighted = highlightedIndex === index;
                
                return (
                  <button
                    key={option.id || option.value}
                    type="button"
                    className={`dropdown-option ${isSelected ? 'selected' : ''} ${isHighlighted ? 'highlighted' : ''}`}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    data-index={index}
                    role="option"
                    aria-selected={isSelected}
                  >
                    {renderOption 
                      ? renderOption(option, isSelected, isHighlighted)
                      : renderDefaultOption(option, isSelected, isHighlighted)}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
