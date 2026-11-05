/**
 * RelationshipEntityModals.tsx
 * White Caves Real Estate LLC - Entity CRUD & Inspection Modals
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Primitive)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC } from 'react';
import { X } from 'lucide-react';
import type { EntityNode, EntityType } from './RelationshipManager.types';

export interface EntityFormModalProps {
  isOpen: boolean;
  editingId: string | null;
  formData: {
    name: string;
    type: EntityType;
    badge: string;
    description: string;
    status: string;
  };
  typeOptions: Array<{ id: string; label: string }>;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChangeField: (field: string, value: string) => void;
}

export const EntityFormModal: FC<EntityFormModalProps> = ({
  isOpen,
  editingId,
  formData,
  typeOptions,
  onClose,
  onSubmit,
  onChangeField,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-bold text-white">
            {editingId ? 'Edit Entity Instance' : 'Register New Entity'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-3 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Entity Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => onChangeField('name', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Entity Type</label>
            <select
              value={formData.type}
              onChange={e => onChangeField('type', e.target.value)}
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
              onChange={e => onChangeField('badge', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
            />
          </div>
          <div>
            <label className="text-slate-400 block mb-1">Description</label>
            <textarea
              rows={2}
              value={formData.description}
              onChange={e => onChangeField('description', e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded px-2.5 py-1.5 text-white"
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
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
  );
};

export interface EntityInspectModalProps {
  node: EntityNode | null;
  onClose: () => void;
}

export const EntityInspectModal: FC<EntityInspectModalProps> = ({ node, onClose }) => {
  if (!node) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-md rounded-xl bg-slate-900 border border-slate-800 p-5 shadow-2xl space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <span className="font-mono text-xs font-bold text-sky-400">{node.id}</span>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
        <h3 className="text-base font-bold text-white">{node.name}</h3>
        <p className="text-xs text-slate-300">{node.description}</p>
        <div className="p-3 rounded bg-slate-950 border border-slate-800 text-xs font-mono space-y-1">
          {Object.entries(node.details || {}).map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-slate-400">{k}:</span>
              <span className="text-emerald-400">{String(v)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
