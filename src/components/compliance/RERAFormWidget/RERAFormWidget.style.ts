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

export const ControlsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const SelectGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-size: 14px;
    color: var(--text-secondary, #A0A0A0);
  }

  select {
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    padding: 12px;
    border-radius: 8px;
    color: #FFF;
    font-size: 14px;
    transition: border-color 0.2s ease;
    appearance: none;

    &:focus {
      outline: none;
      border-color: var(--accent-gold, #D4AF37);
    }
    
    option {
      background: #2A2A2A;
      color: #FFF;
    }
  }
`;

export const DataPreview = styled.div`
  background: rgba(212, 175, 55, 0.05);
  border: 1px solid rgba(212, 175, 55, 0.2);
  border-radius: 8px;
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  
  .data-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
    
    .label {
      font-size: 12px;
      color: rgba(255,255,255,0.5);
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .value {
      font-size: 15px;
      font-weight: 500;
      color: #FFF;
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

export const ESignWorkflow = styled.div`
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const ProgressSteps = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 12px;
    left: 20px;
    right: 20px;
    height: 2px;
    background: rgba(255,255,255,0.1);
    z-index: 0;
  }
  
  .progress-line {
    position: absolute;
    top: 12px;
    left: 20px;
    height: 2px;
    background: var(--accent-gold, #D4AF37);
    z-index: 0;
    transition: width 0.5s ease;
  }
`;

export const StepNode = styled.div<{ $active: boolean; $completed: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  z-index: 1;
  
  .circle {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: ${({ $completed, $active }) => 
      $completed ? 'var(--accent-gold, #D4AF37)' : 
      $active ? '#2A2A2A' : '#1A1A1A'};
    border: 2px solid ${({ $completed, $active }) => 
      $completed || $active ? 'var(--accent-gold, #D4AF37)' : 'rgba(255,255,255,0.2)'};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ $completed }) => $completed ? '#000' : 'var(--accent-gold, #D4AF37)'};
  }
  
  .label {
    font-size: 12px;
    color: ${({ $completed, $active }) => 
      $completed || $active ? '#FFF' : 'rgba(255,255,255,0.5)'};
    font-weight: ${({ $active }) => $active ? 600 : 400};
  }
`;
