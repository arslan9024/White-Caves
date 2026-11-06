/**
 * SidebarDepartmentsList.tsx
 * White Caves Real Estate LLC - Department Left Sidebar Drawer (12-Department CRUD & Quick Rename)
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Drawer Sub-View)
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useState } from 'react';
import {
  GripVertical,
  Building2,
  Layers,
  Edit2,
  Trash2,
  PlusCircle,
  ArrowRight,
  Check,
  X,
  RotateCcw,
} from 'lucide-react';
import { useCorporateDepartments } from '../../../context/CorporateDepartmentsContext';
import { SidebarListWrapper, SidebarCardItem } from './SidebarDepartmentsList.styles';

export interface SidebarDepartmentsListProps {
  filterQuery?: string;
  onOpenCreate?: () => void;
  onNavigateToView?: (route: string) => void;
}

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
      <div style={{ marginBottom: '8px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '4px 6px',
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

        <div
          onClick={() => onNavigateToView?.('/dashboard/departments/slots')}
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
          data-testid="link-all-dept-slots"
        >
          <span>📑 Open 12 Slots Workspace (CRUD)</span>
          <ArrowRight size={11} />
        </div>

        <div
          onClick={() => onNavigateToView?.('/dashboard/departments/pillars')}
          style={{
            fontSize: '0.68rem',
            color: '#60A5FA',
            padding: '5px 8px',
            cursor: 'pointer',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            borderRadius: '6px',
          }}
          data-testid="link-dept-pillars"
        >
          <span>🏛️ Inspect 7 Governance Pillars</span>
          <ArrowRight size={11} />
        </div>
      </div>

      {visibleSlots.map(slot => {
        const isSelected = selectedSlotIndex === slot.slotIndex;
        const isEmpty = !slot.dept;
        const isRenaming = renamingSlotIdx === slot.slotIndex;
        const dept = slot.dept;

        return (
          <SidebarCardItem
            key={`slot-${slot.slotIndex}`}
            $isSelected={isSelected}
            $isEmpty={isEmpty}
            $isDragging={draggedSlotIndex === slot.slotIndex}
            $isDragOver={dragOverSlotIndex === slot.slotIndex}
            $accentColor={dept?.color || '#EF4444'}
            draggable={!isEmpty && !isRenaming}
            onDragStart={e => !isEmpty && handleSlotDragStart(e, slot.slotIndex)}
            onDragOver={e => handleSlotDragOver(e, slot.slotIndex)}
            onDragLeave={e => handleSlotDragLeave(e, slot.slotIndex)}
            onDrop={e => handleSlotDrop(e, slot.slotIndex)}
            onDragEnd={handleSlotDragEnd}
            onClick={() => {
              if (isRenaming) return;
              selectSlot(slot.slotIndex);
              onNavigateToView?.(
                dept?.code ? `/dashboard/departments/${dept.code}` : `/dashboard/departments/slots`
              );
            }}
            data-testid={`sidebar-dept-card-${slot.slotIndex}`}
          >
            <div className="card-top-row">
              <div className="slot-meta">
                <span className="slot-pill">#{slot.slotNumber}</span>
                <span className="slot-code">{dept?.code || slot.fixedCode}</span>
              </div>
              {!isEmpty && (
                <div
                  className="drag-handle"
                  title="Drag to swap department positions"
                  data-testid={`sidebar-dept-drag-${slot.slotIndex}`}
                >
                  <GripVertical size={13} />
                </div>
              )}
            </div>

            <div className="card-title-row">
              <div className="icon-box">
                <Building2 size={14} />
              </div>
              {isRenaming && dept ? (
                <div
                  onClick={e => e.stopPropagation()}
                  style={{ display: 'flex', alignItems: 'center', gap: '3px', flex: 1 }}
                >
                  <input
                    type="text"
                    value={renameText}
                    onChange={e => setRenameText(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') commitRename(e, dept._id);
                      if (e.key === 'Escape') setRenamingSlotIdx(null);
                    }}
                    autoFocus
                    data-testid={`sidebar-rename-input-${slot.slotIndex}`}
                    style={{
                      width: '100%',
                      background: '#0F172A',
                      border: '1px solid #EF4444',
                      borderRadius: '4px',
                      padding: '2px 6px',
                      color: '#FFFFFF',
                      fontSize: '0.73rem',
                      fontWeight: 700,
                      outline: 'none',
                    }}
                  />
                  <button
                    type="button"
                    onClick={e => commitRename(e, dept._id)}
                    title="Save Name"
                    data-testid={`sidebar-rename-save-${slot.slotIndex}`}
                    style={{
                      background: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '2px 4px',
                      cursor: 'pointer',
                    }}
                  >
                    <Check size={11} />
                  </button>
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      setRenamingSlotIdx(null);
                    }}
                    title="Cancel"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      color: '#94A3B8',
                      border: 'none',
                      borderRadius: '3px',
                      padding: '2px 4px',
                      cursor: 'pointer',
                    }}
                  >
                    <X size={11} />
                  </button>
                </div>
              ) : (
                <h4
                  onDoubleClick={e => dept && startRename(e, slot.slotIndex, dept.title)}
                  title="Double-click or click Edit icon to rename"
                >
                  {isEmpty ? `Empty Slot #${slot.slotNumber}` : dept?.title}
                </h4>
              )}
            </div>

            <div className="card-bottom-row">
              {isEmpty ? (
                <span style={{ fontStyle: 'italic', color: '#64748B' }}>
                  Click + to assign department
                </span>
              ) : (
                <span className="squad-count">
                  <Layers size={11} color="#3B82F6" />
                  <span>{dept?.directorOrManagerId?.fullName || '9 Squads'}</span>
                </span>
              )}

              <div className="card-actions">
                {isEmpty ? (
                  <button
                    type="button"
                    onClick={e => {
                      e.stopPropagation();
                      if (onOpenCreate) onOpenCreate();
                      else onNavigateToView?.('/dashboard/departments/slots');
                    }}
                    title="Create Department for this slot"
                  >
                    <PlusCircle size={12} />
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={e => dept && startRename(e, slot.slotIndex, dept.title)}
                      title="Quick Rename Department"
                      data-testid={`sidebar-edit-dept-${slot.slotIndex}`}
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        handleDemoteDepartment(slot.slotIndex);
                      }}
                      title="Demote to Unassigned Pool"
                      data-testid={`sidebar-demote-dept-${slot.slotIndex}`}
                    >
                      <Trash2 size={12} />
                    </button>
                  </>
                )}
              </div>
            </div>
          </SidebarCardItem>
        );
      })}
    </SidebarListWrapper>
  );
};

export default SidebarDepartmentsList;
