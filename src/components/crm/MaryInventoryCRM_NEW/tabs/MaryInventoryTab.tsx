import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../../../store/store';
import type { InventoryProperty, InventoryOwner } from '../../../../store/slices/inventorySlice';
import type { InventoryFilters } from '../../../../store/slices/inventorySlice';
import { 
  Building2, Plus, Download, Home, Users, Phone, XCircle, Eye, MapPin
} from 'lucide-react';
import LazyFullScreenDetailModal from '../../../../shared/components/ui/LazyFullScreenDetailModal';
import PropertyMatrix from '../../inventory/PropertyMatrix';
import OwnerDetailDrawer from '../../inventory/OwnerDetailDrawer';
import FilterPanel from '../../inventory/FilterPanel';
import PropertyDetailsCard from '../../inventory/PropertyDetailsCard';
import ClusterBrowser from '../../inventory/ClusterBrowser';
import DataQualityIndicators from '../../inventory/DataQualityIndicators';
import {
  loadInventoryData,
  selectFilteredProperties,
  selectInventoryStats,
  selectFilters,
  selectOwners,
  selectFilterOptions,
  selectActiveFiltersCount,
  setFilter,
  clearFilters,
  toggleMultiOwnerFilter,
  toggleMultiPhoneFilter,
  toggleMultiPropertyFilter
} from '../../../../store/slices/inventorySlice';
import '../MaryInventoryCRM.css';

/**
 * MaryInventoryTab Component
 * 
 * Main inventory management tab with:
 * - Property browsing and search
 * - Multi-owner and multi-phone filtering
 * - Cluster navigation
 * - Owner and property detail views
 * - Statistics dashboard
 * 
 * @returns {JSX.Element} Rendered inventory tab
 */
