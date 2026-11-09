/**
 * DepartmentManagementWorkspace.tsx
 * White Caves Real Estate LLC - Corporate Departments Management Workspace (12-Slot CRUD)
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Workspace Orchestrator)
 * Single Purpose File Law: < 350 lines (Modularized under AEG-042)
 */

import React, { FC, useState, useEffect } from 'react';
import { AlertCircle, ArrowLeft, RotateCcw } from 'lucide-react';
import { useDepartmentManagementWorkspaceLogic } from './DepartmentManagementWorkspace.logic';
import { DepartmentSubItemsModal } from './DepartmentSubItemsModal';
import { DepartmentEditDrawer } from './DepartmentEditDrawer';
import { UnassignedSubDeptsPoolDeck } from './UnassignedSubDeptsPoolDeck';
import { SelectedDepartmentSquadsDeck } from './SelectedDepartmentSquadsDeck';
import { DepartmentStatsDeck } from './DepartmentStatsDeck';
import { DepartmentGridDeck } from './DepartmentGridDeck';
import { DepartmentFinalizerTable } from './DepartmentFinalizerTable';
import { DepartmentQuickPasteBar } from './DepartmentQuickPasteBar';
import { DepartmentHierarchyView } from './DepartmentHierarchyView';
import { DepartmentWorkspaceActionBar } from './DepartmentWorkspaceActionBar';
import { WorkspaceContainer, WorkspaceHeader } from './DepartmentManagementWorkspace.styles';

export type DepartmentWorkspaceViewMode = 'grid' | 'finalizer' | 'squads' | 'hierarchy';

export interface DepartmentManagementWorkspaceProps {
  initialViewMode?: DepartmentWorkspaceViewMode;
  selectedDeptId?: string;
  isReadOnly?: boolean;
  onNavigateBack?: () => void;
  onSelectDept?: (code: string) => void;
}

