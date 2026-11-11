/**
 * ErmsRelationshipDossier.tsx
 * White Caves Real Estate LLC - 1-Click Exportable Relationship Dossier
 * Pillar 2 (Upgrade 19): Exportable Relationship Dossier (PDF / Markdown / Print View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState } from 'react';
import { FileDown, Printer, ShieldCheck, CheckCircle2, Copy, Check } from 'lucide-react';
import type { ERDRelation, RelationshipChain } from './RelationshipManager.types';

export interface ErmsRelationshipDossierProps {
  chain?: RelationshipChain;
  relation?: ERDRelation;
}

export const ErmsRelationshipDossier: FC<ErmsRelationshipDossierProps> = ({ chain, relation }) => {
  const [copied, setCopied] = useState(false);

  const generateDossierText = () => {
    if (chain) {
      return `WHITE CAVES REAL ESTATE LLC - STATUTORY RELATIONSHIP DOSSIER
=============================================================
Chain ID: ${chain.id} (${chain.dealNumber})
Pipeline Name: ${chain.name}
Gross Deal Volume: AED ${chain.grossRevenueAED.toLocaleString()}
Merit XP Allocation: +${chain.meritXPAwarded} XP
Summary: ${chain.summary}

PARTICIPATING ENTITIES (${chain.nodes.length}):
${chain.nodes.map(n => `- [${n.type}] ${n.name} (${n.badge})`).join('\n')}

RELATIONAL EDGES (${chain.edges.length}):
${chain.edges.map(e => `- ${e.sourceId} --[ ${e.label} ]--> ${e.targetId}`).join('\n')}

GOVERNING UMBRELLA:
White Caves Real Estate LLC | DLD ORN: 28491 | DET: CN-1094821 | FTA TRN: 100458920100003
Activities: Real Estate Buying & Selling (7010.01) | Leasing Property Brokerage (7020.01)
Generated: ${new Date().toISOString()}
=============================================================`;
    }

    if (relation) {
      return `WHITE CAVES REAL ESTATE LLC - RELATIONAL LINK DOSSIER
=============================================================
Relation ID: ${relation.id}
Source Entity: ${relation.from}
Target Entity: ${relation.to}
UML Type: ${relation.type}
Multiplicity: ${relation.multiplicity}
Foreign Key: @${relation.foreignKey}
Action Verb: ${relation.actionVerb || 'N/A'}
Department: ${relation.departmentCode || 'N/A'}

GOVERNING UMBRELLA:
White Caves Real Estate LLC | DLD ORN: 28491 | DET: CN-1094821
Generated: ${new Date().toISOString()}
=============================================================`;
    }

    return 'No active relationship data selected.';
  };

  const dossierText = generateDossierText();

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(dossierText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  return (
    <div
      className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-100 space-y-3"
      data-testid="erms-relationship-dossier"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <FileDown className="w-4 h-4 text-emerald-400" />
          <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Exportable Relationship Dossier (Pillar 2 · Upgrade 19)
          </h4>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy Dossier'}</span>
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 whitespace-pre-wrap max-h-40 overflow-y-auto leading-relaxed">
        {dossierText}
      </div>
    </div>
  );
};