const MaryInventoryTab = () => {
  const dispatch = useDispatch<AppDispatch>();
  const properties = useSelector(selectFilteredProperties);
  const stats = useSelector(selectInventoryStats);
  const filters = useSelector(selectFilters);
  const owners = useSelector(selectOwners);
  const filterOptions = useSelector(selectFilterOptions);
  const activeFiltersCount = useSelector(selectActiveFiltersCount);
  const loading = useSelector((state: RootState) => state.inventory?.loading);
  
  // Local state
  const [selectedProperty, setSelectedProperty] = useState<InventoryProperty | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState<InventoryOwner | null>(null);
  const [showOwnerDrawer, setShowOwnerDrawer] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState('all');

  // Load inventory data on mount
  useEffect(() => {
    const promise = dispatch(loadInventoryData());
    return () => { promise.abort?.(); };
  }, [dispatch]);

  // Handlers
  const handlePropertyClick = (property: InventoryProperty) => {
    setSelectedProperty(property);
    setShowDetailModal(true);
  };

  const handleOwnerClick = (owner: InventoryOwner) => {
    setSelectedOwner(owner);
    setShowOwnerDrawer(true);
  };

  const handleFilterChange = (key: string, value: string | null) => {
    dispatch(setFilter({ key: key as keyof InventoryFilters, value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleFilterToggle = (filterKey: string) => {
    switch (filterKey) {
      case 'showMultiOwner':
        dispatch(toggleMultiOwnerFilter());
        break;
      case 'showMultiPhone':
        dispatch(toggleMultiPhoneFilter());
        break;
      case 'showMultiProperty':
        dispatch(toggleMultiPropertyFilter());
        break;
      default:
        break;
    }
  };

  const getOwnerProperties = (ownerId: string): InventoryProperty[] => {
    const propertyIds = owners.byId?.[ownerId]?.properties || [];
    return propertyIds.map(id => {
      const prop = properties.find(p => p.pNumber === id);
      return prop || { pNumber: id, project: 'Unknown', area: 'Unknown', status: 'Unknown' };
    });
  };

  const getPropertyOwners = (property: InventoryProperty): InventoryOwner[] => {
    const ownerIds = property?.owners;
    if (!Array.isArray(ownerIds)) return [];
    return ownerIds.map((ownerId: string) => owners.byId?.[ownerId]).filter((o): o is InventoryOwner => Boolean(o));
  };

  return (
    <div className="mary-inventory-tab">
      {/* Tab Header */}
      <div className="tab-header">
        <div className="header-content">
          <h3>Inventory</h3>
          <p className="header-subtitle">Manage and browse all properties</p>
        </div>
        <div className="header-actions">
          <button className="action-btn">
            <Download size={16} /> Export
          </button>
          <button className="action-btn primary">
            <Plus size={16} /> Add Property
          </button>
        </div>
      </div>

      {/* Tab Body */}
      <div className="tab-body">
        {/* Data Quality Indicators */}
        <DataQualityIndicators onFilterClick={handleFilterToggle} />

        {/* Filter Toggle and Clear */}
        <div className="filter-toggle-row">
          <button 
            className={`filter-toggle-btn ${showFilters ? 'active' : ''}`}
            onClick={() => setShowFilters(!showFilters)}
          >
            <Eye size={16} />
            {showFilters ? 'Hide Filters' : 'Show Filters'}
            {activeFiltersCount > 0 && <span className="filter-count">{activeFiltersCount}</span>}
          </button>
        </div>

        {/* Filter Panel */}
        {showFilters && (
          <FilterPanel
            filters={filters as unknown as Record<string, string>}
            filterOptions={filterOptions as unknown as Record<string, string[]>}
            onFilterChange={handleFilterChange}
            onClearFilters={handleClearFilters}
            activeFiltersCount={activeFiltersCount}
          />
        )}

        {/* Cluster Browser */}
        <ClusterBrowser 
          selectedCluster={selectedCluster}
          onClusterSelect={(cluster: string) => {
            setSelectedCluster(cluster);
            handleFilterChange('cluster', cluster === 'all' ? null : cluster);
          }}
        />

        {/* Stats Cards */}
        <div className="inventory-stats">
          <div className="stat-card">
            <Building2 size={24} />
            <div className="stat-content">
              <span className="stat-value">{stats.totalProperties?.toLocaleString() || 0}</span>
              <span className="stat-label">Total Properties</span>
            </div>
          </div>
          <div className="stat-card">
            <Users size={24} color="#8b5cf6" />
            <div className="stat-content">
              <span className="stat-value">{stats.totalOwners?.toLocaleString() || 0}</span>
              <span className="stat-label">Total Owners</span>
            </div>
          </div>
          <div className="stat-card warning">
            <Users size={24} color="#f59e0b" />
            <div className="stat-content">
              <span className="stat-value">{stats.multiOwnerProperties?.toLocaleString() || 0}</span>
              <span className="stat-label">Multi-Owner</span>
            </div>
          </div>
          <div className="stat-card">
            <Phone size={24} color="#EF4444" />
            <div className="stat-content">
              <span className="stat-value">{stats.ownersWithMultiplePhones?.toLocaleString() || 0}</span>
              <span className="stat-label">Multi-Phone Owners</span>
            </div>
          </div>
        </div>

        {/* Active Filters Display */}
        {activeFiltersCount > 0 && (
          <div className="active-filters" role="list" aria-label="Active filters">
            {filters.showMultiOwner && (
              <button className="filter-tag" role="listitem" onClick={() => dispatch(toggleMultiOwnerFilter())} aria-label="Remove multi-owner filter">
                Multi-Owner Only <XCircle size={14} aria-hidden="true" />
              </button>
            )}
            {filters.showMultiPhone && (
              <button className="filter-tag" role="listitem" onClick={() => dispatch(toggleMultiPhoneFilter())} aria-label="Remove multi-phone filter">
                Multi-Phone Only <XCircle size={14} aria-hidden="true" />
              </button>
            )}
            {filters.showMultiProperty && (
              <button className="filter-tag" role="listitem" onClick={() => dispatch(toggleMultiPropertyFilter())} aria-label="Remove multi-property filter">
                Multi-Property Owners <XCircle size={14} aria-hidden="true" />
              </button>
            )}
            {filters.layout && (
              <button className="filter-tag" role="listitem" onClick={() => handleFilterChange('layout', null)} aria-label={`Remove layout: ${filters.layout} filter`}>
                Layout: {filters.layout} <XCircle size={14} aria-hidden="true" />
              </button>
            )}
            {filters.status && (
              <button className="filter-tag" role="listitem" onClick={() => handleFilterChange('status', null)} aria-label={`Remove status: ${filters.status} filter`}>
                Status: {filters.status} <XCircle size={14} aria-hidden="true" />
              </button>
            )}
            {filters.view && (
              <button className="filter-tag" role="listitem" onClick={() => handleFilterChange('view', null)} aria-label={`Remove view: ${filters.view} filter`}>
                View: {filters.view} <XCircle size={14} aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* Main Property Matrix */}
        <PropertyMatrix 
          onPropertySelect={handlePropertyClick}
          onOwnerSelect={handleOwnerClick}
        />
      </div>

      {/* Owner Detail Drawer */}
      {showOwnerDrawer && selectedOwner && (
        <OwnerDetailDrawer
          owner={selectedOwner as { id: string; name: string; contacts?: Array<{ type: 'mobile' | 'phone' | 'email'; value: string; isPrimary?: boolean }> }}
          properties={getOwnerProperties(selectedOwner.id) as Array<{ pNumber: string; project: string; area: string; status: string }>}
          onClose={() => {
            setShowOwnerDrawer(false);
            setSelectedOwner(null);
          }}
          onPropertyClick={(p) => handlePropertyClick(p as unknown as InventoryProperty)}
        />
      )}

      {/* Property Detail Modal */}
      {selectedProperty && (
        <LazyFullScreenDetailModal
          isOpen={showDetailModal}
          onClose={() => {
            setShowDetailModal(false);
            setSelectedProperty(null);
          }}
          title={selectedProperty?.pNumber || 'Property Details'}
          subtitle={`${selectedProperty?.cluster || ''} - ${selectedProperty?.area || ''}`}
          images={[]}
          tabs={[
            {
              label: 'All Details',
              icon: Home,
              content: (
                <PropertyDetailsCard
                  property={selectedProperty}
                  owners={getPropertyOwners(selectedProperty)}
                  onOwnerClick={handleOwnerClick}
                />
              )
            },
            {
              label: 'Location',
              icon: MapPin,
              content: (
                <div className="detail-location">
                  <div className="detail-section">
                    <h3>Location Details</h3>
                    <div className="detail-grid">
                      <div className="detail-item">
                        <span className="label">Area</span>
                        <span className="value">{selectedProperty.area || '-'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Project</span>
                        <span className="value">{selectedProperty.project || '-'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Cluster</span>
                        <span className="value">{selectedProperty.cluster || '-'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Master Project</span>
                        <span className="value">{selectedProperty.masterProject || '-'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Building</span>
                        <span className="value">{String(selectedProperty.building || '-')}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Unit Number</span>
                        <span className="value">{String(selectedProperty.unitNumber || '-')}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Floor</span>
                        <span className="value">{selectedProperty.floor || '-'}</span>
                      </div>
                      <div className="detail-item">
                        <span className="label">Municipality No</span>
                        <span className="value">{String(selectedProperty.municipalityNo || '-')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            },
            {
              label: 'Owners',
              icon: Users,
              content: (
                <div className="owners-tab">
                  <h3>Property Owners ({selectedProperty.owners?.length || 0})</h3>
                  <div className="owners-list">
                    {getPropertyOwners(selectedProperty).map(owner => (
                      <div
                        key={owner.id}
                        className="owner-card"
                        role="button"
                        tabIndex={0}
                        onClick={() => handleOwnerClick(owner)}
                        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handleOwnerClick(owner); } }}
                      >
                        <div className="owner-avatar">{(owner.name || 'U').charAt(0)}</div>
                        <div className="owner-info">
                          <span className="owner-name">{owner.name}</span>
                          <span className="owner-contacts">{String(owner.email || '-')}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            }
          ]}
        />
      )}
    </div>
  );
};

MaryInventoryTab.displayName = 'MaryInventoryTab';

export default MaryInventoryTab;
