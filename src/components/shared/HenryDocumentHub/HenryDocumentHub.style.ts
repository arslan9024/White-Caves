import styled from 'styled-components';

export const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(15, 15, 15, 0.6);
  backdrop-filter: blur(8px);
  z-index: 2500;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
`;

export const WizardContainer = styled.div`
  width: 100%;
  max-width: 680px;
  
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.75) 100%);
    backdrop-filter: blur(24px) saturate(200%);
    border: 1px solid rgba(255, 255, 255, 0.9);
    border-bottom: 1px solid rgba(212, 175, 55, 0.4);
    box-shadow: 0 40px 100px rgba(212, 175, 55, 0.15), inset 0 1px 0 rgba(255, 255, 255, 1);
    
  border: 1px solid rgba(212, 175, 55, 0.3);
  border-radius: 16px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.1);
  color: #0f0f0f;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

export const WizardHeader = styled.div`
  padding: 1.25rem 1.5rem;
  background: #FAFAFA;
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;

  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 800;
    color: #0f0f0f;
  }
`;

export const StepProgressBar = styled.div`
  display: flex;
  
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.75) 100%);
    backdrop-filter: blur(24px) saturate(200%);
    border: 1px solid rgba(255, 255, 255, 0.9);
    border-bottom: 1px solid rgba(212, 175, 55, 0.4);
    box-shadow: 0 40px 100px rgba(212, 175, 55, 0.15), inset 0 1px 0 rgba(255, 255, 255, 1);
    
  border-bottom: 1px solid rgba(0, 0, 0, 0.04);

  .step-item {
    flex: 1;
    padding: 12px;
    text-align: center;
    font-size: 0.75rem;
    font-weight: 700;
    color: #64748B;
    border-bottom: 3px solid transparent;
    transition: all 0.3s ease;

    &.active {
      color: #D4AF37;
      border-bottom-color: #D4AF37;
      background: rgba(212, 175, 55, 0.05);
    }

    &.completed {
      color: #10B981;
    }
  }
`;

export const WizardBody = styled.div`
  padding: 1.5rem;
  flex: 1;
  min-height: 280px;
  
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.75) 100%);
    backdrop-filter: blur(24px) saturate(200%);
    border: 1px solid rgba(255, 255, 255, 0.9);
    border-bottom: 1px solid rgba(212, 175, 55, 0.4);
    box-shadow: 0 40px 100px rgba(212, 175, 55, 0.15), inset 0 1px 0 rgba(255, 255, 255, 1);
    
`;

export const WizardFooter = styled.div`
  padding: 1rem 1.5rem;
  background: #FAFAFA;
  border-top: 1px solid rgba(0, 0, 0, 0.04);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const ActionButton = styled.button<{ $primary?: boolean }>`
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 700;
  cursor: pointer;
  border: none;
  background: ${({ $primary }) => ($primary ? 'linear-gradient(135deg, #D4AF37 0%, #C5A059 100%)' : '#F1F5F9')};
  color: ${({ $primary }) => ($primary ? '#FFFFFF' : '#64748B')};
  box-shadow: ${({ $primary }) => ($primary ? '0 4px 14px rgba(212, 175, 55, 0.25)' : 'none')};
  transition: all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1);

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: ${({ $primary }) => ($primary ? '0 8px 24px rgba(212, 175, 55, 0.3)' : 'none')};
    color: ${({ $primary }) => ($primary ? '#FFFFFF' : '#0f0f0f')};
    background: ${({ $primary }) => ($primary ? 'linear-gradient(135deg, #C5A059 0%, #D4AF37 100%)' : '#E2E8F0')};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;
