/**
 * SidebarDepartmentCard.tsx
 * White Caves Real Estate LLC - Individual Department Card for Sidebar Drawer
 * Standard: AEGIS Single Purpose Component (< 180 lines)
 */

import React, { FC } from 'react';
import {
  GripVertical,
  Building2,
  Layers,
  Edit2,
  Trash2,
  PlusCircle,
  Check,
  X,
} from 'lucide-react';
import { SidebarCardItem } from './SidebarDepartmentsList.styles';
import type { FixedSlot } from '../../../components/crm/DepartmentManager/DepartmentManager.types';

export interface SidebarDepartmentCardProps {
  slot: FixedSlot;
  isSelected: boolean;
  isEmpty: boolean;
  isDragging: boolean;
  isDragOver: boolean;
  isRenaming: boolean;
  renameText: string;
  onRenameTextChange: (text: string) => void;
  onCommitRename: (e: React.MouseEvent | React.KeyboardEvent, deptId: string) => void;
  onCancelRename: () => void;
  onStartRename: (e: React.MouseEvent, slotIndex: number, currentTitle: string) => void;
  onSelect: () => void;
  onDragStart: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (e: React.DragEvent) => void;
  onDragEnd: () => void;
  onDemote: (e: React.MouseEvent) => void;
  onOpenCreate?: () => void;
}

export const SidebarDepartmentCard: FC<SidebarDepartmentCardProps> = ({
  slot,
  isSelected,
  isEmpty,
  isDragging,
  isDragOver,
  isRenaming,
  renameText,
  onRenameTextChange,
  onCommitRename,
  onCancelRename,
  onStartRename,
  onSelect,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onDragEnd,
  onDemote,
  onOpenCreate,
}) => {
  const dept = slot.dept;

  return (
    <SidebarCardItem
      $isSelected={isSelected}
      $isEmpty={isEmpty}
      $isDragging={isDragging}
      $isDragOver={isDragOver}
      $accentColor={dept?.color || '#EF4444'}
      draggable={!isEmpty && !isRenaming}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDragLeave={onDragLeave}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onClick={onSelect}
      data-testid={`sidebar-dept-card-${slot.slotIndex}`}
    >
      <div className="card-top-row">
        <div className="slot-meta">
          <span className="slot-pill">FL-{String(slot.slotNumber).padStart(2, '0')}</span>
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
              onChange={e => onRenameTextChange(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') onCommitRename(e, dept._id);
                if (e.key === 'Escape') onCancelRename();
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
              onClick={e => onCommitRename(e, dept._id)}
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
                onCancelRename();
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
            onDoubleClick={e => dept && onStartRename(e, slot.slotIndex, dept.title)}
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
                onOpenCreate?.();
              }}
              title="Create Department for this slot"
            >
              <PlusCircle size={12} />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={e => dept && onStartRename(e, slot.slotIndex, dept.title)}
                title="Quick Rename Department"
                data-testid={`sidebar-edit-dept-${slot.slotIndex}`}
              >
                <Edit2 size={12} />
              </button>
              <button
                type="button"
                onClick={onDemote}
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
};
