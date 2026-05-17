import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { authFetch } from '../../utils/authFetch';

interface EjariProperty {
  id: string;
  title?: string;
  unitNumber?: string;
  [key: string]: unknown;
}

interface EjariRegistrationModalProps {
  property: EjariProperty;
  onClose: () => void;
  onSuccess: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: ${theme.zIndex.modal};
`;

const Modal = styled.div`
  background: ${theme.colors.background.primary};
  width: 500px;
  max-width: 95%;
  border-radius: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.xl};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: ${theme.spacing.lg};
  border-bottom: 1px solid ${theme.colors.border};
  padding-bottom: ${theme.spacing.sm};
`;

const Title = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  color: ${theme.colors.text.primary};
`;

const Input = styled.input`
  width: 100%;
  padding: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.spacing.sm};
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${theme.spacing.md};
`;

const Button = styled.button<{ $primary?: boolean }>`
  padding: ${theme.spacing.sm} ${theme.spacing.xl};
  border-radius: ${theme.spacing.sm};
  border: none;
  cursor: pointer;
  font-weight: 500;
  background: ${props =>
    props.$primary ? theme.colors.primary : theme.colors.background.secondary};
  color: ${props => (props.$primary ? 'white' : theme.colors.text.primary)};

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ErrorBanner = styled.div`
  padding: 10px 14px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  margin-bottom: ${theme.spacing.md};
  background: #fdecea;
  border-left: 4px solid #f44336;
  color: #b71c1c;
`;

export const EjariRegistrationModal: React.FC<EjariRegistrationModalProps> = ({
  property,
  onClose,
  onSuccess,
}) => {
  const [ejariNumber, setEjariNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!ejariNumber) return;
    setLoading(true);
    try {
      const res = await authFetch(`/api/leasing-inventory/${property.id}/ejari`, {
        method: 'POST',
        body: JSON.stringify({ ejariNumber }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to register Ejari');
      }
    } catch {
      setError('Error registering Ejari');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>Dubai DLD: Ejari Registration</Title>
          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer' }}
          >
            &times;
          </button>
        </Header>
        {error && (
          <ErrorBanner role="alert" data-testid="ejari-error">
            ⚠️ {error}
          </ErrorBanner>
        )}

        <p style={{ marginBottom: theme.spacing.sm }}>
          Enter the official Ejari Registration Number for{' '}
          <strong>{property.unitNumber || property.title}</strong>:
        </p>
        <Input
          type="text"
          placeholder="e.g. 1234567890"
          value={ejariNumber}
          onChange={e => setEjariNumber(e.target.value)}
        />

        <Footer>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button $primary onClick={handleSubmit} disabled={loading || !ejariNumber}>
            {loading ? 'Registering...' : 'Save Ejari'}
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  );
};
