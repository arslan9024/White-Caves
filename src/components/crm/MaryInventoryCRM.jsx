import React, { useState, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Building2, Plus, Search, Filter, Edit2, Trash2, 
  Eye, MapPin, Bed, Bath, Square, DollarSign, Calendar,
  ChevronDown, ChevronUp, Download, Upload, RefreshCw, Bot,
  Home, TrendingUp, AlertCircle, CheckCircle, XCircle, Clock, Star,
  Users, Phone
} from 'lucide-react';
import FullScreenDetailModal from '../../shared/components/ui/FullScreenDetailModal';
import AssistantFeatureMatrix from './shared/AssistantFeatureMatrix';
import { MARY_FEATURES } from './data/assistantFeatures';
import DataQualityIndicators from './inventory/DataQualityIndicators';
import ClusterBrowser from './inventory/ClusterBrowser';
import PropertyMatrix from './inventory/PropertyMatrix';
import OwnerDetailDrawer from './inventory/OwnerDetailDrawer';
import {
  loadInventoryData,
  selectFilteredProperties,
  selectInventoryStats,
  selectFilters,
  selectOwners,
  setFilter,
  toggleMultiOwnerFilter,
  toggleMultiPhoneFilter,
  toggleMultiPropertyFilter,
  selectPropertiesByOwnerId
} from '../../store/slices/inventorySlice';
import './MaryInventoryCRM.css';

const DUMMY_INVENTORY = [
  {
    id: 'WC-P001',
    title: 'Luxury 3BR Apartment in DAMAC Hills 2',
    type: 'apartment',
    purpose: 'rent',
    price: 120000,
    location: { area: 'DAMAC Hills 2', emirate: 'Dubai', address: 'Juniper Cluster' },
    specs: { bedrooms: 3, bathrooms: 2, area: 1850, parking: 1, built: 2022 },
    status: 'available',
    featured: true,
    agent: { name: 'Ahmed Al Farsi', id: 'AGT001' },
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400'],
    views: 245,
    inquiries: 12,
    pNumber: '23683068',
    cluster: 'JUNIPER',
    owners: ['salah_s_a_a_alkharji']
  },
  {
    id: 'WC-P002',
    title: 'Modern 4BR Villa - ASTER Cluster',
    type: 'villa',
    purpose: 'sale',
    price: 2500000,
    location: { area: 'DAMAC Hills 2', emirate: 'Dubai', address: 'Aster Cluster' },
    specs: { bedrooms: 4, bathrooms: 3, area: 3200, parking: 2, built: 2021 },
    status: 'available',
    featured: true,
    agent: { name: 'Sarah Johnson', id: 'AGT002' },
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400'],
    views: 189,
    inquiries: 8,
    pNumber: '23687003',
    cluster: 'ASTER',
    owners: ['khaled_abdullah_s_alrasheid']
  }
];

