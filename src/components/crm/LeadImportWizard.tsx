/**
 * LeadImportWizard — W18.1-P1-001
 * Multi-step wizard for bulk CSV/XLSX lead import with field mapping and dedup reporting.
 */
import React, { useState, useCallback, useRef } from 'react';
import { authFetch } from '../../utils/authFetch';

// ── Types ─────────────────────────────────────────────────────────────────
interface ImportResult {
  imported: number;
  duplicates: number;
  errors: { row: number; field: string; message: string }[];
  total: number;
}

type Step = 'upload' | 'confirm' | 'result';

interface Props {
  onComplete?: (result: ImportResult) => void;
  onClose?: () => void;
}

// ── Component ─────────────────────────────────────────────────────────────
const LeadImportWizard: React.FC<Props> = ({ onComplete, onClose }) => {
  const [step, setStep] = useState<Step>('upload');
  const [file, setFile] = useState<File | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File selection ───────────────────────────────────────────────────────
  const acceptFile = useCallback((f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (ext !== 'csv' && ext !== 'xlsx') {
      setError('Only .csv and .xlsx files are supported.');
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      setError('File is too large. Maximum size is 10 MB.');
      return;
    }
    setError(null);
    setFile(f);
    setStep('confirm');
  }, []);

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const f = e.target.files?.[0];
      if (f) acceptFile(f);
    },
    [acceptFile],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      const f = e.dataTransfer.files[0];
      if (f) acceptFile(f);
    },
    [acceptFile],
  );

  // ── Import ───────────────────────────────────────────────────────────────
  const handleImport = useCallback(async () => {
    if (!file) return;
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append('file', file);

      const response = await authFetch('/api/leads/import/file', {
        method: 'POST',
        body: form,
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body.error ?? `Upload failed: ${response.status}`);
      }

      const json = await response.json();
      const importResult: ImportResult = json.data;
      setResult(importResult);
      setStep('result');
      onComplete?.(importResult);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Import failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [file, onComplete]);

  const reset = useCallback(() => {
    setStep('upload');
    setFile(null);
    setError(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, []);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="import-title"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div className="bg-[#141414] border border-[#2A2A2A] rounded-xl w-full max-w-lg p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 id="import-title" className="text-xl font-semibold text-[#F5F5F0]">
            Import Leads
          </h2>
          {onClose && (
            <button
              aria-label="Close import wizard"
              onClick={onClose}
              className="text-[#999] hover:text-white transition-colors"
            >
              ✕
            </button>
          )}
        </div>

        {/* Step indicator */}
        <ol aria-label="Import steps" className="flex gap-2 mb-6 text-sm">
          {(['upload', 'confirm', 'result'] as Step[]).map((s, i) => (
            <li
              key={s}
              className={`flex items-center gap-1 ${step === s ? 'text-[#C9A84C]' : 'text-[#666]'}`}
            >
              <span
                aria-current={step === s ? 'step' : undefined}
                className="font-medium"
              >
                {i + 1}. {s.charAt(0).toUpperCase() + s.slice(1)}
              </span>
              {i < 2 && <span className="text-[#444]">›</span>}
            </li>
          ))}
        </ol>

        {/* ── Step: Upload ── */}
        {step === 'upload' && (
          <div>
            <div
              role="button"
              tabIndex={0}
              aria-label="Drop zone for CSV or XLSX file"
              onDragOver={e => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={e => e.key === 'Enter' && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-lg p-10 text-center cursor-pointer transition-colors ${
                dragOver
                  ? 'border-[#C9A84C] bg-[#C9A84C]/5'
                  : 'border-[#2A2A2A] hover:border-[#C9A84C]/50'
              }`}
            >
              <p className="text-[#F5F5F0] font-medium mb-1">
                Drag &amp; drop your file here
              </p>
              <p className="text-[#999] text-sm">
                Supports .csv and .xlsx · Max 500 rows · Max 10 MB
              </p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx"
                aria-label="File upload input"
                className="sr-only"
                onChange={handleFileChange}
              />
              <button
                type="button"
                className="mt-4 px-4 py-2 bg-[#C9A84C] text-black font-medium rounded-lg hover:bg-[#B8962A] transition-colors text-sm"
              >
                Browse File
              </button>
            </div>

            {error && (
              <p role="alert" className="mt-3 text-red-400 text-sm">
                {error}
              </p>
            )}

            <p className="mt-4 text-[#666] text-xs">
              Required columns: <span className="text-[#999]">Name</span>.
              Optional: Email, Phone, Company, Status, Source, Budget, Score, Notes.
            </p>
          </div>
        )}

        {/* ── Step: Confirm ── */}
        {step === 'confirm' && file && (
          <div>
            <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-4 mb-4">
              <p className="text-[#F5F5F0] text-sm font-medium mb-1">Selected file</p>
              <p className="text-[#999] text-sm" data-testid="file-name">{file.name}</p>
              <p className="text-[#666] text-xs mt-1">
                {(file.size / 1024).toFixed(1)} KB
              </p>
            </div>

            <p className="text-[#999] text-sm mb-4">
              The file will be uploaded to the server. Duplicate leads (matched by email or phone)
              will be skipped automatically. You will see a full import report when complete.
            </p>

            {error && (
              <p role="alert" className="mb-3 text-red-400 text-sm">
                {error}
              </p>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={reset}
                disabled={loading}
                className="flex-1 px-4 py-2 border border-[#2A2A2A] text-[#F5F5F0] rounded-lg hover:border-[#444] transition-colors text-sm disabled:opacity-50"
              >
                Back
              </button>
              <button
                type="button"
                onClick={handleImport}
                disabled={loading}
                className="flex-1 px-4 py-2 bg-[#C9A84C] text-black font-medium rounded-lg hover:bg-[#B8962A] transition-colors text-sm disabled:opacity-50"
              >
                {loading ? 'Importing…' : 'Import Now'}
              </button>
            </div>
          </div>
        )}

        {/* ── Step: Result ── */}
        {step === 'result' && result && (
          <div>
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-green-400">{result.imported}</p>
                <p className="text-xs text-[#999] mt-1">Imported</p>
              </div>
              <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-yellow-400">{result.duplicates}</p>
                <p className="text-xs text-[#999] mt-1">Duplicates</p>
              </div>
              <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3 text-center">
                <p className="text-2xl font-bold text-red-400">{result.errors.length}</p>
                <p className="text-xs text-[#999] mt-1">Errors</p>
              </div>
            </div>

            {result.errors.length > 0 && (
              <div className="bg-[#0A0A0A] border border-[#2A2A2A] rounded-lg p-3 mb-4 max-h-40 overflow-y-auto">
                <p className="text-sm font-medium text-[#F5F5F0] mb-2">Per-row errors</p>
                <ul className="space-y-1">
                  {result.errors.map((e, i) => (
                    <li key={i} className="text-xs text-red-400">
                      Row {e.row} — {e.field}: {e.message}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                onClick={reset}
                className="flex-1 px-4 py-2 border border-[#2A2A2A] text-[#F5F5F0] rounded-lg hover:border-[#444] transition-colors text-sm"
              >
                Import Another
              </button>
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 bg-[#C9A84C] text-black font-medium rounded-lg hover:bg-[#B8962A] transition-colors text-sm"
                >
                  Done
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadImportWizard;
