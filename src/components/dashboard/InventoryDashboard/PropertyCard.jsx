import React from 'react';
import './PropertyCard.css';

const PropertyCard = ({
  property,
  inventory,
  onViewDetails,
  onCreateOffer,
  onAssignAgent,
  onUpdateStatus,
}) => {
  // Format P number
  const pNumber = property.pNumber || 'N/A';
  
  // Get status info
  const tenancyStatus = inventory?.status || 'unknown';
  const statusLabel = tenancyStatus.replace(/_/g, ' ').charAt(0).toUpperCase() + tenancyStatus.slice(1).replace(/_/g, ' ');
  
  // Get status color
  const getStatusColor = (status) => {
    const statusMap = {
      'available': '#10b981',
      'offer_in_progress': '#f59e0b',
      'offer_approved': '#8b5cf6',
      'contract_generation': '#EF4444',
      'contract_signature': '#06b6d4',
      'signed': '#8b5cf6',
      'occupied': '#ef4444',
      'maintenance': '#6b7280',
      'ready_for_leasing': '#10b981',
      'archived': '#9ca3af',
    };
    return statusMap[status] || '#6b7280';
  };

  const assignedAgent = inventory?.assignedAgents?.[0]?.agentId;

  return (
    <div className='property-card'>
      <div className='property-image-container'>
        {property.images && property.images.length > 0 ? (
          <img
            src={property.images[0]}
            alt={property.layout || 'Property'}
            className='property-image'
          />
        ) : (
          <div className='property-image-placeholder'>
            <span></span>
          </div>
        )}
        <div
          className='property-status-badge'
          style={{ backgroundColor: getStatusColor(tenancyStatus) }}
        >
          {statusLabel}
        </div>
      </div>

      <div className='property-content'>
        <div className='property-header'>
          <h4 className='property-pnumber'>{pNumber}</h4>
          <span className='property-type'>{property.propertyType || 'Property'}</span>
        </div>

        <div className='property-info'>
          <p className='property-area'>{property.area}</p>
          <p className='property-layout'>{property.layout || 'N/A'}</p>
          <p className='property-size'>
            {property.actualArea} {property.areaUnit || 'sqft'}
          </p>
        </div>

        <div className='property-metadata'>
          <div className='meta-item'>
            <span className='meta-label'>Rooms:</span>
            <span className='meta-value'>{property.rooms || 'N/A'}</span>
          </div>
          <div className='meta-item'>
            <span className='meta-label'>Price:</span>
            <span className='meta-value'>
              AED {property.askingPrice?.toLocaleString() || 'N/A'}
            </span>
          </div>
        </div>

        {assignedAgent && (
          <div className='property-agent'>
            <span className='agent-label'>Agent:</span>
            <span className='agent-name'>{assignedAgent.name || 'Assigned'}</span>
          </div>
        )}

        <div className='property-actions'>
          <button
            className='action-btn view-btn'
            onClick={() => onViewDetails(property)}
            title='View Details'
          >
             View
          </button>
          {tenancyStatus === 'available' && (
            <button
              className='action-btn offer-btn'
              onClick={() => onCreateOffer(property)}
              title='Create Offer'
            >
               Offer
            </button>
          )}
          <button
            className='action-btn assign-btn'
            onClick={() => onAssignAgent(property)}
            title='Assign Agent'
          >
             Assign
          </button>
        </div>

        {inventory?.visibleTo?.mary && (
          <div className='mary-visible-badge'> Mary Visible</div>
        )}
      </div>
    </div>
  );
};

export default PropertyCard;
