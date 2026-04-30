/**
 * AccountLink Component
 * 
 * UI for linking WhatsApp accounts via QR code or phone verification
 * Manages device linking workflow and authentication
 */

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useWhatsAppIntegration } from '../../../hooks/whatsapp';

const Container = styled.div`
  padding: 20px;
  max-width: 600px;
  margin: 0 auto;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 20px;
`;

const Card = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 16px;
`;

const SelectAccountSection = styled.div`
  margin-bottom: 24px;
`;

const Label = styled.label`
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #333;
  margin-bottom: 8px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: #25d366;
    box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.1);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'danger' }>`
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  ${props => {
    switch (props.variant) {
      case 'primary':
        return `
          background: #25d366;
          color: white;
          
          &:hover {
            background: #20ba5a;
          }
          
          &:disabled {
            background: #ccc;
            cursor: not-allowed;
          }
        `;
      case 'secondary':
        return `
          background: #f0f0f0;
          color: #333;
          
          &:hover {
            background: #e0e0e0;
          }
          
          &:disabled {
            background: #f5f5f5;
            cursor: not-allowed;
          }
        `;
      case 'danger':
        return `
          background: #f8d7da;
          color: #721c24;
          
          &:hover {
            background: #f5c6cb;
          }
          
          &:disabled {
            background: #f5f5f5;
            cursor: not-allowed;
          }
        `;
      default:
        return '';
    }
  }}
`;

const QRCodeSection = styled.div`
  text-align: center;
  padding: 24px;
  background: #f9f9f9;
  border-radius: 8px;
  margin-bottom: 24px;
`;

const QRCodeImage = styled.img`
  max-width: 300px;
  width: 100%;
  border-radius: 8px;
  margin-bottom: 16px;
`;

const QRCodeText = styled.p`
  font-size: 14px;
  color: #666;
  margin: 12px 0;
`;

const PhoneVerificationForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

const Input = styled.input`
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-size: 14px;
  
  &:focus {
    outline: none;
    border-color: #25d366;
    box-shadow: 0 0 0 3px rgba(37, 211, 102, 0.1);
  }
`;

const ErrorMessage = styled.div`
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
`;

const SuccessMessage = styled.div`
  background: #d4edda;
  color: #155724;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 16px;
`;

const LoadingSpinner = styled.div`
  border: 3px solid #f3f3f3;
  border-top: 3px solid #25d366;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: spin 1s linear infinite;
  margin: 20px auto;

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const StepIndicator = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
`;

