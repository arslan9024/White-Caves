import React, { FC } from 'react';
import { Building2 } from 'lucide-react';
import type { DepartmentSlotDef } from './DepartmentManager.data';
import { DepartmentsGrid, DepartmentCard } from './DepartmentManagementWorkspace.styles';

export interface DepartmentEmptySlotsGridProps {
  slots: DepartmentSlotDef[];
  dragOverDeptIndex: number | null;
  onDragOver: (e: React.DragEvent, idx: number) => void;
  onDragLeave: (e: React.DragEvent, idx: number) => void;
  onDrop: (e: React.DragEvent, idx: number) => void;
}

export const DepartmentEmptySlotsGrid: FC<DepartmentEmptySlotsGridProps> = ({
  slots,
  dragOverDeptIndex,
  onDragOver,
  onDragLeave,
  onDrop,
}) => {
  return (
    <DepartmentsGrid data-testid="empty-slots-grid">
      {slots.map((slot, idx) => (
        <DepartmentCard
          key={`empty-slot-${idx}`}
          $color="#64748B"
          $isDragOver={dragOverDeptIndex === idx}
          onDragOver={e => onDragOver(e, idx)}
          onDragLeave={e => onDragLeave(e, idx)}
          onDrop={e => onDrop(e, idx)}
          style={{
            borderStyle: 'dashed',
            background: 'rgba(255, 255, 255, 0.02)',
            cursor: 'pointer',
          }}
          data-testid={`dept-slot-${idx}`}
        >
          <div className="card-top">
            <div className="title-group">
              <div className="icon-box" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
                <Building2 size={18} color="#64748B" />
              </div>
              <div className="info">
                <div className="code-row">
                  <span className="code">{slot.fixedCode}</span>
                  <span className="order-pill">#{slot.slotNumber}</span>
                </div>
                <h3 style={{ color: '#94A3B8' }}>Empty Department Slot #{slot.slotNumber}</h3>
              </div>
            </div>
          </div>
          <div className="description" style={{ color: '#64748B', fontStyle: 'italic' }}>
            Drop any sub-department or squad from the Unassigned Pool below here to assign this
            slot.
          </div>
        </DepartmentCard>
      ))}
    </DepartmentsGrid>
  );
};
