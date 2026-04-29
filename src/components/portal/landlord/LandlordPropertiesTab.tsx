/**
 * LandlordPropertiesTab — Phase 2.2: My Properties
 *
 * Read-only list of properties owned by the current landlord,
 * filtered by ownerId. Each property card shows:
 * - Title, address, type, status, monthly rent, tenant name
 * - Click to view details (property detail modal)
 * - Empty state if no properties
 *
 * @component
 */

import React, { FC, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../../store/store';
import './LandlordPropertiesTab.css';

interface PropertyData {
  id: string;
  title: string;
  address: string;
  type: string;
  status: 'vacant' | 'occupied';
  monthlyRent: number;
  tenantName?: string;
  leaseStart?: string;
  leaseEnd?: string;
  deposit?: number;
}

interface DetailModalProps {
  property: PropertyData;
  onClose: () => void;
}

const PropertyDetailModal: FC<DetailModalProps> = ({ property, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose} data-testid="property-detail-modal">
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{property.title}</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        </div>

        <div className="modal-body">
          <div className="detail-section">
            <h3>Property Information</h3>
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Address</span>
                <span className="value">{property.address}</span>
              </div>
              <div className="detail-item">
                <span className="label">Type</span>
                <span className="value">{property.type}</span>
              </div>
              <div className="detail-item">
                <span className="label">Status</span>
                <span className={`badge badge-${property.status}`}>
                  {property.status === 'occupied' ? 'Occupied' : 'Vacant'}
                </span>
              </div>
              <div className="detail-item">
                <span className="label">Monthly Rent</span>
                <span className="value">AED {property.monthlyRent.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {property.tenantName && (
            <div className="detail-section">
              <h3>Tenant Information</h3>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="label">Tenant Name</span>
                  <span className="value">{property.tenantName}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Lease Start</span>
                  <span className="value">{property.leaseStart}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Lease End</span>
                  <span className="value">{property.leaseEnd}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Deposit Amount</span>
                  <span className="value">AED {property.deposit?.toLocaleString() ?? 'N/A'}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-primary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

const LandlordPropertiesTab: FC = () => {
  const currentUser = useSelector((state: RootState) => state.user.currentUser);
  const [selectedProperty, setSelectedProperty] = useState<PropertyData | null>(null);

  // TODO: Replace with actual Redux selector or API call
  // For now, using mock data. Will be connected to Redux store in full implementation.
  const mockProperties: PropertyData[] = useMemo(
    () => [
      {
        id: 'prop-1',
        title: 'Marina View 2BR Apartment',
        address: 'Dubai Marina, Plot 12',
        type: 'Apartment',
        status: 'occupied',
        monthlyRent: 8000,
        tenantName: 'Ahmed Al-Rashid',
        leaseStart: 'Jan 1, 2024',
        leaseEnd: 'Dec 31, 2024',
        deposit: 16000,
      },
      {
        id: 'prop-2',
        title: 'Downtown Studio',
        address: 'Downtown Dubai, Tower A',
        type: 'Studio',
        status: 'occupied',
        monthlyRent: 5000,
        tenantName: 'Sarah Johnson',
        leaseStart: 'Jul 1, 2023',
        leaseEnd: 'Jun 30, 2024',
        deposit: 10000,
      },
      {
        id: 'prop-3',
        title: 'JBR 3BR Villa',
        address: 'Jumeirah Beach Residence, Block C',
        type: 'Villa',
        status: 'vacant',
        monthlyRent: 12000,
      },
    ],
    []
  );

  if (!currentUser) {
    return (
      <div className="empty-state">
        <p>You must be logged in to view your properties.</p>
      </div>
    );
  }

  return (
    <div className="landlord-properties-tab">
      {mockProperties.length === 0 ? (
        <div className="empty-state" data-testid="empty-state">
          <p>No properties registered yet. Contact your agent to add your properties.</p>
        </div>
      ) : (
        <div className="properties-grid">
          {mockProperties.map(property => (
            <div
              key={property.id}
              className={`property-card ${property.status}`}
              onClick={() => setSelectedProperty(property)}
              role="button"
              tabIndex={0}
              aria-label={`${property.title} - ${property.status}`}
              onKeyPress={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  setSelectedProperty(property);
                }
              }}
              data-testid={`property-card-${property.id}`}
            >
              <div className="card-header">
                <h3 className="card-title">{property.title}</h3>
                <span className={`status-badge status-${property.status}`}>
                  {property.status === 'occupied' ? 'Occupied' : 'Vacant'}
                </span>
              </div>

              <div className="card-body">
                <div className="property-info">
                  <p className="address">📍 {property.address}</p>
                  <p className="type">🏠 {property.type}</p>
                  <p className="rent">💰 AED {property.monthlyRent.toLocaleString()}/month</p>
                  {property.tenantName && <p className="tenant">👤 {property.tenantName}</p>}
                </div>
              </div>

              <div className="card-footer">
                <button
                  className="btn-secondary"
                  onClick={e => {
                    e.stopPropagation();
                    setSelectedProperty(property);
                  }}
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedProperty && (
        <PropertyDetailModal
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}
    </div>
  );
};

export default LandlordPropertiesTab;
