import { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUICK_SEARCH_CATEGORIES } from './CavesFloatingSearch.data';
import { MASTER_35_AI_ASSISTANTS } from '../../data/assistants35Registry.data';

export const useFloatingSearchLogic = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');

  const toggleSearch = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeSearch = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Global ⌘K / Ctrl+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      } else if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const searchResults = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) {
      // Default trending results
      return [
        { id: 'TREND-1', title: 'DAMAC Hills 2 — Luxury Villa Cluster', sub: '85 Live Listings · Starting AED 1.2M', badge: 'DH2 Hub', path: '/properties' },
        { id: 'TREND-2', title: 'Palm Jumeirah — Signature Beachfront Mansions', sub: '42 Verified Listings · Private Pools', badge: 'Ultra Prime', path: '/properties' },
        { id: 'TREND-3', title: 'AI Nadia — Ejari Automation Engine', sub: 'Portfolio Management & Residential Leasing', badge: 'AI Assistant', path: '/crm' },
        { id: 'TREND-4', title: 'Downtown Dubai — Burj Crown & Opera District', sub: '68 Listings · High Yield Investment', badge: 'Secondary', path: '/properties' },
        { id: 'TREND-5', title: 'AI Sentinel — IoT Maintenance Dispatcher', sub: 'Asset Management & Facilities (DH2)', badge: 'AI Assistant', path: '/crm' },
      ];
    }

    const matchedAssistants = MASTER_35_AI_ASSISTANTS.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.title.toLowerCase().includes(q) ||
      a.departmentName.toLowerCase().includes(q) ||
      a.code.toLowerCase().includes(q)
    ).map(a => ({
      id: `AI-${a.id}`,
      title: `${a.name} — ${a.title}`,
      sub: `${a.departmentName} · SLA ${a.slaResponseTime}`,
      badge: a.code,
      path: '/crm',
    }));

    const mockPropertyResults = [
      { id: 'PROP-1', title: `DAMAC Hills 2 Villa matching "${query}"`, sub: 'Water Town · 4 BR · AED 1,850,000', badge: 'DAMAC Hills 2', path: '/properties' },
      { id: 'PROP-2', title: `Palm Jumeirah Mansion matching "${query}"`, sub: 'Frond N · 6 BR · AED 42,000,000', badge: 'Palm Jumeirah', path: '/properties' },
      { id: 'PROP-3', title: `Downtown Luxury Penthouse matching "${query}"`, sub: 'Boulevard Point · 3 BR · AED 8,500,000', badge: 'Downtown Dubai', path: '/properties' },
    ];

    return [...matchedAssistants, ...mockPropertyResults];
  }, [query]);

  const handleResultClick = useCallback((path: string) => {
    setIsOpen(false);
    navigate(path);
  }, [navigate]);

  return {
    isOpen,
    query,
    setQuery,
    activeCategory,
    setActiveCategory,
    categories: QUICK_SEARCH_CATEGORIES,
    searchResults,
    toggleSearch,
    closeSearch,
    handleResultClick,
  };
};
