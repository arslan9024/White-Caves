import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Building2, MapPin, Users, Phone, Eye, ChevronUp, ChevronDown,
  Search, Layers, DollarSign, Hash
} from 'lucide-react';
import {
  selectFilteredProperties,
  selectOwners,
  setFilter,
  selectFilters
} from '../../../store/slices/inventorySlice';
import './PropertyMatrix.css';

const COLUMNS = [
  { key: 'pNumber', label: 'P-Number', sortable: true },
  { key: 'plotNumber', label: 'Plot No', sortable: true },
  { key: 'cluster', label: 'Cluster', sortable: true },
  { key: 'layout', label: 'Layout', sortable: true },
  { key: 'view', label: 'View', sortable: true },
  { key: 'status', label: 'Status', sortable: true },
  { key: 'floor', label: 'Floor', sortable: true },
  { key: 'rooms', label: 'Rooms', sortable: true },
  { key: 'askingPrice', label: 'Price', sortable: true, format: 'currency' },
  { key: 'owners', label: 'Owners', sortable: false }
];

const formatValue = (value, format) => {
  if (value === null || value === undefined || value === '' || value === '.') return '-';
  if (format === 'currency' && typeof value === 'number' && value > 0) {
    return new Intl.NumberFormat('en-AE', { 
      style: 'currency', 
      currency: 'AED',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(value);
  }
  return String(value);
};

const PropertyMatrix = ({ onPropertySelect, onOwnerSelect }) => {
  const dispatch = useDispatch();
  const properties = useSelector(selectFilteredProperties);
  const owners = useSelector(selectOwners);
  const filters = useSelector(selectFilters);
  
  const [sortBy, setSortBy] = useState('pNumber');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const [visibleColumns, setVisibleColumns] = useState(COLUMNS.map(c => c.key));
  const pageSize = 50;

  const sortedProperties = [...properties].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    aVal = String(aVal || '').toLowerCase();
    bVal = String(bVal || '').toLowerCase();
    
    if (sortOrder === 'asc') {
      return aVal > bVal ? 1 : -1;
    }
    return aVal < bVal ? 1 : -1;
  });

  const paginatedProperties = sortedProperties.slice(
    (page - 1) * pageSize, 
    page * pageSize
  );
  const totalPages = Math.ceil(properties.length / pageSize);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const hasMultipleOwners = (property) => property.owners?.length > 1;
  
  const ownerHasMultiplePhones = (ownerId) => {
    const owner = owners.byId[ownerId];
    if (!owner) return false;
    const phones = owner.contacts?.filter(c => ['mobile', 'phone', 'secondaryMobile'].includes(c.type)) || [];
    return phones.length > 1;
  };

  const renderCell = (property, column) => {
    const value = property[column.key];
    
    switch (column.key) {
      case 'pNumber':
        return <span className="pnumber-cell">{value}</span>;
      
      case 'cluster':
        return <span className="cluster-badge">{value || '-'}</span>;
      
      case 'layout':
        return <span className="layout-badge">{value || '-'}</span>;
      
      case 'view':
        return <span className="view-badge">{value || '-'}</span>;
      
      case 'status':
        return (
          <span className={`status-badge status-${value?.toLowerCase().replace(/\s+/g, '-')}`}>
            {value || 'Unknown'}
          </span>
        );
      
      case 'askingPrice':
        return formatValue(value, 'currency');
      
      case 'owners':
        return (
          <div className="owners-cell">
            {property.owners?.slice(0, 2).map((ownerId) => {
              const owner = owners.byId[ownerId];
              const hasMultiPhone = ownerHasMultiplePhones(ownerId);
              return (
                <button
                  key={ownerId}
                  className={`owner-badge ${hasMultiPhone ? 'multi-phone' : ''}`}
                  onClick={(e) => { e.stopPropagation(); onOwnerSelect?.(owner); }}
                  title={owner?.name}
                >
                  <Users size={11} />
                  <span>{owner?.name?.split(' ')[0] || 'Unknown'}</span>
                  {hasMultiPhone && <Phone size={9} className="multi-phone-icon" />}
                </button>
              );
            })}
            {hasMultipleOwners(property) && property.owners.length > 2 && (
              <span className="multi-owner-indicator" title={`${property.owners.length} owners total`}>
                +{property.owners.length - 2}
              </span>
            )}
          </div>
        );
      
      default:
        return formatValue(value);
    }
  };

  const SortIcon = ({ field }) => {
    if (sortBy !== field) return null;
    return sortOrder === 'asc' ? <ChevronUp size={12} /> : <ChevronDown size={12} />;
  };

  return (
    <div className="property-matrix">
      <div className="matrix-header">
        <div className="matrix-info">
          <Building2 size={20} />
          <span>Showing {paginatedProperties.length} of {properties.length.toLocaleString()} properties</span>
        </div>
        <div className="matrix-search">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search P-Number, plot, project, or owner..."
            value={filters.searchQuery}
            onChange={(e) => dispatch(setFilter({ key: 'searchQuery', value: e.target.value }))}
          />
        </div>
      </div>

      <div className="matrix-table-wrapper">
        <table className="matrix-table">
          <thead>
            <tr>
              {COLUMNS.filter(c => visibleColumns.includes(c.key)).map(column => (
                <th 
                  key={column.key} 
                  onClick={() => column.sortable && handleSort(column.key)}
                  className={column.sortable ? 'sortable' : ''}
                >
                  {column.label}
                  {column.sortable && <SortIcon field={column.key} />}
                </th>
              ))}
              <th>View</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProperties.map(property => (
              <tr 
                key={property.pNumber} 
                className={hasMultipleOwners(property) ? 'multi-owner-row' : ''}
                onClick={() => onPropertySelect?.(property)}
              >
                {COLUMNS.filter(c => visibleColumns.includes(c.key)).map(column => (
                  <td key={column.key}>{renderCell(property, column)}</td>
                ))}
                <td>
                  <button 
                    className="view-btn" 
                    onClick={(e) => { e.stopPropagation(); onPropertySelect?.(property); }}
                  >
                    <Eye size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="matrix-pagination">
          <button 
            disabled={page === 1}
            onClick={() => setPage(1)}
          >
            First
          </button>
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  className={page === pageNum ? 'active' : ''}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(totalPages)}
          >
            Last
          </button>
          <span className="page-info">({properties.length.toLocaleString()} total)</span>
        </div>
      )}
    </div>
  );
};

export default PropertyMatrix;
