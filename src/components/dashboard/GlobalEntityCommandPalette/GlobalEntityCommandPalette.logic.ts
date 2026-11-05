/**
 * White Caves Real Estate LLC - Global Command Palette Logic Hook
 * Architecture: AEGIS Canonical 7-Category Architecture Standard (Logic)
 * Single Purpose File Law: < 350 lines
 */

import { useState, useMemo, useEffect, useCallback } from 'react';
import {
  EntityCategory,
  CommandPaletteEntityItem,
  GlobalEntityCommandPaletteProps,
} from './GlobalEntityCommandPalette.types';
import { buildGlobalCommandPaletteIndex } from './GlobalEntityCommandPalette.data';

export function useGlobalEntityCommandPaletteLogic(
  props: Pick<GlobalEntityCommandPaletteProps, 'isOpen' | 'onClose' | 'onSelectEntity'>
) {
  const { isOpen, onClose, onSelectEntity } = props;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<EntityCategory>('ALL');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allEntities = useMemo(() => buildGlobalCommandPaletteIndex(), []);

  // Filtered list based on category & search terms
  const filteredEntities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return allEntities.filter(item => {
      if (selectedCategory !== 'ALL' && item.category !== selectedCategory) {
        return false;
      }
      if (!query) return true;
      const idStr = item.id ? String(item.id).toLowerCase() : '';
      const titleStr = item.title ? String(item.title).toLowerCase() : '';
      const subtitleStr = item.subtitle ? String(item.subtitle).toLowerCase() : '';
      const badgeStr = item.badge ? String(item.badge).toLowerCase() : '';

      return (
        idStr.includes(query) ||
        titleStr.includes(query) ||
        subtitleStr.includes(query) ||
        badgeStr.includes(query) ||
        (Array.isArray(item.keywords) &&
          item.keywords.some(kw => kw && String(kw).toLowerCase().includes(query)))
      );
    });
  }, [allEntities, searchQuery, selectedCategory]);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [searchQuery, selectedCategory]);

  // Reset search when opening
  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setSelectedCategory('ALL');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  const handleSelectIndex = useCallback(
    (index: number) => {
      const entity = filteredEntities[index];
      if (entity) {
        onSelectEntity(entity);
        onClose();
      }
    },
    [filteredEntities, onSelectEntity, onClose]
  );

  // Keyboard navigation
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1 < filteredEntities.length ? prev + 1 : 0));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 >= 0 ? prev - 1 : filteredEntities.length - 1));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        handleSelectIndex(selectedIndex);
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    },
    [filteredEntities.length, handleSelectIndex, selectedIndex, onClose]
  );

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    selectedIndex,
    setSelectedIndex,
    filteredEntities,
    handleSelectIndex,
    handleKeyDown,
  };
}
