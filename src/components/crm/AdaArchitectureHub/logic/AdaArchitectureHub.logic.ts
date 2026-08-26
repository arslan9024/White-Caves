/**
 * AdaArchitectureHub.logic.ts
 * Hook & Business logic layer for Ada Architecture Hub
 */

import { useState, useMemo, useCallback } from 'react';
import { ADA_ARCHITECTURE_DOCS, ADA_ARCHITECTURE_CATEGORIES, AdaDocItem } from '../../../../data/adaArchitectureDocsRegistry';

export function useAdaArchitectureHubLogic() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  const filteredDocs = useMemo(() => {
    return ADA_ARCHITECTURE_DOCS.filter((doc) => {
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
    return ADA_ARCHITECTURE_DOCS.find((d) => d.id === activeDocId) || null;
  }, [activeDocId]);

  const handleOpenDoc = useCallback((doc: AdaDocItem) => {
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
    categories: ADA_ARCHITECTURE_CATEGORIES,
    filteredDocs,
    activeDoc,
    handleOpenDoc,
    handleCloseDoc,
    handlePrint,
  };
}
