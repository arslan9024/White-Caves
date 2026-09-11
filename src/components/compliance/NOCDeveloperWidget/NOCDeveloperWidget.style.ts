import styled from 'styled-components';

export const WidgetContainer = styled.div<{ $isRtl: boolean }>`
  background: var(--bg-surface, #1A1A1A);
  border-radius: 12px;
  padding: 24px;
  color: var(--text-primary, #FFFFFF);
  font-family: 'Inter', sans-serif;
  direction: ${({ $isRtl }) => ($isRtl ? 'rtl' : 'ltr')};
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const WidgetHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  h3 {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--accent-gold, #D4AF37);
  }

  p {
    margin: 0;
    font-size: 14px;
    color: var(--text-secondary, #A0A0A0);
  }
`;

export const FormGrid = styled.form`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    color: var(--text-secondary, #A0A0A0);
  }

  input {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 12px;
    border-radius: 8px;
    color: #FFF;
    font-size: 14px;
    transition: border-color 0.2s ease;

    &:focus {
      outline: none;
      border-color: var(--accent-gold, #D4AF37);
    }
  }
`;

export const ActionButton = styled.button<{ $primary?: boolean }>`
  background: ${({ $primary }) => $primary ? 'linear-gradient(135deg, var(--accent-gold, #D4AF37) 0%, #AA8C2C 100%)' : 'rgba(255, 255, 255, 0.1)'};
  color: ${({ $primary }) => $primary ? '#000000' : '#FFFFFF'};
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  transition: all 0.2s ease;
  grid-column: 1 / -1;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    background: ${({ $primary }) => $primary ? 'linear-gradient(135deg, #F0C950 0%, #D4AF37 100%)' : 'rgba(255, 255, 255, 0.15)'};
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
  }
`;

export const TrackerContainer = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 24px;
  margin-top: 16px;
  
  h4 {
    margin: 0 0 24px 0;
    font-size: 16px;
    color: #FFF;
  }
`;

export const StepItem = styled.div<{ $active: boolean; $completed: boolean }>`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  position: relative;
  
  &:last-child {
    margin-bottom: 0;
    
    &::after {
      display: none;
    }
  }
  
  &::after {
    content: '';
    position: absolute;
    left: 11px;
    top: 32px;
    bottom: -16px;
    width: 2px;
    background: ${({ $completed }) => $completed ? 'var(--accent-gold, #D4AF37)' : 'rgba(255,255,255,0.1)'};
  }
  
  .icon-wrapper {
    width: 24px;
    height: 24px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: ${({ $completed, $active }) => 
      $completed ? 'var(--accent-gold, #D4AF37)' : 
      $active ? 'rgba(212, 175, 55, 0.2)' : 'rgba(255,255,255,0.1)'};
    color: ${({ $completed, $active }) => 
      $completed ? '#000' : 
      $active ? 'var(--accent-gold, #D4AF37)' : 'rgba(255,255,255,0.3)'};
    z-index: 1;
    border: 2px solid ${({ $completed, $active }) => 
      $completed || $active ? 'var(--accent-gold, #D4AF37)' : 'transparent'};
  }
  
  .step-text {
    font-size: 14px;
    color: ${({ $completed, $active }) => 
      $completed || $active ? '#FFF' : 'rgba(255,255,255,0.5)'};
    font-weight: ${({ $active }) => $active ? 600 : 400};
  }
`;
