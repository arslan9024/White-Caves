/**
 * UnifiedWorkspaceLayout.logic.ts — Business Logic Layer (Atomic 3-Folder Pattern)
 *
 * Extracts all stateful logic and derived data from UnifiedWorkspaceLayout.
 * Connects directly to the Global Context Quartet (UserRoleContext).
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { VIEWS_REGISTRY, ViewDefinition } from '../config/viewsRegistry';
import { evaluateFounderGuard, UserProfile } from '../guards/FounderGuard';
import { useUserRole } from '../context/UserRoleContext';

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
  const roleContext = useUserRole();

  // ── State ──────────────────────────────────────────────────────────────────
  const [activeViewCode, setActiveViewCode] = useState<string>(initialViewId);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');

  // Derive active user profile from UserRoleContext or fallback to evaluateFounderGuard
  const userProfile: UserProfile = useMemo(() => {
    if (roleContext && roleContext.user) {
      return {
        email: roleContext.user.email,
        name: roleContext.user.name,
        role: roleContext.user.role,
        accessLevel: roleContext.accessLevel,
        isFounder: roleContext.isFounder,
        isManagingDirector: roleContext.isManagingDirector,
        permissions: roleContext.user.permissions,
        tokenValid: true,
      };
    }
    return evaluateFounderGuard(currentUserEmail);
  }, [roleContext, currentUserEmail]);

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

        // Level 5 views require level 5 access
        const isLevel5 = userProfile.isFounder || userProfile.accessLevel >= 5;
        const isRestrictedL5 = v.group.toLowerCase().includes('managing director') || v.group.toLowerCase().includes('executive');
        if (isRestrictedL5 && !isLevel5) {
          return false;
        }

        return matchesCategory && matchesSearch;
      }),
    [activeCategory, searchTerm, userProfile]
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
