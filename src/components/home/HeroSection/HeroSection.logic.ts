import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { POPULAR_COMMUNITIES } from './data/HeroSection.data';

export const DESTINATION_TAGS = POPULAR_COMMUNITIES;

export function useHeroSectionLogic() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState(POPULAR_COMMUNITIES[0]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [searchType, setSearchType] = useState<'buy' | 'rent'>('buy');
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [propertyCount, setPropertyCount] = useState(0);

  useEffect(() => {
    let current = 0;
    const target = 8432;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 100) + 150;
      if (current >= target) {
        setPropertyCount(target);
        clearInterval(interval);
      } else {
        setPropertyCount(current);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  }, []);

  const handleSearchSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      navigate(`/properties?search=${encodeURIComponent(searchTerm || selectedTag)}`);
    },
    [navigate, searchTerm, selectedTag]
  );

  const selectTag = useCallback((tag: string) => {
    setSelectedTag(tag);
    setSearchTerm(tag);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    selectedTag,
    selectTag,
    handleSearchSubmit,
    destinationTags: POPULAR_COMMUNITIES,
    theme,
    toggleTheme,
    searchType,
    setSearchType,
    showAutocomplete,
    setShowAutocomplete,
    propertyCount,
  };
}
