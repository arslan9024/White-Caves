/**
 * MargaretPlansHub.logic.ts
 * Hook & Business logic layer for Margaret Strategic Planning Hub
 */

import { useState, useMemo, useCallback } from 'react';
import { MARGARET_PLANS_DOCS, MARGARET_PLANS_CATEGORIES, PlanDocItem } from '../../../../data/margaretPlansDocsRegistry';

export function useMargaretPlansHubLogic() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  const filteredDocs = useMemo(() => {
    return MARGARET_PLANS_DOCS.filter((doc) => {
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
    return MARGARET_PLANS_DOCS.find((d) => d.id === activeDocId) || null;
  }, [activeDocId]);

  const handleOpenDoc = useCallback((doc: PlanDocItem) => {
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
    categories: MARGARET_PLANS_CATEGORIES,
    filteredDocs,
    activeDoc,
    handleOpenDoc,
    handleCloseDoc,
    handlePrint,
  };
}
