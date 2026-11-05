/**
 * RelationshipSingleLinkView.tsx
 * White Caves Real Estate LLC - Focused 2-Entity Relational Link View
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Primitive)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol Deterministic Edge Inspector
 */

import React, { FC } from 'react';
import {
  ArrowLeft,
  GitFork,
  Key,
  Database,
  ShieldAlert,
  CheckCircle2,
  ArrowRight,
} from 'lucide-react';
import { CANONICAL_ERD_RELATIONS, CANONICAL_ERD_MODELS } from './RelationshipErd.data';
import { CANONICAL_RELATIONSHIPS } from './RelationshipManager.data';
import type { ERDRelation, RelationshipChain } from './RelationshipManager.types';

export interface RelationshipSingleLinkViewProps {
  relationshipId: string;
  onBack: () => void;
  onNavigateToEntity?: (entityType: string) => void;
}

export const RelationshipSingleLinkView: FC<RelationshipSingleLinkViewProps> = ({
  relationshipId,
  onBack,
  onNavigateToEntity,
}) => {
  // Check if ID matches an ERD relation (e.g. rel-1) or a full Chain (e.g. REL-001)
  const erdRelation: ERDRelation | undefined = CANONICAL_ERD_RELATIONS.find(
    r => r.id.toLowerCase() === relationshipId.toLowerCase()
  );

  const fullChain: RelationshipChain | undefined = CANONICAL_RELATIONSHIPS.find(
    c => c.id.toLowerCase() === relationshipId.toLowerCase()
  );

  const sourceModel = erdRelation
    ? CANONICAL_ERD_MODELS.find(m => m.name.toLowerCase() === erdRelation.from.toLowerCase())
    : undefined;

  const targetModel = erdRelation
    ? CANONICAL_ERD_MODELS.find(m => m.name.toLowerCase() === erdRelation.to.toLowerCase())
    : undefined;

  return (
    <div className="space-y-6" data-testid="relationship-single-link-view">
      {/* ── 1. Top Navigation Bar ────────────────────────────────────────── */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <button
          type="button"
          onClick={onBack}
          data-testid="back-to-matrix-btn"
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700 text-xs font-bold transition-all"
        >
          <ArrowLeft size={14} /> Back to Full Mesh
        </button>

        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-sky-500/20 text-sky-400 border border-sky-500/40">
          EDGE ID: {relationshipId.toUpperCase()}
        </span>
      </div>

      {/* ── 2. Focused 2-Entity Interactive Link Card ───────────────────── */}
      {erdRelation ? (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-6">
          <div className="text-center space-y-1">
            <span className="text-[10px] font-mono uppercase font-bold text-emerald-400">
              Binary Entity Association Contract
            </span>
            <h2 className="text-xl font-bold text-white flex items-center justify-center gap-2">
              <GitFork size={20} className="text-emerald-400" />
              {erdRelation.from} <ArrowRight size={18} className="text-slate-500" />{' '}
              {erdRelation.to}
            </h2>
            <p className="text-xs text-slate-400 max-w-lg mx-auto">
              {erdRelation.label.toUpperCase()} · Multiplicity: {erdRelation.multiplicity} · Foreign
              Key: <code className="text-sky-300">{erdRelation.foreignKey}</code>
            </p>
          </div>

          {/* Flow Visualizer Box */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Entity A */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {sourceModel?.stereotype || '«Entity»'}
                </span>
                <span className="text-[10px] font-bold text-emerald-400">1 (Source)</span>
              </div>
              <h3 className="text-base font-bold text-white">{erdRelation.from}</h3>
              <div className="text-xs text-slate-400 space-y-1 font-mono">
                {sourceModel?.attributes.slice(0, 4).map(attr => (
                  <div key={attr.name} className="flex justify-between">
                    <span className={attr.isPk ? 'text-amber-400 font-bold' : 'text-slate-400'}>
                      {attr.name} {attr.isPk && '🔑'}
                    </span>
                    <span className="text-slate-600">{attr.type}</span>
                  </div>
                ))}
              </div>
              {onNavigateToEntity && (
                <button
                  type="button"
                  onClick={() => onNavigateToEntity(erdRelation.from)}
                  className="w-full text-center py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-xs text-sky-400 font-bold transition-all"
                >
                  Inspect {erdRelation.from}
                </button>
              )}
            </div>

            {/* Central Connector */}
            <div className="flex flex-col items-center justify-center p-3 text-center space-y-2">
              <div className="px-3 py-1 rounded-full text-xs font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                {erdRelation.type}
              </div>
              <div className="w-full h-0.5 bg-gradient-to-r from-emerald-500 via-sky-500 to-emerald-500 rounded my-2" />
              <div className="text-[11px] font-bold text-slate-300">
                FK: <span className="font-mono text-sky-400">{erdRelation.foreignKey}</span>
              </div>
              <div className="text-[10px] text-slate-400">
                Multiplicity:{' '}
                <span className="font-mono text-white">{erdRelation.multiplicity}</span>
              </div>
              {erdRelation.type === 'COMPOSITION' ? (
                <div className="flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                  <ShieldAlert size={12} /> Cascade Delete Enforced
                </div>
              ) : (
                <div className="flex items-center gap-1 text-[11px] font-bold text-slate-400">
                  <CheckCircle2 size={12} className="text-emerald-400" /> Referential Integrity
                </div>
              )}
            </div>

            {/* Entity B */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                  {targetModel?.stereotype || '«Entity»'}
                </span>
                <span className="text-[10px] font-bold text-sky-400">0..* (Target)</span>
              </div>
              <h3 className="text-base font-bold text-white">{erdRelation.to}</h3>
              <div className="text-xs text-slate-400 space-y-1 font-mono">
                {targetModel?.attributes.slice(0, 4).map(attr => (
                  <div key={attr.name} className="flex justify-between">
                    <span className={attr.isFk ? 'text-sky-400 font-bold' : 'text-slate-400'}>
                      {attr.name} {attr.isFk && '⑂'}
                    </span>
                    <span className="text-slate-600">{attr.type}</span>
                  </div>
                ))}
              </div>
              {onNavigateToEntity && (
                <button
                  type="button"
                  onClick={() => onNavigateToEntity(erdRelation.to)}
                  className="w-full text-center py-1.5 rounded bg-slate-900 hover:bg-slate-800 text-xs text-sky-400 font-bold transition-all"
                >
                  Inspect {erdRelation.to}
                </button>
              )}
            </div>
          </div>
        </div>
      ) : fullChain ? (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white">{fullChain.name}</h2>
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-400">
              AED {fullChain.grossRevenueAED.toLocaleString()} Escrow
            </span>
          </div>
          <p className="text-xs text-slate-300">{fullChain.summary}</p>
          <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-xs font-mono text-slate-400">
            Pipeline: {fullChain.dealNumber} · Nodes: {fullChain.nodes.length} · Edges:{' '}
            {fullChain.edges.length} · Merit XP: +{fullChain.meritXPAwarded}
          </div>
        </div>
      ) : (
        <div className="p-8 rounded-xl bg-slate-900/40 border border-slate-800 text-center space-y-2">
          <p className="text-sm text-slate-400">
            Relational Edge {relationshipId} was not found in static registry.
          </p>
          <button onClick={onBack} className="text-xs text-emerald-400 underline font-bold">
            Return to Mesh
          </button>
        </div>
      )}
    </div>
  );
};

export default RelationshipSingleLinkView;
