import React, { useState, useMemo } from 'react';
import { 
  Building2, Plus, Search, Filter, MoreVertical, Edit2, Trash2, 
  Eye, MapPin, Bed, Bath, Square, DollarSign, Calendar, Tag,
  ChevronDown, ChevronUp, Download, Upload, RefreshCw, Bot,
  Home, TrendingUp, AlertCircle, CheckCircle, XCircle, Clock
} from 'lucide-react';
import FullScreenDetailModal from '../../shared/components/ui/FullScreenDetailModal';
import './MaryInventoryCRM.css';

const DUMMY_INVENTORY = [
  {
    id: 'WC-001',
    title: 'Luxury 3BR Apartment - Dubai Marina',
    type: 'apartment',
    purpose: 'sale',
    price: 3200000,
    location: { area: 'Dubai Marina', emirate: 'Dubai', address: 'Marina Heights Tower, Floor 25' },
    specs: { bedrooms: 3, bathrooms: 3, area: 1850, parking: 2, built: 2022 },
    status: 'available',
    featured: true,
    agent: { name: 'Sarah Johnson', id: 'A001' },
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800'],
    views: 1245,
    inquiries: 23,
    dldNumber: 'DLD123456',
    createdAt: '2024-01-15',
    updatedAt: '2024-01-20'
  },
  {
    id: 'WC-002',
    title: 'Modern 2BR Apartment - Business Bay',
    type: 'apartment',
    purpose: 'rent',
    price: 95000,
    location: { area: 'Business Bay', emirate: 'Dubai', address: 'Executive Tower, Floor 18' },
    specs: { bedrooms: 2, bathrooms: 2, area: 1200, parking: 1, built: 2021 },
    status: 'available',
    featured: false,
    agent: { name: 'Mohammed Ali', id: 'A002' },
    images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800'],
    views: 856,
    inquiries: 15,
    dldNumber: 'DLD234567',
    createdAt: '2024-01-10',
    updatedAt: '2024-01-18'
  },
  {
    id: 'WC-003',
    title: '5BR Villa - Arabian Ranches',
    type: 'villa',
    purpose: 'sale',
    price: 8500000,
    location: { area: 'Arabian Ranches', emirate: 'Dubai', address: 'Saheel Community' },
    specs: { bedrooms: 5, bathrooms: 6, area: 5200, parking: 4, built: 2019 },
    status: 'reserved',
    featured: true,
    agent: { name: 'Ahmed Hassan', id: 'A003' },
    images: ['https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800'],
    views: 2340,
    inquiries: 45,
    dldNumber: 'DLD345678',
    createdAt: '2024-01-05',
    updatedAt: '2024-01-19'
  },
  {
    id: 'WC-004',
    title: 'Studio Apartment - JVC',
    type: 'apartment',
    purpose: 'rent',
    price: 42000,
    location: { area: 'Jumeirah Village Circle', emirate: 'Dubai', address: 'Circle Mall Residences' },
    specs: { bedrooms: 0, bathrooms: 1, area: 450, parking: 1, built: 2023 },
    status: 'rented',
    featured: false,
    agent: { name: 'Fatima Khan', id: 'A004' },
    images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800'],
    views: 432,
    inquiries: 8,
    dldNumber: 'DLD456789',
    createdAt: '2023-12-20',
    updatedAt: '2024-01-12'
  },
  {
    id: 'WC-005',
    title: '4BR Townhouse - Dubai Hills',
    type: 'townhouse',
    purpose: 'sale',
    price: 4800000,
    location: { area: 'Dubai Hills Estate', emirate: 'Dubai', address: 'Maple Community' },
    specs: { bedrooms: 4, bathrooms: 5, area: 3200, parking: 2, built: 2020 },
    status: 'available',
    featured: true,
    agent: { name: 'Sarah Johnson', id: 'A001' },
    images: ['https://images.unsplash.com/photo-1605276374104-dee2a0ed3cd6?w=800'],
    views: 1567,
    inquiries: 32,
    dldNumber: 'DLD567890',
    createdAt: '2024-01-08',
    updatedAt: '2024-01-20'
  }
];

