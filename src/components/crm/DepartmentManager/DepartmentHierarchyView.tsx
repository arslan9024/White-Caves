/**
 * DepartmentHierarchyView.tsx
 * 7-Category Architecture: Pure View Layer
 * 3-Tier Bhakti Protocol Organization Hierarchy View (12 Directors -> 9 Managers -> Teams)
 */

import React from 'react';
import { hierarchyStyles as s } from './DepartmentHierarchy.styles';
import { useDepartmentHierarchy } from './DepartmentHierarchy.logic';
import { HierarchyCrudDrawer } from './HierarchyCrudDrawer';

export const DepartmentHierarchyView: React.FC = () => {
  const {
    hierarchyState,
    activeTier,
    selectedDeptId,
    selectedManagerId,
    searchQuery,
    setSearchQuery,
    statusMessage,
    draggedSlot,
    isDrawerOpen,
    editingTier,
    editingNode,
    filteredDirectors,
    activeDepartment,
    activeManagers,
    activeManager,
    activeTeams,
    navigateToDirectors,
    handleSelectDepartment,
    handleSelectManager,
    handleDemoteEntity,
    handleDragStart,
    handleDragStartPool,
    handleDropOnDirectorSlot,
    handleDropOnManagerSlot,
    handleOpenEdit,
    handleCloseDrawer,
    handleSaveEdit,
  } = useDepartmentHierarchy();

  return (
    <div className={s.container} data-testid="department-hierarchy-view">
      {/* Top Header & Breadcrumb Trail */}
      <div className={s.headerContainer}>
        <div className={s.titleRow}>
          <div className={s.titleIconBadge}>🏛️</div>
          <div>
            <h1 className={s.title}>
              Departments Hub Hierarchy
              <span className={`${s.tierBadge} ${s.tierL1}`}>Bhakti Protocol</span>
            </h1>
            <p className={s.subtitle}>
              12 Corporate Directors → 9 Division Task Domains → Teams & Supervisors Core
            </p>
          </div>
        </div>

        {/* 3-Tier Navigation Breadcrumbs */}
        <div className={s.breadcrumbTrail} data-testid="hierarchy-breadcrumbs">
          <button
            onClick={navigateToDirectors}
            className={`${s.breadcrumbItem} ${activeTier === 'DIRECTOR' ? s.breadcrumbActive : s.breadcrumbInactive}`}
            data-testid="breadcrumb-l1"
          >
            <span className={`${s.tierBadge} ${s.tierL1}`}>L1</span>
            <span>12 Directors</span>
          </button>

          {selectedDeptId && activeDepartment && (
            <>
              <span className={s.breadcrumbSeparator}>/</span>
              <button
                onClick={() => handleSelectDepartment(selectedDeptId)}
                className={`${s.breadcrumbItem} ${activeTier === 'MANAGER' ? s.breadcrumbActive : s.breadcrumbInactive}`}
                data-testid="breadcrumb-l2"
              >
                <span className={`${s.tierBadge} ${s.tierL2}`}>L2</span>
                <span>{activeDepartment.title} (9 Divisions)</span>
              </button>
            </>
          )}

          {selectedManagerId && activeManager && (
            <>
              <span className={s.breadcrumbSeparator}>/</span>
              <div
                className={`${s.breadcrumbItem} ${s.breadcrumbActive}`}
                data-testid="breadcrumb-l3"
              >
                <span className={`${s.tierBadge} ${s.tierL3}`}>L3</span>
                <span>{activeManager.title} (Teams)</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Controls & Search Row */}
      <div className={s.controlsRow}>
        <div className={s.searchContainer}>
          <span className={s.searchIcon}>🔍</span>
          <input
            type="text"
            placeholder="Search hierarchy mandates, leads, codes..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className={s.searchInput}
            data-testid="hierarchy-search-input"
          />
        </div>

        {statusMessage && (
          <div className={s.statusToast} data-testid="hierarchy-status-toast">
            <span>⚡</span>
            <span>{statusMessage}</span>
          </div>
        )}
      </div>

      {/* Tier 1: 12 Corporate Directors Grid */}
      {activeTier === 'DIRECTOR' && (
        <div className={s.directorsGrid} data-testid="directors-grid">
          {filteredDirectors.map(dir => {
            const isDragging = draggedSlot === dir.slotNumber;
            return (
              <div
                key={dir._id}
                draggable
                onDragStart={() => handleDragStart('DIRECTOR', dir.slotNumber)}
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDropOnDirectorSlot(dir.slotNumber)}
                className={`${s.directorCard} ${isDragging ? s.cardDragging : ''}`}
                data-testid={`director-card-slot-${dir.slotNumber}`}
              >
                <div>
                  <div className={s.directorHeader}>
                    <span className={s.slotPill}>
                      Slot #{String(dir.slotNumber).padStart(2, '0')}
                    </span>
                    <span className={s.codePill}>{dir.fixedCode}</span>
                  </div>
                  <h3 className={s.directorTitle}>{dir.title}</h3>
                  <p className={s.directorDescription}>{dir.description}</p>
                </div>

                <div>
                  <div className={s.directorLeadMeta}>
                    <div className={s.leadAvatarBadge}>👤</div>
                    <div className="overflow-hidden">
                      <div className={s.leadName}>{dir.directorName}</div>
                      <div className={s.leadRole}>{dir.directorRole}</div>
                    </div>
                  </div>

                  <div className={s.cardFooterActions}>
                    <button
                      onClick={() => handleSelectDepartment(dir.slug)}
                      className={s.drillDownBtn}
                      data-testid={`drill-down-dept-${dir.slotNumber}`}
                    >
                      <span>9 Divisions</span>
                      <span>→</span>
                    </button>
                    <button
                      onClick={() => handleOpenEdit('DIRECTOR', dir)}
                      className={s.iconActionBtn}
                      title="Edit Director"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDemoteEntity('DIRECTOR', dir._id)}
                      className={s.demoteBtn}
                      title="Demote to Unassigned Pool"
                      data-testid={`demote-director-${dir.slotNumber}`}
                    >
                      ⬇️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tier 2: 9 Division Managers Grid */}
      {activeTier === 'MANAGER' && selectedDeptId && (
        <div className={s.managersGrid} data-testid="managers-grid">
          {activeManagers.map(mgr => {
            const isDragging = draggedSlot === mgr.slotNumber;
            return (
              <div
                key={mgr._id}
                draggable
                onDragStart={() => handleDragStart('MANAGER', mgr.slotNumber)}
                onDragOver={e => e.preventDefault()}
                onDrop={() => handleDropOnManagerSlot(selectedDeptId, mgr.slotNumber)}
                className={`${s.managerCard} ${isDragging ? s.cardDragging : ''}`}
                data-testid={`manager-card-slot-${mgr.slotNumber}`}
              >
                <div>
                  <div className={s.directorHeader}>
                    <span className={s.managerSlotPill}>Division #{mgr.slotNumber}</span>
                    <span className={s.codePill}>{mgr.fixedCode}</span>
                  </div>
                  <h3 className={s.managerTitle}>{mgr.title}</h3>
                  <p className={s.directorDescription}>{mgr.description}</p>
                </div>

                <div>
                  <div className={s.managerLeadMeta}>
                    <div className={s.managerAvatarBadge}>👔</div>
                    <div className="overflow-hidden flex-1">
                      <div className={s.leadName}>{mgr.managerName}</div>
                      <div className={s.leadRole}>{mgr.managerRole}</div>
                    </div>
                    <span className={s.slaPill}>{mgr.slaResponseTime}</span>
                  </div>

                  <div className={s.cardFooterActions}>
                    <button
                      onClick={() => handleSelectManager(mgr._id)}
                      className={s.managerDrillDownBtn}
                      data-testid={`drill-down-mgr-${mgr.slotNumber}`}
                    >
                      <span>Teams & Supervisors</span>
                      <span>→</span>
                    </button>
                    <button
                      onClick={() => handleOpenEdit('MANAGER', mgr)}
                      className={s.iconActionBtn}
                      title="Edit Division Manager"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDemoteEntity('MANAGER', mgr._id, selectedDeptId)}
                      className={s.demoteBtn}
                      title="Demote to Reserve Pool"
                      data-testid={`demote-manager-${mgr.slotNumber}`}
                    >
                      ⬇️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Tier 3: Supervisor Teams List */}
      {activeTier === 'SUPERVISOR' && selectedManagerId && (
        <div className={s.teamsContainer} data-testid="teams-container">
          {activeTeams.length === 0 ? (
            <div className="p-8 text-center text-slate-500 bg-slate-900/50 rounded-2xl border border-slate-800">
              No operational teams assigned to this division. Drag a unit from the Unassigned Pool
              below.
            </div>
          ) : (
            activeTeams.map(team => (
              <div key={team._id} className={s.teamCard} data-testid={`team-row-${team.teamCode}`}>
                <div className={s.teamIdentity}>
                  <div className={s.teamAvatarBadge}>🛡️</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className={s.teamName}>{team.teamName}</h4>
                      <span className={s.codePill}>{team.teamCode}</span>
                      <span className={`${s.tierBadge} ${s.tierL3}`}>{team.supervisorCode}</span>
                    </div>
                    <div className={s.teamSupervisor}>
                      Supervisor:{' '}
                      <span className="text-slate-200 font-semibold">{team.supervisorName}</span> (
                      {team.supervisorRole})
                    </div>
                  </div>
                </div>

                <div className={s.capabilitiesTags}>
                  {team.capabilities.map((cap, i) => (
                    <span key={i} className={s.capabilityTag}>
                      {cap}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <span className={s.slaPill}>{team.slaResponseTime}</span>
                  <button
                    onClick={() => handleOpenEdit('SUPERVISOR', team)}
                    className={s.iconActionBtn}
                    title="Edit Team"
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() =>
                      handleDemoteEntity('SUPERVISOR', team._id, undefined, selectedManagerId)
                    }
                    className={s.demoteBtn}
                    title="Demote to Pool"
                    data-testid={`demote-team-${team.teamCode}`}
                  >
                    ⬇️
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Zero-Delete Unassigned Reserve Pool Deck */}
      <div className={s.poolContainer} data-testid="unassigned-pool-deck">
        <div className={s.poolHeader}>
          <div className={s.poolTitle}>
            <span>📦</span>
            <span>Unassigned Operational Reserve Pool (Zero-Delete Preservation)</span>
          </div>
          <span className={s.poolCountPill} data-testid="pool-count-pill">
            {hierarchyState.unassignedPool.length} Units Available
          </span>
        </div>

        <div className={s.poolGrid}>
          {hierarchyState.unassignedPool.slice(0, 15).map(item => (
            <div
              key={item.id}
              draggable
              onDragStart={() => handleDragStartPool(item.id)}
              className={s.poolItemCard}
              data-testid={`pool-item-${item.id}`}
              title="Drag onto any Director or Manager card to assign"
            >
              <div className={s.poolItemAvatar}>⚡</div>
              <div className="overflow-hidden">
                <div className={s.poolItemName}>{item.name}</div>
                <div className={s.poolItemTitle}>{item.title}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit Drawer */}
      <HierarchyCrudDrawer
        isOpen={isDrawerOpen}
        tier={editingTier}
        node={editingNode}
        onClose={handleCloseDrawer}
        onSave={handleSaveEdit}
      />
    </div>
  );
};
