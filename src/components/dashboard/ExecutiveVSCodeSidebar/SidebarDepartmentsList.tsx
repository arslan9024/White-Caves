/**
 * SidebarDepartmentsList.tsx
 * White Caves Real Estate LLC - Department Left Sidebar Drawer (12-Department CRUD & Hierarchical Sections)
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState } from 'react';
import {
  RotateCcw,
  Building,
  ArrowRight,
} from 'lucide-react';
import { useCorporateDepartments } from '../../../context/CorporateDepartmentsContext';
import { SidebarListWrapper } from './SidebarDepartmentsList.styles';
import { SidebarDepartmentCard } from './SidebarDepartmentCard';
import {
  getSectionForSlotNumber,
} from '../../../data/departmentSections.data';

export interface SidebarDepartmentsListProps {
  filterQuery?: string;
  onOpenCreate?: () => void;
  onNavigateToView?: (route: string) => void;
}

type SectionKey = 'ALL' | 'SECTION_A' | 'SECTION_B' | 'SECTION_C';

export const SidebarDepartmentsList: FC<SidebarDepartmentsListProps> = ({
  filterQuery = '',
  onOpenCreate,
  onNavigateToView,
}) => {
  const {
    slots,
    departments,
    selectedSlotIndex,
    draggedSlotIndex,
    dragOverSlotIndex,
    selectSlot,
    handleInlineRename,
    handleResetDefaults,
    handleSlotDragStart,
    handleSlotDragOver,
    handleSlotDragLeave,
    handleSlotDrop,
    handleSlotDragEnd,
    handleDemoteDepartment,
  } = useCorporateDepartments();

  const [activeSection, setActiveSection] = useState<SectionKey>('ALL');
  const [renamingSlotIdx, setRenamingSlotIdx] = useState<number | null>(null);
  const [renameText, setRenameText] = useState<string>('');

  const startRename = (e: React.MouseEvent, slotIndex: number, currentTitle: string) => {
    e.stopPropagation();
    setRenamingSlotIdx(slotIndex);
    setRenameText(currentTitle);
  };

  const commitRename = (e: React.MouseEvent | React.KeyboardEvent, deptId: string) => {
    e.stopPropagation();
    if (renameText.trim()) handleInlineRename(deptId, renameText.trim());
    setRenamingSlotIdx(null);
  };

  const query = filterQuery.trim().toLowerCase();
  const visibleSlots = slots.filter(slot => {
    if (activeSection !== 'ALL') {
      const sec = getSectionForSlotNumber(slot.slotNumber);
      if (sec.key !== activeSection) return false;
    }
    if (!query) return true;
    if (slot.fixedCode.toLowerCase().includes(query)) return true;
    if (slot.dept) {
      return (
        slot.dept.title.toLowerCase().includes(query) ||
        slot.dept.code.toLowerCase().includes(query) ||
        (slot.dept.description && slot.dept.description.toLowerCase().includes(query))
      );
    }
    return `slot #${slot.slotNumber}`.includes(query);
  });

  return (
    <SidebarListWrapper data-testid="sidebar-departments-list">
      {/* ── Header Controls ─────────────────────────────────────────────────── */}
      <div style={{ marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '2px 4px',
            fontSize: '0.66rem',
            color: '#94A3B8',
            fontWeight: 700,
          }}
        >
          <span>{departments.length} / 12 Corporate Slots</span>
          <button
            type="button"
            onClick={handleResetDefaults}
            title="Restore canonical 12 department names"
            data-testid="sidebar-reset-12-depts-btn"
            style={{
              background: 'transparent',
              border: 'none',
              color: '#64748B',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '3px',
              fontSize: '0.64rem',
              fontWeight: 700,
            }}
          >
            <RotateCcw size={10} /> Reset 12
          </button>
        </div>

        {/* ── Subsystem Hub Quick Navigation ──────────────────────────────── */}
        <div
          onClick={() => onNavigateToView?.('/dashboard/dms')}
          style={{
            fontSize: '0.68rem',
            color: '#F87171',
            padding: '6px 8px',
            cursor: 'pointer',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '6px',
          }}
          data-testid="link-dms-root-overview"
        >
          <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <Building size={12} /> DMS Headquarters Hub (1-12-108)
          </span>
          <ArrowRight size={11} />
        </div>

        {/* ── Section Hierarchy Selector Filter Tabs ─────────────────────────── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '3px',
            background: '#0B0F17',
            padding: '2px',
            borderRadius: '6px',
            border: '1px solid rgba(255,255,255,0.06)',
          }}
          data-testid="sidebar-section-tabs"
        >
          {(['ALL', 'SECTION_A', 'SECTION_B', 'SECTION_C'] as const).map(sec => {
            const isActive = activeSection === sec;
            const label =
              sec === 'ALL'
                ? 'All'
                : sec === 'SECTION_A'
                ? 'Sec A'
                : sec === 'SECTION_B'
                ? 'Sec B'
                : 'Sec C';
            const color =
              sec === 'SECTION_A'
                ? '#8B5CF6'
                : sec === 'SECTION_B'
                ? '#10B981'
                : sec === 'SECTION_C'
                ? '#3B82F6'
                : '#EF4444';

            return (
              <button
                key={sec}
                type="button"
                onClick={() => setActiveSection(sec)}
                data-testid={`sidebar-section-tab-${sec}`}
                style={{
                  background: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: isActive ? `1px solid ${color}` : '1px solid transparent',
                  color: isActive ? '#FFFFFF' : '#94A3B8',
                  padding: '3px 0',
                  borderRadius: '4px',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Render Grouped / Filtered Department Cards ─────────────────────── */}
      {visibleSlots.map(slot => {
        const isSelected = selectedSlotIndex === slot.slotIndex;
        const isEmpty = !slot.dept;
        const isRenaming = renamingSlotIdx === slot.slotIndex;
        const dept = slot.dept;

        return (
          <SidebarDepartmentCard
            key={`slot-${slot.slotIndex}`}
            slot={slot}
            isSelected={isSelected}
            isEmpty={isEmpty}
            isDragging={draggedSlotIndex === slot.slotIndex}
            isDragOver={dragOverSlotIndex === slot.slotIndex}
            isRenaming={isRenaming}
            renameText={renameText}
            onRenameTextChange={setRenameText}
            onCommitRename={commitRename}
            onCancelRename={() => setRenamingSlotIdx(null)}
            onStartRename={startRename}
            onSelect={() => {
              if (isRenaming) return;
              selectSlot(slot.slotIndex);
              const targetRoute = dept?.code
                ? `/dashboard/dms/${dept.code}`
                : `/dashboard/departments/slots`;
              onNavigateToView?.(targetRoute);
            }}
            onDragStart={e => !isEmpty && handleSlotDragStart(e, slot.slotIndex)}
            onDragOver={e => handleSlotDragOver(e, slot.slotIndex)}
            onDragLeave={() => handleSlotDragLeave(slot.slotIndex)}
            onDrop={e => handleSlotDrop(e, slot.slotIndex)}
            onDragEnd={handleSlotDragEnd}
            onDemote={e => {
              e.stopPropagation();
              handleDemoteDepartment(slot.slotIndex);
            }}
            onOpenCreate={() => {
              if (onOpenCreate) onOpenCreate();
              else onNavigateToView?.('/dashboard/departments/slots');
            }}
          />
        );
      })}
    </SidebarListWrapper>
  );
};

export default SidebarDepartmentsList;