const MaryInventoryCRM = () => {
  const dispatch = useDispatch();
  const properties = useSelector(selectFilteredProperties);
  const stats = useSelector(selectInventoryStats);
  const filters = useSelector(selectFilters);
  const owners = useSelector(selectOwners);
  const loading = useSelector(state => state.inventory?.loading);
  
  const [showFeatures, setShowFeatures] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProperty, setEditProperty] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedOwner, setSelectedOwner] = useState(null);
  const [showOwnerDrawer, setShowOwnerDrawer] = useState(false);
  const [viewMode, setViewMode] = useState('matrix');
  const [selectedCluster, setSelectedCluster] = useState('all');

  useEffect(() => {
    dispatch(loadInventoryData());
  }, [dispatch]);

  const displayedProperties = properties.length > 0 ? properties : DUMMY_INVENTORY;
  const displayStats = stats.totalProperties > 0 ? stats : {
    totalProperties: DUMMY_INVENTORY.length,
    totalOwners: 2,
    multiOwnerProperties: 0,
    ownersWithMultipleProperties: 0,
    ownersWithMultiplePhones: 0
  };

  const handleOwnerClick = (owner) => {
    setSelectedOwner(owner);
    setShowOwnerDrawer(true);
  };

  const handlePropertyClick = (property) => {
    setSelectedProperty(property);
    setShowDetailModal(true);
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
              {loading ? 'Loading...' : `Managing ${displayedProperties.length.toLocaleString()} properties`}
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

      <ClusterBrowser 
        selectedCluster={selectedCluster}
        onClusterSelect={setSelectedCluster}
      />

      <div className="inventory-stats">
        <div className="stat-card">
          <Building2 size={24} />
          <div className="stat-content">
            <span className="stat-value">{displayStats.totalProperties?.toLocaleString() || 0}</span>
            <span className="stat-label">Total Properties</span>
          </div>
        </div>
        <div className="stat-card">
          <Users size={24} color="#8b5cf6" />
          <div className="stat-content">
            <span className="stat-value">{displayStats.totalOwners?.toLocaleString() || 0}</span>
            <span className="stat-label">Total Owners</span>
          </div>
        </div>
        <div className="stat-card warning">
          <Users size={24} color="#f59e0b" />
          <div className="stat-content">
            <span className="stat-value">{displayStats.multiOwnerProperties?.toLocaleString() || 0}</span>
            <span className="stat-label">Multi-Owner</span>
          </div>
        </div>
        <div className="stat-card">
          <Phone size={24} color="#3b82f6" />
          <div className="stat-content">
            <span className="stat-value">{displayStats.ownersWithMultiplePhones?.toLocaleString() || 0}</span>
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
        {filters.cluster !== 'all' && (
          <span className="filter-tag" onClick={() => dispatch(setFilter({ key: 'cluster', value: 'all' }))}>
            Cluster: {filters.cluster} <XCircle size={14} />
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
        title={selectedProperty?.pNumber || selectedProperty?.title}
        subtitle={selectedProperty?.project || selectedProperty?.location?.area}
        images={selectedProperty?.images || []}
        tabs={[
          {
            label: 'Overview',
            icon: Home,
            content: selectedProperty && (
              <div className="detail-overview">
                <div className="detail-section">
                  <h3>Property Details</h3>
                  <div className="detail-grid">
                    <div className="detail-item">
                      <span className="label">P-Number</span>
                      <span className="value">{selectedProperty.pNumber}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Cluster</span>
                      <span className="value">{selectedProperty.cluster || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Area</span>
                      <span className="value">{selectedProperty.area || selectedProperty.location?.area}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Status</span>
                      <span className="value">{selectedProperty.status}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Rooms</span>
                      <span className="value">{selectedProperty.rooms || selectedProperty.specs?.bedrooms || 0}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Size</span>
                      <span className="value">{selectedProperty.actualArea || selectedProperty.specs?.area || 0} sqft</span>
                    </div>
                  </div>
                </div>
                <div className="detail-section">
                  <h3>Owners ({selectedProperty.owners?.length || 0})</h3>
                  <div className="owners-list">
                    {selectedProperty.owners?.map(ownerId => {
                      const owner = owners.byId?.[ownerId];
                      return owner ? (
                        <div key={ownerId} className="owner-card" onClick={() => handleOwnerClick(owner)}>
                          <Users size={20} />
                          <div className="owner-info">
                            <span className="owner-name">{owner.name}</span>
                            <span className="owner-contacts">
                              {owner.contacts?.length || 0} contact(s)
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div key={ownerId} className="owner-card">
                          <Users size={20} />
                          <span>{ownerId}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )
          },
          {
            label: 'Location',
            icon: MapPin,
            content: selectedProperty && (
              <div className="detail-location">
                <h3>Location Details</h3>
                <p><strong>Area:</strong> {selectedProperty.area || selectedProperty.location?.area}</p>
                <p><strong>Project:</strong> {selectedProperty.project || selectedProperty.location?.address}</p>
                <p><strong>Master Project:</strong> {selectedProperty.masterProject || 'Dubai Tiger Woods'}</p>
                <p><strong>Municipality No:</strong> {selectedProperty.municipalityNo || '-'}</p>
              </div>
            )
          }
        ]}
        actions={[
          { label: 'Edit Property', onClick: () => { setShowDetailModal(false); setEditProperty(selectedProperty); } },
          { label: 'Contact Owner', primary: true, onClick: () => {
            const firstOwnerId = selectedProperty?.owners?.[0];
            if (firstOwnerId && owners.byId?.[firstOwnerId]) {
              handleOwnerClick(owners.byId[firstOwnerId]);
            }
          }}
        ]}
      />
    </div>
  );
};

export default MaryInventoryCRM;
