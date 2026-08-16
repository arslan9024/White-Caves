/**
 * MultiStepFormProgressBar — Wave 63 FE-GOAL-077
 * Multi-step form progress tracker with step numbers, titles, and completion checkmarks
 * White Caves Real Estate LLC — Forms Suite
 */
import React, { FC } from 'react';
import styled from 'styled-components';

const ProgressContainer = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;
  font-family: 'Inter', sans-serif;
  margin-bottom: 24px;
  &::before {
    content: '';
    position: absolute;
    top: 14px;
    left: 24px;
    right: 24px;
    height: 2px;
    background: rgba(100, 116, 139, 0.25);
    z-index: 0;
  }
`;

const StepItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  position: relative;
  z-index: 1;
`;

const StepBubble = styled.div<{ $active: boolean; $completed: boolean }>`
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: ${p => p.$completed ? '#10B981' : p.$active ? '#EF4444' : '#1E293B'};
  border: 2px solid ${p => p.$completed ? '#10B981' : p.$active ? '#EF4444' : 'rgba(100, 116, 139, 0.3)'};
  color: #FFF;
  font-size: 0.75rem;
  font-weight: 900;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: ${p => p.$active ? '0 0 12px rgba(239, 68, 68, 0.5)' : 'none'};
`;

const StepTitle = styled.div<{ $active: boolean }>`
  font-size: 0.7rem;
  font-weight: 700;
  color: ${p => p.$active ? '#FFF' : '#64748B'};
  text-align: center;
`;

export interface StepDef {
  number: number;
  title: string;
}

export const MultiStepFormProgressBar: FC<{
  currentStep?: number;
  steps?: StepDef[];
}> = ({
  currentStep = 2,
  steps = [
    { number: 1, title: 'Client KYC' },
    { number: 2, title: 'Unit Selection' },
    { number: 3, title: 'Payment Schedule' },
    { number: 4, title: 'Form B Execution' },
  ],
}) => {
  return (
    <ProgressContainer data-testid="multi-step-form-progress-bar">
      {steps.map(s => {
        const isCompleted = currentStep > s.number;
        const isActive = currentStep === s.number;
        return (
          <StepItem key={s.number}>
            <StepBubble $active={isActive} $completed={isCompleted}>
              {isCompleted ? '✓' : s.number}
            </StepBubble>
            <StepTitle $active={isActive}>{s.title}</StepTitle>
          </StepItem>
        );
      })}
    </ProgressContainer>
  );
};

export default MultiStepFormProgressBar;
