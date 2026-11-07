import React, { FC, useState } from 'react';
import {
  GripVertical,
  Briefcase,
  Eye,
  Edit2,
  Trash2,
  Layers,
  Shield,
  Users,
  Check,
  X,
  UserCheck,
} from 'lucide-react';
import type { DepartmentNodeItem } from './DepartmentManager.types';
import type { DepartmentSlotDef } from './DepartmentManager.data';
import { DepartmentEmptySlotsGrid } from './DepartmentEmptySlotsGrid';
import { DepartmentsGrid, DepartmentCard } from './DepartmentManagementWorkspace.styles';

export interface DepartmentGridDeckProps {
  loading: boolean;
  departments: DepartmentNodeItem[];
  filteredDepartments: DepartmentNodeItem[];
  searchTerm: string;
  setSearchTerm: (s: string) => void;
  slots: DepartmentSlotDef[];
  dragOverDeptIndex: number | null;
  draggedDeptIndex: number | null;
  selectedSlotIndex: number;
  editingNodeId: string | null;
  selectSlot: (idx: number) => void;
  handleOpenSubItems: (dept: DepartmentNodeItem) => void;
  handleOpenEdit: (dept: DepartmentNodeItem) => void;
  handleDelete: (deptId: string) => void;
  handleInlineRename?: (deptId: string, newTitle: string) => void;
  handleDragStart: (e: React.DragEvent, idx: number) => void;
  handleDragOver: (e: React.DragEvent, idx: number) => void;
  handleDragLeave: (e: React.DragEvent, idx: number) => void;
  handleDrop: (e: React.DragEvent, idx: number) => void;
  handleDragEnd: () => void;
}

