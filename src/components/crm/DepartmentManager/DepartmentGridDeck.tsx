import React, { FC } from 'react';
import { GripVertical, Briefcase, Eye, Edit2, Trash2, Layers, Shield, Users } from 'lucide-react';
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
  handleDragStart,
  handleDragOver,
  handleDragLeave,
  handleDrop,
  handleDragEnd,
}) => {
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
      {filteredDepartments.map((dept, idx) => (
        <DepartmentCard
          key={dept._id}
          $color={dept.color}
          $isEditing={editingNodeId === dept._id}
          $isDragging={draggedDeptIndex === idx}
          $isDragOver={dragOverDeptIndex === idx}
          draggable={true}
          onDragStart={e => handleDragStart(e, idx)}
          onDragOver={e => handleDragOver(e, idx)}
          onDragLeave={e => handleDragLeave(e, idx)}
          onDrop={e => handleDrop(e, idx)}
          onDragEnd={handleDragEnd}
          data-testid={`dept-card-${dept.slug}`}
          onClick={() => {
            selectSlot(idx);
            handleOpenSubItems(dept);
          }}
          style={{
            cursor: 'pointer',
            borderColor: selectedSlotIndex === idx ? '#EF4444' : undefined,
          }}
        >
          <div className="card-top">
            <div className="title-group">
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
              <div className="info">
                <div className="code-row">
                  <span className="code">
                    {dept.code || `DEPT-${String(idx + 1).padStart(2, '0')}`}
                  </span>
                  <span className="order-pill">#{idx + 1}</span>
                </div>
                <h3>{dept.title}</h3>
              </div>
            </div>

            <div className="card-actions">
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
                title="Edit Department Details"
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
                title="Demote to Sub-Department (Moves to Unassigned Pool)"
                data-testid={`dept-delete-btn-${dept.slug}`}
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>

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
      ))}
    </DepartmentsGrid>
  );
};
