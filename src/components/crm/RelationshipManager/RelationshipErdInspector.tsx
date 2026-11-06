/**
 * RelationshipErdInspector.tsx
 * White Caves Real Estate LLC - UML ERD Entity Detail Inspector
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 * Protocol: RUP «Entity» / «Boundary» / «Control» Inspector
 */

import React, { FC } from 'react';
import { X, Key, GitFork, ShieldCheck, Database, Layers } from 'lucide-react';
import type { ERDClassModel, ERDRelation } from './RelationshipManager.types';

interface RelationshipErdInspectorProps {
  model: ERDClassModel | null;
  relations: ERDRelation[];
  onClose: () => void;
  onSelectRelatedModel?: (modelName: string) => void;
}

export const RelationshipErdInspector: FC<RelationshipErdInspectorProps> = ({
  model,
  relations,
  onClose,
  onSelectRelatedModel,
}) => {
  if (!model) return null;

  const connectedRelations = relations.filter(r => r.from === model.name || r.to === model.name);

  return (
    <div
      className="p-4 rounded-xl bg-slate-950/95 border border-slate-800 shadow-2xl space-y-4 text-xs font-sans"
      data-testid="erd-entity-inspector"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Database size={15} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono text-amber-400 font-bold uppercase">
                {model.stereotype}
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-slate-800 text-slate-300">
                {model.domain}
              </span>
            </div>
            <h3 className="text-base font-bold text-white font-mono mt-0.5">{model.name}</h3>
          </div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          data-testid="erd-inspector-close-btn"
        >
          <X size={16} />
        </button>
      </div>

      {/* Description */}
      {model.description && (
        <p className="text-slate-300 text-[11px] leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-800/60">
          {model.description}
        </p>
      )}

      {/* UML Attributes Table */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <Key size={11} className="text-amber-400" /> Persistent Attributes & Foreign Keys
        </span>
        <div className="max-h-48 overflow-y-auto divide-y divide-slate-800/80 rounded-lg bg-slate-900/40 border border-slate-800 font-mono text-[11px]">
          {model.attributes.map(attr => (
            <div key={attr.name} className="py-2 px-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                {attr.isPk ? (
                  <span title="Primary Key">
                    <Key size={12} className="text-amber-400" />
                  </span>
                ) : attr.isFk ? (
                  <span title="Foreign Key">
                    <GitFork size={12} className="text-sky-400" />
                  </span>
                ) : (
                  <span className="w-3 text-slate-600">·</span>
                )}
                <span
                  className={
                    attr.isPk
                      ? 'text-amber-300 font-bold'
                      : attr.isFk
                        ? 'text-sky-300 font-semibold'
                        : 'text-slate-200'
                  }
                >
                  {attr.name}
                  {attr.nullable && <span className="text-slate-500 ml-0.5">?</span>}
                </span>
              </div>
              <span className="text-[10px] text-slate-400">{attr.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Connected UML Relationships */}
      <div className="space-y-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
          <GitFork size={11} className="text-sky-400" /> Connected UML Associations (
          {connectedRelations.length})
        </span>
        <div className="space-y-1.5">
          {connectedRelations.map(rel => {
            const isSource = rel.from === model.name;
            const otherEntity = isSource ? rel.to : rel.from;
            return (
              <div
                key={rel.id}
                className="p-2 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-2"
              >
                <div>
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <span className="text-slate-400">
                      {isSource ? 'Outbound ──>' : '<── Inbound'}
                    </span>
                    <button
                      type="button"
                      onClick={() => onSelectRelatedModel?.(otherEntity)}
                      className="text-emerald-400 hover:underline font-bold"
                    >
                      {otherEntity}
                    </button>
                    <span className="text-[10px] text-slate-500">(@{rel.foreignKey})</span>
                  </div>
                  <span className="text-[10px] text-slate-400 block">{rel.label}</span>
                </div>
                <div className="text-right">
                  <span
                    className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                      rel.type === 'COMPOSITION'
                        ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40'
                        : rel.type === 'AGGREGATION'
                          ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40'
                          : 'bg-blue-950/60 text-blue-300 border border-blue-800/40'
                    }`}
                  >
                    {rel.type === 'COMPOSITION' ? '◆— Composition' : rel.multiplicity}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Prisma Schema Mapping Preview */}
      <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 font-mono text-[10px]">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span>Prisma Schema Contract:</span>
          <span className="text-emerald-400">schema.prisma</span>
        </div>
        <pre className="text-slate-300 overflow-x-auto p-1 bg-slate-950 rounded">
          {`model ${model.name} {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  // ... ${model.attributes.length} persistent attributes
  // Multiplicity: ${connectedRelations.map(r => r.multiplicity).join(', ') || '1 to 0..*'}
}`}
        </pre>
      </div>
    </div>
  );
};

export default RelationshipErdInspector;
