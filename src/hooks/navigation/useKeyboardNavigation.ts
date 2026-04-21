/**
 * useKeyboardNavigation — Arrow key navigation through hierarchical tree
 *
 * Supports:
 *  - Arrow Up/Down: navigate items in flat list
 *  - Arrow Left/Right: collapse/expand parent (if available)
 *  - Enter: select/activate item
 *  - Escape: blur focus
 *  - Tab: focus next (browser default)
 *
 * Usage:
 *   const { focusIdx, getFocusProps, handleNavKey, items } = useKeyboardNavigation(itemList)
 *   <button {...getFocusProps(idx)} onClick={() => selectItem(idx)}>Item</button>
 */

import { useState, useCallback, useRef, useEffect } from 'react';

export interface NavigableItem {
  id: string;
  label: string;
  depth?: number; // 0 = top, 1 = nested, etc.
  parent?: string; // parent group ID for expand/collapse
  isExpandable?: boolean;
  isExpanded?: boolean;
}

interface UseKeyboardNavigationProps {
  items: NavigableItem[];
  onSelect?: (item: NavigableItem, idx: number) => void;
  onExpand?: (item: NavigableItem, shouldExpand: boolean) => void;
  onEscape?: () => void;
}

export interface FocusProps {
  ref: React.Ref<HTMLButtonElement>;
  tabIndex: number;
  'aria-label': string;
  'data-focus-idx'?: number;
}

export function useKeyboardNavigation({
  items,
  onSelect,
  onExpand,
  onEscape,
}: UseKeyboardNavigationProps) {
  const [focusIdx, setFocusIdx] = useState<number | null>(null);
  const itemRefs = useRef<Map<number, HTMLElement>>(new Map());

  const isFocused = focusIdx !== null && focusIdx < items.length;
  const focusedItem = isFocused ? items[focusIdx] : null;

  // Auto-focus element when focusIdx changes
  useEffect(() => {
    if (isFocused) {
      const el = itemRefs.current.get(focusIdx);
      if (el) {
        el.focus();
        el.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [focusIdx, isFocused]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (!isFocused) return;

      switch (e.key) {
        // Arrow Up
        case 'ArrowUp': {
          e.preventDefault();
          setFocusIdx(prev => {
            const next = prev === null ? items.length - 1 : Math.max(0, prev - 1);
            return next;
          });
          break;
        }

        // Arrow Down
        case 'ArrowDown': {
          e.preventDefault();
          setFocusIdx(prev => {
            const next = prev === null ? 0 : Math.min(items.length - 1, prev + 1);
            return next;
          });
          break;
        }

        // Arrow Right → expand
        case 'ArrowRight': {
          e.preventDefault();
          if (focusedItem?.isExpandable && !focusedItem?.isExpanded) {
            onExpand?.(focusedItem, true);
          }
          break;
        }

        // Arrow Left → collapse
        case 'ArrowLeft': {
          e.preventDefault();
          if (focusedItem?.isExpandable && focusedItem?.isExpanded) {
            onExpand?.(focusedItem, false);
          }
          break;
        }

        // Enter → select
        case 'Enter': {
          e.preventDefault();
          if (focusedItem) {
            onSelect?.(focusedItem, focusIdx);
          }
          break;
        }

        // Escape → unfocus
        case 'Escape': {
          e.preventDefault();
          setFocusIdx(null);
          onEscape?.();
          break;
        }

        default:
          break;
      }
    },
    [isFocused, focusedItem, focusIdx, items.length, onSelect, onExpand, onEscape]
  );

  const getFocusProps = useCallback(
    (idx: number): FocusProps => {
      const handleRef = (el: HTMLButtonElement | null) => {
        if (el) itemRefs.current.set(idx, el);
      };
      return {
        ref: handleRef,
        tabIndex: focusIdx === idx ? 0 : -1,
        'aria-label': items[idx]?.label || `Item ${idx}`,
        'data-focus-idx': idx,
      };
    },
    [focusIdx, items]
  );

  const setFocus = useCallback((idx: number | null) => {
    setFocusIdx(idx);
  }, []);

  return {
    focusIdx,
    isFocused,
    focusedItem,
    handleKeyDown,
    getFocusProps,
    setFocus,
  };
}