export const DepartmentGridDeck: FC<DepartmentGridDeckProps> = ({
  loading,
  departments,
  filteredDepartments,
  searchTerm,
  setSearchTerm,
  slots,
  dragOverDeptIndex,
  draggedDeptIndex,
  selectedSlotIndex,
  editingNodeId,
  selectSlot,
  handleOpenSubItems,
  handleOpenEdit,
  handleDelete,
  handleInlineRename,
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleDragEnd,
}) => {
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState<string>('');

  const startQuickRename = (e: React.MouseEvent, dept: DepartmentNodeItem) => {
    e.stopPropagation();
    setRenamingId(dept._id);
    setRenameValue(dept.title);
  };

  const commitQuickRename = (e: React.MouseEvent | React.KeyboardEvent, deptId: string) => {
    e.stopPropagation();
    if (renameValue.trim() && handleInlineRename) handleInlineRename(deptId, renameValue.trim());
    setRenamingId(null);
  };

  if (loading && departments.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
        Loading corporate department nodes...
      </div>
    );
  }

  if (departments.length > 0 && filteredDepartments.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: '#64748B' }}>
        <p style={{ margin: '0 0 12px 0' }}>
          No corporate departments found matching &ldquo;{searchTerm}&rdquo;.
        </p>
        {searchTerm && (
          <button
            type="button"
            onClick={() => setSearchTerm('')}
            style={{
              padding: '6px 14px',
              background: '#EF4444',
              color: '#FFFFFF',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: '0.8rem',
            }}
          >
            Clear Search Filter
          </button>
        )}
      </div>
    );
  }

  if (departments.length === 0) {
    return (
      <DepartmentEmptySlotsGrid
        slots={slots}
        dragOverDeptIndex={dragOverDeptIndex}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      />
    );
  }

  return (
    <DepartmentsGrid>
      {filteredDepartments.map((dept, idx) => {
        const isInlineRenaming = renamingId === dept._id;
        return (
          <DepartmentCard
            key={dept._id}
            $color={dept.color}
            $isEditing={editingNodeId === dept._id || isInlineRenaming}
            $isDragging={draggedDeptIndex === idx}
            $isDragOver={dragOverDeptIndex === idx}
            draggable={!isInlineRenaming}
            onDragStart={e => handleDragStart(e, idx)}
            onDragOver={e => handleDragOver(e, idx)}
            onDragLeave={e => handleDragLeave(e, idx)}
            onDrop={e => handleDrop(e, idx)}
            onDragEnd={handleDragEnd}
            data-testid={`dept-card-${dept.slug}`}
            onClick={() => {
              if (!isInlineRenaming) {
                selectSlot(idx);
                handleOpenSubItems(dept);
              }
            }}
            style={{
              cursor: 'pointer',
              borderColor: selectedSlotIndex === idx ? '#EF4444' : undefined,
            }}
          >
            <div className="card-top">
              <div className="title-group" style={{ flex: 1, minWidth: 0 }}>
                <div
                  className="drag-handle"
                  title="Drag and drop to shuffle department positions"
                  data-testid={`dept-drag-handle-${dept.slug}`}
                >
                  <GripVertical size={16} />
                </div>
                <div className="icon-box">
                  <Briefcase size={18} />
                </div>
                <div className="info" style={{ flex: 1, minWidth: 0 }}>
                  <div className="code-row">
                    <span className="code">
                      {dept.code || `DEPT-${String(idx + 1).padStart(2, '0')}`}
                    </span>
                    <span className="order-pill">#{idx + 1}</span>
                  </div>

                  {isInlineRenaming ? (
                    <div
                      onClick={e => e.stopPropagation()}
                      style={{ display: 'flex', alignItems: 'center', gap: '4px', marginTop: '4px' }}
                    >
                      <input
                        type="text"
                        value={renameValue}
                        onChange={e => setRenameValue(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === 'Enter') commitQuickRename(e, dept._id);
                          if (e.key === 'Escape') setRenamingId(null);
                        }}
                        autoFocus
                        data-testid={`dept-inline-rename-input-${dept.slug}`}
                        style={{
                          flex: 1,
                          background: '#0F172A',
                          border: '1px solid #EF4444',
                          borderRadius: '5px',
                          padding: '4px 8px',
                          color: '#FFFFFF',
                          fontSize: '0.82rem',
                          fontWeight: 700,
                          outline: 'none',
                        }}
                      />
                      <button
                        type="button"
                        onClick={e => commitQuickRename(e, dept._id)}
                        title="Save Name"
                        data-testid={`dept-inline-rename-save-${dept.slug}`}
                        style={{ background: '#10B981', color: '#FFFFFF', border: 'none', borderRadius: '4px', padding: '4px 6px', cursor: 'pointer' }}
                      >
                        <Check size={13} />
                      </button>
                      <button
                        type="button"
                        onClick={e => {
                          e.stopPropagation();
                          setRenamingId(null);
                        }}
                        title="Cancel"
                        style={{ background: 'rgba(255,255,255,0.1)', color: '#94A3B8', border: 'none', borderRadius: '4px', padding: '4px 6px', cursor: 'pointer' }}
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ) : (
                    <h3 onDoubleClick={e => startQuickRename(e, dept)} title="Double-click to quick-rename department">
                      {dept.title}
                    </h3>
                  )}
                </div>
              </div>

              <div className="card-actions">
                {handleInlineRename && !isInlineRenaming && (
                  <button
                    type="button"
                    onClick={e => startQuickRename(e, dept)}
                    title="Quick Rename Department Name"
                    data-testid={`dept-quick-rename-btn-${dept.slug}`}
                    style={{ fontSize: '0.66rem', fontWeight: 700, color: '#60A5FA', padding: '3px 6px', border: '1px solid rgba(59, 130, 246, 0.3)', borderRadius: '5px' }}
                  >
                    Rename
                  </button>
                )}
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    selectSlot(idx);
                    handleOpenSubItems(dept);
                  }}
                  title="View 9 Operational Squads"
                  data-testid={`dept-view-btn-${dept.slug}`}
                >
                  <Eye size={15} />
                </button>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleOpenEdit(dept);
                  }}
                  title="Edit Full Department Details"
                  data-testid={`dept-edit-btn-${dept.slug}`}
                >
                  <Edit2 size={15} />
                </button>
                <button
                  type="button"
                  onClick={e => {
                    e.stopPropagation();
                    handleDelete(dept._id);
                  }}
                  title="Demote to Sub-Department"
                  data-testid={`dept-delete-btn-${dept.slug}`}
                >
                  <Trash2 size={15} />
                </button>
              </div>
            </div>

            {dept.directorOrManagerId?.fullName && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontSize: '0.73rem',
                  color: '#CBD5E1',
                  background: 'rgba(255, 255, 255, 0.03)',
                  padding: '5px 8px',
                  borderRadius: '6px',
                }}
              >
                <UserCheck size={13} color={dept.color || '#EF4444'} />
                <span>
                  Lead: <strong>{dept.directorOrManagerId.fullName}</strong>
                </span>
              </div>
            )}

            {dept.description && <div className="description">{dept.description}</div>}

            <div className="card-footer">
              <div className="metrics-pills">
                <span>
                  <Layers size={13} color="#3B82F6" /> {dept.subDeptsCount || 9} Sub-Depts
                </span>
                <span>
                  <Shield size={13} color="#10B981" /> {dept.squadsCount || 0} Squads
                </span>
                <span>
                  <Users size={13} color="#F59E0B" /> {dept.headcount || 0} Personnel
                </span>
              </div>

              <button
                type="button"
                className="view-squads-btn"
                onClick={e => {
                  e.stopPropagation();
                  selectSlot(idx);
                  handleOpenSubItems(dept);
                }}
                data-testid={`dept-squads-btn-${dept.slug}`}
                title="View 9 Squads Modal"
              >
                <Eye size={12} />
                <span>View 9 Squads</span>
              </button>
            </div>
          </DepartmentCard>
        );
      })}
    </DepartmentsGrid>
  );
};
