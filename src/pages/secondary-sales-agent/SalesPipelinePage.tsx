import React, { FC, useState, useEffect } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { authFetch } from '../../utils/authFetch';

const PageContainer = styled.div`
  padding: ${theme.spacing.xl};
  background: ${theme.colors.background.secondary};
  min-height: 100vh;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.xl};
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${theme.colors.text.primary};
  margin: 0;
`;

const Board = styled.div`
  display: flex;
  gap: ${theme.spacing.lg};
  overflow-x: auto;
  padding-bottom: ${theme.spacing.md};
  min-height: 70vh;
`;

const Column = styled.div`
  background: ${theme.colors.background.primary};
  border-radius: ${theme.spacing.md};
  min-width: 320px;
  max-width: 320px;
  padding: ${theme.spacing.md};
  box-shadow: ${theme.shadows.sm};
  display: flex;
  flex-direction: column;
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

interface SalesProperty {
  id: string;
  title: string;
  location: string;
  price?: number;
  inventoryStage?: string;
  [key: string]: unknown;
}

const ColumnHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.md};
  padding-bottom: ${theme.spacing.sm};
  border-bottom: 2px solid ${theme.colors.border};
`;

const Card = styled.div`
  background: white;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.spacing.sm};
  padding: ${theme.spacing.md};
  margin-bottom: ${theme.spacing.sm};
  box-shadow: ${theme.shadows.sm};
  cursor: grab;
  &:active {
    cursor: grabbing;
  }
  transition: transform 0.1s;
  &:hover {
    transform: translateY(-2px);
    box-shadow: ${theme.shadows.md};
  }
`;

export const SalesPipelinePage: FC = () => {
  const [properties, setProperties] = useState<SalesProperty[]>([]);
  const [toast, setToast] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const showToast = (type: 'success' | 'error', text: string) => setToast({ type, text });

  const fetchProperties = async () => {
    try {
      const res = await authFetch('/api/secondary-sales');
      if (res.ok) {
        const json = await res.json();
        setProperties(json.data);
      }
    } catch {
      // ignore fetch errors silently
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProperties();
  }, []);

  const handleStageChange = async (id: string, newStage: string) => {
    try {
      const res = await authFetch(`/api/secondary-sales/${id}/stage`, {
        method: 'PATCH',
        body: JSON.stringify({ newStage }),
      });
      if (res.ok) {
        fetchProperties();
      } else {
        const err = await res.json();
        showToast('error', err.error || 'Failed to update stage');
      }
    } catch {
      showToast('error', 'Error updating stage');
    }
  };

  const columns = [
    { id: 'listed', title: 'Listed (Active)' },
    { id: 'form_a_b_signed', title: 'Form A & B Signed' },
    { id: 'form_f_mou', title: 'Form F (MOU)' },
    { id: 'noc_pending', title: 'NOC Pending' },
    { id: 'dld_transfer', title: 'DLD Transfer' },
  ];

  return (
    <PageContainer>
      <Header>
        <div>
          <Title>Secondary Sales Pipeline (Dubai)</Title>
          <p style={{ color: theme.colors.text.secondary, margin: '8px 0 0 0' }}>
            Manage the DLD secondary transaction workflow.
          </p>
        </div>
      </Header>
      {toast && (
        <ToastBanner
          $type={toast.type}
          role={toast.type === 'error' ? 'alert' : 'status'}
          data-testid="sales-pipeline-toast"
        >
          {toast.type === 'success' ? '✅ ' : '⚠️ '}
          {toast.text}
        </ToastBanner>
      )}

      <Board>
        {columns.map(col => (
          <Column key={col.id}>
            <ColumnHeader>
              <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{col.title}</h3>
              <span
                style={{
                  background: theme.colors.primary,
                  color: 'white',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  fontSize: '0.8rem',
                }}
              >
                {properties.filter(p => (p.inventoryStage || 'listed') === col.id).length}
              </span>
            </ColumnHeader>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              {properties
                .filter(p => (p.inventoryStage || 'listed') === col.id)
                .map(p => (
                  <Card key={p.id}>
                    <h4 style={{ margin: '0 0 8px 0' }}>{p.title}</h4>
                    <div
                      style={{
                        fontSize: '0.9rem',
                        color: theme.colors.text.secondary,
                        marginBottom: '8px',
                      }}
                    >
                      <div>💰 AED {p.price?.toLocaleString()}</div>
                      <div>📍 {p.location}</div>
                    </div>

                    {col.id === 'listed' && (
                      <button
                        onClick={() => handleStageChange(p.id, 'form_a_b_signed')}
                        style={{
                          width: '100%',
                          padding: '8px',
                          cursor: 'pointer',
                          background: theme.colors.primary,
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                        }}
                      >
                        Forms A & B Signed
                      </button>
                    )}
                    {col.id === 'form_a_b_signed' && (
                      <button
                        onClick={() => handleStageChange(p.id, 'form_f_mou')}
                        style={{
                          width: '100%',
                          padding: '8px',
                          cursor: 'pointer',
                          background: theme.colors.primary,
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                        }}
                      >
                        MOU (Form F) Signed
                      </button>
                    )}
                    {col.id === 'form_f_mou' && (
                      <button
                        onClick={() => handleStageChange(p.id, 'noc_pending')}
                        style={{
                          width: '100%',
                          padding: '8px',
                          cursor: 'pointer',
                          background: '#f39c12',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                        }}
                      >
                        Apply for NOC
                      </button>
                    )}
                    {col.id === 'noc_pending' && (
                      <>
                        {/* For now, just a button to simulate NOC upload/approval */}
                        <button
                          onClick={() => handleStageChange(p.id, 'dld_transfer')}
                          style={{
                            width: '100%',
                            padding: '8px',
                            cursor: 'pointer',
                            background: theme.colors.success || '#2ecc71',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                          }}
                        >
                          NOC Issued &rarr; DLD
                        </button>
                      </>
                    )}
                  </Card>
                ))}
            </div>
          </Column>
        ))}
      </Board>
    </PageContainer>
  );
};

export default SalesPipelinePage;
