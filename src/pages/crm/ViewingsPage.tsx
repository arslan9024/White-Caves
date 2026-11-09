import React, { useState } from 'react';
import styled from 'styled-components';
import { colors, spacing, borderRadius, typography, media } from '@/design-tokens';
import { MobileViewingCard, Viewing } from '../../components/owner/tabs/MobileViewingCard';
import { FilterSelect } from '../../components/owner/tabs/TabStylesComponents';
import PageMeta from '../../components/seo/PageMeta';
import { TaskActionBar } from '../../components/common/UnsavedChangesModal';
import { Calendar, Clock, X } from 'lucide-react';

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
  const [reschedulingViewingId, setReschedulingViewingId] = useState<string | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<string>('');

  const handleConfirm = (id: string) => {
    setViewings(prev => prev.map(v => (v.id === id ? { ...v, status: 'Confirmed' } : v)));
  };

  const handleReschedule = (id: string) => {
    const target = viewings.find(v => v.id === id);
    if (target) {
      setReschedulingViewingId(id);
      const d = new Date(target.scheduledAt);
      const isoLocal = new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
      setSelectedDateTime(isoLocal);
    }
  };

  const handleSaveReschedule = () => {
    if (!reschedulingViewingId || !selectedDateTime) return;
    setViewings(prev =>
      prev.map(v =>
        v.id === reschedulingViewingId
          ? { ...v, scheduledAt: new Date(selectedDateTime).toISOString(), status: 'Pending' }
          : v
      )
    );
    setReschedulingViewingId(null);
    setSelectedDateTime('');
  };

  const handleCancelReschedule = () => {
    setReschedulingViewingId(null);
    setSelectedDateTime('');
  };

  const activeViewing = viewings.find(v => v.id === reschedulingViewingId);

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

      {reschedulingViewingId && activeViewing && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="reschedule-viewing-title"
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '1rem',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 480,
              backgroundColor: '#0F172A',
              borderRadius: 16,
              border: '1px solid rgba(255, 255, 255, 0.15)',
              padding: '1.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <Calendar size={20} color="#EF4444" />
                <h3 id="reschedule-viewing-title" style={{ margin: 0, color: '#FFFFFF', fontSize: '1.125rem' }}>
                  Reschedule Viewing
                </h3>
              </div>
              <button
                type="button"
                onClick={handleCancelReschedule}
                style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
              >
                <X size={18} />
              </button>
            </div>

            <div>
              <p style={{ margin: 0, color: '#94A3B8', fontSize: '0.875rem' }}>
                Client: <strong style={{ color: '#FFFFFF' }}>{activeViewing.leadName}</strong>
              </p>
              <p style={{ margin: '0.25rem 0 0', color: '#94A3B8', fontSize: '0.875rem' }}>
                Property: <strong style={{ color: '#FFFFFF' }}>{activeViewing.propertyName}</strong>
              </p>
            </div>

            <div>
              <label style={{ display: 'block', color: '#CBD5E1', fontSize: '0.8125rem', marginBottom: '0.5rem', fontWeight: 600 }}>
                Select New Date & Time
              </label>
              <input
                type="datetime-local"
                data-testid="reschedule-datetime-input"
                value={selectedDateTime}
                onChange={e => setSelectedDateTime(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  background: '#1E293B',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: 8,
                  color: '#FFFFFF',
                  fontSize: '0.9rem',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <TaskActionBar
              isDirty={Boolean(selectedDateTime)}
              onSave={handleSaveReschedule}
              onCancel={handleCancelReschedule}
              saveLabel="Confirm Reschedule"
              cancelLabel="Cancel"
              saveTestId="confirm-reschedule-btn"
            />
          </div>
        </div>
      )}
    </PageContainer>
  );
};

export default ViewingsPage;
