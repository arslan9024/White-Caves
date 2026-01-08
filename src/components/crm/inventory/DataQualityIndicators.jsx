import React from 'react';
import { useSelector } from 'react-redux';
import { Users, Phone, Building2, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  selectInventoryStats,
  selectMultiOwnerProperties,
  selectOwnersWithMultipleProperties,
  selectOwnersWithMultiplePhones
} from '../../../store/slices/inventorySlice';
import './DataQualityIndicators.css';

const DataQualityIndicators = ({ onFilterClick }) => {
  const stats = useSelector(selectInventoryStats);
  const multiOwnerProps = useSelector(selectMultiOwnerProperties);
  const multiPropertyOwners = useSelector(selectOwnersWithMultipleProperties);
  const multiPhoneOwners = useSelector(selectOwnersWithMultiplePhones);

  const indicators = [
    {
      id: 'multiOwner',
      label: 'Multi-Owner Properties',
      value: multiOwnerProps.length || stats.multiOwnerProperties || 0,
      icon: Users,
      color: '#f59e0b',
      description: 'Properties with 2+ owners',
      filterKey: 'showMultiOwner'
    },
    {
      id: 'multiProperty',
      label: 'Owners with Multiple Properties',
      value: multiPropertyOwners.length || stats.ownersWithMultipleProperties || 0,
      icon: Building2,
      color: '#8b5cf6',
      description: 'Owners with 2+ properties',
      filterKey: 'showMultiProperty'
    },
    {
      id: 'multiPhone',
      label: 'Owners with Multiple Phones',
      value: multiPhoneOwners.length || stats.ownersWithMultiplePhones || 0,
      icon: Phone,
      color: '#3b82f6',
      description: 'Owners with 2+ phone numbers',
      filterKey: 'showMultiPhone'
    }
  ];

  return (
    <div className="data-quality-indicators">
      <div className="indicators-header">
        <AlertTriangle size={18} />
        <h3>Data Quality Insights</h3>
      </div>
      <div className="indicators-grid">
        {indicators.map(indicator => (
          <button
            key={indicator.id}
            className="indicator-card"
            onClick={() => onFilterClick?.(indicator.filterKey)}
            style={{ '--accent-color': indicator.color }}
          >
            <div className="indicator-icon">
              <indicator.icon size={24} />
            </div>
            <div className="indicator-content">
              <span className="indicator-value">{indicator.value.toLocaleString()}</span>
              <span className="indicator-label">{indicator.label}</span>
              <span className="indicator-desc">{indicator.description}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DataQualityIndicators;
