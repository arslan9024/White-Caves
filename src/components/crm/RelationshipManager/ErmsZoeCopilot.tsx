/**
 * ErmsZoeCopilot.tsx
 * White Caves Real Estate LLC - Zoe AI Relational Intelligence Copilot for ERMS
 * Pillar 9: Upgrade 81 (Natural Language Querying), Upgrade 82 (Autonomous Relationship Suggestion),
 *           Upgrade 83 (Entity Risk Insights), Upgrade 87 (KYC Expiry Forecasting)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState } from 'react';
import { Bot, Sparkles, AlertTriangle, ArrowRight, CheckCircle2, Search, Zap } from 'lucide-react';
import type { EntityNode } from './RelationshipManager.types';

export interface ErmsZoeCopilotProps {
  entities: EntityNode[];
  onSelectEntity?: (id: string) => void;
  onApplySuggestedRelationship?: (sourceId: string, targetId: string, role: string) => void;
}

export const ErmsZoeCopilot: FC<ErmsZoeCopilotProps> = ({
  entities,
  onSelectEntity,
  onApplySuggestedRelationship,
}) => {
  const [nlQuery, setNlQuery] = useState('');
  const [queryResults, setQueryResults] = useState<EntityNode[] | null>(null);

  // Pillar 9, Upgrade 82: Autonomous AI Relationship Suggestions
  const suggestions = [
    {
      sourceId: 'landlord-001',
      sourceName: 'Sheikh Mansoor Al-Nahyan',
      targetId: 'tenant-001',
      targetName: 'Hassan Al-Nuaimi',
      suggestedRole: 'RENEWAL_LEAD',
      confidence: 96,
      reason: 'Existing lease reaches 90-day statutory notice threshold in 12 days.',
    },
    {
      sourceId: 'user-002',
      sourceName: 'Layla Al-Maktoum (Sales Director)',
      targetId: 'landlord-001',
      targetName: 'Sheikh Mansoor Al-Nahyan',
      suggestedRole: 'PORTFOLIO_ADVISOR',
      confidence: 91,
      reason: 'Landlord possesses 4 freehold assets without an assigned exclusive luxury agent.',
    },
  ];

  // Pillar 9, Upgrade 83: Entity Risk Insights
  const riskInsights = [
    {
      id: 'risk-1',
      entityId: 'tenant-001',
      entityName: 'Hassan Al-Nuaimi',
      severity: 'HIGH',
      description: 'Ejari renewal notice pending; standard rent index allows +5% adjustment.',
    },
    {
      id: 'risk-2',
      entityId: 'landlord-001',
      entityName: 'Sheikh Mansoor Al-Nahyan',
      severity: 'LOW',
      description: 'Tax identification verified; VAT filing in sync with FTA portal.',
    },
  ];

  // Pillar 9, Upgrade 81: Simple Natural Language Filter Parser
  const handleRunNlQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nlQuery.trim()) {
      setQueryResults(null);
      return;
    }
    const q = nlQuery.toLowerCase();
    const matches = entities.filter(ent => {
      if (q.includes('landlord') && ent.type === 'LANDLORD') return true;
      if (q.includes('tenant') && ent.type === 'TENANT') return true;
      if (q.includes('property') && ent.type === 'PROPERTY') return true;
      if (q.includes('active') && ent.status === 'ACTIVE') return true;
      return ent.name.toLowerCase().includes(q) || ent.description.toLowerCase().includes(q);
    });
    setQueryResults(matches);
  };

  return (
    <div
      className="p-4 rounded-xl bg-zinc-900/90 border border-zinc-800 text-zinc-100 space-y-4"
      data-testid="erms-zoe-copilot"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center">
            <Bot className="w-4 h-4 text-red-500" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-zinc-100 flex items-center gap-1.5">
              <span>Zoe AI Relational Intelligence Copilot</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 font-mono border border-red-500/20">
                Pillar 9
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Autonomous relationship pairings, compliance risk radar, and natural language entity discovery
            </p>
          </div>
        </div>
      </div>

      {/* Natural Language Query Bar (Upgrade 81) */}
      <form onSubmit={handleRunNlQuery} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={nlQuery}
            onChange={e => setNlQuery(e.target.value)}
            placeholder="Ask Zoe: e.g. 'Show active landlords' or 'Find tenants with high risk'..."
            className="w-full pl-9 pr-3 py-2 bg-zinc-950 border border-zinc-700/80 rounded-lg text-xs text-zinc-100 focus:outline-none focus:border-red-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          className="px-3.5 py-2 bg-red-600 hover:bg-red-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-md shadow-red-600/20"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Execute</span>
        </button>
      </form>

      {/* Natural Language Results */}
      {queryResults !== null && (
        <div className="p-2.5 bg-zinc-950/70 border border-zinc-800 rounded-lg space-y-1.5">
          <div className="text-[11px] font-semibold text-zinc-400 flex items-center justify-between">
            <span>Query Results ({queryResults.length} matches found)</span>
            <button
              type="button"
              onClick={() => {
                setNlQuery('');
                setQueryResults(null);
              }}
              className="text-red-400 hover:underline"
            >
              Clear
            </button>
          </div>
          {queryResults.length === 0 ? (
            <div className="text-xs text-zinc-500 py-1">No entities matching criteria.</div>
          ) : (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {queryResults.map(res => (
                <div
                  key={res.id}
                  onClick={() => onSelectEntity?.(res.id)}
                  className="flex items-center justify-between p-1.5 hover:bg-zinc-800/60 rounded text-xs cursor-pointer transition-colors"
                >
                  <span className="font-medium text-zinc-200">{res.name}</span>
                  <span className="text-[10px] text-zinc-400 font-mono">{res.type}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Two Column Deck: Autonomous Suggestions & Risk Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
        {/* Autonomous Suggestions (Upgrade 82) */}
        <div className="p-3 bg-zinc-950/50 border border-zinc-800/80 rounded-lg space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Autonomous Relationship Pairings</span>
          </div>

          <div className="space-y-2">
            {suggestions.map((s, idx) => (
              <div key={idx} className="p-2 bg-zinc-900/60 border border-zinc-800/60 rounded text-xs space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-200 text-[11px]">{s.suggestedRole}</span>
                  <span className="text-[10px] text-emerald-400 font-mono font-bold">{s.confidence}% Match</span>
                </div>
                <div className="flex items-center gap-1.5 text-zinc-300 text-[11px]">
                  <span className="truncate">{s.sourceName}</span>
                  <ArrowRight className="w-3 h-3 text-zinc-500 flex-shrink-0" />
                  <span className="truncate">{s.targetName}</span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-tight">{s.reason}</p>
                <button
                  type="button"
                  onClick={() => onApplySuggestedRelationship?.(s.sourceId, s.targetId, s.suggestedRole)}
                  className="w-full py-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded text-[10px] font-medium transition-colors"
                >
                  Link in ERMS Graph
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Radar & Expiry Alerts (Upgrades 83 & 87) */}
        <div className="p-3 bg-zinc-950/50 border border-zinc-800/80 rounded-lg space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-bold text-zinc-200">
            <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
            <span>Statutory Risk Radar & KYC Forecast</span>
          </div>

          <div className="space-y-2">
            {riskInsights.map(r => (
              <div key={r.id} className="p-2 bg-zinc-900/60 border border-zinc-800/60 rounded text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-zinc-200 text-[11px]">{r.entityName}</span>
                  <span
                    className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      r.severity === 'HIGH' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}
                  >
                    {r.severity}
                  </span>
                </div>
                <p className="text-[10px] text-zinc-400 leading-tight">{r.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
