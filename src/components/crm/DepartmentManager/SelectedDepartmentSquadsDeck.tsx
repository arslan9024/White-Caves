import React, { FC } from 'react';
import { Edit2, Trash2, GripVertical } from 'lucide-react';
import type { DepartmentNodeItem } from './DepartmentManager.types';
import type { DepartmentSlotDef } from './DepartmentManager.data';
import type { SupervisorDef } from '../../../data/assistants108Registry.data';

export interface SelectedDepartmentSquadsDeckProps {
  activeSlot: DepartmentSlotDef;
  activeDepartment: DepartmentNodeItem;
  activeSubDepts: SupervisorDef[];
  dragOverSubIndex: number | null;
  draggedSubIndex: number | null;
  onOpenEdit: (dept: DepartmentNodeItem) => void;
  onDeleteDept: (deptId: string) => void;
  onSubDragStart: (e: React.DragEvent, subIndex: number) => void;
  onSubDragOver: (e: React.DragEvent, subIndex: number) => void;
  onSubDragLeave: (e: React.DragEvent, subIndex: number) => void;
  onSubDrop: (e: React.DragEvent, targetSubIndex: number) => void;
  onSubDragEnd: () => void;
  onDemoteSubDept: (subIndex: number) => void;
}

export const SelectedDepartmentSquadsDeck: FC<SelectedDepartmentSquadsDeckProps> = ({
  activeSlot,
  activeDepartment,
  activeSubDepts,
  dragOverSubIndex,
  draggedSubIndex,
  onOpenEdit,
  onDeleteDept,
  onSubDragStart,
  onSubDragOver,
  onSubDragLeave,
  onSubDrop,
  onSubDragEnd,
  onDemoteSubDept,
}) => {
  return (
    <div
      data-testid="selected-dept-squads-section"
      style={{
        marginTop: '16px',
        background: 'rgba(255, 255, 255, 0.015)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
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
          gap: '10px',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontSize: '0.68rem',
                fontWeight: 800,
                color: '#EF4444',
                textTransform: 'uppercase',
              }}
            >
              Slot #{activeSlot.slotNumber} · {activeSlot.fixedCode}
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#3B82F6',
                padding: '2px 8px',
                borderRadius: '4px',
                fontWeight: 700,
              }}
            >
              Active Focus
            </span>
          </div>
          <h2
            style={{ margin: '4px 0 0 0', fontSize: '1.2rem', fontWeight: 800, color: '#FFFFFF' }}
          >
            Operational Squads & Sub-Departments
          </h2>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#94A3B8' }}>
            Direct command grid under active focus. Drag and drop squad cards to shuffle priorities.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button
            type="button"
            onClick={() => onOpenEdit(activeDepartment)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              color: '#FFFFFF',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Edit2 size={13} /> Edit Dept
          </button>
          <button
            type="button"
            onClick={() => onDeleteDept(activeDepartment._id)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 12px',
              borderRadius: '6px',
              background: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid #EF4444',
              color: '#EF4444',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <Trash2 size={13} /> Demote to Pool
          </button>
        </div>
      </div>

      {/* 9 Sub-Department Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '12px',
        }}
      >
        {activeSubDepts.map((sub, sIdx) => (
          <div
            key={sub.id || `sub-${sIdx}`}
            draggable={true}
            onDragStart={e => onSubDragStart(e, sIdx)}
            onDragOver={e => onSubDragOver(e, sIdx)}
            onDragLeave={e => onSubDragLeave(e, sIdx)}
            onDrop={e => onSubDrop(e, sIdx)}
            onDragEnd={onSubDragEnd}
            style={{
              background: 'rgba(255, 255, 255, 0.025)',
              border:
                dragOverSubIndex === sIdx
                  ? '1.5px solid #3B82F6'
                  : '1px solid rgba(255, 255, 255, 0.08)',
              borderLeft: '3px solid #EF4444',
              borderRadius: '8px',
              padding: '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              cursor: 'grab',
              opacity: draggedSubIndex === sIdx ? 0.4 : 1,
              transition: 'all 0.15s ease',
            }}
            data-testid={`subitem-slot-${sIdx + 1}`}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ color: '#64748B' }}>
                  <GripVertical size={14} />
                </div>
                <span
                  style={{
                    fontSize: '0.66rem',
                    fontWeight: 800,
                    color: '#EF4444',
                    background: 'rgba(239, 68, 68, 0.12)',
                    padding: '1px 5px',
                    borderRadius: '4px',
                    fontFamily: 'monospace',
                  }}
                >
                  Squad #{sIdx + 1}
                </span>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 700,
                    color: '#94A3B8',
                    fontFamily: 'monospace',
                  }}
                >
                  SQ-{String(sIdx + 1).padStart(2, '0')}
                </span>
              </div>
              <button
                type="button"
                onClick={() => onDemoteSubDept(sIdx)}
                title="Demote Squad to Pool"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer',
                  padding: '2px',
                }}
              >
                <Trash2 size={12} />
              </button>
            </div>

            <div>
              <h4 style={{ margin: 0, fontSize: '0.82rem', fontWeight: 800, color: '#FFFFFF' }}>
                {sub.name}
              </h4>
              <div style={{ fontSize: '0.72rem', color: '#F59E0B', fontWeight: 600 }}>
                {sub.title}
              </div>
            </div>

            <div style={{ fontSize: '0.7rem', color: '#94A3B8', lineHeight: 1.3 }}>
              {sub.specialty}
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                fontSize: '0.65rem',
                color: '#64748B',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                paddingTop: '6px',
              }}
            >
              <span>SLA: {sub.slaResponseTime || '< 15 mins'}</span>
              <span style={{ color: '#10B981', fontWeight: 700 }}>● OPTIMAL</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
