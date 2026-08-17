/**
 * ToolsDashboard.style.ts — UI Style Layer & Styled-Components
 * Enforces White Caves Red / Crisp White / Deep Slate color palette.
 */

import styled from 'styled-components';

export const DashboardContainer = styled.section`
  width: 100%;
  max-width: 1300px;
  margin: 0 auto;
  padding: 4rem 1.5rem;
  font-family: 'Inter', sans-serif;
`;

export const HeaderArea = styled.div`
  text-align: center;
  margin-bottom: 3rem;
`;

export const Badge = styled.span`
  display: inline-block;
  padding: 4px 14px;
  border-radius: 999px;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #EF4444;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  margin-bottom: 0.75rem;
`;

export const MainTitle = styled.h2`
  font-size: 2.2rem;
  font-weight: 900;
  color: var(--text-primary, #0F172A);
  margin: 0 0 0.5rem;
`;

export const SubTitle = styled.p`
  font-size: 1rem;
  color: var(--text-muted, #64748B);
  max-width: 700px;
  margin: 0 auto;
`;

export const ThreeColumnGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

export const ToolCard = styled.div`
  background: var(--bg-card, #FFFFFF);
  border: 1.5px solid var(--border-color, #E2E8F0);
  border-radius: 18px;
  padding: 24px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: all 0.25s ease;

  &:hover {
    border-color: #EF4444;
    box-shadow: 0 16px 40px rgba(239, 68, 68, 0.12);
    transform: translateY(-3px);
  }
`;

export const CardTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--text-primary, #0F172A);
  margin: 0 0 1.2rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

export const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 14px;
`;

export const ControlLabel = styled.label`
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-muted, #64748B);

  strong {
    color: #EF4444;
  }
`;

export const RangeSlider = styled.input`
  -webkit-appearance: none;
  width: 100%;
  height: 6px;
  border-radius: 3px;
  background: #E2E8F0;
  outline: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #EF4444;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
    transition: transform 0.15s ease;

    &:hover {
      transform: scale(1.2);
    }
  }
`;

export const GaugeWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 16px 0;
`;

export const ResultHighlight = styled.div`
  background: rgba(239, 68, 68, 0.06);
  border: 1px solid rgba(239, 68, 68, 0.25);
  border-radius: 12px;
  padding: 14px;
  margin-top: 16px;
  text-align: center;

  .amount {
    font-size: 1.6rem;
    font-weight: 900;
    color: #EF4444;
  }

  .caption {
    font-size: 0.75rem;
    font-weight: 700;
    color: var(--text-muted, #64748B);
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
`;

export const FeeRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #F1F5F9;
  font-size: 0.82rem;

  &:last-child {
    border-bottom: none;
    font-weight: 800;
    font-size: 0.92rem;
    color: #EF4444;
    padding-top: 12px;
  }
`;
