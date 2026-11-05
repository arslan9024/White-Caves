/**
 * ErmsContext.tsx
 * White Caves Real Estate LLC - Entities & Relationships Management System (ERMS) Context
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Context Layer)
 * Single Purpose File Law: < 350 lines
 */

import React, { createContext, useContext, useState, useMemo, useCallback, ReactNode } from 'react';
import type {
  EntityNode,
  EntityType,
  ERDRelation,
  RelationshipChain,
} from '../components/crm/RelationshipManager/RelationshipManager.types';
import { CANONICAL_ALL_ENTITIES } from '../components/crm/RelationshipManager/RelationshipEntities.data';
import {
  CANONICAL_ERD_RELATIONS,
  CANONICAL_ERD_MODELS,
} from '../components/crm/RelationshipManager/RelationshipErd.data';
import { CANONICAL_RELATIONSHIPS } from '../components/crm/RelationshipManager/RelationshipManager.data';

const STORAGE_KEY = 'whitecaves_all_entities_store';

function loadStoredEntities(): EntityNode[] {
  if (typeof window === 'undefined') return CANONICAL_ALL_ENTITIES;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  return CANONICAL_ALL_ENTITIES;
}

function saveStoredEntities(entities: EntityNode[]) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entities));
  } catch {}
}

export interface ErmsContextType {
  entities: EntityNode[];
  relations: ERDRelation[];
  chains: RelationshipChain[];
  selectedEntityId: string | null;
  selectedRelationshipId: string | null;
  activeEntity: EntityNode | null;
  activeRelation: ERDRelation | null;
  setSelectedEntityId: (id: string | null) => void;
  setSelectedRelationshipId: (id: string | null) => void;
  createEntity: (payload: {
    name: string;
    type: EntityType;
    badge: string;
    description: string;
    status?: string;
  }) => EntityNode;
  updateEntity: (id: string, patch: Partial<EntityNode>) => void;
  deleteEntity: (id: string) => void;
  getRelationsForEntity: (entityType: string) => ERDRelation[];
}

const ErmsContext = createContext<ErmsContextType | undefined>(undefined);

export const ErmsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [entities, setEntities] = useState<EntityNode[]>(loadStoredEntities);
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [selectedRelationshipId, setSelectedRelationshipId] = useState<string | null>(null);

  const relations = useMemo(() => CANONICAL_ERD_RELATIONS, []);
  const chains = useMemo(() => CANONICAL_RELATIONSHIPS, []);

  const activeEntity = useMemo(() => {
    if (!selectedEntityId) return null;
    return entities.find(e => e.id.toLowerCase() === selectedEntityId.toLowerCase()) || null;
  }, [entities, selectedEntityId]);

  const activeRelation = useMemo(() => {
    if (!selectedRelationshipId) return null;
    return relations.find(r => r.id.toLowerCase() === selectedRelationshipId.toLowerCase()) || null;
  }, [relations, selectedRelationshipId]);

  const createEntity = useCallback(
    (payload: {
      name: string;
      type: EntityType;
      badge: string;
      description: string;
      status?: string;
    }) => {
      const newNode: EntityNode = {
        id: `entity-${Date.now()}`,
        name: payload.name,
        type: payload.type,
        badge: payload.badge || 'Registered Entity',
        description: payload.description,
        status: payload.status || 'ACTIVE',
        color: '#3B82F6',
        details: { createdAt: new Date().toISOString() },
      };
      setEntities(prev => {
        const next = [newNode, ...prev];
        saveStoredEntities(next);
        return next;
      });
      return newNode;
    },
    []
  );

  const updateEntity = useCallback((id: string, patch: Partial<EntityNode>) => {
    setEntities(prev => {
      const next = prev.map(e => (e.id === id ? { ...e, ...patch } : e));
      saveStoredEntities(next);
      return next;
    });
  }, []);

  const deleteEntity = useCallback(
    (id: string) => {
      setEntities(prev => {
        const next = prev.filter(e => e.id !== id);
        saveStoredEntities(next);
        return next;
      });
      if (selectedEntityId === id) setSelectedEntityId(null);
    },
    [selectedEntityId]
  );

  const getRelationsForEntity = useCallback(
    (entityType: string) => {
      const q = entityType.toLowerCase();
      return relations.filter(r => r.from.toLowerCase() === q || r.to.toLowerCase() === q);
    },
    [relations]
  );

  const value: ErmsContextType = {
    entities,
    relations,
    chains,
    selectedEntityId,
    selectedRelationshipId,
    activeEntity,
    activeRelation,
    setSelectedEntityId,
    setSelectedRelationshipId,
    createEntity,
    updateEntity,
    deleteEntity,
    getRelationsForEntity,
  };

  return <ErmsContext.Provider value={value}>{children}</ErmsContext.Provider>;
};

export function useERMS(): ErmsContextType {
  const context = useContext(ErmsContext);
  if (!context) {
    throw new Error('useERMS must be used within an ErmsProvider');
  }
  return context;
}
