/**
 * RelationshipEntitiesHub.tsx
 * White Caves Real Estate LLC - Entities Hub View Primitive with Full CRUD Operations
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Primitive)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState, useMemo, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, Eye } from 'lucide-react';
import type { EntityNode, EntityType } from './RelationshipManager.types';
import { CANONICAL_ALL_ENTITIES } from './RelationshipEntities.data';
import { EntityFormModal, EntityInspectModal } from './RelationshipEntityModals';

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

export interface RelationshipEntitiesHubProps {
  selectedEntityId?: string | null;
  onSelectEntity?: (id: string) => void;
}

export const RelationshipEntitiesHub: FC<RelationshipEntitiesHubProps> = ({
  selectedEntityId,
  onSelectEntity,
}) => {
  const [entities, setEntities] = useState<EntityNode[]>(loadStoredEntities);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Modal state
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [activeViewNode, setActiveViewNode] = useState<EntityNode | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    type: 'PROPERTY' as EntityType,
    badge: '',
    description: '',
    status: 'ACTIVE',
  });

  useEffect(() => {
    if (selectedEntityId) {
      const match = entities.find(e => e.id.toLowerCase() === selectedEntityId.toLowerCase());
      if (match) {
        setActiveViewNode(match);
      }
    }
  }, [selectedEntityId, entities]);

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({
      name: '',
      type: 'PROPERTY',
      badge: 'Active Item',
      description: '',
      status: 'ACTIVE',
    });
    setIsFormOpen(true);
  };

  const handleOpenEdit = (node: EntityNode) => {
    setEditingId(node.id);
    setFormData({
      name: node.name,
      type: node.type,
      badge: node.badge,
      description: node.description,
      status: node.status || 'ACTIVE',
    });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (typeof window !== 'undefined' && !window.confirm(`Delete entity ${id}?`)) return;
    const next = entities.filter(e => e.id !== id);
    setEntities(next);
    saveStoredEntities(next);
    if (activeViewNode?.id === id) {
      setActiveViewNode(null);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingId) {
      const next = entities.map(item =>
        item.id === editingId
          ? {
              ...item,
              name: formData.name,
              type: formData.type,
              badge: formData.badge,
              description: formData.description,
              status: formData.status,
            }
          : item
      );
      setEntities(next);
      saveStoredEntities(next);
    } else {
      const newNode: EntityNode = {
        id: `entity-${Date.now()}`,
        name: formData.name,
        type: formData.type,
        badge: formData.badge || 'Registered Entity',
        description: formData.description,
        status: formData.status,
        color: '#3B82F6',
        details: { createdAt: new Date().toISOString() },
      };
      const next = [newNode, ...entities];
      setEntities(next);
      saveStoredEntities(next);
    }
    setIsFormOpen(false);
  };

  const filteredEntities = useMemo(() => {
    return entities.filter(e => {
      const matchesType = selectedType === 'ALL' || e.type === selectedType;
      const matchesSearch =
        e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [entities, selectedType, searchQuery]);

  const typeOptions: Array<{ id: string; label: string }> = [
    { id: 'ALL', label: 'All Entities' },
    { id: 'USER', label: 'Users' },
    { id: 'LANDLORD', label: 'Landlords' },
    { id: 'TENANT', label: 'Tenants' },
    { id: 'PROPERTY', label: 'Properties' },
    { id: 'CONTRACT', label: 'Contracts' },
    { id: 'DEAL', label: 'Deals' },
    { id: 'TASK', label: 'Tasks' },
    { id: 'DOCUMENT', label: 'Documents' },
    { id: 'INVOICE', label: 'Invoices' },
    { id: 'CHEQUE', label: 'Cheques' },
  ];

  return (
    <div className="space-y-4" data-testid="relationship-entities-hub">
      {/* ── Top Action & Filter Bar ──────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div className="flex items-center gap-3 flex-1 min-w-[280px]">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search all entities by ID, name, or metadata..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>
          <button
            onClick={handleOpenCreate}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all whitespace-nowrap"
            data-testid="create-entity-btn"
          >
            <Plus size={14} /> Add Entity
          </button>
        </div>

        {/* Entity Type Filter Pills */}
        <div className="flex items-center gap-1 flex-wrap">
          {typeOptions.map(t => (
            <button
              key={t.id}
              onClick={() => setSelectedType(t.id)}
              className={`px-2 py-1 rounded text-[11px] font-bold transition-all ${
                selectedType === t.id
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table Container ──────────────────────────────────────────────── */}
      <div className="rounded-xl border border-slate-800 bg-slate-950/70 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400 uppercase tracking-wider font-mono text-[10px]">
            <tr>
              <th className="py-2.5 px-4">Entity ID</th>
              <th className="py-2.5 px-4">Name / Label</th>
              <th className="py-2.5 px-4">Type</th>
              <th className="py-2.5 px-4">Role Badge</th>
              <th className="py-2.5 px-4">Status</th>
              <th className="py-2.5 px-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredEntities.map(node => (
              <tr key={node.id} className="hover:bg-slate-900/50 transition-colors">
                <td className="py-3 px-4 font-mono font-bold text-sky-400">{node.id}</td>
                <td className="py-3 px-4">
                  <div className="font-bold text-white">{node.name}</div>
                  <div className="text-[11px] text-slate-400 truncate max-w-[280px]">
                    {node.description}
                  </div>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 text-slate-300">
                    {node.type}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-950/40 text-emerald-300 border border-emerald-800/40">
                    {node.badge}
                  </span>
                </td>
                <td className="py-3 px-4 font-mono text-[11px] text-emerald-400">
                  {node.status || 'ACTIVE'}
                </td>
                <td className="py-3 px-4 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    <button
                      onClick={() => {
                        setActiveViewNode(node);
                        onSelectEntity?.(node.id);
                      }}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                      title="Inspect Details"
                      data-testid={`inspect-entity-${node.id}`}
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(node)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-sky-400"
                      title="Edit Entity"
                      data-testid={`edit-entity-${node.id}`}
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(node.id)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                      title="Delete Entity"
                      data-testid={`delete-entity-${node.id}`}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Create / Edit Entity Modal ────────────────────────────────────── */}
      <EntityFormModal
        isOpen={isFormOpen}
        editingId={editingId}
        formData={formData}
        typeOptions={typeOptions}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
        onChangeField={(field, val) => setFormData(prev => ({ ...prev, [field]: val }))}
      />

      {/* ── View Details Modal ────────────────────────────────────────────── */}
      <EntityInspectModal node={activeViewNode} onClose={() => setActiveViewNode(null)} />
    </div>
  );
};

export default RelationshipEntitiesHub;
