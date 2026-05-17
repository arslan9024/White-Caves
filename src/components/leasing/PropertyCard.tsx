import React from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    unitNumber?: string;
    rentalPrice?: number;
    titleDeedMissing: boolean;
    landlordPassportMissing: boolean;
    ejariMissing: boolean;
  };
  onClick: (id: string) => void;
}

const Card = styled.div`
  background: ${theme.colors.background.primary};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.md};
  cursor: pointer;
  box-shadow: ${theme.shadows.sm};
  transition: transform 0.2s, box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
    border-color: ${theme.colors.primary};
  }
`;

const Title = styled.h4`
  margin: 0 0 ${theme.spacing.xs};
  color: ${theme.colors.text.primary};
  font-size: 1rem;
`;

const UnitNumber = styled.div`
  font-size: 0.875rem;
  color: ${theme.colors.text.secondary};
  margin-bottom: ${theme.spacing.sm};
`;

const WarningBadge = styled.span`
  display: inline-block;
  background: ${theme.colors.error}20;
  color: ${theme.colors.error};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  margin-right: 4px;
  margin-bottom: 4px;
  font-weight: 500;
`;

const Price = styled.div`
  font-weight: bold;
  color: ${theme.colors.primary};
  margin-top: ${theme.spacing.sm};
`;

export const PropertyCard: React.FC<PropertyCardProps> = ({ property, onClick }) => {
  const missingDocs = [];
  if (property.titleDeedMissing) missingDocs.push('Title Deed');
  if (property.landlordPassportMissing) missingDocs.push('Passport');
  if (property.ejariMissing) missingDocs.push('Ejari');

  return (
    <Card onClick={() => onClick(property.id)}>
      <Title>{property.title}</Title>
      {property.unitNumber && <UnitNumber>Unit: {property.unitNumber}</UnitNumber>}
      
      <div>
        {missingDocs.map((doc, idx) => (
          <WarningBadge key={idx}>Missing: {doc}</WarningBadge>
        ))}
      </div>
      
      {property.rentalPrice && (
        <Price>AED {property.rentalPrice.toLocaleString()}/year</Price>
      )}
    </Card>
  );
};
