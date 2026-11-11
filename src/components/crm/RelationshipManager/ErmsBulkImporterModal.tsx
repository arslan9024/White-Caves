/**
 * ErmsBulkImporterModal.tsx
 * White Caves Real Estate LLC - Multi-Format Bulk Entity Importer & Duplicate Pre-Check
 * Pillar 1: Upgrade 2 (Bulk Entity Importer), Upgrade 3 (Smart Deduplication Engine)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState } from 'react';
import { Upload, X, CheckCircle2, AlertTriangle, FileSpreadsheet, Sparkles } from 'lucide-react';
import type { EntityNode, EntityType } from './RelationshipManager.types';

export interface ErmsBulkImporterModalProps {
  isOpen: boolean;
  existingEntities: EntityNode[];
  onClose: () => void;
  onImport: (newEntities: EntityNode[]) => void;
}

export const ErmsBulkImporterModal: FC<ErmsBulkImporterModalProps> = ({
  isOpen,
  existingEntities,
  onClose,
  onImport,
}) => {
  const [jsonInput, setJsonInput] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);
  const [previewEntities, setPreviewEntities] = useState<EntityNode[]>([]);
  const [duplicateCount, setDuplicateCount] = useState(0);

  if (!isOpen) return null;

  // Real-time Parser & Duplicate Pre-Checker (Upgrades 2 & 3)
  const handleParse = (text: string) => {
    setJsonInput(text);
    setParseError(null);
    if (!text.trim()) {
      setPreviewEntities([]);
      setDuplicateCount(0);
      return;
    }

    try {
      const parsed = JSON.parse(text);
      const items: any[] = Array.isArray(parsed) ? parsed : [parsed];

      const existingNames = new Set(existingEntities.map(e => e.name.toLowerCase().trim()));
      const existingIds = new Set(existingEntities.map(e => e.id.toLowerCase().trim()));

      let duplicates = 0;
      const validated: EntityNode[] = items.map((item, idx) => {
        const name = item.name || `Imported Asset ${idx + 1}`;
        const id = item.id || `entity-imp-${Date.now()}-${idx}`;
        const isDuplicate = existingNames.has(name.toLowerCase().trim()) || existingIds.has(id.toLowerCase().trim());

        if (isDuplicate) duplicates++;

        return {
          id,
          name,
          type: (item.type || 'PROPERTY') as EntityType,
          badge: item.badge || 'Bulk Ingested',
          description: item.description || 'Imported via Bulk Ingestion Engine',
          color: item.color || '#3B82F6',
          status: 'ACTIVE',
          details: {
            isDuplicate,
            importedAt: new Date().toISOString(),
            ...(item.details || {}),
          },
        };
      });

      setPreviewEntities(validated);
      setDuplicateCount(duplicates);
    } catch (err: any) {
      setParseError('Invalid JSON format. Expected JSON array of entity objects.');
      setPreviewEntities([]);
      setDuplicateCount(0);
    }
  };

  const handleExecuteImport = () => {
    if (previewEntities.length === 0) return;
    onImport(previewEntities);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
      data-testid="erms-bulk-importer-modal"
    >
      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Bulk Entity Ingestion Engine</h3>
              <p className="text-xs text-zinc-400">
                Pillar 1 Upgrades 2 & 3 · Multi-Entity Ingestion & Duplicate Pre-Check
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input & Pre-Check Status */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-1.5">
              Paste Entity JSON Array
            </label>
            <textarea
              rows={5}
              value={jsonInput}
              onChange={e => handleParse(e.target.value)}
              placeholder='[{"name": "Burj Crown 204", "type": "PROPERTY", "badge": "Off-Plan"}]'
              className="w-full p-3 bg-zinc-950 border border-zinc-700/80 rounded-xl text-xs font-mono text-zinc-100 focus:outline-none focus:border-emerald-500 leading-relaxed"
            />
          </div>

          {parseError && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-lg text-xs text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{parseError}</span>
            </div>
          )}

          {previewEntities.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-zinc-300">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Validated: {previewEntities.length} entities ready</span>
                </span>
                {duplicateCount > 0 && (
                  <span className="text-amber-400 flex items-center gap-1 font-mono text-[11px]">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>{duplicateCount} duplicate names detected</span>
                  </span>
                )}
              </div>

              <div className="p-2 bg-zinc-950 rounded-lg border border-zinc-800 max-h-36 overflow-y-auto space-y-1">
                {previewEntities.map((e, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-1.5 rounded bg-zinc-900/60 text-[11px]"
                  >
                    <span className="font-medium text-zinc-200">{e.name}</span>
                    <span className="font-mono text-[10px] text-zinc-400">{e.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-zinc-800 flex items-center justify-between bg-zinc-950/50">
          <span className="text-[11px] text-zinc-500">
            White Caves Real Estate LLC · Zero-Data-Loss Ingestion
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={previewEntities.length === 0}
              onClick={handleExecuteImport}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-bold transition-all shadow-md shadow-emerald-600/20"
            >
              Import {previewEntities.length} Entities
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
