/**
 * White Caves Real Estate LLC - Global Entity Command Palette Component
 * Architecture: AEGIS Canonical 7-Category Architecture Standard (View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useRef, useEffect } from 'react';
import { Search, X, CornerDownLeft, ArrowUpDown } from 'lucide-react';
import {
  GlobalEntityCommandPaletteProps,
  EntityCategory,
} from './GlobalEntityCommandPalette.types';
import { useGlobalEntityCommandPaletteLogic } from './GlobalEntityCommandPalette.logic';
import {
  PaletteBackdrop,
  PaletteDialog,
  PaletteSearchHeader,
  CategoryFilterDeck,
  CategoryChip,
  PaletteResultsList,
  PaletteResultItem,
  PaletteFooter,
} from './GlobalEntityCommandPalette.styles';

const CATEGORIES: { key: EntityCategory; label: string }[] = [
  { key: 'ALL', label: 'All Entities' },
  { key: 'DEPARTMENTS', label: 'Departments' },
  { key: 'EMPLOYEES', label: 'Employees' },
  { key: 'PROPERTIES', label: 'Properties' },
  { key: 'DEALS', label: 'Deals' },
  { key: 'CUSTOMERS', label: 'Customers' },
  { key: 'DOCUMENTS', label: 'Documents' },
  { key: 'TASKS', label: 'Tasks' },
  { key: 'RELATIONSHIPS', label: 'Relationships' },
  { key: 'LEADERBOARD', label: 'Leaderboard' },
];

export const GlobalEntityCommandPalette: FC<GlobalEntityCommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectEntity,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedIndex,
    setSelectedIndex,
    filteredEntities,
    handleSelectIndex,
    handleKeyDown,
  } = useGlobalEntityCommandPaletteLogic({ isOpen, onClose, onSelectEntity });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <PaletteBackdrop
      onClick={e => {
        if (e.target === e.currentTarget) onClose();
      }}
      data-testid="global-command-palette-backdrop"
    >
      <PaletteDialog
        onKeyDown={handleKeyDown}
        tabIndex={0}
        data-testid="global-command-palette-dialog"
      >
        {/* ── Search Input ── */}
        <PaletteSearchHeader>
          <Search size={20} color="#EF4444" />
          <input
            ref={inputRef}
            type="text"
            data-testid="palette-search-input"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search all 9 systems (Properties, Deals, Clients, Tasks, Docs, Employees)..."
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                color: '#64748B',
              }}
            >
              <X size={16} />
            </button>
          )}
        </PaletteSearchHeader>

        {/* ── Category Filters ── */}
        <CategoryFilterDeck>
          {CATEGORIES.map(cat => (
            <CategoryChip
              key={cat.key}
              type="button"
              $active={selectedCategory === cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              data-testid={`category-filter-${cat.key.toLowerCase()}`}
            >
              {cat.label}
            </CategoryChip>
          ))}
        </CategoryFilterDeck>

        {/* ── Results List ── */}
        <PaletteResultsList data-testid="palette-results-list">
          {filteredEntities.length === 0 ? (
            <div
              style={{
                padding: '32px 16px',
                textAlign: 'center',
                color: '#64748B',
                fontSize: '0.85rem',
              }}
            >
              No matching entities found across the 9 systems.
            </div>
          ) : (
            filteredEntities.map((item, index) => {
              const isSelected = index === selectedIndex;
              return (
                <PaletteResultItem
                  key={`${item.category}-${item.id}`}
                  $selected={isSelected}
                  onClick={() => handleSelectIndex(index)}
                  onMouseEnter={() => setSelectedIndex(index)}
                  data-testid={`palette-item-${item.id}`}
                >
                  <div className="item-left">
                    <span className="item-title">{item.title}</span>
                    <span className="item-subtitle">{item.subtitle}</span>
                  </div>
                  <div className="item-right">
                    <span
                      style={{
                        fontSize: '0.65rem',
                        fontWeight: 800,
                        padding: '2px 8px',
                        borderRadius: '4px',
                        backgroundColor: `${item.badgeColor}22`,
                        color: item.badgeColor,
                        border: `1px solid ${item.badgeColor}44`,
                      }}
                    >
                      {item.badge}
                    </span>
                    <span
                      style={{
                        fontSize: '0.65rem',
                        color: '#64748B',
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                      }}
                    >
                      {item.categoryLabel}
                    </span>
                  </div>
                </PaletteResultItem>
              );
            })
          )}
        </PaletteResultsList>

        {/* ── Footer ── */}
        <PaletteFooter>
          <span>
            Showing {filteredEntities.length} matching{' '}
            {filteredEntities.length === 1 ? 'entity' : 'entities'}
          </span>
          <div className="shortcuts">
            <span>
              <kbd>↑</kbd> <kbd>↓</kbd> Navigate
            </span>
            <span>
              <kbd>↵</kbd> Select
            </span>
            <span>
              <kbd>Esc</kbd> Close
            </span>
          </div>
        </PaletteFooter>
      </PaletteDialog>
    </PaletteBackdrop>
  );
};

export default GlobalEntityCommandPalette;
