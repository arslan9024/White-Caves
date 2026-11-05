/**
 * RelationshipEntitiesHub.tsx
 * White Caves Real Estate LLC - Entities Hub View Primitive with Full CRUD Operations
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Primitive)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState, useMemo } from 'react';
import { Plus, Search, Edit2, Trash2, Eye, ShieldCheck, Database, X } from 'lucide-react';
import type { EntityNode, EntityType } from './RelationshipManager.types';
import { CANONICAL_ALL_ENTITIES } from './RelationshipEntities.data';

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

export const RelationshipEntitiesHub: FC = () => {
  const [entities, setEntities] = useState<EntityNode[]>(loadStoredEntities);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<string>('ALL');

  // Modal / Drawer state
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
    if (window.confirm('Are you sure you want to delete this entity instance?')) {
      const next = entities.filter(e => e.id !== id);
      setEntities(next);
      saveStoredEntities(next);
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

      {/* ── Entities Data Table ──────────────────────────────────────────── */}
      <div className="rounded-xl bg-slate-950/80 border border-slate-800 overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 text-[10px] uppercase font-mono">
              <th className="py-2.5 px-4">Entity Key</th>
              <th className="py-2.5 px-4">Entity Name & Scope</th>
              <th className="py-2.5 px-4">Type</th>
              <th className="py-2.5 px-4">Badge / Role</th>
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
                      onClick={() => setActiveViewNode(node)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white"
                      title="Inspect Details"
                    >
                      <Eye size={13} />
                    </button>
                    <button
                      onClick={() => handleOpenEdit(node)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-sky-400"
                      title="Edit Entity"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(node.id)}
                      className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-rose-400"
                      title="Delete Entity"
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
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white">
                {editingId ? 'Edit Entity Instance' : 'Register New Entity'}
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Entity Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Entity Type</label>
                <select
                  value={formData.type}
                  onChange={e => setFormData({ ...formData, type: e.target.value as EntityType })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                >
                  {typeOptions
                    .filter(t => t.id !== 'ALL')
                    .map(t => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Badge / Role Label</label>
                <input
                  type="text"
                  value={formData.badge}
                  onChange={e => setFormData({ ...formData, badge: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={e => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-3 py-1.5 rounded bg-slate-800 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  {editingId ? 'Save Changes' : 'Create Entity'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── View Details Modal ────────────────────────────────────────────── */}
      {activeViewNode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="font-mono text-xs font-bold text-sky-400">{activeViewNode.id}</span>
              <button
                onClick={() => setActiveViewNode(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            </div>
            <h3 className="text-base font-bold text-white">{activeViewNode.name}</h3>
            <p className="text-xs text-slate-300">{activeViewNode.description}</p>
            <div className="p-3 rounded bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
              {Object.entries(activeViewNode.details || {}).map(([k, v]) => (
                <div key={k} className="flex justify-between">
                  <span className="text-slate-400">{k}:</span>
                  <span className="text-emerald-400">{String(v)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelationshipEntitiesHub;
