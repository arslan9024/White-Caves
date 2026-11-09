/**
 * DepartmentOverviewView.tsx
 * White Caves Real Estate LLC - DMS Executive Overview & 12-Department Quick Finalizer
 * Standard: AEGIS Canonical 7-Category Architecture Standard (View Primitive)
 * Single Purpose File Law: < 350 lines
 * Protocol: Turing Protocol & Bhakti Protocol Anchors
 */

import React, { FC, useState } from 'react';
import {
  Building2,
  Layers,
  ArrowRight,
  Grid,
  Edit2,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';
import { SUPERVISORS_108 } from '../../../data/assistants108Registry.data';
import { useCorporateDepartments } from '../../../context/CorporateDepartmentsContext';
import { DepartmentOverviewSectionsGuide } from './DepartmentOverviewSectionsGuide';
import { getSectionForSlotNumber } from '../../../data/departmentSections.data';

export interface DepartmentOverviewViewProps {
  onNavigate: (route: string) => void;
}

type SectionFilter = 'ALL' | 'SECTION_A' | 'SECTION_B' | 'SECTION_C';

export const DepartmentOverviewView: FC<DepartmentOverviewViewProps> = ({ onNavigate }) => {
  const { slots, departments, handleInlineRename, handleResetDefaults } =
    useCorporateDepartments();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState<string>('');
  const [selectedSection, setSelectedSection] = useState<SectionFilter>('ALL');

  const startInlineEdit = (e: React.MouseEvent, id: string, currentTitle: string) => {
    e.stopPropagation();
    setEditingId(id);
    setDraftName(currentTitle);
  };

  const saveInlineEdit = (e: React.MouseEvent | React.KeyboardEvent, id: string) => {
    e.stopPropagation();
    if (draftName.trim()) {
      handleInlineRename(id, draftName.trim());
    }
    setEditingId(null);
  };

  const filteredSlots = slots.filter(slot => {
    if (selectedSection === 'ALL') return true;
    const sec = getSectionForSlotNumber(slot.slotNumber);
    return sec.key === selectedSection;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto" data-testid="department-overview-view">
      {/* ── 1. Top Sovereign Header ────────────────────────────────────── */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-red-950/30 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 size={15} /> System #1 · Department Management System (DMS)
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Corporate Department Management System & Bhakti Hierarchy
          </h1>
          <p className="text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
            The canonical 13-story spatial corporate structure: 1 MD Sovereign Penthouse, 12 C-Suite
            Directors across Sections A, B & C, and 108 operational sub-department squads (9 per department).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleResetDefaults}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs border border-slate-700 cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset 12 Defaults</span>
          </button>
          <button
            type="button"
            onClick={() => onNavigate('/dashboard/departments/slots')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-lg cursor-pointer"
          >
            <span>Open Full 12-Department CRUD Matrix</span>
            <ArrowRight size={14} />
          </button>
        </div>
      </div>

      {/* ── 2. Spatial 13-Floor Building & Bhakti Section Guide ─────────── */}
      <DepartmentOverviewSectionsGuide
        onNavigateSection={secKey => setSelectedSection(secKey)}
      />

      {/* ── 3. Real-Time Telemetry Deck ─────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900/60 border border-red-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Corporate Slots</div>
          <div className="text-2xl font-black text-red-400 mt-1">
            {departments.length} / 12 <span className="text-xs text-slate-500">Fixed</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">12 C-Suite Director Seats</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-blue-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Sub-Departments</div>
          <div className="text-2xl font-black text-blue-400 mt-1">
            {SUPERVISORS_108.length} <span className="text-xs text-slate-500">Squads</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">9 Squads per Corporate Slot</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-emerald-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Building Sections</div>
          <div className="text-2xl font-black text-emerald-400 mt-1">
            3 <span className="text-xs text-slate-500">+ Penthouse</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">Sec A, Sec B, Sec C</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/60 border border-amber-500/30">
          <div className="text-[11px] font-mono uppercase text-slate-400">Active Directors</div>
          <div className="text-2xl font-black text-amber-400 mt-1">
            {departments.length} <span className="text-xs text-slate-500">Leaders</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">C-Level Autopilot Agents</div>
        </div>
      </div>

      {/* ── 4. Interactive 12-Department Quick Rename & Deep Navigation Grid ── */}
      <div className="p-5 rounded-2xl bg-slate-900/40 border border-slate-800">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-xs font-bold font-mono text-slate-300 uppercase tracking-wider">
              12 Corporate Floors & Departments Grid ({filteredSlots.length} Slots Shown)
            </h4>
            <span className="text-[11px] text-slate-400">
              Click <Edit2 size={11} className="inline text-red-400" /> on any slot to rename inline
            </span>
          </div>

          {/* Section Quick Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['ALL', 'SECTION_A', 'SECTION_B', 'SECTION_C'] as const).map(sec => (
              <button
                key={sec}
                type="button"
                onClick={() => setSelectedSection(sec)}
                data-testid={`overview-filter-btn-${sec}`}
                className={`px-2.5 py-1 rounded text-[11px] font-bold cursor-pointer transition-colors ${
                  selectedSection === sec
                    ? 'bg-red-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {sec === 'ALL'
                  ? 'All Floors'
                  : sec === 'SECTION_A'
                  ? 'Sec A (9-12)'
                  : sec === 'SECTION_B'
                  ? 'Sec B (5-8)'
                  : 'Sec C (1-4)'}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {filteredSlots.map(slot => {
            const dept = slot.dept;
            const isEditing = dept && editingId === dept._id;
            const section = getSectionForSlotNumber(slot.slotNumber);

            return (
              <div
                key={slot.fixedCode}
                onClick={() => {
                  if (!isEditing) {
                    onNavigate(
                      dept
                        ? `/dashboard/dms/${dept.code || dept.slug}`
                        : '/dashboard/departments/slots'
                    );
                  }
                }}
                className="flex flex-col justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-red-500/40 hover:bg-slate-900 text-left transition-all cursor-pointer group"
                data-testid={`overview-slot-card-${slot.slotNumber}`}
              >
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span
                    style={{ color: section.color }}
                    className="text-[10px] font-mono font-bold"
                  >
                    FL-{String(slot.slotNumber).padStart(2, '0')} · {dept?.code || slot.fixedCode}
                  </span>
                  {dept && !isEditing && (
                    <button
                      type="button"
                      onClick={e => startInlineEdit(e, dept._id, dept.title)}
                      title="Quick Rename Department"
                      data-testid={`overview-rename-btn-${slot.slotNumber}`}
                      className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-red-400"
                    >
                      <Edit2 size={12} />
                    </button>
                  )}
                </div>

                {isEditing && dept ? (
                  <div
                    onClick={e => e.stopPropagation()}
                    className="flex items-center gap-1.5 my-1"
                  >
                    <input
                      type="text"
                      value={draftName}
                      onChange={e => setDraftName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') saveInlineEdit(e, dept._id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      autoFocus
                      data-testid={`overview-rename-input-${slot.slotNumber}`}
                      className="flex-1 bg-slate-900 border border-red-500 rounded px-2 py-1 text-xs text-white font-bold outline-none"
                    />
                    <button
                      type="button"
                      onClick={e => saveInlineEdit(e, dept._id)}
                      className="p-1 rounded bg-emerald-600 text-white"
                      title="Save"
                    >
                      <Check size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        setEditingId(null);
                      }}
                      className="p-1 rounded bg-slate-800 text-slate-300"
                      title="Cancel"
                    >
                      <X size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-slate-200 group-hover:text-white truncate block">
                      {dept ? dept.title : `Empty Slot #${slot.slotNumber}`}
                    </span>
                    <ArrowRight
                      size={12}
                      className="text-slate-600 group-hover:text-red-400 shrink-0 transition-colors"
                    />
                  </div>
                )}

                <div className="flex items-center justify-between text-[10px] text-slate-500 mt-2 pt-1 border-t border-slate-900">
                  <span className="truncate max-w-[120px]">
                    {dept?.directorOrManagerId?.fullName ? `Dir: ${dept.directorOrManagerId.fullName}` : '9 Squads'}
                  </span>
                  <span style={{ color: section.color }}>{section.shortTitle.split(' ')[0]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DepartmentOverviewView;
