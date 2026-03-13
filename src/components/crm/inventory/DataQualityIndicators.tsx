import React from 'react';
import { useSelector } from 'react-redux';
import { Users, Phone, Building2, AlertTriangle, CheckCircle } from 'lucide-react';
import {
  selectInventoryStats,
  selectMultiOwnerProperties,
  selectOwnersWithMultipleProperties,
  selectOwnersWithMultiplePhones
} from '../../../store/slices/inventorySlice';
import {
  DataQualityIndicatorsContainer,
  IndicatorsHeader,
  IndicatorsGrid,
  IndicatorCard,
  IndicatorIcon,
  IndicatorContent,
  IndicatorValue,
  IndicatorLabel,
  IndicatorDesc
} from './DataQualityIndicators.styles';

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
    <DataQualityIndicatorsContainer>
      <IndicatorsHeader>
        <AlertTriangle size={18} />
        <h3>Data Quality Insights</h3>
      </IndicatorsHeader>
      <IndicatorsGrid>
        {indicators.map(indicator => (
          <IndicatorCard
            key={indicator.id}
            $accentColor={indicator.color}
            onClick={() => onFilterClick?.(indicator.filterKey)}
          >
            <IndicatorIcon>
              <indicator.icon size={24} />
            </IndicatorIcon>
            <IndicatorContent>
              <IndicatorValue>{indicator.value.toLocaleString()}</IndicatorValue>
              <IndicatorLabel>{indicator.label}</IndicatorLabel>
              <IndicatorDesc>{indicator.description}</IndicatorDesc>
            </IndicatorContent>
          </IndicatorCard>
        ))}
      </IndicatorsGrid>
    </DataQualityIndicatorsContainer>
  );
};

export default DataQualityIndicators;
