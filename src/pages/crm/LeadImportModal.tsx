/**
 * Lead Import Modal — P1-001
 *
 * Allows managers/owners to bulk-import leads from CSV data (paste or file upload).
 * Provides field-mapping UI and per-row error reporting.
 *
 * Supported fields: name, email, phone, company, status, source, budget, notes
 */
import React, { FC, useCallback, useRef, useState } from 'react';
import { authFetch } from '../../utils/authFetch';

// ─── CSV field columns (maps UI header → API field name) ────────────────

const FIELD_OPTIONS = [
  { value: '', label: '— skip —' },
  { value: 'name', label: 'Name' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
  { value: 'company', label: 'Company' },
  { value: 'status', label: 'Status' },
  { value: 'source', label: 'Source' },
  { value: 'budget', label: 'Budget (AED)' },
  { value: 'notes', label: 'Notes' },
] as const;

type FieldKey =
  | ''
  | 'name'
  | 'email'
  | 'phone'
  | 'company'
  | 'status'
  | 'source'
  | 'budget'
  | 'notes';

type RowError = { row: number; message: string };

export interface LeadImportModalProps {
  onClose: () => void;
  onSuccess: (imported: number) => void;
}

function parseCsv(raw: string): { headers: string[]; rows: string[][] } {
  const lines = raw.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length === 0) return { headers: [], rows: [] };

  const parse = (line: string): string[] => {
    const cells: string[] = [];
    let inQuotes = false;
    let current = '';
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQuotes = !inQuotes;
      } else if (ch === ',' && !inQuotes) {
        cells.push(current.trim());
        current = '';
      } else {
        current += ch;
      }
    }
    cells.push(current.trim());
    return cells;
  };

  const headers = parse(lines[0]);
  const rows = lines.slice(1).map(parse);
  return { headers, rows };
}

