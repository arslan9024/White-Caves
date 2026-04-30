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

export const LeasingAcquisition: React.FC = () => {
  const [properties, setProperties] = useState<any[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<any | null>(null);
  const [signingProperty, setSigningProperty] = useState<any | null>(null);
  const [ejariProperty, setEjariProperty] = useState<any | null>(null);

  const fetchProperties = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/leasing-inventory', {
        headers: { 'Authorization': `Bearer ${token}` }
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
    fetchProperties();
  }, []);

  const handleStageChange = async (id: string, newStage: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/leasing-inventory/${id}/stage`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newStage })
      });
      
      const data = await res.json();
      if (res.ok) {
        fetchProperties();
        alert('Stage updated successfully!');
      } else {
        alert(data.error || 'Failed to update stage');
      }
    } catch (err) {
      console.error(err);
      alert('Error updating stage');
    }
  };

  const handleHandover = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/leasing-inventory/${id}/handover`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchProperties();
        alert('Key Handover completed! Property is now locked.');
      } else {
        alert('Failed to complete handover');
      }
    } catch (err) {
      console.error(err);
      alert('Error completing handover');
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

      <KanbanBoard>
        {columns.map((col) => {
          const colProps = properties.filter((p) => p.inventoryStage === col.id);
          return (
            <Column key={col.id}>
              <ColumnHeader>
                {col.title} <Badge>{colProps.length}</Badge>
              </ColumnHeader>
              
              {colProps.map((p) => (
                <div key={p.id}>
                  <PropertyCard 
                    property={p} 
                    onClick={() => setSelectedProperty(p)} 
                  />
                  {col.id === 'draft_collected' && (
                    <button 
                      onClick={() => handleStageChange(p.id, 'verified_active')}
                      style={{ width: '100%', padding: '8px', cursor: 'pointer', background: theme.colors.primary, color: 'white', border: 'none', borderRadius: '4px', marginBottom: '16px' }}
                    >
                      Move to Verified Active
                    </button>
                  )}
                  {col.id === 'verified_active' && (
                    <button 
                      onClick={() => handleStageChange(p.id, 'under_offer')}
                      style={{ width: '100%', padding: '8px', cursor: 'pointer', background: theme.colors.secondary || '#333', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '16px' }}
                    >
                      Move to Under Offer
                    </button>
                  )}
                  {col.id === 'under_offer' && (
                    <button 
                      onClick={() => setSigningProperty(p)}
                      style={{ width: '100%', padding: '8px', cursor: 'pointer', background: theme.colors.success || 'green', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '16px' }}
                    >
                      Review & Sign Contract
                    </button>
                  )}
                  {col.id === 'leased_sold' && (
                    <>
                      <button 
                        onClick={() => setEjariProperty(p)}
                        style={{ width: '100%', padding: '8px', cursor: 'pointer', background: '#e67e22', color: 'white', border: 'none', borderRadius: '4px', marginBottom: '8px' }}
                      >
                        Register Ejari
                      </button>
                      <button 
                        onClick={() => handleHandover(p.id)}
                        style={{ width: '100%', padding: '8px', cursor: 'pointer', background: theme.colors.primary, color: 'white', border: 'none', borderRadius: '4px', marginBottom: '16px' }}
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
            alert('Contract signed securely! Property moved to Leased / Sold.');
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
            alert('Ejari registered successfully!');
          }}
        />
      )}
    </PageContainer>
  );
};

export default LeasingAcquisition;
