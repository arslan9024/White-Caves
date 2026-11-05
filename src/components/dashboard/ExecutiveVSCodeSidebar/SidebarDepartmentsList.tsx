import React, { FC } from 'react';
import { GripVertical, Building2, Layers, Edit2, Trash2, PlusCircle } from 'lucide-react';
import { useCorporateDepartments } from '../../../context/CorporateDepartmentsContext';
import { SidebarListWrapper, SidebarCardItem } from './SidebarDepartmentsList.styles';

interface SidebarDepartmentsListProps {
  filterQuery?: string;
  onOpenCreate?: () => void;
}

export const SidebarDepartmentsList: FC<SidebarDepartmentsListProps> = ({
  filterQuery = '',
  onOpenCreate,
}) => {
  const {
    slots,
    selectedSlotIndex,
    draggedSlotIndex,
    dragOverSlotIndex,
    selectSlot,
    handleSlotDragStart,
    handleSlotDragOver,
    handleSlotDragLeave,
    handleSlotDrop,
    handleSlotDragEnd,
    handleDemoteDepartment,
    handleOpenEdit,
  } = useCorporateDepartments();

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
      {visibleSlots.map(slot => {
        const isSelected = selectedSlotIndex === slot.slotIndex;
        const isEmpty = !slot.dept;
        const isDragging = draggedSlotIndex === slot.slotIndex;
        const isDragOver = dragOverSlotIndex === slot.slotIndex;
        const dept = slot.dept;

        return (
          <SidebarCardItem
            key={`slot-${slot.slotIndex}`}
            $isSelected={isSelected}
            $isEmpty={isEmpty}
            $isDragging={isDragging}
            $isDragOver={isDragOver}
            $accentColor={dept?.color || '#EF4444'}
            draggable={!isEmpty}
            onDragStart={e => !isEmpty && handleSlotDragStart(e, slot.slotIndex)}
            onDragOver={e => handleSlotDragOver(e, slot.slotIndex)}
            onDragLeave={e => handleSlotDragLeave(e, slot.slotIndex)}
            onDrop={e => handleSlotDrop(e, slot.slotIndex)}
            onDragEnd={handleSlotDragEnd}
            onClick={() => selectSlot(slot.slotIndex)}
            data-testid={`sidebar-dept-card-${slot.slotIndex}`}
          >
            {/* Top row: Slot pill, fixed code, drag handle */}
            <div className="card-top-row">
              <div className="slot-meta">
                <span className="slot-pill">#{slot.slotNumber}</span>
                <span className="slot-code">{slot.fixedCode}</span>
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

            {/* Title row */}
            <div className="card-title-row">
              <div className="icon-box">
                <Building2 size={14} />
              </div>
              <h4>{isEmpty ? `Empty Slot #${slot.slotNumber}` : dept?.title}</h4>
            </div>

            {/* Bottom row: status & actions */}
            <div className="card-bottom-row">
              {isEmpty ? (
                <span style={{ fontStyle: 'italic', color: '#64748B' }}>
                  Drop squad here to assign
                </span>
              ) : (
                <span className="squad-count">
                  <Layers size={11} color="#3B82F6" />
                  <span>{dept?.subDeptsCount || 9} Squads</span>
                </span>
              )}

              <div className="card-actions">
                {isEmpty ? (
                  onOpenCreate && (
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        onOpenCreate();
                      }}
                      title="Create Department for this slot"
                    >
                      <PlusCircle size={12} />
                    </button>
                  )
                ) : (
                  <>
                    <button
                      type="button"
                      onClick={e => {
                        e.stopPropagation();
                        if (dept) handleOpenEdit(dept);
                      }}
                      title="Edit Department"
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
