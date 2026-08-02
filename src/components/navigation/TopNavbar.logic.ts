/**
 * TopNavbar.logic.ts — Business Logic Layer (Atomic 3-Folder Pattern)
 *
 * Extracts all stateful logic, event handlers, and search behavior
 * from the TopNavbar component shell. Import this in TopNavbar.tsx
 * using the `useTopNavbarLogic` hook.
 */

import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkspace } from '../../context/WorkspaceContext';
import { Personnel } from '../../types/companyCore';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TopNavbarState {
  searchQuery: string;
  searchInputRef: React.RefObject<HTMLInputElement>;
}

export interface TopNavbarHandlers {
  handleSearchSubmit: (e: React.FormEvent) => void;
  handleSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleImpersonationChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  handleNotificationsClick: () => void;
  handleProfileClick: () => void;
}

export interface UseTopNavbarLogicReturn extends TopNavbarState, TopNavbarHandlers {
  activeUser: Personnel | null;
  impersonatedUser: Personnel | null;
  isMaster: boolean;
  personnel: Personnel[];
  clearImpersonation: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useTopNavbarLogic(): UseTopNavbarLogicReturn {
  const navigate = useNavigate();
  const {
    activeUser,
    impersonatedUser,
    setImpersonatedUser,
    clearImpersonation,
    isMaster,
    personnel,
  } = useWorkspace();

  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Ctrl+K / Cmd+K global search shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const q = searchQuery.trim();
      if (!q) return;
      navigate(`/properties?search=${encodeURIComponent(q)}`);
    },
    [navigate, searchQuery]
  );

  const handleImpersonationChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selectedId = e.target.value;
      if (!selectedId) {
        clearImpersonation();
        return;
      }
      const found = personnel.find((p) => p.id === selectedId);
      if (found) setImpersonatedUser(found);
    },
    [clearImpersonation, personnel, setImpersonatedUser]
  );

  const handleNotificationsClick = useCallback(() => {
    navigate('/crm/communications');
  }, [navigate]);

  const handleProfileClick = useCallback(() => {
    navigate('/profile');
  }, [navigate]);

  return {
    // State
    searchQuery,
    searchInputRef,
    // Handlers
    handleSearchChange,
    handleSearchSubmit,
    handleImpersonationChange,
    handleNotificationsClick,
    handleProfileClick,
    // Workspace
    activeUser,
    impersonatedUser,
    isMaster,
    personnel,
    clearImpersonation,
  };
}
