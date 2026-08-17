import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { POPULAR_COMMUNITIES } from './data/HeroSection.data';

export const DESTINATION_TAGS = POPULAR_COMMUNITIES;

export function useHeroSectionLogic() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState(POPULAR_COMMUNITIES[0]);

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
  };
}
