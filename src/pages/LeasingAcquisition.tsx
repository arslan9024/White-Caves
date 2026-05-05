import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';
import { PropertyCard } from '../components/leasing/PropertyCard';
import { DocumentChecklist } from '../components/leasing/DocumentChecklist';
import { ContractSignModal } from '../components/leasing/ContractSignModal';
import { EjariRegistrationModal } from '../components/leasing/EjariRegistrationModal';

const PageContainer = styled.div`
  padding: ${theme.spacing.xl};
  background: ${theme.colors.background.secondary};
  min-height: calc(100vh - 64px);
  margin-top: 64px; // Account for navbar
`;

const Header = styled.div`
  margin-bottom: ${theme.spacing.xl};
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Title = styled.h1`
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const KanbanBoard = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  overflow-x: auto;
  padding-bottom: ${theme.spacing.md};
`;

const Column = styled.div`
  flex: 1;
  min-width: 300px;
  background: ${theme.colors.background.primary};
  border-radius: ${theme.spacing.md};
  padding: ${theme.spacing.md};
  box-shadow: ${theme.shadows.sm};
`;

const ColumnHeader = styled.h3`
  margin: 0 0 ${theme.spacing.md};
  color: ${theme.colors.text.primary};
  font-size: 1.1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Badge = styled.span`
  background: ${theme.colors.primary}20;
  color: ${theme.colors.primary};
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.875rem;
`;

const ToastBanner = styled.div<{ $type: 'success' | 'error' }>`
  padding: 12px 16px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: ${theme.spacing.md};
  ${({ $type }) =>
    $type === 'success'
      ? 'background:#e8f5e9; border-left:4px solid #4caf50; color:#2e7d32;'
      : 'background:#fdecea; border-left:4px solid #f44336; color:#b71c1c;'}
`;

export const LeasingAcquisition: React.FC = () => {
  interface LeasingProperty {
    id: string;
    inventoryStage: string;
    title: string;
    location: string;
    price: string | number;
    status?: string;
    [key: string]: unknown;
  }

  const [properties, setProperties] = useState<LeasingProperty[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<LeasingProperty | null>(null);
  const [signingProperty, setSigningProperty] = useState<LeasingProperty | null>(null);
  const [ejariProperty, setEjariProperty] = useState<LeasingProperty | null>(null);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (type: 'success' | 'error', text: string) => {
    setToast({ type, text });
  };

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/leasing-inventory', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setProperties(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch leasing inventory', err);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProperties();
  }, []);

  const handleStageChange = async (id: string, newStage: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/leasing-inventory/${id}/stage`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newStage }),
      });

      const data = await res.json();
      if (res.ok) {
        fetchProperties();
        showToast('success', 'Stage updated successfully!');
      } else {
        showToast('error', data.error || 'Failed to update stage');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Error updating stage');
    }
  };

  const handleHandover = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/leasing-inventory/${id}/handover`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        fetchProperties();
        showToast('success', 'Key Handover completed! Property is now locked.');
      } else {
        showToast('error', 'Failed to complete handover');
      }
    } catch (err) {
      console.error(err);
      showToast('error', 'Error completing handover');
    }
  };

  const columns = [
    { id: 'draft_collected', title: 'Draft Collected' },
    { id: 'verified_active', title: 'Verified Active' },
    { id: 'under_offer', title: 'Under Offer' },
    { id: 'leased_sold', title: 'Leased / Sold' },
  ];

  return (
    <PageContainer>
      <Header>
        <Title>Leasing Acquisition Pipeline</Title>
      </Header>

      {toast && (
        <ToastBanner
          $type={toast.type}
          role={toast.type === 'error' ? 'alert' : 'status'}
          data-testid="leasing-toast"
        >
          {toast.type === 'success' ? '✅ ' : '⚠️ '}
          {toast.text}
        </ToastBanner>
      )}

      <KanbanBoard>
        {columns.map(col => {
          const colProps = properties.filter(p => p.inventoryStage === col.id);
          return (
            <Column key={col.id}>
              <ColumnHeader>
                {col.title} <Badge>{colProps.length}</Badge>
              </ColumnHeader>

              {colProps.map(p => (
                <div key={p.id}>
                  <PropertyCard property={p} onClick={() => setSelectedProperty(p)} />
                  {col.id === 'draft_collected' && (
                    <button
                      onClick={() => handleStageChange(p.id, 'verified_active')}
                      style={{
                        width: '100%',
                        padding: '8px',
                        cursor: 'pointer',
                        background: theme.colors.primary,
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        marginBottom: '16px',
                      }}
                    >
                      Move to Verified Active
                    </button>
                  )}
                  {col.id === 'verified_active' && (
                    <button
                      onClick={() => handleStageChange(p.id, 'under_offer')}
                      style={{
                        width: '100%',
                        padding: '8px',
                        cursor: 'pointer',
                        background: theme.colors.secondary || '#333',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        marginBottom: '16px',
                      }}
                    >
                      Move to Under Offer
                    </button>
                  )}
                  {col.id === 'under_offer' && (
                    <button
                      onClick={() => setSigningProperty(p)}
                      style={{
                        width: '100%',
                        padding: '8px',
                        cursor: 'pointer',
                        background: theme.colors.success || 'green',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        marginBottom: '16px',
                      }}
                    >
                      Review & Sign Contract
                    </button>
                  )}
                  {col.id === 'leased_sold' && (
                    <>
                      <button
                        onClick={() => setEjariProperty(p)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          cursor: 'pointer',
                          background: '#e67e22',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          marginBottom: '8px',
                        }}
                      >
                        Register Ejari
                      </button>
                      <button
                        onClick={() => handleHandover(p.id)}
                        style={{
                          width: '100%',
                          padding: '8px',
                          cursor: 'pointer',
                          background: theme.colors.primary,
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          marginBottom: '16px',
                        }}
                      >
                        Complete Handover
                      </button>
                    </>
                  )}
                </div>
              ))}
            </Column>
          );
        })}
      </KanbanBoard>

      {selectedProperty && (
        <DocumentChecklist
          property={selectedProperty}
          onClose={() => setSelectedProperty(null)}
          onRefresh={() => {
            fetchProperties();
            const updated = properties.find(p => p.id === selectedProperty.id);
            if (updated) setSelectedProperty(updated); // Attempt to keep modal open, though it might close if structure changes
            setSelectedProperty(null); // Just close for simplicity
          }}
        />
      )}

      {signingProperty && (
        <ContractSignModal
          property={signingProperty}
          onClose={() => setSigningProperty(null)}
          onSignSuccess={() => {
            setSigningProperty(null);
            fetchProperties();
            showToast('success', 'Contract signed securely! Property moved to Leased / Sold.');
          }}
        />
      )}

      {ejariProperty && (
        <EjariRegistrationModal
          property={ejariProperty}
          onClose={() => setEjariProperty(null)}
          onSuccess={() => {
            setEjariProperty(null);
            fetchProperties();
            showToast('success', 'Ejari registered successfully!');
          }}
        />
      )}
    </PageContainer>
  );
};

export default LeasingAcquisition;
