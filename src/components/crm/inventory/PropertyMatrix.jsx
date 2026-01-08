import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Building2, MapPin, Users, Phone, Eye, ChevronUp, ChevronDown,
  Search, Filter
} from 'lucide-react';
import {
  selectFilteredProperties,
  selectOwners,
  setFilter,
  selectFilters
} from '../../../store/slices/inventorySlice';
import './PropertyMatrix.css';

const PropertyMatrix = ({ onPropertySelect, onOwnerSelect }) => {
  const dispatch = useDispatch();
  const properties = useSelector(selectFilteredProperties);
  const owners = useSelector(selectOwners);
  const filters = useSelector(selectFilters);
  
  const [sortBy, setSortBy] = useState('pNumber');
  const [sortOrder, setSortOrder] = useState('asc');
  const [page, setPage] = useState(1);
  const pageSize = 50;

  const sortedProperties = [...properties].sort((a, b) => {
    const aVal = a[sortBy] || '';
    const bVal = b[sortBy] || '';
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

  const getOwnerNames = (ownerIds) => {
    return ownerIds?.map(id => owners.byId[id]?.name).filter(Boolean) || [];
  };

  const hasMultipleOwners = (property) => property.owners?.length > 1;
  
  const ownerHasMultiplePhones = (ownerId) => {
    const owner = owners.byId[ownerId];
    if (!owner) return false;
    const phones = owner.contacts?.filter(c => c.type === 'mobile' || c.type === 'phone') || [];
    return phones.length > 1;
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
            placeholder="Search by P-Number, project, or owner..."
            value={filters.searchQuery}
            onChange={(e) => dispatch(setFilter({ key: 'searchQuery', value: e.target.value }))}
          />
        </div>
      </div>

      <div className="matrix-table-wrapper">
        <table className="matrix-table">
          <thead>
            <tr>
              <th onClick={() => handleSort('pNumber')}>
                P-Number {sortBy === 'pNumber' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </th>
              <th onClick={() => handleSort('cluster')}>
                Cluster {sortBy === 'cluster' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </th>
              <th onClick={() => handleSort('area')}>
                Area {sortBy === 'area' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </th>
              <th>Owners</th>
              <th onClick={() => handleSort('status')}>
                Status {sortBy === 'status' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </th>
              <th onClick={() => handleSort('rooms')}>
                Rooms {sortBy === 'rooms' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </th>
              <th onClick={() => handleSort('actualArea')}>
                Size {sortBy === 'actualArea' && (sortOrder === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />)}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedProperties.map(property => (
              <tr key={property.pNumber} className={hasMultipleOwners(property) ? 'multi-owner-row' : ''}>
                <td>
                  <span className="pnumber-cell">{property.pNumber}</span>
                </td>
                <td>
                  <span className="cluster-badge">{property.cluster || '-'}</span>
                </td>
                <td>
                  <div className="area-cell">
                    <MapPin size={12} />
                    {property.area || '-'}
                  </div>
                </td>
                <td>
                  <div className="owners-cell">
                    {property.owners?.map((ownerId, idx) => {
                      const owner = owners.byId[ownerId];
                      const hasMultiPhone = ownerHasMultiplePhones(ownerId);
                      return (
                        <button
                          key={ownerId}
                          className={`owner-badge ${hasMultiPhone ? 'multi-phone' : ''}`}
                          onClick={() => onOwnerSelect?.(owner)}
                          title={owner?.name}
                        >
                          <Users size={12} />
                          <span>{owner?.name?.split(' ')[0] || 'Unknown'}</span>
                          {hasMultiPhone && <Phone size={10} className="multi-phone-icon" />}
                        </button>
                      );
                    })}
                    {hasMultipleOwners(property) && (
                      <span className="multi-owner-indicator" title="Multiple owners">
                        +{property.owners.length}
                      </span>
                    )}
                  </div>
                </td>
                <td>
                  <span className={`status-badge status-${property.status?.toLowerCase().replace(/\s+/g, '-')}`}>
                    {property.status || 'Unknown'}
                  </span>
                </td>
                <td>{property.rooms || 0}</td>
                <td>{property.actualArea ? `${property.actualArea.toLocaleString()} sqft` : '-'}</td>
                <td>
                  <button className="view-btn" onClick={() => onPropertySelect?.(property)}>
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
            onClick={() => setPage(p => Math.max(1, p - 1))}
          >
            Previous
          </button>
          <span>Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages}
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default PropertyMatrix;
