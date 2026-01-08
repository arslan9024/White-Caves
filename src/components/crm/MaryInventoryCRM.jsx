import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Building2, Plus, Search, Download, Bot, Home, 
  Users, Phone, XCircle, Star, MapPin, Eye
} from 'lucide-react';
import FullScreenDetailModal from '../../shared/components/ui/FullScreenDetailModal';
import AssistantFeatureMatrix from './shared/AssistantFeatureMatrix';
import { MARY_FEATURES } from './data/assistantFeatures';
import DataQualityIndicators from './inventory/DataQualityIndicators';
import ClusterBrowser from './inventory/ClusterBrowser';
import PropertyMatrix from './inventory/PropertyMatrix';
import OwnerDetailDrawer from './inventory/OwnerDetailDrawer';
import FilterPanel from './inventory/FilterPanel';
import PropertyDetailsCard from './inventory/PropertyDetailsCard';
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
} from '../../store/slices/inventorySlice';
import './MaryInventoryCRM.css';

const MaryInventoryCRM = () => {
  const dispatch = useDispatch();
  const properties = useSelector(selectFilteredProperties);
  const stats = useSelector(selectInventoryStats);
  const filters = useSelector(selectFilters);
  const owners = useSelector(selectOwners);
  const filterOptions = useSelector(selectFilterOptions);
  const activeFiltersCount = useSelector(selectActiveFiltersCount);
  const loading = useSelector(state => state.inventory?.loading);
  
  const [showFeatures, setShowFeatures] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProperty, setEditProperty] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showOwnerDrawer, setShowOwnerDrawer] = useState(false);
  const [showFilters, setShowFilters] = useState(true);
  const [selectedCluster, setSelectedCluster] = useState('all');

  useEffect(() => {
    dispatch(loadInventoryData());
  }, [dispatch]);

  const handleOwnerClick = (owner) => {
    setSelectedOwner(owner);
    setShowOwnerDrawer(true);
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setShowDetailModal(true);
  };

  const handleFilterChange = (key, value) => {
    dispatch(setFilter({ key, value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const handleFilterToggle = (filterKey) => {
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
    }
  };

  const getOwnerProperties = (ownerId) => {
    const propertyIds = owners.byId?.[ownerId]?.properties || [];
    return propertyIds.map(id => {
      const prop = properties.find(p => p.pNumber === id);
      return prop || { pNumber: id, project: 'Unknown', area: 'Unknown', status: 'Unknown' };
    });
  };

  const getPropertyOwners = (property) => {
    if (!property?.owners) return [];
    return property.owners.map(ownerId => owners.byId?.[ownerId]).filter(Boolean);
  };

  const enrichedFilterOptions = {
    ...filterOptions,
    clusters: filterOptions.clusters || stats.clusters || []
  };

  return (
    <div className="mary-crm-container">
      <div className="mary-header">
        <div className="mary-info">
          <div className="mary-avatar">
            <Bot size={28} />
          </div>
          <div className="mary-details">
            <h2>Mary - Inventory Manager</h2>
            <span className="mary-status">
              {loading ? 'Loading...' : `Managing ${properties.length.toLocaleString()} properties`}
            </span>
          </div>
        </div>
        <div className="mary-actions">
          <button className="mary-action-btn"><Download size={18} /> Export</button>
          <button 
            className={`mary-action-btn features ${showFeatures ? 'active' : ''}`}
            onClick={() => setShowFeatures(!showFeatures)}
          >
            <Star size={18} /> Features ({MARY_FEATURES.length})
          </button>
          <button className="mary-action-btn primary" onClick={() => setShowAddForm(true)}>
            <Plus size={18} /> Add Property
          </button>
        </div>
      </div>

      {showFeatures && (
        <div className="mary-features-panel">
          <AssistantFeatureMatrix 
            features={MARY_FEATURES}
            assistantName="Mary"
            accentColor="#8b5cf6"
          />
        </div>
      )}

      <DataQualityIndicators onFilterClick={handleFilterToggle} />

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

      {showFilters && (
        <FilterPanel
          filters={filters}
          filterOptions={enrichedFilterOptions}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          activeFiltersCount={activeFiltersCount}
        />
      )}

      <ClusterBrowser 
        selectedCluster={selectedCluster}
        onClusterSelect={(cluster) => {
          setSelectedCluster(cluster);
          handleFilterChange('cluster', cluster === 'all' ? null : cluster);
        }}
      />

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
          <Phone size={24} color="#3b82f6" />
          <div className="stat-content">
            <span className="stat-value">{stats.ownersWithMultiplePhones?.toLocaleString() || 0}</span>
            <span className="stat-label">Multi-Phone Owners</span>
          </div>
        </div>
      </div>

      <div className="active-filters">
        {filters.showMultiOwner && (
          <span className="filter-tag" onClick={() => dispatch(toggleMultiOwnerFilter())}>
            Multi-Owner Only <XCircle size={14} />
          </span>
        )}
        {filters.showMultiPhone && (
          <span className="filter-tag" onClick={() => dispatch(toggleMultiPhoneFilter())}>
            Multi-Phone Only <XCircle size={14} />
          </span>
        )}
        {filters.showMultiProperty && (
          <span className="filter-tag" onClick={() => dispatch(toggleMultiPropertyFilter())}>
            Multi-Property Owners <XCircle size={14} />
          </span>
        )}
        {filters.layout && (
          <span className="filter-tag" onClick={() => handleFilterChange('layout', null)}>
            Layout: {filters.layout} <XCircle size={14} />
          </span>
        )}
        {filters.status && (
          <span className="filter-tag" onClick={() => handleFilterChange('status', null)}>
            Status: {filters.status} <XCircle size={14} />
          </span>
        )}
        {filters.view && (
          <span className="filter-tag" onClick={() => handleFilterChange('view', null)}>
            View: {filters.view} <XCircle size={14} />
          </span>
        )}
      </div>

      <PropertyMatrix 
        onPropertySelect={handlePropertyClick}
        onOwnerSelect={handleOwnerClick}
      />

      {showOwnerDrawer && selectedOwner && (
        <OwnerDetailDrawer
          owner={selectedOwner}
          properties={getOwnerProperties(selectedOwner.id)}
          onClose={() => {
            setShowOwnerDrawer(false);
            setSelectedOwner(null);
          }}
          onPropertyClick={handlePropertyClick}
        />
      )}

      <FullScreenDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedProperty?.pNumber || 'Property Details'}
        subtitle={`${selectedProperty?.cluster || ''} - ${selectedProperty?.area || ''}`}
        images={[]}
        tabs={[
          {
            label: 'All Details',
            icon: Home,
            content: selectedProperty && (
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
            content: selectedProperty && (
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
                      <span className="value">{selectedProperty.building || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Unit Number</span>
                      <span className="value">{selectedProperty.unitNumber || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Floor</span>
                      <span className="value">{selectedProperty.floor || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Municipality No</span>
                      <span className="value">{selectedProperty.municipalityNo || '-'}</span>
                    </div>
                  </div>
                </div>
              </div>
            )
          },
          {
            label: 'Owners',
            icon: Users,
            content: selectedProperty && (
              <div className="owners-tab">
                <h3>Property Owners ({selectedProperty.owners?.length || 0})</h3>
                <div className="owners-list">
                  {getPropertyOwners(selectedProperty).map(owner => (
                    <div key={owner.id} className="owner-card" onClick={() => handleOwnerClick(owner)}>
                      <div className="owner-avatar">{(owner.name || 'U').charAt(0)}</div>
                      <div className="owner-info">
                        <span className="owner-name">{owner.name}</span>
                        <span className="owner-contacts">
                          {owner.contacts?.length || 0} contact(s)
                          {owner.dateOfBirth && ` | DOB: ${owner.dateOfBirth}`}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          }
        ]}
        actions={[
          { label: 'Edit Property', onClick: () => { setShowDetailModal(false); setEditProperty(selectedProperty); } },
          { label: 'Contact Owner', primary: true, onClick: () => {
            const owners = getPropertyOwners(selectedProperty);
            if (owners.length > 0) {
              handleOwnerClick(owners[0]);
            }
          }}
        ]}
      />
    </div>
  );
};

export default MaryInventoryCRM;
