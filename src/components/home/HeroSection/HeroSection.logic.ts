import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

export const DESTINATION_TAGS = [
  'Palm Jumeirah',
  'Downtown Dubai',
  'Dubai Marina',
  'Business Bay',
  'DAMAC Hills 2',
  'Jumeirah Village Circle',
];

export function useHeroSectionLogic() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState('Palm Jumeirah');

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
    destinationTags: DESTINATION_TAGS,
  };
}
