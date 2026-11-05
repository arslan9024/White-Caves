/**
 * RelationshipErdVisualizer.tsx
 * White Caves Real Estate LLC - UML ERD Diagram Visualizer
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Primitive)
 * Single Purpose File Law: < 350 lines
 * Protocol: RUP «Entity» / «Control» / «Boundary» Modeling
 */

import React, { FC, useState } from 'react';
import { Database, GitFork, Shield, Layers, Key } from 'lucide-react';
import { CANONICAL_ERD_MODELS, CANONICAL_ERD_RELATIONS } from './RelationshipErd.data';

export const RelationshipErdVisualizer: FC = () => {
  const [selectedDomain, setSelectedDomain] = useState<string>('ALL');

  const filteredModels =
    selectedDomain === 'ALL'
      ? CANONICAL_ERD_MODELS
      : CANONICAL_ERD_MODELS.filter(m => m.domain === selectedDomain);

  return (
    <div className="space-y-6" data-testid="relationship-erd-visualizer">
      {/* Top Controls & Domain Filter */}
      <div className="flex items-center justify-between flex-wrap gap-3 p-4 rounded-xl bg-slate-900/60 border border-slate-800">
        <div>
          <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 flex items-center gap-1">
            <Database size={12} /> Rational Unified Process (RUP) · UML Structural Diagram
          </span>
          <h2 className="text-base font-bold text-white mt-0.5">
            Strict Entity-Relationship Diagram (ERD) & Schema Topologies
          </h2>
          <p className="text-xs text-slate-400">
            Multiplicities (1 to 0..*), Composition links (◆— cascade delete), and Foreign Key
            dependencies.
          </p>
        </div>

        {/* Domain Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {['ALL', 'LEASING', 'SALES', 'FINANCE', 'STATUTORY', 'GOVERNANCE'].map(dom => (
            <button
              key={dom}
              type="button"
              onClick={() => setSelectedDomain(dom)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedDomain === dom
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-white'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* UML Classes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredModels.map(model => (
          <div
            key={model.name}
            className="rounded-xl bg-slate-950/80 border border-slate-800 overflow-hidden shadow-lg hover:border-slate-700 transition-all"
            data-testid={`erd-class-${model.name}`}
          >
            {/* Class Header */}
            <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-amber-400 font-semibold block">
                  {model.stereotype}
                </span>
                <span className="text-sm font-bold text-white font-mono">{model.name}</span>
              </div>
              <span className="px-2 py-0.5 rounded text-[9px] font-mono font-bold bg-slate-800 text-slate-300 border border-slate-700">
                {model.domain}
              </span>
            </div>

            {/* Class Attributes List */}
            <div className="p-3 divide-y divide-slate-800/60 font-mono text-xs">
              {model.attributes.map(attr => (
                <div key={attr.name} className="py-1.5 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    {attr.isPk ? (
                      <span title="Primary Key">
                        <Key size={11} className="text-amber-400" />
                      </span>
                    ) : attr.isFk ? (
                      <span title="Foreign Key">
                        <GitFork size={11} className="text-sky-400" />
                      </span>
                    ) : (
                      <span className="w-2.5 text-slate-600">·</span>
                    )}
                    <span
                      className={`${
                        attr.isPk
                          ? 'text-amber-300 font-bold'
                          : attr.isFk
                            ? 'text-sky-300'
                            : 'text-slate-200'
                      }`}
                    >
                      {attr.name}
                    </span>
                    {attr.nullable && <span className="text-[9px] text-slate-500">?</span>}
                  </div>
                  <span className="text-[11px] text-slate-400">{attr.type}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Relational Multiplicities & Composition Table */}
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
              {CANONICAL_ERD_RELATIONS.map(rel => (
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
    </div>
  );
};

export default RelationshipErdVisualizer;
