import React from 'react';
import './PropertyListItem.css';

const PropertyListItem = ({
  property,
  inventory,
  onViewDetails,
  onCreateOffer,
  onAssignAgent,
}) => {
  const pNumber = property.pNumber || 'N/A';
  const tenancyStatus = inventory?.status || 'unknown';

  const getStatusColor = (status) => {
    const statusMap = {
      'available': '#10b981',
      'offer_in_progress': '#f59e0b',
      'offer_approved': '#8b5cf6',
      'contract_generation': '#3b82f6',
      'contract_signature': '#06b6d4',
      'signed': '#8b5cf6',
      'occupied': '#ef4444',
      'maintenance': '#6b7280',
      'ready_for_leasing': '#10b981',
      'archived': '#9ca3af',
    };
    return statusMap[status] || '#6b7280';
  };

  const statusLabel = tenancyStatus
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  const assignedAgent = inventory?.assignedAgents?.[0]?.agentId;

  return (
    <div className='property-list-item'>
      <div className='list-item-cell list-pnumber'>
        <strong>{pNumber}</strong>
      </div>

      <div className='list-item-cell list-area'>
        <span>{property.area}</span>
      </div>

      <div className='list-item-cell list-project'>
        <span className='project-name'>{property.project}</span>
      </div>

      <div className='list-item-cell list-type'>
        <span className='type-badge'>{property.propertyType || 'N/A'}</span>
      </div>

      <div className='list-item-cell list-layout'>
        <span>{property.layout || 'N/A'}</span>
      </div>

      <div className='list-item-cell list-size'>
        <span>
          {property.actualArea} {property.areaUnit || 'sqft'}
        </span>
      </div>

      <div className='list-item-cell list-status'>
        <span
          className='status-badge'
          style={{ backgroundColor: getStatusColor(tenancyStatus) }}
        >
          {statusLabel}
        </span>
      </div>

      <div className='list-item-cell list-agent'>
        {assignedAgent ? (
          <span className='agent-info'>{assignedAgent.name}</span>
        ) : (
          <span className='no-agent'></span>
        )}
      </div>

      <div className='list-item-cell list-actions'>
        <button
          className='action-link'
          onClick={() => onViewDetails(property)}
          title='View'
        >
          
        </button>
        {tenancyStatus === 'available' && (
          <button
            className='action-link'
            onClick={() => onCreateOffer(property)}
            title='Offer'
          >
            
          </button>
        )}
        <button
          className='action-link'
          onClick={() => onAssignAgent(property)}
          title='Assign'
        >
          
        </button>
      </div>
    </div>
  );
};

export default PropertyListItem;
