/**
 * DepartmentQuickPasteBar.tsx
 * White Caves Real Estate LLC - Managing Director Fast 12-Department Bulk Paste & Blueprint Sub-Component
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Layer)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState } from 'react';
import { ClipboardPaste, Download, Upload, Check, AlertCircle } from 'lucide-react';
import type { DepartmentSlotDef } from './DepartmentManager.data';
import type { DepartmentNodeItem } from './DepartmentManager.types';

export interface DepartmentQuickPasteBarProps {
  slots: DepartmentSlotDef[];
  departments: DepartmentNodeItem[];
  onBatchSaveAll: (updates: Record<string, { title: string; code: string; directorName: string }>) => void;
  onImportDepartments: (imported: DepartmentNodeItem[]) => void;
}

export const DepartmentQuickPasteBar: FC<DepartmentQuickPasteBarProps> = ({
  slots,
  departments,
  onBatchSaveAll,
  onImportDepartments,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rawText, setRawText] = useState('');
  const [statusMsg, setStatusMsg] = useState<{ text: string; isError?: boolean } | null>(null);

  const handleApplyBulk = () => {
    const lines = rawText
      .split('\n')
      .map(l => l.trim())
      .filter(Boolean);

    if (lines.length === 0) {
      setStatusMsg({ text: 'Please enter at least 1 department name.', isError: true });
      return;
    }

    const updates: Record<string, { title: string; code: string; directorName: string }> = {};
    slots.forEach((s, idx) => {
      if (s.dept && lines[idx]) {
        updates[s.dept._id] = {
          title: lines[idx],
          code: s.dept.code || s.fixedCode,
          directorName: s.dept.directorOrManagerId?.fullName || 'Managing Director',
        };
      }
    });

    onBatchSaveAll(updates);
    setStatusMsg({ text: `Applied ${Math.min(lines.length, 12)} department names successfully!` });
    setTimeout(() => {
      setStatusMsg(null);
      setIsOpen(false);
    }, 2000);
  };

  const handleExportJson = () => {
    const data = JSON.stringify(departments, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `whitecaves-12-departments-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setStatusMsg({ text: 'Downloaded 12-Department Blueprint JSON!' });
    setTimeout(() => setStatusMsg(null), 2500);
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const parsed = JSON.parse(ev.target?.result as string);
        if (Array.isArray(parsed) && parsed.length > 0) {
          onImportDepartments(parsed.slice(0, 12));
          setStatusMsg({ text: `Imported ${Math.min(parsed.length, 12)} departments blueprint!` });
          setTimeout(() => setStatusMsg(null), 2500);
        } else {
          setStatusMsg({ text: 'Invalid JSON: array expected.', isError: true });
        }
      } catch {
        setStatusMsg({ text: 'Failed to parse JSON file.', isError: true });
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div
      style={{
        background: 'rgba(255, 255, 255, 0.03)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '8px',
        padding: '12px 16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
      }}
      data-testid="department-quick-paste-bar"
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            data-testid="toggle-bulk-rename-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: '6px',
              background: isOpen ? 'rgba(239, 68, 68, 0.2)' : 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#F87171',
              fontSize: '0.76rem',
              fontWeight: 700,
              cursor: 'pointer',
            }}
          >
            <ClipboardPaste size={13} />
            <span>MD Fast 12-Name Paste Bar</span>
          </button>
          <span style={{ fontSize: '0.72rem', color: '#64748B' }}>
            Paste 12 names (one per line) or import/export configuration
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {statusMsg && (
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: statusMsg.isError ? '#EF4444' : '#10B981',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              {statusMsg.isError ? <AlertCircle size={13} /> : <Check size={13} />}
              {statusMsg.text}
            </span>
          )}
          <button
            type="button"
            onClick={handleExportJson}
            title="Export 12-Department Blueprint JSON"
            data-testid="export-depts-json-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94A3B8',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Download size={12} />
            <span>Export JSON</span>
          </button>
          <label
            data-testid="import-depts-json-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              padding: '5px 10px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.04)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#94A3B8',
              fontSize: '0.72rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Upload size={12} />
            <span>Import JSON</span>
            <input type="file" accept=".json" onChange={handleImportFile} style={{ display: 'none' }} />
          </label>
        </div>
      </div>

      {isOpen && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', paddingTop: '6px' }}>
          <textarea
            rows={5}
            value={rawText}
            onChange={e => setRawText(e.target.value)}
            placeholder={`Paste 12 names, each on a new line:\n1. Luxury Sales & Brokerage\n2. Strategic Off-Plan\n3. Commercial Real Estate...`}
            data-testid="bulk-rename-textarea"
            style={{
              width: '100%',
              background: 'rgba(0, 0, 0, 0.3)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              borderRadius: '6px',
              padding: '8px 10px',
              color: '#FFFFFF',
              fontSize: '0.78rem',
              fontFamily: 'monospace',
            }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={{
                padding: '5px 12px',
                borderRadius: '6px',
                background: 'transparent',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94A3B8',
                fontSize: '0.74rem',
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleApplyBulk}
              data-testid="apply-bulk-rename-btn"
              style={{
                padding: '5px 14px',
                borderRadius: '6px',
                background: '#EF4444',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '0.74rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Apply to 12 Slots
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DepartmentQuickPasteBar;
