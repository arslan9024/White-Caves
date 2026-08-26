/**
 * AegisAutopilotHub.logic.ts
 * Hook & Business logic layer for AEGIS Autopilot Hub
 */

import { useState, useMemo, useCallback } from 'react';
import { AEGIS_ORCHESTRATOR_DOCS, AEGIS_ORCHESTRATOR_CATEGORIES, AegisDocItem } from '../../../../data/aegisOrchestratorDocsRegistry';

export function useAegisAutopilotHubLogic() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeDocId, setActiveDocId] = useState<string | null>(null);

  const filteredDocs = useMemo(() => {
    return AEGIS_ORCHESTRATOR_DOCS.filter((doc) => {
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
    return AEGIS_ORCHESTRATOR_DOCS.find((d) => d.id === activeDocId) || null;
  }, [activeDocId]);

  const handleOpenDoc = useCallback((doc: AegisDocItem) => {
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
    categories: AEGIS_ORCHESTRATOR_CATEGORIES,
    filteredDocs,
    activeDoc,
    handleOpenDoc,
    handleCloseDoc,
    handlePrint,
  };
}
