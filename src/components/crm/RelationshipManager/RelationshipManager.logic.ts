/**
 * White Caves Real Estate LLC - Entity & Relationship Management Logic
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Logic)
 * Single Purpose File Law: < 350 lines
 */

import { useState, useMemo, useCallback, useEffect } from 'react';
import { RelationshipChain, EntityNode, RelationshipTab } from './RelationshipManager.types';
import { CANONICAL_RELATIONSHIPS } from './RelationshipManager.data';

export interface UseRelationshipManagerProps {
  initialChains?: RelationshipChain[];
  initialTab?: RelationshipTab;
  selectedEntityId?: string | null;
  onSelectEntity?: (id: string) => void;
  onNavigateToDeepRoute?: (route: string) => void;
}

export function useRelationshipManager({
  initialChains = CANONICAL_RELATIONSHIPS,
  selectedEntityId,
  onSelectEntity,
  onNavigateToDeepRoute,
}: UseRelationshipManagerProps = {}) {
  const [chains] = useState<RelationshipChain[]>(initialChains);
  const [activeChainId, setActiveChainId] = useState<string>(initialChains[0]?.id || 'REL-001');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<EntityNode | null>(null);

  const activeChain = useMemo(() => {
    return chains.find(c => c.id === activeChainId) || chains[0];
  }, [chains, activeChainId]);

  // Sync with selectedEntityId deep link
  useEffect(() => {
    if (selectedEntityId) {
      for (const chain of chains) {
        const found = chain.nodes.find(
          n =>
            n.id.toLowerCase() === selectedEntityId.toLowerCase() ||
            chain.id.toLowerCase() === selectedEntityId.toLowerCase()
        );
        if (found) {
          setActiveChainId(chain.id);
          setSelectedNode(found);
          break;
        }
      }
    }
  }, [selectedEntityId, chains]);

  // Filtered nodes in active chain
  const visibleNodes = useMemo(() => {
    if (!activeChain) return [];
    if (!searchQuery.trim()) return activeChain.nodes;
    const q = searchQuery.toLowerCase();
    return activeChain.nodes.filter(
      n =>
        n.id.toLowerCase().includes(q) ||
        n.name.toLowerCase().includes(q) ||
        n.type.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q)
    );
  }, [activeChain, searchQuery]);

  // Aggregate stats
  const stats = useMemo(() => {
    const totalEntities = chains.reduce((acc, c) => acc + c.nodes.length, 0);
    const totalEdges = chains.reduce((acc, c) => acc + c.edges.length, 0);
    const totalRevenue = chains.reduce((acc, c) => acc + c.grossRevenueAED, 0);
    const totalXP = chains.reduce((acc, c) => acc + c.meritXPAwarded, 0);

    return {
      chainsCount: chains.length,
      totalEntities,
      totalEdges,
      totalRevenueAED: totalRevenue,
      totalMeritXP: totalXP,
    };
  }, [chains]);

  const handleSelectNode = useCallback(
    (node: EntityNode) => {
      setSelectedNode(node);
      onSelectEntity?.(node.id);
    },
    [onSelectEntity]
  );

  const handleCloseNodeModal = useCallback(() => {
    setSelectedNode(null);
  }, []);

  const handleJumpToDeepRoute = useCallback(
    (route: string) => {
      onNavigateToDeepRoute?.(route);
    },
    [onNavigateToDeepRoute]
  );

  return {
    chains,
    activeChain,
    activeChainId,
    setActiveChainId,
    visibleNodes,
    stats,
    searchQuery,
    setSearchQuery,
    selectedNode,
    handleSelectNode,
    handleCloseNodeModal,
    handleJumpToDeepRoute,
  };
}
