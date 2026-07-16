import React, { useState } from 'react';
import styled from 'styled-components';
import { colors, spacing, borderRadius, typography, media } from '@/design-tokens';
import { MobileViewingCard, Viewing } from '../../components/owner/tabs/MobileViewingCard';
import { FilterSelect } from '../../components/owner/tabs/TabStylesComponents';
import PageMeta from '../../components/seo/PageMeta';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${spacing[6]};
  font-family: 'Inter', sans-serif;
  color: ${colors.text.primary};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${spacing[6]};

  ${media.sm} {
    flex-direction: column;
    align-items: flex-start;
    gap: ${spacing[3]};
  }
`;

const Title = styled.h1`
  margin: 0;
  ${typography.presets.heading1};
  color: ${colors.primary[500]};
`;

const FilterContainer = styled.div`
  display: flex;
  gap: ${spacing[3]};
  align-items: center;
  width: 100%;
  max-width: 320px;
`;

const Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: ${spacing[8]};
  background: ${colors.background.surface};
  border-radius: ${borderRadius.lg};
  border: 1px dashed ${colors.border.default};
  color: ${colors.text.secondary};
`;

const MOCK_VIEWINGS: Viewing[] = [
  {
    id: 'v-1',
    leadName: 'Amna Al Suwaidi',
    propertyName: 'Signature Villa, Palm Jumeirah',
    scheduledAt: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    status: 'Pending',
  },
  {
    id: 'v-2',
    leadName: 'Michael Schumacher',
    propertyName: 'Emirates Hills Mansion Sector E',
    scheduledAt: new Date(Date.now() + 172800000).toISOString(), // Day after tomorrow
    status: 'Confirmed',
  },
  {
    id: 'v-3',
    leadName: 'Alexander Petrov',
    propertyName: 'Royal Penthouse, Downtown Dubai',
    scheduledAt: new Date(Date.now() + 259200000).toISOString(),
    status: 'Pending',
  },
];

export const ViewingsPage: React.FC = () => {
  const [viewings, setViewings] = useState<Viewing[]>(MOCK_VIEWINGS);
  const [filter, setFilter] = useState<string>('all');

  const handleConfirm = (id: string) => {
    setViewings(prev => prev.map(v => (v.id === id ? { ...v, status: 'Confirmed' } : v)));
  };

  const handleReschedule = (id: string) => {
    const newDate = prompt('Enter new date/time (YYYY-MM-DD HH:MM):');
    if (newDate) {
      setViewings(prev =>
        prev.map(v =>
          v.id === id
            ? { ...v, scheduledAt: new Date(newDate).toISOString(), status: 'Pending' }
            : v
        )
      );
    }
  };

  const filteredViewings = viewings.filter(v => {
    if (filter === 'all') return true;
    return v.status.toLowerCase() === filter.toLowerCase();
  });

  return (
    <PageContainer>
      <PageMeta
        title="Manage Property Viewings"
        description="Review, confirm, or reschedule client property viewings in real time."
        canonicalPath="/crm/viewings"
      />

      <Header>
        <Title>📅 Client Viewings</Title>
        <FilterContainer>
          <FilterSelect
            aria-label="Filter viewings by status"
            value={filter}
            onChange={e => setFilter(e.target.value)}
            style={{ width: '100%' }}
          >
            <option value="all">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
          </FilterSelect>
        </FilterContainer>
      </Header>

      {filteredViewings.length === 0 ? (
        <EmptyState role="status">
          <p style={{ fontSize: '2rem', margin: '0 0 0.5rem' }}>📅</p>
          <p>No viewings found for status "{filter}"</p>
        </EmptyState>
      ) : (
        <Grid role="list" aria-label="Scheduled viewings list">
          {filteredViewings.map(viewing => (
            <div key={viewing.id} role="listitem">
              <MobileViewingCard
                viewing={viewing}
                onConfirm={handleConfirm}
                onReschedule={handleReschedule}
              />
            </div>
          ))}
        </Grid>
      )}
    </PageContainer>
  );
};

export default ViewingsPage;
