import { useState, useCallback, useEffect } from 'react';

export const useFloatingSearchLogic = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSearch = useCallback(() => {
    if (navigator.vibrate) navigator.vibrate(50);
    setIsOpen(prev => !prev);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleSearch();
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, toggleSearch]);

  return { isOpen, toggleSearch };
};
