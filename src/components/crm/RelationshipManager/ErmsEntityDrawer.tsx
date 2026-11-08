/**
 * ErmsEntityDrawer.tsx
 * White Caves Real Estate LLC - Quick-Create Entity Drawer & DLD/RERA Compliance Validation
 * Pillar 1 (Upgrades 1 & 8) & Pillar 4 (Upgrades 31 & 32)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState } from 'react';
import { X, ShieldCheck, AlertCircle, Sparkles, Building, User, FileText, CheckCircle2 } from 'lucide-react';
import type { EntityNode, EntityType } from './RelationshipManager.types';

export interface ErmsEntityDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entity: EntityNode) => void;
}

export const ErmsEntityDrawer: FC<ErmsEntityDrawerProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [type, setType] = useState<EntityType>('PROPERTY');
  const [badge, setBadge] = useState('Active Asset');
  const [description, setDescription] = useState('');
  const [emiratesId, setEmiratesId] = useState('');
  const [trakheesiPermit, setTrakheesiPermit] = useState('');
  const [ejariContractNumber, setEjariContractNumber] = useState('');
  const [taxId, setTaxId] = useState('');

  if (!isOpen) return null;

  // Real-time compliance validators
  const isValidEmiratesId = !emiratesId || /^784-\d{4}-\d{7}-\d{1}$/.test(emiratesId);
  const isValidTrakheesi = !trakheesiPermit || /^TRK-\d{4,8}$/.test(trakheesiPermit.toUpperCase());
  const isValidEjari = !ejariContractNumber || /^EJR-\d{6,10}$/.test(ejariContractNumber.toUpperCase());

  // Entity completeness calculation (Upgrade 8)
  const calculateCompleteness = () => {
    let score = 20; // baseline for opening drawer
    if (name.trim()) score += 25;
    if (description.trim()) score += 15;
    if (emiratesId && isValidEmiratesId) score += 15;
    if (trakheesiPermit && isValidTrakheesi) score += 15;
    if (ejariContractNumber && isValidEjari) score += 10;
    return Math.min(score, 100);
  };

  const completeness = calculateCompleteness();

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newId = `${type.toLowerCase()}-${Date.now().toString().slice(-4)}`;
    const newEntity: EntityNode = {
      id: newId,
      name,
      type,
      badge: badge || 'Active Entity',
      description: description || 'Created via Quick-Create Drawer',
      color: type === 'PROPERTY' ? '#3B82F6' : type === 'USER' ? '#EF4444' : '#10B981',
      status: 'ACTIVE',
      details: {
        ...(emiratesId ? { emiratesId } : {}),
        ...(trakheesiPermit ? { trakheesiPermit } : {}),
        ...(ejariContractNumber ? { ejariContractNumber } : {}),
        ...(taxId ? { taxId } : {}),
        completenessScore: `${completeness}%`,
        createdAt: new Date().toISOString(),
      },
    };

    onSave(newEntity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-[#18181B] border-l border-zinc-800 text-zinc-100 flex flex-col h-full shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/60">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-red-500" />
            <div>
              <h2 className="text-base font-semibold text-zinc-100">Quick-Create Entity</h2>
              <p className="text-xs text-zinc-400">ERMS Sovereign Ingestion & DLD Validator</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Health & Completeness Metric (Upgrade 8) */}
        <div className="px-4 py-3 bg-zinc-900/40 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-medium text-zinc-300">Entity Health & Integrity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 bg-zinc-800 h-2 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${
                  completeness > 70 ? 'bg-emerald-500' : completeness > 40 ? 'bg-amber-500' : 'bg-red-500'
                }`}
                style={{ width: `${completeness}%` }}
              />
            </div>
            <span className="text-xs font-bold text-zinc-200">{completeness}%</span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              Entity Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Burj Crown 1402 / VIP Tenant"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                Entity Type
              </label>
              <select
                value={type}
                onChange={e => setType(e.target.value as EntityType)}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-red-500"
              >
                <option value="PROPERTY">PROPERTY</option>
                <option value="LANDLORD">LANDLORD</option>
                <option value="TENANT">TENANT</option>
                <option value="CLIENT">CLIENT</option>
                <option value="CONTRACT">CONTRACT</option>
                <option value="USER">USER</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                Badge / Role
              </label>
              <input
                type="text"
                value={badge}
                onChange={e => setBadge(e.target.value)}
                placeholder="e.g. Freehold Asset"
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Operational details and asset narrative..."
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-sm text-zinc-100 focus:outline-none focus:border-red-500"
            />
          </div>

          {/* UAE Statutory Compliance Fields */}
          <div className="pt-2 border-t border-zinc-800 space-y-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-red-500" />
              <span>UAE DLD & Statutory Identifiers</span>
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Emirates ID (Format: 784-YYYY-XXXXXXX-Z)
              </label>
              <input
                type="text"
                value={emiratesId}
                onChange={e => setEmiratesId(e.target.value)}
                placeholder="784-1990-1234567-1"
                className={`w-full px-3 py-2 bg-zinc-900 border rounded-lg text-sm text-zinc-100 focus:outline-none ${
                  isValidEmiratesId ? 'border-zinc-700 focus:border-emerald-500' : 'border-red-500'
                }`}
              />
              {!isValidEmiratesId && (
                <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Standard UAE EID format required
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Trakheesi Permit (Format: TRK-XXXXX)
              </label>
              <input
                type="text"
                value={trakheesiPermit}
                onChange={e => setTrakheesiPermit(e.target.value)}
                placeholder="TRK-98214"
                className={`w-full px-3 py-2 bg-zinc-900 border rounded-lg text-sm text-zinc-100 focus:outline-none ${
                  isValidTrakheesi ? 'border-zinc-700 focus:border-emerald-500' : 'border-red-500'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs text-zinc-400 mb-1">
                Ejari Contract Number (Format: EJR-XXXXXXX)
              </label>
              <input
                type="text"
                value={ejariContractNumber}
                onChange={e => setEjariContractNumber(e.target.value)}
                placeholder="EJR-892104"
                className={`w-full px-3 py-2 bg-zinc-900 border rounded-lg text-sm text-zinc-100 focus:outline-none ${
                  isValidEjari ? 'border-zinc-700 focus:border-emerald-500' : 'border-red-500'
                }`}
              />
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={!name.trim() || !isValidEmiratesId || !isValidTrakheesi || !isValidEjari}
              className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium rounded-lg text-sm transition-colors shadow-lg shadow-red-600/20"
            >
              Commit Entity to ERMS
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

