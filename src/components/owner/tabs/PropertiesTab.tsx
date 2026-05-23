import React, { useState, useCallback } from 'react';
import { Badge, type BadgeVariant } from '../../../components/ui';
import type { PropertiesTabProps, Property } from './types';
import './TabStyles.css';

// ── CRUD modal form state ────────────────────────────────────────────────────
const EMPTY_FORM: Omit<Property, 'id' | 'code'> = {
  title: '',
  type: 'Apartment',
  location: '',
  price: 0,
  status: 'available',
  agent: null,
  bedrooms: 0,
  bathrooms: 0,
  area: 0,
};

const MOCK_PROPERTIES: Property[] = [
  {
    id: 1,
    code: 'WC-PAL-001',
    title: 'Luxury Villa Palm Jumeirah',
    type: 'Villa',
    location: 'Palm Jumeirah',
    price: 15000000,
    status: 'available',
    agent: 'Ahmed Ali',
    bedrooms: 5,
    bathrooms: 6,
    area: 8500,
  },
  {
    id: 2,
    code: 'WC-DWN-002',
    title: 'Penthouse Downtown Dubai',
    type: 'Apartment',
    location: 'Downtown Dubai',
    price: 8500000,
    status: 'reserved',
    agent: 'Sara Khan',
    bedrooms: 4,
    bathrooms: 5,
    area: 4200,
  },
  {
    id: 3,
    code: 'WC-MAR-003',
    title: 'Marina View Apartment',
    type: 'Apartment',
    location: 'Dubai Marina',
    price: 3200000,
    status: 'available',
    agent: 'Mohammed Hassan',
    bedrooms: 2,
    bathrooms: 3,
    area: 1800,
  },
  {
    id: 4,
    code: 'WC-JVC-004',
    title: 'Family Townhouse JVC',
    type: 'Townhouse',
    location: 'JVC',
    price: 2100000,
    status: 'under_contract',
    agent: 'Fatima Ahmed',
    bedrooms: 3,
    bathrooms: 4,
    area: 2500,
  },
  {
    id: 5,
    code: 'WC-BUS-005',
    title: 'Business Bay Office',
    type: 'Commercial',
    location: 'Business Bay',
    price: 5500000,
    status: 'available',
    agent: null,
    bedrooms: 0,
    bathrooms: 2,
    area: 3200,
  },
  {
    id: 6,
    code: 'WC-EMH-006',
    title: 'Emirates Hills Villa',
    type: 'Villa',
    location: 'Emirates Hills',
    price: 28000000,
    status: 'sold',
    agent: 'Ahmed Ali',
    bedrooms: 7,
    bathrooms: 8,
    area: 12000,
  },
];

type ModalMode = 'none' | 'add' | 'edit' | 'delete';

