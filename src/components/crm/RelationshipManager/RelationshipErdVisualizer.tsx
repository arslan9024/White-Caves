/**
 * RelationshipErdVisualizer.tsx
 * White Caves Real Estate LLC - UML ERD Diagram Visualizer
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Primitive)
 * Single Purpose File Law: < 350 lines
 * Protocol: RUP «Entity» / «Control» / «Boundary» Modeling
 */

import React, { FC, useState } from 'react';
import { Database, GitFork, Layers, LayoutGrid, Monitor } from 'lucide-react';
import { CANONICAL_ERD_MODELS, CANONICAL_ERD_RELATIONS } from './RelationshipErd.data';
import type { ERDClassModel } from './RelationshipManager.types';
import { RelationshipErdCanvas } from './RelationshipErdCanvas';
import { RelationshipErdInspector } from './RelationshipErdInspector';

export const RelationshipErdVisualizer: FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');
  const [selectedRelType, setSelectedRelType] = useState<string>('ALL');
  const [viewMode, setViewMode] = useState<'canvas' | 'table'>('canvas');
  const [selectedModel, setSelectedModel] = useState<ERDClassModel | null>(CANONICAL_ERD_MODELS[0]);

  const filteredModels =
    selectedDomain === 'ALL'
      ? CANONICAL_ERD_MODELS
      : CANONICAL_ERD_MODELS.filter(m => m.domain === selectedDomain);

  const filteredRelations =
    selectedRelType === 'ALL'
      ? CANONICAL_ERD_RELATIONS
      : CANONICAL_ERD_RELATIONS.filter(
          r => r.type === selectedRelType || r.multiplicity.includes(selectedRelType)
        );

  return (
    <div className="space-y-6" data-testid="relationship-erd-visualizer">
      {/* Top Header & Filter Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 flex items-center gap-1">
            <Database size={12} /> Rational Unified Process (RUP) · UML Structural Diagram
          </span>
          <h2 className="text-base font-bold text-white mt-0.5">
            Strict Entity-Relationship Diagram (ERD) & Schema Topologies
          </h2>
          <p className="text-xs text-slate-400">
            Interactive canvas with zoom, pan, foreign key edge highlights, and composition cascade
            inspection.
          </p>
        </div>

        {/* View Mode & Cardinality Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center p-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setViewMode('canvas')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold transition-all ${
                viewMode === 'canvas'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              data-testid="erd-view-canvas-btn"
            >
              <Monitor size={13} />
              <span>Canvas (UML)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md font-bold transition-all ${
                viewMode === 'table'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
              data-testid="erd-view-table-btn"
            >
              <LayoutGrid size={13} />
              <span>Matrix Table</span>
            </button>
          </div>
        </div>
      </div>

      {/* Filter Row: Domain & Multiplicity Toggles */}
      <div className="flex items-center justify-between flex-wrap gap-2 px-1">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500 mr-1">
            Domain:
          </span>
          {['ALL', 'LEASING', 'SALES', 'FINANCE', 'STATUTORY', 'GOVERNANCE'].map(dom => (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedDomain(dom)}
              className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                selectedDomain === dom
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[10px] font-mono uppercase font-bold text-slate-500 mr-1">
            UML Type:
          </span>
          {['ALL', 'COMPOSITION', 'AGGREGATION', 'ASSOCIATION'].map(t => (
            <button
              key={t}
              type="button"
              onClick={() => setSelectedRelType(t)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold font-mono transition-all ${
                selectedRelType === t
                  ? 'bg-sky-500/20 text-sky-400 border border-sky-500/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {t === 'COMPOSITION'
                ? '◆— Composition'
                : t === 'AGGREGATION'
                  ? '◇— Aggregation'
                  : t === 'ASSOCIATION'
                    ? '── Association'
                    : 'All Links'}
            </button>
          ))}
        </div>
      </div>

      {/* Main View Area: Interactive Canvas OR Matrix Table */}
      {viewMode === 'canvas' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <RelationshipErdCanvas
              models={filteredModels}
              relations={filteredRelations}
              selectedModel={selectedModel}
              onSelectModel={m => setSelectedModel(m)}
            />
          </div>
          <div>
            <RelationshipErdInspector
              model={selectedModel}
              relations={CANONICAL_ERD_RELATIONS}
              onClose={() => setSelectedModel(null)}
              onSelectRelatedModel={name => {
                const target = CANONICAL_ERD_MODELS.find(m => m.name === name);
                if (target) setSelectedModel(target);
              }}
            />
          </div>
        </div>
      ) : (
        /* Matrix Table View */
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-3">
          <div className="flex items-center gap-2">
            <GitFork size={15} className="text-sky-400" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              UML Multiplicity & Composition Cascade Registry
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[10px] uppercase">
                  <th className="py-2 px-3">From Entity</th>
                  <th className="py-2 px-3">To Entity</th>
                  <th className="py-2 px-3">Relationship Type</th>
                  <th className="py-2 px-3">Multiplicity</th>
                  <th className="py-2 px-3">Foreign Key Binding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {filteredRelations.map(rel => (
                  <tr key={rel.id} className="hover:bg-slate-800/30">
                    <td className="py-2 px-3 font-bold text-white">{rel.from}</td>
                    <td className="py-2 px-3 font-bold text-sky-400">{rel.to}</td>
                    <td className="py-2 px-3">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          rel.type === 'COMPOSITION'
                            ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                            : rel.type === 'AGGREGATION'
                              ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                              : 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                        }`}
                      >
                        {rel.type === 'COMPOSITION'
                          ? '◆— Composition (Cascade)'
                          : rel.type === 'AGGREGATION'
                            ? '◇— Aggregation'
                            : '── Association'}
                      </span>
                    </td>
                    <td className="py-2 px-3 text-emerald-400 font-bold">{rel.multiplicity}</td>
                    <td className="py-2 px-3 text-slate-400">@{rel.foreignKey}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default RelationshipErdVisualizer;
