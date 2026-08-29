import React, { useState, useMemo } from 'react';
import { getAllJourneys, getJourneyById } from './registry/journeyRegistry';
import { JourneyDefinition, JourneyCategory } from '../../types/journey';
import { JourneyEngineService } from '../../services/journeys/journeyEngineService';
import { JourneyShell } from './components/JourneyShell';

export interface AuthUser {
  id?: string;
  name?: string;
  email?: string;
  role?: string;
  [key: string]: unknown;
}

interface JourneyHubViewProps {
  moduleId?: string;
  role?: string;
  user?: AuthUser;
}

export const JourneyHubView: React.FC<JourneyHubViewProps> = ({ moduleId }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeJourney, setActiveJourney] = useState<JourneyDefinition | null>(null);
  const [viewTab, setViewTab] = useState<'catalog' | 'history'>('catalog');

  const allJourneys = useMemo(() => getAllJourneys(), []);
  const lifecycleHistory = useMemo(() => JourneyEngineService.getLifecycleHistory(), [activeJourney]);

  // If moduleId maps to a specific journey (e.g. 'prepare-tenancy-contract')
  React.useEffect(() => {
    if (moduleId && moduleId !== 'journeys') {
      const found = getJourneyById(moduleId);
      if (found) {
        setActiveJourney(found);
      }
    }
  }, [moduleId]);

  const categories = [
    { id: 'all', label: 'All 20 Journeys', icon: '🌟' },
    { id: 'leasing', label: 'Leasing', icon: '📋' },
    { id: 'sales', label: 'Sales', icon: '🤝' },
    { id: 'finance', label: 'Finance', icon: '💳' },
    { id: 'wealth', label: 'VIP Wealth', icon: '👑' },
    { id: 'compliance', label: 'Compliance', icon: '🛡️' },
    { id: 'property', label: 'Property', icon: '🏠' },
    { id: 'projects', label: 'Off-Plan', icon: '🏗️' },
    { id: 'marketing', label: 'Marketing', icon: '🎯' },
    { id: 'community', label: 'Community', icon: '🏘️' },
    { id: 'property-management', label: 'Management', icon: '🔍' },
  ];

  const filteredJourneys = useMemo(() => {
    return allJourneys.filter(j => {
      const matchCat = selectedCategory === 'all' || j.category === selectedCategory;
      const matchQuery =
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.family.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchQuery;
    });
  }, [allJourneys, selectedCategory, searchQuery]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', fontFamily: 'Inter, sans-serif' }}>
      {/* Top Banner & Stats */}
      <div
        style={{
          background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)',
          borderRadius: '16px',
          padding: '1.5rem',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          boxShadow: '0 8px 24px rgba(0, 0, 0, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.6rem' }}>🗺️</span>
            <h2 style={{ margin: 0, fontSize: '1.4rem', fontWeight: 800, color: 'var(--white, #FFFFFF)', letterSpacing: '-0.02em' }}>
              White Caves Flagship Life Cycle Journeys
            </h2>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#EF4444',
                background: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                padding: '2px 8px',
                borderRadius: '999px',
              }}
            >
              20 Core Missions Active
            </span>
          </div>
          <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem', color: 'var(--color-94a3b8, #94A3B8)' }}>
            Guided real estate operating engine enforcing RERA compliance, DLD workflows, and zero-mistake execution.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setViewTab('catalog')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: viewTab === 'catalog' ? '#EF4444' : 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            📋 Missions Catalog (20)
          </button>
          <button
            type="button"
            onClick={() => setViewTab('history')}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: viewTab === 'history' ? '#EF4444' : 'rgba(255, 255, 255, 0.1)',
              color: '#FFFFFF',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            📜 Audit History ({lifecycleHistory.length})
          </button>
        </div>
      </div>

      {viewTab === 'catalog' ? (
        <>
          {/* Categories Bar & Search */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '10px',
              background: '#FFFFFF',
              padding: '12px 16px',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.02)',
            }}
          >
            <div style={{ display: 'flex', gap: '6px', overflowX: 'auto', paddingBottom: '2px' }}>
              {categories.map(c => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setSelectedCategory(c.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '6px 12px',
                    borderRadius: '8px',
                    border: '1px solid',
                    borderColor: selectedCategory === c.id ? '#EF4444' : '#E2E8F0',
                    background: selectedCategory === c.id ? 'linear-gradient(135deg, #EF4444, #DC2626)' : '#F8FAFC',
                    color: selectedCategory === c.id ? '#FFFFFF' : '#475569',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>{c.icon}</span>
                  <span>{c.label}</span>
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', minWidth: '240px' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search missions, DLD, Ejari..."
                style={{
                  width: '100%',
                  padding: '7px 12px 7px 32px',
                  borderRadius: '8px',
                  border: '1px solid #CBD5E1',
                  fontSize: '0.8rem',
                  outline: 'none',
                }}
              />
              <span style={{ position: 'absolute', left: '10px', top: '7px', fontSize: '0.8rem', color: 'var(--color-94a3b8, #94A3B8)' }}>
                🔍
              </span>
            </div>
          </div>

          {/* Journeys 20-Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '16px',
            }}
          >
            {filteredJourneys.map(journey => (
              <div
                key={journey.id}
                style={{
                  background: '#FFFFFF',
                  borderRadius: '12px',
                  border: '1px solid #E2E8F0',
                  padding: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                  transition: 'all 0.2s ease',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.4rem' }}>{journey.icon}</span>
                      <div>
                        <h4 style={{ margin: 0, fontSize: '0.92rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
                          {journey.title}
                        </h4>
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary, #64748B)', fontWeight: 600 }}>
                          {journey.family}
                        </span>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.68rem',
                        fontWeight: 800,
                        color: '#3B82F6',
                        background: 'rgba(59, 130, 246, 0.1)',
                        padding: '2px 8px',
                        borderRadius: '6px',
                      }}
                    >
                      ⏱️ {journey.estimatedMinutes}m
                    </span>
                  </div>

                  <p style={{ margin: '8px 0 0 0', fontSize: '0.78rem', color: 'var(--color-475569, #475569)', lineHeight: 1.45 }}>
                    {journey.description}
                  </p>

                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', marginTop: '10px' }}>
                    {journey.steps.map((step, idx) => (
                      <span
                        key={step.id}
                        style={{
                          fontSize: '0.65rem',
                          background: '#F1F5F9',
                          color: '#475569',
                          padding: '2px 6px',
                          borderRadius: '4px',
                          fontWeight: 600,
                        }}
                      >
                        {idx + 1}. {step.shortLabel || step.title}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setActiveJourney(journey)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    width: '100%',
                    padding: '8px',
                    borderRadius: '8px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #EF4444, #DC2626)',
                    color: '#FFFFFF',
                    fontSize: '0.8rem',
                    fontWeight: 800,
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(239, 68, 68, 0.25)',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span>⚡ Launch Mission</span>
                </button>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Lifecycle Audit History */
        <div
          style={{
            background: '#FFFFFF',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            padding: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
          }}
        >
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
            📜 Completed Journey Execution Audit Vault
          </h3>
          {lifecycleHistory.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary, #64748B)' }}>
              <span style={{ fontSize: '2rem' }}>📂</span>
              <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem' }}>
                No completed journeys in this session yet. Launch any of the 20 missions above to build immutable audit history.
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {lifecycleHistory.map(entry => (
                <div
                  key={entry.sessionId}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: '#F8FAFC',
                    border: '1px solid #E2E8F0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--color-1e293b, #1E293B)' }}>
                      {entry.result?.title || entry.journeyId}
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary, #64748B)', display: 'block', marginTop: '2px' }}>
                      Ref: {entry.result?.referenceNumber || entry.sessionId} • Completed on {new Date(entry.updatedAt || entry.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 800,
                      color: '#16A34A',
                      background: 'rgba(22, 163, 74, 0.12)',
                      padding: '3px 10px',
                      borderRadius: '999px',
                    }}
                  >
                    ✅ 100% Ready
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Active Journey Execution Shell */}
      {activeJourney && (
        <JourneyShell
          definition={activeJourney}
          isOpen={!!activeJourney}
          onClose={() => setActiveJourney(null)}
          onLaunchJourney={id => {
            const found = getJourneyById(id);
            if (found) setActiveJourney(found);
          }}
        />
      )}
    </div>
  );
};

export default JourneyHubView;
