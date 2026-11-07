/**
 * DepartmentFinalizerTable.tsx
 * White Caves Real Estate LLC - 12-Department Name & Mandate Finalizer CRUD Matrix
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Layer)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState, useEffect } from 'react';
import { Check, RotateCcw, ArrowUp, ArrowDown, Edit2, Trash2, Plus, Save, Sparkles } from 'lucide-react';
import type { DepartmentNodeItem } from './DepartmentManager.types';
import type { DepartmentSlotDef } from './DepartmentManager.data';

export interface DepartmentFinalizerTableProps {
  slots: DepartmentSlotDef[];
  isReadOnly?: boolean;
  onInlineRename: (deptId: string, newTitle: string, directorName?: string, code?: string) => void;
  onBatchSaveAll: (updates: Record<string, { title: string; code: string; directorName: string }>) => void;
  onMoveDepartment: (fromIdx: number, toIdx: number) => void;
  onOpenEdit: (dept: DepartmentNodeItem) => void;
  onOpenCreateForSlot: () => void;
  onDelete: (deptId: string) => void;
  onResetDefaults: () => void;
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(255, 255, 255, 0.04)',
  border: '1px solid rgba(255, 255, 255, 0.14)',
  borderRadius: '6px',
  padding: '6px 9px',
  color: '#FFFFFF',
  fontWeight: 700,
  fontSize: '0.8rem',
};

const iconBtnStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  color: '#94A3B8',
  borderRadius: '5px',
  padding: '4px 6px',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
};

export const DepartmentFinalizerTable: FC<DepartmentFinalizerTableProps> = ({
  slots,
  isReadOnly = false,
  onInlineRename,
  onBatchSaveAll,
  onMoveDepartment,
  onOpenEdit,
  onOpenCreateForSlot,
  onDelete,
  onResetDefaults,
}) => {
  const [drafts, setDrafts] = useState<Record<string, { title: string; code: string; directorName: string }>>({});
  const [savedToast, setSavedToast] = useState<string | null>(null);

  useEffect(() => {
    const nextDrafts: Record<string, { title: string; code: string; directorName: string }> = {};
    slots.forEach(s => {
      if (s.dept) {
        nextDrafts[s.dept._id] = {
          title: s.dept.title,
          code: s.dept.code || s.fixedCode,
          directorName: s.dept.directorOrManagerId?.fullName || 'Managing Director',
        };
      }
    });
    setDrafts(nextDrafts);
  }, [slots]);

  const handleDraftChange = (deptId: string, field: 'title' | 'code' | 'directorName', value: string) => {
    setDrafts(prev => ({
      ...prev,
      [deptId]: { ...(prev[deptId] || { title: '', code: '', directorName: '' }), [field]: value },
    }));
  };

  const handleSaveRow = (deptId: string) => {
    const d = drafts[deptId];
    if (!d || !d.title.trim()) return;
    onInlineRename(deptId, d.title.trim(), d.directorName.trim(), d.code.trim());
    setSavedToast(`Saved "${d.title.trim()}"`);
    setTimeout(() => setSavedToast(null), 2500);
  };

  const handleSaveAll = () => {
    onBatchSaveAll(drafts);
    setSavedToast('All 12 Corporate Department Names Finalized & Saved!');
    setTimeout(() => setSavedToast(null), 3000);
  };

  return (
    <div
      data-testid="department-finalizer-table"
      style={{
        background: 'var(--bg-card, #070d18)',
        border: '1px solid rgba(239, 68, 68, 0.25)',
        borderRadius: '12px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
          paddingBottom: '12px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={16} color="#EF4444" />
            <h2 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 800, color: '#FFFFFF' }}>
              12-Department Name Finalizer Matrix (CRUD)
            </h2>
            <span
              style={{
                fontSize: '0.7rem',
                background: 'rgba(239, 68, 68, 0.15)',
                color: '#F87171',
                padding: '2px 8px',
                borderRadius: '6px',
                fontWeight: 800,
              }}
            >
              Strict 12-Slot Cap
            </span>
          </div>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#94A3B8' }}>
            Directly edit and finalize the official names, codes, and directors for all 12 departments in one unified sheet.
          </p>
        </div>

        {!isReadOnly && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {savedToast && (
              <span
                data-testid="finalizer-saved-toast"
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#10B981',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                }}
              >
                ✓ {savedToast}
              </span>
            )}
            <button
              type="button"
              onClick={onResetDefaults}
              data-testid="finalizer-reset-btn"
              style={{ ...iconBtnStyle, padding: '7px 12px', gap: '6px', fontWeight: 700 }}
            >
              <RotateCcw size={13} />
              <span>Restore 12 Defaults</span>
            </button>
            <button
              type="button"
              onClick={handleSaveAll}
              data-testid="finalizer-save-all-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '7px 16px',
                borderRadius: '8px',
                background: '#EF4444',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '0.78rem',
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              <Save size={14} />
              <span>Save All 12 Names</span>
            </button>
          </div>
        )}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
          <thead>
            <tr
              style={{
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                color: '#94A3B8',
                textAlign: 'left',
                fontSize: '0.7rem',
                textTransform: 'uppercase',
              }}
            >
              <th style={{ padding: '10px 8px', width: '74px' }}>Slot</th>
              <th style={{ padding: '10px 8px', width: '120px' }}>Code</th>
              <th style={{ padding: '10px 8px' }}>Final Department Name (Title)</th>
              <th style={{ padding: '10px 8px', width: '210px' }}>Director / Lead</th>
              <th style={{ padding: '10px 8px', width: '160px', textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {slots.map((slot, idx) => {
              const dept = slot.dept;
              const draft = dept ? drafts[dept._id] : null;
              return (
                <tr
                  key={slot.fixedCode}
                  data-testid={`finalizer-row-${slot.slotNumber}`}
                  style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
                >
                  <td style={{ padding: '10px 8px' }}>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 800,
                        fontSize: '0.72rem',
                        color: dept?.color || '#EF4444',
                        background: 'rgba(239, 68, 68, 0.1)',
                        padding: '2px 7px',
                        borderRadius: '5px',
                      }}
                    >
                      #{String(slot.slotNumber).padStart(2, '0')}
                    </span>
                  </td>

                  <td style={{ padding: '10px 8px' }}>
                    {dept ? (
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={draft?.code ?? dept.code}
                        onChange={e => handleDraftChange(dept._id, 'code', e.target.value)}
                        data-testid={`finalizer-code-input-${slot.slotNumber}`}
                        style={{ ...inputStyle, width: '100px', color: '#F87171', fontFamily: 'monospace' }}
                      />
                    ) : (
                      <span style={{ color: '#64748B', fontFamily: 'monospace' }}>{slot.fixedCode}</span>
                    )}
                  </td>

                  <td style={{ padding: '10px 8px' }}>
                    {dept ? (
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={draft?.title ?? dept.title}
                        onChange={e => handleDraftChange(dept._id, 'title', e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSaveRow(dept._id)}
                        placeholder="Enter finalized department name..."
                        data-testid={`finalizer-title-input-${slot.slotNumber}`}
                        style={inputStyle}
                      />
                    ) : (
                      <span style={{ color: '#64748B', fontStyle: 'italic' }}>
                        Empty Department Slot #{slot.slotNumber}
                      </span>
                    )}
                  </td>

                  <td style={{ padding: '10px 8px' }}>
                    {dept ? (
                      <input
                        type="text"
                        disabled={isReadOnly}
                        value={draft?.directorName ?? dept.directorOrManagerId?.fullName ?? 'Managing Director'}
                        onChange={e => handleDraftChange(dept._id, 'directorName', e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSaveRow(dept._id)}
                        data-testid={`finalizer-director-input-${slot.slotNumber}`}
                        style={{ ...inputStyle, fontWeight: 500, fontSize: '0.76rem' }}
                      />
                    ) : (
                      <span style={{ color: '#475569' }}>Unassigned</span>
                    )}
                  </td>

                  <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                    {dept ? (
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <button
                          type="button"
                          onClick={() => handleSaveRow(dept._id)}
                          title="Save this department name"
                          data-testid={`finalizer-save-row-${slot.slotNumber}`}
                          style={{ ...iconBtnStyle, background: 'rgba(16, 185, 129, 0.15)', borderColor: '#10B981', color: '#10B981' }}
                        >
                          <Check size={13} />
                        </button>
                        <button type="button" disabled={idx === 0} onClick={() => onMoveDepartment(idx, idx - 1)} title="Move Slot Up" style={iconBtnStyle}>
                          <ArrowUp size={12} />
                        </button>
                        <button type="button" disabled={idx === 11 || !slots[idx + 1]?.dept} onClick={() => onMoveDepartment(idx, idx + 1)} title="Move Slot Down" style={iconBtnStyle}>
                          <ArrowDown size={12} />
                        </button>
                        <button type="button" onClick={() => onOpenEdit(dept)} title="Open Full Details Drawer" style={iconBtnStyle}>
                          <Edit2 size={12} />
                        </button>
                        <button type="button" onClick={() => onDelete(dept._id)} title="Clear Slot / Demote to Pool" style={{ ...iconBtnStyle, color: '#EF4444' }}>
                          <Trash2 size={12} />
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={onOpenCreateForSlot}
                        data-testid={`finalizer-assign-slot-${slot.slotNumber}`}
                        style={{ ...iconBtnStyle, color: '#F87171', borderColor: '#EF4444', gap: '4px' }}
                      >
                        <Plus size={12} />
                        <span>Assign Slot</span>
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DepartmentFinalizerTable;
