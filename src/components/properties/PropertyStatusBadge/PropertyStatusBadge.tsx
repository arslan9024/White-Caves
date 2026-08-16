/**
 * PropertyStatusBadge — Wave 62 FE-GOAL-070
 * Color-coded property availability status badge (Available / Under Offer / Sold / Off-Market)
 * White Caves Real Estate LLC — Property Detail Suite
 */
import React, { FC } from 'react';
import styled from 'styled-components';

export type PropertyStatus = 'AVAILABLE' | 'UNDER_OFFER' | 'SOLD' | 'RENTED' | 'OFF_MARKET';

const Badge = styled.span<{ $status: PropertyStatus }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: 999px;
  font-family: 'Inter', sans-serif;
  font-size: 0.68rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  background: ${p => 
    p.$status === 'AVAILABLE' ? 'rgba(16, 185, 129, 0.15)' :
    p.$status === 'UNDER_OFFER' ? 'rgba(245, 158, 11, 0.15)' :
    p.$status === 'SOLD' ? 'rgba(239, 68, 68, 0.15)' :
    p.$status === 'OFF_MARKET' ? 'rgba(139, 92, 246, 0.15)' : 'rgba(56, 189, 248, 0.15)'
  };
  border: 1px solid ${p => 
    p.$status === 'AVAILABLE' ? '#10B981' :
    p.$status === 'UNDER_OFFER' ? '#F59E0B' :
    p.$status === 'SOLD' ? '#EF4444' :
    p.$status === 'OFF_MARKET' ? '#8B5CF6' : '#38BDF8'
  };
  color: ${p => 
    p.$status === 'AVAILABLE' ? '#10B981' :
    p.$status === 'UNDER_OFFER' ? '#F59E0B' :
    p.$status === 'SOLD' ? '#EF4444' :
    p.$status === 'OFF_MARKET' ? '#A78BFA' : '#38BDF8'
  };
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
`;

export const PropertyStatusBadge: FC<{ status?: PropertyStatus }> = ({ status = 'AVAILABLE' }) => {
  const labelMap: Record<PropertyStatus, string> = {
    AVAILABLE: 'AVAILABLE FOR SALE',
    UNDER_OFFER: 'UNDER FORM B OFFER',
    SOLD: 'SOLD & TRANSFERRED',
    RENTED: 'TENANCY OCCUPIED',
    OFF_MARKET: 'OFF-MARKET PRIVATE VAULT',
  };

  return (
    <Badge $status={status} data-testid="property-status-badge">
      <Dot />
      <span>{labelMap[status]}</span>
    </Badge>
  );
};

export default PropertyStatusBadge;