const PropertiesTab: React.FC<PropertiesTabProps> = ({ data, loading, error, onAction }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // CRUD state
  const [localProperties, setLocalProperties] = useState<Property[]>(
    () => data?.properties ?? MOCK_PROPERTIES
  );
  const [modalMode, setModalMode] = useState<ModalMode>('none');
  const [editTarget, setEditTarget] = useState<Property | null>(null);
  const [form, setForm] = useState<Omit<Property, 'id' | 'code'>>(EMPTY_FORM);
  const [toast, setToast] = useState<string | null>(null);

  // ✅ useEffect BEFORE early returns — Rules of Hooks compliant
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter, typeFilter]);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const openAdd = useCallback(() => {
    onAction?.('addProperty');
    setForm(EMPTY_FORM);
    setEditTarget(null);
    setModalMode('add');
  }, [onAction]);

  const openEdit = useCallback(
    (prop: Property) => {
      onAction?.('editProperty', prop.id);
      const { id: _id, code: _code, ...rest } = prop;
      setForm(rest);
      setEditTarget(prop);
      setModalMode('edit');
    },
    [onAction]
  );

  const openDelete = useCallback(
    (prop: Property) => {
      onAction?.('deleteProperty', prop.id);
      setEditTarget(prop);
      setModalMode('delete');
    },
    [onAction]
  );

  const handleView = useCallback(
    (prop: Property) => {
      onAction?.('viewProperty', prop.id);
    },
    [onAction]
  );

  const closeModal = () => {
    setModalMode('none');
    setEditTarget(null);
  };

  const handleSave = () => {
    if (!form.title.trim() || !form.location.trim() || form.price <= 0) return;
    if (modalMode === 'add') {
      const nextId = Math.max(0, ...localProperties.map(p => p.id)) + 1;
      const code = `WC-NEW-${String(nextId).padStart(3, '0')}`;
      setLocalProperties(prev => [...prev, { id: nextId, code, ...form }]);
      showToast('✅ Property added successfully');
    } else if (modalMode === 'edit' && editTarget) {
      setLocalProperties(prev => prev.map(p => (p.id === editTarget.id ? { ...p, ...form } : p)));
      showToast('✅ Property updated successfully');
    }
    closeModal();
  };

  const handleDelete = () => {
    if (!editTarget) return;
    setLocalProperties(prev => prev.filter(p => p.id !== editTarget.id));
    showToast('🗑️ Property deleted');
    closeModal();
  };

  // Reset page when filters change (must be before early returns — Rules of Hooks)
  React.useEffect(() => {
    const reset = async () => {
      setCurrentPage(1);
    };
    reset();
  }, [searchQuery, statusFilter, typeFilter]);

  // Show loading state
  if (loading) {
    return (
      <div className="properties-tab">
        <div className="tab-loading-state" role="status" aria-label="Loading properties">
          <div className="loading-spinner" />
          <p>Loading properties...</p>
        </div>
      </div>
    );
  }

  // Show error state with retry
  if (error) {
    return (
      <div className="properties-tab">
        <div className="tab-error-state" role="alert">
          <span className="error-icon">⚠️</span>
          <p>Failed to load properties: {error}</p>
          <button className="secondary-btn" onClick={() => onAction?.('retryFetch')}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  const filteredProperties = localProperties.filter(prop => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      prop.title.toLowerCase().includes(q) ||
      prop.code.toLowerCase().includes(q) ||
      prop.location.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || prop.status === statusFilter;
    const matchesType = typeFilter === 'all' || prop.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { variant: BadgeVariant; text: string }> = {
      available: { variant: 'success', text: 'Available' },
      reserved: { variant: 'warning', text: 'Reserved' },
      under_contract: { variant: 'info', text: 'Under Contract' },
      sold: { variant: 'error', text: 'Sold' },
      off_market: { variant: 'secondary', text: 'Off Market' },
    };
    // eslint-disable-next-line security/detect-object-injection
    const cfg = statusConfig[status] ?? { variant: 'secondary' as BadgeVariant, text: status };
    return (
      <Badge variant={cfg.variant} size="small">
        {cfg.text}
      </Badge>
    );
  };

  // Pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const startIdx = (currentPage - 1) * itemsPerPage;
  const paginated = filteredProperties.slice(startIdx, startIdx + itemsPerPage);

  const isFormValid = form.title.trim() !== '' && form.location.trim() !== '' && form.price > 0;

  return (
    <div className="properties-tab">
      {/* Toast */}
      {toast && (
        <div className="crud-toast" role="status">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="tab-header">
        <h3>Property Management</h3>
        <button className="primary-btn" onClick={openAdd}>
          <span>➕</span> Add Property
        </button>
      </div>

      {/* Filters */}
      <div className="filters-bar">
        <div className="search-input">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search properties..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
          />
        </div>
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="reserved">Reserved</option>
          <option value="under_contract">Under Contract</option>
          <option value="sold">Sold</option>
          <option value="off_market">Off Market</option>
        </select>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="Townhouse">Townhouse</option>
          <option value="Commercial">Commercial</option>
          <option value="Land">Land</option>
        </select>
      </div>

      {/* Empty state */}
      {filteredProperties.length === 0 && (
        <div className="empty-state-text" style={{ padding: '2rem', textAlign: 'center' }}>
          No properties found.{' '}
          <button className="link-btn" onClick={openAdd}>
            Add your first property →
          </button>
        </div>
      )}

      {/* Table */}
      {filteredProperties.length > 0 && (
        <div className="data-table">
          <table aria-label="Properties list">
            <thead>
              <tr>
                <th>Property</th>
                <th>Type</th>
                <th>Location</th>
                <th>Price (AED)</th>
                <th>Status</th>
                <th>Agent</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map(prop => (
                <tr key={prop.id}>
                  <td>
                    <div className="property-cell">
                      <div className="property-thumb">🏠</div>
                      <div className="property-info">
                        <strong>{prop.code}</strong>
                        <small>{prop.title}</small>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span className="type-tag">{prop.type}</span>
                  </td>
                  <td>{prop.location}</td>
                  <td className="price-cell">AED {prop.price.toLocaleString()}</td>
                  <td>{getStatusBadge(prop.status)}</td>
                  <td>{prop.agent ?? <span className="unassigned">Unassigned</span>}</td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="icon-btn"
                        title="View"
                        aria-label="View property"
                        onClick={() => handleView(prop)}
                      >
                        👁️
                      </button>
                      <button
                        className="icon-btn"
                        title="Edit"
                        aria-label="Edit property"
                        onClick={() => openEdit(prop)}
                      >
                        ✏️
                      </button>
                      <button
                        className="icon-btn danger"
                        title="Delete"
                        aria-label="Delete property"
                        onClick={() => openDelete(prop)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      <div className="table-footer">
        <span>
          Showing {paginated.length} of {filteredProperties.length} properties
        </span>
        {totalPages > 1 && (
          <div className="pagination">
            <button
              className="page-btn"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                className={`page-btn ${page === currentPage ? 'active' : ''}`}
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </button>
            ))}
            <button
              className="page-btn"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            >
              →
            </button>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {(modalMode === 'add' || modalMode === 'edit') && (
        <div
          className="crud-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="prop-modal-title"
        >
          <div className="crud-modal">
            <div className="crud-modal__header">
              <h3 id="prop-modal-title">
                {modalMode === 'add' ? 'Add New Property' : 'Edit Property'}
              </h3>
              <button className="crud-modal__close" onClick={closeModal} aria-label="Close">
                ✕
              </button>
            </div>
            <div className="crud-modal__body">
              <div className="crud-form-grid">
                <div className="form-group">
                  <label>Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                    placeholder="e.g. Marina View Apartment"
                  />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={form.type}
                    onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                  >
                    <option>Apartment</option>
                    <option>Villa</option>
                    <option>Townhouse</option>
                    <option>Commercial</option>
                    <option>Land</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                    placeholder="e.g. Dubai Marina"
                  />
                </div>
                <div className="form-group">
                  <label>Price (AED) *</label>
                  <input
                    type="number"
                    min="0"
                    value={form.price || ''}
                    onChange={e => setForm(f => ({ ...f, price: Number(e.target.value) }))}
                    placeholder="e.g. 3200000"
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={form.status}
                    onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
                  >
                    <option value="available">Available</option>
                    <option value="reserved">Reserved</option>
                    <option value="under_contract">Under Contract</option>
                    <option value="sold">Sold</option>
                    <option value="off_market">Off Market</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Agent</label>
                  <input
                    type="text"
                    value={form.agent ?? ''}
                    onChange={e => setForm(f => ({ ...f, agent: e.target.value || null }))}
                    placeholder="Agent name (optional)"
                  />
                </div>
                <div className="form-group">
                  <label>Bedrooms</label>
                  <input
                    type="number"
                    min="0"
                    value={form.bedrooms ?? ''}
                    onChange={e => setForm(f => ({ ...f, bedrooms: Number(e.target.value) }))}
                  />
                </div>
                <div className="form-group">
                  <label>Bathrooms</label>
                  <input
                    type="number"
                    min="0"
                    value={form.bathrooms ?? ''}
                    onChange={e => setForm(f => ({ ...f, bathrooms: Number(e.target.value) }))}
                  />
                </div>
                <div className="form-group">
                  <label>Area (sqft)</label>
                  <input
                    type="number"
                    min="0"
                    value={form.area ?? ''}
                    onChange={e => setForm(f => ({ ...f, area: Number(e.target.value) }))}
                  />
                </div>
              </div>
            </div>
            <div className="crud-modal__footer">
              <button className="secondary-btn" onClick={closeModal}>
                Cancel
              </button>
              <button className="primary-btn" onClick={handleSave} disabled={!isFormValid}>
                {modalMode === 'add' ? 'Add Property' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {modalMode === 'delete' && editTarget && (
        <div
          className="crud-modal-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="del-modal-title"
        >
          <div className="crud-modal crud-modal--sm">
            <div className="crud-modal__header">
              <h3 id="del-modal-title">Delete Property</h3>
              <button className="crud-modal__close" onClick={closeModal} aria-label="Close">
                ✕
              </button>
            </div>
            <div className="crud-modal__body">
              <p>
                Are you sure you want to delete <strong>{editTarget.title}</strong>?
              </p>
              <p className="crud-warn">This action cannot be undone.</p>
            </div>
            <div className="crud-modal__footer">
              <button className="secondary-btn" onClick={closeModal}>
                Cancel
              </button>
              <button className="danger-btn" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(PropertiesTab);
