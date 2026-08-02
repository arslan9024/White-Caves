/**
 * UnifiedWorkspaceLayout.logic.ts — Business Logic Layer (Atomic 3-Folder Pattern)
 *
 * Extracts all stateful logic and derived data from UnifiedWorkspaceLayout.
 * Import via `useWorkspaceLayoutLogic()` in the component shell.
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { VIEWS_REGISTRY, ViewDefinition } from '../config/viewsRegistry';
import { evaluateFounderGuard, UserProfile } from '../guards/FounderGuard';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface WorkspaceLayoutState {
  userProfile: UserProfile;
  activeViewCode: string;
  searchTerm: string;
  activeCategory: string;
  activeView: ViewDefinition;
  categories: string[];
  filteredViews: ViewDefinition[];
}

export interface WorkspaceLayoutHandlers {
  setActiveViewCode: (code: string) => void;
  setSearchTerm: (term: string) => void;
  setActiveCategory: (cat: string) => void;
}

export interface UseWorkspaceLayoutLogicReturn
  extends WorkspaceLayoutState,
    WorkspaceLayoutHandlers {}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useWorkspaceLayoutLogic(
  currentUserEmail: string,
  initialViewId: string
): UseWorkspaceLayoutLogicReturn {
  // ── State ──────────────────────────────────────────────────────────────────
  const [userProfile, setUserProfile] = useState<UserProfile>(() =>
    evaluateFounderGuard(currentUserEmail)
  );
  const [activeViewCode, setActiveViewCode] = useState<string>(initialViewId);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // ── Effects ────────────────────────────────────────────────────────────────
  useEffect(() => {
    setUserProfile(evaluateFounderGuard(currentUserEmail));
  }, [currentUserEmail]);

  // ── Derived Data ───────────────────────────────────────────────────────────
  const activeView = useMemo(
    () =>
      VIEWS_REGISTRY.find(
        (v) => v.code === activeViewCode || v.id === activeViewCode
      ) || VIEWS_REGISTRY[0],
    [activeViewCode]
  );

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(VIEWS_REGISTRY.map((v) => v.category)))],
    []
  );

  const filteredViews = useMemo(
    () =>
      VIEWS_REGISTRY.filter((v) => {
        const matchesCategory =
          activeCategory === 'All' || v.category === activeCategory;
        const q = searchTerm.toLowerCase();
        const matchesSearch =
          v.title.toLowerCase().includes(q) ||
          v.code.toLowerCase().includes(q) ||
          v.group.toLowerCase().includes(q);
        return matchesCategory && matchesSearch;
      }),
    [activeCategory, searchTerm]
  );

  // ── Stable Handlers ────────────────────────────────────────────────────────
  const handleSetActiveViewCode = useCallback((code: string) => {
    setActiveViewCode(code);
  }, []);

  const handleSetSearchTerm = useCallback((term: string) => {
    setSearchTerm(term);
  }, []);

  const handleSetActiveCategory = useCallback((cat: string) => {
    setActiveCategory(cat);
  }, []);

  return {
    // State
    userProfile,
    activeViewCode,
    searchTerm,
    activeCategory,
    // Derived
    activeView,
    categories,
    filteredViews,
    // Handlers
    setActiveViewCode: handleSetActiveViewCode,
    setSearchTerm: handleSetSearchTerm,
    setActiveCategory: handleSetActiveCategory,
  };
}