const PropertyForm = ({ property, onSave, onCancel }) => {
  const [formData, setFormData] = useState(property || {
    title: '',
    type: 'apartment',
    purpose: 'sale',
    price: '',
    location: { area: '', emirate: 'Dubai', address: '' },
    specs: { bedrooms: 1, bathrooms: 1, area: '', parking: 1, built: 2024 },
    status: 'available',
    featured: false,
    dldNumber: ''
  });

  const handleChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      ...formData,
      id: property?.id || `WC-${String(Date.now()).slice(-3)}`,
      createdAt: property?.createdAt || new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      views: property?.views || 0,
      inquiries: property?.inquiries || 0,
      images: property?.images || [],
      agent: property?.agent || { name: 'Unassigned', id: null }
    });
  };

  return (
    <form className="property-form" onSubmit={handleSubmit}>
      <div className="form-section">
        <h3>Basic Information</h3>
        <div className="form-row">
          <div className="form-group full-width">
            <label>Property Title *</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="e.g., Luxury 3BR Apartment - Dubai Marina"
              required
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Property Type *</label>
            <select value={formData.type} onChange={(e) => handleChange('type', e.target.value)}>
              <option value="apartment">Apartment</option>
              <option value="villa">Villa</option>
              <option value="townhouse">Townhouse</option>
              <option value="penthouse">Penthouse</option>
              <option value="duplex">Duplex</option>
              <option value="land">Land</option>
              <option value="commercial">Commercial</option>
            </select>
          </div>
          <div className="form-group">
            <label>Purpose *</label>
            <select value={formData.purpose} onChange={(e) => handleChange('purpose', e.target.value)}>
              <option value="sale">For Sale</option>
              <option value="rent">For Rent</option>
            </select>
          </div>
          <div className="form-group">
            <label>Price (AED) *</label>
            <input 
              type="number" 
              value={formData.price}
              onChange={(e) => handleChange('price', parseInt(e.target.value))}
              placeholder="e.g., 3200000"
              required
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Location</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Area *</label>
            <input 
              type="text" 
              value={formData.location.area}
              onChange={(e) => handleChange('location.area', e.target.value)}
              placeholder="e.g., Dubai Marina"
              required
            />
          </div>
          <div className="form-group">
            <label>Emirate</label>
            <select value={formData.location.emirate} onChange={(e) => handleChange('location.emirate', e.target.value)}>
              <option value="Dubai">Dubai</option>
              <option value="Abu Dhabi">Abu Dhabi</option>
              <option value="Sharjah">Sharjah</option>
              <option value="Ajman">Ajman</option>
              <option value="Ras Al Khaimah">Ras Al Khaimah</option>
              <option value="Fujairah">Fujairah</option>
              <option value="Umm Al Quwain">Umm Al Quwain</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group full-width">
            <label>Full Address</label>
            <input 
              type="text" 
              value={formData.location.address}
              onChange={(e) => handleChange('location.address', e.target.value)}
              placeholder="e.g., Marina Heights Tower, Floor 25"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Specifications</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Bedrooms</label>
            <input 
              type="number" 
              min="0"
              value={formData.specs.bedrooms}
              onChange={(e) => handleChange('specs.bedrooms', parseInt(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Bathrooms</label>
            <input 
              type="number" 
              min="1"
              value={formData.specs.bathrooms}
              onChange={(e) => handleChange('specs.bathrooms', parseInt(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Area (sq ft)</label>
            <input 
              type="number" 
              value={formData.specs.area}
              onChange={(e) => handleChange('specs.area', parseInt(e.target.value))}
              placeholder="e.g., 1850"
            />
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Parking Spaces</label>
            <input 
              type="number" 
              min="0"
              value={formData.specs.parking}
              onChange={(e) => handleChange('specs.parking', parseInt(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>Year Built</label>
            <input 
              type="number" 
              min="1900"
              max="2030"
              value={formData.specs.built}
              onChange={(e) => handleChange('specs.built', parseInt(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label>DLD Number</label>
            <input 
              type="text" 
              value={formData.dldNumber}
              onChange={(e) => handleChange('dldNumber', e.target.value)}
              placeholder="e.g., DLD123456"
            />
          </div>
        </div>
      </div>

      <div className="form-section">
        <h3>Status & Options</h3>
        <div className="form-row">
          <div className="form-group">
            <label>Status</label>
            <select value={formData.status} onChange={(e) => handleChange('status', e.target.value)}>
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="sold">Sold</option>
              <option value="rented">Rented</option>
              <option value="off_market">Off Market</option>
            </select>
          </div>
          <div className="form-group checkbox-group">
            <label>
              <input 
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => handleChange('featured', e.target.checked)}
              />
              <span>Featured Property</span>
            </label>
          </div>
        </div>
      </div>

      <div className="form-actions">
        <button type="button" className="cancel-btn" onClick={onCancel}>Cancel</button>
        <button type="submit" className="save-btn">
          {property ? 'Update Property' : 'Add Property'}
        </button>
      </div>
    </form>
  );
};

const MaryInventoryCRM = () => {
  const [inventory, setInventory] = useState(DUMMY_INVENTORY);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterPurpose, setFilterPurpose] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [showAddForm, setShowAddForm] = useState(false);
  const [editProperty, setEditProperty] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const stats = useMemo(() => ({
    total: inventory.length,
    available: inventory.filter(p => p.status === 'available').length,
    forSale: inventory.filter(p => p.purpose === 'sale').length,
    forRent: inventory.filter(p => p.purpose === 'rent').length,
    totalValue: inventory.filter(p => p.purpose === 'sale').reduce((acc, p) => acc + p.price, 0),
    avgPrice: Math.round(inventory.filter(p => p.purpose === 'sale').reduce((acc, p) => acc + p.price, 0) / inventory.filter(p => p.purpose === 'sale').length) || 0
  }), [inventory]);

  const filteredInventory = useMemo(() => {
    return inventory
      .filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             p.location.area.toLowerCase().includes(searchQuery.toLowerCase()) ||
                             p.id.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || p.type === filterType;
        const matchesPurpose = filterPurpose === 'all' || p.purpose === filterPurpose;
        const matchesStatus = filterStatus === 'all' || p.status === filterStatus;
        return matchesSearch && matchesType && matchesPurpose && matchesStatus;
      })
      .sort((a, b) => {
        const aVal = a[sortBy];
        const bVal = b[sortBy];
        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        }
        return aVal < bVal ? 1 : -1;
      });
  }, [inventory, searchQuery, filterType, filterPurpose, filterStatus, sortBy, sortOrder]);

  const handleAddProperty = (property) => {
    setInventory(prev => [...prev, property]);
    setShowAddForm(false);
  };

  const handleEditProperty = (property) => {
    setInventory(prev => prev.map(p => p.id === property.id ? property : p));
    setEditProperty(null);
  };

  const handleDeleteProperty = (id) => {
    if (window.confirm('Are you sure you want to delete this property?')) {
      setInventory(prev => prev.filter(p => p.id !== id));
    }
  };

  const handleViewProperty = (property) => {
    setSelectedProperty(property);
    setShowDetailModal(true);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#22c55e';
      case 'reserved': return '#f59e0b';
      case 'sold': return '#ef4444';
      case 'rented': return '#3b82f6';
      case 'off_market': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'available': return <CheckCircle size={14} />;
      case 'reserved': return <Clock size={14} />;
      case 'sold': return <XCircle size={14} />;
      case 'rented': return <CheckCircle size={14} />;
      default: return <AlertCircle size={14} />;
    }
  };

  return (
    <div className="mary-crm-container">
      {/* Header */}
      <div className="mary-header">
        <div className="mary-info">
          <div className="mary-avatar">
            <Bot size={24} />
          </div>
          <div className="mary-details">
            <h2>Mary - Inventory Manager</h2>
            <span className="mary-status">Managing {inventory.length} properties</span>
          </div>
        </div>
        <div className="mary-actions">
          <button className="mary-action-btn"><Upload size={18} /> Import</button>
          <button className="mary-action-btn"><Download size={18} /> Export</button>
          <button className="mary-action-btn primary" onClick={() => setShowAddForm(true)}>
            <Plus size={18} /> Add Property
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="inventory-stats">
        <div className="stat-card">
          <Building2 size={24} />
          <div className="stat-content">
            <span className="stat-value">{stats.total}</span>
            <span className="stat-label">Total Properties</span>
          </div>
        </div>
        <div className="stat-card">
          <CheckCircle size={24} color="#22c55e" />
          <div className="stat-content">
            <span className="stat-value">{stats.available}</span>
            <span className="stat-label">Available</span>
          </div>
        </div>
        <div className="stat-card">
          <DollarSign size={24} color="#f59e0b" />
          <div className="stat-content">
            <span className="stat-value">{stats.forSale}</span>
            <span className="stat-label">For Sale</span>
          </div>
        </div>
        <div className="stat-card">
          <Home size={24} color="#3b82f6" />
          <div className="stat-content">
            <span className="stat-value">{stats.forRent}</span>
            <span className="stat-label">For Rent</span>
          </div>
        </div>
        <div className="stat-card">
          <TrendingUp size={24} color="#8b5cf6" />
          <div className="stat-content">
            <span className="stat-value">AED {(stats.totalValue / 1000000).toFixed(1)}M</span>
            <span className="stat-label">Total Value</span>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="inventory-filters">
        <div className="search-box">
          <Search size={18} />
          <input 
            type="text"
            placeholder="Search by ID, title, or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="filter-group">
          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="all">All Types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="townhouse">Townhouse</option>
            <option value="penthouse">Penthouse</option>
          </select>
          <select value={filterPurpose} onChange={(e) => setFilterPurpose(e.target.value)}>
            <option value="all">Sale & Rent</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
          </select>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="available">Available</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="updatedAt">Last Updated</option>
            <option value="createdAt">Date Added</option>
            <option value="price">Price</option>
            <option value="views">Views</option>
          </select>
          <button 
            className="sort-order-btn"
            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
          >
            {sortOrder === 'asc' ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="inventory-table-wrapper">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Property</th>
              <th>Type</th>
              <th>Purpose</th>
              <th>Price</th>
              <th>Location</th>
              <th>Specs</th>
              <th>Status</th>
              <th>Performance</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.map(property => (
              <tr key={property.id}>
                <td>
                  <div className="property-cell">
                    <img 
                      src={property.images[0] || 'https://via.placeholder.com/60'} 
                      alt={property.title}
                      className="property-thumb"
                    />
                    <div className="property-info">
                      <span className="property-id">{property.id}</span>
                      <span className="property-title">{property.title}</span>
                      {property.featured && <span className="featured-badge">Featured</span>}
                    </div>
                  </div>
                </td>
                <td>
                  <span className="type-badge">{property.type}</span>
                </td>
                <td>
                  <span className={`purpose-badge ${property.purpose}`}>
                    {property.purpose === 'sale' ? 'For Sale' : 'For Rent'}
                  </span>
                </td>
                <td>
                  <span className="price-value">
                    AED {property.price.toLocaleString()}
                    {property.purpose === 'rent' && <small>/year</small>}
                  </span>
                </td>
                <td>
                  <div className="location-cell">
                    <MapPin size={14} />
                    <span>{property.location.area}</span>
                  </div>
                </td>
                <td>
                  <div className="specs-cell">
                    <span><Bed size={14} /> {property.specs.bedrooms}</span>
                    <span><Bath size={14} /> {property.specs.bathrooms}</span>
                    <span><Square size={14} /> {property.specs.area}</span>
                  </div>
                </td>
                <td>
                  <span 
                    className="status-badge"
                    style={{ 
                      backgroundColor: `${getStatusColor(property.status)}20`,
                      color: getStatusColor(property.status)
                    }}
                  >
                    {getStatusIcon(property.status)}
                    {property.status}
                  </span>
                </td>
                <td>
                  <div className="performance-cell">
                    <span><Eye size={14} /> {property.views}</span>
                    <span><Tag size={14} /> {property.inquiries}</span>
                  </div>
                </td>
                <td>
                  <div className="action-buttons">
                    <button className="action-btn view" onClick={() => handleViewProperty(property)}>
                      <Eye size={16} />
                    </button>
                    <button className="action-btn edit" onClick={() => setEditProperty(property)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="action-btn delete" onClick={() => handleDeleteProperty(property.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Form Modal */}
      {(showAddForm || editProperty) && (
        <div className="form-modal-overlay" onClick={() => { setShowAddForm(false); setEditProperty(null); }}>
          <div className="form-modal" onClick={(e) => e.stopPropagation()}>
            <div className="form-modal-header">
              <h2>{editProperty ? 'Edit Property' : 'Add New Property'}</h2>
              <button className="close-btn" onClick={() => { setShowAddForm(false); setEditProperty(null); }}>
                &times;
              </button>
            </div>
            <PropertyForm 
              property={editProperty}
              onSave={editProperty ? handleEditProperty : handleAddProperty}
              onCancel={() => { setShowAddForm(false); setEditProperty(null); }}
            />
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <FullScreenDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedProperty?.title}
        subtitle={selectedProperty?.id}
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
                      <span className="label">Type</span>
                      <span className="value">{selectedProperty.type}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Purpose</span>
                      <span className="value">{selectedProperty.purpose === 'sale' ? 'For Sale' : 'For Rent'}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Price</span>
                      <span className="value">AED {selectedProperty.price.toLocaleString()}</span>
                    </div>
                    <div className="detail-item">
                      <span className="label">Status</span>
                      <span className="value">{selectedProperty.status}</span>
                    </div>
                  </div>
                </div>
                <div className="detail-section">
                  <h3>Specifications</h3>
                  <div className="specs-grid">
                    <div className="spec-item"><Bed size={20} /> {selectedProperty.specs.bedrooms} Bedrooms</div>
                    <div className="spec-item"><Bath size={20} /> {selectedProperty.specs.bathrooms} Bathrooms</div>
                    <div className="spec-item"><Square size={20} /> {selectedProperty.specs.area} sq ft</div>
                    <div className="spec-item"><Calendar size={20} /> Built {selectedProperty.specs.built}</div>
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
                <p><strong>Area:</strong> {selectedProperty.location.area}</p>
                <p><strong>Emirate:</strong> {selectedProperty.location.emirate}</p>
                <p><strong>Address:</strong> {selectedProperty.location.address}</p>
              </div>
            )
          }
        ]}
        actions={[
          { label: 'Edit Property', onClick: () => { setShowDetailModal(false); setEditProperty(selectedProperty); } },
          { label: 'View Inquiries', primary: true, onClick: () => console.log('View inquiries') }
        ]}
      />
    </div>
  );
};

export default MaryInventoryCRM;
