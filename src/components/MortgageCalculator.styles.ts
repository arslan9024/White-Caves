import styled from 'styled-components';

export const CalculatorWrapper = styled.div`
  background: var(--bg-primary);
  border-radius: var(--radius-xl);
  border: 1px solid var(--border-color);
  overflow: hidden;
  box-shadow: var(--shadow-lg);

  @media (max-width: 768px) {
    border-radius: var(--radius-lg);
  }
`;

export const CalculatorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%);
  color: white;

  @media (max-width: 768px) {
    padding: 1rem;
    gap: 0.75rem;
  }
`;

export const CalculatorIcon = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 28px;
    height: 28px;
  }

  @media (max-width: 768px) {
    width: 40px;
    height: 40px;

    svg {
      width: 24px;
      height: 24px;
    }
  }
`;

export const HeaderContent = styled.div`
  display: flex;
  flex-direction: column;
`;

export const CalculatorTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export const CalculatorSubtitle = styled.p`
  font-size: 0.875rem;
  opacity: 0.9;
  margin: 0;
`;

export const CalculatorBody = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  padding: 1.5rem;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

export const CalculatorInputs = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

export const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

export const InputLabel = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--text-primary);
`;

export const InputWithPrefix = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    padding-left: 3.5rem;
  }
`;

export const InputWithSuffix = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  input {
    padding-right: 2.5rem;
  }
`;

export const PrefixLabel = styled.span`
  position: absolute;
  left: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  pointer-events: none;
`;

export const SuffixLabel = styled.span`
  position: absolute;
  right: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  pointer-events: none;
`;

export const InputField = styled.input`
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(196, 24, 53, 0.1);
  }
`;

export const SelectField = styled.select`
  width: 100%;
  padding: 0.875rem 1rem;
  font-size: 1rem;
  border: 2px solid var(--border-color);
  border-radius: var(--radius-md);
  background: var(--bg-primary);
  color: var(--text-primary);
  transition: all 0.2s ease;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--primary-color);
    box-shadow: 0 0 0 3px rgba(196, 24, 53, 0.1);
  }
`;

export const RangeSlider = styled.input`
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: var(--bg-tertiary);
  -webkit-appearance: none;
  appearance: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 20px;
    height: 20px;
    background: var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(196, 24, 53, 0.3);
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: var(--primary-color);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 6px rgba(196, 24, 53, 0.3);
    border: none;
    transition: transform 0.2s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
`;

export const RangeLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
`;

export const DownPaymentDisplay = styled.div`
  background: var(--bg-tertiary);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
  text-align: center;
  margin-top: 0.5rem;
`;

export const DownPaymentAmount = styled.span`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--secondary-color);
`;

export const CalculatorResults = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 1.5rem;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);

  @media (max-width: 1024px) {
    padding: 1rem;
  }
`;

export const MonthlyPaymentBox = styled.div`
  text-align: center;
  padding: 1.5rem;
  background: var(--bg-primary);
  border-radius: var(--radius-lg);
  border: 2px solid var(--primary-color);
`;

export const PaymentLabel = styled.div`
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: 0.5rem;
`;

export const PaymentAmount = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--primary-color);

  @media (max-width: 768px) {
    font-size: 2rem;
  }
`;

export const PaymentFrequency = styled.div`
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
`;

export const BreakdownSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const BreakdownTitle = styled.h4`
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  color: var(--text-primary);
`;

export const BreakdownBar = styled.div`
  display: flex;
  gap: 0.5rem;
  align-items: flex-end;
  height: 80px;
`;

export const BreakdownSegment = styled.div<{ percentage: number; color: string }>`
  flex: ${props => props.percentage};
  height: 100%;
  background: ${props => props.color};
  border-radius: 4px 4px 0 0;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    opacity: 0.8;

    &::after {
      content: '${props => props.percentage.toFixed(1)}%';
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      background: var(--text-primary);
      color: var(--bg-primary);
      padding: 2px 6px;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 600;
      white-space: nowrap;
    }
  }
`;

export const SummaryTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

export const SummaryRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  padding: 0.75rem;
  background: var(--bg-primary);
  border-radius: var(--radius-md);
  font-size: 0.9rem;
`;

export const SummaryLabel = styled.span`
  color: var(--text-muted);
  font-weight: 500;
`;

export const SummaryValue = styled.span`
  text-align: right;
  color: var(--text-primary);
  font-weight: 600;
`;

export const PrintButton = styled.button`
  width: 100%;
  padding: 0.875rem;
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: var(--primary-dark);
  }
`;
