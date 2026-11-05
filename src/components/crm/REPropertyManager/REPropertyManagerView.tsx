/**
 * REPropertyManagerView.tsx
 * 7-Category Architecture: Pure View Layer
 * Master Real Estate Inventory Management View for White Caves Real Estate LLC
 * Single Purpose File Law: < 350 lines
 */

import React, { FC, useEffect } from 'react';
import { Building2, Search, Plus } from 'lucide-react';
import { propStyles as s } from './REPropertyManager.styles';
import { useREPropertyManager } from './REPropertyManager.logic';
import { REPropertyCard } from './REPropertyCard';
import { REPropertyDetailModal } from './REPropertyDetailModal';
import { REPropertyEditDrawer } from './REPropertyEditDrawer';
import { PROPERTY_LOCATIONS, PROPERTY_TYPES } from './REPropertyManager.data';
import type { REPropertyNode } from './REPropertyManager.types';

export interface REPropertyManagerViewProps {
  selectedPropertyId?: string | null;
  onSelectProperty?: (id: string) => void;
  initialProperties?: REPropertyNode[];
}

export const REPropertyManagerView: FC<REPropertyManagerViewProps> = ({
  selectedPropertyId,
  onSelectProperty,
  initialProperties,
}) => {
  const {
    filteredProperties,
    filters,
    metrics,
    selectedPropertyForModal,
    isEditDrawerOpen,
    editingProperty,
    handleSetSearch,
    handleSetPurpose,
    handleSetType,
    handleSetLocation,
    handleSetStatus,
    handleCreateProperty,
    handleUpdateProperty,
    handleAdvanceStatus,
    handleOpenDetailModal,
    handleCloseDetailModal,
    handleOpenCreateDrawer,
    handleOpenEditDrawer,
    handleCloseDrawer,
  } = useREPropertyManager(initialProperties);

  // Deep-link viewport synchronization: auto-open modal when selectedPropertyId matches
  useEffect(() => {
    if (!selectedPropertyId || filteredProperties.length === 0) return;
    const clean = selectedPropertyId.toUpperCase();
    const found = filteredProperties.find(
      p =>
        p.repropertyId.toUpperCase() === clean ||
        p._id.toUpperCase() === clean ||
        p.repropertyId.replace('-', '').toUpperCase() === clean
    );
    if (found) {
      handleOpenDetailModal(found);
    }
  }, [selectedPropertyId, filteredProperties, handleOpenDetailModal]);

  const formatPriceM = (val: number) => {
    if (val >= 1000000) {
      return `AED ${(val / 1000000).toFixed(1)}M`;
    }
    return `AED ${val.toLocaleString()}`;
  };

  return (
    <div className={s.container} data-testid="re-property-manager-view">
      {/* ── 1. Header & Metrics ─────────────────────────────────────────── */}
      <div className={s.headerWrapper}>
        <div className={s.headerLeft}>
          <div className={s.headerIcon}>
            <Building2 size={22} />
          </div>
          <div>
            <h1 className={s.headerTitle}>
              Real Estate Properties & Inventory Management
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-500/20 text-amber-300 border border-amber-500/30">
                REproperties
              </span>
            </h1>
            <p className={s.headerSubtitle}>
              Dubai luxury residential, commercial, and investment portfolio inventory with DLD
              Title Deed & Trakheesi permits
            </p>
          </div>
        </div>

        <button
          onClick={handleOpenCreateDrawer}
          className={s.addBtn}
          data-testid="add-property-btn"
        >
          <Plus size={16} />
          <span>Register New Property Unit</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className={s.metricsRow} data-testid="property-metrics-row">
        <div className={s.metricCard}>
          <span className={s.metricNumber}>{formatPriceM(metrics.totalInventoryValue)}</span>
          <span className={s.metricLabel}>Active Portfolio Value</span>
        </div>
        <div className={s.metricCard}>
          <span className={s.metricNumber}>{metrics.totalUnits}</span>
          <span className={s.metricLabel}>Total Units</span>
        </div>
        <div className={s.metricCard}>
          <span className="text-xl md:text-2xl font-black text-emerald-400 font-mono">
            {metrics.availableCount}
          </span>
          <span className={s.metricLabel}>Available Now</span>
        </div>
        <div className={s.metricCard}>
          <span className="text-xl md:text-2xl font-black text-amber-400 font-mono">
            {metrics.underOfferCount}
          </span>
          <span className={s.metricLabel}>Under Offer</span>
        </div>
        <div className={s.metricCard}>
          <span className="text-xl md:text-2xl font-black text-blue-400 font-mono">
            {metrics.leasedCount + metrics.soldCount}
          </span>
          <span className={s.metricLabel}>Transacted (Sold/Leased)</span>
        </div>
      </div>

      {/* ── 2. Filter & Controls Bar ────────────────────────────────────── */}
      <div className={s.controlsBar}>
        <div className={s.searchBox}>
          <Search size={14} className={s.searchIcon} />
          <input
            type="text"
            placeholder="Search properties by ID, community, developer, Trakheesi permit, Title deed..."
            value={filters.searchQuery}
            onChange={e => handleSetSearch(e.target.value)}
            className={s.searchInput}
            data-testid="property-search-input"
          />
        </div>

        <div className={s.filterGroup}>
          {/* Purpose Toggles */}
          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => handleSetPurpose('ALL')}
              className={s.purposeToggleBtn(filters.selectedPurpose === 'ALL')}
              data-testid="toggle-purpose-all"
            >
              All
            </button>
            <button
              onClick={() => handleSetPurpose('BUY')}
              className={s.purposeToggleBtn(filters.selectedPurpose === 'BUY')}
              data-testid="toggle-purpose-buy"
            >
              For Sale
            </button>
            <button
              onClick={() => handleSetPurpose('RENT')}
              className={s.purposeToggleBtn(filters.selectedPurpose === 'RENT')}
              data-testid="toggle-purpose-rent"
            >
              For Lease
            </button>
          </div>

          {/* Location Filter */}
          <select
            value={filters.selectedLocation}
            onChange={e => handleSetLocation(e.target.value)}
            className={s.filterSelect}
            data-testid="location-filter-select"
          >
            {PROPERTY_LOCATIONS.map(loc => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={filters.selectedType}
            onChange={e => handleSetType(e.target.value)}
            className={s.filterSelect}
            data-testid="type-filter-select"
          >
            {PROPERTY_TYPES.map(t => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filters.selectedStatus}
            onChange={e => handleSetStatus(e.target.value)}
            className={s.filterSelect}
            data-testid="status-filter-select"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="UNDER_OFFER">Under Offer</option>
            <option value="SOLD">Sold</option>
            <option value="LEASED">Leased</option>
            <option value="OFF_MARKET">Off Market</option>
          </select>
        </div>
      </div>

      {/* ── 3. Properties Cards Grid ────────────────────────────────────── */}
      <div className={s.propertyGrid} data-testid="properties-cards-grid">
        {filteredProperties.length === 0 ? (
          <div className="col-span-full p-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800">
            <Building2 size={36} className="mx-auto mb-2 opacity-40 text-amber-400" />
            <p className="text-sm font-semibold text-slate-300">No properties found</p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search criteria or location filters.
            </p>
          </div>
        ) : (
          filteredProperties.map(property => (
            <REPropertyCard
              key={property._id}
              property={property}
              onInspect={prop => {
                handleOpenDetailModal(prop);
                onSelectProperty?.(prop.repropertyId);
              }}
              onAdvanceStatus={handleAdvanceStatus}
            />
          ))
        )}
      </div>

      {/* ── 4. Unit Inspection Detail Modal ─────────────────────────────── */}
      <REPropertyDetailModal
        property={selectedPropertyForModal}
        onClose={handleCloseDetailModal}
        onAdvanceStatus={handleAdvanceStatus}
        onOpenEdit={handleOpenEditDrawer}
      />

      {/* ── 5. Add / Edit Inventory Drawer ──────────────────────────────── */}
      <REPropertyEditDrawer
        isOpen={isEditDrawerOpen}
        property={editingProperty}
        onClose={handleCloseDrawer}
        onSave={handleCreateProperty}
        onUpdate={handleUpdateProperty}
      />
    </div>
  );
};