const StepBadge = styled.div<{ active?: boolean; completed?: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 600;
  
  ${props => {
    if (props.completed) {
      return `
        background: #25d366;
        color: white;
      `;
    }
    if (props.active) {
      return `
        background: #25d366;
        color: white;
      `;
    }
    return `
      background: #f0f0f0;
      color: #999;
    `;
  }}
`;

interface AccountLinkProps {
  onSuccess?: (accountId: string) => void;
  onCancel?: () => void;
}

export const AccountLink: React.FC<AccountLinkProps> = ({ onSuccess, onCancel }) => {
  const {
    accounts,
    currentAccount,
    isLoading,
    error,
    isLinking,
    qrCode,
    sessionId,
    selectAccount,
    linkDevice,
    confirmLink,
    clearError,
  } = useWhatsAppIntegration();

  const [selectedAccountId, setSelectedAccountId] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [authToken, setAuthToken] = useState('');
  const [step, setStep] = useState<'select' | 'qr' | 'verify'>('select');
  const [successMessage, setSuccessMessage] = useState('');

  // Set initial account
  useEffect(() => {
    if (accounts.length > 0 && !selectedAccountId) {
      setSelectedAccountId(accounts[0].accountId);
      selectAccount(accounts[0].accountId);
    }
  }, [accounts, selectedAccountId, selectAccount]);

  const handleAccountSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const accountId = e.target.value;
    setSelectedAccountId(accountId);
    selectAccount(accountId);
  };

  const handleStartLinking = async () => {
    if (!selectedAccountId || !phoneNumber) {
      return;
    }

    try {
      await linkDevice(selectedAccountId, phoneNumber);
      setStep('qr');
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleConfirmLink = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!sessionId || !authToken || !phoneNumber) {
      return;
    }

    try {
      await confirmLink(sessionId, authToken, phoneNumber);
      setSuccessMessage('Account linked successfully!');
      setStep('select');
      setPhoneNumber('');
      setAuthToken('');
      
      setTimeout(() => {
        onSuccess?.(selectedAccountId);
      }, 1500);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleReset = () => {
    setStep('select');
    setPhoneNumber('');
    setAuthToken('');
    setSelectedAccountId(accounts[0]?.accountId || '');
    clearError();
  };

  return (
    <Container>
      <Title>Link WhatsApp Account</Title>

      {error && (
        <ErrorMessage>
          {error}
          <button
            onClick={clearError}
            style={{ marginLeft: '12px', background: 'none', border: 'none', cursor: 'pointer', color: 'inherit' }}
          >
            ✕
          </button>
        </ErrorMessage>
      )}

      {successMessage && (
        <SuccessMessage>{successMessage}</SuccessMessage>
      )}

      <Card>
        <StepIndicator>
          <StepBadge active={step === 'select'} completed={step !== 'select'}>1</StepBadge>
          <StepBadge active={step === 'qr'} completed={step === 'verify'}>2</StepBadge>
          <StepBadge active={step === 'verify'}>3</StepBadge>
        </StepIndicator>

        {step === 'select' && (
          <SelectAccountSection>
            <Label>Select Account</Label>
            <Select value={selectedAccountId} onChange={handleAccountSelect} disabled={isLoading}>
              {accounts.map(account => (
                <option key={account.accountId} value={account.accountId}>
                  {account.phoneNumber || 'Unnamed Account'}
                </option>
              ))}
            </Select>

            <Label style={{ marginTop: '16px' }}>Phone Number</Label>
            <Input
              type="tel"
              placeholder="+1 (555) 000-0000"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              disabled={isLoading || isLinking}
            />

            <ButtonGroup>
              <Button
                variant="primary"
                onClick={handleStartLinking}
                disabled={isLoading || isLinking || !phoneNumber}
              >
                {isLinking ? 'Generating QR Code...' : 'Start Linking'}
              </Button>
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            </ButtonGroup>
          </SelectAccountSection>
        )}

        {step === 'qr' && qrCode && (
          <QRCodeSection>
            <h3 style={{ marginTop: 0 }}>Scan QR Code</h3>
            <QRCodeImage src={qrCode} alt="Device Linking QR Code" />
            <QRCodeText>
              Scan this QR code with your WhatsApp mobile app to link this account.
            </QRCodeText>
            <QRCodeText style={{ marginTop: '24px', fontSize: '12px', color: '#999' }}>
              Trouble scanning? Enter your 6-digit authentication code below instead.
            </QRCodeText>
            <ButtonGroup>
              <Button variant="secondary" onClick={() => setStep('verify')}>
                Enter Auth Code
              </Button>
              <Button variant="secondary" onClick={handleReset}>
                Try Again
              </Button>
            </ButtonGroup>
          </QRCodeSection>
        )}

        {step === 'verify' && (
          <PhoneVerificationForm onSubmit={handleConfirmLink}>
            <Label>6-Digit Authentication Code</Label>
            <Input
              type="text"
              placeholder="000000"
              value={authToken}
              onChange={(e) => setAuthToken(e.target.value.replace(/\D/g, '').slice(0, 6))}
              maxLength={6}
              disabled={isLoading}
            />

            <ButtonGroup>
              <Button
                variant="primary"
                type="submit"
                disabled={isLoading || authToken.length !== 6}
              >
                {isLoading ? 'Verifying...' : 'Confirm Linking'}
              </Button>
              <Button variant="secondary" type="button" onClick={handleReset}>
                Back
              </Button>
            </ButtonGroup>
          </PhoneVerificationForm>
        )}

        {(isLoading || isLinking) && step === 'qr' && (
          <LoadingSpinner />
        )}
      </Card>
    </Container>
  );
};