const LeadImportModal: FC<LeadImportModalProps> = ({ onClose, onSuccess }) => {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [csvText, setCsvText] = useState('');
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<string[][]>([]);
  const [mapping, setMapping] = useState<Record<number, FieldKey>>({});
  const [rowErrors, setRowErrors] = useState<RowError[]>([]);
  const [importing, setImporting] = useState(false);
  const [successCount, setSuccessCount] = useState<number | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [step, setStep] = useState<'input' | 'map' | 'result'>('input');

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const text = ev.target?.result as string;
      setCsvText(text);
    };
    reader.readAsText(file);
  }, []);

  const handleParse = useCallback(() => {
    const { headers: h, rows: r } = parseCsv(csvText);
    if (h.length === 0) {
      setApiError('No data detected. Paste CSV text with a header row first.');
      return;
    }
    setHeaders(h);
    setRows(r);
    setApiError(null);

    // Auto-detect mapping by matching header names
    const AUTO: Record<string, FieldKey> = {
      name: 'name',
      full_name: 'name',
      fullname: 'name',
      email: 'email',
      email_address: 'email',
      phone: 'phone',
      mobile: 'phone',
      telephone: 'phone',
      company: 'company',
      organisation: 'company',
      organization: 'company',
      status: 'status',
      source: 'source',
      budget: 'budget',
      budget_aed: 'budget',
      notes: 'notes',
      comment: 'notes',
      comments: 'notes',
    };
    const detected: Record<number, FieldKey> = {};
    h.forEach((header, i) => {
      const key = header.toLowerCase().replace(/\s+/g, '_');
      // eslint-disable-next-line security/detect-object-injection
      detected[i] = AUTO[key] ?? '';
    });
    setMapping(detected);
    setStep('map');
  }, [csvText]);

  const handleImport = useCallback(async () => {
    setImporting(true);
    setRowErrors([]);
    setApiError(null);

    const errors: RowError[] = [];
    const payload: Record<string, string | number | null>[] = rows
      .map((cells, rowIdx) => {
        const lead: Record<string, string | number | null> = {};
        headers.forEach((_, colIdx) => {
          // eslint-disable-next-line security/detect-object-injection
          const field = mapping[colIdx];
          if (!field) return;
          // eslint-disable-next-line security/detect-object-injection
          const val = cells[colIdx] ?? '';
          if (field === 'budget') {
            const n = parseFloat(val);
            lead.budget = isNaN(n) ? null : n;
          } else {
            lead[field] = val.trim() || null;
          }
        });

        if (!lead.name) {
          errors.push({ row: rowIdx + 2, message: 'Missing required field: name' });
        }
        return lead;
      })
      .filter(l => l.name); // skip name-less rows

    if (payload.length === 0) {
      setRowErrors(errors);
      setImporting(false);
      return;
    }

    try {
      const response = await authFetch('/api/leads/bulk-import', {
        method: 'POST',
        body: JSON.stringify({ leads: payload }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.error || json.message || 'Import failed');
      }
      setSuccessCount(json.data?.imported ?? payload.length);
      setRowErrors(errors);
      setStep('result');
      onSuccess(json.data?.imported ?? payload.length);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : 'Import failed');
    } finally {
      setImporting(false);
    }
  }, [headers, mapping, onSuccess, rows]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="lead-import-title"
      className="lead-import-overlay"
    >
      <div className="lead-import-modal">
        {/* Header */}
        <div className="lead-import-header">
          <h2 id="lead-import-title" className="lead-import-title">
            Import Leads
          </h2>
          <button className="lead-import-close" onClick={onClose} aria-label="Close import modal">
            ✕
          </button>
        </div>

        {apiError && (
          <div role="alert" className="lead-import-error">
            {apiError}
          </div>
        )}

        {/* Step 1 — Input */}
        {step === 'input' && (
          <div className="lead-import-body">
            <p className="lead-import-hint">
              Paste CSV data below, or upload a .csv file. The first row must be a header row.
            </p>
            <textarea
              className="lead-import-textarea"
              placeholder="name,email,phone,company&#10;John Smith,john@test.ae,+971501234567,Acme LLC"
              value={csvText}
              onChange={e => setCsvText(e.target.value)}
              rows={8}
              aria-label="CSV data input"
            />
            <div className="lead-import-file-row">
              <label htmlFor="lead-import-file" className="lead-import-file-label">
                Or upload CSV file:
              </label>
              <input
                id="lead-import-file"
                type="file"
                accept=".csv,text/csv"
                ref={fileRef}
                onChange={handleFileChange}
                className="lead-import-file-input"
              />
            </div>
            <div className="lead-import-footer">
              <button className="lead-import-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button
                className="lead-import-btn-primary"
                onClick={handleParse}
                disabled={!csvText.trim()}
              >
                Next: Map Fields →
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Field Mapping */}
        {step === 'map' && (
          <div className="lead-import-body">
            <p className="lead-import-hint">
              Map each CSV column to a lead field. {rows.length} row(s) detected.
            </p>
            <div className="lead-import-mapping-table" role="table" aria-label="Column mapping">
              <div className="lead-import-mapping-head" role="row">
                <span role="columnheader">CSV Column</span>
                <span role="columnheader">Preview</span>
                <span role="columnheader">Maps To</span>
              </div>
              {headers.map((header, i) => (
                <div key={i} className="lead-import-mapping-row" role="row">
                  <span role="cell" className="lead-import-col-name">
                    {header}
                  </span>
                  <span role="cell" className="lead-import-col-preview">
                    {rows[0]?.[i] ?? '—'}
                  </span>
                  <span role="cell">
                    <label htmlFor={`col-map-${i}`} className="sr-only">
                      Map column {header}
                    </label>
                    <select
                      id={`col-map-${i}`}
                      title={`Map column ${header}`}
                      value={mapping[i] ?? ''}
                      onChange={e =>
                        setMapping(prev => ({ ...prev, [i]: e.target.value as FieldKey }))
                      }
                      className="lead-import-select"
                    >
                      {FIELD_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </span>
                </div>
              ))}
            </div>
            {rowErrors.length > 0 && (
              <div
                className="lead-import-row-errors"
                role="alert"
                aria-label="Row validation errors"
              >
                <strong>Validation issues:</strong>
                {rowErrors.slice(0, 10).map((e, i) => (
                  <div key={i} className="lead-import-row-error">
                    Row {e.row}: {e.message}
                  </div>
                ))}
              </div>
            )}
            <div className="lead-import-footer">
              <button className="lead-import-btn-secondary" onClick={() => setStep('input')}>
                ← Back
              </button>
              <button
                className="lead-import-btn-primary"
                onClick={() => void handleImport()}
                disabled={importing}
              >
                {importing ? 'Importing…' : `Import ${rows.length} Lead(s)`}
              </button>
            </div>
          </div>
        )}

        {/* Step 3 — Result */}
        {step === 'result' && (
          <div className="lead-import-body lead-import-result" role="status">
            <div className="lead-import-success-icon" aria-hidden="true">
              ✓
            </div>
            <h3 className="lead-import-success-title">
              {successCount} lead(s) imported successfully
            </h3>
            {rowErrors.length > 0 && (
              <p className="lead-import-result-skipped">
                {rowErrors.length} row(s) skipped due to validation errors.
              </p>
            )}
            <div className="lead-import-footer">
              <button className="lead-import-btn-primary" onClick={onClose}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LeadImportModal;