export const DepartmentManagementWorkspace: FC<DepartmentManagementWorkspaceProps> = ({
  initialViewMode = 'grid',
  selectedDeptId,
  isReadOnly = false,
  onNavigateBack,
  onSelectDept,
}) => {
  const [viewMode, setViewMode] = useState<DepartmentWorkspaceViewMode>(initialViewMode);
  const logic = useDepartmentManagementWorkspaceLogic();

  useEffect(() => {
    if (!selectedDeptId || logic.departments.length === 0) return;
    const cleanId = selectedDeptId.toUpperCase();
    const targetSlotIndex = logic.slots.findIndex(s => {
      const d = s.dept;
      return (
        d?._id?.toUpperCase() === cleanId ||
        d?.code?.toUpperCase() === cleanId ||
        d?.slug?.toUpperCase() === cleanId ||
        s.fixedCode?.toUpperCase() === cleanId ||
        `D${s.slotNumber}`.toUpperCase() === cleanId ||
        `DEPT-${String(s.slotNumber).padStart(2, '0')}`.toUpperCase() === cleanId
      );
    });
    if (targetSlotIndex !== -1 && targetSlotIndex !== logic.selectedSlotIndex) {
      logic.selectSlot(targetSlotIndex);
    }
  }, [selectedDeptId, logic]);

  const renderSquadsAndPool = () => (
    <>
      {logic.activeDepartment && (
        <SelectedDepartmentSquadsDeck
          activeSlot={logic.activeSlot}
          activeDepartment={logic.activeDepartment}
          activeSubDepts={logic.activeSubDepts}
          dragOverSubIndex={logic.dragOverSubIndex}
          draggedSubIndex={logic.draggedSubIndex}
          onOpenEdit={logic.handleOpenEdit}
          onDeleteDept={logic.handleDelete}
          onSubDragStart={logic.handleSubDragStart}
          onSubDragOver={logic.handleSubDragOver}
          onSubDragLeave={logic.handleSubDragLeave}
          onSubDrop={logic.handleSubDrop}
          onSubDragEnd={logic.handleSubDragEnd}
          onDemoteSubDept={logic.handleDemoteSubDept}
        />
      )}
      <UnassignedSubDeptsPoolDeck
        unassignedPool={logic.unassignedPool}
        onPromoteSubDept={logic.handlePromoteSubDept}
        onDropOnPool={logic.handleDropOnPool}
      />
    </>
  );

  return (
    <WorkspaceContainer data-testid="department-management-workspace">
      <WorkspaceHeader>
        <div className="header-left">
          <span className="tag">Corporate Architecture · 1-12-108 Protocol</span>
          <h1>Corporate Departments Management</h1>
          <p>
            Directly configure, rename, and finalize White Caves 12 corporate departments,
            sub-departments, operational squads, and personnel allocations.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            data-testid="active-slots-counter-pill"
            style={{
              fontSize: '0.75rem',
              fontWeight: 800,
              color: '#F87171',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              padding: '6px 12px',
              borderRadius: '8px',
            }}
          >
            {logic.departments.length} / 12 Corporate Slots Filled
          </span>
          {!isReadOnly && (
            <button
              type="button"
              onClick={logic.handleResetDefaults}
              data-testid="reset-canonical-12-btn"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#94A3B8',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              <RotateCcw size={13} />
              <span>Reset 12 Defaults</span>
            </button>
          )}
        </div>
      </WorkspaceHeader>

      {logic.error && (
        <div
          style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid #EF4444',
            borderRadius: '8px',
            padding: '10px 14px',
            color: '#EF4444',
            fontSize: '0.82rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <AlertCircle size={16} />
          <span>{logic.error}</span>
        </div>
      )}

      <DepartmentEditDrawer
        isOpen={logic.isFormOpen}
        editingNodeId={logic.editingNodeId}
        formData={logic.formData}
        isSubmitting={logic.isSubmitting}
        onClose={logic.handleCloseForm}
        onFormChange={logic.handleFormChange}
        onSubmit={logic.handleSubmit}
      />

      {selectedDeptId ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }} data-testid="department-detail-main-view">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '12px 16px',
              background: 'rgba(239, 68, 68, 0.08)',
              borderRadius: '12px',
              border: '1px solid rgba(239, 68, 68, 0.25)',
            }}
          >
            <button
              type="button"
              onClick={onNavigateBack}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 14px',
                borderRadius: '8px',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid #EF4444',
                color: '#F87171',
                fontWeight: 700,
                fontSize: '0.8rem',
                cursor: 'pointer',
              }}
              data-testid="dept-back-to-slots-btn"
            >
              <ArrowLeft size={15} />
              <span>← Back to All Corporate Slots</span>
            </button>
            <span
              style={{
                fontSize: '0.72rem',
                background: 'rgba(59, 130, 246, 0.15)',
                color: '#60A5FA',
                padding: '3px 10px',
                borderRadius: '6px',
                fontWeight: 800,
              }}
            >
              {logic.activeDepartment?.code || selectedDeptId} · 9 Operational Squads
            </span>
          </div>
          {renderSquadsAndPool()}
        </div>
      ) : (
        <>
          <DepartmentStatsDeck metrics={logic.metrics} />

          <DepartmentWorkspaceActionBar
            viewMode={viewMode}
            setViewMode={setViewMode}
            searchTerm={logic.searchTerm}
            setSearchTerm={logic.setSearchTerm}
            isReadOnly={isReadOnly}
            onOpenCreate={logic.handleOpenCreate}
          />

          {viewMode === 'hierarchy' ? (
            <DepartmentHierarchyView />
          ) : viewMode === 'finalizer' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {!isReadOnly && (
                <DepartmentQuickPasteBar
                  slots={logic.slots}
                  departments={logic.departments}
                  onBatchSaveAll={logic.handleBatchSaveAll}
                  onImportDepartments={logic.handleImportDepartments}
                />
              )}
              <DepartmentFinalizerTable
                slots={logic.slots}
                isReadOnly={isReadOnly}
                onInlineRename={logic.handleInlineRename}
                onBatchSaveAll={logic.handleBatchSaveAll}
                onMoveDepartment={logic.handleMoveDepartment}
                onOpenEdit={logic.handleOpenEdit}
                onOpenCreateForSlot={logic.handleOpenCreate}
                onDelete={logic.handleDelete}
                onResetDefaults={logic.handleResetDefaults}
              />
            </div>
          ) : (
            <>
              {viewMode === 'grid' && (
                <DepartmentGridDeck
                  loading={logic.loading}
                  departments={logic.departments}
                  filteredDepartments={logic.filteredDepartments}
                  searchTerm={logic.searchTerm}
                  setSearchTerm={logic.setSearchTerm}
                  slots={logic.slots}
                  dragOverDeptIndex={logic.dragOverDeptIndex}
                  draggedDeptIndex={logic.draggedDeptIndex}
                  selectedSlotIndex={logic.selectedSlotIndex}
                  editingNodeId={logic.editingNodeId}
                  selectSlot={logic.selectSlot}
                  handleOpenSubItems={dept =>
                    onSelectDept
                      ? onSelectDept(dept.code || dept.slug || dept._id)
                      : logic.handleOpenSubItems(dept)
                  }
                  handleOpenEdit={logic.handleOpenEdit}
                  handleDelete={logic.handleDelete}
                  handleInlineRename={!isReadOnly ? logic.handleInlineRename : undefined}
                  handleDragStart={logic.handleDragStart}
                  handleDragOver={logic.handleDragOver}
                  handleDragLeave={logic.handleDragLeave}
                  handleDrop={logic.handleDrop}
                  handleDragEnd={logic.handleDragEnd}
                />
              )}
              {renderSquadsAndPool()}
            </>
          )}
        </>
      )}

      <DepartmentSubItemsModal
        isOpen={Boolean(logic.selectedDeptForModal)}
        onClose={logic.handleCloseSubItems}
        department={logic.selectedDeptForModal}
        isReadOnly={isReadOnly}
      />
    </WorkspaceContainer>
  );
};

export default DepartmentManagementWorkspace;
