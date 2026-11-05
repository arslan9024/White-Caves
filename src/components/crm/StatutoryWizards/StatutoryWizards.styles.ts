/**
 * White Caves Real Estate LLC - Statutory Wizards Styles
 * Standard: AEGIS Canonical 7-Category Architecture Standard (Styles)
 * Single Purpose File Law: < 350 lines
 */

import styled from 'styled-components';

export const WizardBackdrop = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(2, 6, 23, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
  padding: 20px;
`;

export const WizardModalContainer = styled.div`
  width: 100%;
  max-width: 620px;
  background: #0b1120;
  border: 1px solid rgba(239, 68, 68, 0.35);
  border-radius: 16px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 90vh;
`;

export const WizardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .code-badge {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 0.7rem;
      font-weight: 800;
      color: #ef4444;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    h2 {
      font-size: 1.15rem;
      font-weight: 800;
      color: #ffffff;
      margin: 0;
    }

    p {
      font-size: 0.78rem;
      color: #94a3b8;
      margin: 0;
    }
  }

  .close-btn {
    background: transparent;
    border: none;
    color: #64748b;
    cursor: pointer;
    padding: 4px;
    border-radius: 6px;

    &:hover {
      color: #ffffff;
      background: rgba(255, 255, 255, 0.05);
    }
  }
`;

export const StepProgressBar = styled.div`
  display: flex;
  gap: 6px;
  padding: 12px 24px;
  background: rgba(15, 23, 42, 0.6);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
`;

export const StepPill = styled.div<{ $active: boolean; $completed: boolean }>`
  flex: 1;
  height: 4px;
  border-radius: 999px;
  background: ${({ $completed, $active }) =>
    $completed ? '#10B981' : $active ? '#EF4444' : 'rgba(255, 255, 255, 0.1)'};
  transition: all 0.2s ease;
`;

export const WizardBody = styled.div`
  padding: 24px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;

  label {
    font-size: 0.72rem;
    font-weight: 800;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  input,
  select {
    width: 100%;
    padding: 10px 14px;
    background: #0f172a;
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-radius: 8px;
    color: #ffffff;
    font-size: 0.88rem;
    font-weight: 600;
    outline: none;
    transition: border-color 0.15s ease;

    &:focus {
      border-color: #ef4444;
    }
  }
`;

export const WizardFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: #070d18;
`;
