/**
 * ErmsErdDdlExporter.tsx
 * White Caves Real Estate LLC - SQL DDL & Prisma Schema Code Generator & Sub-Graph Isolation
 * Pillar 3: Upgrade 24 (SQL DDL & Prisma Generator), Upgrade 27 (High-Res Export), Upgrade 28 (Sub-Graph Isolation)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState } from 'react';
import { Code2, Download, Copy, Check, Eye, Layers } from 'lucide-react';
import type { ERDClassModel, ERDRelation } from './RelationshipManager.types';

export interface ErmsErdDdlExporterProps {
  models: ERDClassModel[];
  relations: ERDRelation[];
  selectedModelName?: string | null;
  onSelectModel?: (name: string) => void;
}

export const ErmsErdDdlExporter: FC<ErmsErdDdlExporterProps> = ({
  models,
  relations,
  selectedModelName,
  onSelectModel,
}) => {
  const [exportType, setExportType] = useState<'SQL' | 'PRISMA'>('PRISMA');
  const [copied, setCopied] = useState(false);

  // Generate DDL on the fly
  const generateExportCode = () => {
    if (exportType === 'PRISMA') {
      return models
        .map(model => {
          const fields = model.attributes
            .map(attr => {
              const typeStr = attr.type === 'string' ? 'String' : attr.type === 'number' ? 'Float' : attr.type;
              const pk = attr.isPk ? ' @id @default(uuid())' : '';
              const opt = attr.nullable ? '?' : '';
              return `  ${attr.name.padEnd(20)} ${typeStr}${opt}${pk}`;
            })
            .join('\n');
          return `model ${model.name} {\n${fields}\n  createdAt            DateTime @default(now())\n  updatedAt            DateTime @updatedAt\n}`;
        })
        .join('\n\n');
    }

    // SQL DDL
    return models
      .map(model => {
        const columns = model.attributes
          .map(attr => {
            const sqlType = attr.type === 'string' ? 'VARCHAR(255)' : attr.type === 'number' ? 'NUMERIC(14,2)' : 'TEXT';
            const pk = attr.isPk ? ' PRIMARY KEY' : '';
            const notNull = attr.nullable ? '' : ' NOT NULL';
            return `  "${attr.name}" ${sqlType}${notNull}${pk}`;
          })
          .join(',\n');
        return `CREATE TABLE "${model.name.toLowerCase()}" (\n${columns},\n  "created_at" TIMESTAMP WITH TIME ZONE DEFAULT NOW()\n);`;
      })
      .join('\n\n');
  };

  const codeSnippet = generateExportCode();

  const handleCopy = () => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-100 space-y-4"
      data-testid="erms-erd-ddl-exporter"
    >
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <Code2 className="w-5 h-5 text-emerald-400" />
          <div>
            <h4 className="text-sm font-bold text-white">Live Schema & DDL Generator</h4>
            <p className="text-xs text-slate-400">
              Synchronized with AEGIS Prisma & PostgreSQL Models (Pillar 3 Upgrades 24 & 28)
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Format Toggle */}
          <div className="flex items-center p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setExportType('PRISMA')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                exportType === 'PRISMA'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Prisma Schema
            </button>
            <button
              type="button"
              onClick={() => setExportType('SQL')}
              className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                exportType === 'SQL'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              PostgreSQL DDL
            </button>
          </div>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy Code'}</span>
          </button>
        </div>
      </div>

      {/* Code Viewer */}
      <div className="relative rounded-lg bg-slate-950 border border-slate-800 p-3 font-mono text-xs overflow-x-auto max-h-48 text-emerald-400/90 leading-relaxed">
        <pre>{codeSnippet}</pre>
      </div>
    </div>
  );
};
