/**
 * CavesFloatingSearch.logic.ts — Search Modal State & Keyboard Shortcuts
 */

import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../../context/ThemeContext';

export function useCavesFloatingSearchLogic() {
  let isDark = false;
  try {
    const themeCtx = useTheme();
    if (themeCtx) isDark = themeCtx.isDark;
  } catch {}

  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const openModal = useCallback(() => {
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setQuery('');
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        closeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeModal]);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      if (query.trim()) {
        closeModal();
        navigate(`/properties?search=${encodeURIComponent(query.trim())}`);
      }
    },
    [query, closeModal, navigate]
  );

  const handleTagClick = useCallback(
    (tag: string) => {
      closeModal();
      navigate(`/properties?search=${encodeURIComponent(tag)}`);
    },
    [closeModal, navigate]
  );

  return {
    isDark,
    isOpen,
    query,
    setQuery,
    inputRef,
    openModal,
    closeModal,
    handleSearchSubmit,
    handleTagClick,
  };
}
