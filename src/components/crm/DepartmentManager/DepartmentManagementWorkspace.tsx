import React, { FC, useState, useEffect } from 'react';
import { Search, Plus, AlertCircle, Layers, Building2, GitFork } from 'lucide-react';
import { useDepartmentManagementWorkspaceLogic } from './DepartmentManagementWorkspace.logic';
import { DepartmentSubItemsModal } from './DepartmentSubItemsModal';
import { DepartmentEditDrawer } from './DepartmentEditDrawer';
import { UnassignedSubDeptsPoolDeck } from './UnassignedSubDeptsPoolDeck';
import { SelectedDepartmentSquadsDeck } from './SelectedDepartmentSquadsDeck';
import { DepartmentStatsDeck } from './DepartmentStatsDeck';
import { DepartmentGridDeck } from './DepartmentGridDeck';
import { DepartmentHierarchyView } from './DepartmentHierarchyView';
import {
  WorkspaceContainer,
  WorkspaceHeader,
  ActionBar,
} from './DepartmentManagementWorkspace.styles';

export interface DepartmentManagementWorkspaceProps {
  initialViewMode?: 'squads' | 'grid' | 'hierarchy';
  selectedDeptId?: string;
  isReadOnly?: boolean;
}

export const DepartmentManagementWorkspace: FC<DepartmentManagementWorkspaceProps> = ({
  initialViewMode = 'grid',
  selectedDeptId,
  isReadOnly = false,
}) => {
  const [viewMode, setViewMode] = useState<'squads' | 'grid' | 'hierarchy'>(initialViewMode);

  const {
    slots,
    departments,
    filteredDepartments,
    selectedSlotIndex,
    activeSlot,
    activeDepartment,
    activeSubDepts,
    unassignedPool,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    isFormOpen,
    editingNodeId,
    formData,
    isSubmitting,
    selectedDeptForModal,
    draggedDeptIndex,
    dragOverDeptIndex,
    draggedSubIndex,
    dragOverSubIndex,
    metrics,
    selectSlot,
    handleOpenCreate,
    handleOpenEdit,
    handleCloseForm,
    handleFormChange,
    handleSubmit,
    handleDelete,
    handlePromoteSubDept,
    handleOpenSubItems,
    handleCloseSubItems,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    handleDragEnd,
    handleDropOnPool,
    handleSubDragStart,
    handleSubDragOver,
    handleSubDragLeave,
    handleSubDrop,
    handleSubDragEnd,
    handleDemoteSubDept,
  } = useDepartmentManagementWorkspaceLogic();

  useEffect(() => {
    if (!selectedDeptId || departments.length === 0) return;
    const cleanId = selectedDeptId.toUpperCase();
    const targetDept = departments.find(
      d =>
        d._id?.toUpperCase() === cleanId ||
        d.code?.toUpperCase() === cleanId ||
        d.slug?.toUpperCase() === cleanId ||
        `D${d.order}`.padStart(3, '0').toUpperCase() === cleanId ||
        `D${d.order}` === cleanId
    );
    if (targetDept) {
      handleOpenSubItems(targetDept);
    }
  }, [selectedDeptId, departments, handleOpenSubItems]);

  return (
    <WorkspaceContainer data-testid="department-management-workspace">
      {/* ── 1. Top Section Header ────────────────────────────────────────── */}
      <WorkspaceHeader>
        <div className="header-left">
          <span className="tag">Corporate Architecture · 1-12-108 Protocol</span>
          <h1>Corporate Departments Management</h1>
          <p>
            Directly configure and manage White Caves 12 corporate departments, sub-departments,
            operational squads, and personnel allocations.
          </p>
        </div>
      </WorkspaceHeader>

      {/* ── 2. Statistics Deck ───────────────────────────────────────────── */}
      <DepartmentStatsDeck metrics={metrics} />

      {/* ── Error Banner ─────────────────────────────────────────────────── */}
      {error && (
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
          <span>{error}</span>
        </div>
      )}

      {/* ── 3. In-Workspace Create/Edit Drawer Card ──────────────────────── */}
      <DepartmentEditDrawer
        isOpen={isFormOpen}
        editingNodeId={editingNodeId}
        formData={formData}
        isSubmitting={isSubmitting}
        onClose={handleCloseForm}
        onFormChange={handleFormChange}
        onSubmit={handleSubmit}
      />

      {/* ── 4. Action Bar with View Mode Selector & Search ────────────────── */}
      <ActionBar>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <button
            type="button"
            onClick={() => setViewMode('squads')}
            data-testid="viewmode-squads-btn"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border:
                viewMode === 'squads' ? '1px solid #3B82F6' : '1px solid rgba(255,255,255,0.1)',
              background: viewMode === 'squads' ? 'rgba(59, 130, 246, 0.18)' : 'transparent',
              color: viewMode === 'squads' ? '#60A5FA' : '#94A3B8',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Layers size={14} />
            <span>9 Sub-Depts (Focus)</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('grid')}
            data-testid="viewmode-grid-btn"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border: viewMode === 'grid' ? '1px solid #EF4444' : '1px solid rgba(255,255,255,0.1)',
              background: viewMode === 'grid' ? 'rgba(239, 68, 68, 0.18)' : 'transparent',
              color: viewMode === 'grid' ? '#F87171' : '#94A3B8',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <Building2 size={14} />
            <span>12 Depts Grid</span>
          </button>

          <button
            type="button"
            onClick={() => setViewMode('hierarchy')}
            data-testid="viewmode-hierarchy-btn"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              border:
                viewMode === 'hierarchy' ? '1px solid #10B981' : '1px solid rgba(255,255,255,0.1)',
              background: viewMode === 'hierarchy' ? 'rgba(16, 185, 129, 0.18)' : 'transparent',
              color: viewMode === 'hierarchy' ? '#34D399' : '#94A3B8',
              fontSize: '0.78rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <GitFork size={14} />
            <span>3-Tier Bhakti Hierarchy</span>
          </button>
        </div>

        <div className="search-wrap">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search departments by code, title, or scope..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        {!isReadOnly && (
          <button className="add-btn" onClick={handleOpenCreate}>
            <Plus size={16} />
            Add Corporate Department
          </button>
        )}
      </ActionBar>

      {/* ── 5. Main Viewport Renderers ───────────────────────────────────── */}
      {viewMode === 'hierarchy' ? (
        <DepartmentHierarchyView />
      ) : (
        <>
          {viewMode === 'grid' && (
            <DepartmentGridDeck
              loading={loading}
              departments={departments}
              filteredDepartments={filteredDepartments}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              slots={slots}
              dragOverDeptIndex={dragOverDeptIndex}
              draggedDeptIndex={draggedDeptIndex}
              selectedSlotIndex={selectedSlotIndex}
              editingNodeId={editingNodeId}
              selectSlot={selectSlot}
              handleOpenSubItems={handleOpenSubItems}
              handleOpenEdit={handleOpenEdit}
              handleDelete={handleDelete}
              handleDragStart={handleDragStart}
              handleDragOver={handleDragOver}
              handleDragLeave={handleDragLeave}
              handleDrop={handleDrop}
              handleDragEnd={handleDragEnd}
            />
          )}

          {activeDepartment && (
            <SelectedDepartmentSquadsDeck
              activeSlot={activeSlot}
              activeDepartment={activeDepartment}
              activeSubDepts={activeSubDepts}
              dragOverSubIndex={dragOverSubIndex}
              draggedSubIndex={draggedSubIndex}
              onOpenEdit={handleOpenEdit}
              onDeleteDept={handleDelete}
              onSubDragStart={handleSubDragStart}
              onSubDragOver={handleSubDragOver}
              onSubDragLeave={handleSubDragLeave}
              onSubDrop={handleSubDrop}
              onSubDragEnd={handleSubDragEnd}
              onDemoteSubDept={handleDemoteSubDept}
            />
          )}

          <UnassignedSubDeptsPoolDeck
            unassignedPool={unassignedPool}
            onPromoteSubDept={handlePromoteSubDept}
            onDropOnPool={handleDropOnPool}
          />
        </>
      )}

      {/* ── 6. Department 9 Sub-Items (Squads) Modal ───────────────────────── */}
      <DepartmentSubItemsModal
        isOpen={Boolean(selectedDeptForModal)}
        onClose={handleCloseSubItems}
        department={selectedDeptForModal}
        isReadOnly={isReadOnly}
      />
    </WorkspaceContainer>
  );
};

export default DepartmentManagementWorkspace;
