/**
 * AuroraSoftwareHub.logic.ts
 * Hook & Business logic layer for Aurora Software Architecture Documentation Hub
 */

import { useState, useMemo, useCallback } from 'react';
import { AURORA_SOFTWARE_DOCS, AURORA_SOFTWARE_CATEGORIES, SoftwareDocItem } from '../../../../data/auroraSoftwareDocsRegistry';

export function useAuroraSoftwareHubLogic() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  const filteredDocs = useMemo(() => {
    return AURORA_SOFTWARE_DOCS.filter((doc) => {
      const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        doc.title.toLowerCase().includes(query) ||
        doc.code.toLowerCase().includes(query) ||
        doc.summary.toLowerCase().includes(query) ||
        doc.tags.some((tag) => tag.toLowerCase().includes(query));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  const activeDoc = useMemo(() => {
    if (!activeDocId) return null;
    return AURORA_SOFTWARE_DOCS.find((d) => d.id === activeDocId) || null;
  }, [activeDocId]);

  const handleOpenDoc = useCallback((doc: SoftwareDocItem) => {
    setActiveDocId(doc.id);
  }, []);

  const handleCloseDoc = useCallback(() => {
    setActiveDocId(null);
  }, []);

  const handlePrint = useCallback(() => {
    window.print();
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories: AURORA_SOFTWARE_CATEGORIES,
    filteredDocs,
    activeDoc,
    handleOpenDoc,
    handleCloseDoc,
    handlePrint,
  };
}
