import React, { useState } from 'react';
import styled from 'styled-components';
import { theme } from '../../styles/theme';
import { authFetch } from '../../utils/authFetch';

interface ContractProperty {
  id: string;
  title?: string;
  unitNumber?: string;
  documents?: string[];
  [key: string]: unknown;
}

interface ContractSignModalProps {
  property: ContractProperty;
  onClose: () => void;
  onSignSuccess: () => void;
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
  width: 800px;
  max-width: 95%;
  height: 90vh;
  border-radius: ${theme.spacing.md};
  padding: ${theme.spacing.lg};
  box-shadow: ${theme.shadows.xl};
  display: flex;
  flex-direction: column;
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

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: ${theme.colors.text.secondary};
`;

const PdfPreview = styled.iframe`
  flex: 1;
  width: 100%;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.spacing.sm};
  margin-bottom: ${theme.spacing.lg};
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

export const ContractSignModal: React.FC<ContractSignModalProps> = ({
  property,
  onClose,
  onSignSuccess,
}) => {
  const [signing, setSigning] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const contractUrl = property.documents?.find((doc: string) => doc.includes('contract_'));

  const handleSign = async () => {
    setSigning(true);
    try {
      const res = await authFetch(`/api/leasing-inventory/${property.id}/sign`, {
        method: 'POST',
      });

      if (res.ok) {
        onSignSuccess();
      } else {
        const err = await res.json();
        setError(err.error || 'Failed to sign contract');
      }
    } catch {
      setError('Error signing contract');
    } finally {
      setSigning(false);
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={e => e.stopPropagation()}>
        <Header>
          <Title>E-Sign Contract: {property.unitNumber || property.title}</Title>
          <CloseButton onClick={onClose}>&times;</CloseButton>
        </Header>
        {error && (
          <ErrorBanner role="alert" data-testid="contract-sign-error">
            ⚠️ {error}
          </ErrorBanner>
        )}

        {contractUrl ? (
          <PdfPreview src={contractUrl} title="Contract PDF" />
        ) : (
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            Contract is being generated... Please close and try again in a few seconds.
          </div>
        )}

        <Footer>
          <Button onClick={onClose} disabled={signing}>
            Cancel
          </Button>
          <Button $primary onClick={handleSign} disabled={signing || !contractUrl}>
            {signing ? 'Signing securely via UAE Pass...' : 'E-Sign Document'}
          </Button>
        </Footer>
      </Modal>
    </Overlay>
  );
};
