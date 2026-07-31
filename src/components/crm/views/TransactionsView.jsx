import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Receipt, Search, Filter, Download, Upload, Plus, Edit2, Trash2, Eye, 
  ChevronLeft, ChevronRight, X, Building, MapPin, Home, DollarSign,
  Calendar, ArrowUpDown, RefreshCw, FileSpreadsheet
} from 'lucide-react';
import axios from 'axios';

const PROPERTY_TYPES = ['Flat', 'Villa', 'Townhouse', 'Penthouse', 'Studio', 'Office', 'Hotel Rooms'];
const ROOM_OPTIONS = ['Studio', '1 B/R', '2 B/R', '3 B/R', '4 B/R', '5 B/R', '6+ B/R'];

const formatCurrency = (value) => {
  if (!value) return 'AED 0';
  return `AED ${Number(value).toLocaleString()}`;
};

const formatDate = (date) => {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('en-GB', { 
    day: '2-digit', month: 'short', year: 'numeric' 
  });
};

export default function TransactionsView() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, pages: 0 });
  const [filters, setFilters] = useState({
    search: '',
    area: '',
    propSubType: '',
    rooms: '',
    minValue: '',
    maxValue: '',
    isOffplan: ''
  });
  const [showFilters, setShowFilters] = useState(false);
  const [sortConfig, setSortConfig] = useState({ sortBy: 'instanceDate', sortOrder: 'desc' });
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('view');
  const [editForm, setEditForm] = useState({});
  const [importing, setImporting] = useState(false);
  const [toasts, setToasts] = useState([]);

  const showToast = useCallback((message, color = '#EF4444') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, color }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3200);
  }, []);

  const fetchTransactions = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        sortBy: sortConfig.sortBy,
        sortOrder: sortConfig.sortOrder,
        ...Object.fromEntries(Object.entries(filters).filter(([_, v]) => v))
      });
      
      const response = await axios.get(`/api/transactions?${params}`);
      if (response.data.success) {
        setTransactions(response.data.data);
        setPagination(prev => ({ ...prev, ...response.data.pagination }));
      }
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  }, [pagination.page, pagination.limit, sortConfig, filters]);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/transactions/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [fetchTransactions]);

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSort = (field) => {
    setSortConfig(prev => ({
      sortBy: field,
      sortOrder: prev.sortBy === field && prev.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      area: '',
      propSubType: '',
      rooms: '',
      minValue: '',
      maxValue: '',
      isOffplan: ''
    });
  };

  const handleView = (transaction) => {
    setSelectedTransaction(transaction);
    setModalMode('view');
    setShowModal(true);
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setEditForm({ ...transaction });
    setModalMode('edit');
    setShowModal(true);
  };

  const handleCreate = () => {
    setSelectedTransaction(null);
    setEditForm({
      transactionNumber: `WC-${Date.now()}`,
      instanceDate: new Date().toISOString(),
      group: 'Sales',
      procedure: 'Sell - Pre registration',
      isOffplan: 'Off-Plan',
      isFreehold: 'Free Hold',
      usage: 'Residential',
      area: '',
      propType: 'Unit',
      propSubType: 'Flat',
      transValue: 0,
      actualArea: 0,
      rooms: '1 B/R',
      parking: '1',
      project: ''
    });
    setModalMode('create');
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      if (modalMode === 'create') {
        await axios.post('/api/transactions', editForm);
      } else {
        await axios.put(`/api/transactions/${selectedTransaction._id}`, editForm);
      }
      setShowModal(false);
      fetchTransactions();
      fetchStats();
    } catch (error) {
      showToast('Failed to save transaction', '#EF4444');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) return;
    try {
      await axios.delete(`/api/transactions/${id}`);
      fetchTransactions();
      fetchStats();
    } catch (error) {
      
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setImporting(true);
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await axios.post('/api/transactions/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      if (response.data.success) {
        showToast(`Successfully imported ${response.data.imported} transactions`, '#10B981');
        fetchTransactions();
        fetchStats();
      }
    } catch (error) {
      showToast('Failed to import file', '#EF4444');
    } finally {
      setImporting(false);
      e.target.value = '';
    }
  };

  return (
    <div className="transactions-view">
      <div className="transactions-header">
        <div className="header-left">
          <h2><Receipt size={24} /> DLD Transactions</h2>
          <p className="subtitle">Dubai Land Department property transactions</p>
        </div>
        <div className="header-actions">
          <button className="action-btn secondary" onClick={() => setShowFilters(!showFilters)}>
            <Filter size={16} /> Filters
          </button>
          <label className="action-btn secondary import-btn">
            <Upload size={16} /> {importing ? 'Importing...' : 'Import CSV'}
            <input type="file" accept=".csv" onChange={handleImport} hidden disabled={importing} />
          </label>
          <button className="action-btn primary" onClick={handleCreate}>
            <Plus size={16} /> Add Transaction
          </button>
        </div>
      </div>

      {stats && (
        <div className="stats-grid">
          <div className="stat-card">
            <Receipt size={24} className="stat-icon" />
            <div className="stat-content">
              <div className="stat-value">{stats.totalTransactions?.toLocaleString()}</div>
              <div className="stat-label">Total Transactions</div>
            </div>
          </div>
          <div className="stat-card highlight">
            <DollarSign size={24} className="stat-icon" />
            <div className="stat-content">
              <div className="stat-value">AED {(stats.totalValue / 1000000000).toFixed(1)}B</div>
              <div className="stat-label">Total Value</div>
            </div>
          </div>
          <div className="stat-card">
            <MapPin size={24} className="stat-icon" />
            <div className="stat-content">
              <div className="stat-value">{stats.topAreas?.[0]?._id || '-'}</div>
              <div className="stat-label">Top Area</div>
            </div>
          </div>
          <div className="stat-card">
            <Building size={24} className="stat-icon" />
            <div className="stat-content">
              <div className="stat-value">{stats.propertyTypes?.[0]?._id || '-'}</div>
              <div className="stat-label">Top Property Type</div>
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showFilters && (
          <motion.div 
            className="filters-panel"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="filters-grid">
              <div className="filter-group">
                <label>Search</label>
                <div className="search-input">
                  <Search size={16} />
                  <input 
                    type="text" 
                    placeholder="Transaction #, Project, Area..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                  />
                </div>
              </div>
              <div className="filter-group">
                <label>Area</label>
                <input 
                  type="text" 
                  placeholder="e.g., Palm Jumeirah"
                  value={filters.area}
                  onChange={(e) => handleFilterChange('area', e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>Property Type</label>
                <select value={filters.propSubType} onChange={(e) => handleFilterChange('propSubType', e.target.value)}>
                  <option value="">All Types</option>
                  {PROPERTY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <label>Bedrooms</label>
                <select value={filters.rooms} onChange={(e) => handleFilterChange('rooms', e.target.value)}>
                  <option value="">All</option>
                  {ROOM_OPTIONS.map(room => <option key={room} value={room}>{room}</option>)}
                </select>
              </div>
              <div className="filter-group">
                <label>Min Value (AED)</label>
                <input 
                  type="number" 
                  placeholder="0"
                  value={filters.minValue}
                  onChange={(e) => handleFilterChange('minValue', e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>Max Value (AED)</label>
                <input 
                  type="number" 
                  placeholder="100,000,000"
                  value={filters.maxValue}
                  onChange={(e) => handleFilterChange('maxValue', e.target.value)}
                />
              </div>
              <div className="filter-group">
                <label>Status</label>
                <select value={filters.isOffplan} onChange={(e) => handleFilterChange('isOffplan', e.target.value)}>
                  <option value="">All</option>
                  <option value="Off-Plan">Off-Plan</option>
                  <option value="Ready">Ready</option>
                </select>
              </div>
              <div className="filter-group filter-actions">
                <button className="clear-btn" onClick={clearFilters}>
                  <X size={14} /> Clear All
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="table-container">
        {loading ? (
          <div className="loading-state">
            <RefreshCw size={32} className="spin" />
            <p>Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="empty-state">
            <FileSpreadsheet size={48} />
            <h3>No Transactions Found</h3>
            <p>Import a CSV file or add transactions manually</p>
          </div>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th onClick={() => handleSort('transactionNumber')}>
                  Transaction # <ArrowUpDown size={14} />
                </th>
                <th onClick={() => handleSort('instanceDate')}>
                  Date <ArrowUpDown size={14} />
                </th>
                <th>Project</th>
                <th>Area</th>
                <th>Type</th>
                <th>Rooms</th>
                <th onClick={() => handleSort('transValue')}>
                  Value <ArrowUpDown size={14} />
                </th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <motion.tr 
                  key={tx._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.02 }}
                >
                  <td className="tx-number">{tx.transactionNumber}</td>
                  <td className="tx-date">{formatDate(tx.instanceDate)}</td>
                  <td className="tx-project" title={tx.project}>{tx.project || '-'}</td>
                  <td className="tx-area">{tx.area}</td>
                  <td><span className="type-badge">{tx.propSubType}</span></td>
                  <td>{tx.rooms || '-'}</td>
                  <td className="tx-value">{formatCurrency(tx.transValue)}</td>
                  <td>
                    <span className={`status-badge ${tx.isOffplan === 'Off-Plan' ? 'offplan' : 'ready'}`}>
                      {tx.isOffplan}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button onClick={() => handleView(tx)} title="View"><Eye size={14} /></button>
                    <button onClick={() => handleEdit(tx)} title="Edit"><Edit2 size={14} /></button>
                    <button onClick={() => handleDelete(tx._id)} title="Delete" className="delete"><Trash2 size={14} /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {pagination.pages > 1 && (
        <div className="pagination">
          <button 
            disabled={pagination.page === 1}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
          >
            <ChevronLeft size={16} /> Previous
          </button>
          <span className="page-info">
            Page {pagination.page} of {pagination.pages} ({pagination.total.toLocaleString()} records)
          </span>
          <button 
            disabled={pagination.page === pagination.pages}
            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
          >
            Next <ChevronRight size={16} />
          </button>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <motion.div 
            className="modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowModal(false)}
          >
            <motion.div 
              className="modal-content"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>
                  {modalMode === 'view' && 'Transaction Details'}
                  {modalMode === 'edit' && 'Edit Transaction'}
                  {modalMode === 'create' && 'New Transaction'}
                </h3>
                <button onClick={() => setShowModal(false)}><X size={20} /></button>
              </div>
              
              <div className="modal-body">
                {modalMode === 'view' && selectedTransaction && (
                  <div className="detail-grid">
                    <div className="detail-item">
                      <label>Transaction #</label>
                      <span>{selectedTransaction.transactionNumber}</span>
                    </div>
                    <div className="detail-item">
                      <label>Date</label>
                      <span>{formatDate(selectedTransaction.instanceDate)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Project</label>
                      <span>{selectedTransaction.project || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Area</label>
                      <span>{selectedTransaction.area}</span>
                    </div>
                    <div className="detail-item">
                      <label>Property Type</label>
                      <span>{selectedTransaction.propSubType}</span>
                    </div>
                    <div className="detail-item">
                      <label>Rooms</label>
                      <span>{selectedTransaction.rooms || '-'}</span>
                    </div>
                    <div className="detail-item highlight">
                      <label>Transaction Value</label>
                      <span>{formatCurrency(selectedTransaction.transValue)}</span>
                    </div>
                    <div className="detail-item">
                      <label>Area (sqft)</label>
                      <span>{selectedTransaction.actualArea?.toLocaleString() || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Status</label>
                      <span className={`status-badge ${selectedTransaction.isOffplan === 'Off-Plan' ? 'offplan' : 'ready'}`}>
                        {selectedTransaction.isOffplan}
                      </span>
                    </div>
                    <div className="detail-item">
                      <label>Ownership</label>
                      <span>{selectedTransaction.isFreehold}</span>
                    </div>
                    <div className="detail-item">
                      <label>Parking</label>
                      <span>{selectedTransaction.parking || '-'}</span>
                    </div>
                    <div className="detail-item">
                      <label>Nearest Metro</label>
                      <span>{selectedTransaction.nearestMetro || '-'}</span>
                    </div>
                  </div>
                )}

                {(modalMode === 'edit' || modalMode === 'create') && (
                  <div className="edit-form">
                    <div className="form-row">
                      <div className="form-group">
                        <label>Project Name</label>
                        <input 
                          type="text" 
                          value={editForm.project || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, project: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Area</label>
                        <input 
                          type="text" 
                          value={editForm.area || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, area: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Property Type</label>
                        <select 
                          value={editForm.propSubType || 'Flat'}
                          onChange={(e) => setEditForm(prev => ({ ...prev, propSubType: e.target.value }))}
                        >
                          {PROPERTY_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Rooms</label>
                        <select 
                          value={editForm.rooms || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, rooms: e.target.value }))}
                        >
                          {ROOM_OPTIONS.map(room => <option key={room} value={room}>{room}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Transaction Value (AED)</label>
                        <input 
                          type="number" 
                          value={editForm.transValue || 0}
                          onChange={(e) => setEditForm(prev => ({ ...prev, transValue: Number(e.target.value) }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Area (sqft)</label>
                        <input 
                          type="number" 
                          value={editForm.actualArea || 0}
                          onChange={(e) => setEditForm(prev => ({ ...prev, actualArea: Number(e.target.value) }))}
                        />
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Status</label>
                        <select 
                          value={editForm.isOffplan || 'Off-Plan'}
                          onChange={(e) => setEditForm(prev => ({ ...prev, isOffplan: e.target.value }))}
                        >
                          <option value="Off-Plan">Off-Plan</option>
                          <option value="Ready">Ready</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Ownership</label>
                        <select 
                          value={editForm.isFreehold || 'Free Hold'}
                          onChange={(e) => setEditForm(prev => ({ ...prev, isFreehold: e.target.value }))}
                        >
                          <option value="Free Hold">Freehold</option>
                          <option value="Leasehold">Leasehold</option>
                        </select>
                      </div>
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Parking</label>
                        <input 
                          type="text" 
                          value={editForm.parking || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, parking: e.target.value }))}
                        />
                      </div>
                      <div className="form-group">
                        <label>Nearest Metro</label>
                        <input 
                          type="text" 
                          value={editForm.nearestMetro || ''}
                          onChange={(e) => setEditForm(prev => ({ ...prev, nearestMetro: e.target.value }))}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button className="cancel-btn" onClick={() => setShowModal(false)}>
                  {modalMode === 'view' ? 'Close' : 'Cancel'}
                </button>
                {modalMode !== 'view' && (
                  <button className="save-btn" onClick={handleSave}>
                    {modalMode === 'create' ? 'Create Transaction' : 'Save Changes'}
                  </button>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        .transactions-view {
          padding: 24px;
          background: var(--surface-primary, #fff);
          min-height: 100%;
        }
        
        .transactions-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 24px;
          flex-wrap: wrap;
          gap: 16px;
        }
        
        .transactions-header h2 {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--text-primary, #1A1A1A);
          margin: 0;
        }
        
        .subtitle {
          color: var(--text-muted, #64748b);
          font-size: 0.875rem;
          margin: 4px 0 0 34px;
        }
        
        .header-actions {
          display: flex;
          gap: 10px;
        }
        
        .action-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
          border: none;
        }
        
        .action-btn.primary {
          background: linear-gradient(135deg, #1A1A1A, #1a2d52);
          color: #fff;
        }
        
        .action-btn.primary:hover {
          background: linear-gradient(135deg, #0d2248, #243a63);
          transform: translateY(-1px);
        }
        
        .action-btn.secondary {
          background: var(--surface-secondary, #f8fafc);
          color: var(--text-primary, #1A1A1A);
          border: 1px solid var(--border-color, #e2e8f0);
        }
        
        .action-btn.secondary:hover {
          background: #f1f5f9;
        }
        
        .import-btn {
          cursor: pointer;
        }
        
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-bottom: 24px;
        }
        
        .stat-card {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 18px;
          background: var(--surface-secondary, #f8fafc);
          border-radius: 12px;
          border: 1px solid var(--border-color, #e2e8f0);
        }
        
        .stat-card.highlight {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
          border-color: rgba(212, 175, 55, 0.3);
        }
        
        .stat-icon {
          color: #B03737;
        }
        
        .stat-value {
          font-size: 1.25rem;
          font-weight: 700;
          color: var(--text-primary, #1A1A1A);
        }
        
        .stat-label {
          font-size: 0.75rem;
          color: var(--text-muted, #64748b);
        }
        
        .filters-panel {
          background: var(--surface-secondary, #f8fafc);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          overflow: hidden;
        }
        
        .filters-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
          gap: 16px;
        }
        
        .filter-group label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted, #64748b);
          margin-bottom: 6px;
          text-transform: uppercase;
        }
        
        .filter-group input,
        .filter-group select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 8px;
          font-size: 0.875rem;
          background: #fff;
        }
        
        .search-input {
          position: relative;
        }
        
        .search-input svg {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted, #64748b);
        }
        
        .search-input input {
          padding-left: 36px;
        }
        
        .filter-actions {
          display: flex;
          align-items: flex-end;
        }
        
        .clear-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 10px 14px;
          background: none;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          color: #64748b;
          cursor: pointer;
          font-size: 0.875rem;
        }
        
        .clear-btn:hover {
          background: #fff;
          color: #ef4444;
          border-color: #ef4444;
        }
        
        .table-container {
          background: #fff;
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 12px;
          overflow: hidden;
        }
        
        .loading-state,
        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 20px;
          color: var(--text-muted, #64748b);
        }
        
        .loading-state svg,
        .empty-state svg {
          margin-bottom: 16px;
          opacity: 0.5;
        }
        
        .spin {
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        .transactions-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .transactions-table th {
          padding: 14px 16px;
          text-align: left;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted, #64748b);
          text-transform: uppercase;
          background: var(--surface-secondary, #f8fafc);
          border-bottom: 1px solid var(--border-color, #e2e8f0);
          cursor: pointer;
          white-space: nowrap;
        }
        
        .transactions-table th:hover {
          background: #f1f5f9;
        }
        
        .transactions-table th svg {
          vertical-align: middle;
          margin-left: 4px;
          opacity: 0.5;
        }
        
        .transactions-table td {
          padding: 14px 16px;
          border-bottom: 1px solid var(--border-color, #e2e8f0);
          font-size: 0.875rem;
        }
        
        .transactions-table tr:hover {
          background: rgba(212, 175, 55, 0.03);
        }
        
        .tx-number {
          font-weight: 600;
          color: var(--text-primary, #1A1A1A);
        }
        
        .tx-date {
          color: var(--text-muted, #64748b);
        }
        
        .tx-project {
          max-width: 180px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .tx-value {
          font-weight: 700;
          color: #B03737;
        }
        
        .type-badge {
          display: inline-block;
          padding: 4px 10px;
          background: rgba(59, 130, 246, 0.1);
          color: #3b82f6;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
        }
        
        .status-badge.offplan {
          background: rgba(139, 92, 246, 0.1);
          color: #8b5cf6;
        }
        
        .status-badge.ready {
          background: rgba(16, 185, 129, 0.1);
          color: #10b981;
        }
        
        .actions-cell {
          display: flex;
          gap: 6px;
        }
        
        .actions-cell button {
          padding: 6px 8px;
          background: none;
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 6px;
          cursor: pointer;
          color: var(--text-muted, #64748b);
          transition: all 0.2s;
        }
        
        .actions-cell button:hover {
          background: #f1f5f9;
          color: #1A1A1A;
        }
        
        .actions-cell button.delete:hover {
          background: rgba(239, 68, 68, 0.1);
          color: #ef4444;
          border-color: #ef4444;
        }
        
        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 16px;
          padding: 20px;
        }
        
        .pagination button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 10px 16px;
          background: var(--surface-secondary, #f8fafc);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
        }
        
        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .pagination button:not(:disabled):hover {
          background: #f1f5f9;
        }
        
        .page-info {
          font-size: 0.875rem;
          color: var(--text-muted, #64748b);
        }
        
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .modal-content {
          background: #fff;
          border-radius: 16px;
          width: 100%;
          max-width: 600px;
          max-height: 90vh;
          overflow: auto;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color, #e2e8f0);
        }
        
        .modal-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin: 0;
        }
        
        .modal-header button {
          background: none;
          border: none;
          cursor: pointer;
          color: var(--text-muted, #64748b);
          padding: 4px;
        }
        
        .modal-body {
          padding: 24px;
        }
        
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 16px;
        }
        
        .detail-item {
          padding: 12px;
          background: var(--surface-secondary, #f8fafc);
          border-radius: 8px;
        }
        
        .detail-item.highlight {
          background: linear-gradient(135deg, rgba(212, 175, 55, 0.1), rgba(212, 175, 55, 0.05));
        }
        
        .detail-item label {
          display: block;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--text-muted, #64748b);
          margin-bottom: 4px;
          text-transform: uppercase;
        }
        
        .detail-item span {
          font-size: 0.9375rem;
          font-weight: 500;
          color: var(--text-primary, #1A1A1A);
        }
        
        .edit-form {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        
        .form-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        
        .form-group label {
          display: block;
          font-size: 0.8125rem;
          font-weight: 500;
          margin-bottom: 6px;
          color: var(--text-primary, #1A1A1A);
        }
        
        .form-group input,
        .form-group select {
          width: 100%;
          padding: 10px 12px;
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 8px;
          font-size: 0.875rem;
        }
        
        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 12px;
          padding: 16px 24px;
          border-top: 1px solid var(--border-color, #e2e8f0);
        }
        
        .cancel-btn {
          padding: 10px 20px;
          background: var(--surface-secondary, #f8fafc);
          border: 1px solid var(--border-color, #e2e8f0);
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
        }
        
        .save-btn {
          padding: 10px 20px;
          background: linear-gradient(135deg, #1A1A1A, #1a2d52);
          color: #fff;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
        }
        
        .save-btn:hover {
          background: linear-gradient(135deg, #0d2248, #243a63);
        }
        
        @media (max-width: 768px) {
          .transactions-header {
            flex-direction: column;
          }
          
          .header-actions {
            width: 100%;
            flex-wrap: wrap;
          }
          
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          
          .filters-grid {
            grid-template-columns: 1fr;
          }
          
          .form-row {
            grid-template-columns: 1fr;
          }
          
          .detail-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
      {toasts.length > 0 && (
        <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999, display: 'flex', flexDirection: 'column', gap: '10px', pointerEvents: 'none' }}>
          {toasts.map(t => (
            <div
              key={t.id}
              role={t.color === '#10B981' ? 'status' : 'alert'}
              data-testid="transactions-status-banner"
              style={{ background: t.color, color: 'var(--white, #FFFFFF)', padding: '12px 18px', borderRadius: '10px', fontWeight: 600, fontSize: '0.85rem', boxShadow: '0 4px 20px rgba(0,0,0,0.18)', maxWidth: '360px' }}
            >
              {t.message}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
