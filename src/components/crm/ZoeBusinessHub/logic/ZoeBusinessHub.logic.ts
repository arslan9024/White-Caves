/**
 * ZoeBusinessHub.logic.ts
 * Hook & Business logic layer for Zoe Business Documentation Hub
 */

import { useState, useMemo, useCallback } from 'react';
import { ZOE_BUSINESS_DOCS, ZOE_BUSINESS_CATEGORIES, BusinessDocItem } from '../../../../data/zoeBusinessDocsRegistry';

export function useZoeBusinessHubLogic() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  const filteredDocs = useMemo(() => {
    return ZOE_BUSINESS_DOCS.filter((doc) => {
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
    return ZOE_BUSINESS_DOCS.find((d) => d.id === activeDocId) || null;
  }, [activeDocId]);

  const handleOpenDoc = useCallback((doc: BusinessDocItem) => {
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
    categories: ZOE_BUSINESS_CATEGORIES,
    filteredDocs,
    activeDoc,
    handleOpenDoc,
    handleCloseDoc,
    handlePrint,
  };
}
